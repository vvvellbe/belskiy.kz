function initializeRapCalculator() {
    const rapCalculatorContent = document.getElementById('rap-calculator-content');
    if (!rapCalculatorContent) return;

    let DOMElements = {};
    let selection = {};

    function initializeRapApp() {
        DOMElements = {
            dateInput: document.getElementById('rap-event-date'), // НОВЫЙ ЭЛЕМЕНТ
            locationSelect: document.getElementById('rap-location'),
            trackListContainer: document.getElementById('track-list-container'),
            trackCards: document.querySelectorAll('#track-list-container .track-card'),
            summaryList: document.getElementById('rap-summary-list'),
            notifications: document.getElementById('rap-notifications'),
            totalPrice: document.getElementById('rap-total-price'),
            copyQuoteBtn: document.getElementById('copy-rap-quote-btn'),
            packageInfo: document.getElementById('rap-package-info'),
            selectAllTracksBtn: document.getElementById('select-all-tracks-btn'),
            resetTracksBtn: document.getElementById('reset-tracks-btn'),
            summaryCard: rapCalculatorContent.querySelector('[data-summary-id="rap"]'),
        };

        selection = {
            mode: 'rap',
            location: 'almaty',
            selectedTracks: {},
            eventDate: null,       // НОВОЕ ПОЛЕ
            isNewYearMode: false   // НОВЫЙ ФЛАГ
        };

        if (DOMElements.trackListContainer.childElementCount === 0) {
            populateStaticTrackList();
            DOMElements.trackCards = document.querySelectorAll('#track-list-container .track-card');
        }

        setupEventListeners();
        setupFloatingBar();
        updateRapSummary();

        document.addEventListener('calculatorModeChanged', () => {
            updateRapSummary();
        });
    }

    function populateStaticTrackList() {
        if (!DOMElements.trackListContainer) return;
        let tracksHTML = '';
        TRACK_LIST.forEach(track => {
            const exampleButtonHTML = `
            <button class="btn-youtube text-xs" data-modal-trigger="videoModal" data-video-src="${track.url.split('v=')[1]}">
                <i class="fab fa-youtube mr-1"></i> Пример
            </button>`;

            tracksHTML += `
            <div class="track-card rounded-lg p-3" data-track-id="${track.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-plus-circle"></i>
                        <div>
                            <p class="font-semibold text-white">${track.name}</p>
                            <p class="text-xs text-gray-400">Длительность: ${track.duration}</p>
                        </div>
                    </div>
                    ${exampleButtonHTML} 
                </div>
            </div>`;
        });
        DOMElements.trackListContainer.innerHTML = tracksHTML;
    }


    function setupEventListeners() {
        // --- НОВЫЙ СЛУШАТЕЛЬ ДАТЫ ---
        if (DOMElements.dateInput) {
            DOMElements.dateInput.addEventListener('change', (e) => {
                const dateValue = e.target.value;
                selection.eventDate = dateValue;
                
                if (dateValue) {
                    // Месяцы с 0 (январь) по 11 (декабрь)
                    const month = new Date(dateValue).getMonth();
                    selection.isNewYearMode = (month === 11);
                } else {
                    selection.isNewYearMode = false;
                }
                updateRapSummary();
            });
        }

        DOMElements.locationSelect.addEventListener('change', (e) => {
            selection.location = e.target.value;
            updateRapSummary();
        });
        
        DOMElements.trackCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-modal-trigger="videoModal"]')) {
                    return;
                }

                const trackId = card.dataset.trackId;
                if (selection.selectedTracks[trackId]) {
                    delete selection.selectedTracks[trackId];
                } else {
                    selection.selectedTracks[trackId] = true;
                }
                updateRapSummary();
            });
        });

        DOMElements.copyQuoteBtn.addEventListener('click', () => {
            const quoteText = generateRapPlainTextQuote();
            copyToClipboard(quoteText);
        });

        DOMElements.selectAllTracksBtn.addEventListener('click', () => {
            TRACK_LIST.forEach(track => {
                selection.selectedTracks[track.id] = true;
            });
            updateRapSummary();
        });

        DOMElements.resetTracksBtn.addEventListener('click', () => {
            selection.selectedTracks = {};
            updateRapSummary();
        });
    }

