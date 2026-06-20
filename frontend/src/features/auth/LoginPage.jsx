import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, KeyRound } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import logo from '../../assets/logo.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 = email/password, 2 = OTP
  const { login } = useAuthStore()
  const navigate = useNavigate()

  // Étape 1 — Email + Password
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/users/login/', { email, password })
      setStep(2) // Passer à l'étape OTP
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  // Étape 2 — Vérification OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/users/verify-otp/', { email, otp_code: otpCode })
      const { access, refresh, user } = response.data
      login(user, access, refresh)
      navigate('/')
    } catch {
      setError('Code OTP invalide ou expiré. Réessayez.')
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
            {step === 1 ? 'Connexion' : 'Vérification'}
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#4A7C59',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div style={{
            width: '40px',
            height: '2px',
            backgroundColor: step > 1 ? '#4A7C59' : '#E8DFC8'
          }} />
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: step === 2 ? '#4A7C59' : '#E8DFC8',
            color: step === 2 ? 'white' : '#8B7355',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            2
          </div>
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

        {/* ÉTAPE 1 — Email + Password */}
        {step === 1 && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4A4A4A',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B7355'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #E8DFC8',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#F8F4E9',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

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
                    boxSizing: 'border-box'
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
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
              {loading ? 'Vérification...' : 'Continuer'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#8B7355' }}>
              <Link to="/forgot-password" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '500' }}>
              Mot de passe oublié ?
              </Link>
            </p>
          </form>
        )}

        {/* ÉTAPE 2 — Code OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#F0F7F4',
              borderRadius: '12px'
            }}>
              <Mail size={24} color="#4A7C59" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '14px', color: '#4A4A4A', margin: 0 }}>
                Un code a été envoyé à
              </p>
              <p style={{ fontSize: '10px', fontWeight: '600', color: '#4A7C59', margin: '4px 0 0' }}>
                {email}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4A4A4A',
                marginBottom: '6px'
              }}>
                Code de vérification
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B7355'
                }} />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #E8DFC8',
                    fontSize: '22px',
                    fontWeight: '600',
                    letterSpacing: '8px',
                    outline: 'none',
                    backgroundColor: '#F8F4E9',
                    boxSizing: 'border-box',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#A0C4B0' : '#4A7C59',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Vérification...' : 'Valider le code'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setOtpCode('') }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#8B7355',
                border: '1.5px solid #E8DFC8',
                borderRadius: '12px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Retour
            </button>
          </form>
        )}

        {/* Lien inscription */}
        {step === 1 && (
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
        )}
      </div>
    </div>
  )
}
