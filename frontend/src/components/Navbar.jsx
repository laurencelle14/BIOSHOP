import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogOut, LogIn, UserPlus, Leaf, Package, Menu, X, User, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isAuthenticated, isStaff, logout } = useAuthStore()
  const totalItems = useCartStore((state) => state.totalItems())
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .navbar-container { animation: fadeInDown 0.4s ease; }
        .nav-link { transition: color 0.2s ease, transform 0.2s ease; }
        .nav-link:hover { color: #4A7C59 !important; transform: translateY(-1px); }
        .btn-primary { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(74,124,89,0.35); background-color: #3d6b4a !important; }
        .btn-gold { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,168,76,0.35); background-color: #b8963e !important; }
        .btn-outline { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-outline:hover { background-color: #f0f7f3 !important; transform: translateY(-2px); }
        .cart-icon { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .cart-icon:hover { transform: scale(1.15) translateY(-2px); color: #4A7C59; }
        .logo-link { transition: transform 0.25s ease; }
        .logo-link:hover { transform: scale(1.03); }
        .cart-badge { animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .mobile-menu { animation: slideDown 0.3s ease; }
        .hamburger-btn { transition: all 0.2s ease; }
        .hamburger-btn:hover { transform: scale(1.1); }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      <nav className="navbar-container" style={{
        backgroundColor: 'rgba(254,254,254,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8DFC8',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
      }}>

        {/* Logo */}
        <Link to="/" className="logo-link" onClick={closeMenu} style={{
          display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none'
        }}>
          <img src={logo} alt="Body's Caprice" translate='no' style={{
            height: '46px', width: '46px', borderRadius: '50%',
            objectFit: 'cover', boxShadow: '0 2px 8px rgba(201,168,76,0.3)'
          }} />
          <div style={{ lineHeight: 1.2 }}>
            <div translate='no' style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#C9A84C', fontWeight: '600' }}>
              {"Body's Caprice"}
            </div>
            <div translate='no' style={{ fontSize: '9px', color: '#8B7355', letterSpacing: '2px', textTransform: 'uppercase' }}>
              By E.M.A
            </div>
          </div>
        </Link>

        {/* Navigation desktop */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/products" className="nav-link" style={{
            color: '#4A4A4A', textDecoration: 'none', fontSize: '14px',
            fontWeight: '500', letterSpacing: '0.5px', display: 'flex',
            alignItems: 'center', gap: '6px'
          }}>
            <Leaf size={15} color="#4A7C59" />
            Nos Produits
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className="nav-link" style={{
              color: '#4A4A4A', textDecoration: 'none', fontSize: '14px',
              fontWeight: '500', letterSpacing: '0.5px', display: 'flex',
              alignItems: 'center', gap: '6px'
            }}>
              <Package size={15} color="#C9A84C" />
              Mes Commandes
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/profile" className="nav-link" style={{
              color: '#4A4A4A', textDecoration: 'none', fontSize: '14px',
              fontWeight: '500', letterSpacing: '0.5px', display: 'flex',
              alignItems: 'center', gap: '6px'
            }}>
              <User size={15} color="#8B7355" />
              Mon Profil
            </Link>
          )}

          {isAuthenticated && isStaff && (
            <Link to="/admin" className="nav-link" style={{
              color: '#C9A84C', textDecoration: 'none', fontSize: '14px',
              fontWeight: '600', letterSpacing: '0.5px', display: 'flex',
              alignItems: 'center', gap: '6px'
            }}>
              <LayoutDashboard size={15} color="#C9A84C" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Panier */}
          <Link to="/cart" className="cart-icon" onClick={closeMenu} style={{
            position: 'relative', textDecoration: 'none',
            color: '#4A4A4A', display: 'flex', alignItems: 'center'
          }}>
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="cart-badge" style={{
                position: 'absolute', top: '-8px', right: '-8px',
                backgroundColor: '#C9A84C', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '11px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth desktop */}
          <div className="desktop-auth">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-primary" style={{
                backgroundColor: '#4A7C59', color: 'white', border: 'none',
                padding: '9px 20px', borderRadius: '25px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '500', display: 'flex',
                alignItems: 'center', gap: '8px'
              }}>
                <LogOut size={15} />
                Déconnexion
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" className="btn-outline" translate='no' style={{
                  color: '#4A7C59', textDecoration: 'none', padding: '9px 20px',
                  borderRadius: '25px', border: '1.5px solid #4A7C59',
                  fontSize: '14px', fontWeight: '500', display: 'flex',
                  alignItems: 'center', gap: '6px'
                }}>
                  <LogIn size={15} />
                  Connexion
                </Link>
                <Link to="/register" className="btn-gold" translate='no' style={{
                  backgroundColor: '#C9A84C', color: 'white', textDecoration: 'none',
                  padding: '9px 20px', borderRadius: '25px', fontSize: '14px',
                  fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <UserPlus size={15} />
                  {"S'inscrire"}
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="hamburger hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4A4A4A', display: 'flex', alignItems: 'center', padding: '4px'
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: '70px', left: 0, right: 0,
          backgroundColor: 'rgba(254,254,254,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E8DFC8', padding: '1.5rem', zIndex: 99,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex',
          flexDirection: 'column', gap: '0.5rem'
        }}>

          <Link to="/products" onClick={closeMenu} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
            color: '#3A3A3A', fontSize: '15px', fontWeight: '500', backgroundColor: '#F8F4E9'
          }}>
            <Leaf size={18} color="#4A7C59" />
            Nos Produits
          </Link>

          {isAuthenticated && (
            <Link to="/orders" onClick={closeMenu} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
              color: '#3A3A3A', fontSize: '15px', fontWeight: '500', backgroundColor: '#F8F4E9'
            }}>
              <Package size={18} color="#C9A84C" />
              Mes Commandes
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/profile" onClick={closeMenu} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
              color: '#3A3A3A', fontSize: '15px', fontWeight: '500', backgroundColor: '#F8F4E9'
            }}>
              <User size={18} color="#8B7355" />
              Mon Profil
            </Link>
          )}

          {isAuthenticated && isStaff && (
            <Link to="/admin" onClick={closeMenu} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
              color: '#C9A84C', fontSize: '15px', fontWeight: '600',
              backgroundColor: '#FDF8ED', border: '1.5px solid #E8DFC8'
            }}>
              <LayoutDashboard size={18} color="#C9A84C" />
              Dashboard
            </Link>
          )}

          <div style={{ height: '1px', backgroundColor: '#E8DFC8', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px',
              backgroundColor: '#4A7C59', color: 'white',
              border: 'none', cursor: 'pointer', fontSize: '15px',
              fontWeight: '500', width: '100%'
            }}>
              <LogOut size={18} />
              Déconnexion
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/login" onClick={closeMenu} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px 16px', borderRadius: '12px',
                textDecoration: 'none', color: '#4A7C59', fontSize: '15px',
                fontWeight: '500', border: '1.5px solid #4A7C59', backgroundColor: 'transparent'
              }}>
                <LogIn size={18} />
                Connexion
              </Link>
              <Link to="/register" onClick={closeMenu} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px 16px', borderRadius: '12px',
                textDecoration: 'none', color: 'white', fontSize: '15px',
                fontWeight: '500', backgroundColor: '#C9A84C'
              }}>
                <UserPlus size={18} />
                {"S'inscrire"}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}