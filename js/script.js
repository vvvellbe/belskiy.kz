const preloader = document.getElementById('preloader');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const dynamicLoadingTextElement = document.querySelector('#preloader .loading-text');

const loadingMessages = [
    "Готовим сцену...",
    "Настраиваем микрофоны...",
    "Магия AI загружается...",
    "Создаем атмосферу праздника...",
    "Валерий Бельский уже в пути!"
];
let currentMessageIndex = 0;
let messageInterval;
let progressInterval;
let currentProgress = 0;

function updateProgress(percentage) {
    if (progressBar && progressText) {
        currentProgress = Math.min(percentage, 100);
        progressBar.style.width = currentProgress + '%';
        progressText.textContent = Math.round(currentProgress) + '%';
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
    const increment = (100 / (totalSimulationTime / intervalTime));

    if (dynamicLoadingTextElement && loadingMessages.length > 0) {
        dynamicLoadingTextElement.textContent = loadingMessages[currentMessageIndex];
        dynamicLoadingTextElement.style.opacity = 1;
        if (loadingMessages.length > 1) {
            messageInterval = setInterval(changeLoadingMessage, 2000);
        }
    }

    progressInterval = setInterval(() => {
        simulatedProgress += increment;
        if (simulatedProgress >= 100) {
            updateProgress(100);
            clearInterval(progressInterval);
        } else {
            updateProgress(simulatedProgress);
        }
    }, intervalTime);
}

document.addEventListener('DOMContentLoaded', () => {
    if (preloader) {
        document.body.classList.add('body-preloading');
    }

    if (preloader && progressBar && progressText) {
        simulateProgress();
    }
    
    if (typingElement) {
        setTimeout(typeSubtitle, 500);
    }
    
    setTimeout(setInitialCtaButtonState, 100);

    if (sections.length > 0 && (navLinksDesktop.length > 0 || navLinksMobile.length > 0)) {
        changeActiveLink();
    }
});

window.addEventListener('load', () => {
    clearInterval(progressInterval);
    clearInterval(messageInterval);
    updateProgress(100);

    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                if (document.body.classList.contains('body-preloading')) {
                    document.body.classList.remove('body-preloading');
                }
            }, 800);
        }, 500);
    }
});

const heroVideo = document.getElementById('hero-video-1');
if (heroVideo) {
    heroVideo.loop = true;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Ошибка автовоспроизведения фонового видео:", error);
        });
    }
}

const heroCtaButton = document.getElementById('heroCtaButton');
const navCtaButton = document.getElementById('navCtaButton');
const heroSection = document.getElementById('hero');
const navElement = document.querySelector('nav');
const desktopMenuLinks = document.getElementById('desktop-menu-links');

