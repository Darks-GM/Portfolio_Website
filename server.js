const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('src'));

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fonction pour vérifier le reCAPTCHA
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            {},
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: token
                }
            }
        );

        // reCAPTCHA v3 retourne un score entre 0 et 1
        // 1.0 est très probablement une interaction humaine
        // 0.0 est très probablement un bot
        const score = response.data.score;
        const threshold = 0.5;

        return {
            success: response.data.success && score > threshold,
            score: score
        };
    } catch (error) {
        console.error('Erreur reCAPTCHA:', error);
        return { success: false, score: 0 };
    }
}

// Route pour envoyer les emails
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, message, recaptchaToken } = req.body;

        // Validation des données
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Données manquantes' });
        }

        if (name.length < 2 || message.length < 10) {
            return res.status(400).json({ message: 'Les données ne respectent pas les critères' });
        }

        // Si la clé reCAPTCHA est configurée, vérifier le token
        if (process.env.RECAPTCHA_SECRET_KEY) {
            if (!recaptchaToken) {
                return res.status(400).json({ message: 'reCAPTCHA token manquant.' });
            }
            const captchaResult = await verifyRecaptcha(recaptchaToken);
            if (!captchaResult.success) {
                return res.status(400).json({ message: 'Vérification reCAPTCHA échouée. Vous êtes peut-être un bot.' });
            }
        } else {
            console.warn('RECAPTCHA_SECRET_KEY non configurée. Ignorer la vérification reCAPTCHA.');
        }

        // Email pour le propriétaire du site
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: `Nouveau message de ${name} - Portfolio`,
            html: `
                <h2>Nouveau message reçu</h2>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
            `,
            replyTo: email
        };

        // Email de confirmation pour le visiteur
        const visitorMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmation de réception - Florian AH-YANE',
            html: `
                <h2>Merci de votre message!</h2>
                <p>Bonjour ${name},</p>
                <p>J'ai bien reçu votre message et je vous recontacterai très bientôt.</p>
                <p>Merci d'avoir pris le temps de me contacter.</p>
                <hr>
                <p>Cordialement,<br>Florian AH-YANE</p>
            `
        };

        // Envoyer les deux emails
        await Promise.all([
            transporter.sendMail(ownerMailOptions),
            transporter.sendMail(visitorMailOptions)
        ]);

        res.status(200).json({ message: 'Email envoyé avec succès!' });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
    }
});

// Route de santé
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ Serveur démarré sur le port ${PORT}`);
    console.log(`✓ Prêt à recevoir les messages de contact`);
});

module.exports = app;
