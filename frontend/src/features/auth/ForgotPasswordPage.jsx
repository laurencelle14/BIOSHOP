import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../../services/api'
import logo from '../../assets/logo.png'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1=email, 2=otp, 3=nouveau mdp, 4=succès
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Étape 1 — Envoyer l'OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/users/forgot-password/', { email })
      setStep(2)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  // Étape 2 — Vérifier l'OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // On vérifie juste que le code est bien formaté (6 chiffres)
      if (otpCode.length !== 6) {
        setError('Le code doit contenir 6 chiffres.')
        setLoading(false)
        return
      }
      setStep(3)
    } catch {
      setError('Code invalide.')
    } finally {
      setLoading(false)
    }
  }

  // Étape 3 — Nouveau mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      await api.post('/users/reset-password/', {
        email,
        otp_code: otpCode,
        new_password: newPassword
      })
      setStep(4)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Code OTP invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid #E8DFC8', fontSize: '14px', outline: 'none',
    backgroundColor: '#F8F4E9', boxSizing: 'border-box'
  }

  const stepTitles = {
    1: 'Mot de passe oublié',
    2: 'Vérification',
    3: 'Nouveau mot de passe',
    4: 'Succès !'
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F8F4E9',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="fade-in-up" style={{
        backgroundColor: '#FEFEFE', borderRadius: '20px', padding: '3rem',
        width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Body's Caprice" style={{
            width: '75px', height: '75px', borderRadius: '50%',
            objectFit: 'cover', marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(201,168,76,0.25)'
          }} />
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#C9A84C', fontSize: '22px', margin: 0 }}>
            {"Body's Caprice"}
          </h1>
          <p style={{
            color: '#8B7355', fontSize: '12px', letterSpacing: '2px',
            textTransform: 'uppercase', marginTop: '4px'
          }}>
            {stepTitles[step]}
          </p>
        </div>

        {/* Indicateur étapes */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: step > s ? '#4A7C59' : step === s ? '#C9A84C' : '#E8DFC8',
                  color: step >= s ? 'white' : '#8B7355',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '600', transition: 'all 0.3s'
                }}>
                  {step > s ? '✓' : s}
                </div>
                {i < 2 && (
                  <div style={{
                    width: '30px', height: '2px',
                    backgroundColor: step > s ? '#4A7C59' : '#E8DFC8',
                    transition: 'background-color 0.3s'
                  }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px 16px',
            borderRadius: '10px', fontSize: '14px', marginBottom: '1.5rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* ── Étape 1 — Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <p style={{ fontSize: '14px', color: '#8B7355', marginBottom: '1.5rem', textAlign: 'center' }}>
              Entrez votre email pour recevoir un code de réinitialisation.
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4A4A4A', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8B7355' }} />
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com" required
                  style={{ ...inputStyle, padding: '12px 16px 12px 42px' }}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', backgroundColor: loading ? '#D4B86A' : '#C9A84C',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>
          </form>
        )}

        {/* ── Étape 2 — OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              textAlign: 'center', marginBottom: '1.5rem', padding: '1rem',
              backgroundColor: '#F0F7F4', borderRadius: '12px'
            }}>
              <Mail size={24} color="#4A7C59" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '14px', color: '#4A4A4A', margin: 0 }}>Code envoyé à</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#4A7C59', margin: '4px 0 0' }}>{email}</p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4A4A4A', marginBottom: '6px' }}>
                Code de vérification
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8B7355' }} />
                <input
                  type="text" value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="000000" maxLength={6} required
                  style={{
                    ...inputStyle, padding: '12px 16px 12px 42px',
                    fontSize: '22px', fontWeight: '600', letterSpacing: '8px', textAlign: 'center'
                  }}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', backgroundColor: loading ? '#A0C4B0' : '#4A7C59',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '1rem'
            }}>
              {loading ? 'Vérification...' : 'Valider le code'}
            </button>
            <button type="button" onClick={() => { setStep(1); setError(''); setOtpCode('') }} style={{
              width: '100%', padding: '12px', backgroundColor: 'transparent',
              color: '#8B7355', border: '1.5px solid #E8DFC8', borderRadius: '12px',
              fontSize: '14px', cursor: 'pointer'
            }}>
              Retour
            </button>
          </form>
        )}

        {/* ── Étape 3 — Nouveau mot de passe ── */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p style={{ fontSize: '14px', color: '#8B7355', marginBottom: '1.5rem', textAlign: 'center' }}>
              Choisissez un nouveau mot de passe sécurisé.
            </p>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4A4A4A', marginBottom: '6px' }}>
                Nouveau mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, padding: '12px 46px 12px 16px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#8B7355',
                  display: 'flex', alignItems: 'center', padding: 0
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4A4A4A', marginBottom: '6px' }}>
                Confirmer le mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, padding: '12px 46px 12px 16px' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#8B7355',
                  display: 'flex', alignItems: 'center', padding: 0
                }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', backgroundColor: loading ? '#D4B86A' : '#C9A84C',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        {/* ── Étape 4 — Succès ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle size={64} color="#4A7C59" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#4A7C59', fontSize: '20px', fontWeight: '400', marginBottom: '0.5rem' }}>
              Mot de passe réinitialisé !
            </h2>
            <p style={{ fontSize: '14px', color: '#8B7355', marginBottom: '1.5rem' }}>
              Vous allez être redirigé vers la page de connexion...
            </p>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #E8DFC8',
              borderTop: '3px solid #4A7C59', borderRadius: '50%',
              margin: '0 auto', animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Lien retour connexion */}
        {step === 1 && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#8B7355' }}>
            <Link to="/login" style={{ color: '#4A7C59', fontWeight: '600', textDecoration: 'none' }}>
              ← Retour à la connexion
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}