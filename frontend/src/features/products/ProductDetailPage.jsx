import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Leaf, ArrowLeft, Star, Package } from 'lucide-react'
import api from '../../services/api'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={20}
          fill={(hovered || value) >= star ? '#C9A84C' : 'none'}
          color={(hovered || value) >= star ? '#C9A84C' : '#E8DFC8'}
          style={{ cursor: readOnly ? 'default' : 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
        />
      ))}
    </div>
  )
}

function ReviewSection({ productSlug, productId }) {
  const { isAuthenticated } = useAuthStore()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/reviews/?product_slug=${productSlug}`)
        setReviews(response.data)
      } catch {
        console.error('Erreur chargement avis')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [productSlug, success])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/reviews/reviews/', {
        product: productId,
        rating,
        comment
      })
      setSuccess(true)
      setComment('')
      setRating(5)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Vous avez déjà laissé un avis ou une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{
      backgroundColor: '#FEFEFE',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      border: '1px solid #F0EBD8'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Star size={20} color="#C9A84C" fill="#C9A84C" />
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#3A3A3A',
            fontWeight: '400',
            margin: 0
          }}>
            Avis clients
          </h2>
          <span style={{ fontSize: '14px', color: '#8B7355' }}>({reviews.length})</span>
        </div>
        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating value={Math.round(avgRating)} readOnly />
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#C9A84C',
              fontFamily: 'Georgia, serif'
            }}>
              {avgRating}/5
            </span>
          </div>
        )}
      </div>

      {/* Formulaire avis */}
      {isAuthenticated ? (
        <div style={{
          backgroundColor: '#F8F4E9',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #E8DFC8'
        }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#3A3A3A',
            fontWeight: '400',
            marginBottom: '1rem'
          }}>
            Laisser un avis
          </h3>

          {success && (
            <div style={{
              backgroundColor: '#D1FAE5',
              color: '#059669',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              marginBottom: '1rem'
            }}>
              Votre avis a été publié ! ✓
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4A4A4A',
                marginBottom: '8px'
              }}>
                Note
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4A4A4A',
                marginBottom: '6px'
              }}>
                Commentaire
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #E8DFC8',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FEFEFE',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                backgroundColor: submitting ? '#D4B86A' : '#C9A84C',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Publication...' : 'Publier mon avis'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#F8F4E9',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          fontSize: '14px',
          color: '#8B7355',
          fontStyle: 'italic'
        }}>
          {"Connectez-vous pour laisser un avis sur ce produit."}
        </div>
      )}

      {/* Liste avis */}
      {loading ? (
        <p style={{ color: '#8B7355', fontSize: '14px' }}>Chargement des avis...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: '#8B7355', fontSize: '14px', fontStyle: 'italic' }}>
          Aucun avis pour ce produit. Soyez le premier à donner votre avis !
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              borderTop: '1px solid #F0EBD8',
              paddingTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#4A7C59',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {(review.user?.first_name || review.user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#3A3A3A', margin: 0 }}>
                      {review.user?.first_name || review.user?.username}
                    </p>
                    <p style={{ fontSize: '12px', color: '#A89880', margin: 0 }}>
                      {new Date(review.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readOnly />
              </div>
              <p style={{
                fontSize: '14px',
                color: '#6B5B45',
                lineHeight: 1.7,
                margin: 0
              }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
        gap: '3rem',
        alignItems: 'start'
      }}>

        {/* Image */}
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

        {/* Infos */}
        <div className="fade-in-up">

          {/* Badges */}
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
            marginBottom: '1.5rem',
            whiteSpace: 'nowrap'
          }}>
            {product.price} fcfa
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

          {/* Quantité + Panier */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem 4rem' }}>
        <ReviewSection productSlug={slug} productId={product.id} />
      </div>

    </div>
  )
}