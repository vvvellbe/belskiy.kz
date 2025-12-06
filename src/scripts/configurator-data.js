// src/scripts/configurator-data.js

export const PRICES = {
    // --- НОВАЯ СТРУКТУРА ДЛЯ ВЕДУЩЕГО ---
    // Мы убрали статические массивы цен (HOST и NEW_YEAR.HOST).
    // Теперь здесь параметры для формулы.
    HOST_PARAMS: {
        BASE_PRICE: 150000,    // Фикс за выезд
        HOURLY_RATE: 35000,    // Цена за 1 час
        NY_MULTIPLIER: 1.3     // Коэффициент на декабрь
    },

    HOST_LOCATION: {
        'kz': { price: 395000, name: 'Выезд по РК' },
        'intl': { price: 750, name: 'Международный выезд', currency: '$' }
    },

    // Для Нового года параметры локации
    NEW_YEAR_LOCATION: {
        'kz': { price: 520000, name: 'Выезд по РК (NY)' },
        'intl': { price: 1000, name: 'Международный выезд (NY)', currency: '$' }
    },

    TECH: {
        COMPACT: { price: 20000, name: 'Комплект «Компакт»', desc: 'Аудиосистема JBL (без DJ)' },
        STANDARD: { price: 150000, name: 'Комплект «Стандарт»', desc: 'Профессиональный DJ + Звук' },
        MAXI: { price: 200000, name: 'Комплект «Максимум»', desc: 'DJ + Расширенный комплект звука' },
        DJ_WORK_ONLY: { price: 100000, name: 'Работа DJ (на вашем звуке)' }
    },

    // Выездной DJ по Казахстану (Тенге)
    DJ_OUT: { price: 250000, name: 'Выездной DJ (KZ)', desc: 'Работа DJ на оборудовании заказчика' },

    // Выездной DJ Заграница (Доллары)
    DJ_INTL: { price: 500, name: 'Выездной DJ (Intl)', desc: 'Работа DJ (International)', currency: '$' },

    NEW_YEAR: {
        // Здесь мы оставили только наценки на технику и DJ, так как ведущий теперь считается по формуле
        TECH: {
            STANDARD: { price: 250000 },
            MAXI: { price: 300000 },
            DJ_WORK_ONLY: { price: 200000 }
        },
        DJ_OUT: { price: 350000 },
        DJ_INTL: { price: 700 }
    },

    CREATIVE: {
        AI_GAMES: {
            RZHAKAPELLA: { name: 'Ржакапелла', price: 15000, desc: 'Нейросеть превращает забавные факты о гостях в смешную песню. Задача зала — угадать её непредсказуемую концовку. Возможен видеоряд.', requiresScreen: false },
            CHTO_BYLO_DALSHE: { name: 'Что было дальше?', price: 10000, desc: 'Нейросеть превращает фото гостей в невероятные видео с самым непредсказуемым сюжетом. Задача гостей — угадать, что же было дальше.', requiresScreen: true },
            II_POSLOVITSY: { name: 'ИИ-пословицы', price: 5000, desc: 'Мультяшный 3D-аватар виновника(-ов) торжества, пытается буквально изобразить известную пословицу или крылатую фразу. Гости отгадывают.', requiresScreen: true },
            AI_SELFIE: { name: 'ИИ-селфи', price: 5000, desc: 'Нейросеть поёт о предмете или человеке в зале, а задача гостей — первыми найти его и сделать с ним селфи.', requiresScreen: false },
            NEURO_FILTERS: { name: 'Нейро-фильтры', price: 5000, desc: 'Фотографии гостей обрабатываются нейросетью и помещаются в различные известные мультфильмы, фильмы. Нужно угадать, куда нейросеть поместила гостя.', requiresScreen: true },
            AI_INTRO: { name: 'ИИ-заставка', price: 5000, desc: ' Нейросеть создаст и "оживит" уникальную заставку на экране, идеально отражающую стиль вашего события.', requiresScreen: true },
            AI_STAR_GREETING: { name: 'Поздравление от ИИ-звёзд', price: 10000, desc: 'На ваш праздник заглянут звёзды! Получите порцию юмора в эксклюзивных видео-поздравлениях от ИИ-копий известных личностей. Возможен видеоряд.', requiresScreen: false }
        },
        EMINEM: { name: 'Eminem Tribute Show', basePrice: 20000 }
    },

    EXCLUSIVE: {
        AI_SHOW: { price: 50000, name: 'Персональное AI-шоу' }
    },

    PROJECTOR: { price: 30000, name: 'Аренда проектора и экрана' },

    PHOTOGRAPHER: {
        baseHourRate: 35000,
        additionalRetouchPrice: 2000
    }
};

