import { Link } from 'react-router-dom'

function Header() {
  // Controlla se l'utente è loggato
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">THE GREEK WAY</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/">Blog</Link>
          <Link to="/">Isole</Link>
          <Link to="/">Guide</Link>
          <Link to="/">Contatti</Link>
          {isAdmin && <Link to="/admin">⚙️ Admin</Link>}
        </nav>
      </div>
    </header>
  )
}

export default Header