function setInitialCtaButtonState() {
    if (!heroCtaButton || !navCtaButton || !heroSection || !navElement) return;
    const heroRect = heroSection.getBoundingClientRect();
    const navHeight = navElement.offsetHeight;

    if (heroRect.bottom < navHeight) {
        heroCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        heroCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');

        navCtaButton.style.width = 'auto';
        navCtaButton.style.paddingLeft = '1.25rem'; 
        navCtaButton.style.paddingRight = '1.25rem'; 
        navCtaButton.style.marginLeft = desktopMenuLinks && desktopMenuLinks.classList.contains('lg:px-4') ? '1rem' : '0.75rem'; 
        navCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
        navCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
        if(desktopMenuLinks) desktopMenuLinks.style.marginRight = '0'; 
    } else {
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

if (heroCtaButton && navCtaButton && heroSection && navElement) {
    heroCtaButton.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    heroCtaButton.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');

    navCtaButton.style.width = '0'; 
    navCtaButton.style.paddingLeft = '0';
    navCtaButton.style.paddingRight = '0';
    navCtaButton.style.marginLeft = '0';
    navCtaButton.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
    navCtaButton.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');

    window.addEventListener('scroll', () => {
        const heroRect = heroSection.getBoundingClientRect();
        const navHeight = navElement.offsetHeight;

        if (heroRect.bottom < navHeight) { 
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
        } else { 
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

const subtitles = [
    "Искрометный Ведущий с AI-Фишками",
    "Интеллектуальный Юмор и Драйв",
    "Новый Формат Развлечений",
    "Глубокая персонализация",
    "Алматинский Эминем"
];
let subtitleIndex = 0;
let charIndex = 0;
const typingSpeed = 100; 
const erasingSpeed = 50;  
const delayBetweenSubtitles = 2000; 
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
        subtitleIndex = (subtitleIndex + 1) % subtitles.length; 
        setTimeout(typeSubtitle, typingSpeed);
    }
}

const navLinksDesktop = document.querySelectorAll('#desktop-menu-links a[href^="#"]');
const navLinksMobile = document.querySelectorAll('#mobile-menu-items a[href^="#"]:not(#mobileCtaButton)');
const sections = document.querySelectorAll('section[id]'); 
const mobileMenuButton = document.getElementById('burger-menu-button');
const mobileMenuItems = document.getElementById('mobile-menu-items');
const burgerIconDiv = mobileMenuButton ? mobileMenuButton.querySelector('.burger-icon') : null;

function changeActiveLink() {
    if (!navElement) return;
    let currentSectionId = '';
    let offset = navElement.offsetHeight + 20; 

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY + offset >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
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
    window.addEventListener('scroll', changeActiveLink);
}

if (mobileMenuButton && mobileMenuItems && burgerIconDiv) {
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenuItems.classList.toggle('open');
        burgerIconDiv.classList.toggle('open');
        if (isOpen) {
            requestAnimationFrame(changeActiveLink);
        }
    });

    mobileMenuItems.querySelectorAll('a').forEach(link => {
        if (!link.closest('.py-4.px-4.text-center')) { 
            link.addEventListener('click', () => {
                mobileMenuItems.classList.remove('open');
                burgerIconDiv.classList.remove('open');
                if (link.id !== 'mobileCtaButton') {
                     setTimeout(changeActiveLink, 50); 
                }
            });
        }
    });
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else { 
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.1 }); 

revealElements.forEach(el => {
    revealObserver.observe(el);
});

window.addEventListener('scroll', () => {
    if (navElement) {
        if (window.scrollY > 50) { 
            navElement.classList.add('scrolled');
        } else {
            navElement.classList.remove('scrolled');
        }
    }
});

const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { 
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    });
}

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

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
            const videoSrc = this.dataset.videoSrc; 
            if (videoSrc) {
                let finalVideoSrc = '';

                if (videoSrc.includes('instagram.com')) {
                    videoIframeContainer.classList.add('instagram-vertical');
                    modalContentElement.classList.add('modal-instagram-vertical-content');
                    finalVideoSrc = videoSrc; 
                } 
                else if (videoSrc && !videoSrc.toLowerCase().startsWith('http') && !videoSrc.includes('instagram.com')) {
                    const videoId = videoSrc; 
                    finalVideoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
                    videoIframeContainer.classList.remove('instagram-vertical');
                    modalContentElement.classList.remove('modal-instagram-vertical-content');
                } 
                else if (videoSrc.toLowerCase().startsWith('http')) {
                     finalVideoSrc = videoSrc;
                     videoIframeContainer.classList.remove('instagram-vertical');
                     modalContentElement.classList.remove('modal-instagram-vertical-content');
                }

                if (finalVideoSrc) {
                    videoIframe.setAttribute('src', finalVideoSrc);
                    videoModal.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        videoModal.style.opacity = '1';
                        videoModal.style.pointerEvents = 'auto';
                        document.body.style.overflow = 'hidden'; 
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
            videoIframe.setAttribute('src', ''); 
            document.body.style.overflow = ''; 
            videoIframeContainer.classList.remove('instagram-vertical');
            modalContentElement.classList.remove('modal-instagram-vertical-content');
        }, 300); 
    }

    closeModalBtn.addEventListener('click', closeVideoModal);

    videoModal.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeVideoModal();
        }
    });
}

const togglePortfolioBtn = document.getElementById('togglePortfolioBtn');
const portfolioGrid = document.getElementById('portfolioGrid');

if (togglePortfolioBtn && portfolioGrid) {
    const portfolioItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
    const initiallyVisibleCount = 3; 
    let allItemsVisible = false; 

    function updatePortfolioVisibilityAndButton() {
        let hiddenCount = 0;
        portfolioItems.forEach((item, index) => {
            if (index < initiallyVisibleCount) {
                item.classList.remove('hidden'); 
            } else {
                if (allItemsVisible) { 
                    item.classList.remove('hidden');
                } else { 
                    item.classList.add('hidden');
                }
            }
            if (index >= initiallyVisibleCount && item.classList.contains('hidden')) {
                hiddenCount++;
            }
        });
        
        const totalExtraItems = portfolioItems.length - initiallyVisibleCount;

        if (totalExtraItems <= 0) { 
            togglePortfolioBtn.classList.add('hidden'); 
            return;
        } else {
            togglePortfolioBtn.classList.remove('hidden'); 
        }

        if (allItemsVisible) { 
            togglePortfolioBtn.textContent = 'Скрыть';
        } else { 
            togglePortfolioBtn.textContent = `Показать еще ${hiddenCount > 0 ? hiddenCount : ''} видео`.trim();
        }
    }
    
    allItemsVisible = false; 
    updatePortfolioVisibilityAndButton();

    togglePortfolioBtn.addEventListener('click', () => {
        allItemsVisible = !allItemsVisible; 
        updatePortfolioVisibilityAndButton(); 
    });
}