export const PRICES_RAP = {
    TIERS: {
        'START': { name: 'Пакет "Старт"', price: 40000, tracks: 5, desc: 'Идеально для короткого, яркого выступления (1-5 треков).' },
        'DRIVE': { name: 'Пакет "Драйв"', price: 100000, tracks: 14, desc: 'Оптимальный набор для полноценного шоу (6-14 треков).' },
        'PREMIUM': { name: 'Пакет "Премиум"', price: 160000, tracks: 38, desc: 'Максимальный заряд энергии на весь вечер (15-38 треков).' }
    },
    NEW_YEAR: {
        'START': { name: 'Пакет "Старт" (New Year)', price: 80000, tracks: 5, desc: 'Новогодний тариф: Яркое начало праздника.' },
        'DRIVE': { name: 'Пакет "Драйв" (New Year)', price: 150000, tracks: 14, desc: 'Новогодний тариф: Оптимальное шоу.' },
        'PREMIUM': { name: 'Пакет "Премиум" (New Year)', price: 200000, tracks: 38, desc: 'Новогодний тариф: Максимальный разнос.' }
    },
    LOCATION: {
        'kz': { name: 'Выступление по РК', fixedPrice: 160000, newYearPrice: 200000 },
        'intl': { name: 'Международное выступление', fixedPrice: 350, newYearPrice: 700, currency: '$' }
    }
};

