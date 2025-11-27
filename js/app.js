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

// Sélection de la section hero
const hero = document.querySelector('.hero');

// Vérifie que l'élément existe
if (hero) {
  window.addEventListener('scroll', () => {
    let offset = window.pageYOffset;
    // Ajuste le facteur pour la vitesse du parallaxe (0.5 = moitié de la vitesse de scroll)
    hero.style.backgroundPositionY = offset * 0.5 + "px";
  });
}