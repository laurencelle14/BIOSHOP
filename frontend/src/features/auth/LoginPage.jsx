import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import logo from '../../assets/logo.png'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login/', { username, password })
      const { access, refresh } = response.data
      login(null, access, refresh)
      navigate('/')
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

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
        borderRadius: '20px',
        padding: '3rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Body's Caprice" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(201,168,76,0.25)'
          }} />
          <h1 style={{
            fontFamily: 'Georgia, serif',
            color: '#C9A84C',
            fontSize: '24px',
            margin: 0
          }}>
            {"Body's Caprice"}
          </h1>
          <p style={{
            color: '#8B7355',
            fontSize: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: '4px'
          }}>
            Connexion
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#4A4A4A',
              marginBottom: '6px'
            }}>
              {"Nom d'utilisateur"}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #E8DFC8',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#F8F4E9',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#4A4A4A',
              marginBottom: '6px'
            }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 46px 12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #E8DFC8',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F8F4E9',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8B7355',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  transition: 'color 0.2s'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#A0C4B0' : '#4A7C59',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Lien inscription */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '14px',
          color: '#8B7355'
        }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{
            color: '#C9A84C',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            {"S'inscrire"}
          </Link>
        </p>
      </div>
    </div>
  )
}