import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ArticlePage from './pages/ArticlePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminNewArticle from './pages/AdminNewArticle'
import AdminEditArticle from './pages/AdminEditArticle'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<AdminNewArticle />} />
        <Route path="/admin/edit/:id" element={<AdminEditArticle />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
