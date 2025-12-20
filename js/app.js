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

function loadSheet(sheetId, sheetName, containerId, type) {
  const query = encodeURIComponent('SELECT A, B, C, D');
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tq=${query}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '';

      rows.forEach(row => {
        if (!row.c[0]) return;

        const title = row.c[0]?.v || '';
        const date = row.c[1]?.v || '';
        const description = row.c[2]?.v || '';
        const image = row.c[3]?.v || '';

        container.innerHTML += `
          <div class="${type}-card">
            <div class="${type}-image">
              <img src="${image || 'assets/news.png'}" alt="${title}">
              <span class="${type}-date">${date}</span>
            </div>
            <div class="${type}-info">
              <h3>${title}</h3>
              <p>${description}</p>
            </div>
          </div>
        `;
      });
    })
    .catch(err => console.error('Erreur Google Sheet', err));
}

const SHEET_ID = "2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY";

loadSheet(
  SHEET_ID,
  "Activites",    
  "activities-grid",
  "activity"
);

loadSheet(
  SHEET_ID,
  "Evenements", 
  "events-grid",
  "event"
);