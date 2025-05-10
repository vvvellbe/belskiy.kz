// Файл: script.js

// --- Логика для обновленного прелоадера ---
const preloader = document.getElementById('preloader');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
let progressInterval;
let currentProgress = 0;

function updateProgress(percentage) {
    if (progressBar && progressText) {
        currentProgress = Math.min(percentage, 100); // Ограничиваем 100%
        progressBar.style.width = currentProgress + '%';
        progressText.textContent = Math.round(currentProgress) + '%';
    }
}

function simulateProgress() {
    let simulatedProgress = 0;
    const totalSimulationTime = 2500; // Общее время симуляции в мс (например, 2.5 секунды)
    const intervalTime = 50; // Интервал обновления в мс
    const increment = (100 / (totalSimulationTime / intervalTime));

    progressInterval = setInterval(() => {
        simulatedProgress += increment;
        if (simulatedProgress >= 100) {
            updateProgress(100);
            clearInterval(progressInterval);
            // Не скрываем прелоадер здесь, ждем window.onload
        } else {
            updateProgress(simulatedProgress);
        }
    }, intervalTime);
}

// Начинаем симуляцию прогресса как только DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    if (preloader && progressBar && progressText) {
        simulateProgress();
    }

    // Запуск эффекта печати, если элемент существует
    if (typingElement) {
        setTimeout(typeSubtitle, 500); // Небольшая задержка перед началом
    }
    // Вызов для начальной установки состояния CTA кнопок (важно после полной загрузки DOM и стилей)
    setTimeout(setInitialCtaButtonState, 100);

    // Инициализация активной ссылки в навигации
    if (sections.length > 0 && (navLinksDesktop.length > 0 || navLinksMobile.length > 0)) {
        changeActiveLink();
    }
});


// Скрываем прелоадер после полной загрузки всех ресурсов страницы
window.addEventListener('load', () => {
    clearInterval(progressInterval); // Останавливаем симуляцию, если она еще идет
    updateProgress(100); // Убедимся, что прогресс 100%

    if (preloader) {
        // Небольшая задержка перед скрытием, чтобы пользователь увидел 100%
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 300); // 300 мс задержка
    }
});
// --- Конец логики для обновленного прелоадера ---


// Автовоспроизведение фонового видео на главном экране
const heroVideo = document.getElementById('hero-video-1');
if (heroVideo) {
    heroVideo.loop = true;
    heroVideo.muted = true; // Видео должно быть без звука для автовоспроизведения в большинстве браузеров
    heroVideo.playsInline = true; // Для корректного воспроизведения на iOS
    heroVideo.preload = 'auto'; // Браузер сам решит, когда начать загрузку
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Автовоспроизведение может быть заблокировано браузером, особенно если вкладка неактивна или звук не выключен.
            console.error("Ошибка автовоспроизведения фонового видео:", error);
        });
    }
}

// Логика для отображения/скрытия кнопки "Заказать Мероприятие" в навигации и на главном экране
const heroCtaButton = document.getElementById('heroCtaButton');
const navCtaButton = document.getElementById('navCtaButton');
const heroSection = document.getElementById('hero');
const navElement = document.querySelector('nav');
const desktopMenuLinks = document.getElementById('desktop-menu-links');

// Функция для установки начального состояния CTA кнопок при загрузке страницы
function setInitialCtaButtonState() {
    if (!heroCtaButton || !navCtaButton || !heroSection || !navElement) return;
    const heroRect = heroSection.getBoundingClientRect();
    const navHeight = navElement.offsetHeight;

    if (heroRect.bottom < navHeight) { // Если нижняя граница hero-секции выше нижней границы навбара
        // Показываем кнопку в навбаре, скрываем на hero
        heroCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        heroCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');

        navCtaButton.style.width = 'auto';
        navCtaButton.style.paddingLeft = '1.25rem'; // px-5
        navCtaButton.style.paddingRight = '1.25rem'; // px-5
        navCtaButton.style.marginLeft = desktopMenuLinks && desktopMenuLinks.classList.contains('lg:px-4') ? '1rem' : '0.75rem'; // ml-4 или ml-3
        navCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
        navCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
        if(desktopMenuLinks) desktopMenuLinks.style.marginRight = '0'; // Убираем авто-отступ справа у ссылок меню
    } else {
        // Показываем кнопку на hero, скрываем в навбаре
        heroCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
        heroCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');

        navCtaButton.style.width = '0';
        navCtaButton.style.paddingLeft = '0';
        navCtaButton.style.paddingRight = '0';
        navCtaButton.style.marginLeft = '0';
        navCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        navCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
        if(desktopMenuLinks) desktopMenuLinks.style.marginRight = 'auto'; // Возвращаем авто-отступ
    }
}

