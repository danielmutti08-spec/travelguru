# 🚀 GUIDA DEPLOY ONLINE - 10 MINUTI

Tutto è già configurato! Segui questi step per mettere online il sito!

---

## 📋 Cosa Ti Serve (Tutto Gratis!)

1. **Account GitHub** → https://github.com/signup
2. **Account Railway** → https://railway.app (login con GitHub)
3. **Account Netlify** → https://netlify.com (login con GitHub)

---

## STEP 1️⃣: Carica su GitHub (3 minuti)

### A. Crea Repository

1. Vai su https://github.com
2. Click **"+"** in alto a destra → **"New repository"**
3. Nome: `travelguru`
4. Lascia **"Public"**
5. Click **"Create repository"**

### B. Carica i File

**OPZIONE FACILE - Via Browser:**

1. Nella pagina del repository appena creato
2. Click **"uploading an existing file"**
3. Trascina la cartella `travelguru-fullstack` nella pagina
4. Scrivi "Initial commit" in basso
5. Click **"Commit changes"**
6. Aspetta che carichi (1-2 minuti)

**OPZIONE ALTERNATIVA - Git:**

```bash
cd travelguru-fullstack
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO-USERNAME/travelguru.git
git push -u origin main
```

✅ **Repository caricato!**

---

## STEP 2️⃣: Deploy Backend su Railway (3 minuti)

### A. Crea Progetto Railway

1. Vai su https://railway.app
2. Click **"Start a New Project"**
3. Scegli **"Deploy from GitHub repo"**
4. Seleziona **"travelguru"** (il repository che hai creato)
5. Railway inizia automaticamente il deploy!

### B. Configura Variabili

1. Nel dashboard Railway, click sul tuo progetto
2. Vai su **"Variables"**
3. Aggiungi variabile:
   - **Name**: `PORT`
   - **Value**: `3001`
4. Click **"Add"**

### C. Genera Dominio

1. Vai su **"Settings"**
2. Scroll a **"Networking"**
3. Click **"Generate Domain"**
4. Railway ti dà un URL tipo: **`travelguru.up.railway.app`**

**📝 COPIA QUESTO URL!** Ti serve dopo!

Esempio: `https://travelguru-production.up.railway.app`

### D. Aspetta il Deploy

Guarda i log in **"Deployments"** → vedrai:
- ✅ Building...
- ✅ Deploying...
- ✅ Running!

**Backend online! 🎉**

---

## STEP 3️⃣: Deploy Frontend su Netlify (3 minuti)

### A. Crea Sito Netlify

1. Vai su https://netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Scegli **"Deploy with GitHub"**
4. Seleziona repository **"travelguru"**

### B. Configura Build

Netlify rileva automaticamente `netlify.toml`, ma verifica:

- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`

### C. Aggiungi Variabile d'Ambiente

**IMPORTANTE!** Prima di deploy:

1. Click **"Show advanced"**
2. Click **"New variable"**
3. Aggiungi:
   - **Key**: `VITE_API_URL`
   - **Value**: L'URL Railway che hai copiato prima
   
   Esempio: `https://travelguru-production.up.railway.app`

4. Click **"Deploy site"**

### D. Aspetta il Deploy

Netlify costruisce il sito (2-3 minuti):
- ✅ Building...
- ✅ Deploying...
- ✅ Site is live! 🎉

Netlify ti dà un URL tipo: **`random-name-12345.netlify.app`**

**Frontend online! 🎊**

---

## STEP 4️⃣: Collega Backend e Frontend (1 minuto)

### A. Configura CORS in Railway

1. Torna su **Railway**
2. Click sul tuo progetto backend
3. Vai su **"Variables"**
4. Click **"New Variable"**
5. Aggiungi:
   - **Variable**: `FRONTEND_URL`
   - **Value**: L'URL Netlify
   
   Esempio: `https://random-name-12345.netlify.app`

