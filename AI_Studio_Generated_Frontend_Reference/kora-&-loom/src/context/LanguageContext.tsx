import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BoutiqueCategory } from '../data/boutiqueData';

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

export interface LanguageOption {
  code: SupportedLanguage;
  nativeLabel: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeLabel: 'English', englishName: 'English' },
  { code: 'ta', nativeLabel: 'தமிழ்', englishName: 'Tamil' },
  { code: 'hi', nativeLabel: 'हिन्दी', englishName: 'Hindi' },
  { code: 'ml', nativeLabel: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'te', nativeLabel: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', nativeLabel: 'ಕನ್ನಡ', englishName: 'Kannada' },
];

export interface LocalizedStrings {
  menu: string;
  searchPlaceholder: string;
  allSarees: string;
  wishlist: string;
  account: string;
  bag: string;
  heroTitle: string;
  shopSarees: string;
  bridalCombos: string;
  igFavoritesTitle: string;
  tapToShop: string;
  shopLook: string;
  shopByCategory: string;
  curatedCollection: string;
  bestSellers: string;
  freshOffLoom: string;
  newArrivals: string;
  addToCart: string;
  addToBag: string;
  moveToBag: string;
  remove: string;
  promoEyebrow: string;
  promoHeading: string;
  applyOffer: string;
  customerReviews: string;
  supportBadge: string;
  supportPrompt: string;
  mobilePlaceholder: string;
  requestCallback: string;
  callbackConfirmed: string;
  edit: string;
  shopSareesHeading: string;
  exploreStoreHeading: string;
  showroomContactHeading: string;
  shippingPaymentsHeading: string;
  freeDeliveryLine: string;
  exchangeLine: string;
  paymentMethodsLine: string;
  hoursLine: string;
  tagline: string;
  home: string;
  weaves: string;
  signIn: string;
  signOut: string;
  drapeOption: string;
  weaveLabel: string;
  bagEmpty: string;
  bagEmptyDesc: string;
  exploreSarees: string;
  subtotal: string;
  shippingLabel: string;
  totalPayable: string;
  proceedCheckout: string;
  expressCheckout: string;
  editBag: string;
  placeOrder: string;
  continueBrowsing: string;
  upiCard: string;
  codLabel: string;
  noSavedSarees: string;
  noSavedSareesDesc: string;
  expressOtpTitle: string;
  otpPrompt: string;
  continueOtp: string;
  chatbotTitle: string;
  chatbotSubtitle: string;
  chatbotGreeting: string;
  chatbotTyping: string;
  chatbotPlaceholder: string;
  helpLabel: string;
  languageLabel: string;
  backToTop: string;
  scrollToBottom: string;
  viewMore: string;
  showMore: string;
  showLess: string;
  viewAllCollections: string;
  customerCareTitle: string;
  careHelplineLabel: string;
  careHoursNote: string;
  careExchangeNote: string;
  howToOrderTitle: string;
  howToOrderSubtitle: string;
  howToOrderStartShopping: string;
  howToOrderSteps: Array<{ title: string; desc: string }>;
  weAcceptTitle: string;
  followUsSocial: string;
  chatOnWhatsApp: string;
  forCallLabel: string;
  howToCreateAccount: string;
  happyCustomers: string;
  inBagLabel: string;
  allPrices: string;
  clearFilter: string;
  noMatches: string;
  resetFilters: string;
  show20PlusReviews: string;
  allReviewsLabel: string;
  positiveReviewsLabel: string;
  constructiveFeedbackLabel: string;
  verifiedReviewsLabel: string;
  ratingBreakdownLabel: string;
  boutiqueCareNoteLabel: string;
  trustItems: Array<{ title: string; desc: string }>;
  quickPrompts: string[];
  categories: Record<BoutiqueCategory, string>;
}

