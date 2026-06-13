import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ShoppingBag, Plus, Edit2,
  Trash2, Leaf, X, Check, Tag, Upload, Image, ChevronDown
} from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Modal produit
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '', slug: '', description: '', price: '',
    stock: '', is_bio: false, certification_label: '',
    is_active: true, category: ''
  })
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCatDropdown, setShowCatDropdown] = useState(false)

  // Modal catégorie
  const [showCatModal, setShowCatModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', slug: '' })
  const [catImage, setCatImage] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [prodRes, orderRes, catRes] = await Promise.all([
          api.get('/products/admin/products/'),
          api.get('/orders/admin/orders/'),
          api.get('/products/categories/')
        ])
        setProducts(prodRes.data)
        setOrders(orderRes.data)
        setCategories(catRes.data)
      } catch {
        console.error('Erreur chargement dashboard')
      } finally {
        setLoading(false)
      }
    }

    const checkAdmin = async () => {
      try {
        const res = await api.get('/users/me/')
        if (!res.data.is_staff && !res.data.is_superuser) {
          navigate('/')
          return
        }
        setIsAdmin(true)
        await fetchAll()
      } catch {
        navigate('/login')
      }
    }

    checkAdmin()
  }, [navigate])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [prodRes, orderRes, catRes] = await Promise.all([
        api.get('/products/admin/products/'),
        api.get('/orders/admin/orders/'),
        api.get('/products/categories/')
      ])
      setProducts(prodRes.data)
      setOrders(orderRes.data)
      setCategories(catRes.data)
    } catch {
      console.error('Erreur chargement dashboard')
    } finally {
      setLoading(false)
    }
  }

  // ── Produits ──────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await api.delete(`/products/admin/products/${id}/`)
      setProducts(products.filter(p => p.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      is_bio: product.is_bio,
      certification_label: product.certification_label || '',
      is_active: product.is_active,
      category: product.category?.id || ''
    })
    setProductImage(null)
    setImagePreview(
      product.image && product.image.length > 0
        ? `http://localhost:8000${product.image[0].image}`
        : null
    )
    setShowCatDropdown(false)
    setShowModal(true)
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '', slug: '', description: '', price: '',
      stock: '', is_bio: false, certification_label: '',
      is_active: true, category: ''
    })
    setProductImage(null)
    setImagePreview(null)
    setShowCatDropdown(false)
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData()
      Object.entries(productForm).forEach(([key, val]) => {
        formData.append(key, val)
      })
      if (productImage) formData.append('image', productImage)

      if (editingProduct) {
        await api.put(`/products/admin/products/${editingProduct.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/products/admin/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      fetchAll()
    } catch {
      alert('Erreur lors de la sauvegarde')
    }
  }

  // ── Commandes ─────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/admin/orders/${orderId}/`, { status })
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    } catch {
      alert('Erreur lors de la mise à jour')
    }
  }

  // ── Catégories ────────────────────────────────────────
  const handleNewCat = () => {
    setEditingCat(null)
    setCatForm({ name: '', slug: '' })
    setCatImage(null)
    setShowCatModal(true)
  }

  const handleEditCat = (cat) => {
    setEditingCat(cat)
    setCatForm({ name: cat.name, slug: cat.slug })
    setCatImage(null)
    setShowCatModal(true)
  }

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return
    try {
      await api.delete(`/products/admin/categories/${id}/`)
      setCategories(categories.filter(c => c.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleSaveCat = async () => {
    try {
      const formData = new FormData()
      formData.append('name', catForm.name)
      formData.append('slug', catForm.slug)
      if (catImage) formData.append('image', catImage)

      if (editingCat) {
        await api.put(`/products/admin/categories/${editingCat.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/products/admin/categories/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowCatModal(false)
      fetchAll()
    } catch {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const selectedCatName = productForm.category
    ? categories.find(c => c.id === parseInt(productForm.category))?.name
    : null

  const statusColors = {
    pending: { bg: '#FEF3C7', color: '#D97706', label: 'En attente' },
    confirmed: { bg: '#DBEAFE', color: '#2563EB', label: 'Confirmée' },
    shipped: { bg: '#E0E7FF', color: '#7C3AED', label: 'Expédiée' },
    delivered: { bg: '#D1FAE5', color: '#059669', label: 'Livrée' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulée' },
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #E8DFC8', fontSize: '14px', outline: 'none',
    backgroundColor: '#F8F4E9', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: '500',
    color: '#4A4A4A', marginBottom: '6px'
  }

  if (!isAdmin) return null

  if (loading) return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F8F4E9',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #E8DFC8', borderTop: '3px solid #C9A84C',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2A2A2A, #3A3A3A)',
        padding: '2rem', textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif', color: '#C9A84C',
          fontSize: '28px', fontWeight: '400', margin: '0 0 4px'
        }}>
          {"Dashboard — Body's Caprice"}
        </h1>
        <p style={{ color: '#8B7355', fontSize: '13px', margin: 0 }}>
          Interface de gestion
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto'
      }}>
        {[
          { icon: <Package size={24} color="#4A7C59" />, label: 'Produits', value: products.length, bg: '#D1FAE5' },
          { icon: <Tag size={24} color="#7C3AED" />, label: 'Catégories', value: categories.length, bg: '#E0E7FF' },
          { icon: <ShoppingBag size={24} color="#C9A84C" />, label: 'Commandes', value: orders.length, bg: '#FEF3C7' },
          {
            icon: <ShoppingBag size={24} color="#DC2626" />,
            label: 'En attente',
            value: orders.filter(o => o.status === 'pending').length,
            bg: '#FEE2E2'
          },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: '#FEFEFE', borderRadius: '16px', padding: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F0EBD8'
          }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '12px',
              backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#2A2A2A', margin: 0, fontFamily: 'Georgia, serif' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', color: '#8B7355', margin: 0 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'products', label: 'Produits', icon: <Package size={16} /> },
            { id: 'categories', label: 'Catégories', icon: <Tag size={16} /> },
            { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={16} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '25px', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              backgroundColor: activeTab === tab.id ? '#2A2A2A' : '#FEFEFE',
              color: activeTab === tab.id ? 'white' : '#4A4A4A',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s ease'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Produits ── */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#3A3A3A', fontSize: '20px', fontWeight: '400', margin: 0 }}>
                Gestion des produits
              </h2>
              <button onClick={handleNewProduct} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', border: 'none',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                backgroundColor: '#4A7C59', color: 'white'
              }}>
                <Plus size={16} /> Nouveau produit
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8B7355' }}>
                  <Leaf size={40} color="#E8DFC8" />
                  <p style={{ marginTop: '1rem' }}>Aucun produit</p>
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} style={{
                    backgroundColor: '#FEFEFE', borderRadius: '16px', padding: '1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F0EBD8',
                    flexWrap: 'wrap', gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '10px',
                        backgroundColor: '#F8F4E9', overflow: 'hidden', flexShrink: 0
                      }}>
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={`http://localhost:8000${product.image[0].image}`}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={20} color="#E8DFC8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2A2A2A', margin: '0 0 4px' }}>
                          {product.name}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', color: '#C9A84C', fontWeight: '600' }}>{product.price} €</span>
                          <span style={{ fontSize: '13px', color: '#8B7355' }}>Stock: {product.stock}</span>
                          {product.category && (
                            <span style={{ fontSize: '11px', backgroundColor: '#F0EBD8', color: '#8B7355', padding: '2px 8px', borderRadius: '10px' }}>
                              {product.category.name}
                            </span>
                          )}
                          {product.is_bio && (
                            <span style={{ fontSize: '11px', backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                              BIO
                            </span>
                          )}
                          <span style={{
                            fontSize: '11px',
                            backgroundColor: product.is_active ? '#D1FAE5' : '#FEE2E2',
                            color: product.is_active ? '#059669' : '#DC2626',
                            padding: '2px 8px', borderRadius: '10px', fontWeight: '600'
                          }}>
                            {product.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditProduct(product)} style={{
                        padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #E8DFC8',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        backgroundColor: 'transparent', color: '#4A4A4A',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Edit2 size={14} /> Modifier
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} style={{
                        padding: '8px 16px', borderRadius: '10px', border: 'none',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        backgroundColor: '#FEE2E2', color: '#DC2626',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Tab Catégories ── */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#3A3A3A', fontSize: '20px', fontWeight: '400', margin: 0 }}>
                Gestion des catégories
              </h2>
              <button onClick={handleNewCat} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', border: 'none',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                backgroundColor: '#C9A84C', color: 'white'
              }}>
                <Plus size={16} /> Nouvelle catégorie
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8B7355' }}>
                  <Tag size={40} color="#E8DFC8" />
                  <p style={{ marginTop: '1rem' }}>Aucune catégorie</p>
                </div>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} style={{
                    backgroundColor: '#FEFEFE', borderRadius: '16px', padding: '1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F0EBD8',
                    flexWrap: 'wrap', gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '10px',
                        backgroundColor: '#F8F4E9', overflow: 'hidden', flexShrink: 0
                      }}>
                        {cat.image ? (
                          <img src={`http://localhost:8000${cat.image}`} alt={cat.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Tag size={18} color="#E8DFC8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2A2A2A', margin: '0 0 2px' }}>{cat.name}</p>
                        <p style={{ fontSize: '12px', color: '#8B7355', margin: 0 }}>slug: {cat.slug}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditCat(cat)} style={{
                        padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #E8DFC8',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        backgroundColor: 'transparent', color: '#4A4A4A',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Edit2 size={14} /> Modifier
                      </button>
                      <button onClick={() => handleDeleteCat(cat.id)} style={{
                        padding: '8px 16px', borderRadius: '10px', border: 'none',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        backgroundColor: '#FEE2E2', color: '#DC2626',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Tab Commandes ── */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#3A3A3A', fontSize: '20px', fontWeight: '400', marginBottom: '1rem' }}>
              Gestion des commandes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8B7355' }}>
                  <ShoppingBag size={40} color="#E8DFC8" />
                  <p style={{ marginTop: '1rem' }}>Aucune commande</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{
                    backgroundColor: '#FEFEFE', borderRadius: '16px', padding: '1.25rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F0EBD8'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2A2A2A', margin: '0 0 4px' }}>
                          Commande #{order.id}
                        </p>
                        <p style={{ fontSize: '13px', color: '#8B7355', margin: 0 }}>
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
                          {parseFloat(order.total).toFixed(2)} €
                        </span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {Object.entries(statusColors).map(([key, val]) => (
                            <button key={key} onClick={() => handleUpdateOrderStatus(order.id, key)} style={{
                              padding: '5px 12px', borderRadius: '20px', border: 'none',
                              cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                              backgroundColor: order.status === key ? val.color : val.bg,
                              color: order.status === key ? 'white' : val.color,
                              transition: 'all 0.2s ease'
                            }}>
                              {val.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Produit ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem'
          }}
          onClick={() => setShowCatDropdown(false)}
        >
          <div
            style={{
              backgroundColor: '#FEFEFE', borderRadius: '20px', padding: '2rem',
              width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3A3A3A', fontWeight: '400', margin: 0 }}>
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B7355' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Upload image */}
              <div>
                <label style={labelStyle}>Image du produit</label>
                <div
                  onClick={() => document.getElementById('product-image-input').click()}
                  style={{
                    border: '2px dashed #E8DFC8', borderRadius: '12px', padding: '1rem',
                    textAlign: 'center', cursor: 'pointer', backgroundColor: '#F8F4E9',
                    minHeight: '100px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: '8px'
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Image size={32} color="#C9A84C" />
                      <p style={{ fontSize: '13px', color: '#8B7355', margin: 0 }}>Cliquer pour ajouter une image</p>
                    </>
                  )}
                </div>
                <input id="product-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              {/* Champs texte */}
              {[
                { label: 'Nom', key: 'name', type: 'text' },
                { label: 'Slug', key: 'slug', type: 'text' },
                { label: 'Prix (€)', key: 'price', type: 'number' },
                { label: 'Stock', key: 'stock', type: 'number' },
                { label: 'Label certification', key: 'certification_label', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <input
                    type={field.type}
                    value={productForm[field.key]}
                    onChange={e => setProductForm({ ...productForm, [field.key]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Catégorie — Dropdown custom */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Catégorie</label>
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: `1.5px solid ${showCatDropdown ? '#4A7C59' : '#E8DFC8'}`,
                    fontSize: '14px', outline: 'none', backgroundColor: '#F8F4E9',
                    boxSizing: 'border-box', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    color: selectedCatName ? '#3A3A3A' : '#8B7355',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedCatName && (() => {
                      const cat = categories.find(c => c.id === parseInt(productForm.category))
                      return cat?.image ? (
                        <img src={`http://localhost:8000${cat.image}`} alt="" style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                      ) : null
                    })()}
                    <span>{selectedCatName || '— Choisir une catégorie —'}</span>
                  </div>
                  <ChevronDown size={16} color="#8B7355" style={{ transform: showCatDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {showCatDropdown && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    backgroundColor: '#FEFEFE', borderRadius: '12px',
                    border: '1.5px solid #E8DFC8',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 300, overflow: 'hidden'
                  }}>
                    {/* Option vide */}
                    <div
                      onClick={() => { setProductForm({ ...productForm, category: '' }); setShowCatDropdown(false) }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', fontSize: '14px',
                        color: '#8B7355', borderBottom: '1px solid #F0EBD8',
                        backgroundColor: !productForm.category ? '#F8F4E9' : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      — Aucune catégorie —
                    </div>

                    {categories.map((cat, index) => (
                      <div
                        key={cat.id}
                        onClick={() => { setProductForm({ ...productForm, category: cat.id }); setShowCatDropdown(false) }}
                        style={{
                          padding: '10px 14px', cursor: 'pointer', fontSize: '14px',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          backgroundColor: parseInt(productForm.category) === cat.id ? '#F0F7F4' : 'transparent',
                          color: parseInt(productForm.category) === cat.id ? '#4A7C59' : '#3A3A3A',
                          fontWeight: parseInt(productForm.category) === cat.id ? '600' : '400',
                          borderBottom: index < categories.length - 1 ? '1px solid #F0EBD8' : 'none',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        {cat.image ? (
                          <img src={`http://localhost:8000${cat.image}`} alt="" style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#F0EBD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Tag size={12} color="#8B7355" />
                          </div>
                        )}
                        {cat.name}
                        {parseInt(productForm.category) === cat.id && (
                          <Check size={14} color="#4A7C59" style={{ marginLeft: 'auto' }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4A4A4A' }}>
                  <input type="checkbox" checked={productForm.is_bio} onChange={e => setProductForm({ ...productForm, is_bio: e.target.checked })} />
                  Produit BIO
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4A4A4A' }}>
                  <input type="checkbox" checked={productForm.is_active} onChange={e => setProductForm({ ...productForm, is_active: e.target.checked })} />
                  Actif
                </label>
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  border: '1.5px solid #E8DFC8', backgroundColor: 'transparent',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#8B7355'
                }}>
                  Annuler
                </button>
                <button onClick={handleSaveProduct} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                  backgroundColor: '#4A7C59', cursor: 'pointer', fontSize: '14px',
                  fontWeight: '600', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Check size={16} />
                  {editingProduct ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Catégorie ── */}
      {showCatModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FEFEFE', borderRadius: '20px', padding: '2rem',
            width: '100%', maxWidth: '420px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3A3A3A', fontWeight: '400', margin: 0 }}>
                {editingCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={() => setShowCatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B7355' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Image de la catégorie</label>
                <div
                  onClick={() => document.getElementById('cat-image-input').click()}
                  style={{
                    border: '2px dashed #E8DFC8', borderRadius: '12px', padding: '1rem',
                    textAlign: 'center', cursor: 'pointer', backgroundColor: '#F8F4E9',
                    minHeight: '80px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: '8px'
                  }}
                >
                  {catImage ? (
                    <p style={{ fontSize: '13px', color: '#4A7C59', margin: 0 }}>✅ {catImage.name}</p>
                  ) : (
                    <>
                      <Upload size={24} color="#C9A84C" />
                      <p style={{ fontSize: '13px', color: '#8B7355', margin: 0 }}>Cliquer pour uploader</p>
                    </>
                  )}
                </div>
                <input id="cat-image-input" type="file" accept="image/*" onChange={e => setCatImage(e.target.files[0])} style={{ display: 'none' }} />
              </div>

              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="Ex: Huiles essentielles"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Slug</label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={e => setCatForm({ ...catForm, slug: e.target.value })}
                  placeholder="Ex: huiles-essentielles"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={() => setShowCatModal(false)} style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  border: '1.5px solid #E8DFC8', backgroundColor: 'transparent',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#8B7355'
                }}>
                  Annuler
                </button>
                <button onClick={handleSaveCat} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                  backgroundColor: '#C9A84C', cursor: 'pointer', fontSize: '14px',
                  fontWeight: '600', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Check size={16} />
                  {editingCat ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}