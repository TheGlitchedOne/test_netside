// Sett år i footeren
document.getElementById('year').textContent = new Date().getFullYear();


// Telleknapp-funksjonalitet
let count = 0;
const countEl = document.getElementById('count');
document.getElementById('increase').addEventListener('click', () => {
count++;
countEl.textContent = count;
});
document.getElementById('decrease').addEventListener('click', () => {
count = Math.max(0, count - 1);
countEl.textContent = count;
});


// Mørkt tema-toggle (lagres i localStorage)
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
if(theme === 'dark') document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');
}
const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(saved);
themeToggle.textContent = saved === 'dark' ? 'Lyst tema' : 'Mørkt tema';


themeToggle.addEventListener('click', () => {
const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
applyTheme(next);
localStorage.setItem('theme', next);
themeToggle.textContent = next === 'dark' ? 'Lyst tema' : 'Mørkt tema';
});


// Enkel form-håndtering (ingen server her — bare simulerer)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
e.preventDefault();
const data = new FormData(form);
const name = data.get('name');
status.textContent = `Takk, ${name}! Meldingen er sendt (lokalt).`;
form.reset();
});