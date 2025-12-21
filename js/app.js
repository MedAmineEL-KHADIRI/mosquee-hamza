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
    loadSheet('https://docs.google.com/spreadsheets/d/e/2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY/pub?gid=0&single=true&output=csv', 'activites-grid');
    loadSheet('https://docs.google.com/spreadsheets/d/e/2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY/pub?gid=78675078&single=true&output=csv', 'events-grid');
});

/* Sections Dons */

// Calculer le mois précédent

(function setFinanceMonth() {
  const title = document.getElementById('finance-title');
  if (!title) return;

  const now = new Date();
  now.setMonth(now.getMonth() - 1);

  const monthName = now.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  title.textContent = `Transparence financière – ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
})();

// Calcul des % pour la gauge

function loadFinanceSheet(sheetUrl, elementId) {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      let depensesTotal = 0;
      let recettesTotal = 0;

      const container = document.getElementById(elementId);
      if(!container) return;

      const ulDepenses = container.querySelector('.finance-categories.depenses');
      const ulRecettes = container.querySelector('.finance-categories.recettes');

      ulDepenses.innerHTML = '';
      ulRecettes.innerHTML = '';

      data.forEach(item => {
        if(!item.Catégorie || !item.Type || !item.Montant) return;

        const li = document.createElement('li');
        li.innerHTML = `<span>${item.Catégorie}</span> <strong>${parseFloat(item.Montant).toLocaleString()} €</strong>`;

        if(item.Type.toLowerCase() === 'dépense') {
          ulDepenses.appendChild(li);
          depensesTotal += parseFloat(item.Montant) || 0;
        } else if(item.Type.toLowerCase() === 'recette') {
          ulRecettes.appendChild(li);
          recettesTotal += parseFloat(item.Montant) || 0;
        }
      });

      // Totaux
      container.querySelector('.finance-total.depenses strong').textContent = depensesTotal.toLocaleString() + ' €';
      container.querySelector('.finance-total.recettes strong').textContent = recettesTotal.toLocaleString() + ' €';

      // Gauge
      const gaugeReceived = container.querySelector('.finance-bar-received');
      const gaugeSpent = container.querySelector('.finance-bar-spent');
      const total = depensesTotal + recettesTotal || 1;
      gaugeReceived.style.width = ((recettesTotal / total) * 100) + '%';
      gaugeSpent.style.width = ((depensesTotal / total) * 100) + '%';

      // Résumé
      container.querySelector('.finance-summary .received').textContent = 'Dons reçus : ' + recettesTotal.toLocaleString() + ' €';
      container.querySelector('.finance-summary .spent').textContent = 'Dépenses : ' + depensesTotal.toLocaleString() + ' €';
    },
    error: function(err) {
      console.error('Erreur Google Sheet', err);
    }
  });
}

// Appel de la fonction
const financeSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPFM48CjWdGL-RKdStEYV5olhXBUNe6VtttfF2ZwV1vGf_SYPFg40nZNBKw29L-e_SZfBfA3f2L_dY/pub?gid=1600071350&single=true&output=csv';
loadFinanceSheet(financeSheetUrl, 'finance-card');