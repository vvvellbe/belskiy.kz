document.addEventListener('DOMContentLoaded', () => {
 // --- HOST CALCULATOR LOGIC (IIFE to isolate scope) ---
 (() => {
  const hostCalculator = document.getElementById('host-calculator-content');
  if (!hostCalculator) return;

  let selection = {};
  let DOMElements = {};

  function createOptionCard(group, value, title, subtitle = '', price = null, isSelected = false, { warning = null, isDisabled = false, disabledReason = null, showPlus = true } = {}) {
   const card = document.createElement('div');
   card.dataset.group = group;
   card.dataset.value = value;
   if (group === 'host') {
    card.className = `option-card rounded-lg p-4 ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
    let content = `<div><h4 class="font-semibold text-white">${title}</h4>${subtitle ? `<p class="text-sm text-gray-400 mt-1">${subtitle}</p>` : ''}</div>`;
    if (price !== null) {
     content += `<p class="font-semibold text-lg text-white mt-3">${price.toLocaleString('ru-RU')} ₸</p>`;
    }
    if (isDisabled && disabledReason) {
     content += `<p class="text-sm disabled-reason mt-2">🛑 ${disabledReason}</p>`;
    } else if (warning) {
     content += `<p class="text-sm warning-text mt-2">⚠️ ${warning}</p>`;
    }
    card.innerHTML = content;
   } else {
    card.className = `option-card rounded-lg p-4 flex items-start justify-between ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
    const pricePrefix = showPlus ? '+ ' : '';
    const priceHTML = price !== null ? `<div class="text-right ml-4 flex-shrink-0"><p class="font-semibold text-white">${pricePrefix}${price.toLocaleString('ru-RU')} ₸</p></div>` : '';
    const contentHTML = `<div><h4 class="font-semibold text-white">${title}</h4>${subtitle ? `<p class="text-sm text-gray-400 mt-1">${subtitle}</p>` : ''}${isDisabled && disabledReason ? `<p class="text-sm disabled-reason mt-2">🛑 ${disabledReason}</p>` : ''}${warning ? `<p class="text-sm warning-text mt-2">⚠️ ${warning}</p>` : ''}</div>`;
    card.innerHTML = contentHTML + priceHTML;
   }
   if (!isDisabled) card.addEventListener('click', () => handleOptionSelection(group, value));
   return card;
  }

  function createCheckboxCard(id, title, description, price, { isChecked = false, isDisabled = false, disabledReason = null, warning = null } = {}) {
   const card = document.createElement('div');
   card.className = `option-card rounded-lg p-4 flex items-center justify-between ${isChecked ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
   card.dataset.group = 'creative';
   card.dataset.value = id;
   card.innerHTML = `<div><h4 class="font-semibold text-white">${title}</h4><p class="text-sm text-gray-400">${description}</p>${disabledReason ? `<p class="text-sm disabled-reason mt-2">🛑 ${disabledReason}</p>` : ''}${warning ? `<p class="text-sm warning-text mt-2">⚠️ ${warning}</p>` : ''}</div><div class="text-right ml-4"><p class="font-semibold text-white">+ ${price.toLocaleString('ru-RU')} ₸</p></div>`;
   if (!isDisabled) card.addEventListener('click', () => handleOptionSelection('creative', id));
   return card;
  }

  function reRenderUI() {
   if (!DOMElements.hostOptions) return;
   readParameters();
   DOMElements.hostOptions.innerHTML = '';
   DOMElements.hostOptions.appendChild(createOptionCard('host', '2', 'до 2 часов', 'Экспресс-программа', PRICES.HOST['2'], selection.hostHours === '2'));
   DOMElements.hostOptions.appendChild(createOptionCard('host', '4', 'до 4 часов', 'Динамичное событие', PRICES.HOST['4'], selection.hostHours === '4'));
   DOMElements.hostOptions.appendChild(createOptionCard('host', '6', 'до 6 часов', 'Полноценное мероприятие', PRICES.HOST['6'], selection.hostHours === '6'));
   renderTechSection();
   renderCreativeOptions();
   updateSummaryAndPrice();
  }

  function renderTechSection() {
   const techSection = DOMElements.techSection;
   if (!techSection) return;
   const venueHasFullDJSet = selection.venueGear === 'full_dj_set';
   const venueHasSoundOnly = selection.venueGear === 'sound_only';
   if (venueHasFullDJSet) {
    techSection.innerHTML = `<h3 class="text-xl font-semibold text-white">2. Техническое Оснащение</h3><p class="text-sm text-gray-400 mb-4">Оборудование для вашего мероприятия:</p><div class="option-card selected rounded-lg p-4"><h4 class="font-semibold text-green-400">✅ Площадка полностью укомплектована</h4><p class="text-sm text-gray-400">Используется оборудование и DJ вашего заведения.</p></div><div id="projector-option-container" class="mt-4"></div>`;
    renderProjectorOption(techSection.querySelector('#projector-option-container'));
   } else if (venueHasSoundOnly) {
    techSection.innerHTML = `<h3 class="text-xl font-semibold text-white">2. Техническое Оснащение</h3><p class="text-sm text-gray-400 mb-4">Выберите решение для вашей площадки:</p><div id="tech-options-container" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div><div id="projector-option-container" class="mt-4"></div>`;
    const container = techSection.querySelector('#tech-options-container');
    const djWorkOpts = { warning: selection.projectorNeeded ? 'Автоматически выбран с проектором' : null };
    container.appendChild(createOptionCard('tech', 'DJ_WORK_ONLY', PRICES.TECH.DJ_WORK_ONLY.name, 'Наш DJ будет работать на вашем звуке', PRICES.TECH.DJ_WORK_ONLY.price, selection.techOption === 'DJ_WORK_ONLY', djWorkOpts));
    const compactOpts = { isDisabled: selection.projectorNeeded, disabledReason: selection.projectorNeeded ? 'Требует работы DJ' : null };
    if (selection.guestCount === '81-150') {
     compactOpts.isDisabled = true;
     compactOpts.disabledReason = 'Не подходит для 80+ гостей';
    } else if (selection.venueType === 'large' || selection.guestCount === '41-80') {
     if (!compactOpts.isDisabled) compactOpts.warning = 'Мощности может не хватить';
    }
    container.appendChild(createOptionCard('tech', 'COMPACT', PRICES.TECH.COMPACT.name, 'Аудиосистема JBL (без DJ), вместо оборудования заведения.', PRICES.TECH.COMPACT.price, selection.techOption === 'COMPACT', compactOpts));
    renderProjectorOption(techSection.querySelector('#projector-option-container'));
   } else {
    techSection.innerHTML = `<h3 class="text-xl font-semibold text-white">2. Техническое Оснащение</h3><p class="text-sm text-gray-400 mb-4">Подберем звук под вашу площадку и гостей:</p><div id="tech-options" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div><div id="projector-option-container" class="mt-4"></div>`;
    const techOptionsContainer = techSection.querySelector('#tech-options');
    const compactOpts = { isDisabled: selection.projectorNeeded, disabledReason: selection.projectorNeeded ? 'Требует работы DJ' : null };
    if (selection.guestCount === '81-150') {
     compactOpts.isDisabled = true;
     compactOpts.disabledReason = 'Не подходит для 80+ гостей';
    } else if (selection.venueType === 'large' || selection.guestCount === '41-80' || selection.venueType === 'standard') {
     if (!compactOpts.isDisabled) compactOpts.warning = 'Мощности может не хватить';
    }
    const standardOpts = {};
    if (selection.venueType === 'large' || selection.guestCount === '81-150') {
     standardOpts.warning = 'Мощности может не хватить';
    }
    const maxiOpts = {};
    if (selection.venueType === 'chamber' && selection.guestCount === '1-40' && !maxiOpts.isDisabled) {
     maxiOpts.isDisabled = true;
     maxiOpts.disabledReason = 'Избыточен для данной площадки';
    }
    techOptionsContainer.appendChild(createOptionCard('tech', 'COMPACT', PRICES.TECH.COMPACT.name, PRICES.TECH.COMPACT.desc, PRICES.TECH.COMPACT.price, selection.techOption === 'COMPACT', compactOpts));
    techOptionsContainer.appendChild(createOptionCard('tech', 'STANDARD', PRICES.TECH.STANDARD.name, PRICES.TECH.STANDARD.desc, PRICES.TECH.STANDARD.price, selection.techOption === 'STANDARD', standardOpts));
    techOptionsContainer.appendChild(createOptionCard('tech', 'MAXI', PRICES.TECH.MAXI.name, PRICES.TECH.MAXI.desc, PRICES.TECH.MAXI.price, selection.techOption === 'MAXI', maxiOpts));
    renderProjectorOption(techSection.querySelector('#projector-option-container'));
   }
  }

  function renderProjectorOption(container) {
   if (!container) return;
   if (selection.venueScreen === 'no') {
    const projectorOpts = {};
    if (selection.guestCount === '81-150') {
     projectorOpts.isDisabled = true;
     projectorOpts.disabledReason = 'Неэффективен для >80 гостей';
    }
    projectorOpts.warning = 'Требует работы DJ (при выборе, DJ добавляется автоматически)';
    const projectorCard = createCheckboxCard('PROJECTOR', PRICES.PROJECTOR.name, 'Используется в темное время/помещении.', PRICES.PROJECTOR.price, { ...projectorOpts, isChecked: selection.projectorNeeded });
    container.innerHTML = '';
    container.appendChild(projectorCard);
   } else {
    container.innerHTML = '';
   }
  }

  function renderCreativeOptions() {
   if (!DOMElements.creativeOptions) return;
   DOMElements.creativeOptions.innerHTML = '';
   const aiGames = selection.creative.ai_games || {};
   const selectedAiGamesCount = Object.values(aiGames).filter(Boolean).length;
   let aiGamesTotalPrice = Object.keys(aiGames).reduce((sum, key) => aiGames[key] ? sum + PRICES.CREATIVE.AI_GAMES[key].price : sum, 0);
   const aiSubtitle = selectedAiGamesCount > 0 ? `Выбрано: ${selectedAiGamesCount} игр(ы)` : 'Персонализация вечера нового уровня';
   const aiPriceText = aiGamesTotalPrice > 0 ? `+ ${aiGamesTotalPrice.toLocaleString('ru-RU')} ₸` : 'от 5 000 ₸';
   const eminemTracks = selection.creative.eminem_tracks || {};
   const selectedTracksCount = Object.keys(eminemTracks).length;
   const eminemSubtitle = selectedTracksCount > 0 ? `Выбрано: ${selectedTracksCount} из 5 треков` : 'Соберите свой сет-лист (до 5 треков)';
   const eminemPriceText = `+ ${PRICES.CREATIVE.EMINEM.basePrice.toLocaleString('ru-RU')} ₸`;
   const aiResetButtonHTML = selectedAiGamesCount > 0 ? `<button class="btn-reset py-2 px-3 text-sm rounded-lg" data-reset-target="ai">Сбросить</button>` : '';
   const aiCardHTML = `<div class="option-card rounded-lg p-4 ${selectedAiGamesCount > 0 ? 'selected' : ''}" data-modal-trigger="ai-games-modal"><div class="flex items-center justify-between"><div><h4 class="font-semibold text-white">Интерактивное AI-Шоу</h4><p class="text-sm text-gray-400">${aiSubtitle}</p></div><div class="text-right ml-2 flex items-center gap-2 md:gap-3 flex-shrink-0"><p class="font-semibold text-white whitespace-nowrap">${aiPriceText}</p>${aiResetButtonHTML}<button class="btn-primary text-white font-bold py-2 px-3 text-sm rounded-lg">Настроить</button></div></div></div>`;
   const eminemResetButtonHTML = selectedTracksCount > 0 ? `<button class="btn-reset py-2 px-3 text-sm rounded-lg" data-reset-target="eminem">Сбросить</button>` : '';
   const eminemCardHTML = `<div class="option-card rounded-lg p-4 ${selectedTracksCount > 0 ? 'selected' : ''}" data-modal-trigger="eminem-modal"><div class="flex items-center justify-between"><div><h4 class="font-semibold text-white">Eminem Tribute Show</h4><p class="text-sm text-gray-400">${eminemSubtitle}</p></div><div class="text-right ml-2 flex items-center gap-2 md:gap-3 flex-shrink-0"><p class="font-semibold text-white whitespace-nowrap">${eminemPriceText}</p>${eminemResetButtonHTML}<button class="btn-primary text-white font-bold py-2 px-3 text-sm rounded-lg">Настроить</button></div></div></div>`;
   DOMElements.creativeOptions.innerHTML = aiCardHTML + eminemCardHTML;
  }

  function renderAIGamesModal() {
   const modalContent = DOMElements.aiGamesModal.querySelector('.modal-content');
   const scrollContainer = modalContent.querySelector('.modal-body');
   const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
   const screenAvailable = selection.venueScreen === 'yes' || selection.projectorNeeded;
   const canAddProjector = selection.venueScreen === 'no' && !selection.projectorNeeded && selection.guestCount !== '81-150';
   let gamesHTML = '';
   for (const [key, game] of Object.entries(PRICES.CREATIVE.AI_GAMES)) {
    const isSelected = selection.creative.ai_games[key];
    let isDisabled = game.requiresScreen && !screenAvailable;
    let disabledReason = isDisabled ? 'Для этой игры нужен экран или проектор' : null;
    gamesHTML += `<div class="creative-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-game-key="${key}"><div class="card-header"><h4 class="card-title">${game.name}</h4><p class="card-price">+${game.price.toLocaleString('ru-RU')} ₸</p></div><p class="card-desc">${game.desc}</p>${isDisabled ? `<div class="card-footer"><p class="disabled-reason">🛑 ${disabledReason}</p></div>` : ''}</div>`;
   }
   const addProjectorButtonHTML = canAddProjector ? `<button id="add-projector-from-modal" class="btn-add-projector"><i class="fas fa-video mr-2"></i>Добавить Проектор (+${PRICES.PROJECTOR.price.toLocaleString('ru-RU')} ₸)</button>` : '';
   const projectorWarningHTML = !screenAvailable ? `<div class="text-center mb-4"><p class="text-amber-400 font-medium text-sm">⚠️ Некоторым играм требуется экран.</p>${canAddProjector ? '<p class="text-xs text-gray-400 mt-1">Для управления проектором будет автоматически добавлен DJ.</p>' : ''}${!canAddProjector && selection.venueScreen === 'no' ? `<p class="text-red-400 text-xs mt-1">Проектор не может быть добавлен для ${selection.guestCount === '81-150' ? '>80 гостей' : 'данных условий'}.</p>` : ''}</div>` : '';
   modalContent.innerHTML = `<div class="modal-header"><div class="modal-title-group"><div><h3 class="modal-title">AI-ШОУ</h3><p class="modal-subtitle">Выберите уникальные интерактивы для ваших гостей</p></div></div><button class="modal-close-btn text-2xl leading-none">&times;</button></div><div class="modal-body"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${gamesHTML}</div></div><div class="modal-footer flex-col">${projectorWarningHTML}<div class="footer-actions">${addProjectorButtonHTML}<button id="reset-ai-selection" class="btn-reset py-3 px-6 rounded-lg">Сбросить</button><button class="btn-primary font-bold py-3 px-8 rounded-lg modal-close-btn">Готово</button></div></div>`;
   if (scrollContainer) {
    modalContent.querySelector('.modal-body').scrollTop = scrollTop;
   }
  }

  function renderEminemModal() {
   const modalContent = DOMElements.eminemModal.querySelector('.modal-content');
   const selectedTracks = selection.creative.eminem_tracks || {};
   const selectedCount = Object.keys(selectedTracks).length;
   const limitReached = selectedCount >= 5;
   let tracksHTML = '';
   TRACK_LIST.forEach(track => {
    const isSelected = selectedTracks[track.id];
    const isDisabled = limitReached && !isSelected;
    tracksHTML += `
        <div class="creative-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-track-id="${track.id}">
         <div class="track-card-header">
          <h4 class="card-title">${track.name}</h4>
          <a href="${track.url}" target="_blank" class="btn-youtube" onclick="event.stopPropagation()">
           <i class="fab fa-youtube mr-2"></i>Пример
          </a>
         </div>
         <div class="track-meta">
          <span><i class="fas fa-microphone-alt"></i> ${track.structure}</span>
          <span><i class="fas fa-clock"></i> ${track.duration}</span>
         </div>
        </div>`;
   });
   modalContent.innerHTML = `<div class="modal-header"><div class="modal-title-group"><div><h3 class="modal-title">Eminem Tribute Show</h3><p class="modal-subtitle">Соберите свой идеальный сет-лист для зажигательного выступления</p></div></div><button class="modal-close-btn text-2xl leading-none">&times;</button></div><div class="modal-body"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tracksHTML}</div></div><div class="modal-footer">
    <div class="footer-info">
        <p>Выбрано <span class="count">${selectedCount}/5</span> треков</p>
        ${limitReached ? '<p class="limit-reached text-amber-400 font-semibold mt-1">Достигнут максимум</p>' : ''}
    </div>
    <div class="footer-buttons"><button id="reset-eminem-selection" class="btn-reset py-3 px-6 rounded-lg">Сбросить</button><button class="btn-primary font-bold py-3 px-8 rounded-lg modal-close-btn">Готово</button></div></div>`;
  }

  function updateSummaryAndPrice() {
   let total = 0;
   let baseItems = [], techItems = [], creativeItems = [], itemsCount = 0;
   const hostPrice = PRICES.HOST[selection.hostHours];
   if(hostPrice){
    total += hostPrice;
    baseItems.push({ name: `Ведущий (до ${selection.hostHours} ч)`, price: hostPrice });
    itemsCount++;
   }
   if (selection.venueGear === 'full_dj_set') {
    techItems.push({ name: '✅ Пакет не требуется', price: null });
   } else if (selection.venueGear === 'sound_only') {
    if (selection.techOption === 'DJ_WORK_ONLY' || selection.techOption === 'COMPACT') {
     const tech = PRICES.TECH[selection.techOption];
     total += tech.price;
     techItems.push({ name: tech.name, price: tech.price });
     itemsCount++;
    }
   } else if (selection.techOption) {
    const tech = PRICES.TECH[selection.techOption];
    total += tech.price;
    techItems.push({ name: tech.name, price: tech.price });
    itemsCount++;
   }
   if (selection.projectorNeeded) {
    total += PRICES.PROJECTOR.price;
    techItems.push({ name: PRICES.PROJECTOR.name, price: PRICES.PROJECTOR.price });
    itemsCount++;
   }
   const aiGames = selection.creative.ai_games || {};
   Object.keys(aiGames).forEach(key => {
    if (aiGames[key]) {
     const game = PRICES.CREATIVE.AI_GAMES[key];
     total += game.price;
     creativeItems.push({ name: game.name, price: game.price });
     itemsCount++;
    }
   });
   const selectedTracks = Object.keys(selection.creative.eminem_tracks || {});
   if (selectedTracks.length > 0) {
    const eminem = PRICES.CREATIVE.EMINEM;
    total += eminem.basePrice;
    const trackNames = selectedTracks.map(id => TRACK_LIST.find(t => t.id === id)?.name).filter(Boolean);
    creativeItems.push({ name: `${eminem.name} (${selectedTracks.length} тр.)`, price: eminem.basePrice, tracks: trackNames });
    itemsCount++;
   }
   const buildCategoryHtml = (title, icon, items) => {
    if (!items.length) return '';
    let itemsHtml = items.map(item => {
     let trackListHtml = item.tracks ? `<ul class="summary-track-list">${item.tracks.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
     const priceHtml = item.price !== null ? `<span class="summary-item-price">${item.price.toLocaleString('ru-RU')} ₸</span>` : '';
     const nameClass = item.price === null ? 'is-free' : '';
     return `<div class="summary-item"><div class="summary-item-name ${nameClass}">${item.name}</div>${priceHtml}</div>${trackListHtml}`;
    }).join('');
    return `<div class="summary-category"><div class="summary-category-header"><i class="fas ${icon}"></i><span>${title}</span></div><div class="summary-items-container">${itemsHtml}</div></div>`;
   };
   let htmlParts = [
    buildCategoryHtml('Основа', 'fa-microphone-alt', baseItems),
    buildCategoryHtml('Тех. Оснащение', 'fa-volume-up', techItems),
    buildCategoryHtml('Креативные фишки', 'fa-star', creativeItems)
   ];
   DOMElements.summaryListEl.innerHTML = htmlParts.filter(Boolean).join('<hr class="summary-separator">');
   DOMElements.totalPriceEl.textContent = `${Math.round(total).toLocaleString('ru-RU')} ₸`;
   selection.totalPrice = Math.round(total);
   updateSelectedStyles();
   updateFloatingBarUI(total, itemsCount);
  }

  function updateSelectedStyles() {
   document.querySelectorAll('#host-calculator-content [data-group]').forEach(el => {
    const { group, value } = el.dataset;
    let isSelected = false;
    if (group === 'host') isSelected = selection.hostHours === value;
    else if (group === 'tech') isSelected = selection.techOption === value;
    else if (group === 'creative') isSelected = (value === 'PROJECTOR' && selection.projectorNeeded);
    el.classList.toggle('selected', isSelected);
   });
  }

  function enforceDjForProjector() {
   if (selection.venueGear === 'sound_only') {
    selection.techOption = 'DJ_WORK_ONLY';
   } else if (selection.venueGear === 'none' && (selection.techOption === 'COMPACT' || !selection.techOption)) {
    selection.techOption = 'STANDARD';
   }
  }

  function handleOptionSelection(group, value) {
   if (group === 'host') {
    selection.hostHours = value;
   } else if (group === 'tech') {
    selection.techOption = selection.techOption === value ? null : value;
    if (selection.techOption === null && selection.projectorNeeded) {
     selection.projectorNeeded = false;
    }
   } else if (group === 'creative' && value === 'PROJECTOR') {
    selection.projectorNeeded = !selection.projectorNeeded;
    if (selection.projectorNeeded) {
     enforceDjForProjector();
    } else {
     // <<< НАЧАЛО ИЗМЕНЕНИЯ >>>
     // Если проектор отключается, снимаем выбор с игр, требующих экран
     for (const gameKey in selection.creative.ai_games) {
      if (selection.creative.ai_games[gameKey] === true) {
       const gameData = PRICES.CREATIVE.AI_GAMES[gameKey];
       if (gameData && gameData.requiresScreen) {
        selection.creative.ai_games[gameKey] = false;
       }
      }
     }
     // <<< КОНЕЦ ИЗМЕНЕНИЯ >>>
    }
   }
   reRenderUI();
  }

  function readParameters() {
   const oldSelection = { ...selection };
   selection.venueType = DOMElements.parameterSelects[0].value;
   selection.guestCount = DOMElements.parameterSelects[1].value;
   selection.venueGear = DOMElements.parameterSelects[2].value;
   selection.venueScreen = DOMElements.parameterSelects[3].value;
   const mainParamsChanged = oldSelection.guestCount !== selection.guestCount || oldSelection.venueType !== selection.venueType || oldSelection.venueGear !== selection.venueGear;
   if (mainParamsChanged) {
    selection.projectorNeeded = false;
    if (selection.venueGear === 'none') {
     const venue = selection.venueType;
     const guests = selection.guestCount;
     if (venue === 'large' || guests === '81-150') {
      selection.techOption = 'MAXI';
     } else if (venue === 'standard' || guests === '41-80') {
      selection.techOption = 'STANDARD';
     } else {
      selection.techOption = 'COMPACT';
     }
    } else if (selection.venueGear === 'sound_only') {
     selection.techOption = 'DJ_WORK_ONLY';
    } else {
     selection.techOption = null;
    }
   }
  }
 
  function generatePlainTextQuote() {
   let messageParts = ["Здравствуйте, Валерий!", "Сформировал(а) смету на belskiy.kz:\n", `*УСЛУГА: Ведущий мероприятий*`, `\n*ПАРАМЕТРЫ МЕРОПРИЯТИЯ:*`];
   const paramText = {
    venueType: { 'chamber': 'Камерная', 'standard': 'Стандартная', 'large': 'Открытая/Большая' },
    venueGear: { 'none': 'Ничего нет', 'sound_only': 'Только звук', 'full_dj_set': 'Есть всё' },
    venueScreen: { 'no': 'Нет', 'yes': 'Да' }
   };
   messageParts.push(`- Тип площадки: ${paramText.venueType[selection.venueType]}`);
   messageParts.push(`- Количество гостей: ${selection.guestCount}`);
   messageParts.push(`- Оборудование: ${paramText.venueGear[selection.venueGear]}`);
   messageParts.push(`- Экран: ${paramText.venueScreen[selection.venueScreen]}`);
   let baseServices = [], techServices = [], creativeServices = [];
   if(PRICES.HOST[selection.hostHours]) {
    baseServices.push(`- Ведущий (до ${selection.hostHours} ч): ${PRICES.HOST[selection.hostHours].toLocaleString('ru-RU')} ₸`);
   }
   if (selection.venueGear !== 'full_dj_set' && selection.techOption && PRICES.TECH[selection.techOption]) {
    techServices.push(`- ${PRICES.TECH[selection.techOption].name}: ${PRICES.TECH[selection.techOption].price.toLocaleString('ru-RU')} ₸`);
   }
   if (selection.projectorNeeded) {
    techServices.push(`- ${PRICES.PROJECTOR.name}: ${PRICES.PROJECTOR.price.toLocaleString('ru-RU')} ₸`);
   }
   const selectedAiGames = Object.keys(selection.creative.ai_games || {}).filter(key => selection.creative.ai_games[key]);
   selectedAiGames.forEach(key => creativeServices.push(`- ${PRICES.CREATIVE.AI_GAMES[key].name}: ${PRICES.CREATIVE.AI_GAMES[key].price.toLocaleString('ru-RU')} ₸`));
   if (baseServices.length) messageParts.push('\n*ОСНОВА:*', ...baseServices);
   if (techServices.length) messageParts.push('\n*ТЕХНИЧЕСКОЕ ОСНАЩЕНИЕ:*', ...techServices);
   if (creativeServices.length) messageParts.push('\n*КРЕАТИВНЫЕ ФИШКИ:*', ...creativeServices);
   const selectedTracks = Object.keys(selection.creative.eminem_tracks || {});
   if (selectedTracks.length > 0) {
    messageParts.push('\n*СЕТ-ЛИСТ EMINEM TRIBUTE SHOW:*');
    selectedTracks.forEach(id => messageParts.push(`- ${TRACK_LIST.find(t => t.id === id)?.name || ''}`));
    messageParts.push(`- Стоимость блока: ${PRICES.CREATIVE.EMINEM.basePrice.toLocaleString('ru-RU')} ₸`);
   }
   messageParts.push(`\n*ИТОГОВАЯ СТОИМОСТЬ: ${selection.totalPrice.toLocaleString('ru-RU')} ₸*`);
   return messageParts.join('\n');
  }

  function initializeApp() {
   DOMElements = {
    totalPriceEl: hostCalculator.querySelector('#total-price'),
    summaryListEl: hostCalculator.querySelector('#summary-list'),
    aiGamesModal: document.getElementById('ai-games-modal'),
    eminemModal: document.getElementById('eminem-modal'),
    hostOptions: hostCalculator.querySelector('#host-options'),
    techSection: hostCalculator.querySelector('#tech-section'),
    creativeOptions: hostCalculator.querySelector('#creative-options'),
    parameterSelects: hostCalculator.querySelectorAll('select'),
    copyQuoteBtn: hostCalculator.querySelector('#copy-quote-btn'),
    toastNotification: document.getElementById('toast-notification'),
    summaryCard: hostCalculator.querySelector('[data-summary-id="host"]'),
   };
   selection = {
    hostHours: '6', projectorNeeded: false,
    creative: { ai_games: {}, eminem_tracks: {} },
    totalPrice: 0, venueType: 'standard', guestCount: '1-40',
    venueGear: 'none', venueScreen: 'no'
   };
  
   reRenderUI();
   setupFloatingBar();

   document.addEventListener('calculatorModeChanged', () => {
    updateSummaryAndPrice();
   });

   DOMElements.parameterSelects.forEach(sel => sel.addEventListener('change', reRenderUI));
   DOMElements.copyQuoteBtn.addEventListener('click', () => copyToClipboard(generatePlainTextQuote()));
  
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
  
   document.body.addEventListener('click', (e) => {
    const modalTrigger = e.target.closest('[data-modal-trigger]');
    if (!modalTrigger || e.target.closest('[data-reset-target]')) return;
    const parentCalculator = modalTrigger.closest('#host-calculator-content');
    if (!parentCalculator) return;
    if (modalTrigger.closest('#ai-games-modal') || modalTrigger.closest('#eminem-modal')) return;
    const modalId = modalTrigger.dataset.modalTrigger;
    if (modalId === 'ai-games-modal' || modalId === 'eminem-modal') {
     const modal = document.getElementById(modalId);
     if (modal) {
      if (modalId === 'ai-games-modal') renderAIGamesModal();
      if (modalId === 'eminem-modal') renderEminemModal();
     }
    }
   });
  
   DOMElements.aiGamesModal.addEventListener('click', (e) => {
    const gameCard = e.target.closest('[data-game-key]');
    if (gameCard && !gameCard.classList.contains('disabled')) {
     const key = gameCard.dataset.gameKey;
     selection.creative.ai_games[key] = !selection.creative.ai_games[key];
     renderAIGamesModal();
     reRenderUI();
    }
    if (e.target.id === 'reset-ai-selection') {
     selection.creative.ai_games = {};
     renderAIGamesModal();
     reRenderUI();
    }
    if (e.target.id === 'add-projector-from-modal') {
     selection.projectorNeeded = true;
     enforceDjForProjector();
     renderAIGamesModal();
     reRenderUI();
    }
   });
  
   DOMElements.eminemModal.addEventListener('click', (e) => {
    const scrollContainer = DOMElements.eminemModal.querySelector('.modal-body');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
  
    const trackCard = e.target.closest('[data-track-id]');
    const resetButton = e.target.id === 'reset-eminem-selection';
  
    if (trackCard && !trackCard.classList.contains('disabled')) {
     const id = trackCard.dataset.trackId;
     if (selection.creative.eminem_tracks[id]) {
      delete selection.creative.eminem_tracks[id];
     } else {
      if (Object.keys(selection.creative.eminem_tracks || {}).length < 5) {
       selection.creative.eminem_tracks[id] = true;
      }
     }
     renderEminemModal();
     reRenderUI();
    
     const newScrollContainer = DOMElements.eminemModal.querySelector('.modal-body');
     if (newScrollContainer) newScrollContainer.scrollTop = scrollTop;
    }
  
    if (resetButton) {
     selection.creative.eminem_tracks = {};
     renderEminemModal();
     reRenderUI();
    
     const newScrollContainer = DOMElements.eminemModal.querySelector('.modal-body');
     if (newScrollContainer) newScrollContainer.scrollTop = scrollTop;
    }
   });
  }

 function setupFloatingBar() {
  const bar = document.getElementById('host-floating-summary-bar');
  const modal = document.getElementById('host-summary-modal');
  const openBtn = document.getElementById('host-floating-open-modal');
  const modalCopyBtn = document.getElementById('host-modal-copy-btn');
 
  if (!bar || !modal || !openBtn || !modalCopyBtn) return;
 
  const openModal = () => {
   modal.classList.add('open');
   document.body.classList.add('modal-open');
  };
  const closeModal = () => {
   modal.classList.remove('open');
   document.body.classList.remove('modal-open');
  };

  openBtn.addEventListener('click', openModal);
  modal.addEventListener('click', (e) => {
   if (e.target.closest('.modal-close-btn')) closeModal();
   if (e.target === modal) closeModal();
  });
  
  modalCopyBtn.addEventListener('click', () => {
   copyToClipboard(generatePlainTextQuote());
  });

  const summaryCardObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
    if (hostCalculator.classList.contains('active')) {
     if (entry.isIntersecting) {
      bar.classList.add('hidden-by-scroll');
     } else {
      bar.classList.remove('hidden-by-scroll');
     }
    }
   });
  }, { threshold: 0.1 });
 
  if (DOMElements.summaryCard) {
   summaryCardObserver.observe(DOMElements.summaryCard);
  }
 }

  function updateFloatingBarUI(total, itemsCount) {
   const bar = document.getElementById('host-floating-summary-bar');
   const modal = document.getElementById('host-summary-modal');
   if (!bar || !modal) return;
 
   const shouldBeVisible = total > 0 && hostCalculator.classList.contains('active');
  
   if (window.innerWidth < 768) {
    const rapBar = document.getElementById('rap-floating-summary-bar');
    if (shouldBeVisible) {
     document.body.style.paddingBottom = bar.offsetHeight + 20 + 'px';
    } else if (!rapBar || !rapBar.classList.contains('visible')) {
     document.body.style.paddingBottom = '0px';
    }
   }

   if (shouldBeVisible) {
    bar.classList.add('visible');
    document.getElementById('host-floating-total').textContent = `Итого: ${total.toLocaleString('ru-RU')} ₸`;
    document.getElementById('host-floating-count').textContent = itemsCount;
    document.getElementById('host-modal-summary-content').innerHTML = DOMElements.summaryListEl.innerHTML;
    document.getElementById('host-modal-total-price').textContent = `${total.toLocaleString('ru-RU')} ₸`;
   } else {
    bar.classList.remove('visible');
   }
  }

  function copyToClipboard(text) {
   const textArea = document.createElement("textarea");
   textArea.value = text;
   textArea.style.position = "fixed"; textArea.style.left = "-9999px";
   document.body.appendChild(textArea);
   textArea.focus(); textArea.select();
   try {
    document.execCommand('copy');
    showToast();
   } catch (err) {
    console.error('Не удалось скопировать', err);
   } finally {
    document.body.removeChild(textArea);
   }
  }

  function showToast() {
   const toast = document.getElementById('toast-notification');
   if (toast) {
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
   }
  }

  initializeApp();
 })();
});
