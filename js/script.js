// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupPreloader();
  setupHeroVideo();
  setupTypingEffect();
  setupCtaButtonLogic();
  setupContentToggles();
  setupRepertoireToggle();
  setupModals();
  setupScrollToTop();
  setupRevealAnimation();
  setupNavigation();
  setupAccordion();
});

// --- PRELOADER LOGIC ---
function setupPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const dynamicLoadingTextElement = preloader.querySelector('.loading-text');
  const loadingMessages = [
    "Готовим сцену...", "Настраиваем микрофоны...", "Магия AI загружается...",
    "Создаем атмосферу праздника...", "Валерий Бельский уже в пути!"
  ];
  let currentMessageIndex = 0;
  let progressInterval;

  function updateProgress(percentage) {
    if (progressBar && progressText) {
      const p = Math.min(percentage, 100);
      progressBar.style.width = p + '%';
      progressText.textContent = Math.round(p) + '%';
    }
  }

  function changeLoadingMessage() {
    if (dynamicLoadingTextElement) {
      dynamicLoadingTextElement.style.opacity = 0;
      setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
        dynamicLoadingTextElement.textContent = loadingMessages[currentMessageIndex];
        dynamicLoadingTextElement.style.opacity = 1;
      }, 300);
    }
  }

  function simulateProgress() {
    let simulatedProgress = 0;
    const totalSimulationTime = 2500;
    const intervalTime = 50;
    const increment = 100 / (totalSimulationTime / intervalTime);
    const messageInterval = setInterval(changeLoadingMessage, 2000);

    progressInterval = setInterval(() => {
      simulatedProgress += increment;
      updateProgress(simulatedProgress);
      if (simulatedProgress >= 100) {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      }
    }, intervalTime);
  }

  document.body.classList.add('body-preloading');
  simulateProgress();

  window.addEventListener('load', () => {
    clearInterval(progressInterval);
    updateProgress(100);
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => document.body.classList.remove('body-preloading'), 800);
    }, 500);
  });
}

// --- HERO VIDEO ---
function setupHeroVideo() {
  const heroVideo = document.getElementById('hero-video-1');
  if (heroVideo) {
    heroVideo.loop = true;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.info("Autoplay was prevented:", error);
      });
    }
  }
}

// --- TYPING EFFECT ---
function setupTypingEffect() {
  const typingElement = document.getElementById('typing-subtitle');
  if (!typingElement) return;

  const subtitles = [
    "Искрометный Ведущий с AI-Фишками", "Интеллектуальный Юмор и Драйв",
    "Новый Формат Развлечений", "Глубокая персонализация", "Алматинский Эминем"
  ];
  let subtitleIndex = 0, charIndex = 0;
  const typingSpeed = 100, erasingSpeed = 50, delayBetween = 2000;

  function type() {
    if (charIndex < subtitles[subtitleIndex].length) {
      typingElement.textContent += subtitles[subtitleIndex].charAt(charIndex++);
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, delayBetween);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typingElement.textContent = subtitles[subtitleIndex].substring(0, --charIndex);
      setTimeout(erase, erasingSpeed);
    } else {
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
      setTimeout(type, typingSpeed);
    }
  }
  setTimeout(type, 500);
}

// --- NAVIGATION & CTA LOGIC ---
function setupCtaButtonLogic() {
  const heroCta = document.getElementById('heroCtaButton');
  const navCta = document.getElementById('navCtaButton');
  const hero = document.getElementById('hero');
  const nav = document.querySelector('nav');

  if (!navCta || !hero || !nav) return;

  const updateCtaVisibility = () => {
    const showNavButton = hero.getBoundingClientRect().bottom < nav.offsetHeight;

    if (heroCta) {
      heroCta.classList.toggle('opacity-0', showNavButton);
      heroCta.classList.toggle('pointer-events-none', showNavButton);
    }
    navCta.classList.toggle('visible', showNavButton);
  };

  window.addEventListener('scroll', updateCtaVisibility);
  updateCtaVisibility();
}


