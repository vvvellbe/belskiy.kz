// --- Функция для плавного появления элементов при скролле ---
function setupRevealAnimation() {
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };
  const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

// --- Логика для модального окна видео ---
function setupVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (!(modal instanceof HTMLElement) || !(iframe instanceof HTMLIFrameElement)) return;

  const modalEl = modal;
  const iframeEl = iframe;
  const modalContent = modalEl.querySelector('.modal-content');
  const iframeContainer = modalEl.querySelector('.video-iframe-container');
  const closeBtn = modalEl.querySelector('.modal-close-btn');

  const closeModal = () => {
    modalEl.classList.remove('open');
    setTimeout(() => {
      iframeEl.setAttribute('src', '');
      if (iframeContainer && modalContent) {
        iframeContainer.classList.remove('instagram-vertical');
        modalContent.classList.remove('modal-instagram-vertical-content');
      }
      document.removeEventListener('keydown', onEsc);
    }, 400); 
  };
  
  const closeModalRef = closeModal;

  function onEsc(ev) {
    if (ev.key === 'Escape') closeModalRef();
  }

  function onModalClick(e) {
    if (e.target === modalEl) closeModalRef();
  }

  function openModal(triggerElement) {
    const videoSrc = triggerElement.dataset ? triggerElement.dataset.videoSrc : null;
    if (!videoSrc) return;

    let embedUrl = videoSrc;
    if (videoSrc.includes('instagram.com')) {
      embedUrl = videoSrc;
    } else if (!videoSrc.includes('embed')) {
      embedUrl = `https://www.youtube.com/embed/${videoSrc}?autoplay=1`;
    }

    const isInstagram = videoSrc.includes('instagram.com');
    if (iframeContainer && modalContent) {
      iframeContainer.classList.toggle('instagram-vertical', isInstagram);
      modalContent.classList.toggle('modal-instagram-vertical-content', isInstagram);
    }

    iframeEl.setAttribute('src', embedUrl);
    modalEl.classList.add('open');
    document.addEventListener('keydown', onEsc);
  }
  
  document.body.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-modal-trigger="videoModal"]');
    
    if (trigger) {
      e.preventDefault();
      openModal(trigger);
    }
  });

  if (closeBtn instanceof HTMLElement) closeBtn.addEventListener('click', closeModal);
  modalEl.addEventListener('click', onModalClick);
}

// --- Логика для прелоадера ---
function setupPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('body-preloading');

    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 99) progress = 99;
        if(progressBar) progressBar.style.width = progress + '%';
        if(progressText) progressText.textContent = progress + '%';
    }, 150);

    const onPageLoad = () => {
         clearInterval(interval);
         if(progressBar) progressBar.style.width = '100%';
         if(progressText) progressText.textContent = '100%';
         setTimeout(() => {
           preloader.classList.add('hidden');
           document.body.classList.remove('body-preloading');
         }, 400);
    };
    
    window.addEventListener('load', onPageLoad);
    
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
           onPageLoad();
        }
    }, 5000); 
}

// --- Логика для кнопки "Наверх" ---
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 300 && currentScrollY < lastScrollY) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Логика для навигации (изменение при скролле) ---
function setupNavbarScroll() {
    const nav = document.querySelector('nav');
    const navCtaButton = document.getElementById('navCtaButton');
    if(!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            navCtaButton?.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            navCtaButton?.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// --- НАЧАЛО НОВОГО КОДА ---
// --- Логика для подсветки активного пункта в нижней навигации ---
function setupBottomNavHighlighting() {
  const navLinks = document.querySelectorAll('.nav-item[data-nav-item]');
  if (navLinks.length === 0) return;

  const currentPath = window.location.pathname;

  // --- Часть 1: Подсветка для конкретных страниц (например, /configurator) ---
  let isPageSpecific = false;
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    const cleanCurrentPath = currentPath.replace(/\/$/, '');
    
    if (linkPath === cleanCurrentPath && cleanCurrentPath !== '') {
      link.classList.add('active');
      isPageSpecific = true;
    } else {
      link.classList.remove('active');
    }
  });

  if (isPageSpecific) {
    return;
  }

  // --- Часть 2: Финальная логика слежения за скроллом на главной странице ---
  const sections = Array.from(navLinks)
    .map(link => {
      const hash = new URL(link.href).hash;
      if (hash) return document.querySelector(hash);
      return null;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const observerOptions = {
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      const activeLink = document.querySelector(`.nav-item[data-nav-item="${sectionId}"]`);
      if (!activeLink) return;

      if (entry.isIntersecting) {
        // Секция вошла в зону видимости.
        // Сначала гасим все остальные, чтобы активной была только одна.
        navLinks.forEach(link => link.classList.remove('active'));
        // А затем подсвечиваем нужную.
        activeLink.classList.add('active');
      } else {
        // Секция покинула зону видимости, просто гасим ее.
        activeLink.classList.remove('active');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
}
// --- КОНЕЦ НОВОГО КОДА ---


// --- Запускаем все функции ---
function initializePageScripts() {
    setupPreloader(); 
    setupRevealAnimation();
    setupVideoModal();
    setupScrollToTop();
    setupNavbarScroll();
    setupBottomNavHighlighting(); // <-- ВЫЗЫВАЕМ НАШУ НОВУЮ ФУНКЦИЮ
}

document.addEventListener('astro:page-load', initializePageScripts);

initializePageScripts();