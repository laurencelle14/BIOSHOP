import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp, Leaf } from 'lucide-react'
import api from '../../services/api'

const statusColors = {
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'En attente' },
  confirmed: { bg: '#DBEAFE', color: '#2563EB', label: 'Confirmée' },
  shipped: { bg: '#E0E7FF', color: '#7C3AED', label: 'Expédiée' },
  delivered: { bg: '#D1FAE5', color: '#059669', label: 'Livrée' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulée' },
}

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
            fontFamily: 'Georgia, serif',
            color: '#C9A84C',
            fontSize: '32px',
            fontWeight: '400',
            margin: 0
          }}>
            Mes Commandes
          </h1>
        </div>
        <p style={{ color: '#8B7355', fontSize: '14px', marginTop: '6px', fontStyle: 'italic' }}>
          Historique de vos commandes
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '3px solid #E8DFC8',
              borderTop: '3px solid #C9A84C',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Chargement...
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <Leaf size={48} color="#E8DFC8" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '16px' }}>Aucune commande pour le moment</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const statusInfo = statusColors[order.status] || statusColors.pending
              const isExpanded = expanded === order.id

              return (
                <div key={order.id} style={{
                  backgroundColor: '#FEFEFE',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #F0EBD8'
                }}>
                  {/* Header commande */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Package size={18} color="#8B7355" />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#3A3A3A', margin: 0 }}>
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
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '20px'
                      }}>
                        {statusInfo.label}
                      </span>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#C9A84C',
                        fontFamily: 'Georgia, serif'
                      }}>
                        {parseFloat(order.total).toFixed(2)} €
                      </span>
                      {isExpanded ? <ChevronUp size={18} color="#8B7355" /> : <ChevronDown size={18} color="#8B7355" />}
                    </div>
                  </button>

                  {/* Détails commande */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid #F0EBD8',
                      padding: '1.25rem 1.5rem',
                      backgroundColor: '#FAFAF8'
                    }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#4A4A4A', marginBottom: '0.75rem' }}>
                        Articles commandés
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.order_items?.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            color: '#6B5B45'
                          }}>
                            <span>Produit #{item.product} × {item.quantity}</span>
                            <span style={{ fontWeight: '600' }}>
                              {(item.price_at_purchase * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
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