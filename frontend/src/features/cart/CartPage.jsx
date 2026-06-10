import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, Leaf, ArrowLeft, ArrowRight } from 'lucide-react'
import useCartStore from '../../store/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F4E9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem'
    }}>
      <ShoppingCart size={64} color="#E8DFC8" />
      <h2 style={{
        fontFamily: 'Georgia, serif',
        color: '#8B7355',
        fontSize: '24px',
        fontWeight: '400'
      }}>
        Votre panier est vide
      </h2>
      <p style={{ color: '#A89880', fontSize: '15px', fontStyle: 'italic' }}>
        Découvrez nos produits bio et naturels
      </p>
      <Link to="/products" style={{
        backgroundColor: '#4A7C59',
        color: 'white',
        textDecoration: 'none',
        padding: '12px 28px',
        borderRadius: '25px',
        fontSize: '15px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Leaf size={16} />
        Voir les produits
      </Link>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Header */}
      <div className="fade-in" style={{
        background: 'linear-gradient(135deg, #F8F4E9, #EEE8D5)',
        padding: '2.5rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #E8DFC8'
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          color: '#C9A84C',
          fontSize: '32px',
          fontWeight: '400',
          margin: 0
        }}>
          Mon Panier
        </h1>
        <p style={{ color: '#8B7355', fontSize: '14px', marginTop: '4px' }}>
          {items.length} article{items.length > 1 ? 's' : ''}
        </p>
      </div>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>

        {/* Liste articles */}
        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#8B7355',
              padding: '0 0 0.5rem',
              width: 'fit-content'
            }}
          >
            <ArrowLeft size={16} />
            Continuer mes achats
          </button>

          {items.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#FEFEFE',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              border: '1px solid #F0EBD8'
            }}>

              {/* Image */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                backgroundColor: '#F8F4E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                {item.image && item.image.length > 0 ? (
                  <img
                    src={`http://localhost:8000${item.image[0].image}`}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Leaf size={28} color="#E8DFC8" />
                )}
              </div>

              {/* Infos */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '16px',
                  color: '#2A2A2A',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#C9A84C',
                  fontFamily: 'Georgia, serif',
                  whiteSpace: 'nowrap'
                }}>
                  {item.price} €
                </p>
              </div>

              {/* Quantité */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #E8DFC8',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#F8F4E9'
              }}>
                <button
                  onClick={() => {
                    if (item.quantity <= 1) removeItem(item.id)
                    else updateQuantity(item.id, item.quantity - 1)
                  }}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#8B7355'
                  }}
                >
                  −
                </button>
                <span style={{
                  padding: '8px 12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#3A3A3A',
                  minWidth: '36px',
                  textAlign: 'center'
                }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#8B7355'
                  }}
                >
                  +
                </button>
              </div>

              {/* Sous-total */}
              <div style={{
                minWidth: '80px',
                textAlign: 'right',
                fontSize: '16px',
                fontWeight: '700',
                color: '#3A3A3A'
              }}>
                {(item.price * item.quantity).toFixed(2)} €
              </div>

              {/* Supprimer */}
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#DC2626',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Vider le panier */}
          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#DC2626',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0',
              marginTop: '0.5rem',
              opacity: 0.8
            }}
          >
            <Trash2 size={14} />
            Vider le panier
          </button>
        </div>

        {/* Récapitulatif */}
        <div className="fade-in-up" style={{
          backgroundColor: '#FEFEFE',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid #F0EBD8',
          position: 'sticky',
          top: '90px'
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#3A3A3A',
            fontWeight: '400',
            marginBottom: '1.5rem'
          }}>
            Récapitulatif
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#6B5B45'
              }}>
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid #E8DFC8',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#3A3A3A' }}>Total</span>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#C9A84C',
              fontFamily: 'Georgia, serif'
            }}>
              {totalPrice().toFixed(2)} €
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#4A7C59',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Passer la commande
            <ArrowRight size={18} />
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#A89880',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            Paiement sécurisé via Stripe
          </p>
        </div>
      </div>
    </div>
  )
}