// Инициализация состояния CTA кнопок
if (heroCtaButton && navCtaButton && heroSection && navElement) {
    // Начальное состояние: кнопка на hero видима, в навбаре скрыта
    heroCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    heroCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');

    navCtaButton.style.width = '0'; // Начальная ширина 0 для анимации
    navCtaButton.style.paddingLeft = '0';
    navCtaButton.style.paddingRight = '0';
    navCtaButton.style.marginLeft = '0';
    navCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
    navCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');

    // Обработчик скролла для смены состояния кнопок
    window.addEventListener('scroll', () => {
        const heroRect = heroSection.getBoundingClientRect();
        const navHeight = navElement.offsetHeight;

        if (heroRect.bottom < navHeight) { // Если герой-секция проскроллена вверх за пределы навбара
            // Показываем кнопку в навбаре, если она еще не показана
            if (!navCtaButton.classList.contains('opacity-100')) {
                heroCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                heroCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');

                navCtaButton.style.width = 'auto';
                navCtaButton.style.paddingLeft = '1.25rem';
                navCtaButton.style.paddingRight = '1.25rem';
                navCtaButton.style.marginLeft = desktopMenuLinks && desktopMenuLinks.classList.contains('lg:px-4') ? '1rem' : '0.75rem';
                navCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
                navCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                if(desktopMenuLinks) desktopMenuLinks.style.marginRight = '0';
            }
        } else { // Если герой-секция еще видна
            // Показываем кнопку на hero, если она еще не показана
            if (!heroCtaButton.classList.contains('opacity-100')) {
                heroCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
                heroCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');

                navCtaButton.style.width = '0';
                navCtaButton.style.paddingLeft = '0';
                navCtaButton.style.paddingRight = '0';
                navCtaButton.style.marginLeft = '0';
                navCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                navCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
                 if(desktopMenuLinks) desktopMenuLinks.style.marginRight = 'auto';
            }
        }
    });
}

// Эффект печатающегося текста для подзаголовка
const subtitles = [
    "Искрометный Ведущий с AI-Фишками",
    "Интеллектуальный Юмор и Драйв",
    "Новый Формат Развлечений",
    "Глубокая персонализация",
    "Алматинский Эминем"
];
let subtitleIndex = 0;
let charIndex = 0;
const typingSpeed = 100; // Скорость печати
const erasingSpeed = 50;  // Скорость стирания
const delayBetweenSubtitles = 2000; // Задержка перед сменой подзаголовка
const typingElement = document.getElementById('typing-subtitle');

function typeSubtitle() {
    if (typingElement && charIndex < subtitles[subtitleIndex].length) {
        typingElement.textContent += subtitles[subtitleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeSubtitle, typingSpeed);
    } else if (typingElement) {
        setTimeout(eraseSubtitle, delayBetweenSubtitles);
    }
}

function eraseSubtitle() {
    if (typingElement && charIndex > 0) {
        typingElement.textContent = subtitles[subtitleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseSubtitle, erasingSpeed);
    } else if (typingElement) {
        subtitleIndex = (subtitleIndex + 1) % subtitles.length; // Переход к следующему подзаголовку
        setTimeout(typeSubtitle, typingSpeed);
    }
}

// Логика для активных ссылок в навигации при скролле
const navLinksDesktop = document.querySelectorAll('#desktop-menu-links a[href^="#"]');
const navLinksMobile = document.querySelectorAll('#mobile-menu-items a[href^="#"]:not(#mobileCtaButton)'); // Исключаем CTA кнопку
const sections = document.querySelectorAll('section[id]'); // Все секции с ID
const mobileMenuButton = document.getElementById('burger-menu-button');
const mobileMenuItems = document.getElementById('mobile-menu-items');
const burgerIconDiv = mobileMenuButton ? mobileMenuButton.querySelector('.burger-icon') : null;