6. Railway fa automaticamente **redeploy** (30 secondi)

**Tutto collegato! ✅**

---

## STEP 5️⃣: TESTA IL SITO! 🎉

### A. Apri il Sito

Vai all'URL Netlify: `https://tuosito.netlify.app`

Dovresti vedere:
- ✅ Homepage con hero image
- ✅ Filtri categorie
- ✅ Articoli

### B. Testa l'Admin

1. Vai su: `https://tuosito.netlify.app/login`
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Prova a creare un articolo
4. Torna alla homepage → L'articolo appare!

### C. Cambia Hero Image

1. Vai su: `https://tuosito.netlify.app/admin/settings`
2. Inserisci nuovo URL immagine
3. Save
4. Torna alla homepage → Immagine cambiata!

**TUTTO FUNZIONA! 🚀**

---

## 🎊 COMPLIMENTI! Il Sito è Online!

### 📝 Salva Questi URL:

- **Sito Pubblico**: `https://tuosito.netlify.app`
- **Admin Panel**: `https://tuosito.netlify.app/admin`
- **Backend API**: `https://tuosito.up.railway.app`

---

## 🎨 Personalizza il Nome

### Netlify (Cambia URL)

1. Vai su Netlify Dashboard
2. Click sul tuo sito
3. **Site settings** → **Change site name**
4. Scegli: `travelguru-youname`
5. Nuovo URL: `travelguru-youname.netlify.app`

### Usa Dominio Personalizzato (Opzionale)

1. Compra dominio (namecheap.com, €10/anno)
2. Netlify → **Domain settings** → **Add custom domain**
3. Segui le istruzioni per configurare DNS

---

## ❓ Problemi Comuni

### Articoli non si caricano

**Soluzione:**
1. Verifica che `VITE_API_URL` in Netlify sia corretto
2. Verifica che `FRONTEND_URL` in Railway sia corretto
3. Aspetta 1 minuto dopo aver aggiunto variabili

### Errore CORS

**Soluzione:**
1. Aggiungi `FRONTEND_URL` in Railway
2. Aspetta che Railway faccia redeploy
3. Ricarica il sito

### Deploy fallisce

**Soluzione:**
1. Controlla i log in Railway/Netlify
2. Verifica che tutti i file siano su GitHub
3. Prova a fare **"Trigger deploy"** manualmente

---

## 💰 Costi

**TUTTO GRATIS!**

- ✅ Railway: 500 ore/mese gratis (più che sufficiente)
- ✅ Netlify: 100GB bandwidth/mese gratis
- ✅ GitHub: Gratis per sempre

Per un blog normale: **SEMPRE GRATIS!**

---

## 📊 Monitoraggio

### Railway Dashboard
- Vedi log backend in tempo reale
- Monitora richieste API
- Database size
- Uptime

### Netlify Dashboard
- Vedi deploy history
- Analytics visite
- Build logs

---

## 🔒 IMPORTANTE - Sicurezza

Dopo il primo deploy, **CAMBIA LA PASSWORD ADMIN:**

1. Nel codice backend, modifica `server.js`
2. Cambia la password di default
3. Fai commit e push su GitHub
4. Railway fa automaticamente redeploy

**Oppure implementa un sistema di cambio password nell'admin!**

---

## 🆘 Serve Aiuto?

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Netlify Support
- Docs: https://docs.netlify.com
- Forum: https://answers.netlify.com

---

## 🎯 Riepilogo Rapido

```
1. GitHub: Carica progetto
2. Railway: Deploy backend + Genera dominio + Aggiungi FRONTEND_URL
3. Netlify: Deploy frontend + Aggiungi VITE_API_URL
4. FATTO! Sito online!
```

**Tempo totale: ~10 minuti** ⏰

---

**Buon Deploy! 🚀✨**

Il tuo blog The Travel Guru è ora ONLINE con pannello admin funzionante!
