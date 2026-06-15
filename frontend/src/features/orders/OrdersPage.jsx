import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp, Leaf, Clock, CheckCircle, Truck, Star, XCircle } from 'lucide-react'
import api from '../../services/api'

const statusConfig = {
  pending:   { bg: '#FEF3C7', color: '#D97706', label: 'En attente',  icon: <Clock size={14} />,        step: 1 },
  confirmed: { bg: '#DBEAFE', color: '#2563EB', label: 'Confirmée',   icon: <CheckCircle size={14} />,  step: 2 },
  shipped:   { bg: '#E0E7FF', color: '#7C3AED', label: 'Expédiée',    icon: <Truck size={14} />,        step: 3 },
  delivered: { bg: '#D1FAE5', color: '#059669', label: 'Livrée',      icon: <Star size={14} />,         step: 4 },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulée',     icon: <XCircle size={14} />,      step: 0 },
}

const timelineSteps = [
  { key: 'pending',   label: 'En attente',  icon: Clock },
  { key: 'confirmed', label: 'Confirmée',   icon: CheckCircle },
  { key: 'shipped',   label: 'Expédiée',    icon: Truck },
  { key: 'delivered', label: 'Livrée',      icon: Star },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/orders/')
        setOrders(response.data)
      } catch {
        console.error('Erreur chargement commandes')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Header */}
      <div className="fade-in" style={{
        background: 'linear-gradient(135deg, #F8F4E9, #EEE8D5)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #E8DFC8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Package size={24} color="#C9A84C" />
          <h1 style={{
            fontFamily: 'Georgia, serif', color: '#C9A84C',
            fontSize: '32px', fontWeight: '400', margin: 0
          }}>
            Mes Commandes
          </h1>
        </div>
        <p style={{ color: '#8B7355', fontSize: '14px', marginTop: '6px', fontStyle: 'italic' }}>
          Historique et suivi de vos commandes
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #E8DFC8',
              borderTop: '3px solid #C9A84C', borderRadius: '50%',
              margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Chargement...
          </div>
        )}

        {/* Vide */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <Leaf size={48} color="#E8DFC8" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '16px' }}>Aucune commande pour le moment</p>
          </div>
        )}

        {/* Liste commandes */}
        {!loading && orders.length > 0 && (
          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(order => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending
              const isExpanded = expanded === order.id
              const isCancelled = order.status === 'cancelled'
              const currentStep = statusInfo.step

              return (
                <div key={order.id} style={{
                  backgroundColor: '#FEFEFE', borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F0EBD8',
                  transition: 'box-shadow 0.2s'
                }}>

                  {/* Header commande */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    style={{
                      width: '100%', padding: '1.25rem 1.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        backgroundColor: statusInfo.bg, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: statusInfo.color, flexShrink: 0
                      }}>
                        <Package size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#3A3A3A', margin: 0 }}>
                          Commande #{order.id}
                        </p>
                        <p style={{ fontSize: '12px', color: '#8B7355', margin: '2px 0 0' }}>
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        backgroundColor: statusInfo.bg, color: statusInfo.color,
                        fontSize: '12px', fontWeight: '600', padding: '4px 12px',
                        borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      <span style={{
                        fontSize: '17px', fontWeight: '700', color: '#C9A84C',
                        fontFamily: 'Georgia, serif', whiteSpace: 'nowrap'
                      }}>
                        {parseFloat(order.total).toFixed(2)} fcfa
                      </span>
                      {isExpanded
                        ? <ChevronUp size={18} color="#8B7355" />
                        : <ChevronDown size={18} color="#8B7355" />
                      }
                    </div>
                  </button>

                  {/* Détails */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #F0EBD8', backgroundColor: '#FAFAF8' }}>

                      {/* Timeline suivi */}
                      {!isCancelled && (
                        <div style={{ padding: '1.5rem 1.5rem 0' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#8B7355', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>
                            Suivi de commande
                          </p>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: '1.5rem', position: 'relative' }}>
                            {timelineSteps.map((step, index) => {
                              const isActive = order.status === step.key
                              const StepIcon = step.icon

                              // calcule step number pour comparaison
                              const stepNum = statusConfig[step.key]?.step || 0
                              const isCompleted = currentStep > stepNum

                              return (
                                <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                  {/* Ligne entre étapes */}
                                  {index < timelineSteps.length - 1 && (
                                    <div style={{
                                      position: 'absolute', top: '16px', left: '50%', width: '100%',
                                      height: '2px', zIndex: 0,
                                      backgroundColor: isCompleted ? '#4A7C59' : '#E8DFC8',
                                      transition: 'background-color 0.3s'
                                    }} />
                                  )}

                                  {/* Cercle */}
                                  <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', zIndex: 1,
                                    backgroundColor: isActive ? '#C9A84C' : isCompleted ? '#4A7C59' : '#E8DFC8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: isActive || isCompleted ? 'white' : '#8B7355',
                                    boxShadow: isActive ? '0 0 0 4px rgba(201,168,76,0.2)' : 'none',
                                    transition: 'all 0.3s', marginBottom: '8px', flexShrink: 0
                                  }}>
                                    {isCompleted
                                      ? <CheckCircle size={16} />
                                      : <StepIcon size={14} />
                                    }
                                  </div>

                                  {/* Label */}
                                  <p style={{
                                    fontSize: '10px', textAlign: 'center', margin: 0,
                                    fontWeight: isActive ? '700' : '400',
                                    color: isActive ? '#C9A84C' : isCompleted ? '#4A7C59' : '#8B7355'
                                  }}>
                                    {step.label}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Commande annulée */}
                      {isCancelled && (
                        <div style={{
                          margin: '1.25rem 1.5rem 0', padding: '1rem', borderRadius: '12px',
                          backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          <XCircle size={18} color="#DC2626" />
                          <p style={{ fontSize: '14px', color: '#DC2626', fontWeight: '500', margin: 0 }}>
                            Cette commande a été annulée.
                          </p>
                        </div>
                      )}

                      {/* Articles */}
                      <div style={{ padding: '1.25rem 1.5rem' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#8B7355', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                          Articles
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{
                              display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', padding: '10px 14px',
                              backgroundColor: '#FEFEFE', borderRadius: '10px',
                              border: '1px solid #F0EBD8'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '8px',
                                  backgroundColor: '#F8F4E9', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <Leaf size={14} color="#C9A84C" />
                                </div>
                                <div>
                                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#3A3A3A', margin: 0 }}>
                                    {item.product_name || `Produit #${item.product}`}
                                  </p>
                                  <p style={{ fontSize: '12px', color: '#8B7355', margin: 0 }}>
                                    Qté : {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
                                {(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)} fcfa
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F0EBD8'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#4A4A4A' }}>Total</span>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
                            {parseFloat(order.total).toFixed(2)} fcfa
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
