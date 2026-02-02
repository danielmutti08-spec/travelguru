import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Header from '../components/Header'
import Footer from '../components/Footer'

function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  const categoryLabels = {
    isole: '🏝️ Isole',
    guide: '📍 Guide',
    spiagge: '🏖️ Spiagge',
    cibo: '🍽️ Cibo',
    itinerari: '🗺️ Itinerari'
  }

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/articles/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        console.error('Articolo non trovato')
      }
    } catch (error) {
      console.error('Errore nel caricamento articolo:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="article-page">
          <p>Caricamento...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div>
        <Header />
        <div className="article-page">
          <h1>Articolo non trovato</h1>
          <Link to="/">← Torna alla home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      
      <div className="article-page">
        <div className="article-header">
          <Link to="/" style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
            ← Torna agli articoli
          </Link>
          <span className="article-category">
            {categoryLabels[article.category] || article.category}
          </span>
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span>⏱️ {article.read_time} min di lettura</span>
            <span>•</span>
            <span>📅 {new Date(article.published_date).toLocaleDateString('it-IT', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        <img 
          src={article.image_url} 
          alt={article.title} 
          className="article-featured-image"
        />

        <div className="article-body">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ArticlePage
