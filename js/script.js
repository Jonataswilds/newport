/**
 * JONATAS LAZARINI GUERRA - PORTFOLIO INTERACTIVITY & ANALYTICS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialise Core Modules
  initTheme();
  initNavigation();
  initContactChannels();
  initDownloadHandlers();
  initCareerPipeline();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Theme)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
      
      trackEvent('Alternou Tema para: ' + newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;
  
  if (theme === 'light') {
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggleBtn.setAttribute('title', 'Ativar Modo Escuro');
    themeToggleBtn.setAttribute('aria-label', 'Ativar Modo Escuro');
  } else {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggleBtn.setAttribute('title', 'Ativar Modo Claro');
    themeToggleBtn.setAttribute('aria-label', 'Ativar Modo Claro');
  }
}

/* ==========================================================================
   2. Sticky Header & Mobile Navigation
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active link
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu on clicking any link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

/* ==========================================================================
   3. Multi-Format Resume Downloads (PDF, Word, Text)
   ========================================================================== */

/* ==========================================================================
   5. Multi-Format Resume Downloads (PDF, Word, Text)
   ========================================================================== */
function initDownloadHandlers() {
  const downloadPdfBtns = document.querySelectorAll('[data-download="pdf"]');
  const downloadWordBtns = document.querySelectorAll('[data-download="word"]');
  const downloadTxtBtns = document.querySelectorAll('[data-download="txt"]');

  downloadPdfBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('Download CV: PDF');
      incrementMetric('cv_downloads');
      showToast('Gerando visualização de impressão/PDF do currículo...');
      setTimeout(() => {
        window.print();
      }, 400);
    });
  });

  downloadWordBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackEvent('Download CV: Word (.doc)');
      incrementMetric('cv_downloads');
      showToast('Baixando currículo em formato Word (.doc)...');
    });
  });

  downloadTxtBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackEvent('Download CV: Texto (.txt)');
      incrementMetric('cv_downloads');
      showToast('Baixando currículo em formato Texto (.txt)...');
    });
  });
}

/* ==========================================================================
   6. Direct Contact Channels & Social Tracking
   ========================================================================== */
function initContactChannels() {
  const directChannels = document.querySelectorAll('.contact-channel-item, .social-btn, .contact-bubble, .aodev-contact-bubble, .nav-contact-bubble');
  directChannels.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.channel-title')?.textContent || item.querySelector('span')?.textContent || 'Canal';
      trackEvent(`Contato: Clique em ${label}`);
      incrementMetric('clicks');
    });
  });
}

/* ==========================================================================
   7. Career Pipeline Filtering
   ========================================================================== */
function initCareerPipeline() {
  const filterBtns = document.querySelectorAll('.pipeline-filter-btn');
  const pipelineItems = document.querySelectorAll('.pipeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pipeline');

      pipelineItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-status') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      trackEvent('Filtrar Pipeline Carreira: ' + filter);
    });
  });
}

/* ==========================================================================
   9. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? '<i class="fas fa-exclamation-circle" style="color:var(--accent-rose);"></i>' : '<i class="fas fa-check-circle" style="color:var(--accent-emerald);"></i>';
  toast.innerHTML = `${icon} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   10. Back to top button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
