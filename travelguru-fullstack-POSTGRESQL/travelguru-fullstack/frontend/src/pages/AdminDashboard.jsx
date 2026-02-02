import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function AdminDashboard() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica se l'utente è loggato
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login')
      return
    }

    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Errore nel caricamento articoli:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== id))
        alert('Articolo eliminato con successo')
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error)
      alert('Errore nell\'eliminazione dell\'articolo')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('username')
    navigate('/')
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
          <h1>Pannello Admin</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/new" className="btn-primary">+ Nuovo Articolo</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        <div className="articles-table">
          <table>
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="article-thumbnail"
                        style={{ 
                          width: '64px', 
                          height: '64px', 
                          objectFit: 'cover', 
                          borderRadius: '10px',
                          marginRight: '1rem',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      />
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
                          {article.title}
                        </strong>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                          {article.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="article-category" style={{ fontSize: '0.75rem' }}>
                      {article.category}
                    </span>
                  </td>
                  <td>
                    {new Date(article.published_date).toLocaleDateString('it-IT')}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: article.status === 'published' ? '#D1FAE5' : '#FEE2E2',
                      color: article.status === 'published' ? '#059669' : '#DC2626',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {article.status === 'published' ? 'Pubblicato' : 'Bozza'}
                    </span>
                  </td>
                  <td>
                    <div className="article-actions">
                      <Link 
                        to={`/admin/edit/${article.id}`} 
                        className="btn-secondary"
                        style={{ 
                          padding: '0.5rem 0.75rem', 
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Modifica"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="btn-danger"
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Elimina"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
            Nessun articolo presente. <Link to="/admin/new">Crea il primo articolo</Link>
          </p>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