function changeActiveLink() {
    if (!navElement) return;
    let currentSectionId = '';
    let offset = navElement.offsetHeight + 20; // Высота навбара + небольшой отступ для более ранней активации

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY + offset >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Специальная обработка для секции hero (если она самая первая)
    if (!currentSectionId && sections.length > 0 && document.getElementById('hero')) {
        if (window.scrollY < (sections[0].offsetTop - offset)) {
             currentSectionId = 'hero';
        }
    }


    [navLinksDesktop, navLinksMobile].forEach(linkCollection => {
        linkCollection.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    });
}

if (sections.length > 0 && (navLinksDesktop.length > 0 || navLinksMobile.length > 0) ) {
    window.addEventListener('scroll', changeActiveLink); // Обновление при скролле
}


// Логика для бургер-меню
if (mobileMenuButton && mobileMenuItems && burgerIconDiv) {
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenuItems.classList.toggle('open');
        burgerIconDiv.classList.toggle('open');
        // Если меню открывается, пересчитываем активную ссылку
        if (isOpen) {
            requestAnimationFrame(changeActiveLink);
        }
    });

    // Закрытие меню при клике на пункт меню (для мобильной версии)
    mobileMenuItems.querySelectorAll('a').forEach(link => {
        // Исключаем клики по иконкам соцсетей из логики закрытия меню по ссылке на секцию
        if (!link.closest('.py-4.px-4.text-center')) { // Проверяем, не является ли ссылка частью блока соцсетей
            link.addEventListener('click', () => {
                mobileMenuItems.classList.remove('open');
                burgerIconDiv.classList.remove('open');
                // Обновляем активную ссылку после закрытия меню, если это не CTA кнопка
                if (link.id !== 'mobileCtaButton') {
                     setTimeout(changeActiveLink, 50); // Небольшая задержка для плавности
                }
            });
        }
    });
}


// Плавное появление элементов при прокрутке (Reveal effect)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // revealObserver.unobserve(entry.target); // Раскомментировать, если анимация должна сработать только один раз
        } else { // Добавлено для повторной анимации при прокрутке вверх и вниз
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.1 }); // Элемент считается видимым при появлении хотя бы 10%

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Изменение фона навбара при скролле
window.addEventListener('scroll', () => {
    if (navElement) {
        if (window.scrollY > 50) { // Если прокрутили больше чем на 50px
            navElement.classList.add('scrolled');
        } else {
            navElement.classList.remove('scrolled');
        }
    }
});

// Кнопка "Наверх"
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Показать кнопку после прокрутки на 300px
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Плавная прокрутка вверх
    });
}

// Установка текущего года в футере
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// --- Логика для модального окна с видео ---
const videoModal = document.getElementById('videoModal');
const videoIframe = document.getElementById('videoIframe');
const closeModalBtn = document.getElementById('closeModalBtn');
const portfolioVideoLinks = document.querySelectorAll('.portfolio-video-link');
const videoIframeContainer = document.querySelector('.video-iframe-container');
const modalContentElement = videoModal ? videoModal.querySelector('.modal-content') : null;

