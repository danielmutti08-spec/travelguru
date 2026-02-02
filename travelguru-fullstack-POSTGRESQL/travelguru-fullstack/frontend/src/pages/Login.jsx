import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('username', data.user.username)
        navigate('/admin')
      } else {
        setError('Credenziali non valide')
      }
    } catch (error) {
      setError('Errore di connessione')
    }
  }

  return (
    <div>
      <Header />
      
      <div className="container" style={{ maxWidth: '400px', padding: '4rem 2rem' }}>
        <div className="form-container">
          <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Login Admin</h1>
          
          {error && (
            <div style={{ 
              padding: '1rem', 
              background: '#FEE2E2', 
              color: '#DC2626', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Accedi
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Default: admin / admin123
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login