export const TRACK_LIST = [
    { id: 'mockingbird', name: 'Mockingbird', structure: 'от 1 куплета и 1 припева до 2 куплетов и 2 припевов', duration: 'от 2:15 до 4:10', minDurationSeconds: 135, maxDurationSeconds: 250, url: 'https://www.youtube.com/watch?v=2WZBG1n3dTo' },
    { id: 'without-me', name: 'Without Me', structure: 'от 1 куплета и 1 припева до 2 куплетов и 2 припевов', duration: 'от 2:05 до 3:05', minDurationSeconds: 125, maxDurationSeconds: 185, url: 'https://www.youtube.com/watch?v=jD5TE5C32oI' },
    { id: 'lose-yourself', name: 'Lose Yourself', structure: 'от 1 куплета и 1 припева до 3 куплетов и 3 припевов', duration: 'от 1:35 до 4:35', minDurationSeconds: 95, maxDurationSeconds: 275, url: 'https://www.youtube.com/watch?v=-5hTQFPnz54' },
    { id: 'real-slim-shady', name: 'Real Slim Shady', structure: '1 куплет и 1 припев', duration: '1:50', minDurationSeconds: 110, maxDurationSeconds: 110, url: 'https://www.youtube.com/watch?v=8_5eteU3fMY' },
    { id: 'superman', name: 'Superman', structure: '1 куплет и 1 припев', duration: '1:55', minDurationSeconds: 115, maxDurationSeconds: 115, url: 'https://www.youtube.com/watch?v=wJzTbgZ8hek' },
    { id: 'love-the-way-you-lie', name: 'Love The Way You Lie', structure: 'от 1 куплета и 1 припева до 2 куплетов и 2 припевов', duration: 'от 1:40 до 2:55', minDurationSeconds: 100, maxDurationSeconds: 175, url: 'https://www.youtube.com/watch?v=J5f8N7fDgEE' },
    { id: 'stan', name: 'Stan', structure: '3 припева и 1 куплет', duration: '2:00', minDurationSeconds: 120, maxDurationSeconds: 120, url: 'https://www.youtube.com/watch?v=2sSMLL0BT6A' },
    { id: 'rap-god', name: 'Rap God', structure: '1 припев + быстрая часть', duration: '0:55', minDurationSeconds: 55, maxDurationSeconds: 55, url: 'https://www.youtube.com/watch?v=1Di6T_CYKUw' },
    { id: 'monster', name: 'Monster', structure: '1 куплет и 1 припев', duration: '1:25', minDurationSeconds: 85, maxDurationSeconds: 85, url: 'https://www.youtube.com/watch?v=IXR_LfjMlT8' },
    { id: 'smack-that-ass', name: 'Smack That', structure: '1 куплет и 2 припева', duration: '1:50', minDurationSeconds: 110, maxDurationSeconds: 110, url: 'https://www.youtube.com/watch?v=k5Nm1vU906I' },
    { id: 'not-afraid', name: 'Not Afraid', structure: 'от 1 куплета и 1 припева до 1 бриджа, 2 куплетов и 2 припевов', duration: 'от 1:30 до 3:00', minDurationSeconds: 90, maxDurationSeconds: 180, url: 'https://www.youtube.com/watch?v=j0igfpz9wMk' },
    { id: 'houdini', name: 'Houdini', structure: '1 куплет, 1 бридж и 1 припев', duration: '1:40', minDurationSeconds: 100, maxDurationSeconds: 100, url: 'https://www.youtube.com/watch?v=DzZ39adFh0Y' },
    { id: 'beautiful', name: 'Beautiful', structure: '1 куплет, 1 припев', duration: '1:55', minDurationSeconds: 115, maxDurationSeconds: 115, url: 'https://www.youtube.com/watch?v=GQAe-jqR4ZA' },
    { id: 'space-bound', name: 'Space Bound', structure: 'от 1 куплета и 1 припева до 2 куплетов, 1 бриджа и 2 припевов', duration: 'от 1:40 до 3:10', minDurationSeconds: 100, maxDurationSeconds: 190, url: 'https://www.youtube.com/watch?v=gLwNQTcEF34' },
    { id: 'airplanes', name: 'Airplanes', structure: '1 куплет, 1 бридж и 2 припева', duration: '2:35', minDurationSeconds: 155, maxDurationSeconds: 155, url: 'https://www.youtube.com/watch?v=m4kqmSbJwO8' },
    { id: 'when-im-gone', name: 'When I’m Gone', structure: '1 куплет и 1 припев', duration: '1:20', minDurationSeconds: 80, maxDurationSeconds: 80, url: 'https://www.youtube.com/watch?v=7mTsW-rDEIg' },
    { id: 'godzilla', name: 'Godzilla', structure: '1 припев и быстрая часть', duration: '1:00', minDurationSeconds: 60, maxDurationSeconds: 60, url: 'https://www.youtube.com/watch?v=P92ByHRwa5k' },
    { id: 'till-i-collapse', name: 'Till I Collapse', structure: 'интро, 1 куплет, 1 припев и аутро', duration: '2:25', minDurationSeconds: 145, maxDurationSeconds: 145, url: 'https://www.youtube.com/watch?v=cIdIldktihI' },
    { id: 'you-dont-know', name: 'You Don’t Know', structure: '1 куплет и 2 припева', duration: '1:30', minDurationSeconds: 90, maxDurationSeconds: 90, url: 'https://www.youtube.com/watch?v=q46sR5uXBbw' },
    { id: 'i-need-a-doctor', name: 'I Need a Doctor', structure: '2 припева и 1 куплет', duration: '1:45', minDurationSeconds: 105, maxDurationSeconds: 105, url: 'https://www.youtube.com/watch?v=fsoekvs-RmE' },
    { id: 'no-love', name: 'No Love', structure: '1 куплет и 1 припев', duration: '2:30', minDurationSeconds: 150, maxDurationSeconds: 150, url: 'https://www.youtube.com/watch?v=zBkKB1CEQUY' },
    { id: 'fast-lane', name: 'Fast Lane', structure: '1 куплет и 1 припев', duration: '1:10', minDurationSeconds: 70, maxDurationSeconds: 70, url: 'https://www.youtube.com/watch?v=mTVSxKNF1Hg' },
    { id: 'forever', name: 'Forever', structure: '1 куплет и 2 припева', duration: '1:50', minDurationSeconds: 110, maxDurationSeconds: 110, url: 'https://www.youtube.com/watch?v=EEAOhQwf-Pg' },
    { id: 'despicable', name: 'Despicable', structure: '1 куплет', duration: '2:15', minDurationSeconds: 135, maxDurationSeconds: 135, url: 'https://www.youtube.com/watch?v=hPeGwtnB7Sc' },
    { id: 'venom', name: 'Venom', structure: '1 куплет и 1 припев', duration: '1:45', minDurationSeconds: 105, maxDurationSeconds: 105, url: 'https://www.youtube.com/watch?v=DVDXrZMlgTM' },
    { id: 'sing-for-the-moment', name: 'Sing For The Moment', structure: 'интро, 1 куплет и 1 припев', duration: '1:40', minDurationSeconds: 100, maxDurationSeconds: 100, url: 'https://www.youtube.com/watch?v=WN3ZqczK_Q4' },
    { id: 'my-name-is', name: 'My Name Is', structure: '1 куплет и 2 припева', duration: '1:30', minDurationSeconds: 90, maxDurationSeconds: 90, url: 'https://www.youtube.com/watch?v=YRa5k2ilEA8' },
    { id: 'ass-like-that', name: 'Ass Like That', structure: '1 куплет и 2 припева', duration: '1:40', minDurationSeconds: 100, maxDurationSeconds: 100, url: 'https://www.youtube.com/watch?v=mEzo-tozn7A' },
    { id: 'cleanin-out-my-closet', name: 'Cleanin’ Out My Closet', structure: '1 куплет и 1 припев', duration: '1:20', minDurationSeconds: 80, maxDurationSeconds: 80, url: 'https://www.youtube.com/watch?v=Yq-iZfTib0I' },
    { id: 'hailies-song', name: 'Hailie’s Song', structure: '2 куплета и 2 припева', duration: '3:25', minDurationSeconds: 205, maxDurationSeconds: 205, url: 'https://www.youtube.com/watch?v=a2jr_659JU0' },
    { id: 'just-lose-it', name: 'Just Lose It', structure: '1 куплет и 1 припев', duration: '1:30', minDurationSeconds: 90, maxDurationSeconds: 90, url: 'https://www.youtube.com/watch?v=SmKbsQXBL3U' },
    { id: 'shake-that-ass', name: 'Shake That Ass', structure: '1 куплет, 1 припев и 1 бридж', duration: '1:40', minDurationSeconds: 100, maxDurationSeconds: 100, url: 'https://www.youtube.com/watch?v=dO41euCqS04' },
    { id: 'we-made-you', name: 'We Made You', structure: '1 куплет, 1 припев, 1 бридж и аутро', duration: '2:15', minDurationSeconds: 135, maxDurationSeconds: 135, url: 'https://www.youtube.com/watch?v=DM5bB6CzJ88' },
    { id: 'marshall-mathers', name: 'Marshall Mathers', structure: '1 куплет и 3 припева', duration: '2:30', minDurationSeconds: 150, maxDurationSeconds: 150, url: 'https://www.youtube.com/watch?v=AaHig2wL9pQ' },
    { id: 'like-a-toy-soldiers', name: 'Like a Toy Soldiers', structure: '1 куплет и 2 припева', duration: '2:20', minDurationSeconds: 140, maxDurationSeconds: 140, url: 'https://www.youtube.com/watch?v=Hd4kRlpOEwk' },
    { id: 'business', name: 'Business', structure: '1 куплет и 1 припев', duration: '1:10', minDurationSeconds: 70, maxDurationSeconds: 70, url: 'https://www.youtube.com/watch?v=ayegqN0fjTs' },
    { id: 'all-she-wrote', name: 'All She Wrote', structure: '1 куплет и 2 припева', duration: '1:45', minDurationSeconds: 105, maxDurationSeconds: 105, url: 'https://www.youtube.com/watch?v=OItsfklZC-Y' },
    { id: 'forgot-about-dre', name: 'Forgot About Dre', structure: '1 куплет и 2 припева', duration: '1:45', minDurationSeconds: 105, maxDurationSeconds: 105, url: 'https://www.youtube.com/watch?v=QFcv5Ma8u8k' },
];

