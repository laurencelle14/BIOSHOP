import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogOut, LogIn, UserPlus, Leaf, Package } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()
  const totalItems = useCartStore((state) => state.totalItems())
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .navbar-container { animation: fadeInDown 0.4s ease; }
        .nav-link { transition: color 0.2s ease, transform 0.2s ease; }
        .nav-link:hover { color: #4A7C59 !important; transform: translateY(-1px); }
        .btn-primary { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(74,124,89,0.35); background-color: #3d6b4a !important; }
        .btn-primary:active { transform: translateY(0px); }
        .btn-gold { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,168,76,0.35); background-color: #b8963e !important; }
        .btn-gold:active { transform: translateY(0px); }
        .btn-outline { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-outline:hover { background-color: #f0f7f3 !important; transform: translateY(-2px); }
        .cart-icon { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .cart-icon:hover { transform: scale(1.15) translateY(-2px); color: #4A7C59; }
        .logo-link { transition: transform 0.25s ease; }
        .logo-link:hover { transform: scale(1.03); }
        .cart-badge { animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <nav className="navbar-container" style={{
        backgroundColor: 'rgba(254,254,254,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8DFC8',
        padding: '0 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
      }}>

        {/* Logo */}
        <Link to="/" className="logo-link" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <img src={logo} alt="Body's Caprice" style={{
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(201,168,76,0.3)'
          }} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              color: '#C9A84C',
              fontWeight: '600'
            }}>
              {"Body's Caprice"}
            </div>
            <div style={{
              fontSize: '9px',
              color: '#8B7355',
              letterSpacing: '2.5px',
              textTransform: 'uppercase'
            }}>
              By E.M.A
            </div>
          </div>
        </Link>

        {/* Navigation centrale */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/products" className="nav-link" style={{
            color: '#4A4A4A',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Leaf size={15} color="#4A7C59" />
            Nos Produits
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className="nav-link" style={{
              color: '#4A4A4A',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Package size={15} color="#C9A84C" />
              Mes Commandes
            </Link>
          )}
        </div>

        {/* Actions droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Panier */}
          <Link to="/cart" className="cart-icon" style={{
            position: 'relative',
            textDecoration: 'none',
            color: '#4A4A4A',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="cart-badge" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#C9A84C',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-primary" style={{
              backgroundColor: '#4A7C59',
              color: 'white',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <LogOut size={15} />
              Déconnexion
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn-outline" style={{
                color: '#4A7C59',
                textDecoration: 'none',
                padding: '9px 20px',
                borderRadius: '25px',
                border: '1.5px solid #4A7C59',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <LogIn size={15} />
                Connexion
              </Link>
              <Link to="/register" className="btn-gold" style={{
                backgroundColor: '#C9A84C',
                color: 'white',
                textDecoration: 'none',
                padding: '9px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <UserPlus size={15} />
                {"S'inscrire"}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}