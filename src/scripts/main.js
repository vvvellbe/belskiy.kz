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

  // Эта функция осталась почти без изменений, но теперь ее вызывает обработчик событий
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
  
  // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: ИСПОЛЬЗУЕМ ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ---
  // Мы вешаем ОДИН обработчик на всю страницу, который будет ловить клики
  // по всем кнопкам с атрибутом [data-modal-trigger="videoModal"], даже по тем, 
  // которые появятся в будущем.
  document.body.addEventListener('click', function(e) {
    // Проверяем, был ли клик по нашей кнопке или внутри нее
    const trigger = e.target.closest('[data-modal-trigger="videoModal"]');
    
    // Если да, то запускаем открытие модального окна
    if (trigger) {
      e.preventDefault(); // Отменяем стандартное поведение (на всякий случай)
      openModal(trigger); // Передаем найденную кнопку в функцию открытия
    }
  });

  // Эти обработчики для закрытия окна остаются как были
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
    
    // Fallback timer in case 'load' event doesn't fire or is slow
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 99) progress = 99; // Don't hit 100% until load
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
         }, 400); // Shorter delay after full load
    };
    
    window.addEventListener('load', onPageLoad);
    
    // Safety timeout to hide preloader anyway after some time
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

    let lastScrollY = window.scrollY; // Запоминаем предыдущую позицию скролла

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Показываем кнопку, если:
        // 1. Мы прокрутили вниз более чем на 300px от верха (чтобы не мелькала на маленьких скроллах)
        // 2. И текущая позиция скролла меньше предыдущей (т.е. скроллим вверх)
        if (currentScrollY > 300 && currentScrollY < lastScrollY) {
            scrollToTopBtn.classList.add('visible');
        } else {
            // Скрываем кнопку, если:
            // 1. Мы прокрутили вверх до самого начала
            // 2. Или мы скроллим вниз
            scrollToTopBtn.classList.remove('visible');
        }

        lastScrollY = currentScrollY; // Обновляем предыдущую позицию скролла
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Проверяем состояние при загрузке страницы (чтобы кнопка не висела, если мы уже вверху)

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
    handleScroll(); // Check state on initial load
}

// --- Запускаем все функции ---

// Эта функция будет выполняться при каждой загрузке страницы в Astro
// src/scripts/main.js (НОВЫЙ, ИСПРАВЛЕННЫЙ КОНЕЦ ФАЙЛА)

// --- Запускаем все функции ---

function initializePageScripts() {
    setupPreloader(); 
    setupRevealAnimation();
    setupVideoModal();
    setupScrollToTop();
    setupNavbarScroll();
}

// Вешаем слушатель для будущих переходов между страницами
document.addEventListener('astro:page-load', initializePageScripts);

// И ВЫЗЫВАЕМ ФУНКЦИЮ СРАЗУ для первой, начальной загрузки страницы.
// Это гарантирует, что setupPreloader() запустится до события window.load.
initializePageScripts();