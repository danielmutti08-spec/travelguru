# 🌍 The Travel Guru - Fullstack Blog

Design identico a Stitch + Pannello Admin completo + Database funzionante!

## 📦 Contenuto

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + Vite + Tailwind CSS
- **Design**: Identico ai file Stitch originali
- **Admin**: Pannello completo con CRUD + Gestione Hero Image

---

## 🚀 Installazione Rapida

### 1️⃣ Backend

```bash
cd backend
npm install
node seed.js        # Popola database
npm start          # Avvia server su porta 3001
```

### 2️⃣ Frontend (nuovo terminale)

```bash
cd frontend
npm install
npm run dev        # Avvia frontend su porta 3000
```

### 3️⃣ Apri Browser

Vai su: **http://localhost:3000**

---

## 🔐 Login Admin

- URL: http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

---

## ✨ Funzionalità

### Homepage
- Hero section con immagine personalizzabile
- Filtri categorie (Adventure, Luxury, Budget, Culture)
- Card articoli con hover effects
- Newsletter signup

### Pannello Admin
- ✅ Dashboard con lista articoli
- ✅ Crea nuovi articoli
- ✅ Modifica articoli esistenti
- ✅ Elimina articoli
- ✅ **Cambia Hero Image della homepage**

### API Endpoints

```
GET    /api/articles              # Tutti gli articoli
GET    /api/articles/:slug        # Singolo articolo
POST   /api/articles              # Crea articolo
PUT    /api/articles/:id          # Modifica articolo
DELETE /api/articles/:id          # Elimina articolo
POST   /api/auth/login            # Login
GET    /api/settings/:key         # Ottieni setting
PUT    /api/settings/:key         # Aggiorna setting
```

---

## 🎨 Personalizzazione Hero Image

1. Vai su http://localhost:3000/admin
2. Click su **"Settings"** nel menu
3. Inserisci URL della nuova immagine
4. Click **"Save Changes"**
5. Torna alla homepage → L'immagine è cambiata!

### Dove Trovare Immagini
- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- Usa immagini 1920x1080px o superiori

---

## 📂 Struttura Progetto

```
travelguru-fullstack/
├── backend/
│   ├── server.js          # Server Express
│   ├── seed.js            # Popola database
│   ├── database.db        # Database SQLite
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx           # Homepage
    │   │   ├── Article.jsx        # Pagina articolo
    │   │   ├── AdminDashboard.jsx # Dashboard admin
    │   │   ├── AdminSettings.jsx  # Gestione settings
    │   │   ├── AdminNewArticle.jsx
    │   │   └── AdminEditArticle.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   └── App.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🎯 Design Stitch Originali

I 3 design sono stati replicati:

1. **Homepage** (Design 1)
   - Hero "Explore the Unseen"
   - Card articoli verticali
   - Filtri categorie

2. **Pagina Articolo** (Design 2)
   - Hero fullscreen
   - Tipografia Playfair Display
   - Sidebar info viaggio

3. **Grid Destinazioni** (Design 3)
   - Layout masonry
   - Search bar
   - Filtri continenti

---

## 🔧 Modifiche al Design

### Cambiare Colori

Modifica `/frontend/tailwind.config.js`:

```js
colors: {
  primary: "#0d93f2",  // Blu principale
  // ... altri colori
}
```

### Cambiare Font

In `/frontend/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=TuoFont&display=swap" rel="stylesheet"/>
```

---

## 🌍 Deploy Online

### Frontend → Netlify
```bash
cd frontend
npm run build
# Carica cartella dist/ su Netlify
```

### Backend → Railway
1. Vai su railway.app
2. New Project → Deploy from GitHub
3. Seleziona repository
4. Deploy automatico

---

## 🐛 Troubleshooting

### Porta già in uso
```bash
# Backend
PORT=3002 npm start

# Frontend
npm run dev -- --port 3001
```

### Database corrotto
```bash
cd backend
rm database.db
node seed.js
```

### NPM errors
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database

### Tabelle
- **articles**: Tutti gli articoli del blog
- **users**: Utenti admin
- **settings**: Impostazioni sito (hero_image, ecc.)

### Articoli di Esempio
Il seed crea 4 articoli:
1. The Hidden Lagoons of Palawan
2. Alpine Escapes: The Dolomites
3. Golden Sands of Morocco
4. Hidden Gems of the Amalfi Coast

---

## 🔒 Sicurezza (Produzione)

⚠️ **IMPORTANTE** per uso in produzione:

1. Cambia password admin
2. Usa JWT invece di localStorage
3. Aggiungi hash password (bcrypt)
4. Configura CORS correttamente
5. Usa HTTPS
6. Aggiungi rate limiting
7. Validazione input server-side

---

## 💡 Prossimi Step Consigliati

- [ ] Upload immagini su Cloudinary
- [ ] Editor WYSIWYG (TipTap)
- [ ] SEO meta tags
- [ ] Comments system
- [ ] Analytics
- [ ] Newsletter integration
- [ ] Search avanzata
- [ ] Tag system
- [ ] Social sharing

---

## 📧 Support

Problemi? Leggi:
1. Questo README
2. Controlla console browser (F12)
3. Verifica log backend nel terminale
4. Assicurati che entrambi i server siano avviati

---

**Buon blogging! 🚀✨**

Created with ❤️ replicating Stitch designs
