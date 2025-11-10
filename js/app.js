
function toggleMenu(){
  document.querySelector('.menu').classList.toggle('show');
}

const elements = document.querySelectorAll('.fade-in');
function animateOnScroll(){
  elements.forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      el.classList.add('show');
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
animateOnScroll();
