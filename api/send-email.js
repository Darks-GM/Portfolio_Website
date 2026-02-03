const nodemailer = require('nodemailer');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { name, email, message, recaptchaToken } = req.body;

    if (!name || !email || !message) return res.status(400).json({ message: 'Données manquantes' });
    if (name.length < 2 || message.length < 10) return res.status(400).json({ message: 'Les données ne respectent pas les critères' });

    // Vérifier reCAPTCHA si configuré
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) return res.status(400).json({ message: 'reCAPTCHA token manquant.' });
      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        }
      });
      const score = response.data.score || 0;
      if (!response.data.success || score <= 0.5) return res.status(400).json({ message: 'Vérification reCAPTCHA échouée.' });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

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

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(visitorMailOptions)
    ]);

    return res.status(200).json({ message: 'Email envoyé avec succès!' });
  } catch (error) {
    console.error('Erreur send-email:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
};
