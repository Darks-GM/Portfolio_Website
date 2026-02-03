// Copié depuis src/script.js (simplifié)

document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const message = document.getElementById('messageInput').value;

  // Récupérer token reCAPTCHA v3 si configuré
  let token = null;
  if (window.grecaptcha) {
    token = await grecaptcha.execute('6LeGE1ksAAAAADqUa7nkLxD7jJGz74LT8sA1h6y4', { action: 'submit' });
  }

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, recaptchaToken: token })
  });

  const data = await res.json();
  alert(data.message || 'Réponse reçue');
});
