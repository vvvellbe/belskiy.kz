// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setupPreloader();
    setupHeroVideo();
    setupTypingEffect();
    setupCtaButtonLogic(); // Изменена
    setupContentToggles();
    setupRepertoireToggle();
    setupModals();
    setupScrollToTop(); // Изменена
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

// --- NAVIGATION & CTA LOGIC (ИЗМЕНЕНА) ---
function setupCtaButtonLogic() {
    const heroCta = document.getElementById('heroCtaButton');
    const navCta = document.getElementById('navCtaButton');
    const hero = document.getElementById('hero');
    const nav = document.querySelector('nav');

    if (!navCta || !hero || !nav) return;

    // heroCta может отсутствовать, поэтому делаем проверку
    const updateCtaVisibility = () => {
        // Условие: кнопка в шапке появляется, когда нижняя часть hero-секции оказывается выше, чем высота шапки
        const showNavButton = hero.getBoundingClientRect().bottom < nav.offsetHeight;

        if (heroCta) {
            heroCta.classList.toggle('opacity-0', showNavButton);
            heroCta.classList.toggle('pointer-events-none', showNavButton);
        }
        navCta.classList.toggle('visible', showNavButton);
    };

    window.addEventListener('scroll', updateCtaVisibility);
    // Вызываем функцию при загрузке, чтобы установить начальное состояние
    updateCtaVisibility();
}


function setupNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateNavScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }
    
    function updateActiveLink() {
        const scrollY = window.scrollY;
        
        if (scrollY < 200) {
             navLinks.forEach(link => link.classList.remove('active-link'));
             return;
        }

        let currentSectionId = '';
        const navHeight = nav.offsetHeight;
        
        if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 5) {
            currentSectionId = 'contact';
        } else {
            for (const section of sections) {
                const sectionTop = section.offsetTop - navHeight - 100;
                if (scrollY >= sectionTop) {
                    currentSectionId = section.id;
                }
            }
        }
        
        navLinks.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${currentSectionId}`);
        });
    }

    setupMobileMenu();
    window.addEventListener('scroll', () => {
        updateNavScroll();
        updateActiveLink();
    });
    
    window.addEventListener('load', () => {
        updateNavScroll();
        updateActiveLink();
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

// --- CONTENT TOGGLES ---
function setupContentToggles() {
    document.querySelectorAll('.tabs').forEach(tabsContainer => {
        const glider = tabsContainer.querySelector('.glider');
        const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
        const contentPanels = tabsContainer.closest('section').querySelectorAll('.content-panel');

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

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateGlider(button);
                contentPanels.forEach(panel => {
                    panel.classList.toggle('active', panel.id === button.dataset.target);
                });
            });
        });

        const initGlider = () => updateGlider(tabsContainer.querySelector('.tab-btn.active'));
        
        setTimeout(initGlider, 100);
        window.addEventListener('resize', initGlider);
    });
}

// --- REPERTOIRE TOGGLE ---
function setupRepertoireToggle() {
    const toggleBtn = document.getElementById('toggleRepertoireBtn');
    const container = document.getElementById('hidden-repertoire-container');
    
    // Находим последний видимый трек (10-й), который находится прямо перед скрытым контейнером.
    // Это наш новый, надежный "якорь" для прокрутки.
    const lastVisibleTrack = document.querySelector('.repertoire-list > #hidden-repertoire-container')?.previousElementSibling;

    if (!toggleBtn || !container || !lastVisibleTrack) return;
    
    toggleBtn.addEventListener('click', () => {
        const isExpanded = container.style.maxHeight && container.style.maxHeight !== "0px";
        if (isExpanded) {
            // Теперь мы прокручиваем к последнему видимому треку.
            // опция 'block: 'nearest'' плавно прокрутит к элементу, если он не на экране,
            // и не будет делать ничего, если он уже виден.
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


// --- MODALS (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
function setupModals() {
    // Используем делегирование событий для всех кликов в body
    document.body.addEventListener('click', e => {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (!trigger) return;

        e.preventDefault();

        const modalId = trigger.dataset.modalTrigger;
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Стандартная логика для открытия модального окна
        const videoIframe = modal.querySelector('iframe');
        if (videoIframe && trigger.dataset.videoSrc) {
            const videoSrc = trigger.dataset.videoSrc;
            const isInstagram = videoSrc.includes('instagram.com');
            
            // Используем стандартный URL для встраивания YouTube
            let finalSrc = isInstagram ? videoSrc : `https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0`;
            
            videoIframe.src = finalSrc;
            modal.querySelector('.video-iframe-container')?.classList.toggle('instagram-vertical', isInstagram);
            modal.querySelector('.modal-content')?.classList.toggle('modal-instagram-vertical-content', isInstagram);
        }
        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Логика закрытия модальных окон
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            const videoIframe = modal.querySelector('iframe');
            if (videoIframe) {
                // Прекращаем воспроизведение видео при закрытии
                setTimeout(() => { videoIframe.src = ''; }, 400);
            }
        };

        modal.querySelector('.modal-close-btn')?.addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    });

    // Закрытие по клавише Escape
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
// --- SCROLL TO TOP (ИЗМЕНЕНА) ---
function setupScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;

    let lastScrollY = window.scrollY;

    // Плавный скролл наверх по клику
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Появление/скрытие кнопки в зависимости от направления скролла
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Показываем кнопку только если скроллим ВВЕРХ и находимся ниже определенной точки (например, 300px)
        if (currentScrollY < lastScrollY && currentScrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
        
        // Обновляем позицию для следующего события скролла
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
