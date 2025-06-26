
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  links.classList.toggle('nav-open');
});
