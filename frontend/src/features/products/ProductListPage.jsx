import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Leaf, SlidersHorizontal } from 'lucide-react'
import api from '../../services/api'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/')
        setProducts(response.data)
      } catch {
        console.error('Erreur chargement produits')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get('/products/categories/')
        setCategories(response.data)
      } catch {
        console.error('Erreur chargement catégories')
      }
    }

    fetchProducts()
    fetchCategories()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory
      ? product.category?.slug === selectedCategory
      : true
    return matchSearch && matchCategory
  })

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Header */}
      <div className="fade-in" style={{
        background: 'linear-gradient(135deg, #F8F4E9, #EEE8D5)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #E8DFC8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <Leaf size={24} color="#4A7C59" />
          <h1 style={{
            fontFamily: 'Georgia, serif',
            color: '#C9A84C',
            fontSize: '36px',
            fontWeight: '400',
            margin: 0
          }}>
            Nos Produits Bio
          </h1>
        </div>
        <p style={{
          color: '#8B7355',
          fontSize: '15px',
          fontStyle: 'italic'
        }}>
          Découvrez notre sélection de produits naturels et biologiques
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Barre de recherche + Filtres */}
        <div className="fade-in-up" style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>

          {/* Recherche */}
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B7355'
            }} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                borderRadius: '12px',
                border: '1.5px solid #E8DFC8',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FEFEFE',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filtre catégorie */}
          <div style={{ position: 'relative' }}>
            <SlidersHorizontal size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B7355'
            }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px 16px 12px 36px',
                borderRadius: '12px',
                border: '1.5px solid #E8DFC8',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FEFEFE',
                color: '#4A4A4A',
                cursor: 'pointer',
                appearance: 'none',
                minWidth: '180px'
              }}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #E8DFC8',
              borderTop: '3px solid #C9A84C',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Chargement des produits...
          </div>
        )}

        {/* Grille produits */}
        {!loading && (
          <>
            <p style={{ color: '#8B7355', fontSize: '14px', marginBottom: '1.5rem' }}>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
                <Leaf size={48} color="#E8DFC8" style={{ marginBottom: '1rem' }} />
                <p style={{ fontSize: '16px' }}>Aucun produit trouvé</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredProducts.map(product => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="card-hover"
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      backgroundColor: '#FEFEFE',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      border: '1px solid #F0EBD8'
                    }}>

                      {/* Image produit */}
                      <div style={{
                        height: '200px',
                        backgroundColor: '#F8F4E9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={`http://localhost:8000${product.image[0].image}`}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Leaf size={48} color="#E8DFC8" />
                        )}

                        {product.is_bio && (
                          <span style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: '#4A7C59',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Leaf size={10} /> BIO
                          </span>
                        )}
                      </div>

                      {/* Infos produit */}
                      <div style={{ padding: '1.25rem' }}>
                        {product.category && (
                          <p style={{
                            fontSize: '11px',
                            color: '#8B7355',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            {product.category.name}
                          </p>
                        )}
                        <h3 style={{
                          fontSize: '16px',
                          fontFamily: 'Georgia, serif',
                          color: '#3A3A3A',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#8B7355',
                          lineHeight: 1.5,
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {product.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#C9A84C',
                            fontFamily: 'Georgia, serif'
                          }}>
                            {product.price} €
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: product.stock > 0 ? '#4A7C59' : '#DC2626',
                            fontWeight: '500'
                          }}>
                            {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}