function setupNavigation() {
 const nav = document.querySelector('nav');
 if (!nav) return;

 const sections = Array.from(document.querySelectorAll('section[id]'));
 const navLinks = document.querySelectorAll('nav a[href]');

 function updateNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
 }

 function updateActiveLink() {
  const scrollY = window.scrollY;
  let currentSectionId = '';
  const navHeight = nav.offsetHeight;
 
  const isAtBottom = (window.innerHeight + scrollY) >= document.body.offsetHeight - 5;
  
  if (isAtBottom) {
   currentSectionId = 'contact';
  } else {
   for (const section of sections) {
    const sectionTop = section.offsetTop - navHeight - 100;
    if (scrollY >= sectionTop) {
     currentSectionId = section.id;
    }
   }
  }
 
  if (scrollY < 200) {
   currentSectionId = '';
  }
 
  navLinks.forEach(link => {
   const linkHref = link.getAttribute('href');
   if (linkHref.startsWith('#')) {
    link.classList.toggle('active-link', linkHref === `#${currentSectionId}`);
   }
  });
 }

 setupMobileMenu();

 const handleScroll = () => {
  updateNavScroll();
  updateActiveLink();
 };

 window.addEventListener('load', () => {
  updateNavScroll();
  const hash = window.location.hash;

  if (hash) {
   const correctLink = document.querySelector(`nav a[href="${hash}"]`);

   if (correctLink) {
    // Начинаем принудительно выставлять правильный класс
    let assertionCount = 0;
    const assertionInterval = setInterval(() => {
     navLinks.forEach(link => link.classList.remove('active-link'));
     correctLink.classList.add('active-link');
     assertionCount++;
     // После 10 повторений (500мс) прекращаем и включаем обычный скролл
     if (assertionCount >= 10) {
      clearInterval(assertionInterval);
      window.addEventListener('scroll', handleScroll);
     }
    }, 50);
   } else {
    // Если ссылка на якорь не найдена, просто включаем скролл
    window.addEventListener('scroll', handleScroll);
   }
  } else {
   // Если нет якоря, просто запускаем стандартную логику
   updateActiveLink();
   window.addEventListener('scroll', handleScroll);
  }
 });
}
function setupMobileMenu() {
  const menuButton = document.getElementById('burger-menu-button');
  const menuItems = document.getElementById('mobile-menu-items');
  const burgerIcon = menuButton?.querySelector('.burger-icon');

  if (!menuButton || !menuItems || !burgerIcon) return;

  menuButton.addEventListener('click', () => {
    menuItems.classList.toggle('open');
    burgerIcon.classList.toggle('open');
  });

  menuItems.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      menuItems.classList.remove('open');
      burgerIcon.classList.remove('open');
    });
  });
}

function setupContentToggles() {
  document.querySelectorAll('.tabs').forEach(tabsContainer => {
    const glider = tabsContainer.querySelector('.glider');
    const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    const section = tabsContainer.closest('section');
    
    // --- УНИВЕРСАЛЬНЫЙ ФИКС: ---
    // Находим ВСЕ панели в секции, а затем отфильтровываем вложенные.
    // Это гарантирует, что мы работаем только с панелями верхнего уровня,
    // независимо от HTML-структуры в разных секциях.
    const allPanelsInScope = Array.from(section.querySelectorAll('.content-panel'));
    const contentPanels = allPanelsInScope.filter(panel => !panel.parentElement.closest('.content-panel'));

    function updateGlider(targetButton) {
      if (!glider || !targetButton) return;
      if (window.innerWidth > 640) {
        glider.style.width = `${targetButton.offsetWidth}px`;
        glider.style.height = 'calc(100% - 10px)';
        glider.style.transform = `translateX(${targetButton.offsetLeft - 5}px)`;
      } else {
        glider.style.width = 'calc(100% - 10px)';
        glider.style.height = `${targetButton.offsetHeight}px`;
        glider.style.transform = `translateY(${targetButton.offsetTop}px)`;
      }
    }

    function switchPanels(button) {
      if (button.classList.contains('active')) return;
      const targetPanelId = button.dataset.target;
      const targetPanel = section.querySelector(`#${targetPanelId}`);
      if (!targetPanel) return;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      updateGlider(button);

      // Эта операция теперь безопасна для всех страниц.
      contentPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
      });

      targetPanel.classList.add('active');
      targetPanel.style.display = 'block';
      
      // Вызов события оставляем, он нужен для калькулятора и не мешает главной.
      document.dispatchEvent(new CustomEvent('calculatorModeChanged'));
    }

    tabButtons.forEach(button => {
      button.addEventListener('click', () => switchPanels(button));
    });

    const initGlider = () => {
      const activeButton = tabsContainer.querySelector('.tab-btn.active');
      if (activeButton) {
        updateGlider(activeButton);
      }
    };
    
    setTimeout(initGlider, 100);
    window.addEventListener('resize', initGlider);
  });
}

