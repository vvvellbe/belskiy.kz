// src/scripts/configurator-app.js

function initializeHostCalculator() {

    // ========================================================================
    // --- ГЛОБАЛЬНАЯ ЛОГИКА МОДАЛЬНЫХ ОКОН ---
    // ========================================================================

    const aiGamesModal = document.getElementById('ai-games-modal');
    const eminemModal = document.getElementById('eminem-modal');
    const riderModal = document.getElementById('riderModal');

    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('open');
            if (!document.querySelector('.modal-overlay.open')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    document.body.addEventListener('click', (e) => {
        const modalTrigger = e.target.closest('[data-modal-trigger]');
        if (!modalTrigger) return;
        if (e.target.closest('[data-reset-target]')) return;

        const modalId = modalTrigger.dataset.modalTrigger;
        let targetModal = null;

        if (modalId === 'ai-games-modal') targetModal = aiGamesModal;
        else if (modalId === 'eminem-modal') targetModal = eminemModal;
        else if (modalId === 'riderModal') targetModal = riderModal;
        // Пропускаем videoModal, он обрабатывается в main.js

        if (targetModal) {
            if (modalId === 'ai-games-modal' || modalId === 'eminem-modal') {
                const event = new CustomEvent('renderModalContent', { detail: { modalId: modalId } });
                document.dispatchEvent(event);
            }
            targetModal.classList.add('open');
            document.body.classList.add('modal-open');
        }
    });
    
    // ========================================================================
    // --- HOST CALCULATOR LOGIC ---
    // ========================================================================
    (() => {
        const hostCalculator = document.getElementById('host-calculator-content');
        if (!hostCalculator) return;

        let selection = {};
        let DOMElements = {};

        // Обработчики закрытия модалок
        const allModals = [aiGamesModal, eminemModal, riderModal];
        allModals.forEach(modal => {
            if (!modal) return;
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.js-modal-close')) {
                    closeModal(modal);
                }
                if (modal === aiGamesModal) handleAiModalClicks(e);
                else if (modal === eminemModal) handleEminemModalClicks(e);
            });
        });

        if(riderModal) {
             riderModal.addEventListener('click', (e) => {
                if (e.target === riderModal || e.target.closest('.modal-close-btn')) {
                    closeModal(riderModal);
                }
            });
        }
        
        document.addEventListener('renderModalContent', (e) => {
            const { modalId } = e.detail;
            if (modalId === 'ai-games-modal') renderAIGamesModal();
            else if (modalId === 'eminem-modal') renderEminemModal();
        });

        function setupTermsModal() {
            const termsModal = document.getElementById('terms-modal');
            const openBtn = document.getElementById('open-terms-modal');
            const openBtnDesktop = document.getElementById('open-terms-modal-desktop');
            
            if (!termsModal) return;

            const openModal = () => {
                termsModal.classList.add('open');
                document.body.classList.add('modal-open');
            };

            const closeModalFn = () => {
                termsModal.classList.remove('open');
                if (!document.querySelector('.modal-overlay.open')) {
                    document.body.classList.remove('modal-open');
                }
            };
            
            if (openBtn) openBtn.addEventListener('click', openModal);
            if (openBtnDesktop) openBtnDesktop.addEventListener('click', openModal);

            termsModal.addEventListener('click', (e) => {
                if (e.target === termsModal || e.target.closest('.modal-close-btn')) {
                    closeModalFn();
                }
            });
        }

        // --- ЛОГИКА ЦЕН И ОТОБРАЖЕНИЯ ---

        function updateDisplayedPrices() {
            const isNY = selection.isNewYearMode;
            const isOutbound = ['kz', 'intl'].includes(selection.location);

            // 1. Цены на часы ведущего (только для Алматы/Области)
            if (!isOutbound) {
                DOMElements.hostCards.forEach(card => {
                    const hours = card.dataset.value;
                    const price = isNY ? PRICES.NEW_YEAR.HOST[hours] : PRICES.HOST[hours];
                    const priceEl = card.querySelector('.font-semibold.text-lg');
                    if (priceEl) priceEl.textContent = `${price.toLocaleString('ru-RU')} ₸`;
                });
            } else {
                // Цены для фиксированного выезда
                const locData = isNY ? PRICES.NEW_YEAR.HOST_LOCATION[selection.location] : PRICES.HOST_LOCATION[selection.location];
                if (locData) {
                    const currency = locData.currency || '₸';
                    DOMElements.hostFixedBlock.price.textContent = `${locData.price.toLocaleString('ru-RU')} ${currency}`;
                    DOMElements.hostFixedBlock.title.textContent = locData.name;
                }
            }

            // 2. Цены на технику (Стандартные)
            DOMElements.allTechCards.forEach(card => {
                const techKey = card.dataset.value;
                const priceEl = card.querySelector('.font-semibold.text-lg');
                
                if (techKey === 'DJ_OUT') return; 

                if (priceEl && PRICES.TECH[techKey]) {
                    const price = (isNY && PRICES.NEW_YEAR.TECH[techKey])
                        ? PRICES.NEW_YEAR.TECH[techKey].price
                        : PRICES.TECH[techKey].price;
                    priceEl.textContent = `+ ${price.toLocaleString('ru-RU')} ₸`;
                }
            });

            // 3. Цены на DJ OUT (Выездной DJ)
            const djOutCard = DOMElements.techSectionContainers.out?.querySelector('[data-value="DJ_OUT"]');
            if (djOutCard) {
                const priceEl = djOutCard.querySelector('.font-semibold.text-lg');
                
                // Проверяем: это Казахстан или Заграница?
                if (selection.location === 'intl') {
                    // Цены в Долларах
                    const price = (isNY && PRICES.NEW_YEAR.DJ_INTL) ? PRICES.NEW_YEAR.DJ_INTL.price : PRICES.DJ_INTL.price;
                    if (priceEl) priceEl.textContent = `+ ${price} $`;
                } else {
                    // Цены в Тенге (KZ)
                    const price = (isNY && PRICES.NEW_YEAR.DJ_OUT) ? PRICES.NEW_YEAR.DJ_OUT.price : PRICES.DJ_OUT.price;
                    if (priceEl) priceEl.textContent = `+ ${price.toLocaleString('ru-RU')} ₸`;
                }
            }
        }
        
        function handleDateChange() {
            const dateValue = DOMElements.eventDateInput.value;
            selection.eventDate = dateValue;

            if (dateValue) {
                const month = new Date(dateValue).getMonth();
                selection.isNewYearMode = (month === 11); // 11 = Декабрь
            } else {
                selection.isNewYearMode = false;
            }
            reRenderUI();
        }

        function handleLocationChange() {
             selection.location = DOMElements.locationSelect.value;
             
             const isOutbound = ['kz', 'intl'].includes(selection.location);
             
             if (isOutbound) {
                 // Если выезд: сбрасываем стационарную технику, оставляем DJ_OUT
                 if (selection.techOption && selection.techOption !== 'DJ_OUT') {
                     selection.techOption = null;
                 }
                 selection.projectorNeeded = false;
             } else {
                 // Если Алматы: сбрасываем DJ_OUT
                 if (selection.techOption === 'DJ_OUT') selection.techOption = null;
             }
             reRenderUI();
        }

        function setupRetouchTooltip() {
            const container = hostCalculator.querySelector('#retouch-info-container');
            if (!container) return;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (isTouchDevice) {
                container.addEventListener('click', (e) => { e.stopPropagation(); container.classList.toggle('active'); });
                document.addEventListener('click', (e) => { if (container.classList.contains('active') && !container.contains(e.target)) { container.classList.remove('active'); } }, true);
            } else {
                container.addEventListener('mouseenter', () => { container.classList.add('active'); });
                container.addEventListener('mouseleave', () => { container.classList.remove('active'); });
            }
        }

        function reRenderUI() {
            readParameters(); // Читаем selects (гости, площадка, гир)
            updateDisplayedPrices(); 
            updateLocationUI(); 
            
            DOMElements.hostCards.forEach(card => { 
                card.classList.toggle('selected', card.dataset.value === selection.hostHours); 
            });

            updateVenueScreenToggle();
            updateTechSection();
            updateCreativeCardsUI();
            updatePhotographerSection();
            updateSummaryAndPrice();
        }

        function updateLocationUI() {
            const isOutbound = ['kz', 'intl'].includes(selection.location);
            
            if (DOMElements.hostHoursBlock) DOMElements.hostHoursBlock.classList.toggle('hidden', isOutbound);
            if (DOMElements.hostFixedBlock.container) DOMElements.hostFixedBlock.container.classList.toggle('hidden', !isOutbound);

            if (DOMElements.venueGearContainer) {
                 DOMElements.venueGearContainer.classList.toggle('hidden', isOutbound);
            }
        }

        function updateVenueScreenToggle() { 
            DOMElements.venueScreenToggleBtns.forEach(btn => { 
                btn.classList.toggle('active', btn.dataset.value === selection.venueScreen); 
            }); 
        }

        function updateTechSection() {
            const loc = selection.location;
            
            // Сценарий 1: ВЫЕЗД (KZ или Intl) -> Показываем только DJ OUT
            if (loc === 'kz' || loc === 'intl') {
                DOMElements.techSectionContainers.fullDjSet.classList.add('hidden');
                DOMElements.techSectionContainers.soundOnly.classList.add('hidden');
                DOMElements.techSectionContainers.noGear.classList.add('hidden');
                
                DOMElements.techSectionContainers.out.classList.remove('hidden');
                
                const djOutCard = DOMElements.techSectionContainers.out.querySelector('[data-value="DJ_OUT"]');
                if (djOutCard) {
                    djOutCard.classList.toggle('selected', selection.techOption === 'DJ_OUT');
                }
                
                 if (DOMElements.projectorCard) DOMElements.projectorCard.parentElement.classList.add('hidden');
                return;
            }

            // Сценарий 2: АЛМАТЫ
            DOMElements.techSectionContainers.out.classList.add('hidden');

            const venueHasFullDJSet = selection.venueGear === 'full_dj_set';
            const venueHasSoundOnly = selection.venueGear === 'sound_only';

            DOMElements.techSectionContainers.fullDjSet.classList.toggle('hidden', !venueHasFullDJSet);
            DOMElements.techSectionContainers.soundOnly.classList.toggle('hidden', !venueHasSoundOnly);
            DOMElements.techSectionContainers.noGear.classList.toggle('hidden', venueHasFullDJSet || venueHasSoundOnly);

            updateTechCardStates();
            updateProjectorCardState();
        }

        function updateTechCardStates() {
            DOMElements.allTechCards.forEach(card => {
                if (card.dataset.value === 'DJ_OUT') return;

                const cardValue = card.dataset.value;
                let isDisabled = false, disabledReason = null, warning = null;

                if (selection.projectorNeeded && cardValue === 'COMPACT') { isDisabled = true; disabledReason = 'Требует работы DJ'; }
                if (selection.guestCount === '81-150' && cardValue === 'COMPACT') { isDisabled = true; disabledReason = 'Не подходит для 80+ гостей'; }
                if ((selection.venueType === 'large' || selection.guestCount === '41-80' || selection.venueType === 'standard') && cardValue === 'COMPACT' && !isDisabled) { warning = 'Мощности может не хватить'; }
                if ((selection.venueType === 'large' || selection.guestCount === '81-150') && cardValue === 'STANDARD') { warning = 'Мощности может не хватить'; }
                if (selection.venueType === 'chamber' && selection.guestCount === '1-40' && cardValue === 'MAXI') { isDisabled = true; disabledReason = 'Избыточен для данной площадки'; }

                card.classList.toggle('disabled', isDisabled);
                card.classList.toggle('selected', selection.techOption === cardValue && !isDisabled);
                
                card.querySelector('.disabled-reason')?.remove();
                card.querySelector('.warning-text')?.remove();
                
                const contentDiv = card.querySelector('div:first-child');
                if (isDisabled && disabledReason) { contentDiv.insertAdjacentHTML('beforeend', `<p class="text-sm disabled-reason mt-2">🛑 ${disabledReason}</p>`); }
                else if (warning) { contentDiv.insertAdjacentHTML('beforeend', `<p class="text-sm warning-text mt-2">⚠️ ${warning}</p>`); }
            });
        }

        function updateProjectorCardState() {
            const card = DOMElements.projectorCard;
            if (!card) return;
            const venueHasScreen = selection.venueScreen === 'yes';
            
            if (venueHasScreen) {
                card.parentElement.classList.add('hidden');
                selection.projectorNeeded = false;
            } else {
                card.parentElement.classList.remove('hidden');
                let isDisabled = false, disabledReason = null;
                
                if (selection.guestCount === '81-150') { isDisabled = true; disabledReason = 'Неэффективен для >80 гостей'; }
                
                card.classList.toggle('disabled', isDisabled);
                card.classList.toggle('selected', selection.projectorNeeded && !isDisabled);
                
                card.querySelector('.disabled-reason')?.remove();
                if (isDisabled && disabledReason) { card.querySelector('div').insertAdjacentHTML('beforeend', `<p class="text-sm disabled-reason mt-2">🛑 ${disabledReason}</p>`); }
            }
        }

        function updateCreativeCardsUI() {
            const aiCard = DOMElements.creativeOptions.querySelector('[data-creative-type="ai"]');
            if (aiCard) {
                const aiGames = selection.creative.ai_games || {};
                const selectedCount = Object.values(aiGames).filter(Boolean).length;
                const isSelected = selectedCount > 0;
                let totalPrice = Object.keys(aiGames).reduce((sum, key) => aiGames[key] ? sum + PRICES.CREATIVE.AI_GAMES[key].price : sum, 0);
                
                aiCard.classList.toggle('selected', isSelected);
                aiCard.querySelector('[data-creative-subtitle]').textContent = isSelected ? `Выбрано: ${selectedCount} игр(ы)` : 'Персонализация вечера нового уровня';
                aiCard.querySelector('[data-creative-price]').textContent = isSelected ? `+ ${totalPrice.toLocaleString('ru-RU')} ₸` : 'от 5 000 ₸';
                aiCard.querySelector('[data-reset-target="ai"]').classList.toggle('hidden', !isSelected);
            }
            const eminemCard = DOMElements.creativeOptions.querySelector('[data-creative-type="eminem"]');
            if (eminemCard) {
                const selectedCount = Object.keys(selection.creative.eminem_tracks || {}).length;
                const isSelected = selectedCount > 0;
                eminemCard.classList.toggle('selected', isSelected);
                eminemCard.querySelector('[data-creative-subtitle]').textContent = isSelected ? `Выбрано: ${selectedCount} из 5 треков` : 'Соберите свой сет-лист (до 5 треков)';
                eminemCard.querySelector('[data-reset-target="eminem"]').classList.toggle('hidden', !isSelected);
            }
        }

        function updatePhotographerSection() {
            const section = DOMElements.photographer.section;
            if (!section) return;
            DOMElements.photographer.toggleBtns.forEach(btn => { btn.classList.toggle('active', btn.dataset.value === selection.photographerNeeded); });
            const isNeeded = selection.photographerNeeded === 'yes';
            section.classList.toggle('active', isNeeded);
            if (isNeeded) {
                const hours = selection.photographerHours;
                DOMElements.photographer.hoursOutput.textContent = `${hours} час${hours > 1 && hours < 5 ? 'а' : hours >= 5 ? 'ов' : ''}`;
                DOMElements.photographer.hoursSlider.value = hours;
                const minPhotos = hours * 30; const maxPhotos = hours * 50;
                DOMElements.photographer.photoCountOutput.innerHTML = `<i class="fas fa-images mr-2"></i>Вы получите примерно ${minPhotos}-${maxPhotos} фотографий в базовой обработке.`;
                const photoHourPrice = hours * PRICES.PHOTOGRAPHER.baseHourRate;
                if (DOMElements.photographer.hoursCostOutput) { DOMElements.photographer.hoursCostOutput.textContent = `(${photoHourPrice.toLocaleString('ru-RU')} ₸)`; }
                DOMElements.photographer.retouchInput.value = selection.additionalRetouch;
                const additionalCost = selection.additionalRetouch * PRICES.PHOTOGRAPHER.additionalRetouchPrice;
                DOMElements.photographer.retouchCost.innerHTML = `Стоимость: <span class="text-white font-bold">${additionalCost.toLocaleString('ru-RU')} ₸</span>`;
            }
        }

        function handleOptionSelection(group, value) {
            if (group === 'host') { 
                selection.hostHours = value; 
            }
            else if (group === 'tech') {
                selection.techOption = selection.techOption === value ? null : value;
                if (selection.techOption === null && selection.projectorNeeded) { selection.projectorNeeded = false; }
            } 
            else if (group === 'creative' && value === 'PROJECTOR') {
                selection.projectorNeeded = !selection.projectorNeeded;
                if (selection.projectorNeeded) { enforceDjForProjector(); }
                else { 
                    Object.keys(selection.creative.ai_games).forEach(gameKey => { 
                        if (selection.creative.ai_games[gameKey] && PRICES.CREATIVE.AI_GAMES[gameKey]?.requiresScreen) { 
                            selection.creative.ai_games[gameKey] = false; 
                        } 
                    }); 
                }
            }
            reRenderUI();
        }

        function initializeApp() {
            DOMElements = {
                totalPriceEl: hostCalculator.querySelector('#total-price'),
                summaryListEl: hostCalculator.querySelector('#summary-list'),
                eventDateInput: hostCalculator.querySelector('#event-date'),
                locationSelect: hostCalculator.querySelector('#host-location'),
                
                hostHoursBlock: document.getElementById('host-hours-block'),
                hostFixedBlock: {
                    container: document.getElementById('host-fixed-block'),
                    title: document.getElementById('host-fixed-title'),
                    desc: document.getElementById('host-fixed-desc'),
                    price: document.getElementById('host-fixed-price')
                },
                
                hostOptions: hostCalculator.querySelector('#host-options'),
                hostCards: hostCalculator.querySelectorAll('[data-group="host"]'),
                
                venueGearContainer: document.getElementById('venue-gear-container'),
                
                techSection: hostCalculator.querySelector('#tech-section'),
                techSectionContainers: { 
                    fullDjSet: document.getElementById('tech-container-full-dj'), 
                    soundOnly: document.getElementById('tech-container-sound-only'), 
                    noGear: document.getElementById('tech-container-no-gear'),
                    out: document.getElementById('tech-container-out')
                },
                allTechCards: hostCalculator.querySelectorAll('[data-group="tech"]'),
                projectorCard: hostCalculator.querySelector('[data-value="PROJECTOR"]'),
                creativeOptions: hostCalculator.querySelector('#creative-options'),
                parameterSelects: hostCalculator.querySelectorAll('select'), 
                copyQuoteBtn: hostCalculator.querySelector('#copy-quote-btn'),
                toastNotification: document.getElementById('toast-notification'),
                summaryCard: hostCalculator.querySelector('[data-summary-id="host"]'),
                venueScreenToggleBtns: hostCalculator.querySelectorAll('.screen-toggle-btn'),
                photographer: { 
                    section: hostCalculator.querySelector('#photographer-section'), 
                    toggleBtns: hostCalculator.querySelectorAll('.photographer-toggle-btn'), 
                    hoursSlider: hostCalculator.querySelector('#photo-hours-slider'), 
                    hoursOutput: hostCalculator.querySelector('#photo-hours-output'), 
                    hoursCostOutput: hostCalculator.querySelector('#photographer-hours-cost'), 
                    photoCountOutput: hostCalculator.querySelector('#photo-count-output'), 
                    retouchInput: hostCalculator.querySelector('#additional-retouch-input'), 
                    retouchCost: hostCalculator.querySelector('#additional-retouch-cost'), 
                    decrementBtn: hostCalculator.querySelector('#decrement-retouch'), 
                    incrementBtn: hostCalculator.querySelector('#increment-retouch'), 
                }
            };

            const photographerSection = DOMElements.photographer.section;
            if (photographerSection) {
                if (photographerSection.classList.contains('content-panel')) { photographerSection.classList.remove('content-panel'); }
                photographerSection.classList.add('photographer-details-block');
                const styleId = 'photographer-fix-styles';
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style'); style.id = styleId;
                    style.textContent = `.photographer-details-block { opacity: 0; max-height: 0; overflow: hidden; visibility: hidden; transition: opacity 0.3s ease-out, max-height 0.4s ease-out, visibility 0.4s, margin-bottom 0.4s ease-out; margin-bottom: 0; } .photographer-details-block.active { opacity: 1; visibility: visible; max-height: 1000px; margin-bottom: 2rem; }`;
                    document.head.appendChild(style);
                }
            }

            selection = { 
                hostHours: '6', 
                projectorNeeded: false, 
                techOption: 'STANDARD', 
                creative: { ai_games: {}, eminem_tracks: {} }, 
                totalPrice: 0, 
                venueType: 'standard', 
                guestCount: '1-40', 
                venueGear: 'none', 
                venueScreen: 'no', 
                photographerNeeded: 'no', 
                photographerHours: 1, 
                additionalRetouch: 0,
                eventDate: null,
                isNewYearMode: false,
                location: 'almaty'
            };

            setupRetouchTooltip();
            setupTermsModal();

            DOMElements.hostCards.forEach(card => card.addEventListener('click', () => handleOptionSelection('host', card.dataset.value)));
            DOMElements.allTechCards.forEach(card => card.addEventListener('click', () => { 
                if (card.dataset.value === 'DJ_OUT' || !card.classList.contains('disabled')) {
                    handleOptionSelection('tech', card.dataset.value) 
                }
            }));
            
            if (DOMElements.projectorCard) DOMElements.projectorCard.addEventListener('click', () => { if (!DOMElements.projectorCard.classList.contains('disabled')) handleOptionSelection('creative', 'PROJECTOR') });
            
            DOMElements.creativeOptions.addEventListener('click', (e) => {
                const resetButton = e.target.closest('[data-reset-target]');
                if (resetButton) { 
                    e.preventDefault(); e.stopPropagation(); 
                    const target = resetButton.dataset.resetTarget; 
                    if (target === 'ai') selection.creative.ai_games = {}; 
                    else if (target === 'eminem') selection.creative.eminem_tracks = {}; 
                    reRenderUI(); 
                }
            });

            DOMElements.venueScreenToggleBtns.forEach(btn => { btn.addEventListener('click', () => { selection.venueScreen = btn.dataset.value; reRenderUI(); }); });
            DOMElements.photographer.toggleBtns.forEach(btn => { btn.addEventListener('click', () => { selection.photographerNeeded = btn.dataset.value; reRenderUI(); }); });
            DOMElements.photographer.hoursSlider.addEventListener('input', (e) => { selection.photographerHours = parseInt(e.target.value, 10); reRenderUI(); });
            DOMElements.photographer.retouchInput.addEventListener('change', (e) => { selection.additionalRetouch = parseInt(e.target.value, 10) || 0; if (selection.additionalRetouch < 0) selection.additionalRetouch = 0; reRenderUI(); });
            DOMElements.photographer.decrementBtn.addEventListener('click', () => { if (selection.additionalRetouch > 0) { selection.additionalRetouch--; reRenderUI(); } });
            DOMElements.photographer.incrementBtn.addEventListener('click', () => { selection.additionalRetouch++; reRenderUI(); });
            
            if (DOMElements.eventDateInput) DOMElements.eventDateInput.addEventListener('change', handleDateChange);
            if (DOMElements.locationSelect) DOMElements.locationSelect.addEventListener('change', handleLocationChange);
            
            DOMElements.parameterSelects.forEach(sel => {
                if(sel.id !== 'host-location') { 
                    sel.addEventListener('change', () => { readParameters(); reRenderUI(); });
                }
            });

            reRenderUI();
            setupFloatingBar();
            DOMElements.copyQuoteBtn.addEventListener('click', () => copyToClipboard(generatePlainTextQuote()));
            document.addEventListener('calculatorModeChanged', () => { if (hostCalculator.classList.contains('active')) { reRenderUI(); } else { updateFloatingBarUI(0, 0); } });
        }

        function getItemsCount() {
            let count = 0;
            count++; 
            if (selection.venueGear !== 'full_dj_set' && selection.techOption && (PRICES.TECH[selection.techOption] || PRICES.DJ_OUT)) count++;
            if (selection.projectorNeeded) count++;
            count += Object.values(selection.creative.ai_games || {}).filter(Boolean).length;
            if (Object.keys(selection.creative.eminem_tracks || {}).length > 0) count++;
            if (selection.photographerNeeded === 'yes') count++;
            return count;
        }

        function handleAiModalClicks(e) {
            if (e.target.closest('[data-modal-trigger="videoModal"]')) return;
            const gameCard = e.target.closest('[data-game-key]');
            if (gameCard && !gameCard.classList.contains('disabled')) { const key = gameCard.dataset.gameKey; selection.creative.ai_games[key] = !selection.creative.ai_games[key]; updateAIGamesModalUI(); reRenderUI(); }
            if (e.target.id === 'reset-ai-selection') { selection.creative.ai_games = {}; updateAIGamesModalUI(); reRenderUI(); }
            if (e.target.id === 'add-projector-from-modal') { selection.projectorNeeded = true; enforceDjForProjector(); reRenderUI(); renderAIGamesModal(); }
        }

        function handleEminemModalClicks(e) {
            if (e.target.closest('[data-modal-trigger="videoModal"]')) return;
            const trackCard = e.target.closest('[data-track-id]');
            const selectedCount = Object.keys(selection.creative.eminem_tracks || {}).length;
            if (trackCard && !trackCard.classList.contains('disabled')) { 
                const id = trackCard.dataset.trackId; 
                if (selection.creative.eminem_tracks[id]) { 
                    delete selection.creative.eminem_tracks[id]; 
                } else if (selectedCount < 5) { 
                    selection.creative.eminem_tracks[id] = true; 
                } 
            }
            if (e.target.id === 'reset-eminem-selection') { 
                selection.creative.eminem_tracks = {}; 
            }
            updateEminemModalUI();
            reRenderUI();
        }

        function updateAIGamesModalUI() {
            if (!aiGamesModal) return;
            const screenAvailable = selection.venueScreen === 'yes' || selection.projectorNeeded;
            aiGamesModal.querySelectorAll('[data-game-key]').forEach(card => {
                const game = PRICES.CREATIVE.AI_GAMES[card.dataset.gameKey];
                const isSelected = !!selection.creative.ai_games[card.dataset.gameKey];
                const isDisabled = game.requiresScreen && !screenAvailable;
                card.classList.toggle('selected', isSelected);
                card.classList.toggle('disabled', isDisabled);
            });
        }

        function updateEminemModalUI() {
            if (!eminemModal) return;
            const selectedTracks = selection.creative.eminem_tracks || {};
            const selectedCount = Object.keys(selectedTracks).length;
            const limitReached = selectedCount >= 5;
            eminemModal.querySelectorAll('[data-track-id]').forEach(card => {
                const isSelected = !!selectedTracks[card.dataset.trackId];
                card.classList.toggle('selected', isSelected);
                card.classList.toggle('disabled', limitReached && !isSelected);
            });
            eminemModal.querySelector('.count').textContent = `${selectedCount}/5`;
            eminemModal.querySelector('.limit-reached')?.classList.toggle('hidden', !limitReached);
        }

        function renderAIGamesModal() {
            if (!aiGamesModal) return;
            const videoExamples = { RZHAKAPELLA: 'B_HlDb04LLg', II_POSLOVITSY: 'XKWj6H1m3KM', NEURO_FILTERS: '3dmlrrxFnLU', CHTO_BYLO_DALSHE: 'GWK6OLf6jTM', AI_STAR_GREETING: 'Yogsp5Xa_Do' };
            const modalContent = aiGamesModal.querySelector('.modal-content');
            const screenAvailable = selection.venueScreen === 'yes' || selection.projectorNeeded;
            const canAddProjector = selection.venueScreen === 'no' && !selection.projectorNeeded && selection.guestCount !== '81-150' && !['kz', 'intl'].includes(selection.location);
            let gamesHTML = '';

            for (const [key, game] of Object.entries(PRICES.CREATIVE.AI_GAMES)) {
                const isSelected = !!selection.creative.ai_games[key];
                const isDisabled = game.requiresScreen && !screenAvailable;
                const disabledReason = isDisabled ? `<p class="disabled-reason">🛑 Для этой игры нужен экран или проектор</p>` : '';
                const videoId = videoExamples[key];
                const exampleButtonHTML = videoId ? `<button class="btn-youtube" data-modal-trigger="videoModal" data-video-src="${videoId}"><i class="fab fa-youtube mr-2"></i>Пример</button>` : '';
                const footerContent = `${disabledReason} ${exampleButtonHTML}`;
                const hasFooter = disabledReason || exampleButtonHTML;

                gamesHTML += `<div class="creative-card ai-game-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-game-key="${key}"><div class="ai-card-main-content"><div class="card-header"><h4 class="card-title">${game.name}</h4><p class="card-price">+${game.price.toLocaleString('ru-RU')} ₸</p></div><p class="card-desc">${game.desc}</p></div>${hasFooter ? `<div class="ai-card-footer">${footerContent}</div>` : ''}</div>`;
            }
            
            const addProjectorButtonHTML = canAddProjector ? `<button id="add-projector-from-modal" class="btn-add-projector"><i class="mr-2"></i>Добавить Проектор (+${PRICES.PROJECTOR.price.toLocaleString('ru-RU')} ₸)</button>` : '';
            const projectorWarningHTML = !screenAvailable ? `<div class="text-center mb-4"><p class="text-amber-400 font-medium text-sm">⚠️ Некоторым играм требуется экран.</p>${canAddProjector ? '<p class="text-xs text-gray-400 mt-1">Для управления проектором будет автоматически добавлен DJ.</p>' : ''}</div>` : '';
            modalContent.innerHTML = `<div class="modal-header"><div class="modal-title-group"><div><h3 class="modal-title">AI-ШОУ</h3><p class="modal-subtitle">Выберите уникальные интерактивы для ваших гостей</p></div></div><button class="modal-close-btn js-modal-close">&times;</button></div><div class="modal-body"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${gamesHTML}</div></div><div class="modal-footer flex-col">${projectorWarningHTML}<div class="footer-actions">${addProjectorButtonHTML}<button id="reset-ai-selection" class="btn-reset py-3 px-6 rounded-lg">Сбросить</button><button class="btn-primary font-bold py-3 px-8 rounded-lg js-modal-close">Готово</button></div></div>`;
        }

        function renderEminemModal() {
            if (!eminemModal) return;
            const modalContent = eminemModal.querySelector('.modal-content');
            const selectedTracks = selection.creative.eminem_tracks || {}; 
            const selectedCount = Object.keys(selectedTracks).length; 
            const limitReached = selectedCount >= 5;
            let tracksHTML = '';
            TRACK_LIST.forEach(track => { 
                const isSelected = selectedTracks[track.id]; 
                const isDisabled = limitReached && !isSelected; 
                const exampleButtonHTML = `<button class="btn-youtube" data-modal-trigger="videoModal" data-video-src="${track.url.split('v=')[1]}"><i class="fab fa-youtube mr-2"></i>Пример</button>`;
                tracksHTML += `<div class="creative-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-track-id="${track.id}"><div class="track-card-header"><h4 class="card-title">${track.name}</h4>${exampleButtonHTML}</div><div class="track-meta"><span><i class="fas fa-microphone-alt"></i> ${track.structure}</span><span><i class="fas fa-clock"></i> ${track.duration}</span></div></div>`; 
            });
            modalContent.innerHTML = `<div class="modal-header"><div class="modal-title-group"><div><h3 class="modal-title">Eminem Tribute Show</h3><p class="modal-subtitle">Соберите свой идеальный сет-лист для зажигательного выступления</p></div></div><button class="modal-close-btn js-modal-close">&times;</button></div><div class="modal-body"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tracksHTML}</div></div><div class="modal-footer"><div class="footer-info"><p>Выбрано <span class="count">${selectedCount}/5</span> треков</p><p class="limit-reached text-amber-400 font-semibold mt-1 ${limitReached ? '' : 'hidden'}">Достигнут максимум</p></div><div class="footer-buttons"><button id="reset-eminem-selection" class="btn-reset py-3 px-6 rounded-lg">Сбросить</button><button class="btn-primary font-bold py-3 px-8 rounded-lg js-modal-close">Готово</button></div></div>`;
        }

        function readParameters() {
            const oldVenueGear = selection.venueGear;
            selection.venueType = DOMElements.parameterSelects[1].value; // venue-type (индекс 1 после локации)
            selection.guestCount = DOMElements.parameterSelects[2].value;
            selection.venueGear = DOMElements.parameterSelects[3].value;

            // Если изменился venueGear и мы в Алматы, пересчитываем дефолтный тех. пакет
            if (oldVenueGear !== selection.venueGear && ['almaty', 'almaty_region'].includes(selection.location)) {
                selection.projectorNeeded = false;
                if (selection.venueGear === 'none') { 
                    const venue = selection.venueType, guests = selection.guestCount; 
                    if (venue === 'large' || guests === '81-150') selection.techOption = 'MAXI'; 
                    else if (venue === 'standard' || guests === '41-80') selection.techOption = 'STANDARD'; 
                    else selection.techOption = 'COMPACT'; 
                }
                else if (selection.venueGear === 'sound_only') { selection.techOption = 'DJ_WORK_ONLY'; }
                else { selection.techOption = null; }
            }
        }

        function enforceDjForProjector() {
            if (selection.venueGear === 'sound_only') { selection.techOption = 'DJ_WORK_ONLY'; }
            else if (selection.venueGear === 'none' && (selection.techOption === 'COMPACT' || !selection.techOption)) { selection.techOption = 'STANDARD'; }
        }

        function updateSummaryAndPrice() {
            let totalKZT = 0; 
            let totalUSD = 0;
            let currency = '₸';
            
            let baseItems = [], techItems = [], creativeItems = [], photographerItems = [];
            const isNY = selection.isNewYearMode;
            const isOutbound = ['kz', 'intl'].includes(selection.location);
            
            // 1. ВЕДУЩИЙ
            if (!isOutbound) {
                // Почасовая оплата (Тенге)
                const hostPriceSource = isNY ? PRICES.NEW_YEAR.HOST : PRICES.HOST;
                const hostPrice = hostPriceSource[selection.hostHours]; 
                if (hostPrice) { 
                    totalKZT += hostPrice; 
                    baseItems.push({ name: `Ведущий (до ${selection.hostHours} ч)`, price: hostPrice }); 
                }
            } else {
                // Фиксированная оплата выезда
                const locData = isNY ? PRICES.NEW_YEAR.HOST_LOCATION[selection.location] : PRICES.HOST_LOCATION[selection.location];
                if (locData) {
                    // Проверяем валюту
                    if (locData.currency === '$') {
                        totalUSD += locData.price;
                        currency = '$';
                    } else {
                        totalKZT += locData.price;
                    }
                    baseItems.push({ name: locData.name, price: locData.price, currency: locData.currency || '₸' });
                }
            }
            
            // 2. ТЕХНИКА
            if (!isOutbound) {
                // Стандартная логика для Алматы (Тенге)
                if (selection.venueGear === 'full_dj_set') { 
                    techItems.push({ name: '✅ Пакет не требуется', price: null }); 
                } else if (selection.techOption && PRICES.TECH[selection.techOption]) { 
                    const tech = PRICES.TECH[selection.techOption];
                    const techPrice = (isNY && PRICES.NEW_YEAR.TECH[selection.techOption]) 
                                    ? PRICES.NEW_YEAR.TECH[selection.techOption].price 
                                    : tech.price;
                    totalKZT += techPrice; 
                    techItems.push({ name: tech.name, price: techPrice }); 
                }
            } else if (selection.location === 'kz') {
                // Логика для KZ (Тенге)
                if (selection.techOption === 'DJ_OUT') {
                    const price = (isNY && PRICES.NEW_YEAR.DJ_OUT) ? PRICES.NEW_YEAR.DJ_OUT.price : PRICES.DJ_OUT.price;
                    totalKZT += price;
                    techItems.push({ name: PRICES.DJ_OUT.name, price: price, currency: '₸' });
                }
            } else if (selection.location === 'intl') {
                // Логика для Intl (Доллары)
                if (selection.techOption === 'DJ_OUT') {
                    const price = (isNY && PRICES.NEW_YEAR.DJ_INTL) ? PRICES.NEW_YEAR.DJ_INTL.price : PRICES.DJ_INTL.price;
                    totalUSD += price;
                    techItems.push({ name: PRICES.DJ_INTL.name, price: price, currency: '$' });
                }
            }

            // 3. ПРОЕКТОР (Только Алматы, Тенге)
            if (selection.projectorNeeded && !isOutbound) { 
                totalKZT += PRICES.PROJECTOR.price; 
                techItems.push({ name: PRICES.PROJECTOR.name, price: PRICES.PROJECTOR.price }); 
            }
            
            // 4. КРЕАТИВ (Тенге)
            Object.keys(selection.creative.ai_games).forEach(key => { 
                if (selection.creative.ai_games[key]) { 
                    const game = PRICES.CREATIVE.AI_GAMES[key]; 
                    totalKZT += game.price; 
                    creativeItems.push({ name: game.name, price: game.price }); 
                } 
            });
            const selectedTracks = Object.keys(selection.creative.eminem_tracks || {}); 
            if (selectedTracks.length > 0) { 
                const eminem = PRICES.CREATIVE.EMINEM; 
                totalKZT += eminem.basePrice; 
                const trackNames = selectedTracks.map(id => TRACK_LIST.find(t => t.id === id)?.name).filter(Boolean); 
                creativeItems.push({ name: `${eminem.name} (${selectedTracks.length} тр.)`, price: eminem.basePrice, tracks: trackNames }); 
            }
            
            // 5. ФОТОГРАФ (Тенге)
            if (selection.photographerNeeded === 'yes') { 
                const photoHourPrice = selection.photographerHours * PRICES.PHOTOGRAPHER.baseHourRate; 
                const additionalRetouchCost = selection.additionalRetouch * PRICES.PHOTOGRAPHER.additionalRetouchPrice; 
                const totalPhotoCost = photoHourPrice + additionalRetouchCost; 
                totalKZT += totalPhotoCost; 
                photographerItems.push({ name: `Работа фотографа (${selection.photographerHours} ч)`, price: photoHourPrice }); 
                if (selection.additionalRetouch > 0) { 
                    photographerItems.push({ name: `Доп. ретушь (${selection.additionalRetouch} фото)`, price: additionalRetouchCost }); 
                } 
            }

            const buildCategoryHtml = (title, icon, items) => { 
                if (!items.length) return ''; 
                let itemsHtml = items.map(item => { 
                    let trackListHtml = item.tracks ? `<ul class="summary-track-list">${item.tracks.map(t => `<li>${t}</li>`).join('')}</ul>` : ''; 
                    const cur = item.currency || '₸';
                    const priceHtml = item.price !== null ? `<span class="summary-item-price">${item.price.toLocaleString('ru-RU')} ${cur}</span>` : ''; 
                    const nameClass = item.price === null ? 'is-free' : ''; 
                    return `<div class="summary-item"><div class="summary-item-name ${nameClass}">${item.name}</div>${priceHtml}</div>${trackListHtml}`; 
                }).join(''); 
                return `<div class="summary-category"><div class="summary-category-header"><i class="fas ${icon}"></i><span>${title}</span></div><div class="summary-items-container">${itemsHtml}</div></div>`; 
            };
            
            DOMElements.summaryListEl.innerHTML = [
                buildCategoryHtml('Основа', 'fa-microphone-alt', baseItems), 
                buildCategoryHtml('Тех. Оснащение', 'fa-cogs', techItems), 
                buildCategoryHtml('Услуги фотографа', 'fa-camera-retro', photographerItems), 
                buildCategoryHtml('Креативные фишки', 'fa-star', creativeItems)
            ].filter(Boolean).join('<hr class="summary-separator">');
            
            // Уведомления
            const notifContainer = document.getElementById('host-notifications');
            if (notifContainer) {
                 notifContainer.innerHTML = '';
                 if (isOutbound) {
                     notifContainer.innerHTML = `<div class="notification-card"><i class="fas fa-plane"></i><p>Трансфер и проживание оплачиваются отдельно (см. Райдер).</p></div><button data-modal-trigger="riderModal" class="btn-rider w-full mt-2">Ознакомиться с райдером</button>`;
                 } else if (selection.location === 'almaty_region') {
                     notifContainer.innerHTML = `<div class="notification-card"><i class="fas fa-car"></i><p>Трансфер (такси) оплачивается отдельно.</p></div>`;
                 }
            }

            // Формирование строки ИТОГО
            let totalString = "";
            if (totalUSD > 0 && totalKZT > 0) {
                totalString = `${totalUSD} $ + ${totalKZT.toLocaleString('ru-RU')} ₸`;
            } else if (totalUSD > 0) {
                totalString = `${totalUSD} $`;
            } else {
                totalString = `${Math.round(totalKZT).toLocaleString('ru-RU')} ₸`;
            }

            DOMElements.totalPriceEl.textContent = totalString;
            selection.totalPrice = totalString; 
            
            updateFloatingBarUI(totalString, getItemsCount(), null);
        }

        function generatePlainTextQuote() {
            let messageParts = ["Здравствуйте, Валерий!", "Сформировал(а) смету на belskiy.kz:\n"];
            if (selection.eventDate) {
                const [year, month, day] = selection.eventDate.split('-');
                messageParts.push(`*ДАТА МЕРОПРИЯТИЯ: ${day}.${month}.${year}*`);
            }
            if (selection.isNewYearMode) messageParts.push(`*ТАРИФ: Новогодний*`);
            
            messageParts.push(`\n*УСЛУГА: Ведущий мероприятий*`);
            
            const locationMap = { 'almaty': 'В пределах г. Алматы', 'almaty_region': 'Алматинская область', 'kz': 'Другой город РК', 'intl': 'Другая страна' };
            messageParts.push(`- Местоположение: ${locationMap[selection.location]}`);
            
            messageParts.push(`\n*ПАРАМЕТРЫ ПЛОЩАДКИ:*`);
            const paramText = { venueType: { 'chamber': 'Камерная', 'standard': 'Стандартная', 'large': 'Открытая/Большая' }, venueGear: { 'none': 'Ничего нет', 'sound_only': 'Только звук', 'full_dj_set': 'Есть всё' }, venueScreen: { 'no': 'Нет', 'yes': 'Да' } };
            messageParts.push(`- Тип площадки: ${paramText.venueType[selection.venueType]}`);
            messageParts.push(`- Количество гостей: ${selection.guestCount}`);
            
            if (!['kz', 'intl'].includes(selection.location)) {
                messageParts.push(`- Оборудование и DJ от заведения: ${paramText.venueGear[selection.venueGear]}`);
                messageParts.push(`- Экран в заведении: ${paramText.venueScreen[selection.venueScreen]}`);
            }
            messageParts.push(`- Фотограф: ${selection.photographerNeeded === 'yes' ? 'Нужен' : 'Не нужен'}`);
            
            let baseServices = [], techServices = [], creativeServices = [], photoServices = []; 
            const isNY = selection.isNewYearMode;
            
            // Логика текста для Ведущего
            if (!['kz', 'intl'].includes(selection.location)) {
                const hostPriceSource = isNY ? PRICES.NEW_YEAR.HOST : PRICES.HOST;
                if (hostPriceSource[selection.hostHours]) { 
                    baseServices.push(`- Ведущий (до ${selection.hostHours} ч): ${hostPriceSource[selection.hostHours].toLocaleString('ru-RU')} ₸`); 
                }
            } else {
                 const locData = isNY ? PRICES.NEW_YEAR.HOST_LOCATION[selection.location] : PRICES.HOST_LOCATION[selection.location];
                 const currency = locData.currency || '₸';
                 baseServices.push(`- ${locData.name}: ${locData.price.toLocaleString('ru-RU')} ${currency}`);
            }
            
            // Логика текста для Техники
            if (selection.location === 'kz') {
                 if (selection.techOption === 'DJ_OUT') {
                     const price = (isNY && PRICES.NEW_YEAR.DJ_OUT) ? PRICES.NEW_YEAR.DJ_OUT.price : PRICES.DJ_OUT.price;
                     techServices.push(`- ${PRICES.DJ_OUT.name}: ${price.toLocaleString('ru-RU')} ₸`);
                 }
            } else if (selection.location === 'intl') {
                 if (selection.techOption === 'DJ_OUT') {
                     const price = (isNY && PRICES.NEW_YEAR.DJ_INTL) ? PRICES.NEW_YEAR.DJ_INTL.price : PRICES.DJ_INTL.price;
                     techServices.push(`- ${PRICES.DJ_INTL.name}: ${price} $`);
                 }
            } else {
                if (selection.venueGear !== 'full_dj_set' && selection.techOption && PRICES.TECH[selection.techOption]) {
                    const techPrice = (isNY && PRICES.NEW_YEAR.TECH[selection.techOption]) ? PRICES.NEW_YEAR.TECH[selection.techOption].price : PRICES.TECH[selection.techOption].price;
                    techServices.push(`- ${PRICES.TECH[selection.techOption].name}: ${techPrice.toLocaleString('ru-RU')} ₸`); 
                }
                if (selection.projectorNeeded) techServices.push(`- ${PRICES.PROJECTOR.name}: ${PRICES.PROJECTOR.price.toLocaleString('ru-RU')} ₸`); 
            }
            
            if (selection.photographerNeeded === 'yes') { 
                const photoHourPrice = selection.photographerHours * PRICES.PHOTOGRAPHER.baseHourRate; 
                photoServices.push(`- Работа фотографа (${selection.photographerHours} ч): ${photoHourPrice.toLocaleString('ru-RU')} ₸`); 
                if (selection.additionalRetouch > 0) { 
                    const additionalRetouchCost = selection.additionalRetouch * PRICES.PHOTOGRAPHER.additionalRetouchPrice; 
                    photoServices.push(`- Доп. ретушь (${selection.additionalRetouch} фото): ${additionalRetouchCost.toLocaleString('ru-RU')} ₸`); 
                } 
            }
            
            Object.keys(selection.creative.ai_games || {}).filter(key => selection.creative.ai_games[key]).forEach(key => { creativeServices.push(`- ${PRICES.CREATIVE.AI_GAMES[key].name}: ${PRICES.CREATIVE.AI_GAMES[key].price.toLocaleString('ru-RU')} ₸`); });
            if (Object.keys(selection.creative.eminem_tracks || {}).length > 0) { creativeServices.push(`- Eminem Show: ${PRICES.CREATIVE.EMINEM.basePrice.toLocaleString('ru-RU')} ₸`); }
            
            if (baseServices.length) { messageParts.push('\n*ПРОГРАММА ВЕДУЩЕГО:*', ...baseServices); }
            if (techServices.length) { messageParts.push('\n*ТЕХНИЧЕСКОЕ ОСНАЩЕНИЕ:*', ...techServices); }
            if (photoServices.length) { messageParts.push('\n*УСЛУГИ ФОТОГРАФА:*', ...photoServices); }
            if (creativeServices.length) { messageParts.push('\n*КРЕАТИВНЫЕ ФИШКИ:*', ...creativeServices); }
            
            messageParts.push(`\n*ИТОГОВАЯ СТОИМОСТЬ: ${selection.totalPrice}*`);
            
            if (['kz', 'intl'].includes(selection.location)) {
                messageParts.push("\n*Дополнительно оплачиваются расходы на логистику (проезд, проживание), согласно райдеру.*");
            } else if (selection.location === 'almaty_region') {
                messageParts.push("\n*Транспортные расходы (такси) оплачиваются отдельно.*");
            }

            return messageParts.join('\n');
        }

        function setupFloatingBar() {
            const bar = document.getElementById('host-floating-summary-bar'); const modal = document.getElementById('host-summary-modal'); const openBtn = document.getElementById('host-floating-open-modal'); const modalCopyBtn = document.getElementById('host-modal-copy-btn'); if (!bar || !modal || !openBtn || !modalCopyBtn) return;
            const openModal = () => { modal.classList.add('open'); document.body.classList.add('modal-open'); }; const closeModalFn = () => { modal.classList.remove('open'); document.body.classList.remove('modal-open'); };
            openBtn.addEventListener('click', openModal); modal.addEventListener('click', (e) => { if (e.target.closest('.modal-close-btn') || e.target === modal) closeModalFn(); });
            modalCopyBtn.addEventListener('click', () => copyToClipboard(generatePlainTextQuote()));
            const summaryCardObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (hostCalculator.classList.contains('active')) { bar.classList.toggle('hidden-by-scroll', entry.isIntersecting); } }); }, { threshold: 0.1 });
            if (DOMElements.summaryCard) summaryCardObserver.observe(DOMElements.summaryCard);
        }

        function updateFloatingBarUI(totalString, itemsCount, currency) {
            const bar = document.getElementById('host-floating-summary-bar'); if (!bar) return;
            const shouldBeVisible = itemsCount > 0 && hostCalculator.classList.contains('active');
            
            bar.classList.toggle('visible', shouldBeVisible);
            if (window.innerWidth < 768) { const rapBarIsVisible = document.getElementById('rap-floating-summary-bar')?.classList.contains('visible'); if (shouldBeVisible) { document.body.style.paddingBottom = bar.offsetHeight + 20 + 'px'; } else if (!rapBarIsVisible) { document.body.style.paddingBottom = '0px'; } }
            if (shouldBeVisible) {
                document.getElementById('host-floating-total').textContent = `Итого: ${totalString}`;
                document.getElementById('host-floating-count').textContent = itemsCount;
                
                // --- НАЧАЛО ИСПРАВЛЕНИЯ ---
                
                // 1. Берем основной список услуг
                const summaryContent = DOMElements.summaryListEl.innerHTML;
                
                // 2. Берем блок уведомлений (желтые плашки)
                const notifContainer = document.getElementById('host-notifications');
                const notificationsContent = notifContainer ? notifContainer.innerHTML : '';
                
                // 3. Если уведомления есть, добавляем разделитель <hr>
                const separator = notificationsContent ? '<hr class="summary-separator mt-4 mb-4">' : '';
                
                // 4. Склеиваем всё вместе и вставляем в модалку
                document.getElementById('host-modal-summary-content').innerHTML = summaryContent + separator + notificationsContent;
                
                // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

                document.getElementById('host-modal-total-price').textContent = `${totalString}`;
            }
        }

        function copyToClipboard(text) { navigator.clipboard.writeText(text).then(showToast, err => console.error('Не удалось скопировать', err)); }
        function showToast() {
            const toast = document.getElementById('toast-notification'); const whatsappBtn = document.getElementById('whatsapp-send-btn');
            if (toast && whatsappBtn) {
                const phoneNumber = '77079292980'; const invitationText = 'Вставьте скопированную заявку сюда.'; const encodedText = encodeURIComponent(invitationText);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
                whatsappBtn.href = whatsappUrl; toast.classList.add('show');
                setTimeout(() => { toast.classList.remove('show'); }, 6000);
            }
        }
        
        initializeApp();
    })();
} 

initializeHostCalculator();
document.addEventListener('astro:page-load', initializeHostCalculator);