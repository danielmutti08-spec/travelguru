const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
const db = new Database(path.join(__dirname, 'database.db'));

// Middleware - CORS configurato per produzione
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permetti richieste senza origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Permetti tutti i domini .netlify.app
    if (origin.endsWith('.netlify.app')) return callback(null, true);
    
    // Permetti origini configurate
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    location TEXT,
    read_time INTEGER,
    published_date TEXT,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  )
`);

// Insert default admin user (password: admin123)
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
insertUser.run('admin', 'admin123');

// Insert default hero image
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
insertSetting.run('hero_image', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk9fcS79s6QKD1bViLCMEmbIYHXYrTCYT61NHQtEAdyzmJey-A8MdNZ6IhFdbolEx_x68WX5AF5gQlofCvF7HAeIH1sv_O4J_xs0-aGL9TIdTJPakElOv9gdHeDSd_Wm_GLYmJLC_X1KnkCOOaUwzwKyN-2SwTs3G_T8WIQmT1zvbWCR2POcyJjqqLuGbVPNsRCa4nc4059p4hgLP4L3epklKLxivmf1B4kR1DWuw0LMX3r2d05Np0pAK8L03K3W_TuYOKVoe68uI');

// API Routes

// Get all articles
app.get('/api/articles', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM articles WHERE status = "published" ORDER BY published_date DESC';
    let articles;
    
    if (category && category !== 'all') {
      query = 'SELECT * FROM articles WHERE status = "published" AND category = ? ORDER BY published_date DESC';
      articles = db.prepare(query).all(category);
    } else {
      articles = db.prepare(query).all();
    }
    
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single article by slug
app.get('/api/articles/:slug', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create article
app.post('/api/articles', (req, res) => {
  try {
    const { title, slug, excerpt, content, category, image_url, location, read_time, published_date } = req.body;
    
    const insert = db.prepare(`
      INSERT INTO articles (title, slug, excerpt, content, category, image_url, location, read_time, published_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(title, slug, excerpt, content, category, image_url, location, read_time, published_date);
    
    res.json({ id: result.lastInsertRowid, message: 'Article created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  try {
    const { title, slug, excerpt, content, category, image_url, location, read_time, published_date, status } = req.body;
    
    const update = db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, 
          image_url = ?, location = ?, read_time = ?, published_date = ?, status = ?
      WHERE id = ?
    `);
    
    update.run(title, slug, excerpt, content, category, image_url, location, read_time, published_date, status, req.params.id);
    
    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  try {
    const del = db.prepare('DELETE FROM articles WHERE id = ?');
    del.run(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get settings
app.get('/api/settings/:key', (req, res) => {
  try {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ value: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
app.put('/api/settings/:key', (req, res) => {
  try {
    const { value } = req.body;
    const update = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const result = update.run(value, req.params.key);
    
    if (result.changes === 0) {
      const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      insert.run(req.params.key, value);
    }
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