// --- REPERTOIRE TOGGLE ---
// --- ЗАМЕНИТЬ СТАРУЮ ФУНКЦИЮ НА ЭТУ ---
function setupRepertoireToggle() {
  const toggleBtn = document.getElementById('toggleRepertoireBtn');
  const container = document.getElementById('hidden-repertoire-container');
  const lastVisibleTrack = document.querySelector('.repertoire-list > #hidden-repertoire-container')?.previousElementSibling;

  if (!toggleBtn || !container || !lastVisibleTrack) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = container.style.maxHeight && container.style.maxHeight !== "0px";
    
    if (isExpanded) {
      lastVisibleTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      container.style.maxHeight = "0px";
      toggleBtn.textContent = 'Показать весь репертуар';
    } else {
      container.style.maxHeight = container.scrollHeight + "px";
      toggleBtn.textContent = 'Скрыть репертуар';
    }
  });
}

// --- ACCORDION FOR SETLISTS ---
function setupAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');
     
      if (isActive) {
        header.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        header.classList.add('active');
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}


// --- MODALS ---
function setupModals() {
  document.body.addEventListener('click', e => {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (!trigger) return;

    // Prevent default only if it's not a creative card in configurator
    if (!trigger.closest('#creative-options')) {
      e.preventDefault();
    }

    const modalId = trigger.dataset.modalTrigger;
    const modal = document.getElementById(modalId);
    if (!modal) return;
   
    // This part is for video modals specifically
    if (modalId === 'videoModal' && trigger.dataset.videoSrc) {
      const videoIframe = modal.querySelector('iframe');
      const videoSrc = trigger.dataset.videoSrc;
      const isInstagram = videoSrc.includes('instagram.com');
      let finalSrc = isInstagram ? videoSrc : `https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0`;
     
      videoIframe.src = finalSrc;
      modal.querySelector('.video-iframe-container')?.classList.toggle('instagram-vertical', isInstagram);
      modal.querySelector('.modal-content')?.classList.toggle('modal-instagram-vertical-content', isInstagram);
    }
   
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // --- FIXED: Use event delegation for close buttons ---
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      const videoIframe = modal.querySelector('iframe');
      if (videoIframe) {
        setTimeout(() => { videoIframe.src = ''; }, 400);
      }
    };

    modal.addEventListener('click', e => {
      // Close if the overlay is clicked
      if (e.target === modal) {
        closeModal();
      }
      // Close if any element with .modal-close-btn is clicked inside
      if (e.target.closest('.modal-close-btn')) {
        closeModal();
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        const videoIframe = modal.querySelector('iframe');
        if (videoIframe) {
          setTimeout(() => { videoIframe.src = ''; }, 400);
        }
      });
    }
  });
}


// --- GENERIC HELPERS ---
function setupScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;

  let lastScrollY = window.scrollY;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY && currentScrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
   
    lastScrollY = currentScrollY;
  });
}


function setupRevealAnimation() {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// --- FOOTER YEAR ---
const currentYearEl = document.getElementById('currentYear');
if(currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}
