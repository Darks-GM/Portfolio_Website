# Portfolio Florian AH-YANE

Portfolio personnel avec formulaire de contact sécurisé utilisant reCAPTCHA v3 et Node.js/Express.

## Indexation Google (SEO)

### 1. Google Search Console
Pour que ton site apparaisse dans la recherche Google:

1. Aller sur https://search.google.com/search-console
2. Ajouter ta propriété: `https://florian-ahyane.com`
3. Vérifier la propriété (DNS ou HTML meta tag)
4. Soumettre le sitemap: `/sitemap.xml`
5. Attendre l'indexation (quelques jours à quelques semaines)

### 2. Fichiers SEO créés
- `src/robots.txt` — Indique à Google quoi crawler
- `src/sitemap.xml` — Liste toutes tes pages pour Google

### 3. Meta tags recommandés
À ajouter dans le `<head>` de `index.html`:
```html
<meta name="description" content="Florian AH-YANE - Développeur Web, App et Unreal Engine 5">
<meta name="keywords" content="développeur, portfolio, web, React, Unreal Engine">
<meta name="author" content="Florian AH-YANE">
<meta property="og:title" content="Portfolio Florian AH-YANE">
<meta property="og:description" content="Développeur Web, App et Unreal Engine 5">
<meta property="og:url" content="https://florian-ahyane.com">
<meta name="twitter:card" content="summary_large_image">
```

## Démarrer en local

### Prérequis
- Node.js 14+ et npm
- Compte Gmail avec mot de passe d'application
- Clés reCAPTCHA v3 (https://www.google.com/recaptcha/admin)

### Installation

1. Cloner le repo et installer les dépendances:
```bash
npm install
```

2. Créer un fichier `.env` à la racine (copier `.env.example`):
```bash
cp .env.example .env
```

3. Remplir les variables dans `.env`:
   - `EMAIL_SERVICE`: `gmail` (ou autre service nodemailer)
   - `EMAIL_USER`: votre adresse email
   - `EMAIL_PASSWORD`: mot de passe d'application (pas le mot de passe Gmail)
   - `OWNER_EMAIL`: email où recevoir les messages
   - `RECAPTCHA_SITE_KEY`: clé publique (récupérée du dashboard Google)
   - `RECAPTCHA_SECRET_KEY`: clé secrète (récupérée du dashboard Google)
   - `ALLOWED_ORIGIN`: `https://florian-ahyane.com` (en production)

### Lancer localement

```bash
npm run dev
```

## Déploiement

### Option 1: Railway (recommandé)

1. Créer un compte sur https://railway.app
2. Connecter votre GitHub repo
3. Ajouter les variables d'environnement depuis le dashboard Railway
4. Relier un domaine personnalisé (florian-ahyane.com)
5. Déployer (auto sur chaque push)

**Avantages:** Gratuit (avec limites), facile, auto-SSL, logs en temps réel.

### Option 2: Google Cloud App Engine

1. Créer un compte Google Cloud
2. Créer un projet
3. Installer gcloud CLI
4. À la racine, créer `app.yaml`:
```yaml
runtime: nodejs18
env: standard

env_variables:
  ALLOWED_ORIGIN: "https://florian-ahyane.com"
  NODE_ENV: "production"

handlers:
- url: /.*
  script: auto
```
5. Déployer: `gcloud app deploy`
6. Relier le domaine dans Google Cloud

**Coût:** Gratuit pour la plupart (~$5-20/mois selon le trafic).

### Option 3: VPS (DigitalOcean, Linode)

1. Louer un VPS (~5-15$/mois)
2. Installer Node.js, PM2, Nginx
3. Cloner le repo et `npm install`
4. Utiliser PM2 pour démarrer le serveur: `pm2 start server.js`
5. Configurer Nginx en reverse proxy vers localhost:3000
6. Configurer SSL avec Let's Encrypt
7. Pointer votre domaine vers le VPS

## Structure du projet

```
Portfolio_Website/
├── src/
│   ├── index.html           # Page principale
│   ├── script.js            # Logique client (contact, animations, reCAPTCHA)
│   ├── styles.css           # Styles
│   ├── robots.txt           # Robots pour crawlers (SEO)
│   └── sitemap.xml          # Sitemap pour Google
├── Ressources/
│   ├── Images/              # Images du portfolio
│   ├── Icons/               # Icônes
│   └── Song/                # Audio ambiant
├── server.js                # Serveur Express + routes email
├── package.json             # Dépendances
├── .env                     # Variables d'environnement (À NE PAS commiter)
├── .env.example             # Template .env
├── .gitignore               # Fichiers ignorés par Git
└── README.md                # Ce fichier
```

## Routes API

### POST /api/send-email
Envoie un email de contact.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Bonjour...",
  "recaptchaToken": "token_from_grecaptcha_execute"
}
```

**Response:**
- `200 OK`: `{ "message": "Email envoyé avec succès!" }`
- `400 Bad Request`: Validation ou reCAPTCHA échouée
- `500 Internal Server Error`: Erreur serveur

## Configuration Gmail

Pour utiliser Gmail avec nodemailer:

1. Activer l'authentification à deux facteurs
2. Créer un mot de passe d'application: https://myaccount.google.com/apppasswords
3. Copier le mot de passe généré dans `EMAIL_PASSWORD` du `.env`

## Configuration Domaine

Pour pointer `florian-ahyane.com` vers votre serveur:

1. Acheter le domaine (OVH, Namecheap, GoDaddy, etc.)
2. Créer les records DNS:
   - **A Record**: Pointer vers l'IP de votre serveur
   - **MX Record**: (optionnel) si vous gérez email séparément
3. Attendre la propagation DNS (~15-30 min)

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `3000` |
| `NODE_ENV` | Environnement | `production` ou `development` |
| `ALLOWED_ORIGIN` | Origines CORS autorisées | `https://florian-ahyane.com` |
| `EMAIL_SERVICE` | Service email nodemailer | `gmail` |
| `EMAIL_USER` | Email de départ | `florian@florian-ahyane.com` |
| `EMAIL_PASSWORD` | Mot de passe email | (app password) |
| `OWNER_EMAIL` | Email de réception | `florian@florian-ahyane.com` |
| `RECAPTCHA_SITE_KEY` | Clé publique reCAPTCHA | `6LeGE1ks...` |
| `RECAPTCHA_SECRET_KEY` | Clé secrète reCAPTCHA | `6LeGE1ks...` |

## Dépannage

**Erreur "reCAPTCHA échouée":**
- Vérifier que `RECAPTCHA_SECRET_KEY` est correctement configurée
- Vérifier les logs serveur pour les `error-codes` de Google

**Erreur "Email non envoyé":**
- Vérifier que `EMAIL_PASSWORD` est un mot de passe d'application Gmail, pas votre mot de passe Gmail
- Vérifier que l'email est correctement configuré dans les variables d'env

**CORS error:**
- Vérifier que `ALLOWED_ORIGIN` correspond au domaine du client
- En local: devrait être `http://localhost:3000`

## License

MIT