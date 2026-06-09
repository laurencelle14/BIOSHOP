import { Link } from 'react-router-dom'
import { CheckCircle, Leaf, ShoppingBag } from 'lucide-react'
import logo from '../../assets/logo.png'

export default function OrderSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F4E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="fade-in-up" style={{
        backgroundColor: '#FEFEFE',
        borderRadius: '24px',
        padding: '3.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid #F0EBD8',
        textAlign: 'center'
      }}>

        {/* Icône succès */}
        <div style={{ marginBottom: '1.5rem' }}>
          <CheckCircle
            size={72}
            color="#4A7C59"
            strokeWidth={1.5}
            style={{ margin: '0 auto' }}
          />
        </div>

        {/* Logo */}
        <img src={logo} alt="Body's Caprice" style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(201,168,76,0.25)'
        }} />

        {/* Titre */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          color: '#C9A84C',
          fontSize: '28px',
          fontWeight: '400',
          margin: '0 0 8px'
        }}>
          Commande confirmée !
        </h1>

        <p style={{
          color: '#8B7355',
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>
          {"Body's Caprice by E.M.A"}
        </p>

        {/* Message */}
        <p style={{
          color: '#6B5B45',
          fontSize: '15px',
          lineHeight: 1.8,
          marginBottom: '2rem',
          fontStyle: 'italic'
        }}>
          Merci pour votre commande ! Nous la préparons avec soin et vous tiendrons informée de son avancement.
        </p>

        {/* Séparateur */}
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: '#E8DFC8',
          margin: '0 auto 2rem'
        }} />

        {/* Info livraison */}
        <div style={{
          backgroundColor: '#F8F4E9',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Leaf size={18} color="#4A7C59" />
          <p style={{
            fontSize: '13px',
            color: '#6B5B45',
            margin: 0,
            textAlign: 'left',
            lineHeight: 1.6
          }}>
            Vous recevrez un email de confirmation avec les détails de votre livraison.
          </p>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to="/products"
            className="btn-primary"
            style={{
              backgroundColor: '#4A7C59',
              color: 'white',
              textDecoration: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={18} />
            Continuer mes achats
          </Link>

          <Link
            to="/"
            style={{
              color: '#8B7355',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '10px'
            }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}