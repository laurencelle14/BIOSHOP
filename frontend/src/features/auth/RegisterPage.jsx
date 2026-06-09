import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import api from '../../services/api'
import logo from '../../assets/logo.png'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await api.post('/users/register/', {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      })
      navigate('/login')
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E8DFC8',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#F8F4E9',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: '6px'
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
        maxWidth: '480px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Body's Caprice" style={{
            width: '75px',
            height: '75px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(201,168,76,0.25)'
          }} />
          <h1 style={{
            fontFamily: 'Georgia, serif',
            color: '#C9A84C',
            fontSize: '22px',
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
            {"Créer un compte"}
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

          {/* Prénom + Nom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.2rem' }}>
            <div>
              <label style={labelStyle}>Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Votre Prénom"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="votre nom"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Username */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={labelStyle}>{"Nom d'utilisateur"}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nom d'utilisateur..."
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="marie@example.com"
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={labelStyle}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, padding: '12px 46px 12px 16px' }}
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
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Confirmer le mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, padding: '12px 46px 12px 16px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
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
                  padding: 0
                }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#D4B86A' : '#C9A84C',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <UserPlus size={18} />
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien connexion */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '14px',
          color: '#8B7355'
        }}>
          {"Déjà un compte ?"}{' '}
          <Link to="/login" style={{
            color: '#4A7C59',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}