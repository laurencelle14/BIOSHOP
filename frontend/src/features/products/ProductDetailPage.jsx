import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Leaf, ArrowLeft, Star, Package } from 'lucide-react'
import api from '../../services/api'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}/`)
        setProduct(response.data)
      } catch {
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug, navigate])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F4E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #E8DFC8',
        borderTop: '3px solid #C9A84C',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!product) return null

  const images = product.image || []

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Bouton retour */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>
        <button
          onClick={() => navigate('/products')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: '1.5px solid #E8DFC8',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#8B7355',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </button>
      </div>

      {/* Contenu principal */}
      <div className="fade-in" style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>

        {/* Colonne gauche — Image */}
        <div>
          <div style={{
            backgroundColor: '#FEFEFE',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #F0EBD8'
          }}>
            {images.length > 0 ? (
              <img
                src={`http://localhost:8000${images[activeImage]?.image}`}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Leaf size={80} color="#E8DFC8" />
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: i === activeImage ? '2px solid #C9A84C' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <img
                    src={`http://localhost:8000${img.image}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite — Infos */}
        <div className="fade-in-up">

          {/* Catégorie + badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {product.category && (
              <span style={{
                fontSize: '12px',
                color: '#8B7355',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                backgroundColor: '#F0EBD8',
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                {product.category.name}
              </span>
            )}
            {product.is_bio && (
              <span style={{
                fontSize: '12px',
                color: 'white',
                backgroundColor: '#4A7C59',
                padding: '4px 12px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600'
              }}>
                <Leaf size={11} /> BIO
              </span>
            )}
            {product.certification_label && (
              <span style={{
                fontSize: '12px',
                color: '#C9A84C',
                backgroundColor: 'rgba(201,168,76,0.1)',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(201,168,76,0.3)'
              }}>
                {product.certification_label}
              </span>
            )}
          </div>

          {/* Nom */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            color: '#2A2A2A',
            fontWeight: '400',
            marginBottom: '1rem',
            lineHeight: 1.3
          }}>
            {product.name}
          </h1>

          {/* Prix */}
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#C9A84C',
            fontFamily: 'Georgia, serif',
            marginBottom: '1.5rem'
          }}>
            {product.price} €
          </div>

          {/* Description */}
          <p style={{
            color: '#6B5B45',
            fontSize: '15px',
            lineHeight: 1.8,
            marginBottom: '2rem'
          }}>
            {product.description}
          </p>

          {/* Stock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2rem'
          }}>
            <Package size={16} color={product.stock > 0 ? '#4A7C59' : '#DC2626'} />
            <span style={{
              fontSize: '14px',
              color: product.stock > 0 ? '#4A7C59' : '#DC2626',
              fontWeight: '500'
            }}>
              {product.stock > 0 ? `En stock — ${product.stock} disponibles` : 'Rupture de stock'}
            </span>
          </div>

          {/* Quantité + Ajouter au panier */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>

              {/* Sélecteur quantité */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #E8DFC8',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#FEFEFE'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#8B7355'
                  }}
                >
                  −
                </button>
                <span style={{
                  padding: '10px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#3A3A3A',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#8B7355'
                  }}
                >
                  +
                </button>
              </div>

              {/* Bouton panier */}
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: added ? '#4A7C59' : '#2A2A2A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <ShoppingCart size={18} />
                {added ? 'Ajouté ✓' : 'Ajouter au panier'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section avis */}
      <div style={{
        maxWidth: '1100px',
        margin: '2rem auto',
        padding: '0 2rem 4rem'
      }}>
        <div style={{
          backgroundColor: '#FEFEFE',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid #F0EBD8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Star size={20} color="#C9A84C" />
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              color: '#3A3A3A',
              fontWeight: '400',
              margin: 0
            }}>
              Avis clients
            </h2>
          </div>
          <p style={{ color: '#8B7355', fontSize: '14px', fontStyle: 'italic' }}>
            Aucun avis pour ce produit pour le moment. Soyez le premier à donner votre avis !
          </p>
        </div>
      </div>

    </div>
  )
}