const TRANSLATIONS: Record<SupportedLanguage, LocalizedStrings> = {
  en: {
    menu: 'Menu',
    searchPlaceholder: 'What are you looking for?',
    allSarees: 'All Sarees',
    wishlist: 'Wishlist',
    account: 'Account',
    bag: 'Bag',
    heroTitle: 'Handpicked heritage sarees, curated for effortless drape.',
    shopSarees: 'Shop Sarees',
    bridalCombos: 'Bridal & Gift Combos',
    igFavoritesTitle: 'Instagram Favorites',
    tapToShop: 'Tap a look to shop',
    shopLook: 'Shop Look',
    shopByCategory: 'Shop by Category',
    curatedCollection: 'Curated Collection',
    bestSellers: 'Best Sellers',
    freshOffLoom: 'Fresh Off the Loom',
    newArrivals: 'New Arrivals',
    addToCart: 'Add to Cart',
    addToBag: 'Add to Bag',
    moveToBag: 'Move to Bag',
    remove: 'Remove',
    promoEyebrow: 'Trousseau & Festive Savings',
    promoHeading: 'Save 10% on ₹3,999+ (KORA10) · 15% on ₹6,999+ (TROUSSEAU15)',
    applyOffer: 'Apply KORA10',
    customerReviews: 'Customer Reviews',
    supportBadge: 'Customer Support',
    supportPrompt: 'Have questions or need help ordering? Enter your mobile number, and our shop team will contact you to assist.',
    mobilePlaceholder: 'Enter your 10-digit mobile number',
    requestCallback: 'Request Call Back',
    callbackConfirmed: 'Callback requested for',
    edit: 'Edit',
    shopSareesHeading: 'Shop Sarees',
    exploreStoreHeading: 'Explore Store',
    showroomContactHeading: 'Showroom & Contact',
    shippingPaymentsHeading: 'Shipping & Payments',
    freeDeliveryLine: 'Free Delivery on orders ₹1,999+',
    exchangeLine: '7-Day Exchange Support',
    paymentMethodsLine: 'UPI · Cards · NetBanking · Cash on Delivery',
    hoursLine: 'Mon–Sat · 10:00 AM – 8:30 PM IST',
    tagline: 'Handpicked Premium Sarees',
    home: 'Home',
    weaves: 'Weaves',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    drapeOption: 'Drape / Pack Option',
    weaveLabel: 'Weave:',
    bagEmpty: 'Your saree bag is empty',
    bagEmptyDesc: 'Explore handpicked Kanchipuram silks, Banarasi weaves, and breezy Maheshwari drapes.',
    exploreSarees: 'Explore Sarees',
    subtotal: 'Subtotal',
    shippingLabel: 'Insulated Dispatch',
    totalPayable: 'Total Payable',
    proceedCheckout: 'Proceed to Express Checkout',
    expressCheckout: 'Express Guest Checkout',
    editBag: 'Edit Bag',
    placeOrder: 'Place Order',
    continueBrowsing: 'Continue Browsing',
    upiCard: 'UPI / Card',
    codLabel: 'Cash on Delivery',
    noSavedSarees: 'No saved sarees yet',
    noSavedSareesDesc: 'Tap the heart icon on any saree card to bookmark favourites for your wedding or festive shortlist.',
    expressOtpTitle: 'Express OTP Sign In',
    otpPrompt: 'Sign in with your mobile number for quick bag checkout and boutique updates.',
    continueOtp: 'Continue with Mobile OTP',
    chatbotTitle: 'Kora Style Assistant',
    chatbotSubtitle: 'Multilingual AI Saree Support',
    chatbotGreeting: 'Vanakkam! Ask me about Kanchipuram silks, prices, blouse sizes, COD, or ordering help.',
    chatbotTyping: 'Typing...',
    chatbotPlaceholder: 'Ask about sarees, delivery, or offers...',
    helpLabel: 'Help',
    languageLabel: 'Language',
    backToTop: 'Back to Top',
    scrollToBottom: 'Scroll to Bottom',
    viewMore: 'View More',
    showMore: 'Show More',
    showLess: 'Show Less',
    viewAllCollections: 'View All Collections',
    customerCareTitle: 'Customer Care Contact Details',
    careHelplineLabel: 'WhatsApp & Order Support',
    careHoursNote: 'Mon–Sat · 10:00 AM – 8:30 PM IST (Replies within 2 hrs)',
    careExchangeNote: 'Order support, bridal styling & 7-day exchange desk',
    howToOrderTitle: 'How to Order',
    howToOrderSubtitle: 'Follow a realistic 6-step walkthrough from search & product selection to payment',
    howToOrderStartShopping: 'Start Shopping Sarees',
    howToOrderSteps: [
      { title: 'Search or Browse Sarees', desc: 'Type a weave or colour in the search bar or tap any category.' },
      { title: 'Select Product', desc: 'Tap a saree to preview photos, fabric weave, and matching blouse.' },
      { title: 'Select Quantity (+ / −)', desc: 'Adjust quantity directly on the saree card or quick-view modal.' },
      { title: 'Add to Cart', desc: 'Tap Add to Cart and see your bag count update right away.' },
      { title: 'Apply Offer', desc: 'Open your Saree Bag and apply KORA10 or TROUSSEAU15.' },
      { title: 'Checkout & Payment', desc: 'Enter delivery pincode and pay via G Pay, PhonePe, Card, or COD.' },
    ],
    weAcceptTitle: 'We Accept',
    followUsSocial: 'Follow Us on Social Media',
    chatOnWhatsApp: 'Chat on WhatsApp',
    forCallLabel: 'For call:',
    howToCreateAccount: 'How to Create an Account',
    happyCustomers: 'Happy Customers',
    inBagLabel: 'In Bag',
    allPrices: 'All Prices',
    clearFilter: 'Clear',
    noMatches: 'No sarees matched this selection',
    resetFilters: 'Reset Filters & Show All Sarees',
    show20PlusReviews: 'Show 20+ Reviews',
    allReviewsLabel: 'All Reviews',
    positiveReviewsLabel: 'Positive',
    constructiveFeedbackLabel: 'Constructive Feedback',
    verifiedReviewsLabel: 'Verified Reviews',
    ratingBreakdownLabel: 'Rating Breakdown',
    boutiqueCareNoteLabel: 'Boutique Care Note',
    trustItems: [
      { title: 'Handpicked Loom Selection', desc: 'Checked for zari finish & clean pleat fall.' },
      { title: 'Blouse Piece Included', desc: 'Matching 0.85m–0.9m blouse piece with every saree.' },
      { title: 'Free Shipping ₹1,999+ & COD', desc: 'Express India dispatch & Cash on Delivery.' },
      { title: 'Heritage Silk Studio', desc: '12 Sample Loom Street, Heritage Market, Sample City – 600001' },
    ],
    quickPrompts: [
      'Best silk saree under ₹3,500?',
      'Free shipping & COD details?',
      'Showroom address & timings?',
    ],
    categories: {
      'Kanchipuram Silks': 'Kanchipuram Silks',
      'Banarasi & Soft Silks': 'Banarasi & Soft Silks',
      'Cotton & Maheshwari': 'Cotton & Maheshwari',
      'Tissue Linen': 'Tissue Linen',
      'Ready-Made Blouses': 'Ready-Made Blouses',
      'Bridal & Gift Combos': 'Bridal & Gift Combos',
    },
  },
  ta: {
    menu: 'மெனு',
    searchPlaceholder: 'நீங்கள் எதைத் தேடுகிறீர்கள்?',
    allSarees: 'அனைத்து புடவைகள்',
    wishlist: 'விருப்பப் பட்டியல்',
    account: 'கணக்கு',
    bag: 'பை',
    heroTitle: 'கைதேர்ந்த பாரம்பரிய பட்டு மற்றும் கைத்தறி புடவைகள்.',
    shopSarees: 'புடவைகள் பார்க்க',
    bridalCombos: 'மணமகள் & பரிசுத் தொகுப்பு',
    igFavoritesTitle: 'இன்ஸ்டாகிராம் விருப்பங்கள்',
    tapToShop: 'வாங்க தட்டவும்',
    shopLook: 'இதை வாங்க',
    shopByCategory: 'பிரிவு வாரியாக',
    curatedCollection: 'சிறப்புத் தொகுப்பு',
    bestSellers: 'அதிகம் விற்பனையானவை',
    freshOffLoom: 'புதிய நெசவு',
    newArrivals: 'புதிய வரவுகள்',
    addToCart: 'பையில் சேர்',
    addToBag: 'பையில் சேர்க்கவும்',
    moveToBag: 'பைக்கு மாற்று',
    remove: 'நீக்கு',
    promoEyebrow: 'விழாக்கால சலுகைகள்',
    promoHeading: '₹3,999+ மீது 10% தள்ளுபடி (KORA10) · ₹6,999+ மீது 15% (TROUSSEAU15)',
    applyOffer: 'KORA10 பயன்படுத்து',
    customerReviews: 'வாடிக்கையாளர் கருத்துக்கள்',
    supportBadge: 'வாடிக்கையாளர் உதவி',
    supportPrompt: 'ஆர்டர் செய்ய சந்தேகம் அல்லது உதவி தேவையா? உங்கள் மொபைல் எண்ணை உள்ளிடவும், எங்கள் கடை குழு உங்களைத் தொடர்பு கொள்ளும்.',
    mobilePlaceholder: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
    requestCallback: 'அழைப்பு கோரவும்',
    callbackConfirmed: 'அழைப்பு பதிவு செய்யப்பட்டது:',
    edit: 'மாற்று',
    shopSareesHeading: 'புடவை வகைகள்',
    exploreStoreHeading: 'விரைவு இணைப்புகள்',
    showroomContactHeading: 'கடை முகவரி & தொடர்பு',
    shippingPaymentsHeading: 'டெலிவரி & கட்டணம்',
    freeDeliveryLine: '₹1,999+ ஆர்டர்களுக்கு இலவச டெலிவரி',
    exchangeLine: '7-நாள் மாற்று ஆதரவு',
    paymentMethodsLine: 'UPI · கார்டுகள் · நெட்பேங்கிங் · COD',
    hoursLine: 'திங்கள்–சனி · காலை 10:00 – இரவு 8:30',
    tagline: 'கைதேர்ந்த பிரீமியம் புடவைகள்',
    home: 'முகப்பு',
    weaves: 'வகைகள்',
    signIn: 'உள்நுழை',
    signOut: 'வெளியேறு',
    drapeOption: 'பிளவுஸ் / தேர்வு',
    weaveLabel: 'நெசவு:',
    bagEmpty: 'உங்கள் புடவை பை காலியாக உள்ளது',
    bagEmptyDesc: 'காஞ்சிபுரம் பட்டு, பனாரசி மற்றும் மகேஸ்வரி புடவைகளைத் தேர்ந்தெடுக்கவும்.',
    exploreSarees: 'புடவைகளைப் பார்க்க',
    subtotal: 'மொத்தம்',
    shippingLabel: 'டெலிவரி கட்டணம்',
    totalPayable: 'செலுத்த வேண்டிய தொகை',
    proceedCheckout: 'விரைவு ஆர்டருக்குச் செல்லவும்',
    expressCheckout: 'விரைவு செக்கவுட்',
    editBag: 'பையைத் திருத்து',
    placeOrder: 'ஆர்டர் செய்',
    continueBrowsing: 'தொடர்ந்து பார்க்கவும்',
    upiCard: 'UPI / கார்டு',
    codLabel: 'பணம் டெலிவரி (COD)',
    noSavedSarees: 'சேமிக்கப்பட்ட புடவைகள் இல்லை',
    noSavedSareesDesc: 'உங்கள் விருப்பப் பட்டியலில் சேர்க்க எந்தப் புடவையிலும் இதய ஐகானைத் தட்டவும்.',
    expressOtpTitle: 'விரைவு OTP உள்நுழைவு',
    otpPrompt: 'விரைவான ஆர்டர் மற்றும் கடை தகவல்களுக்கு உங்கள் மொபைல் எண்ணுடன் உள்நுழையவும்.',
    continueOtp: 'OTP உடன் தொடரவும்',
    chatbotTitle: 'கோரா & லூம் உதவி மையம்',
    chatbotSubtitle: 'பல மொழி AI புடவை வழிகாட்டி',
    chatbotGreeting: 'வணக்கம்! காஞ்சிபுரம் பட்டு, விலை, பிளவுஸ் அளவுகள் அல்லது டெலிவரி பற்றி கேட்கலாம்.',
    chatbotTyping: 'தட்டச்சு செய்கிறது...',
    chatbotPlaceholder: 'புடவை, விலை அல்லது டெலிவரி பற்றி கேளுங்கள்...',
    helpLabel: 'Help',
    languageLabel: 'மொழி',
    backToTop: 'மேலே செல்ல',
    scrollToBottom: 'கீழே செல்ல',
    viewMore: 'மேலும் பார்க்க',
    showMore: 'மேலும் காட்டு',
    showLess: 'சுருக்கமாக',
    viewAllCollections: 'அனைத்து தொகுப்புகள்',
    customerCareTitle: 'வாடிக்கையாளர் சேவை தொடர்பு விவரம்',
    careHelplineLabel: 'WhatsApp & ஆர்டர் உதவி',
    careHoursNote: 'திங்கள்–சனி · 10:00 AM – 8:30 PM IST (2 மணி நேரத்தில் பதில்)',
    careExchangeNote: 'ஆர்டர் உதவி, மணமகள் தேர்வு & 7-நாள் மாற்று சேவை',
    howToOrderTitle: 'ஆர்டர் செய்வது எப்படி',
    howToOrderSubtitle: 'தேடல் முதல் கட்டணம் வரை 6 எளிய படிகளில் புடவை ஆர்டர் செய்யும் முறை',
    howToOrderStartShopping: 'புடவைகள் வாங்கத் தொடங்குங்கள்',
    howToOrderSteps: [
      { title: 'புடவைகளைத் தேடு அல்லது பார்வையிடு', desc: 'தேடல் பெட்டி அல்லது பிரிவு வழியாகப் புடவையைத் தேர்ந்தெடுக்கவும்.' },
      { title: 'புடவையைத் தேர்வு செய்க', desc: 'புகைப்படம், நெசவு விவரம் மற்றும் பிளவுஸ் அளவைப் பார்க்கவும்.' },
      { title: 'எண்ணிக்கையை (+ / −) தேர்வு செய்க', desc: 'கார்டிலேயே தேவைப்படும் எண்ணிக்கையைத் தேர்ந்தெடுக்கவும்.' },
      { title: 'பையில் (Cart) சேர்க்கவும்', desc: 'பையில் சேர் என்பதைத் தட்டினால் உடனடியாக பை எண்ணிக்கை உயரும்.' },
      { title: 'சலுகை குறியீட்டைப் பயன்படுத்தவும்', desc: 'பையைத் திறந்து KORA10 அல்லது TROUSSEAU15 குறியீட்டைப் போடவும்.' },
      { title: 'கட்டணம் & ஆர்டர் உறுதி', desc: 'பின்கோடை உள்ளிட்டு G Pay, PhonePe, கார்டு அல்லது COD மூலம் செலுத்தவும்.' },
    ],
    weAcceptTitle: 'ஏற்கப்படும் கட்டண முறைகள்',
    followUsSocial: 'சமூக வலைதளத்தில் பின்தொடரவும்',
    chatOnWhatsApp: 'WhatsApp-இல் பேசவும்',
    forCallLabel: 'அழைப்புக்கு:',
    howToCreateAccount: 'கணக்கு உருவாக்குவது எப்படி',
    happyCustomers: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
    inBagLabel: 'பையில்',
    allPrices: 'அனைத்து விலைகள்',
    clearFilter: 'நீக்கு',
    noMatches: 'இந்தத் தேர்வில் புடவைகள் இல்லை',
    resetFilters: 'அனைத்து புடவைகளையும் காட்டு',
    show20PlusReviews: '20+ கருத்துக்களைக் காட்டு',
    allReviewsLabel: 'அனைத்தும்',
    positiveReviewsLabel: 'நேர்மறை',
    constructiveFeedbackLabel: 'ஆக்கபூர்வ கருத்து',
    verifiedReviewsLabel: 'சரிபார்க்கப்பட்ட கருத்துக்கள்',
    ratingBreakdownLabel: 'மதிப்பீட்டு விவரம்',
    boutiqueCareNoteLabel: 'கடையின் பதில்',
    trustItems: [
      { title: 'கைதேர்ந்த தரமான நெசவு', desc: 'சரி வேலைப்பாடு மற்றும் மடிப்பு நேர்த்தி பரிசோதிக்கப்பட்டது.' },
      { title: 'பிளவுஸ் துணி அடங்கும்', desc: 'ஒவ்வொரு புடவையுடனும் பொருத்தமான 0.85m–0.9m பிளவுஸ் துணி.' },
      { title: '₹1,999+ இலவச டெலிவரி & COD', desc: 'இந்தியா முழுவதும் விரைவு அனுப்புதல் & COD வசதி.' },
      { title: 'பாரம்பரிய கைத்தறி மையம்', desc: '12 சாம்பிள் லூம் தெரு, ஹெரிடேஜ் மார்க்கெட் – 600001' },
    ],
    quickPrompts: [
      '₹3,500-க்குள் சிறந்த பட்டு புடவை?',
      'இலவச டெலிவரி & COD விவரம்?',
      'கடை முகவரி & நேரம்?',
    ],
    categories: {
      'Kanchipuram Silks': 'காஞ்சிபுரம் பட்டு',
      'Banarasi & Soft Silks': 'பனாரசி & சாஃப்ட் சில்க்',
      'Cotton & Maheshwari': 'காட்டன் & மகேஸ்வரி',
      'Tissue Linen': 'டிஷ்யூ லினன்',
      'Ready-Made Blouses': 'ரெடிமேட் பிளவுஸ்',
      'Bridal & Gift Combos': 'மணமகள் & பரிசுத் தொகுப்பு',
    },
  },
  hi: {
    menu: 'मेनू',
    searchPlaceholder: 'आप क्या खोज रहे हैं?',
    allSarees: 'सभी साड़ियाँ',
    wishlist: 'पसंद',
    account: 'खाता',
    bag: 'बैग',
    heroTitle: 'चुनिंदा पारंपरिक साड़ियाँ, सहज और शाही ड्रेप के लिए।',
    shopSarees: 'साड़ियाँ देखें',
    bridalCombos: 'ब्राइडल और गिफ्ट कॉम्बो',
    igFavoritesTitle: 'इंस्टाग्राम पसंदीदा',
    tapToShop: 'खरीदने के लिए टैप करें',
    shopLook: 'अभी खरीदें',
    shopByCategory: 'श्रेणी के अनुसार खरीदें',
    curatedCollection: 'विशेष संग्रह',
    bestSellers: 'बेस्ट सेलर्स',
    freshOffLoom: 'लूम से ताज़ा',
    newArrivals: 'नए आगमन',
    addToCart: 'कार्ट में जोड़ें',
    addToBag: 'बैग में जोड़ें',
    moveToBag: 'बैग में ले जाएँ',
    remove: 'हटाएँ',
    promoEyebrow: 'त्योहारी छूट',
    promoHeading: '₹3,999+ पर 10% छूट (KORA10) · ₹6,999+ पर 15% (TROUSSEAU15)',
    applyOffer: 'KORA10 लगाएँ',
    customerReviews: 'ग्राहक समीक्षाएँ',
    supportBadge: 'ग्राहक सहायता',
    supportPrompt: 'ऑर्डर करने में मदद चाहिए या कोई सवाल है? अपना मोबाइल नंबर दर्ज करें, हमारी दुकान टीम आपसे संपर्क करेगी।',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    requestCallback: 'कॉल बैक मांगें',
    callbackConfirmed: 'कॉल बैक अनुरोधित:',
    edit: 'बदलें',
    shopSareesHeading: 'साड़ी श्रेणियाँ',
    exploreStoreHeading: 'स्टोर देखें',
    showroomContactHeading: 'शोरूम और संपर्क',
    shippingPaymentsHeading: 'शिपिंग और भुगतान',
    freeDeliveryLine: '₹1,999+ के ऑर्डर पर मुफ़्त डिलीवरी',
    exchangeLine: '7-दिन का एक्सचेंज सपोर्ट',
    paymentMethodsLine: 'UPI · कार्ड · नेटबैंकिंग · कैश ऑन डिलीवरी',
    hoursLine: 'सोम–शनि · सुबह 10:00 – रात 8:30',
    tagline: 'चुनिंदा प्रीमियम साड़ियाँ',
    home: 'होम',
    weaves: 'श्रेणियाँ',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    drapeOption: 'ड्रेप / पैक विकल्प',
    weaveLabel: 'बुनाई:',
    bagEmpty: 'आपका साड़ी बैग खाली है',
    bagEmptyDesc: 'चुनिंदा कांजीवरम सिल्क, बनारसी और माहेश्वरी साड़ियाँ देखें।',
    exploreSarees: 'साड़ियाँ देखें',
    subtotal: 'उप-योग',
    shippingLabel: 'डिलीवरी शुल्क',
    totalPayable: 'कुल देय राशि',
    proceedCheckout: 'एक्सप्रेस चेकआउट पर जाएँ',
    expressCheckout: 'एक्सप्रेस गेस्ट चेकआउट',
    editBag: 'बैग संपादित करें',
    placeOrder: 'ऑर्डर करें',
    continueBrowsing: 'ब्राउज़िंग जारी रखें',
    upiCard: 'UPI / कार्ड',
    codLabel: 'कैश ऑन डिलीवरी',
    noSavedSarees: 'अभी कोई साड़ी सेव नहीं है',
    noSavedSareesDesc: 'अपनी पसंदीदा साड़ियाँ सेव करने के लिए दिल वाले आइकन पर टैप करें।',
    expressOtpTitle: 'एक्सप्रेस OTP साइन इन',
    otpPrompt: 'तेज़ चेकआउट और अपडेट के लिए अपने मोबाइल नंबर से साइन इन करें।',
    continueOtp: 'मोबाइल OTP से जारी रखें',
    chatbotTitle: 'कोरा एंड लूम स्टाइल असिस्टेंट',
    chatbotSubtitle: 'बहुभाषी AI साड़ी सहायता',
    chatbotGreeting: 'नमस्ते! कांजीवरम सिल्क, कीमत, ब्लाउज, COD या ऑर्डर में मदद के लिए पूछें।',
    chatbotTyping: 'लिख रहा है...',
    chatbotPlaceholder: 'साड़ी, कीमत या डिलीवरी के बारे में पूछें...',
    helpLabel: 'Help',
    languageLabel: 'भाषा',
    backToTop: 'ऊपर जाएँ',
    scrollToBottom: 'नीचे जाएँ',
    viewMore: 'और देखें',
    showMore: 'और दिखाएँ',
    showLess: 'कम दिखाएँ',
    viewAllCollections: 'सभी कलेक्शन देखें',
    customerCareTitle: 'कस्टमर केयर संपर्क विवरण',
    careHelplineLabel: 'WhatsApp व ऑर्डर सहायता',
    careHoursNote: 'सोम–शनि · 10:00 AM – 8:30 PM IST (2 घंटे में उत्तर)',
    careExchangeNote: 'ऑर्डर सहायता, ब्राइडल स्टाइलिंग व 7-दिन एक्सचेंज डेस्क',
    howToOrderTitle: 'ऑर्डर कैसे करें',
    howToOrderSubtitle: 'खोज और साड़ी चुनने से लेकर भुगतान तक 6 आसान चरण देखें',
    howToOrderStartShopping: 'साड़ियाँ खरीदना शुरू करें',
    howToOrderSteps: [
      { title: 'साड़ियाँ खोजें या ब्राउज़ करें', desc: 'सर्च बार या श्रेणी से अपनी पसंदीदा साड़ी खोजें।' },
      { title: 'प्रोडक्ट चुनें', desc: 'फ़ोटो, बुनाई विवरण और ब्लाउज की जानकारी देखने के लिए टैप करें।' },
      { title: 'मात्रा (+ / −) चुनें', desc: 'कार्ड पर ही + या − दबाकर संख्या चुनें।' },
      { title: 'कार्ट में जोड़ें', desc: 'Add to Cart दबाएँ और बैग काउंट अपडेट होते देखें।' },
      { title: 'ऑफर लागू करें', desc: 'बैग खोलें और KORA10 या TROUSSEAU15 कोड लगाएँ।' },
      { title: 'पेमेंट और कन्फ़र्मेशन', desc: 'पिनकोड दर्ज करें और G Pay, PhonePe, कार्ड या COD से भुगतान करें।' },
    ],
    weAcceptTitle: 'हम स्वीकार करते हैं',
    followUsSocial: 'सोशल मीडिया पर फ़ॉलो करें',
    chatOnWhatsApp: 'WhatsApp पर चैट करें',
    forCallLabel: 'कॉल के लिए:',
    howToCreateAccount: 'अकाउंट कैसे बनाएँ',
    happyCustomers: 'संतुष्ट ग्राहक',
    inBagLabel: 'बैग में',
    allPrices: 'सभी कीमतें',
    clearFilter: 'हटाएँ',
    noMatches: 'इस चयन में कोई साड़ी नहीं मिली',
    resetFilters: 'सभी साड़ियाँ दिखाएँ',
    show20PlusReviews: '20+ समीक्षाएँ देखें',
    allReviewsLabel: 'सभी',
    positiveReviewsLabel: 'सकारात्मक',
    constructiveFeedbackLabel: 'सुधारात्मक सुझाव',
    verifiedReviewsLabel: 'सत्यापित समीक्षाएँ',
    ratingBreakdownLabel: 'रेटिंग विवरण',
    boutiqueCareNoteLabel: 'स्टोर प्रतिक्रिया',
    trustItems: [
      { title: 'चुनिंदा लूम क्वालिटी', desc: 'ज़री और प्लीट फिनिश के लिए व्यक्तिगत जांच।' },
      { title: 'ब्लाउज पीस शामिल', desc: 'हर साड़ी के साथ मैचिंग 0.85m–0.9m ब्लाउज पीस।' },
      { title: '₹1,999+ मुफ़्त शिपिंग व COD', desc: 'पूरे भारत में तेज़ डिलीवरी और कैश ऑन डिलीवरी।' },
      { title: 'हेरिटेज सिल्क स्टूडियो', desc: '12 सैंपल लूम स्ट्रीट, हेरिटेज मार्केट – 600001' },
    ],
    quickPrompts: [
      '₹3,500 से कम में बेस्ट सिल्क साड़ी?',
      'मुफ़्त शिपिंग और COD जानकारी?',
      'शोरूम का पता और समय?',
    ],
    categories: {
      'Kanchipuram Silks': 'कांजीवरम सिल्क',
      'Banarasi & Soft Silks': 'बनारसी व सॉफ्ट सिल्क',
      'Cotton & Maheshwari': 'कॉटन व माहेश्वरी',
      'Tissue Linen': 'टिशू लिनन',
      'Ready-Made Blouses': 'रेडीमेड ब्लाउज',
      'Bridal & Gift Combos': 'ब्राइडल व गिफ्ट कॉम्बो',
    },
  },
  ml: {
    menu: 'മെനു',
    searchPlaceholder: 'നിങ്ങൾ എന്താണ് തിരയുന്നത്?',
    allSarees: 'എല്ലാ സാരികളും',
    wishlist: 'വിഷ്‌ലിസ്റ്റ്',
    account: 'അക്കൗണ്ട്',
    bag: 'ബാഗ്',
    heroTitle: 'തിരഞ്ഞെടുത്ത പൈതൃക സാരികൾ, മനോഹരമായ ഡ്രേപ്പിനായി.',
    shopSarees: 'സാരികൾ കാണുക',
    bridalCombos: 'ബ്രൈഡൽ & ഗിഫ്റ്റ് സെറ്റുകൾ',
    igFavoritesTitle: 'ഇൻസ്റ്റാഗ്രാം പ്രിയപ്പെട്ടവ',
    tapToShop: 'വാങ്ങാൻ ടാപ്പ് ചെയ്യുക',
    shopLook: 'ഈ ലുക്ക് വാങ്ങുക',
    shopByCategory: 'വിഭാഗം അനുസരിച്ച്',
    curatedCollection: 'പ്രത്യേക ശേഖരം',
    bestSellers: 'ഏറ്റവും കൂടുതൽ വിറ്റഴിക്കപ്പെടുന്നവ',
    freshOffLoom: 'ലൂമിൽ നിന്ന് പുതിയവ',
    newArrivals: 'പുതിയ ശേഖരം',
    addToCart: 'കാർട്ടിലേക്ക്',
    addToBag: 'ബാഗിലേക്ക് ചേർക്കുക',
    moveToBag: 'ബാഗിലേക്ക് മാറ്റുക',
    remove: 'നീക്കുക',
    promoEyebrow: 'ഉത്സവ ഓഫറുകൾ',
    promoHeading: '₹3,999+ ന് 10% കിഴിവ് (KORA10) · ₹6,999+ ന് 15% (TROUSSEAU15)',
    applyOffer: 'KORA10 ഉപയോഗിക്കുക',
    customerReviews: 'ഉപഭോക്തൃ അഭിപ്രായങ്ങൾ',
    supportBadge: 'കസ്റ്റമർ സപ്പോർട്ട്',
    supportPrompt: 'ഓർഡർ ചെയ്യാൻ സഹായം വേണോ? നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക, ഞങ്ങളുടെ ടീം നിങ്ങളെ ബന്ധപ്പെടും.',
    mobilePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക',
    requestCallback: 'കോൾ ബാക്ക് ആവശ്യപ്പെടുക',
    callbackConfirmed: 'കോൾ ബാക്ക് രജിസ്റ്റർ ചെയ്തു:',
    edit: 'മാറ്റുക',
    shopSareesHeading: 'സാരി വിഭാഗങ്ങൾ',
    exploreStoreHeading: 'സ്റ്റോർ ലിങ്കുകൾ',
    showroomContactHeading: 'ഷോറൂം & വിലാസം',
    shippingPaymentsHeading: 'ഡെലിവറി & പേയ്‌മെന്റ്',
    freeDeliveryLine: '₹1,999+ ഓർഡറുകൾക്ക് സൗജന്യ ഡെലിവറി',
    exchangeLine: '7 ദിവസത്തെ എക്സ്ചേഞ്ച് പിന്തുണ',
    paymentMethodsLine: 'UPI · കാർഡുകൾ · നെറ്റ്ബാങ്കിംഗ് · COD',
    hoursLine: 'തിങ്കൾ–ശനി · 10:00 AM – 8:30 PM',
    tagline: 'തിരഞ്ഞെടുത്ത പ്രീമിയം സാരികൾ',
    home: 'ഹോം',
    weaves: 'വിഭാഗങ്ങൾ',
    signIn: 'സൈൻ ഇൻ',
    signOut: 'സൈൻ ഔട്ട്',
    drapeOption: 'ഡ്രേപ്പ് / പാക്ക് ഓപ്ഷൻ',
    weaveLabel: 'നെയ്ത്ത്:',
    bagEmpty: 'നിങ്ങളുടെ സാരി ബാഗ് ശൂന്യമാണ്',
    bagEmptyDesc: 'കാഞ്ചീപുരം പട്ട്, ബനാറസി, മഹേശ്വരി സാരികൾ കാണുക.',
    exploreSarees: 'സാരികൾ കാണുക',
    subtotal: 'ആകെ തുക',
    shippingLabel: 'ഡെലിവറി',
    totalPayable: 'ആകെ നൽകേണ്ടത്',
    proceedCheckout: 'എക്സ്പ്രസ് ചെക്കൗട്ടിലേക്ക്',
    expressCheckout: 'എക്സ്പ്രസ് ചെക്കൗട്ട്',
    editBag: 'ബാഗ് തിരുത്തുക',
    placeOrder: 'ഓർഡർ ചെയ്യുക',
    continueBrowsing: 'ബ്രൗസിംഗ് തുടരുക',
    upiCard: 'UPI / കാർഡ്',
    codLabel: 'ക്യാഷ് ഓൺ ഡെലിവറി',
    noSavedSarees: 'സേവ് ചെയ്ത സാരികളില്ല',
    noSavedSareesDesc: 'വിഷ്‌ലിസ്റ്റിൽ ചേർക്കാൻ ഹാർട്ട് ഐക്കണിൽ ടാപ്പ് ചെയ്യുക.',
    expressOtpTitle: 'എക്സ്പ്രസ് OTP സൈൻ ഇൻ',
    otpPrompt: 'വേഗത്തിലുള്ള ചെക്കൗട്ടിനായി മൊബൈൽ നമ്പർ ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.',
    continueOtp: 'മൊബൈൽ OTP ഉപയോഗിച്ച് തുടരുക',
    chatbotTitle: 'കോറ & ലൂം സ്റ്റൈൽ അസിസ്റ്റന്റ്',
    chatbotSubtitle: 'ബഹുഭാഷാ AI സാരി സഹായം',
    chatbotGreeting: 'നമസ്കാരം! കാഞ്ചീപുരം പട്ട്, വില, ബ്ലൗസ്, COD എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.',
    chatbotTyping: 'ടൈപ്പ് ചെയ്യുന്നു...',
    chatbotPlaceholder: 'സാരികൾ, ഡെലിവറി അല്ലെങ്കിൽ ഓഫറുകൾ ചോദിക്കൂ...',
    helpLabel: 'Help',
    languageLabel: 'ഭാഷ',
    backToTop: 'മുകളിലേക്ക്',
    scrollToBottom: 'താഴേക്ക്',
    viewMore: 'കൂടുതൽ കാണുക',
    showMore: 'കൂടുതൽ കാണിക്കുക',
    showLess: 'കുറച്ച് കാണിക്കുക',
    viewAllCollections: 'എല്ലാ കളക്ഷനുകളും കാണുക',
    customerCareTitle: 'കസ്റ്റമർ കെയർ കോൺടാക്റ്റ് വിവരങ്ങൾ',
    careHelplineLabel: 'WhatsApp & ഓർഡർ സഹായം',
    careHoursNote: 'തിങ്കൾ–ശനി · 10:00 AM – 8:30 PM IST (2 മണിക്കൂറിനുള്ളിൽ മറുപടി)',
    careExchangeNote: 'ഓർഡർ സഹായം, ബ്രൈഡൽ സ്റ്റൈലിംഗ് & 7-ദിവസ എക്സ്ചേഞ്ച്',
    howToOrderTitle: 'എങ്ങനെ ഓർഡർ ചെയ്യാം',
    howToOrderSubtitle: 'തിരയൽ മുതൽ പണമടയ്ക്കൽ വരെ 6 ലളിത ഘട്ടങ്ങൾ കാണുക',
    howToOrderStartShopping: 'ഷോപ്പിംഗ് തുടങ്ങുക',
    howToOrderSteps: [
      { title: 'സാരികൾ തിരയുക / കാണുക', desc: 'സെർച്ച് ബാറിലോ വിഭാഗങ്ങളിലോ സാരി തിരഞ്ഞെടുക്കുക.' },
      { title: 'ഉൽപ്പന്നം തിരഞ്ഞെടുക്കുക', desc: 'ഫോട്ടോ, നെയ്ത്ത്, ബ്ലൗസ് വിവരങ്ങൾ കാണാൻ സാരിയിൽ ടാപ്പ് ചെയ്യുക.' },
      { title: 'എണ്ണം (+ / −) തിരഞ്ഞെടുക്കുക', desc: 'കാർഡിൽ തന്നെ + / − അമർത്തി എണ്ണം ക്രമീകരിക്കുക.' },
      { title: 'കാർട്ടിലേക്ക് ചേർക്കുക', desc: 'Add to Cart അമർത്തി ബാഗ് എണ്ണം കൂടുന്നത് കാണുക.' },
      { title: 'ഓഫർ പ്രയോഗിക്കുക', desc: 'ബാഗ് തുറന്ന് KORA10 അല്ലെങ്കിൽ TROUSSEAU15 നൽകുക.' },
      { title: 'പേയ്‌മെന്റ് പൂർത്തിയാക്കുക', desc: 'പിൻകോഡ് നൽകി G Pay, PhonePe, കാർഡ് അല്ലെങ്കിൽ COD തിരഞ്ഞെടുക്കുക.' },
    ],
    weAcceptTitle: 'ഞങ്ങൾ സ്വീകരിക്കുന്നത്',
    followUsSocial: 'സോഷ്യൽ മീഡിയയിൽ പിന്തുടരുക',
    chatOnWhatsApp: 'WhatsApp-ൽ ചാറ്റ് ചെയ്യുക',
    forCallLabel: 'കോളിനായി:',
    howToCreateAccount: 'അക്കൗണ്ട് എങ്ങനെ തുടങ്ങാം',
    happyCustomers: 'സന്തുഷ്ടരായ ഉപഭോക്താക്കൾ',
    inBagLabel: 'ബാഗിൽ',
    allPrices: 'എല്ലാ വിലകളും',
    clearFilter: 'നീക്കുക',
    noMatches: 'ഈ വിഭാഗത്തിൽ സാരികൾ ലഭ്യമല്ല',
    resetFilters: 'എല്ലാ സാരികളും കാണിക്കുക',
    show20PlusReviews: '20+ അഭിപ്രായങ്ങൾ കാണിക്കുക',
    allReviewsLabel: 'എല്ലാം',
    positiveReviewsLabel: 'അനുകൂലം',
    constructiveFeedbackLabel: 'നിർദ്ദേശങ്ങൾ',
    verifiedReviewsLabel: 'പരിശോധിച്ച അഭിപ്രായങ്ങൾ',
    ratingBreakdownLabel: 'റേറ്റിംഗ് വിവരണം',
    boutiqueCareNoteLabel: 'ബോട്ടിക് കുറിപ്പ്',
    trustItems: [
      { title: 'തിരഞ്ഞെടുത്ത നെയ്ത്ത്', desc: 'സരി ഫിനിഷും ഡ്രേപ്പും പരിശോധിച്ച സാരികൾ.' },
      { title: 'ബ്ലൗസ് പീസ് ഉൾപ്പെടെ', desc: 'ഓരോ സാരിക്കൊപ്പവും 0.85m–0.9m ബ്ലൗസ് പീസ്.' },
      { title: '₹1,999+ സൗജന്യ ഷിപ്പിംഗ് & COD', desc: 'ഇന്ത്യയിലുടനീളം വേഗത്തിലുള്ള ഡെലിവറിയും COD-യും.' },
      { title: 'ഹെറിറ്റേജ് സിൽക്ക് സ്റ്റുഡിയോ', desc: '12 സാമ്പിൾ ലൂം സ്ട്രീറ്റ്, ഹെറിറ്റേജ് മാർക്കറ്റ് – 600001' },
    ],
    quickPrompts: [
      '₹3,500-ൽ താഴെയുള്ള മികച്ച പട്ടുസാരി?',
      'സൗജന്യ ഡെലിവറി & COD വിവരങ്ങൾ?',
      'ഷോറൂം വിലാസവും സമയവും?',
    ],
    categories: {
      'Kanchipuram Silks': 'കാഞ്ചീപുരം സിൽക്ക്',
      'Banarasi & Soft Silks': 'ബനാറസി & സോഫ്റ്റ് സിൽക്ക്',
      'Cotton & Maheshwari': 'കോട്ടൺ & മഹേശ്വരി',
      'Tissue Linen': 'ടിഷ്യൂ ലിനൻ',
      'Ready-Made Blouses': 'റെഡിമെയ്ഡ് ബ്ലൗസുകൾ',
      'Bridal & Gift Combos': 'ബ്രൈഡൽ & ഗിഫ്റ്റ് സെറ്റ്',
    },
  },
  te: {
    menu: 'మెనూ',
    searchPlaceholder: 'మీరు ఏమి వెతుకుతున్నారు?',
    allSarees: 'అన్ని చీరలు',
    wishlist: 'విష్‌లిస్ట్',
    account: 'ఖాతా',
    bag: 'బ్యాగ్',
    heroTitle: 'సులభమైన కట్టు కోసం ఎంచుకున్న సంప్రదాయ పట్టు చీరలు.',
    shopSarees: 'చీరలు చూడండి',
    bridalCombos: 'బ్రైడల్ & గిఫ్ట్ కాంబోలు',
    igFavoritesTitle: 'ఇన్‌స్టాగ్రామ్ ఫేవరెట్స్',
    tapToShop: 'కొనడానికి ట్యాప్ చేయండి',
    shopLook: 'ఈ లుక్ కొనండి',
    shopByCategory: 'కేటగిరీ ద్వారా కొనండి',
    curatedCollection: 'ప్రత్యేక సేకరణ',
    bestSellers: 'బెస్ట్ సెల్లర్స్',
    freshOffLoom: 'నేత నుండి తాజాగా',
    newArrivals: 'కొత్త కలెక్షన్',
    addToCart: 'కార్ట్‌లో వేయండి',
    addToBag: 'బ్యాగ్‌లో వేయండి',
    moveToBag: 'బ్యాగ్‌కు మార్చండి',
    remove: 'తొలగించు',
    promoEyebrow: 'పండుగ ఆఫర్లు',
    promoHeading: '₹3,999+ పై 10% తగ్గింపు (KORA10) · ₹6,999+ పై 15% (TROUSSEAU15)',
    applyOffer: 'KORA10 వర్తించండి',
    customerReviews: 'కస్టమర్ రివ్యూలు',
    supportBadge: 'కస్టమర్ సపోర్ట్',
    supportPrompt: 'ఆర్డర్ చేయడంలో సహాయం కావాలా? మీ మొబైల్ నంబర్ నమోదు చేయండి, మా షాప్ టీమ్ మిమ్మల్ని సంప్రదిస్తుంది.',
    mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
    requestCallback: 'కాల్ బ్యాక్ కోరండి',
    callbackConfirmed: 'కాల్ బ్యాక్ నమోదు అయింది:',
    edit: 'మార్చు',
    shopSareesHeading: 'చీర రకాలు',
    exploreStoreHeading: 'స్టోర్ లింకులు',
    showroomContactHeading: 'షోరూమ్ & సంప్రదింపు',
    shippingPaymentsHeading: 'షిప్పింగ్ & చెల్లింపులు',
    freeDeliveryLine: '₹1,999+ ఆర్డర్లపై ఉచిత డెలివరీ',
    exchangeLine: '7 రోజుల మార్పిడి సౌకర్యం',
    paymentMethodsLine: 'UPI · కార్డులు · నెట్‌బ్యాంకింగ్ · COD',
    hoursLine: 'సోమ–శని · 10:00 AM – 8:30 PM IST',
    tagline: 'ఎంచుకున్న ప్రీమియం చీరలు',
    home: 'హోమ్',
    weaves: 'రకాలు',
    signIn: 'సైన్ ఇన్',
    signOut: 'సైన్ అవుట్',
    drapeOption: 'డ్రేప్ / ప్యాక్ ఎంపిక',
    weaveLabel: 'నేత:',
    bagEmpty: 'మీ చీరల బ్యాగ్ ఖాళీగా ఉంది',
    bagEmptyDesc: 'కంచి పట్టు, బనారసి మరియు మహేశ్వరి చీరలను చూడండి.',
    exploreSarees: 'చీరలు చూడండి',
    subtotal: 'సబ్‌టోటల్',
    shippingLabel: 'డెలివరీ',
    totalPayable: 'చెల్లించాల్సిన మొత్తం',
    proceedCheckout: 'ఎక్స్‌ప్రెస్ చెకౌట్‌కు వెళ్లండి',
    expressCheckout: 'ఎక్స్‌ప్రెస్ గెస్ట్ చెకౌట్',
    editBag: 'బ్యాగ్ మార్చండి',
    placeOrder: 'ఆర్డర్ చేయండి',
    continueBrowsing: 'బ్రౌజింగ్ కొనసాగించండి',
    upiCard: 'UPI / కార్డ్',
    codLabel: 'క్యాష్ ఆన్ డెలివరీ',
    noSavedSarees: 'సేవ్ చేసిన చీరలు లేవు',
    noSavedSareesDesc: 'విష్‌లిస్ట్‌లో సేవ్ చేయడానికి హార్ట్ ఐకాన్ పై నొక్కండి.',
    expressOtpTitle: 'ఎక్స్‌ప్రెస్ OTP సైన్ ఇన్',
    otpPrompt: 'త్వరిత చెకౌట్ కోసం మీ మొబైల్ నంబర్‌తో సైన్ ఇన్ చేయండి.',
    continueOtp: 'మొబైల్ OTPతో కొనసాగండి',
    chatbotTitle: 'కోరా & లూమ్ స్టైల్ అసిస్టెంట్',
    chatbotSubtitle: 'బహుభాషా AI చీరల సహాయం',
    chatbotGreeting: 'నమస్కారం! కంచి పట్టు చీరలు, ధరలు, బ్లౌజ్ వివరాలు లేదా COD గురించి అడగండి.',
    chatbotTyping: 'టైప్ చేస్తోంది...',
    chatbotPlaceholder: 'చీరలు, డెలివరీ లేదా ఆఫర్ల గురించి అడగండి...',
    helpLabel: 'Help',
    languageLabel: 'భాష',
    backToTop: 'పైకి వెళ్ళండి',
    scrollToBottom: 'కిందికి వెళ్ళండి',
    viewMore: 'మరిన్ని చూడండి',
    showMore: 'మరిన్ని చూపించు',
    showLess: 'తక్కువ చూపించు',
    viewAllCollections: 'అన్ని కలెక్షన్లు చూడండి',
    customerCareTitle: 'కస్టమర్ కేర్ సంప్రదింపు వివరాలు',
    careHelplineLabel: 'WhatsApp & ఆర్డర్ సహాయం',
    careHoursNote: 'సోమ–శని · 10:00 AM – 8:30 PM IST (2 గంటల్లో స్పందన)',
    careExchangeNote: 'ఆర్డర్ సహాయం, బ్రైడల్ స్టైలింగ్ & 7-రోజుల ఎక్స్ఛేంజ్ డెస్క్',
    howToOrderTitle: 'ఆర్డర్ చేయడం ఎలా',
    howToOrderSubtitle: 'వెతకడం నుండి చెల్లింపు వరకు 6 వాస్తవిక దశలను చూడండి',
    howToOrderStartShopping: 'షాపింగ్ ప్రారంభించండి',
    howToOrderSteps: [
      { title: 'చీరలు వెతకండి / చూడండి', desc: 'సెర్చ్ బార్ లేదా కేటగిరీ నుండి చీరను ఎంచుకోండి.' },
      { title: 'ప్రొడక్ట్ ఎంచుకోండి', desc: 'ఫోటోలు, నేత మరియు బ్లౌజ్ వివరాలు చూడటానికి ట్యాప్ చేయండి.' },
      { title: 'పరిమాణం (+ / −) ఎంచుకోండి', desc: 'కార్డుపైనే + / − నొక్కి సంఖ్యను సెట్ చేయండి.' },
      { title: 'కార్ట్‌లో వేయండి', desc: 'Add to Cart నొక్కగానే మీ బ్యాగ్ సంఖ్య పెరుగుతుంది.' },
      { title: 'ఆఫర్ వర్తించండి', desc: 'బ్యాగ్ తెరిచి KORA10 లేదా TROUSSEAU15 కోడ్ ఇవ్వండి.' },
      { title: 'చెల్లింపు & ఆర్డర్ కన్ఫర్మ్', desc: 'పిన్‌కోడ్ నమోదు చేసి G Pay, PhonePe, కార్డ్ లేదా COD ద్వారా చెల్లించండి.' },
    ],
    weAcceptTitle: 'మేము అంగీకరించేవి',
    followUsSocial: 'సోషల్ మీడియాలో ఫాలో అవ్వండి',
    chatOnWhatsApp: 'WhatsApp లో చాట్ చేయండి',
    forCallLabel: 'కాల్ కోసం:',
    howToCreateAccount: 'అకౌంట్ ఎలా క్రియేట్ చేయాలి',
    happyCustomers: 'సంతృప్తి చెందిన కస్టమర్లు',
    inBagLabel: 'బ్యాగ్‌లో',
    allPrices: 'అన్ని ధరలు',
    clearFilter: 'తొలగించు',
    noMatches: 'ఈ ఎంపికలో చీరలు లేవు',
    resetFilters: 'అన్ని చీరలు చూపించు',
    show20PlusReviews: '20+ రివ్యూలు చూపించు',
    allReviewsLabel: 'అన్నీ',
    positiveReviewsLabel: 'పాజిటివ్',
    constructiveFeedbackLabel: 'సూచనలు',
    verifiedReviewsLabel: 'ధృవీకరించబడిన రివ్యూలు',
    ratingBreakdownLabel: 'రేటింగ్ వివరాలు',
    boutiqueCareNoteLabel: 'షాప్ స్పందన',
    trustItems: [
      { title: 'ఎంచుకున్న చేనేత నాణ్యత', desc: 'జరీ నాణ్యత మరియు మడత కోసం తనిఖీ చేయబడింది.' },
      { title: 'బ్లౌజ్ పీస్ జతచేయబడింది', desc: 'ప్రతి చీరతో సరిపోయే 0.85m–0.9m బ్లౌజ్ పీస్.' },
      { title: '₹1,999+ ఉచిత షిప్పింగ్ & COD', desc: 'భారతదేశం అంతటా వేగవంతమైన డెలివరీ & COD.' },
      { title: 'హెరిటేజ్ సిల్క్ స్టూడియో', desc: '12 శాంపిల్ లూమ్ స్ట్రీట్, హెరిటేజ్ మార్కెట్ – 600001' },
    ],
    quickPrompts: [
      '₹3,500 లోపు బెస్ట్ పట్టు చీర?',
      'ఉచిత షిప్పింగ్ & COD వివరాలు?',
      'షోరూమ్ చిరునామా & సమయాలు?',
    ],
    categories: {
      'Kanchipuram Silks': 'కంచి పట్టు చీరలు',
      'Banarasi & Soft Silks': 'బనారసి & సాఫ్ట్ సిల్క్',
      'Cotton & Maheshwari': 'కాటన్ & మహేశ్వరి',
      'Tissue Linen': 'టిష్యూ లినెన్',
      'Ready-Made Blouses': 'రెడీమేడ్ బ్లౌజ్‌లు',
      'Bridal & Gift Combos': 'బ్రైడల్ & గిఫ్ట్ కాంబోలు',
    },
  },
  kn: {
    menu: 'ಮೆನು',
    searchPlaceholder: 'ನೀವು ಏನನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ?',
    allSarees: 'ಎಲ್ಲಾ ಸೀರೆಗಳು',
    wishlist: 'ಇಷ್ಟಪಟ್ಟಿ',
    account: 'ಖಾತೆ',
    bag: 'ಬ್ಯಾಗ್',
    heroTitle: 'ಸುಂದರ ಡ್ರೇಪ್‌ಗಾಗಿ ಆಯ್ದ ಪರಂಪರೆಯ ರೇಷ್ಮೆ ಸೀರೆಗಳು.',
    shopSarees: 'ಸೀರೆಗಳನ್ನು ನೋಡಿ',
    bridalCombos: 'ವಧು ಮತ್ತು ಗಿಫ್ಟ್ ಕಾಂಬೊಗಳು',
    igFavoritesTitle: 'ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಮೆಚ್ಚಿನವು',
    tapToShop: 'ಖರೀದಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    shopLook: 'ಈ ಲುಕ್ ಖರೀದಿಸಿ',
    shopByCategory: 'ವರ್ಗದ ಪ್ರಕಾರ ಖರೀದಿಸಿ',
    curatedCollection: 'ವಿಶೇಷ ಸಂಗ್ರಹ',
    bestSellers: 'ಅತಿ ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವವು',
    freshOffLoom: 'ಮಗ್ಗದಿಂದ ತಾಜಾ',
    newArrivals: 'ಹೊಸ ಆಗಮನಗಳು',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    addToBag: 'ಬ್ಯಾಗ್‌ಗೆ ಸೇರಿಸಿ',
    moveToBag: 'ಬ್ಯಾಗ್‌ಗೆ ಸರಿಸಿ',
    remove: 'ತೆಗೆಯಿರಿ',
    promoEyebrow: 'ಹಬ್ಬದ ಉಳಿತಾಯ',
    promoHeading: '₹3,999+ ಮೇಲೆ 10% ರಿಯಾಯಿತಿ (KORA10) · ₹6,999+ ಮೇಲೆ 15% (TROUSSEAU15)',
    applyOffer: 'KORA10 ಬಳಸಿ',
    customerReviews: 'ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು',
    supportBadge: 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
    supportPrompt: 'ಆರ್ಡರ್ ಮಾಡಲು ಸಹಾಯ ಬೇಕೇ? ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ, ನಮ್ಮ ಅಂಗಡಿ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    mobilePlaceholder: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    requestCallback: 'ಕಾಲ್ ಬ್ಯಾಕ್ ವಿನಂತಿಸಿ',
    callbackConfirmed: 'ಕಾಲ್ ಬ್ಯಾಕ್ ನೋಂದಾಯಿಸಲಾಗಿದೆ:',
    edit: 'ಬದಲಾಯಿಸಿ',
    shopSareesHeading: 'ಸೀರೆ ವಿಭಾಗಗಳು',
    exploreStoreHeading: 'ಸ್ಟೋರ್ ಲಿಂಕ್‌ಗಳು',
    showroomContactHeading: 'ಶೋರೂಮ್ ಮತ್ತು ಸಂಪರ್ಕ',
    shippingPaymentsHeading: 'ಡೆಲಿವರಿ ಮತ್ತು ಪಾವತಿ',
    freeDeliveryLine: '₹1,999+ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಡೆಲಿವರಿ',
    exchangeLine: '7-ದಿನದ ಬದಲಾವಣೆ ಸೌಲಭ್ಯ',
    paymentMethodsLine: 'UPI · ಕಾರ್ಡ್‌ಗಳು · ನೆಟ್‌ಬ್ಯಾಂಕಿಂಗ್ · COD',
    hoursLine: 'ಸೋಮ–ಶನಿ · 10:00 AM – 8:30 PM IST',
    tagline: 'ಆಯ್ದ ಪ್ರೀಮಿಯಂ ಸೀರೆಗಳು',
    home: 'ಮುಖಪುಟ',
    weaves: 'ವಿಭಾಗಗಳು',
    signIn: 'ಸೈನ್ ಇನ್',
    signOut: 'ಸೈನ್ ಔಟ್',
    drapeOption: 'ಡ್ರೇಪ್ / ಪ್ಯಾಕ್ ಆಯ್ಕೆ',
    weaveLabel: 'ನೇಯ್ಗೆ:',
    bagEmpty: 'ನಿಮ್ಮ ಸೀರೆ ಬ್ಯಾಗ್ ಖಾಲಿಯಾಗಿದೆ',
    bagEmptyDesc: 'ಆಯ್ದ ಕಾಂಚೀಪುರಂ ರೇಷ್ಮೆ, ಬನಾರಸಿ ಮತ್ತು ಮಹೇಶ್ವರಿ ಸೀರೆಗಳನ್ನು ನೋಡಿ.',
    exploreSarees: 'ಸೀರೆಗಳನ್ನು ನೋಡಿ',
    subtotal: 'ಉಪಮೊತ್ತ',
    shippingLabel: 'ಡೆಲಿವರಿ',
    totalPayable: 'ಒಟ್ಟು ಪಾವತಿ',
    proceedCheckout: 'ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',
    expressCheckout: 'ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಚೆಕ್‌ಔಟ್',
    editBag: 'ಬ್ಯಾಗ್ ತಿದ್ದುಪಡಿ',
    placeOrder: 'ಆರ್ಡರ್ ಮಾಡಿ',
    continueBrowsing: 'ಬ್ರೌಸಿಂಗ್ ಮುಂದುವರಿಸಿ',
    upiCard: 'UPI / ಕಾರ್ಡ್',
    codLabel: 'ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ',
    noSavedSarees: 'ಇನ್ನೂ ಸೇವ್ ಮಾಡಿದ ಸೀರೆಗಳಿಲ್ಲ',
    noSavedSareesDesc: 'ನಿಮ್ಮ ಇಷ್ಟಪಟ್ಟಿಗೆ ಸೇರಿಸಲು ಹಾರ್ಟ್ ಐಕಾನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.',
    expressOtpTitle: 'ಎಕ್ಸ್‌ಪ್ರೆಸ್ OTP ಸೈನ್ ಇನ್',
    otpPrompt: 'ವೇಗದ ಚೆಕ್‌ಔಟ್‌ಗಾಗಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
    continueOtp: 'ಮೊಬೈಲ್ OTP ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
    chatbotTitle: 'ಕೋರಾ ಮತ್ತು ಲೂಮ್ ಸ್ಟೈಲ್ ಸಹಾಯಕ',
    chatbotSubtitle: 'ಬಹುಭಾಷಾ AI ಸೀರೆ ಬೆಂಬಲ',
    chatbotGreeting: 'ನಮಸ್ಕಾರ! ಕಾಂಚೀಪುರಂ ರೇಷ್ಮೆ, ಬೆಲೆ, ಬ್ಲೌಸ್ ಅಥವಾ COD ಬಗ್ಗೆ ಕೇಳಿ.',
    chatbotTyping: 'ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...',
    chatbotPlaceholder: 'ಸೀರೆಗಳು, ಡೆಲಿವರಿ ಅಥವಾ ಆಫರ್‌ಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    helpLabel: 'Help',
    languageLabel: 'ಭಾಷೆ',
    backToTop: 'ಮೇಲಕ್ಕೆ ಹೋಗಿ',
    scrollToBottom: 'ಕೆಳಗೆ ಹೋಗಿ',
    viewMore: 'ಇನ್ನಷ್ಟು ನೋಡಿ',
    showMore: 'ಇನ್ನಷ್ಟು ತೋರಿಸಿ',
    showLess: 'ಕಡಿಮೆ ತೋರಿಸಿ',
    viewAllCollections: 'ಎಲ್ಲಾ ಸಂಗ್ರಹಗಳನ್ನು ನೋಡಿ',
    customerCareTitle: 'ಗ್ರಾಹಕ ಸೇವೆ ಸಂಪರ್ಕ ವಿವರಗಳು',
    careHelplineLabel: 'WhatsApp ಮತ್ತು ಆರ್ಡರ್ ನೆರವು',
    careHoursNote: 'ಸೋಮ–ಶನಿ · 10:00 AM – 8:30 PM IST (2 ಗಂಟೆಯೊಳಗೆ ಪ್ರತಿಕ್ರಿಯೆ)',
    careExchangeNote: 'ಆರ್ಡರ್ ನೆರವು, ವಧು ಶೈಲಿ ಮತ್ತು 7-ದಿನದ ವಿನಿಮಯ ಸೇವೆ',
    howToOrderTitle: 'ಆರ್ಡರ್ ಮಾಡುವುದು ಹೇಗೆ',
    howToOrderSubtitle: 'ಹುಡುಕಾಟದಿಂದ ಪಾವತಿವರೆಗೆ 6 ಸರಳ ಹಂತಗಳನ್ನು ನೋಡಿ',
    howToOrderStartShopping: 'ಶಾಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    howToOrderSteps: [
      { title: 'ಸೀರೆಗಳನ್ನು ಹುಡುಕಿ ಅಥವಾ ನೋಡಿ', desc: 'ಹುಡುಕಾಟ ಪಟ್ಟಿ ಅಥವಾ ವರ್ಗದಿಂದ ಸೀರೆ ಆರಿಸಿ.' },
      { title: 'ಉತ್ಪನ್ನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ', desc: 'ಫೋಟೋ, ನೇಯ್ಗೆ ಮತ್ತು ಬ್ಲೌಸ್ ವಿವರ ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ.' },
      { title: 'ಪ್ರಮಾಣ (+ / −) ಆಯ್ಕೆ ಮಾಡಿ', desc: 'ಕಾರ್ಡ್ ಮೇಲೆಯೇ + / − ಒತ್ತಿ ಸಂಖ್ಯೆಯನ್ನು ಬದಲಿಸಿ.' },
      { title: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', desc: 'Add to Cart ಒತ್ತಿದ ತಕ್ಷಣ ಬ್ಯಾಗ್ ಸಂಖ್ಯೆ ಹೆಚ್ಚಾಗುತ್ತದೆ.' },
      { title: 'ಆಫರ್ ಅನ್ವಯಿಸಿ', desc: 'ಬ್ಯಾಗ್ ತೆರೆದು KORA10 ಅಥವಾ TROUSSEAU15 ಕೋಡ್ ಹಾಕಿ.' },
      { title: 'ಪಾವತಿ ಮತ್ತು ದೃಢೀಕರಣ', desc: 'ಪಿನ್‌ಕೋಡ್ ಹಾಕಿ G Pay, PhonePe, ಕಾರ್ಡ್ ಅಥವಾ COD ಮೂಲಕ ಪಾವತಿಸಿ.' },
    ],
    weAcceptTitle: 'ನಾವು ಸ್ವೀಕರಿಸುವ ಪಾವತಿಗಳು',
    followUsSocial: 'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮದಲ್ಲಿ ಅನುಸರಿಸಿ',
    chatOnWhatsApp: 'WhatsApp ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ',
    forCallLabel: 'ಕರೆಗಾಗಿ:',
    howToCreateAccount: 'ಖಾತೆ ರಚಿಸುವುದು ಹೇಗೆ',
    happyCustomers: 'ಸಂತುಷ್ಟ ಗ್ರಾಹಕರು',
    inBagLabel: 'ಬ್ಯಾಗ್‌ನಲ್ಲಿ',
    allPrices: 'ಎಲ್ಲಾ ಬೆಲೆಗಳು',
    clearFilter: 'ತೆಗೆಯಿರಿ',
    noMatches: 'ಈ ಆಯ್ಕೆಯಲ್ಲಿ ಸೀರೆಗಳು ಲಭ್ಯವಿಲ್ಲ',
    resetFilters: 'ಎಲ್ಲಾ ಸೀರೆಗಳನ್ನು ತೋರಿಸಿ',
    show20PlusReviews: '20+ ವಿಮರ್ಶೆಗಳನ್ನು ತೋರಿಸಿ',
    allReviewsLabel: 'ಎಲ್ಲಾ',
    positiveReviewsLabel: 'ಸಕಾರಾತ್ಮಕ',
    constructiveFeedbackLabel: 'ರಚನಾತ್ಮಕ ಸಲಹೆ',
    verifiedReviewsLabel: 'ಪರಿಶೀಲಿಸಿದ ವಿಮರ್ಶೆಗಳು',
    ratingBreakdownLabel: 'ರೇಟಿಂಗ್ ವಿವರ',
    boutiqueCareNoteLabel: 'ಅಂಗಡಿ ಟಿಪ್ಪಣಿ',
    trustItems: [
      { title: 'ಆಯ್ದ ಕೈಮಗ್ಗ ಗುಣಮಟ್ಟ', desc: 'ಜರಿ ಮತ್ತು ನೆರಿಗೆ ಫಿನಿಶ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.' },
      { title: 'ಬ್ಲೌಸ್ ಪೀಸ್ ಒಳಗೊಂಡಿದೆ', desc: 'ಪ್ರತಿ ಸೀರೆಯೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆಯ 0.85m–0.9m ಬ್ಲೌಸ್ ಪೀಸ್.' },
      { title: '₹1,999+ ಉಚಿತ ಡೆಲಿವರಿ & COD', desc: 'ಭಾರತದಾದ್ಯಂತ ವೇಗದ ಡೆಲಿವರಿ ಮತ್ತು COD.' },
      { title: 'ಹೆರಿಟೇಜ್ ಸಿಲ್ಕ್ ಸ್ಟುಡಿಯೋ', desc: '12 ಸ್ಯಾಂಪಲ್ ಲೂಮ್ ಸ್ಟ್ರೀಟ್, ಹೆರಿಟೇಜ್ ಮಾರ್ಕೆಟ್ – 600001' },
    ],
    quickPrompts: [
      '₹3,500 ಒಳಗಿನ ಉತ್ತಮ ರೇಷ್ಮೆ ಸೀರೆ?',
      'ಉಚಿತ ಡೆಲಿವರಿ ಮತ್ತು COD ವಿವರ?',
      'ಶೋರೂಮ್ ವಿಳಾಸ ಮತ್ತು ಸಮಯ?',
    ],
    categories: {
      'Kanchipuram Silks': 'ಕಾಂಚೀಪುರಂ ರೇಷ್ಮೆ',
      'Banarasi & Soft Silks': 'ಬನಾರಸಿ ಮತ್ತು ಸಾಫ್ಟ್ ಸಿಲ್ಕ್',
      'Cotton & Maheshwari': 'ಕಾಟನ್ ಮತ್ತು ಮಹೇಶ್ವರಿ',
      'Tissue Linen': 'ಟಿಶ್ಯೂ ಲಿನನ್',
      'Ready-Made Blouses': 'ರೆಡಿಮೇಡ್ ಬ್ಲೌಸ್‌ಗಳು',
      'Bridal & Gift Combos': 'ವಧು ಮತ್ತು ಗಿಫ್ಟ್ ಕಾಂಬೊ',
    },
  },
};

