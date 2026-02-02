import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function AdminEditArticle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'isole',
    image_url: '',
    read_time: 5,
    status: 'published'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login')
      return
    }

    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      // Recupera tutti gli articoli e trova quello con l'id corretto
      const response = await fetch('/api/articles')
      const articles = await response.json()
      const article = articles.find(a => a.id === parseInt(id))
      
      if (article) {
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          image_url: article.image_url,
          read_time: article.read_time,
          status: article.status
        })
      } else {
        setError('Articolo non trovato')
      }
    } catch (error) {
      console.error('Errore nel caricamento articolo:', error)
      setError('Errore nel caricamento dell\'articolo')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Articolo aggiornato con successo!')
        navigate('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'Errore nell\'aggiornamento dell\'articolo')
      }
    } catch (error) {
      setError('Errore di connessione')
      console.error('Errore:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="admin-container">
          <p>Caricamento...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Modifica Articolo</h1>
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
              />
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
              />
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
              <label>Stato *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="published">Pubblicato</option>
                <option value="draft">Bozza</option>
              </select>
            </div>

            <div className="form-group">
              <label>Excerpt (Descrizione Breve) *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
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
              />
              <small style={{ color: 'var(--gray-500)' }}>
                Usa Markdown: # per titoli, ## per sottotitoli, ** per grassetto
              </small>
            </div>

            <div className="form-actions">
              <Link to="/admin" className="btn-secondary">Annulla</Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Salvataggio...' : 'Aggiorna Articolo'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminEditArticle
