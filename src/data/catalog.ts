import { Product, StoreCategory, PaymentMethod } from '../types';

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    id: 'gaming',
    name: 'Gaming Topup',
    emoji: '🎮',
    icon: 'Gamepad2',
    description: 'Instant game top-ups, coins, diamonds, UC & CP points',
    accentColor: '#E5092F',
    productCount: 6,
    subcategories: [
      {
        id: 'gaming-topup',
        mainCategoryId: 'gaming',
        name: 'Gaming Top Up',
        emoji: '💳',
        icon: 'CreditCard',
        description: 'PUBG UC, Free Fire Diamonds, COD CP, eFootball Coins, FC Mobile'
      },
      {
        id: 'gaming-accounts',
        mainCategoryId: 'gaming',
        name: 'Accounts',
        emoji: '🛡️',
        icon: 'ShieldCheck',
        description: 'Verified game accounts, Konami ID squads & custom orders'
      }
    ]
  },
  {
    id: 'social',
    name: 'Social Media Topup',
    emoji: '📱',
    icon: 'Smartphone',
    description: 'Telegram Stars, Premium, TikTok Coins, Boost & Snapchat+',
    accentColor: '#E5092F',
    productCount: 6,
    subcategories: [
      {
        id: 'social-services',
        mainCategoryId: 'social',
        name: 'Social Media Services',
        emoji: '📈',
        icon: 'TrendingUp',
        description: 'Telegram Stars, Telegram Premium, TikTok Coins, FB Boost, Snapchat+'
      },
      {
        id: 'social-accounts',
        mainCategoryId: 'social',
        name: 'Accounts',
        emoji: '👥',
        icon: 'Users',
        description: 'Monetized & aged social accounts, verified channels'
      }
    ]
  },
  {
    id: 'website',
    name: 'Website Services',
    emoji: '🌐',
    icon: 'Globe',
    description: 'Custom business websites, web applications & Telegram Mini Apps',
    accentColor: '#E5092F',
    productCount: 1,
    subcategories: [
      {
        id: 'web-development',
        mainCategoryId: 'website',
        name: 'Web Development',
        emoji: '💻',
        icon: 'Code',
        description: 'Modern responsive websites, e-commerce, Telegram mini apps & custom web design'
      }
    ]
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    icon: 'Smartphone',
    description: 'Instant transfer via Telebirr app / *127#',
    accountNumber: '0989678770',
    accountName: 'Kirubel',
    badge: 'Popular',
    instructions: 'Send the exact amount via Telebirr to 0989678770 (Kirubel) and enter your Telebirr Transaction ID below.'
  },
  {
    id: 'binance',
    name: 'Binance',
    icon: 'Wallet',
    description: 'Binance Pay / UID transfer',
    accountNumber: '316723542',
    accountName: 'Kirubel',
    badge: 'Official Binance',
    instructions: 'Transfer via Binance Pay using Binance ID 316723542 (Kirubel) and enter your Binance Order / TxID below.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // =========================================================================
  // 🎮 GAMING -> 💳 GAMING TOP UP
  // =========================================================================

  // 1. 🎯 PUBG UC — BY ID
  {
    id: 'pubg-uc',
    name: 'PUBG UC',
    category: 'gaming',
    subCategory: 'gaming-topup',
    packageType: 'By ID',
    tagline: 'Instant PUBG Mobile UC Top-Up via Player ID',
    shortDescription: 'Official UC top-up for PUBG Mobile via numeric Character ID.',
    longDescription: 'Instant PUBG Mobile UC top-up directly to your Character ID. 100% safe, fast delivery and no login credentials required. Unlock Royale Pass, premium crates and weapon upgrades.',
    icon: 'Crosshair',
    image: '/pubguc.jpg',
    badge: 'By ID',
    isPopular: true,
    popularPriceText: '385 ➡️ 1,200 BIRR',
    status: 'Fast Delivery',
    deliveryEstimate: '2 - 8 minutes',
    packageNote: 'UC የሚገባበት ጊዜ 2-8 ደቂቃ!',
    requiredFields: [
      {
        id: 'player_id',
        label: 'Character ID (UID)',
        placeholder: 'e.g. 5128492019',
        type: 'text',
        helperText: 'Found in PUBG profile under your avatar',
        required: true
      },
      {
        id: 'in_game_name',
        label: 'Character In-Game Name',
        placeholder: 'e.g. BABI_GAMER',
        type: 'text',
        helperText: 'Used to verify account nickname',
        required: true
      }
    ],
    packages: [
      { id: 'pubg-30', name: '30 UC', amount: 30, quantity: 30, unit: 'UC', price: 140, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-60', name: '60 UC', amount: 60, quantity: 60, unit: 'UC', price: 200, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-120', name: '120 UC', amount: 120, quantity: 120, unit: 'UC', price: 390, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-180', name: '180 UC', amount: 180, quantity: 180, unit: 'UC', price: 570, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-240', name: '240 UC', amount: 240, quantity: 240, unit: 'UC', price: 750, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-325', name: '325 UC', amount: 325, quantity: 325, unit: 'UC', price: 890, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-355', name: '355 UC', amount: 355, quantity: 355, unit: 'UC', price: 990, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-365', name: '365 UC', amount: 365, quantity: 365, unit: 'UC', price: 1050, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-385', name: '385 UC', amount: 385, quantity: 385, unit: 'UC', price: 1200, currency: 'BIRR', packageType: 'By ID', badge: 'Popular' },
      { id: 'pubg-415', name: '415 UC', amount: 415, quantity: 415, unit: 'UC', price: 1150, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-445', name: '445 UC', amount: 445, quantity: 445, unit: 'UC', price: 1280, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-475', name: '475 UC', amount: 475, quantity: 475, unit: 'UC', price: 1380, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-505', name: '505 UC', amount: 505, quantity: 505, unit: 'UC', price: 1480, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-565', name: '565 UC', amount: 565, quantity: 565, unit: 'UC', price: 1650, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-660', name: '660 UC', amount: 660, quantity: 660, unit: 'UC', price: 1790, currency: 'BIRR', packageType: 'By ID', badge: 'Best Value' },
      { id: 'pubg-720', name: '720 UC', amount: 720, quantity: 720, unit: 'UC', price: 1985, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-780', name: '780 UC', amount: 780, quantity: 780, unit: 'UC', price: 2090, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-810', name: '810 UC', amount: 810, quantity: 810, unit: 'UC', price: 2260, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-840', name: '840 UC', amount: 840, quantity: 840, unit: 'UC', price: 2350, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-985', name: '985 UC', amount: 985, quantity: 985, unit: 'UC', price: 2800, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1045', name: '1,045 UC', amount: 1045, quantity: 1045, unit: 'UC', price: 2890, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1105', name: '1,105 UC', amount: 1105, quantity: 1105, unit: 'UC', price: 3050, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1165', name: '1,165 UC', amount: 1165, quantity: 1165, unit: 'UC', price: 3200, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1225', name: '1,225 UC', amount: 1225, quantity: 1225, unit: 'UC', price: 3350, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1320', name: '1,320 UC', amount: 1320, quantity: 1320, unit: 'UC', price: 3500, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1800', name: '1,800 UC', amount: 1800, quantity: 1800, unit: 'UC', price: 4480, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-1980', name: '1,980 UC', amount: 1980, quantity: 1980, unit: 'UC', price: 5100, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-2125', name: '2,125 UC', amount: 2125, quantity: 2125, unit: 'UC', price: 5500, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-2460', name: '2,460 UC', amount: 2460, quantity: 2460, unit: 'UC', price: 6300, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-2785', name: '2,785 UC', amount: 2785, quantity: 2785, unit: 'UC', price: 7100, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-3110', name: '3,110 UC', amount: 3110, quantity: 3110, unit: 'UC', price: 7900, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-3850', name: '3,850 UC', amount: 3850, quantity: 3850, unit: 'UC', price: 8800, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-4030', name: '4,030 UC', amount: 4030, quantity: 4030, unit: 'UC', price: 9750, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-4510', name: '4,510 UC', amount: 4510, quantity: 4510, unit: 'UC', price: 10900, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-5650', name: '5,650 UC', amount: 5650, quantity: 5650, unit: 'UC', price: 13500, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-8100', name: '8,100 UC', amount: 8100, quantity: 8100, unit: 'UC', price: 17480, currency: 'BIRR', packageType: 'By ID', badge: 'Mega' },
      { id: 'pubg-9900', name: '9,900 UC', amount: 9900, quantity: 9900, unit: 'UC', price: 23200, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-11950', name: '11,950 UC', amount: 11950, quantity: 11950, unit: 'UC', price: 27600, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-16200', name: '16,200 UC', amount: 16200, quantity: 16200, unit: 'UC', price: 35600, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-24300', name: '24,300 UC', amount: 24300, quantity: 24300, unit: 'UC', price: 54100, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-32400', name: '32,400 UC', amount: 32400, quantity: 32400, unit: 'UC', price: 71000, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-40500', name: '40,500 UC', amount: 40500, quantity: 40500, unit: 'UC', price: 92000, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-48600', name: '48,600 UC', amount: 48600, quantity: 48600, unit: 'UC', price: 112000, currency: 'BIRR', packageType: 'By ID' },
      { id: 'pubg-60000', name: '60,000 UC', amount: 60000, quantity: 60000, unit: 'UC', price: 147000, currency: 'BIRR', packageType: 'By ID', badge: 'Ultimate' }
    ],
    guideSteps: [
      'Select your desired PUBG UC package',
      'Enter your Character ID and in-game name',
      'Complete secure payment via Telebirr, CBE, or Crypto',
      'UC is credited to your PUBG account in 2-8 minutes automatically'
    ]
  },

  // 2. ⚽ eFOOTBALL — FOR ANDROID USER
  {
    id: 'efootball-android-user',
    name: 'eFootball For Android User',
    category: 'gaming',
    subCategory: 'gaming-topup',
    packageType: 'Android',
    tagline: 'Instant eFootball Coins for Android / Google Play Users',
    shortDescription: 'Official eFootball coin top-up for Android devices.',
    longDescription: 'Top up genuine eFootball coins directly to your Android device via Konami ID or Google Play account. Fast, safe and ready for signing Big Time, Epic and Showtime cards.',
    icon: 'Trophy',
    image: '/efootballcion.jpg',
    badge: 'Android',
    isPopular: true,
    popularPriceText: '2130 Coins ➡️ 3,900 Birr',
    status: 'Fast Delivery',
    deliveryEstimate: '2 - 6 minutes',
    requiredFields: [
      {
        id: 'konami_id_email',
        label: 'Konami ID Email / Username',
        placeholder: 'e.g. user@gmail.com',
        type: 'email',
        helperText: 'Your Konami ID registered email',
        required: true
      },
      {
        id: 'konami_password',
        label: 'Konami ID Password',
        placeholder: 'Enter Konami password',
        type: 'text',
        helperText: 'Stored securely & used only for top-up fulfillment',
        required: true
      }
    ],
    packages: [
      { id: 'ef-and-130', name: '130 Coins', amount: 130, quantity: 130, unit: 'Coins', price: 130, currency: 'BIRR' },
      { id: 'ef-and-320', name: '320 Coins', amount: 320, quantity: 320, unit: 'Coins', price: 270, currency: 'BIRR' },
      { id: 'ef-and-550', name: '550 Coins', amount: 550, quantity: 550, unit: 'Coins', price: 380, currency: 'BIRR' },
      { id: 'ef-and-750', name: '750 Coins', amount: 750, quantity: 750, unit: 'Coins', price: 470, currency: 'BIRR' },
      { id: 'ef-and-1050', name: '1,040 Coins', amount: 1040, quantity: 1040, unit: 'Coins', price: 2500, currency: 'BIRR' },
      { id: 'ef-and-2130', name: '2,130 Coins', amount: 2130, quantity: 2130, unit: 'Coins', price: 3900, currency: 'BIRR', badge: 'Popular' },
      { id: 'ef-and-3300', name: '3,250 Coins', amount: 3250, quantity: 3250, unit: 'Coins', price: 5800, currency: 'BIRR' },
      { id: 'ef-and-5800', name: '5,700 Coins', amount: 5700, quantity: 5700, unit: 'Coins', price: 8900, currency: 'BIRR' },
      { id: 'ef-and-12800', name: '12,800 Coins', amount: 12800, quantity: 12800, unit: 'Coins', price: 15950, currency: 'BIRR', badge: 'Whale Pack' }
    ]
  },

  // 4. ⚽ eFOOTBALL — FOR IPHONE USER
  {
    id: 'efootball-iphone-user',
    name: 'eFootball For iPhone User',
    category: 'gaming',
    subCategory: 'gaming-topup',
    packageType: 'iPhone',
    tagline: 'Instant eFootball Coins for iOS / Apple ID Users',
    shortDescription: 'Official eFootball coin top-up for Apple iPhone & iPad users.',
    longDescription: 'Top up genuine eFootball coins directly to your iOS / iPhone device. Fast, safe and ready for signing Big Time, Epic and Showtime cards on iOS.',
    icon: 'Apple',
    image: '/efootballcion.jpg',
    badge: 'iPhone / iOS',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '2 - 6 minutes',
    requiredFields: [
      {
        id: 'konami_id_email',
        label: 'Konami ID Email / Username',
        placeholder: 'e.g. user@icloud.com',
        type: 'email',
        helperText: 'Your Konami ID registered email for iOS',
        required: true
      },
      {
        id: 'konami_password',
        label: 'Konami ID Password',
        placeholder: 'Enter Konami password',
        type: 'text',
        required: true
      }
    ],
    packages: [
      { id: 'ef-ios-130', name: '130 Coins', amount: 130, quantity: 130, unit: 'Coins', price: 180, currency: 'BIRR' },
      { id: 'ef-ios-320', name: '320 Coins', amount: 320, quantity: 320, unit: 'Coins', price: 360, currency: 'BIRR' },
      { id: 'ef-ios-550', name: '550 Coins', amount: 550, quantity: 550, unit: 'Coins', price: 540, currency: 'BIRR' },
      { id: 'ef-ios-750', name: '750 Coins', amount: 750, quantity: 750, unit: 'Coins', price: 720, currency: 'BIRR' },
      { id: 'ef-ios-1050', name: '1,040 Coins', amount: 1040, quantity: 1040, unit: 'Coins', price: 1950, currency: 'BIRR', badge: 'Popular' },
      { id: 'ef-ios-2150', name: '2,130 Coins', amount: 2130, quantity: 2130, unit: 'Coins', price: 3700, currency: 'BIRR', badge: 'Best Value' },
      { id: 'ef-ios-3300', name: '3,250 Coins', amount: 3250, quantity: 3250, unit: 'Coins', price: 5400, currency: 'BIRR' },
      { id: 'ef-ios-5800', name: '5,700 Coins', amount: 5700, quantity: 5700, unit: 'Coins', price: 7900, currency: 'BIRR' },
      { id: 'ef-ios-12800', name: '12,800 Coins', amount: 12800, quantity: 12800, unit: 'Coins', price: 15650, currency: 'BIRR', badge: 'Whale Pack' }
    ]
  },

  // 5. 🔥 FREE FIRE DIAMONDS
  {
    id: 'freefire-diamonds',
    name: 'Free Fire Diamonds',
    category: 'gaming',
    subCategory: 'gaming-topup',
    tagline: 'Instant Garena Free Fire Diamonds & Membership Passes',
    shortDescription: 'Direct Player ID top-up for Free Fire diamonds & passes.',
    longDescription: 'Top-up Free Fire diamonds directly via Player ID. Unlock elite bundles, weapon evolutions, characters and weekly/monthly membership passes with 100% safety.',
    icon: 'Flame',
    image: '/freefirediamond.jpg',
    badge: 'Direct UID',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '1 - 5 minutes',
    requiredFields: [
      {
        id: 'player_id',
        label: 'Free Fire Player ID (UID)',
        placeholder: 'e.g. 2938491823',
        type: 'text',
        helperText: 'Your 9-10 digit Player ID found in Free Fire profile',
        required: true
      },
      {
        id: 'server_region',
        label: 'Account Server Region',
        placeholder: 'Select Server',
        type: 'select',
        options: ['Global / MEA', 'Europe', 'North America', 'Asia'],
        required: true
      }
    ],
    packages: [
      { id: 'ff-100', name: '100 Diamonds', amount: 100, quantity: 100, unit: '💎', price: 280, currency: 'BIRR', packageGroup: 'Diamonds' },
      { id: 'ff-210', name: '210 Diamonds', amount: 210, quantity: 210, unit: '💎', price: 550, currency: 'BIRR', packageGroup: 'Diamonds' },
      { id: 'ff-530', name: '530 Diamonds', amount: 530, quantity: 530, unit: '💎', price: 1100, currency: 'BIRR', packageGroup: 'Diamonds', badge: 'Popular' },
      { id: 'ff-1080', name: '1,080 Diamonds', amount: 1080, quantity: 1080, unit: '💎', price: 2200, currency: 'BIRR', packageGroup: 'Diamonds' },
      { id: 'ff-2200', name: '2,200 Diamonds', amount: 2200, quantity: 2200, unit: '💎', price: 3950, currency: 'BIRR', packageGroup: 'Diamonds', badge: 'Best Value' },
      { id: 'ff-4450', name: '4,450 Diamonds', amount: 4450, quantity: 4450, unit: '💎', price: 8400, currency: 'BIRR', packageGroup: 'Diamonds' },
      { id: 'ff-7450', name: '7,450 Diamonds', amount: 7450, quantity: 7450, unit: '💎', price: 13800, currency: 'BIRR', packageGroup: 'Diamonds', badge: 'Super Pack' },
      { id: 'ff-weekly', name: 'Weekly Membership Pass', amount: 450, quantity: 450, unit: '💎 Pass', price: 420, currency: 'BIRR', packageGroup: 'Membership & Pass', badge: 'Hot' },
      { id: 'ff-monthly', name: 'Monthly Membership Pass', amount: 2600, quantity: 2600, unit: '💎 Pass', price: 1950, currency: 'BIRR', packageGroup: 'Membership & Pass', badge: 'Best Deal' },
      { id: 'ff-lvl-up', name: 'Level Up Pass (800 💎)', amount: 800, quantity: 800, unit: '💎 Pass', price: 380, currency: 'BIRR', packageGroup: 'Membership & Pass' }
    ]
  },

  // 6. 🎖️ CALL OF DUTY: MOBILE CP
  {
    id: 'call-of-duty-cp',
    name: 'Call of Duty',
    category: 'gaming',
    subCategory: 'gaming-topup',
    tagline: 'Instant COD: Mobile CP Points via UID or Activision',
    shortDescription: 'Official CP top-up for Call of Duty: Mobile.',
    longDescription: 'Get COD Points (CP) loaded in minutes. Unlock Battle Pass, Mythic and Legendary Lucky Draws, and crate items on COD Mobile safely.',
    icon: 'Shield',
    image: '/callofduty.jpg',
    badge: 'COD Points',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '2 - 8 minutes',
    requiredFields: [
      {
        id: 'cod_uid',
        label: 'COD Mobile UID / Player ID',
        placeholder: 'e.g. 67493029104819382',
        type: 'text',
        helperText: 'Found in your COD Mobile in-game profile',
        required: true
      },
      {
        id: 'server_region',
        label: 'Region',
        placeholder: 'Select Region',
        type: 'select',
        options: ['Global / MEA', 'Garena', 'Other'],
        required: true
      }
    ],
    packages: [
      { id: 'cp-30', name: '30 CP', amount: 30, quantity: 30, unit: 'CP', price: 140, currency: 'BIRR' },
      { id: 'cp-80', name: '80 CP', amount: 80, quantity: 80, unit: 'CP', price: 250, currency: 'BIRR' },
      { id: 'cp-420', name: '420 CP', amount: 420, quantity: 420, unit: 'CP', price: 1700, currency: 'BIRR', badge: 'Battle Pass' },
      { id: 'cp-880', name: '880 CP', amount: 880, quantity: 880, unit: 'CP', price: 2650, currency: 'BIRR', badge: 'Popular' },
      { id: 'cp-2400', name: '2,400 CP', amount: 2400, quantity: 2400, unit: 'CP', price: 4800, currency: 'BIRR', badge: 'Best Value' },
      { id: 'cp-5000', name: '5,000 CP', amount: 5000, quantity: 5000, unit: 'CP', price: 9000, currency: 'BIRR' },
      { id: 'cp-10800', name: '10,800 CP', amount: 10800, quantity: 10800, unit: 'CP', price: 16000, currency: 'BIRR', badge: 'Mythic Draw' },
      { id: 'cp-21600', name: '21,600 CP', amount: 21600, quantity: 21600, unit: 'CP', price: 38000, currency: 'BIRR', badge: 'Mega Draw' }
    ]
  },

  // 7. ⚽ FC MOBILE (EA SPORTS FC)
  {
    id: 'fc-mobile',
    name: 'FC Mobile',
    category: 'gaming',
    subCategory: 'gaming-topup',
    tagline: 'Instant EA SPORTS FC Mobile Points & Silver Top-Up',
    shortDescription: 'Official FC Points and Silver packs for EA Sports FC Mobile.',
    longDescription: 'Top up FC Points and Silver packs in seconds. Build your Ultimate Team with TOTY, TOTS and Prime Icon packs on EA SPORTS FC Mobile.',
    icon: 'Trophy',
    image: '/fcmobile.png',
    badge: 'EA FC 2026',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '2 - 6 minutes',
    requiredFields: [
      {
        id: 'fc_uid',
        label: 'FC Mobile User ID (UID)',
        placeholder: 'e.g. 1928491048',
        type: 'text',
        helperText: 'Found in FC Mobile Settings -> User Profile',
        required: true
      },
      {
        id: 'in_game_name',
        label: 'In-Game Nickname',
        placeholder: 'e.g. FC_CHAMPION',
        type: 'text',
        required: true
      }
    ],
    packages: [
      { id: 'fc-40', name: '40 FC Points', amount: 40, quantity: 40, unit: 'FP', price: 130, currency: 'BIRR', packageGroup: 'FC Points' },
      { id: 'fc-100', name: '100 FC Points', amount: 100, quantity: 100, unit: 'FP', price: 260, currency: 'BIRR', packageGroup: 'FC Points' },
      { id: 'fc-520', name: '520 FC Points', amount: 520, quantity: 520, unit: 'FP', price: 1500, currency: 'BIRR', packageGroup: 'FC Points', badge: 'Popular' },
      { id: 'fc-1070', name: '1,070 FC Points', amount: 1070, quantity: 1070, unit: 'FP', price: 2500, currency: 'BIRR', packageGroup: 'FC Points', badge: 'Best Value' },
      { id: 'fc-2200', name: '2,200 FC Points', amount: 2200, quantity: 2200, unit: 'FP', price: 3999, currency: 'BIRR', packageGroup: 'FC Points' },
      { id: 'fc-5750', name: '5,750 FC Points', amount: 5750, quantity: 5750, unit: 'FP', price: 8850, currency: 'BIRR', packageGroup: 'FC Points', badge: 'TOTY Pack' },
      { id: 'fc-12000', name: '12,000 FC Points', amount: 12000, quantity: 12000, unit: 'FP', price: 16750, currency: 'BIRR', packageGroup: 'FC Points', badge: 'Icon Pack' },
      { id: 'fc-silver-2k', name: '2,000 Silver', amount: 2000, quantity: 2000, unit: 'Silver', price: 350, currency: 'BIRR', packageGroup: 'Silver Packs' },
      { id: 'fc-silver-10k', name: '10,000 Silver', amount: 10000, quantity: 10000, unit: 'Silver', price: 1550, currency: 'BIRR', packageGroup: 'Silver Packs' },
      { id: 'fc-silver-50k', name: '50,000 Silver', amount: 50000, quantity: 50000, unit: 'Silver', price: 6800, currency: 'BIRR', packageGroup: 'Silver Packs', badge: 'Best Deal' }
    ]
  },

  // =========================================================================
  // 📱 SOCIAL MEDIA -> 📈 SOCIAL MEDIA SERVICES
  // =========================================================================

  // 8. ⭐ TELEGRAM STARS
  {
    id: 'telegram-stars',
    name: 'Telegram Stars',
    category: 'social',
    subCategory: 'social-services',
    tagline: 'Official Telegram In-App Digital Stars Currency',
    shortDescription: 'Buy Telegram Stars with instant direct automated transfer to your @username.',
    longDescription: 'Official Telegram Stars currency used for paying mini apps, unlocking paid media content, tipping channels, and trading on the TON ecosystem. 100% safe, 0% extra fee, instant delivery directly to your Telegram username.',
    icon: 'Star',
    image: '/telegramstar.jpg',
    badge: '0% Fee',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '10 - 30 seconds',
    requiredFields: [
      {
        id: 'telegram_username',
        label: 'Telegram Username (@)',
        placeholder: 'e.g. @your_username',
        type: 'text',
        helperText: 'Stars will be gifted directly to this username',
        required: true
      }
    ],
    packages: [
      { id: 'tg-star-50', name: '50 Stars', amount: 50, quantity: 50, unit: 'Stars', price: 270, currency: 'BIRR' },
      { id: 'tg-star-75', name: '75 Stars', amount: 75, quantity: 75, unit: 'Stars', price: 340, currency: 'BIRR' },
      { id: 'tg-star-100', name: '100 Stars', amount: 100, quantity: 100, unit: 'Stars', price: 420, currency: 'BIRR' },
      { id: 'tg-star-150', name: '150 Stars', amount: 150, quantity: 150, unit: 'Stars', price: 440, currency: 'BIRR' },
      { id: 'tg-star-250', name: '250 Stars', amount: 250, quantity: 250, unit: 'Stars', price: 950, currency: 'BIRR' },
      { id: 'tg-star-350', name: '350 Stars', amount: 350, quantity: 350, unit: 'Stars', price: 1400, currency: 'BIRR' },
      { id: 'tg-star-500', name: '500 Stars', amount: 500, quantity: 500, unit: 'Stars', price: 1750, currency: 'BIRR', badge: 'Popular' },
      { id: 'tg-star-750', name: '750 Stars', amount: 750, quantity: 750, unit: 'Stars', price: 2600, currency: 'BIRR' },
      { id: 'tg-star-1000', name: '1,000 Stars', amount: 1000, quantity: 1000, unit: 'Stars', price: 3400, currency: 'BIRR', badge: 'Best Value' },
      { id: 'tg-star-1500', name: '1,500 Stars', amount: 1500, quantity: 1500, unit: 'Stars', price: 4800, currency: 'BIRR' },
      { id: 'tg-star-2500', name: '2,500 Stars', amount: 2500, quantity: 2500, unit: 'Stars', price: 8200, currency: 'BIRR' },
      { id: 'tg-star-5000', name: '5,000 Stars', amount: 5000, quantity: 5000, unit: 'Stars', price: 14300, currency: 'BIRR', badge: 'Whale' },
      { id: 'tg-star-10000', name: '10,000 Stars', amount: 10000, quantity: 10000, unit: 'Stars', price: 28500, currency: 'BIRR', badge: 'Mega Whale' }
    ],
    guideSteps: [
      'Select how many Telegram Stars you need',
      'Enter your public @username',
      'Complete the payment via Telebirr or CBE',
      'Stars are sent directly to your Telegram profile in seconds'
    ]
  },

  // 13. ⭐ TELEGRAM PREMIUM
  {
    id: 'telegram-premium',
    name: 'Telegram Premium',
    category: 'social',
    subCategory: 'social-services',
    tagline: 'Official Telegram Premium Subscriptions (3m, 6m, 1y)',
    shortDescription: 'Unlock 4GB uploads, faster speeds, voice-to-text, animated emojis & star badges.',
    longDescription: 'Official Telegram Premium subscription activation. Enjoy double limits, 4GB file uploads, faster download speed, voice message transcription, premium stickers, custom emoji reactions, and verified star badge.',
    icon: 'Crown',
    image: '/telegrampremium.jpg',
    badge: 'Premium Activation',
    isPopular: true,
    popularPriceText: '6 months ➡️ 3,600 birr',
    status: 'Fast Delivery',
    deliveryEstimate: '1 - 3 minutes',
    requiredFields: [
      {
        id: 'login_phone',
        label: 'Telegram Login Phone Number',
        placeholder: 'e.g. +251 9XXXXXXXX or 09XXXXXXXX',
        type: 'text',
        helperText: 'Phone number registered to your Telegram account',
        required: true
      },
      {
        id: 'login_password',
        label: 'Telegram Login Password / 2FA',
        placeholder: 'Enter your login or Two-Step Verification password',
        type: 'text',
        helperText: 'Two-Step Verification password or account login password',
        required: true
      },
      {
        id: 'telegram_username',
        label: 'Telegram Username (@)',
        placeholder: 'e.g. @your_username',
        type: 'text',
        helperText: 'Your Telegram username for account identification',
        required: true
      }
    ],
    packages: [
      { id: 'tg-prem-3m', name: '3 Months Premium', amount: 3, quantity: 3, unit: 'Months', price: 2600, currency: 'BIRR' },
      { id: 'tg-prem-6m', name: '6 Months Premium', amount: 6, quantity: 6, unit: 'Months', price: 3600, currency: 'BIRR', badge: 'Popular' },
      { id: 'tg-prem-12m', name: '12 Months (1 Year) Premium', amount: 12, quantity: 12, unit: 'Months', price: 6200, currency: 'BIRR', badge: 'Best Value' }
    ],
    guideSteps: [
      'Choose subscription duration (3, 6, or 12 months)',
      'Enter your Telegram login phone number, password & @username',
      'Complete secure payment via Telebirr or CBE',
      'Premium subscription is activated on your Telegram account in 1-3 minutes'
    ]
  },

  // 14. 🎵 TIKTOK GIFT COINS
  {
    id: 'tiktok-coins',
    name: 'TikTok Gift Coins',
    category: 'social',
    subCategory: 'social-services',
    tagline: 'Official TikTok Live Gifting & Recharge Coins',
    shortDescription: 'Recharge TikTok Coins instantly with direct username delivery.',
    longDescription: 'Send gifts to your favorite LIVE creators and unlock exclusive streaming badges. Safe, official recharge with instant wallet update.',
    icon: 'Coins',
    image: '/tiktokcion.jpg',
    badge: 'LIVE Gift',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '1 - 5 minutes',
    requiredFields: [
      {
        id: 'tiktok_username',
        label: 'TikTok Username (@)',
        placeholder: 'e.g. @your_tiktok',
        type: 'text',
        helperText: 'Your public TikTok username (make sure profile is public)',
        required: true
      }
    ],
    packages: [
      { id: 'ttc-50', name: '50 Coins', amount: 50, quantity: 50, unit: 'Coins', price: 270, currency: 'BIRR' },
      { id: 'ttc-100', name: '100 Coins', amount: 100, quantity: 100, unit: 'Coins', price: 370, currency: 'BIRR' },
      { id: 'ttc-200', name: '200 Coins', amount: 200, quantity: 200, unit: 'Coins', price: 570, currency: 'BIRR' },
      { id: 'ttc-500', name: '500 Coins', amount: 500, quantity: 500, unit: 'Coins', price: 1500, currency: 'BIRR' },
      { id: 'ttc-800', name: '800 Coins', amount: 800, quantity: 800, unit: 'Coins', price: 2000, currency: 'BIRR' },
      { id: 'ttc-1000', name: '1,000 Coins', amount: 1000, quantity: 1000, unit: 'Coins', price: 2500, currency: 'BIRR', badge: 'Popular' },
      { id: 'ttc-1500', name: '1,500 Coins', amount: 1500, quantity: 1500, unit: 'Coins', price: 3500, currency: 'BIRR' },
      { id: 'ttc-2000', name: '2,000 Coins', amount: 2000, quantity: 2000, unit: 'Coins', price: 4800, currency: 'BIRR', badge: 'Best Value' },
      { id: 'ttc-3000', name: '3,000 Coins', amount: 3000, quantity: 3000, unit: 'Coins', price: 7000, currency: 'BIRR' },
      { id: 'ttc-4000', name: '4,000 Coins', amount: 4000, quantity: 4000, unit: 'Coins', price: 9200, currency: 'BIRR' },
      { id: 'ttc-5000', name: '5,000 Coins', amount: 5000, quantity: 5000, unit: 'Coins', price: 11600, currency: 'BIRR', badge: 'Creator Pack' },
      { id: 'ttc-7500', name: '7,500 Coins', amount: 7500, quantity: 7500, unit: 'Coins', price: 17200, currency: 'BIRR' },
      { id: 'ttc-10000', name: '10,000 Coins', amount: 10000, quantity: 10000, unit: 'Coins', price: 23200, currency: 'BIRR', badge: 'Streamer' },
      { id: 'ttc-17000', name: '17,000 Coins', amount: 17000, quantity: 17000, unit: 'Coins', price: 42000, currency: 'BIRR' },
      { id: 'ttc-20000', name: '20,000 Coins', amount: 20000, quantity: 20000, unit: 'Coins', price: 46000, currency: 'BIRR' },
      { id: 'ttc-30000', name: '30,000 Coins', amount: 30000, quantity: 30000, unit: 'Coins', price: 69000, currency: 'BIRR', badge: 'Universe Gift' }
    ],
    guideSteps: [
      'Choose the number of TikTok Coins',
      'Enter your TikTok @username (public profile)',
      'Complete secure payment',
      'Coins appear in your TikTok Wallet in seconds'
    ]
  },

  // 15. 👻 SNAPCHAT PREMIUM
  {
    id: 'snapchat-premium',
    name: 'SNAPCHAT PREMIUM',
    category: 'social',
    subCategory: 'social-services',
    tagline: 'Official Snapchat+ Premium Subscription',
    shortDescription: 'Unlock exclusive experimental and pre-release Snapchat+ features, badge, custom app icons & story insights.',
    longDescription: 'Upgrade your Snapchat experience with Snapchat Premium / Snapchat+. Get exclusive features including priority story replies, custom app icons, best friends pin, story rewatch indicator, and post view emojis. Fast and safe automated delivery.',
    icon: 'Sparkles',
    image: '/snapchatpremium.png',
    badge: 'Snapchat+',
    isPopular: false,
    status: 'In Stock',
    deliveryEstimate: '1 - 5 minutes',
    referenceUrl: 'https://t.me/nazegames/65',
    requiredFields: [
      {
        id: 'snapchat_username',
        label: 'Snapchat Username',
        placeholder: 'e.g. your_snap_user',
        type: 'text',
        helperText: 'Enter the exact public Snapchat username for subscription delivery',
        required: true
      },
      {
        id: 'delivery_type',
        label: 'Activation Method',
        placeholder: 'Select Method',
        type: 'select',
        options: ['Direct Upgrade via Username', 'Redeemable Snapchat+ Gift Code'],
        required: true
      }
    ],
    packages: [
      { id: 'snap-3m', name: '3 Months', amount: 3, quantity: 3, unit: 'Months', price: 2800, currency: 'BIRR', badge: 'Popular' },
      { id: 'snap-6m', name: '6 Months', amount: 6, quantity: 6, unit: 'Months', price: 4999, currency: 'BIRR', badge: 'Best Value' },
      { id: 'snap-12m', name: '1 Year', amount: 12, quantity: 12, unit: 'Months', price: 7800, currency: 'BIRR', badge: 'Save 40%' }
    ],
    guideSteps: [
      'Choose your preferred Snapchat Premium duration (3m, 6m, 1y)',
      'Enter your Snapchat username',
      'Complete secure payment',
      'Your subscription gift link or direct upgrade is delivered promptly'
    ]
  },

  // 16. 📈 FACEBOOK PAGE BOOST
  {
    id: 'facebook-boost',
    name: 'Facebook Page Boost',
    category: 'social',
    subCategory: 'social-services',
    tagline: 'High Quality Page Followers, Likes & Video Views',
    shortDescription: 'Boost your Facebook Page presence with genuine organic engagement and real followers.',
    longDescription: 'Grow your business or creator profile with high retention Facebook followers, post likes, and monetization views. 100% compliant with Facebook terms, no password required.',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80',
    badge: 'Organic Reach',
    isPopular: false,
    status: 'Fast Delivery',
    deliveryEstimate: '10 - 30 minutes',
    requiredFields: [
      {
        id: 'page_url',
        label: 'Facebook Page or Post URL',
        placeholder: 'https://facebook.com/yourpage',
        type: 'text',
        helperText: 'Public URL of your Facebook page or video',
        required: true
      }
    ],
    packages: [
      { id: 'fb-1k', name: '1,000 Page Followers / Likes', amount: 1000, quantity: 1000, unit: 'Followers', price: 650, currency: 'BIRR' },
      { id: 'fb-5k', name: '5,000 Page Followers / Likes', amount: 5000, quantity: 5000, unit: 'Followers', price: 2600, currency: 'BIRR', badge: 'Popular' },
      { id: 'fb-10k', name: '10,000 Page Followers', amount: 10000, quantity: 10000, unit: 'Followers', price: 4800, currency: 'BIRR', badge: 'Best Value' },
      { id: 'fb-50k-views', name: '50,000 Reel / Video Views', amount: 50000, quantity: 50000, unit: 'Views', price: 1700, currency: 'BIRR' },
      { id: 'fb-engagement', name: 'Engaged Reach Pack', amount: 2700, quantity: 2700, unit: 'Engagements', price: 2950, currency: 'BIRR', badge: 'Viral Pack' }
    ],
    guideSteps: [
      'Select your Facebook package',
      'Paste your public Facebook Page or Post URL',
      'Submit payment',
      'Delivery starts automatically within 10 to 30 minutes'
    ]
  }
];

export const STORE_CONFIG = {
  storeName: 'BABI STORE',
  logoUrl: '/babistorelogo.jpg',
  tagline: 'Gaming & Social Media Services',
  supportUsername: 'Raf_babi',
  supportTelegramUrl: 'https://t.me/Raf_babi',
  botUsername: 'BabiStoreBot',
  channelUrl: 'https://t.me/babistore_channel',
  currency: 'BIRR',
  currencySymbol: 'BIRR',
  operationalHours: '24/7 Automated Fulfillment',
  averageDeliveryTime: '2.4 minutes'
};
