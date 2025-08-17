// Helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Update year (footer)
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Nav toggle (mobile)
const navToggle = $('#nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const navlist = $('#navlist');
    navlist.classList.toggle('show');
  });
}

// Scroll reveal
const reveals = $$('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.18 });
reveals.forEach(r => revealObserver.observe(r));

// Skills animation
const skillFills = $$('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.percent + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });
skillFills.forEach(s => skillObserver.observe(s));

// Asset image optimization: ensure object-fit for all .asset-img
const assetImgs = $$('.asset-img');
assetImgs.forEach(img => img.setAttribute('loading', 'lazy'));

// Nut & Bolt canvas animation (GLOBAL BACKGROUND)
const canvas = $('#nutBoltCanvas');
const ctx = canvas.getContext('2d');
let w = 0, h = 0, bolts = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

function createBolts(count = 42) {
  bolts = [];
  for (let i = 0; i < count; i++) {
    bolts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 16 + 10,
      dx: (Math.random() - 0.5) * 0.9,
      dy: (Math.random() - 0.5) * 0.9,
      angle: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      tint: (Math.random() * 0.6) + 0.4
    });
  }
}
createBolts();

function drawNut(b) {
  const { x, y, size, angle, tint } = b;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle * Math.PI / 180);

  // outer hexagon (nut)
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const theta = (i * Math.PI) / 3;
    const px = size * Math.cos(theta);
    const py = size * Math.sin(theta);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();

  // metallic gradient fill
  const g = ctx.createLinearGradient(-size, -size, size, size);
  g.addColorStop(0, `rgba(${200 * tint}, ${200 * tint}, ${200 * tint}, 1)`);
  g.addColorStop(1, `rgba(${110 * tint}, ${110 * tint}, ${110 * tint}, 1)`);
  ctx.fillStyle = g;
  ctx.fill();

  // stroke
  ctx.lineWidth = Math.max(2, size * 0.12);
  ctx.strokeStyle = `rgba(255,255,255,0.12)`;
  ctx.stroke();

  // inner hole
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.36, 0, Math.PI * 2);
  ctx.fillStyle = '#0b0b0b';
  ctx.fill();
  ctx.lineWidth = Math.max(1, size * 0.07);
  ctx.strokeStyle = `rgba(255,255,255,0.08)`;
  ctx.stroke();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  for (let b of bolts) {
    drawNut(b);
    b.x += b.dx;
    b.y += b.dy;
    b.angle += b.rotationSpeed;

    // wrap around or bounce
    if (b.x < -50) b.x = w + 50;
    if (b.x > w + 50) b.x = -50;
    if (b.y < -50) b.y = h + 50;
    if (b.y > h + 50) b.y = -50;
  }
  requestAnimationFrame(animate);
}
animate();

// EmailJS contact form (uses your EmailJS public key already initialized above)
const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const status = $('#form-status');
    status.textContent = 'Sending…';
    // Replace 'Eddie' and 'template_zasmq17' if your EmailJS service/template have different ids.
    emailjs.sendForm('Eddie', 'template_zasmq17', '#contactForm')
      .then(() => {
        status.textContent = 'Message sent! ✅';
        contactForm.reset();
      })
      .catch((err) => {
        console.error('EmailJS error', err);
        status.textContent = 'Failed to send. Try again later.';
      });
  });
}
