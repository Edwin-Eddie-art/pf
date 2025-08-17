/* Pro+ JS (complete) */
/* Replace EMAILJS ids with your real ones */
const EMAILJS_SERVICE_ID = "Eddie";
const EMAILJS_TEMPLATE_ID = "template_zasmq17";

document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELOADER ---------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    // animate hero wave slightly on load (visual polish)
    const wave = document.getElementById('wavePath');
    if (wave) wave.style.transform = 'translateY(-6px) scaleX(1.02)';
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      preloader.setAttribute('aria-hidden','true');
      if (wave) wave.style.transform = '';
    }, 600);
  });

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme','dark');

  themeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? '' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = $('#menuBtn');
  const menu = $('#main-menu');
  menuBtn?.addEventListener('click', () => {
    const v = menu.getAttribute('data-visible') === 'true';
    menu.setAttribute('data-visible', String(!v));
    menuBtn.setAttribute('aria-expanded', String(!v));
    menuBtn.querySelector('i').classList.toggle('fa-bars');
    menuBtn.querySelector('i').classList.toggle('fa-times');
  });

  $$('.menu a').forEach(a => a.addEventListener('click', () => {
    if (menu.getAttribute('data-visible') === 'true') {
      menu.setAttribute('data-visible','false');
      menuBtn.setAttribute('aria-expanded','false');
      menuBtn.querySelector('i').classList.remove('fa-times');
      menuBtn.querySelector('i').classList.add('fa-bars');
    }
  }));

  /* ---------- TYPED TEXT ---------- */
  const typedEl = document.getElementById('typing');
  const typedStrings = ['Operations','Process Optimization','Forecasting','Data-driven Decisions'];
  if (window.Typed && typedEl) {
    new Typed('#typing', { strings: typedStrings, typeSpeed: 60, backSpeed: 35, backDelay: 1400, loop: true });
  } else if (typedEl) {
    let ti = 0;
    typedEl.textContent = typedStrings[0];
    setInterval(()=> { typedEl.textContent = typedStrings[++ti % typedStrings.length]; }, 1800);
  }

  /* ---------- PARTICLES (lightweight) ---------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const COUNT = Math.max(10, Math.floor(window.innerWidth / 180));

    function rand(min,max){ return Math.random()*(max-min)+min; }
    for (let i=0;i<COUNT;i++){
      particles.push({x:rand(0,w), y:rand(0,h/2), r:rand(1.2,3.2), vx:rand(-0.35,0.35), vy:rand(0.12,0.6), a:rand(0.06,0.24)});
    }
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize, {passive:true});

    let raf;
    function frame(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y > h*0.65) { p.y = rand(-20,-5); p.x = rand(0,w); }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    frame();
    window.addEventListener('beforeunload', ()=> cancelAnimationFrame(raf));
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  /* ---------- PARALLAX PORTRAIT ---------- */
  const card = document.querySelector('.parallax-card');
  if (card && !prefersReducedMotion) {
    const depth = parseFloat(card.dataset.depth) || 0.06;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2)) / r.width;
      const dy = (e.clientY - (r.top + r.height/2)) / r.height;
      const tx = dx * 18 * depth * -1;
      const ty = dy * 18 * depth * -1;
      card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${dy*6}deg) rotateY(${dx*6}deg)`;
    });
    card.addEventListener('mouseleave', ()=> card.style.transform = '');
    card.addEventListener('focus', ()=> card.style.transform = 'translateY(-6px)');
    card.addEventListener('blur', ()=> card.style.transform = '');
  }

  /* ---------- REVEALS & METERS ---------- */
  const revealEls = $$('.proj-card, .timeline-item, .skill-glass, .about-left, .parallax-card, .trust-item, .proj-thumb');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        // animate any .meter inside
        en.target.querySelectorAll('.meter').forEach(m => {
          const fill = m.querySelector('.meter-fill');
          const v = parseFloat(m.dataset.value) || 0.7;
          fill.style.width = (v * 100) + '%';
        });
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(e => io.observe(e));

  /* ---------- PROJECT FILTERS ---------- */
  const filterBtns = $$('.filter-btn');
  const projCards = $$('.proj-card');

  function applyFilter(filter) {
    projCards.forEach(c => {
      const t = c.dataset.type || '';
      const show = (filter === '*' || t === filter);
      c.style.display = show ? '' : 'none';
      if (show) requestAnimationFrame(()=> c.classList.add('is-visible'));
      else c.classList.remove('is-visible');
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
  applyFilter('*');

  /* ---------- CASE MODAL ---------- */
  const caseModal = $('#caseModal');
  const caseContent = $('#caseContent');
  const caseClose = document.querySelector('.case-close');
  const activeElStack = [];

  const cases = {
    'case-maersk': {
      title: 'Container Booking Errors — Maersk (DMAIC)',
      html: `
        <h2>Container Booking Errors — Maersk (DMAIC)</h2>
        <p><strong>Challenge:</strong> Documentation errors causing delays & penalties.</p>
        <h3>Approach</h3>
        <ul>
          <li>Measure: Baseline error rates and processing times.</li>
          <li>Analyze: Pareto & Fishbone to identify root causes.</li>
          <li>Improve: Standardized templates + QA step.</li>
          <li>Control: KPI dashboard and weekly audits.</li>
        </ul>
        <p><strong>Outcome:</strong> ~40% reduction in errors; 18% faster turnaround.</p>
      `
    },
    'case-bus': {
      title: 'TN Free Bus Travel – Women’s Safety Research',
      html: `
        <h2>TN Free Bus Travel – Women’s Safety Research</h2>
        <p>Research-driven recommendations to improve safety perceptions and service quality for female passengers.</p>
        <ul>
          <li>Survey: 600+ users</li>
          <li>Top issues: lighting, driver behaviour, schedule reliability</li>
          <li>Recommendations: targeted training, female help points, route reliability</li>
        </ul>
      `
    }
  };

  function openCase(key, opener) {
    const data = cases[key];
    if (!data) return;
    caseContent.innerHTML = `<article>${data.html}</article>`;
    caseModal.setAttribute('aria-hidden','false');
    activeElStack.push(document.activeElement);
    caseModal.querySelector('.case-close').focus();
    document.body.style.overflow = 'hidden';
  }

  function closeCase() {
    caseModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    const opener = activeElStack.pop();
    if (opener) opener.focus();
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.btn[data-case]');
    if (b) openCase(b.dataset.case, b);
  });
  caseClose?.addEventListener('click', closeCase);
  caseModal?.addEventListener('click', e => { if (e.target === caseModal) closeCase(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && caseModal.getAttribute('aria-hidden') === 'false') closeCase(); });

  /* ---------- CONTACT FORM ---------- */
  const contactForm = $('#contactForm');
  const responseMessage = $('#responseMessage');

  function showResp(text, ok=true) {
    responseMessage.textContent = text;
    responseMessage.style.color = ok ? 'green' : 'crimson';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.user_name.value.trim();
      const email = contactForm.user_email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !subject || !message) { showResp('Please fill all fields', false); return; }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) { showResp('Please enter a valid email', false); return; }

      showResp('Sending…', true);
      if (typeof emailjs === 'undefined' || !emailjs.sendForm) {
        showResp('Email service not available. Please contact me on LinkedIn: http://www.linkedin.com/in/edwin-09-', false);
        return;
      }
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, '#contactForm')
        .then(()=> { showResp('Message sent — thank you! ✅'); contactForm.reset(); })
        .catch(err => { console.error('EmailJS error', err); showResp('Failed to send — try again later', false); });
    });
  }

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = $('#cursor');
  if (cursor && !prefersReducedMotion) {
    const dot = cursor.querySelector('.cursor-dot');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.opacity = '1';
    });
    $$('.btn, a, button').forEach(el => {
      el.addEventListener('mouseenter', ()=> dot.style.transform = 'scale(1.6)');
      el.addEventListener('mouseleave', ()=> dot.style.transform = 'scale(1)');
    });
    document.addEventListener('mouseleave', ()=> cursor.style.opacity = '0');
  } else if (cursor) cursor.style.display = 'none';

  /* ---------- SMALL A11Y SHORTCUTS ---------- */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#search')?.focus();
    }
    if (e.key === 'Home') window.scrollTo({top:0, behavior:'smooth'});
    if (e.key === 'End') window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
  });
});