if (videoModal && videoIframe && closeModalBtn && portfolioVideoLinks.length > 0 && videoIframeContainer && modalContentElement) {
    portfolioVideoLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const videoSrc = this.dataset.videoSrc; // Это может быть ID YouTube или URL Instagram
            if (videoSrc) {
                let finalVideoSrc = '';

                // Проверка на Instagram видео для применения специальных стилей и прямой установки src
                if (videoSrc.includes('instagram.com')) {
                    videoIframeContainer.classList.add('instagram-vertical');
                    modalContentElement.classList.add('modal-instagram-vertical-content');
                    finalVideoSrc = videoSrc; // Instagram URL уже содержит /embed
                } 
                // Проверка, является ли videoSrc предположительно ID YouTube видео
                // (не содержит http и не является Instagram ссылкой)
                else if (videoSrc && !videoSrc.toLowerCase().startsWith('http') && !videoSrc.includes('instagram.com')) {
                    const videoId = videoSrc; // videoSrc здесь - это сам ID видео (например, "YOUTUBE_VIDEO_ID_1")
                    finalVideoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
                    videoIframeContainer.classList.remove('instagram-vertical');
                    modalContentElement.classList.remove('modal-instagram-vertical-content');
                } 
                // Если это полный URL (не Instagram и не простой ID), пытаемся использовать как есть
                // (на случай если в будущем будут другие источники)
                else if (videoSrc.toLowerCase().startsWith('http')) {
                     finalVideoSrc = videoSrc;
                     videoIframeContainer.classList.remove('instagram-vertical');
                     modalContentElement.classList.remove('modal-instagram-vertical-content');
                }


                if (finalVideoSrc) {
                    videoIframe.setAttribute('src', finalVideoSrc);
                    videoModal.classList.remove('hidden');
                    // Плавное появление модального окна
                    requestAnimationFrame(() => {
                        videoModal.style.opacity = '1';
                        videoModal.style.pointerEvents = 'auto';
                        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
                    });
                } else {
                    console.error('Не удалось определить источник видео:', videoSrc);
                }
            }
        });
    });

    function closeVideoModal() {
        videoModal.style.opacity = '0';
        videoModal.style.pointerEvents = 'none';
        setTimeout(() => {
            videoModal.classList.add('hidden');
            videoIframe.setAttribute('src', ''); // Очищаем src для остановки видео
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
            // Сброс классов для Instagram видео
            videoIframeContainer.classList.remove('instagram-vertical');
            modalContentElement.classList.remove('modal-instagram-vertical-content');
        }, 300); // Задержка соответствует transition-opacity
    }

    closeModalBtn.addEventListener('click', closeVideoModal);

    // Закрытие по клику на фон
    videoModal.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeVideoModal();
        }
    });
}


// --- Логика для кнопки "Показать еще" в портфолио ---
const togglePortfolioBtn = document.getElementById('togglePortfolioBtn');
const portfolioGrid = document.getElementById('portfolioGrid');

if (togglePortfolioBtn && portfolioGrid) {
    const portfolioItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
    const initiallyVisibleCount = 3; // Количество изначально видимых элементов
    let allItemsVisible = false; // Отслеживает, все ли "дополнительные" элементы сейчас видны

    function updatePortfolioVisibilityAndButton() {
        let hiddenCount = 0;
        portfolioItems.forEach((item, index) => {
            if (index < initiallyVisibleCount) {
                item.classList.remove('hidden'); // Первые N всегда видимы
            } else {
                if (allItemsVisible) { // Если флаг "показать все" активен
                    item.classList.remove('hidden');
                } else { // Иначе, скрываем "дополнительные"
                    item.classList.add('hidden');
                }
            }
            // Подсчитываем количество скрытых элементов *среди тех, что идут после initiallyVisibleCount*
            if (index >= initiallyVisibleCount && item.classList.contains('hidden')) {
                hiddenCount++;
            }
        });
        
        const totalExtraItems = portfolioItems.length - initiallyVisibleCount;

        if (totalExtraItems <= 0) { // Если "дополнительных" элементов нет или их меньше чем изначально видимых
            togglePortfolioBtn.classList.add('hidden'); // Скрыть кнопку
            return;
        } else {
            togglePortfolioBtn.classList.remove('hidden'); // Показать кнопку
        }

        if (allItemsVisible) { // Если все "дополнительные" показаны
            togglePortfolioBtn.textContent = 'Скрыть';
        } else { // Если есть скрытые "дополнительные"
            togglePortfolioBtn.textContent = `Показать еще ${hiddenCount > 0 ? hiddenCount : ''} видео`.trim();
        }
    }
    
    // Изначальная установка видимости и текста кнопки
    allItemsVisible = false; // Сначала показываем только initial
    updatePortfolioVisibilityAndButton();

    togglePortfolioBtn.addEventListener('click', () => {
        allItemsVisible = !allItemsVisible; // Инвертируем состояние "показать все"
        updatePortfolioVisibilityAndButton(); // Обновляем видимость и текст кнопки
    });
}