const SITE_STORAGE_KEY = 'kora_site_language_v1';
const CHAT_STORAGE_KEY = 'kora_chat_language_v1';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: LocalizedStrings;
  chatLanguage: SupportedLanguage;
  setChatLanguage: (lang: SupportedLanguage) => void;
  chatT: LocalizedStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readPersistedLanguage(storageKey: string): SupportedLanguage {
  try {
    const saved = localStorage.getItem(storageKey) as SupportedLanguage | null;
    if (saved && saved in TRANSLATIONS) return saved;
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    readPersistedLanguage(SITE_STORAGE_KEY)
  );
  const [chatLanguage, setChatLanguageState] = useState<SupportedLanguage>(() =>
    readPersistedLanguage(CHAT_STORAGE_KEY)
  );

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(SITE_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setChatLanguage = useCallback((lang: SupportedLanguage) => {
    setChatLanguageState(lang);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Synchronize site language and chat language independently across tabs via storage events
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SITE_STORAGE_KEY && e.newValue && e.newValue in TRANSLATIONS) {
        setLanguageState(e.newValue as SupportedLanguage);
      }
      if (e.key === CHAT_STORAGE_KEY && e.newValue && e.newValue in TRANSLATIONS) {
        setChatLanguageState(e.newValue as SupportedLanguage);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
        chatLanguage,
        setChatLanguage,
        chatT: TRANSLATIONS[chatLanguage],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
