import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ArrowLeft, Leaf, Shield } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import useCartStore from '../../store/cartStore'
import api from '../../services/api'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const cardElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: '#3A3A3A',
      fontFamily: 'Georgia, serif',
      '::placeholder': { color: '#A89880' }
    },
    invalid: { color: '#DC2626' }
  },
  hidePostalCode: true
}

function PaymentForm({ address, items, totalPrice, clearCart }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    try {
      const orderRes = await api.post('/orders/orders/', {
        address,
        items_write: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price
        })),
        total: totalPrice()
      })

      const intentRes = await api.post('/payments/create-intent/', {
        order_id: orderRes.data.id
      })

      const { client_secret } = intentRes.data

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        navigate('/order-success')
        setTimeout(() => clearCart(), 100)
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        backgroundColor: '#FEFEFE',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #F0EBD8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
          <CreditCard size={16} color="#C9A84C" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#3A3A3A' }}>
            Informations de paiement
          </span>
        </div>

        <div style={{
          padding: '14px 16px',
          borderRadius: '12px',
          border: '1.5px solid #E8DFC8',
          backgroundColor: '#F8F4E9',
          overflowX: 'hidden',
          minHeight: '50px',
        }}>
          <CardElement options={cardElementOptions} />
        </div>

        <p style={{ fontSize: '12px', color: '#A89880', marginTop: '8px', fontStyle: 'italic' }}>
          Carte test : 4242 4242 4242 4242 — exp: 12/29 — cvc: 123
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          padding: '12px 16px',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !stripe}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#D4B86A' : '#C9A84C',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Shield size={18} />
        {loading ? 'Traitement...' : `Payer ${totalPrice().toFixed(2)} €`}
      </button>
    </div>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [address, setAddress] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: "Côte d'Ivoire"
  })

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E8DFC8',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#F8F4E9',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: '6px'
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    setStep(2)
    window.scrollTo(0, 0)
  }

  if (items.length === 0) {
    navigate('/products')
    return null
  }

  return (
    <Elements stripe={stripePromise}>
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
            margin: '0 0 1.5rem'
          }}>
            Finaliser ma commande
          </h1>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: step >= 1 ? '#4A7C59' : '#E8DFC8',
                color: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px', fontWeight: '600'
              }}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span style={{ fontSize: '14px', fontWeight: step === 1 ? '600' : '400', color: step >= 1 ? '#4A7C59' : '#A89880' }}>
                Adresse
              </span>
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: step >= 2 ? '#4A7C59' : '#E8DFC8', margin: '0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: step >= 2 ? '#4A7C59' : '#E8DFC8',
                color: step >= 2 ? 'white' : '#A89880', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600'
              }}>
                2
              </div>
              <span style={{ fontSize: '14px', fontWeight: step === 2 ? '600' : '400', color: step >= 2 ? '#4A7C59' : '#A89880' }}>
                Paiement
              </span>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '900px', margin: '0 auto', padding: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem', alignItems: 'start'
        }}>

          <div className="fade-in-up">

            {/* Step 1 — Adresse */}
            {step === 1 && (
              <div style={{
                backgroundColor: '#FEFEFE', borderRadius: '20px', padding: '2rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F0EBD8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                  <MapPin size={20} color="#C9A84C" />
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3A3A3A', fontWeight: '400', margin: 0 }}>
                    Adresse de livraison
                  </h2>
                </div>

                <form onSubmit={handleAddressSubmit}>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>Rue / Adresse complète</label>
                    <input type="text" value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      placeholder="123 Rue des Cocotiers, Cocody" required style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={labelStyle}>Ville</label>
                      <input type="text" value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        placeholder="Abidjan" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Code postal</label>
                      <input type="text" value={address.postal_code}
                        onChange={e => setAddress({ ...address, postal_code: e.target.value })}
                        placeholder="01 BP 0000" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Pays</label>
                    <input type="text" value={address.country}
                      onChange={e => setAddress({ ...address, country: e.target.value })} style={inputStyle} />
                  </div>
                  <button type="submit" style={{
                    width: '100%', padding: '14px', backgroundColor: '#4A7C59',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    Continuer vers le paiement
                  </button>
                </form>
              </div>
            )}

            {/* Step 2 — Paiement */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => setStep(1)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', color: '#8B7355', padding: 0, width: 'fit-content'
                }}>
                  <ArrowLeft size={16} />
                  Modifier l'adresse
                </button>

                {/* Récap adresse */}
                <div style={{
                  backgroundColor: '#FEFEFE', borderRadius: '16px', padding: '1.5rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F0EBD8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                    <MapPin size={16} color="#4A7C59" />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#3A3A3A' }}>Livraison à</span>
                  </div>
                  <p style={{ color: '#6B5B45', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {address.street}<br />{address.postal_code} {address.city}<br />{address.country}
                  </p>
                </div>

                <PaymentForm
                  address={address}
                  items={items}
                  totalPrice={totalPrice}
                  clearCart={clearCart}
                />
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="fade-in-up" style={{
            backgroundColor: '#FEFEFE', borderRadius: '20px', padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #F0EBD8',
            position: 'sticky', top: '90px'
          }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#3A3A3A', fontWeight: '400', marginBottom: '1.2rem' }}>
              Ma commande
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.2rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      backgroundColor: '#F8F4E9', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                    }}>
                      {item.image && item.image.length > 0 ? (
                        <img src={`http://localhost:8000${item.image[0].image}`} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Leaf size={16} color="#E8DFC8" />
                      )}
                    </div>
                    <span style={{ color: '#4A4A4A' }}>
                      {item.name} <span style={{ color: '#8B7355' }}>×{item.quantity}</span>
                    </span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#3A3A3A' }}>
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #E8DFC8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#3A3A3A' }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
                {totalPrice().toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  )
}