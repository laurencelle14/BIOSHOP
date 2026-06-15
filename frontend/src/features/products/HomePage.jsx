import { Link } from 'react-router-dom'
import { Leaf, ArrowRight, ShieldCheck, Truck, Heart } from 'lucide-react'
import logo from '../../assets/logo.png'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Hero Section */}
      <section className="fade-in" style={{
        background: 'linear-gradient(135deg, #F8F4E9 0%, #EEE8D5 50%, #F0EBD8 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: 'rgba(201, 168, 76, 0.08)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'rgba(74, 124, 89, 0.08)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div className="fade-in-up" style={{ marginBottom: '2rem' }}>
          <img src={logo} alt="Body's Caprice" style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
            border: '4px solid rgba(201,168,76,0.2)'
          }} />
        </div>

        {/* Titre */}
        <div className="fade-in-up">
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#C9A84C',
            margin: '0 0 8px',
            fontWeight: '400',
            letterSpacing: '-0.5px'
          }}>
            {"Body's Caprice"}
          </h1>
          <p style={{
            fontSize: '11px',
            color: '#8B7355',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            By E.M.A
          </p>
          <p style={{
            fontSize: '18px',
            color: '#6B5B45',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            fontStyle: 'italic'
          }}>
            Des produits bio soigneusement sélectionnés pour prendre soin de votre corps et de votre bien-être.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="fade-in-up" style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/products" style={{
            backgroundColor: '#4A7C59',
            color: 'white',
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: '30px',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(74,124,89,0.3)',
            transition: 'all 0.25s ease'
          }}
          className="btn-primary"
          >
            <Leaf size={18} />
            Découvrir nos produits
          </Link>
          <Link to="/register" style={{
            backgroundColor: 'transparent',
            color: '#C9A84C',
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: '30px',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid #C9A84C',
            transition: 'all 0.25s ease'
          }}
          className="btn-gold-outline"
          >
            {"Rejoindre la communauté"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <h2 className="fade-in-up" style={{
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          color: '#4A4A4A',
          fontSize: '28px',
          fontWeight: '400',
          marginBottom: '3rem'
        }}>
          Pourquoi nous choisir ?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>

          {[
            {
              icon: <Leaf size={32} color="#4A7C59" />,
              title: '100% Bio & Naturel',
              desc: 'Tous nos produits sont certifiés biologiques et fabriqués avec des ingrédients naturels soigneusement sélectionnés.'
            },
            {
              icon: <ShieldCheck size={32} color="#C9A84C" />,
              title: 'Qualité Garantie',
              desc: 'Chaque produit passe par un contrôle qualité rigoureux avant de vous être livré. Votre satisfaction est notre priorité.'
            },
            {
              icon: <Truck size={32} color="#8B7355" />,
              title: 'Livraison Rapide',
              desc: 'Commandez aujourd\'hui, recevez votre colis rapidement. Livraison soignée pour préserver vos produits.'
            },
            {
              icon: <Heart size={32} color="#C9A84C" />,
              title: 'Fait avec Amour',
              desc: 'Chaque produit est sélectionné avec passion et bienveillance pour vous offrir le meilleur du naturel.'
            }
          ].map((item, index) => (
            <div key={index} className="card-hover fade-in-up" style={{
              backgroundColor: '#FEFEFE',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #F0EBD8'
            }}>
              <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                color: '#3A3A3A',
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '0.75rem'
              }}>
                {item.title}
              </h3>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                lineHeight: 1.7
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #4A7C59, #3d6b4a)',
        padding: '4rem 2rem',
        textAlign: 'center',
        margin: '2rem 0 0'
      }}>
        <h2 className="fade-in-up" style={{
          fontFamily: 'Georgia, serif',
          color: 'white',
          fontSize: '32px',
          fontWeight: '400',
          marginBottom: '1rem'
        }}>
          Prête à prendre soin de toi?
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '16px',
          marginBottom: '2rem',
          fontStyle: 'italic'
        }}>
          Découvrez notre diversité de produits
        </p>
        <Link to="/products"
          className="btn-gold"
          style={{
            backgroundColor: '#C9A84C',
            color: 'white',
            textDecoration: 'none',
            padding: '14px 36px',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
          <Leaf size={18} />
          Voir les produits
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2A2A2A',
        color: '#9A9A9A',
        padding: '2.5rem 2rem',
        textAlign: 'center'
      }}>
        <img src={logo} alt="Body's Caprice" style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem',
          opacity: 0.9
        }} />
        <p style={{
          fontFamily: 'Georgia, serif',
          color: '#C9A84C',
          fontSize: '16px',
          marginBottom: '4px'
        }}>
          {"Body's Caprice"}
        </p>
        <p style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '1rem' }}>
          BY E.M.A
        </p>
        <p style={{ fontSize: '13px', color: '#6A6A6A' }}>
          © 2026 {"Body's Caprice"}. Tous droits réservés.
        </p>
      </footer>

    </div>
  )
}
