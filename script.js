console.log('🎮 Portfolio Gaming Edition Activé!');

// Gestion du curseur gaming
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

// Effet de clic gaming
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

// Menu hamburger mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Fermer le menu au clic en dehors
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupérer les valeurs
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Afficher un message de confirmation
        alert(`Merci ${name}! Votre message a été reçu. Nous vous recontacterons bientôt à ${email}.`);
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
}

// Gestion de la musique ambiante
const ambientMusic = document.getElementById('ambientMusic');
const musicToggle = document.getElementById('musicToggle');

if (ambientMusic && musicToggle) {
    // Défaut : musique arrêtée au chargement
    ambientMusic.pause();
    ambientMusic.volume = 0.2; // Volume à 30%
    
    // Écouteur pour le bouton
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

// Animation au scroll
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

// Observer les cartes de projets
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Observer les catégories de compétences
document.querySelectorAll('.skill-category').forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(skill);
});

// Smooth scroll pour les ancres
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

// Animation du compteur (optionnel - à ajouter si vous avez une section statistiques)
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

// Effet parallaxe (optionnel)
// window.addEventListener('scroll', () => {
//     const hero = document.querySelector('.hero');
//     const scrollPosition = window.scrollY;
//     if (hero) {
//         hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
//     }
// });