// src/scripts/configurator-data.js

export const PACKAGES = {
    LIGHT: {
        id: 'light',
        name: 'Light',
        price: 285000,
        description: 'Идеально для камерных мероприятий',
        params: {
            hostHours: 2,
            guestCount: '1-40',
            venueType: 'chamber',
            venueGear: 'none',
            techOption: null
        },
        features: [
            'Время работы: 2 часа',
            'Программа: 2–3 AI-интерактива + динамичные активности',
            'Звук: Акустическая система JBL от ведущего (для залов до 40 человек)',
            'Шоу: Eminem Tribute (5-10 мин) - по желанию'
        ],
        note: 'Услуги DJ в этот пакет не входят.'
    },
    STANDARD: {
        id: 'standard',
        name: 'Standard',
        price: 625000,
        description: 'Оптимальный выбор для большинства событий',
        params: {
            hostHours: 4,
            guestCount: '41-80',
            venueType: 'standard',
            venueGear: 'none',
            techOption: 'STANDARD'
        },
        features: [
            'Время работы: 4 часа',
            'Программа: 4–5 AI-интерактивов + динамичные активности',
            'Звук: Профессиональный DJ + Комплект оборудования (до 80 чел)',
            'Шоу: Eminem Tribute (10-15 мин) - по желанию'
        ],
        note: null // <-- Добавлено для совместимости (пустое значение)
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        price: 720000,
        description: 'Максимальное насыщение программы',
        params: {
            hostHours: 6,
            guestCount: '41-80',
            venueType: 'standard',
            venueGear: 'none',
            techOption: 'STANDARD'
        },
        features: [
            'Время работы: 6 часов',
            'Программа: 5–6 AI-интерактивов + динамичные активности',
            'Звук: Профессиональный DJ + Комплект оборудования (до 80 чел)',
            'Шоу: Eminem Tribute (до 30 мин) или выходы в течении вечера - по желанию'
        ],
        note: null // <-- Добавлено для совместимости (пустое значение)
    }
};