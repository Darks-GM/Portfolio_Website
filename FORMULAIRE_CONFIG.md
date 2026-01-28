# Configuration du formulaire de contact sécurisé

## 🔐 Sécurité du formulaire

Le formulaire de contact est maintenant **entièrement fonctionnel** avec les fonctionnalités suivantes :

✅ **Validation côté client** - Vérification des champs avant envoi
✅ **reCAPTCHA v3** - Protection anti-bot invisible
✅ **Validation côté serveur** - Double vérification de sécurité
✅ **Envoi d'emails sécurisé** - Via Node.js/Express
✅ **Confirmation d'email** - Envoi automatique au visiteur
✅ **Gestion des erreurs** - Messages clairs et explicites

---

## ⚙️ Configuration requise

### 1. Obtenir les clés reCAPTCHA v3

1. Allez sur https://www.google.com/recaptcha/admin
2. Connectez-vous avec votre compte Google
3. Créez un nouveau site:
   - **Label**: Portfolio Website
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domaines**: votre-domaine.com
4. Copiez:
   - **Site Key** → À mettre dans le HTML
   - **Secret Key** → À mettre dans le .env

### 2. Configuration Gmail (SMTP)

#### Option A: Gmail avec mot de passe d'application (Recommandé)
1. Activez la [vérification en deux étapes](https://myaccount.google.com/security)
2. Générez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Utilisez ce mot de passe dans `.env` pour `EMAIL_PASSWORD`

#### Option B: Autre service email (SendGrid, Mailgun, etc.)
Modifiez la configuration dans `server.js`:

```javascript
const transporter = nodemailer.createTransport({
    service: 'sendgrid', // ou mailgun, postmark, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

### 3. Configuration du fichier .env

Créez/modifiez le fichier `.env` à la racine du projet:

```env
PORT=3000
NODE_ENV=production

# Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app
OWNER_EMAIL=ahyaneflorian@gmail.com

# reCAPTCHA v3
RECAPTCHA_SITE_KEY=6Lc...xxxxx
RECAPTCHA_SECRET_KEY=6Lc...xxxxx

# CORS (votre domaine)
ALLOWED_ORIGIN=https://votre-domaine.com
```

### 4. Installation des dépendances

```bash
npm install
```

Cela installera:
- **Express** - Framework backend
- **Nodemailer** - Envoi d'emails
- **Axios** - Vérification reCAPTCHA
- **CORS** - Sécurité des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

### 5. Mise à jour du script.js

Remplacez `VOTRE_CLE_SITE_RECAPTCHA` dans `src/script.js` (ligne ~57):

```javascript
const recaptchaToken = await grecaptcha.execute('VOTRE_CLE_SITE_RECAPTCHA', { action: 'submit' });
```

Par votre clé Site Key:

```javascript
const recaptchaToken = await grecaptcha.execute('6Lc...xxxxx', { action: 'submit' });
```

---

## 🚀 Démarrage du serveur

### En développement
```bash
npm run dev
```
Le serveur démarre sur `http://localhost:3000`

### En production
```bash
npm start
```

---

## 📝 Caractéristiques du formulaire

### Validation côté client
- ✓ Nom: minimum 2 caractères
- ✓ Email: format valide
- ✓ Message: minimum 10 caractères

### Validation côté serveur
- ✓ Vérification reCAPTCHA avec score minimum
- ✓ Sanitization des données
- ✓ Protection CORS
- ✓ Gestion des erreurs robuste

### Emails automatiques
- 📧 Email au propriétaire avec détails du contact
- 📧 Email de confirmation au visiteur
- 🔗 Répondre directement au visiteur (reply-to)

---

## 🔧 Customisation

### Modifier l'email reçu
Éditez le template HTML dans `server.js` (ligne ~70):

```javascript
const ownerMailOptions = {
    // ... configuration
    html: `
        <h2>Nouveau message reçu</h2>
        <p><strong>Nom:</strong> ${name}</p>
        // Personnalisez le contenu ici
    `
};
```

### Modifier l'email de confirmation
Éditez le template HTML dans `server.js` (ligne ~85):

```javascript
const visitorMailOptions = {
    // ... configuration
    html: `
        <h2>Merci de votre message!</h2>
        // Personnalisez le contenu ici
    `
};
```

### Ajuster le threshold reCAPTCHA
Dans `server.js` ligne ~30, modifiez:

```javascript
const threshold = 0.5; // Entre 0 et 1 (plus haut = plus strict)
```

---

## 🚨 Dépannage

### "Email envoyé mais non reçu"
- Vérifiez le mot de passe d'application Gmail
- Vérifiez le filtre spam
- Vérifiez que `OWNER_EMAIL` est correct

### "reCAPTCHA failed"
- Vérifiez que la clé secrète est correcte dans `.env`
- Vérifiez que le domaine est enregistré dans reCAPTCHA

### "CORS error"
- Vérifiez `ALLOWED_ORIGIN` dans `.env`
- Assurez-vous que le frontend et le serveur utilisent le même domaine

### "Port déjà utilisé"
```bash
# Changez le port dans .env
PORT=5000
```

---

## 📊 Sécurité

Le formulaire est protégé par:
1. **reCAPTCHA v3** - Score anti-bot (0-1)
2. **CORS** - Accepte uniquement les demandes du domaine autorisé
3. **Validation côté serveur** - Vérification obligatoire
4. **Rate limiting** - Vous pouvez ajouter si nécessaire
5. **Sanitization** - Protection XSS basique (à améliorer)

---

## 📱 Déploiement

### Sur Vercel (Recommandé pour Next.js)
```bash
npm install -g vercel
vercel
```

### Sur Heroku
```bash
heroku create votre-app
git push heroku main
```

### Sur un serveur Node.js
```bash
pm2 start server.js --name portfolio
```

---

## 🤝 Support

Pour toute question, consultez la [documentation Nodemailer](https://nodemailer.com/) ou [documentation reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3).