function updateRapSummary() {
        const trackCount = Object.keys(selection.selectedTracks).length;
        let currentTier, totalPrice, currency = '₸', travelInfo = null;
        const needsRider = ['kz', 'intl'].includes(selection.location);
        
        const activePrices = selection.isNewYearMode ? PRICES_RAP.NEW_YEAR : PRICES_RAP.TIERS;

        if (trackCount === 0) {
            currentTier = { name: 'Выберите треки', desc: 'Начните добавлять треки, чтобы сформировать пакет.' };
            totalPrice = 0;
        } else if (trackCount <= activePrices.START.tracks) {
            currentTier = activePrices.START;
        } else if (trackCount <= activePrices.DRIVE.tracks) {
            currentTier = activePrices.DRIVE;
        } else {
            currentTier = activePrices.PREMIUM;
        }

        if (selection.location === 'kz') {
            if (selection.isNewYearMode && PRICES_RAP.LOCATION.kz.newYearPrice) {
                 totalPrice = PRICES_RAP.LOCATION.kz.newYearPrice;
            } else {
                 totalPrice = PRICES_RAP.LOCATION.kz.fixedPrice;
            }
            travelInfo = 'Стоимость для выездного мероприятия в другой город Казахстана фиксированная.';
        } else if (selection.location === 'intl') {
            // --- ОБНОВЛЕННЫЙ БЛОК ДЛЯ МЕЖДУНАРОДНЫХ ВЫСТУПЛЕНИЙ ---
            if (selection.isNewYearMode && PRICES_RAP.LOCATION.intl.newYearPrice) {
                totalPrice = PRICES_RAP.LOCATION.intl.newYearPrice;
            } else {
                totalPrice = PRICES_RAP.LOCATION.intl.fixedPrice;
            }
            // ------------------------------------------------------
            currency = PRICES_RAP.LOCATION.intl.currency;
            travelInfo = 'Стоимость для выездного мероприятия в страну за пределами Казахстана фиксированная.';
        } else {
            totalPrice = currentTier.price || 0;
            if (selection.location === 'almaty_region') {
                travelInfo = 'Транспортные расходы (такси по тарифу Яндекс Go) оплачиваются заказчиком дополнительно.';
            }
        }
    
        let totalMinSeconds = 0, totalMaxSeconds = 0;
        const selectedTrackItems = Object.keys(selection.selectedTracks).map(trackId => {
            const track = TRACK_LIST.find(t => t.id === trackId);
            if (track) {
                totalMinSeconds += track.minDurationSeconds;
                totalMaxSeconds += track.maxDurationSeconds;
                return { name: track.name };
            }
            return null;
        }).filter(Boolean);
    
        const durationText = formatDuration(totalMinSeconds, totalMaxSeconds);
    
        renderPackageInfo(currentTier);
        renderSummaryList(currentTier, trackCount, durationText, selectedTrackItems);
        renderNotifications(travelInfo, needsRider);
        
        DOMElements.trackCards.forEach(card => {
            const trackId = card.dataset.trackId;
            const isSelected = !!selection.selectedTracks[trackId];
            card.classList.toggle('selected', isSelected);
            const icon = card.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-check-circle', isSelected);
                icon.classList.toggle('text-emerald-400', isSelected);
                icon.classList.toggle('fa-plus-circle', !isSelected);
            }
        });

        if (DOMElements.totalPrice) {
            DOMElements.totalPrice.textContent = `${totalPrice.toLocaleString('ru-RU')} ${currency}`;
        }

        updateFloatingBarUI(totalPrice, trackCount, currency);
    }
    
    function renderPackageInfo(tier) {
        if (!DOMElements.packageInfo) return;
        DOMElements.packageInfo.innerHTML = `
        <div class="package-info-card">
         <h3 class="font-semibold text-lg text-white">${tier.name}</h3>
         <p class="text-sm text-gray-400 mt-1">${tier.desc}</p>
        </div>`;
    }

    function renderSummaryList(tier, trackCount, durationText, trackItems) {
        if (!DOMElements.summaryList) return;
        let summaryHtml = '';
        if (trackCount > 0 || ['kz', 'intl'].includes(selection.location)) {
            let activeTier = tier;
            // Логика отображения названия пакета для выездных (всегда Премиум)
            if (selection.location === 'kz' || selection.location === 'intl') {
                 // Определяем, какой "Премиум" брать (обычный или новогодний) для названия
                 const activePrices = selection.isNewYearMode ? PRICES_RAP.NEW_YEAR : PRICES_RAP.TIERS;
                 activeTier = activePrices.PREMIUM;
            }
            summaryHtml += createSummaryCategory('Пакет выступления', 'fa-microphone-alt', [{ name: activeTier.name }]);
        }
        if (trackCount > 0) {
            summaryHtml += createSummaryCategory(`Сет-лист (${trackCount} треков)`, 'fa-music', trackItems, true);
            summaryHtml += createSummaryCategory('Длительность', 'fa-clock', [{ name: 'Примерное время:', price: durationText, isDuration: true }]);
        }
        DOMElements.summaryList.innerHTML = summaryHtml;
    }

    function renderNotifications(travelInfo, needsRider) {
        if (!DOMElements.notifications) return;
        DOMElements.notifications.innerHTML = '';
        if (travelInfo) {
            DOMElements.notifications.innerHTML += `<div class="notification-card"><i class="fas fa-info-circle"></i><p>${travelInfo}</p></div>`;
        }
        if (needsRider) {
            DOMElements.notifications.innerHTML += `<div class="flex flex-col items-center gap-2 mt-2"><button data-modal-trigger="riderModal" class="btn-rider w-full">Ознакомиться с райдером</button><p class="text-xs text-amber-400 font-semibold">Для выездных мероприятий обязательно</p></div>`;
        }
    }

    function formatDuration(minSeconds, maxSeconds) {
        if (minSeconds === 0) return '0 мин. 00 сек.';
        
        const format = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const secs = s % 60;

            const hDisplay = h > 0 ? `${h} ч. ` : '';
            const mDisplay = `${m} мин. `;
            const sDisplay = `${secs.toString().padStart(2, '0')} сек.`;

            return `${hDisplay}${mDisplay}${sDisplay}`.trim();
        };

        const minFormatted = format(minSeconds);
        if (minSeconds === maxSeconds) return minFormatted;
        
        return `${minFormatted} - ${format(maxSeconds)}`;
    }

    function createSummaryCategory(title, icon, items, scrollable = false) {
        const containerClass = scrollable ? 'summary-items-container scrollable' : 'summary-items-container';
        let itemsHtml = items.map(item => {
            const priceHtml = item.price !== undefined ? `<span class="summary-item-price ${item.isDuration ? 'duration-text' : ''}">${typeof item.price === 'number' ? item.price.toLocaleString('ru-RU') : item.price} ${item.currency || ''}</span>` : '';
            return `<div class="summary-item"><div class="summary-item-name">${item.name}</div>${priceHtml}</div>`;
        }).join('');
        return `<div class="summary-category"><div class="summary-category-header"><i class="fas ${icon}"></i><span>${title}</span></div><div class="${containerClass}">${itemsHtml}</div></div>`;
    }

    function generateRapPlainTextQuote() {
        let parts = ["Здравствуйте, Валерий!", "Сформировал(а) заявку на рэп-выступление на belskiy.kz:\n"];
        
        // --- ДОБАВЛЕНИЕ ДАТЫ В ЗАЯВКУ ---
        if (selection.eventDate) {
            const [year, month, day] = selection.eventDate.split('-');
            parts.push(`*ДАТА ВЫСТУПЛЕНИЯ: ${day}.${month}.${year}*`);
        }
        if (selection.isNewYearMode) {
            parts.push(`*ТАРИФ: Новогодний*`);
        }
        
        parts.push(`\n*УСЛУГА: Рэп-исполнитель*`);
        const locationMap = { almaty: 'В пределах г. Алматы', almaty_region: 'Алматинская область / Районы', kz: 'Другой город Казахстана', intl: 'Другая страна' };
        parts.push(`- Местоположение: ${locationMap[selection.location]}`);
        
        const trackCount = Object.keys(selection.selectedTracks).length;
        const selectedTrackNames = Object.keys(selection.selectedTracks).map(id => TRACK_LIST.find(t => t.id === id)?.name).filter(Boolean);
        
        if (selectedTrackNames.length > 0) { 
            parts.push(`\n*ВЫБРАННЫЙ СЕТ-ЛИСТ (${trackCount} треков):*`); 
            selectedTrackNames.forEach(name => parts.push(`- ${name}`)); 
        } 
        else if (selection.location === 'kz' || selection.location === 'intl') { 
            parts.push(`- Пакет: Премиум (Полная программа)`); 
        }
        
        parts.push(`\n*ИТОГОВАЯ СТОИМОСТЬ: ${DOMElements.totalPrice.textContent}*`);
        
        if (selection.location !== 'almaty') { 
            parts.push("\n*Дополнительно оплачиваются расходы на логистику (проезд, проживание), согласно райдеру.*"); 
        }
        return parts.join('\n');
    }

    function setupFloatingBar() {
        const bar = document.getElementById('rap-floating-summary-bar');
        const modal = document.getElementById('rap-summary-modal');
        const openBtn = document.getElementById('rap-floating-open-modal');
        const modalCopyBtn = document.getElementById('rap-modal-copy-btn');
        if (!bar || !modal || !openBtn || !modalCopyBtn) return;
        const openModal = () => { modal.classList.add('open'); document.body.classList.add('modal-open'); };
        const closeModal = () => { modal.classList.remove('open'); document.body.classList.remove('modal-open'); };
        openBtn.addEventListener('click', openModal);
        modal.addEventListener('click', (e) => { if (e.target.closest('.modal-close-btn') || e.target === modal) closeModal(); });
        modalCopyBtn.addEventListener('click', () => copyToClipboard(generateRapPlainTextQuote()));
        const summaryCardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (rapCalculatorContent.classList.contains('active')) { bar.classList.toggle('hidden-by-scroll', entry.isIntersecting); } });
        }, { threshold: 0.1 });
        if (DOMElements.summaryCard) { summaryCardObserver.observe(DOMElements.summaryCard); }
    }

    function updateFloatingBarUI(total, itemsCount, currency = '₸') {
        const bar = document.getElementById('rap-floating-summary-bar');
        if (!bar) return;
        // Показываем бар, если есть треки ИЛИ если это выезд (где треки не влияют на цену, но заказ сформирован)
        const hasSelections = itemsCount > 0 || ['kz', 'intl'].includes(selection.location);
        const shouldBeVisible = hasSelections && rapCalculatorContent.classList.contains('active');
        
        bar.classList.toggle('visible', shouldBeVisible);

        if (window.innerWidth < 768) {
            const hostBarIsVisible = document.getElementById('host-floating-summary-bar')?.classList.contains('visible');
             if (shouldBeVisible) {
                document.body.style.paddingBottom = bar.offsetHeight + 20 + 'px';
            } else if (!hostBarIsVisible) {
                document.body.style.paddingBottom = '0px';
            }
        }

        if (shouldBeVisible) {
            document.getElementById('rap-floating-total').textContent = `Итого: ${total.toLocaleString('ru-RU')} ${currency}`;
            document.getElementById('rap-floating-count').textContent = itemsCount;
            const summaryContent = DOMElements.summaryList.innerHTML;
            const notificationsContent = DOMElements.notifications.innerHTML;
            const separator = notificationsContent ? '<hr class="summary-separator mt-4 mb-4">' : '';
            document.getElementById('rap-modal-summary-content').innerHTML = summaryContent + separator + notificationsContent;
            document.getElementById('rap-modal-total-price').textContent = `${total.toLocaleString('ru-RU')} ${currency}`;
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(showToast, err => console.error('Не удалось скопировать', err));
    }
    
    function showToast() {
      const toast = document.getElementById('toast-notification');
      const whatsappBtn = document.getElementById('whatsapp-send-btn');

      if (toast && whatsappBtn) {
        const phoneNumber = '77079292980'; 
        const invitationText = 'Вставьте скопированную заявку сюда.';
        const encodedText = encodeURIComponent(invitationText);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        whatsappBtn.href = whatsappUrl;
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 6000);
      }
    }

    initializeRapApp();
}

document.addEventListener('astro:page-load', initializeRapCalculator);

initializeRapCalculator();