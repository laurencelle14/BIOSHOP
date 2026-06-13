import { useState, useEffect } from 'react'
import { User, Mail, Phone } from 'lucide-react'
import api from '../../services/api'
import logo from '../../assets/logo.png'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me/')
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        })
      } catch {
        console.error('Erreur chargement profil')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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

  return (
    <div style={{ backgroundColor: '#F8F4E9', minHeight: '100vh' }}>

      {/* Header */}
      <div className="fade-in" style={{
        background: 'linear-gradient(135deg, #F8F4E9, #EEE8D5)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #E8DFC8'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#4A7C59',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: '32px',
            fontWeight: '600',
            color: 'white',
            fontFamily: 'Georgia, serif',
            boxShadow: '0 4px 16px rgba(74,124,89,0.3)'
          }}>
            {(formData.first_name || formData.email || 'U')[0].toUpperCase()}
          </div>
        </div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          color: '#C9A84C',
          fontSize: '28px',
          fontWeight: '400',
          margin: '0 0 4px'
        }}>
          {formData.first_name
            ? `${formData.first_name} ${formData.last_name}`
            : formData.email}
        </h1>
        <p style={{
          color: '#8B7355',
          fontSize: '13px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Mon Profil
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 2rem 4rem' }}>

        {/* Infos personnelles */}
        <div className="fade-in-up" style={{
          backgroundColor: '#FEFEFE',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid #F0EBD8',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1.5rem'
          }}>
            <User size={18} color="#C9A84C" />
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: '#3A3A3A',
              fontWeight: '400',
              margin: 0
            }}>
              Informations personnelles
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Prénom + Nom */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: '#F8F4E9',
                borderRadius: '12px',
                padding: '1rem 1.25rem'
              }}>
                <p style={{
                  fontSize: '12px', color: '#A89880', margin: '0 0 4px',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  Prénom
                </p>
                <p style={{ fontSize: '15px', color: '#3A3A3A', fontWeight: '500', margin: 0 }}>
                  {formData.first_name || '—'}
                </p>
              </div>

              <div style={{
                backgroundColor: '#F8F4E9',
                borderRadius: '12px',
                padding: '1rem 1.25rem'
              }}>
                <p style={{
                  fontSize: '12px', color: '#A89880', margin: '0 0 4px',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  Nom
                </p>
                <p style={{ fontSize: '15px', color: '#3A3A3A', fontWeight: '500', margin: 0 }}>
                  {formData.last_name || '—'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div style={{
              backgroundColor: '#F8F4E9',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Mail size={16} color="#8B7355" />
              <div>
                <p style={{
                  fontSize: '12px', color: '#A89880', margin: '0 0 2px',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  Email
                </p>
                <p style={{ fontSize: '15px', color: '#3A3A3A', fontWeight: '500', margin: 0 }}>
                  {formData.email || '—'}
                </p>
              </div>
            </div>

            {/* Téléphone */}
            <div style={{
              backgroundColor: '#F8F4E9',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Phone size={16} color="#8B7355" />
              <div>
                <p style={{
                  fontSize: '12px', color: '#A89880', margin: '0 0 2px',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  Téléphone
                </p>
                <p style={{ fontSize: '15px', color: '#3A3A3A', fontWeight: '500', margin: 0 }}>
                  {formData.phone || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compte */}
        <div className="fade-in-up" style={{
          backgroundColor: '#FEFEFE',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid #F0EBD8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <User size={18} color="#C9A84C" />
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: '#3A3A3A',
              fontWeight: '400',
              margin: 0
            }}>
              Compte
            </h2>
          </div>

          <div style={{
            backgroundColor: '#F8F4E9',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#3A3A3A', margin: 0 }}>
                Membre de
              </p>
              <p style={{ fontSize: '13px', color: '#8B7355', margin: '2px 0 0', fontStyle: 'italic' }}>
                {"Body's Caprice by E.M.A"}
              </p>
            </div>
            <img src={logo} alt="logo" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              opacity: 0.8
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}