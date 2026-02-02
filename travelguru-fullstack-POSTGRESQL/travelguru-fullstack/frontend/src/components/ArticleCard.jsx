import { Link } from 'react-router-dom'

function ArticleCard({ article }) {
  const categoryLabels = {
    isole: '🏝️ Isole',
    guide: '📍 Guide',
    spiagge: '🏖️ Spiagge',
    cibo: '🍽️ Cibo',
    itinerari: '🗺️ Itinerari'
  }

  return (
    <Link to={`/article/${article.slug}`} className="article-card">
      <img 
        src={article.image_url} 
        alt={article.title} 
        className="article-image"
      />
      <div className="article-content">
        <span className="article-category">
          {categoryLabels[article.category] || article.category}
        </span>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-meta">
          <span>⏱️ {article.read_time} min di lettura</span>
          <span>📅 {new Date(article.published_date).toLocaleDateString('it-IT')}</span>
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard
