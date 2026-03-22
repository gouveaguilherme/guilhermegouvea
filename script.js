/* ══════════════════════════════════════════
   script.js — Portfólio Profissional
══════════════════════════════════════════ */

// ── TEMA CLARO / ESCURO ──────────────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Aplica o tema salvo (ou dark por padrão)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


// ── MENU HAMBURGER (MOBILE) ──────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Fecha o menu ao clicar em qualquer link interno
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── ANIMAÇÃO DAS BARRAS DE IDIOMAS ───────────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target); // Dispara só uma vez
    }
  });
}, { threshold: 0.3 });

const idiomasSection = document.querySelector('.idiomas');
if (idiomasSection) barObserver.observe(idiomasSection);


// ── FILTRO DO PORTFÓLIO ──────────────────────────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualiza estado visual dos botões
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? 'block' : 'none';
    });
  });
});


// ── MODAL ────────────────────────────────────────────────────────────────────
const modal      = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

function showModal(icon, title, text) {
  document.getElementById('modalIcon').textContent  = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent  = text;
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(); // Fecha ao clicar fora
});


// ── VALIDAÇÃO DO FORMULÁRIO ───────────────────────────────────────────────────
const form = document.getElementById('contactForm');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(inputId, errorId, hasError) {
  const input  = document.getElementById(inputId);
  const errEl  = document.getElementById(errorId);
  if (hasError) {
    input.classList.add('error');
    errEl.classList.add('show');
  } else {
    input.classList.remove('error');
    errEl.classList.remove('show');
  }
}

// Validação em tempo real (limpa o erro enquanto o usuário digita)
['nome', 'mensagem'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    if (this.value.trim()) setError(id, `${id}-error`, false);
  });
});

document.getElementById('email').addEventListener('input', function () {
  if (validateEmail(this.value.trim())) setError('email', 'email-error', false);
});

// Envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  let hasError = false;

  // Valida nome
  if (!nome) {
    setError('nome', 'nome-error', true);
    hasError = true;
  } else {
    setError('nome', 'nome-error', false);
  }

  // Valida e-mail
  if (!email || !validateEmail(email)) {
    setError('email', 'email-error', true);
    hasError = true;
  } else {
    setError('email', 'email-error', false);
  }

  // Valida mensagem
  if (!mensagem) {
    setError('mensagem', 'mensagem-error', true);
    hasError = true;
  } else {
    setError('mensagem', 'mensagem-error', false);
  }

  if (hasError) return;

  // Simula envio: estado de loading
  const btn     = document.getElementById('submitBtn');
  const txtSpan = document.getElementById('submitText');
  const icoSpan = document.getElementById('submitIcon');

  btn.disabled     = true;
  txtSpan.textContent = 'Enviando...';
  icoSpan.textContent = '⏳';

  await new Promise(resolve => setTimeout(resolve, 1800));

  // Restaura botão e limpa formulário
  btn.disabled     = false;
  txtSpan.textContent = 'Enviar Mensagem';
  icoSpan.textContent = '→';
  form.reset();

  // Exibe modal de sucesso
  showModal(
    '✅',
    'Mensagem enviada com sucesso!',
    `Obrigado, ${nome}! Sua mensagem foi recebida. Retornarei em breve para ${email}.`
  );
});


// ── DESTAQUE DO LINK ATIVO NA NAV ─────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--blue)'
      : '';
  });
}, { passive: true });
