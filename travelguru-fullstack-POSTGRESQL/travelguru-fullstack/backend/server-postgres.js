const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL setup - Railway fornisce automaticamente DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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

// Initialize database tables
async function initDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL
      )
    `);

    // Insert default admin user (password: admin123)
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['admin', 'admin123']
    );

    // Insert default hero image
    await pool.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
      ['hero_image', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk9fcS79s6QKD1bViLCMEmbIYHXYrTCYT61NHQtEAdyzmJey-A8MdNZ6IhFdbolEx_x68WX5AF5gQlofCvF7HAeIH1sv_O4J_xs0-aGL9TIdTJPakElOv9gdHeDSd_Wm_GLYmJLC_X1KnkCOOaUwzwKyN-2SwTs3G_T8WIQmT1zvbWCR2POcyJjqqLuGbVPNsRCa4nc4059p4hgLP4L3epklKLxivmf1B4kR1DWuw0LMX3r2d05Np0pAK8L03K3W_TuYOKVoe68uI']
    );

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

initDatabase();

// API Routes

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM articles WHERE status = $1 ORDER BY published_date DESC';
    let result;
    
    if (category && category !== 'all') {
      query = 'SELECT * FROM articles WHERE status = $1 AND category = $2 ORDER BY published_date DESC';
      result = await pool.query(query, ['published', category]);
    } else {
      result = await pool.query(query, ['published']);
    }
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single article by slug
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create article
app.post('/api/articles', async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, image_url, location, read_time, published_date } = req.body;
    
    const result = await pool.query(
      `INSERT INTO articles (title, slug, excerpt, content, category, image_url, location, read_time, published_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [title, slug, excerpt, content, category, image_url, location, read_time, published_date]
    );
    
    res.json({ id: result.rows[0].id, message: 'Article created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, image_url, location, read_time, published_date, status } = req.body;
    
    await pool.query(
      `UPDATE articles 
       SET title = $1, slug = $2, excerpt = $3, content = $4, category = $5, 
           image_url = $6, location = $7, read_time = $8, published_date = $9, status = $10
       WHERE id = $11`,
      [title, slug, excerpt, content, category, image_url, location, read_time, published_date, status, req.params.id]
    );
    
    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM articles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    res.json({ 
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get settings
app.get('/api/settings/:key', async (req, res) => {
  try {
    const result = await pool.query('SELECT value FROM settings WHERE key = $1', [req.params.key]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ value: result.rows[0].value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
app.put('/api/settings/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const result = await pool.query(
      'UPDATE settings SET value = $1 WHERE key = $2',
      [value, req.params.key]
    );
    
    if (result.rowCount === 0) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2)',
        [req.params.key, value]
      );
    }
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settingsObj = {};
    result.rows.forEach(s => {
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
