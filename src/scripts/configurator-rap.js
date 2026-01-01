function initializeRapCalculator() {
    const rapCalculatorContent = document.getElementById('rap-calculator-content');
    if (!rapCalculatorContent) return;

    let DOMElements = {};
    let selection = {};

    function initializeRapApp() {
        DOMElements = {
            dateInput: document.getElementById('rap-event-date'),
            locationSelect: document.getElementById('rap-location'),

            // New Sliders
            showTimeSlider: document.getElementById('rap-show-time'),
            showTimeOutput: document.getElementById('rap-show-time-output'),
            totalTimeSlider: document.getElementById('rap-total-time'),
            totalTimeOutput: document.getElementById('rap-total-time-output'),

            summaryList: document.getElementById('rap-summary-list'),
            notifications: document.getElementById('rap-notifications'),
            totalPrice: document.getElementById('rap-total-price'),
            copyQuoteBtn: document.getElementById('copy-rap-quote-btn'),
            summaryCard: rapCalculatorContent.querySelector('[data-summary-id="rap"]'),
        };

        selection = {
            mode: 'rap',
            location: 'almaty',
            eventDate: null,
            isNewYearMode: false,
            showDuration: 30, // minutes
            totalDuration: 60 // minutes
        };

        setupEventListeners();
        setupFloatingBar();
        updateRapSummary();

        document.addEventListener('calculatorModeChanged', () => {
            updateRapSummary();
        });
    }

    function setupEventListeners() {
        // Date Input
        if (DOMElements.dateInput) {
            DOMElements.dateInput.addEventListener('change', (e) => {
                const dateValue = e.target.value;
                selection.eventDate = dateValue;

                if (dateValue) {
                    const month = new Date(dateValue).getMonth();
                    selection.isNewYearMode = (month === 11);
                } else {
                    selection.isNewYearMode = false;
                }
                updateRapSummary();
            });
        }

        // Location Select
        DOMElements.locationSelect.addEventListener('change', (e) => {
            selection.location = e.target.value;
            updateRapSummary();
        });

        // Show Time Slider
        DOMElements.showTimeSlider.addEventListener('input', (e) => {
            selection.showDuration = parseInt(e.target.value, 10);
            DOMElements.showTimeOutput.textContent = `${selection.showDuration} мин`;
            validateTime();
            updateRapSummary();
        });

        // Total Time Slider
        DOMElements.totalTimeSlider.addEventListener('input', (e) => {
            selection.totalDuration = parseInt(e.target.value, 10);
            updateTotalTimeOutput(selection.totalDuration);
            validateTime();
            updateRapSummary();
        });

        // Copy Quote Button
        DOMElements.copyQuoteBtn.addEventListener('click', () => {
            const quoteText = generateRapPlainTextQuote();
            copyToClipboard(quoteText);
        });
    }

    function updateTotalTimeOutput(minutes) {
        const hours = minutes / 60;
        // Format: "1.5 часа" or "2 часа" or "1 час"
        let label = '';
        if (Number.isInteger(hours)) {
            label = `${hours} час${hours === 1 ? '' : hours < 5 ? 'а' : 'ов'}`;
        } else {
            label = `${hours} часа`;
        }
        DOMElements.totalTimeOutput.textContent = label;
    }

    function validateTime() {
        // Rule: Total Time >= Show Time + 30 min (Tech time)
        const minTotalDuration = selection.showDuration + 30;

        if (selection.totalDuration < minTotalDuration) {
            // If total time is less than minimum required, bump it up
            selection.totalDuration = minTotalDuration;
            DOMElements.totalTimeSlider.value = selection.totalDuration;
            updateTotalTimeOutput(selection.totalDuration);
        }

        // Ensure the slider 'min' attribute allows for this logic? 
        // Logic check: Slider 2 min is 60. 
        // If Show=30, MinTotal=60. OK.
        // If Show=60, MinTotal=90. OK.
        // If Show=90, MinTotal=120. OK.
    }

    function calculatePrice() {
        const { PARAMS, LOCATION } = PRICES_RAP;

        if (selection.location === 'kz') {
            if (selection.isNewYearMode && LOCATION.kz.newYearPrice) {
                return { price: LOCATION.kz.newYearPrice, currency: '₸', travelInfo: 'Стоимость для выездного мероприятия фиксированная.' };
            }
            return { price: LOCATION.kz.fixedPrice, currency: '₸', travelInfo: 'Стоимость для выездного мероприятия фиксированная.' };
        }

        if (selection.location === 'intl') {
            if (selection.isNewYearMode && LOCATION.intl.newYearPrice) {
                return { price: LOCATION.intl.newYearPrice, currency: LOCATION.intl.currency, travelInfo: 'International fixed price.' };
            }
            return { price: LOCATION.intl.fixedPrice, currency: LOCATION.intl.currency, travelInfo: 'International fixed price.' };
        }

        // Almaty Calculation
        let totalPrice = PARAMS.BASE_PRICE; // Includes 30m show + 30m wait

        // Calculate Extra Show Cost
        if (selection.showDuration > PARAMS.INCLUDED_SHOW_MIN) {
            const extraShowMinutes = selection.showDuration - PARAMS.INCLUDED_SHOW_MIN;
            const extraShowBlocks = Math.ceil(extraShowMinutes / 30);
            totalPrice += extraShowBlocks * PARAMS.SHOW_BLOCK_PRICE;
        }

        // Calculate Waiting Cost
        // Clean Wait Time = Total - Show. 
        // Note: The Base Price includes 30 min of "Technical/Waiting" time implicitly?
        // Let's look at the spec: "Total Time cannot be less than Show + 30 min tech".
        // Spec: "First 30 minutes of clean waiting — 0 KZT (included)".
        // Wait Time = Total - Show.
        const pureWaitTime = selection.totalDuration - selection.showDuration;

        if (pureWaitTime > PARAMS.INCLUDED_WAIT_MIN) {
            const extraWaitMinutes = pureWaitTime - PARAMS.INCLUDED_WAIT_MIN;
            const extraWaitBlocks = Math.ceil(extraWaitMinutes / 30);
            totalPrice += extraWaitBlocks * PARAMS.WAIT_BLOCK_PRICE;
        }

        return { price: totalPrice, currency: '₸', travelInfo: selection.location === 'almaty_region' ? 'Транспортные расходы оплачиваются дополнительно.' : null };
    }

    function updateRapSummary() {
        const calcResult = calculatePrice();
        let { price, currency, travelInfo } = calcResult;

        // Render Summary List
        let summaryHtml = '';

        if (['kz', 'intl'].includes(selection.location)) {
            summaryHtml += createSummaryItem('Пакет выступления', 'Включено');
            summaryHtml += createSummaryItem('Локация', PRICES_RAP.LOCATION[selection.location].name);
        } else {
            // Show Time
            summaryHtml += createSummaryItem('Длительность шоу', `${selection.showDuration} мин`);

            // Total Time
            const h = selection.totalDuration / 60;
            const totalTimeLabel = Number.isInteger(h) ? `${h} ч.` : `${h} ч.`;
            summaryHtml += createSummaryItem('Время на площадке', totalTimeLabel);

            // Detailed breakdown (optional, but requested "correct text")
            const pureWait = selection.totalDuration - selection.showDuration;
            summaryHtml += createSummaryItem('Чистое ожидание', `${pureWait} мин`);
        }

        DOMElements.summaryList.innerHTML = summaryHtml;

        // Notifications
        DOMElements.notifications.innerHTML = '';
        if (travelInfo) {
            DOMElements.notifications.innerHTML += `<div class="notification-card"><i class="fas fa-info-circle"></i><p>${travelInfo}</p></div>`;
        }

        // Update Price
        DOMElements.totalPrice.textContent = `${price.toLocaleString('ru-RU')} ${currency}`;

        updateFloatingBarUI(price, 0, currency);
    }

    function createSummaryItem(label, value) {
        return `<div class="summary-item"><div class="summary-item-name text-gray-400">${label}</div><span class="summary-item-price text-white font-medium">${value}</span></div>`;
    }

    function generateRapPlainTextQuote() {
        let parts = ["Здравствуйте, Валерий!", "Сформировал(а) заявку на рэп-выступление на belskiy.kz:\n"];

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

        if (!['kz', 'intl'].includes(selection.location)) {
            parts.push(`- Длительность шоу: ${selection.showDuration} мин`);
            parts.push(`- Общее время на площадке: ${selection.totalDuration / 60} ч`);
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

        // Hide/Show based on scroll intersection with the main summary card
        const summaryCardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (rapCalculatorContent.classList.contains('active')) { bar.classList.toggle('hidden-by-scroll', entry.isIntersecting); } });
        }, { threshold: 0.1 });
        if (DOMElements.summaryCard) { summaryCardObserver.observe(DOMElements.summaryCard); }
    }

    function updateFloatingBarUI(total, itemsCount, currency = '₸') {
        const bar = document.getElementById('rap-floating-summary-bar');
        if (!bar) return;

        // Always visible if calculator is active
        const shouldBeVisible = rapCalculatorContent.classList.contains('active');
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
            // Count isn't really relevant now, maybe just hide or show '1 услуга'
            document.getElementById('rap-floating-count').textContent = '';

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