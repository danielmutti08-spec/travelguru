import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function AdminNewArticle() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'isole',
    image_url: '',
    read_time: 5
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-genera lo slug dal titolo
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
        .replace(/[^\w\s-]/g, '') // Rimuove caratteri speciali
        .replace(/\s+/g, '-') // Sostituisce spazi con trattini
        .replace(/--+/g, '-') // Rimuove trattini multipli
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Articolo creato con successo!')
        navigate('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'Errore nella creazione dell\'articolo')
      }
    } catch (error) {
      setError('Errore di connessione')
      console.error('Errore:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Header />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Nuovo Articolo</h1>
          <Link to="/admin" className="btn-secondary">← Indietro</Link>
        </div>

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

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titolo *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Es: Santorini: Guida Completa"
              />
            </div>

            <div className="form-group">
              <label>Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="santorini-guida-completa"
              />
              <small style={{ color: 'var(--gray-500)' }}>
                URL dell'articolo. Generato automaticamente dal titolo.
              </small>
            </div>

            <div className="form-group">
              <label>Categoria *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="isole">🏝️ Isole</option>
                <option value="guide">📍 Guide</option>
                <option value="spiagge">🏖️ Spiagge</option>
                <option value="cibo">🍽️ Cibo</option>
                <option value="itinerari">🗺️ Itinerari</option>
              </select>
            </div>

            <div className="form-group">
              <label>URL Immagine *</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/photo-..."
              />
              <small style={{ color: 'var(--gray-500)' }}>
                Usa immagini da Unsplash.com per qualità alta
              </small>
            </div>

            <div className="form-group">
              <label>Tempo di Lettura (minuti) *</label>
              <input
                type="number"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                required
                min="1"
                max="60"
              />
            </div>

            <div className="form-group">
              <label>Excerpt (Descrizione Breve) *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                placeholder="Breve descrizione dell'articolo (150-200 caratteri)"
                style={{ minHeight: '100px' }}
              />
            </div>

            <div className="form-group">
              <label>Contenuto (Markdown) *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="# Titolo Principale&#10;&#10;Scrivi il contenuto in Markdown...&#10;&#10;## Sezione 1&#10;&#10;Testo del paragrafo..."
              />
              <small style={{ color: 'var(--gray-500)' }}>
                Usa Markdown: # per titoli, ## per sottotitoli, ** per grassetto, * per corsivo
              </small>
            </div>

            <div className="form-actions">
              <Link to="/admin" className="btn-secondary">Annulla</Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Salvataggio...' : 'Pubblica Articolo'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminNewArticle
