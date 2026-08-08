// ==========================================================================
// CODERRA — main.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav scroll state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');

  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    const toTop = document.querySelector('.to-top');
    if (toTop) {
      if (window.scrollY > 500) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      nav.classList.toggle('mobile-open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        nav.classList.remove('mobile-open');
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Terminal typing animation (hero signature) ---------- */
  const terminalBody = document.querySelector('[data-terminal]');
  if (terminalBody) {
    const script = [
      { type: 'cmd', text: 'coderra new project --client "you"' },
      { type: 'out', text: 'Choosing what to build...' },
      { type: 'tags', items: ['SOFTWARE', 'APP', 'WEBSITE'] },
      { type: 'out', text: 'Scoping, designing, shipping.' },
      { type: 'cmd', text: 'coderra deploy --live' },
      { type: 'out', text: '✓ Deployed. Ready for users.' },
    ];

    let lineIndex = 0;

    const typeLine = (text, el, done) => {
      let i = 0;
      const speed = 22;
      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed);
        } else if (done) {
          done();
        }
      };
      tick();
    };

    const runScript = () => {
      if (lineIndex >= script.length) {
        setTimeout(() => {
          terminalBody.innerHTML = '';
          lineIndex = 0;
          runScript();
        }, 2600);
        return;
      }
      const item = script[lineIndex];

      if (item.type === 'tags') {
        const wrap = document.createElement('div');
        wrap.className = 'terminal-tags';
        terminalBody.appendChild(wrap);
        item.items.forEach((tag, i) => {
          setTimeout(() => {
            const el = document.createElement('span');
            el.className = 'ttag';
            el.textContent = tag;
            wrap.appendChild(el);
            requestAnimationFrame(() => el.classList.add('show'));
          }, i * 220);
        });
        setTimeout(() => { lineIndex++; runScript(); }, item.items.length * 220 + 500);
        return;
      }

      const line = document.createElement('div');
      line.className = 'terminal-line';
      if (item.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '❯';
        const textSpan = document.createElement('span');
        line.appendChild(prompt);
        line.appendChild(textSpan);
        terminalBody.appendChild(line);
        typeLine(item.text, textSpan, () => {
          lineIndex++;
          setTimeout(runScript, 400);
        });
      } else {
        const textSpan = document.createElement('span');
        textSpan.className = 'out';
        line.appendChild(textSpan);
        terminalBody.appendChild(line);
        typeLine(item.text, textSpan, () => {
          lineIndex++;
          setTimeout(runScript, 500);
        });
      }
    };

    // Respect reduced motion — show final state instantly
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      terminalBody.innerHTML =
        '<div class="terminal-line"><span class="prompt">❯</span><span>coderra deploy --live</span></div>' +
        '<div class="terminal-line"><span class="out">✓ Deployed. Ready for users.</span></div>' +
        '<div class="terminal-tags"><span class="ttag show">SOFTWARE</span><span class="ttag show">APP</span><span class="ttag show">WEBSITE</span></div>';
    } else {
      runScript();
    }
  }

  /* ---------- Product filter tabs ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        productCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Accordion (pricing FAQ) ---------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const panel = item.querySelector('.accordion-panel');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact form (static — wire to your backend / Formspree) ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // NOTE: This is a front-end only demo. Connect this to a real endpoint
      // (e.g. Formspree, Netlify Forms, or your own API) to actually send email.
      setTimeout(() => {
        status.textContent = 'Thanks — your message has been noted. We\'ll reply within 1 business day.';
        status.className = 'form-status show ok';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    });
  }

});
