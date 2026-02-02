import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ArticleCard from '../components/ArticleCard'

function Home() {
  const [articles, setArticles] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('tutti')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'tutti', label: '🌍 Tutti', icon: '🌍' },
    { id: 'isole', label: '🏝️ Isole', icon: '🏝️' },
    { id: 'guide', label: '📍 Guide', icon: '📍' },
    { id: 'spiagge', label: '🏖️ Spiagge', icon: '🏖️' },
    { id: 'cibo', label: '🍽️ Cibo', icon: '🍽️' },
    { id: 'itinerari', label: '🗺️ Itinerari', icon: '🗺️' }
  ]

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'tutti' 
        ? '/api/articles' 
        : `/api/articles?category=${selectedCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Errore nel caricamento articoli:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div 
        className="hero" 
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920)'
        }}
      >
        <div className="hero-content">
          <h1>Scopri la Grecia con chi la ama davvero</h1>
          <p>Guide, consigli e itinerari per il tuo viaggio perfetto</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Cerca destinazioni, guide, consigli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>🔍</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container">
        <div className="filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Caricamento...</p>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
            Nessun articolo trovato
          </p>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Home
