const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');

function closeMenu() {
  menu.classList.remove('show');
  overlay.classList.remove('show');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', false);
}

if(hamburger && menu && overlay){
  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    overlay.classList.toggle('show', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeMenu();
  });
}

// Fade-in animation
const elements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.1 });
elements.forEach(el => observer.observe(el));

// Smooth scroll + scrollspy
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if(target) target.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
  });
});

window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if(window.scrollY >= sectionTop - 60) current = section.getAttribute('id');
  });
  menuLinks.forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// Sélectionne toutes les sections parallaxe
const parallaxSections = document.querySelectorAll('.parallax');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  parallaxSections.forEach(section => {
    const factor = 0.5; // ajuster la vitesse
    section.style.backgroundPosition = `center ${-scrollY * factor}px`;
  });
});

/* ======================================================
  ACTIVITÉS & ÉVÉNEMENTS – Google Sheet
====================================================== */

function loadSheet(sheetUrl, targetId) {
    Papa.parse(sheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const container = document.getElementById(targetId);
            container.innerHTML = ''; // vide la section avant d'ajouter
            results.data.forEach(item => {
                const card = document.createElement('div');
                card.className = targetId === 'activites-grid' ? 'activity-card' : 'event-card';

                card.innerHTML = `
                    <div class="${targetId === 'activites-grid' ? 'activity-image' : 'event-image'}">
                        <img src="${item.Image || 'assets/news.png'}" alt="${item.Titre}">
                        <span class="${targetId === 'activites-grid' ? 'activity-date' : 'event-date'}">${item.Date}</span>
                    </div>
                    <div class="${targetId === 'activites-grid' ? 'activity-info' : 'event-info'}">
                        <h3>${item.Titre}</h3>
                        <p>${item.Description}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        },
        error: function(err) {
            console.error("Erreur Google Sheet:", err);
        }
    });
}

// Appel après que le DOM soit prêt
document.addEventListener("DOMContentLoaded", function() {
    loadSheet('https://docs.google.com/spreadsheets/d/e/2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY/pub?gid=0&single=true&output=csv'+new Date().getTime(), 'activites-grid');
    loadSheet('https://docs.google.com/spreadsheets/d/e/2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY/pub?gid=78675078&single=true&output=csv'+new Date().getTime(), 'events-grid');
});