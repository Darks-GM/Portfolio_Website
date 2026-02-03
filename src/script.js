const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #00ffff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2);
    display: none;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
});

document.addEventListener('click', (e) => {
    const click = document.createElement('div');
    click.style.cssText = `
        position: fixed;
        left: ${e.clientX - 10}px;
        top: ${e.clientY - 10}px;
        width: 20px;
        height: 20px;
        border: 2px solid #ff006e;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(click);
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        const angle = (i / 6) * Math.PI * 2;
        particle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: #ff006e;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: particle-burst 0.6s ease-out forwards;
        `;
        document.body.appendChild(particle);
        
        const distance = 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', x + 'px');
        particle.style.setProperty('--ty', y + 'px');
    }
    
    setTimeout(() => click.remove(), 600);
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('messageError').textContent = '';
        document.getElementById('formMessage').textContent = '';
        
        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const message = document.getElementById('messageInput').value.trim();
        
        let isValid = true;
        
        if (!name || name.length < 2) {
            document.getElementById('nameError').textContent = 'Le nom doit contenir au moins 2 caractères';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Veuillez entrer une adresse email valide';
            isValid = false;
        }
        
        if (!message || message.length < 10) {
            document.getElementById('messageError').textContent = 'Le message doit contenir au moins 10 caractères';
            isValid = false;
        }
        
        if (!isValid) return;

        document.getElementById('submitText').style.display = 'none';
        document.getElementById('spinner').style.display = 'inline-block';
        document.getElementById('submitBtn').disabled = true;
        
        try {
            let recaptchaToken = null;
            if (window.grecaptcha && grecaptcha.execute) {
                try {
                    await new Promise(resolve => grecaptcha.ready(resolve));
                    recaptchaToken = await grecaptcha.execute('6LeGE1ksAAAAADqUa7nkLxD7jJGz74LT8sA1h6y4', { action: 'contact' });
                } catch (recapErr) {
                    console.error('reCAPTCHA error:', recapErr);
                }
            }

            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/api/send-email'
                : 'https://florian-ahyane.com/api/send-email';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    recaptchaToken: recaptchaToken
                })
            });
            
            const data = await response.json();
            
            document.getElementById('submitText').style.display = 'inline';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
            
            if (response.ok) {
                document.getElementById('formMessage').className = 'form-message success';
                document.getElementById('formMessage').textContent = '✓ Message envoyé avec succès! Je vous recontacterai bientôt.';
                contactForm.reset();
            } else {
                document.getElementById('formMessage').className = 'form-message error';
                document.getElementById('formMessage').textContent = data.message || 'Erreur lors de l\'envoi du message.';
            }
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('submitText').style.display = 'inline';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('formMessage').className = 'form-message error';
            document.getElementById('formMessage').textContent = 'Une erreur est survenue. Veuillez réessayer.';
        }
    });
}

const ambientMusic = document.getElementById('ambientMusic');
const musicToggle = document.getElementById('musicToggle');

ambientMusic.play();
if (ambientMusic && musicToggle) {
    ambientMusic.play();
    musicToggle.classList.add('playing');
    ambientMusic.volume = 0.2;
    musicToggle.addEventListener('click', () => {
        if (ambientMusic.paused) {
            ambientMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            ambientMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
};

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

document.querySelectorAll('.skill-category').forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(skill);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}
