export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'fr';

export const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
];

export type ThemeId = 'light' | 'dark';

export const THEME_OPTIONS: { id: ThemeId; label: string; swatch: string }[] = [
  { id: 'light', label: 'Light', swatch: '#FAFAFA' },
  { id: 'dark', label: 'Dark', swatch: '#0F1013' },
];

export interface TranslationPack {
  announcement: string;
  nav: {
    collections: string;
    sarees: string;
    fabrics: string;
    bridal: string;
    trackOrder: string;
    signIn: string;
    bag: string;
    admin: string;
  };
  home: {
    shopByCategoryKicker: string;
    shopByCategoryTitle: string;
    viewAllCategories: string;
    atelierShowcaseKicker: string;
    featuredTitle: string;
    tabs: {
      new: string;
      bestseller: string;
      festive: string;
      limited: string;
      yardage: string;
    };
    reelsKicker: string;
    reelsTitle: string;
    reelsSubtitle: string;
    testimonialsKicker: string;
    testimonialsTitle: string;
    recentlyViewedKicker: string;
    recentlyViewedTitle: string;
    newsletterKicker: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    subscribeBtn: string;
  };
  product: {
    quickView: string;
    addToBag: string;
    outOfStock: string;
    newArrival: string;
    bestSeller: string;
    limitedEdition: string;
    soldOut: string;
  };
  bot: {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    quickTrack: string;
    quickRecommend: string;
    quickPincode: string;
    quickCare: string;
    openWhatsApp: string;
    trackPrompt: string;
    careReply: string;
    fallbackReply: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationPack> = {
  en: {
    announcement: 'Complimentary insured delivery above ₹4,999 · Code ATELIER10 for 10% off',
    nav: {
      collections: 'Collections',
      sarees: 'Sarees',
      fabrics: 'Fabrics',
      bridal: 'Bridal',
      trackOrder: 'Track Order',
      signIn: 'Sign In',
      bag: 'Bag',
      admin: 'Atelier Admin',
    },
    home: {
      shopByCategoryKicker: 'Curated Departments',
      shopByCategoryTitle: 'Shop by Category',
      viewAllCategories: 'View all categories',
      atelierShowcaseKicker: 'Atelier Showcase',
      featuredTitle: 'Featured Weaves & Textiles',
      tabs: {
        new: 'New Arrivals',
        bestseller: 'Best Sellers',
        festive: 'Bridal & Festive',
        limited: 'Limited Edition',
        yardage: 'By the Metre',
      },
      reelsKicker: 'Motion & Drape Studio',
      reelsTitle: 'Boutique Weaves in Motion',
      reelsSubtitle:
        'Inspect zari sheen, pleated fall, and handspun texture through our atelier showcase films.',
      testimonialsKicker: 'Patron Stories',
      testimonialsTitle: 'Worn & Cherished Across India',
      recentlyViewedKicker: 'Continue Exploring',
      recentlyViewedTitle: 'Recently Viewed Weaves',
      newsletterKicker: 'Loom Dispatch Notes',
      newsletterTitle: 'Private Preview of New Loom Releases',
      newsletterSubtitle:
        'Receive early access to limited-edition bridal weaves, restock notices, and seasonal textile lookbooks.',
      subscribeBtn: 'Subscribe',
    },
    product: {
      quickView: 'Quick View',
      addToBag: 'Add to Bag',
      outOfStock: 'Out of Stock',
      newArrival: 'New Arrival',
      bestSeller: 'Best Seller',
      limitedEdition: 'Limited Edition',
      soldOut: 'Sold Out',
    },
    bot: {
      title: 'WhatsApp',
      subtitle: 'Multilingual Textile Stylist',
      greeting:
        'Namaste! Welcome to Vastra Atelier. Ask about saree drapes, fabric yardage, PIN delivery, or track your order.',
      placeholder: 'Ask about silk sarees, PIN 400001, or order VA-2026-1042...',
      quickTrack: 'Track Order',
      quickRecommend: 'Recommend Saree',
      quickPincode: 'Check PIN Delivery',
      quickCare: 'Silk Care Guide',
      openWhatsApp: 'Continue on WhatsApp',
      trackPrompt: 'Share an order number like VA-2026-1042 to check live status.',
      careReply:
        'Pure Banarasi & Kanjivaram silks should be dry-cleaned only and stored in unbleached cotton muslin bags, refolding every 4 months.',
      fallbackReply:
        'I can help you check order status (send VA-2026-1042), verify any 6-digit Indian PIN code, or recommend handloom weaves!',
    },
  },
  hi: {
    announcement: '₹4,999 से ऊपर मुफ्त बीमित डिलीवरी · 10% छूट के लिए कोड ATELIER10',
    nav: {
      collections: 'संग्रह',
      sarees: 'साड़ियाँ',
      fabrics: 'फैब्रिक',
      bridal: 'ब्राइडल',
      trackOrder: 'ऑर्डर ट्रैक करें',
      signIn: 'लॉगिन',
      bag: 'बैग',
      admin: 'एडमिन',
    },
    home: {
      shopByCategoryKicker: 'विभाग',
      shopByCategoryTitle: 'श्रेणी के अनुसार खरीदें',
      viewAllCategories: 'सभी श्रेणियां देखें',
      atelierShowcaseKicker: 'विशेष बुनाई',
      featuredTitle: 'चयनित साड़ियाँ और वस्त्र',
      tabs: {
        new: 'नया आगमन',
        bestseller: 'बेस्ट सेलर',
        festive: 'उत्सव और ब्राइडल',
        limited: 'सीमित संस्करण',
        yardage: 'मीटर के अनुसार',
      },
      reelsKicker: 'टेक्सटाइल वीडियो स्टूडियो',
      reelsTitle: 'बुटिक वस्त्रों का लाइव ड्रेप',
      reelsSubtitle: 'हमारी कारीगर बुनाई की चमक और ड्रेप को वीडियो में करीब से देखें।',
      testimonialsKicker: 'ग्राहक अनुभव',
      testimonialsTitle: 'पूरे भारत में सराहा गया',
      recentlyViewedKicker: 'हाल ही में देखे गए',
      recentlyViewedTitle: 'आपकी हालिया पसंद',
      newsletterKicker: 'लूम डिस्पैच',
      newsletterTitle: 'नए संग्रह का विशेष पूर्वावलोकन',
      newsletterSubtitle: 'सीमित संस्करण ब्राइडल बुनाई और स्टॉक अपडेट की जानकारी सबसे पहले पाएं।',
      subscribeBtn: 'सदस्यता लें',
    },
    product: {
      quickView: 'त्वरित झलक',
      addToBag: 'बैग में जोड़ें',
      outOfStock: 'स्टॉक समाप्त',
      newArrival: 'नया आगमन',
      bestSeller: 'बेस्ट सेलर',
      limitedEdition: 'सीमित संस्करण',
      soldOut: 'बिक चुका',
    },
    bot: {
      title: 'वस्त्र व्हाट्सएप सहायता',
      subtitle: 'बहुभाषी टेक्सटाइल स्टाइलिस्ट',
      greeting:
        'नमस्ते! वस्त्र एटेलियर में आपका स्वागत है। साड़ी, फैब्रिक मीटर, पिन कोड डिलीवरी या ऑर्डर ट्रैकिंग के लिए पूछें।',
      placeholder: 'सिल्क साड़ी, पिन 400001 या ऑर्डर VA-2026-1042 लिखें...',
      quickTrack: 'ऑर्डर ट्रैक करें',
      quickRecommend: 'साड़ी सुझाव',
      quickPincode: 'पिन डिलीवरी जांचें',
      quickCare: 'सिल्क देखभाल',
      openWhatsApp: 'व्हाट्सएप पर चैट करें',
      trackPrompt: 'लाइव स्थिति जानने के लिए VA-2026-1042 जैसा ऑर्डर नंबर भेजें।',
      careReply:
        'शुद्ध बनारसी और कांचीवरम सिल्क को केवल ड्राई क्लीन कराएं और बिना ब्लीच किए सूती मलमल के बैग में रखें।',
      fallbackReply:
        'मैं आपका ऑर्डर ट्रैक करने (VA-2026-1042), 6-अंकीय पिन कोड जांचने, या बुनाई चुनने में मदद कर सकता हूँ।',
    },
  },
  ta: {
    announcement: '₹4,999-க்கு மேல் இலவச காப்பீட்டு டெலிவரி · 10% தள்ளுபடி குறியீடு ATELIER10',
    nav: {
      collections: 'தொகுப்புகள்',
      sarees: 'புடவைகள்',
      fabrics: 'துணிகள்',
      bridal: 'மணமகள்',
      trackOrder: 'ஆர்டர் நிலை',
      signIn: 'உள்நுழைக',
      bag: 'பை',
      admin: 'நிர்வாகம்',
    },
    home: {
      shopByCategoryKicker: 'பிரிவுகள்',
      shopByCategoryTitle: 'வகை வாரியாக வாங்கவும்',
      viewAllCategories: 'அனைத்து வகைகளும்',
      atelierShowcaseKicker: 'சிறப்பு நெசவு',
      featuredTitle: 'சிறந்த நெசவுப் புடவைகள்',
      tabs: {
        new: 'புதிய வரவுகள்',
        bestseller: 'அதிக விற்பனை',
        festive: 'திருமண & பண்டிகை',
        limited: 'வரையறுக்கப்பட்ட பதிப்பு',
        yardage: 'மீட்டர் கணக்கில்',
      },
      reelsKicker: 'வீடியோ காட்சி',
      reelsTitle: 'நெசவுத் துணிகளின் நேரடி தோற்றம்',
      reelsSubtitle: 'ஜரிகை வேலைப்பாடு மற்றும் துணியின் மடிப்பை வீடியோவில் காண்க.',
      testimonialsKicker: 'வாடிக்கையாளர் கருத்து',
      testimonialsTitle: 'இந்தியா முழுவதும் விரும்பப்படும் தரம்',
      recentlyViewedKicker: 'சமீபத்தில் பார்த்தவை',
      recentlyViewedTitle: 'நீங்கள் பார்த்த நெசவுகள்',
      newsletterKicker: 'புதிய அறிவிப்புகள்',
      newsletterTitle: 'புதிய நெசவு வெளியீடுகளின் முன்னோட்டம்',
      newsletterSubtitle: 'புதிய காஞ்சிபுரம் மற்றும் பனாரசி தொகுப்புகளை உடனுக்குடன் அறியுங்கள்.',
      subscribeBtn: 'இணையவும்',
    },
    product: {
      quickView: 'விரைவு பார்வை',
      addToBag: 'பையில் சேர்',
      outOfStock: 'கையிருப்பு இல்லை',
      newArrival: 'புதிய வரவு',
      bestSeller: 'சிறந்த விற்பனை',
      limitedEdition: 'குறிப்பிட்ட பதிப்பு',
      soldOut: 'விற்றுத் தீர்ந்தது',
    },
    bot: {
      title: 'வஸ்த்ரா வாட்ஸ்அப் உதவி',
      subtitle: 'பன்மொழி ஆடை ஆலோசகர்',
      greeting:
        'வணக்கம்! வஸ்த்ரா அடெலியருக்கு வரவேற்கிறோம். புடவைகள், துணி அளவு, பின்கோட் டெலிவரி அல்லது ஆர்டர் விவரம் கேட்கவும்.',
      placeholder: 'பட்டு புடவை, PIN 600001 அல்லது VA-2026-1042 எனத் தட்டச்சு செய்க...',
      quickTrack: 'ஆர்டர் கண்காணிப்பு',
      quickRecommend: 'புடவை பரிந்துரை',
      quickPincode: 'பின்கோட் டெலிவரி',
      quickCare: 'பட்டு பராமரிப்பு',
      openWhatsApp: 'வாட்ஸ்அப்பில் தொடரவும்',
      trackPrompt: 'உங்கள் ஆர்டர் நிலையை அறிய VA-2026-1042 போன்ற எண்ணை உள்ளிடவும்.',
      careReply:
        'தூய காஞ்சிபுரம் மற்றும் பனாரசி பட்டுப் புடவைகளை டிரை கிளீன் மட்டுமே செய்யவும்; மஸ்லின் துணியில் சுற்றி வைக்கவும்.',
      fallbackReply:
        'ஆர்டர் நிலை (VA-2026-1042), 6 இலக்க பின்கோட் சரிபார்ப்பு அல்லது புடவைத் தேர்வில் நான் உதவ முடியும்!',
    },
  },
  te: {
    announcement: '₹4,999 పైబడిన ఆర్డర్లకు ఉచిత ఇన్సూర్డ్ డెలివరీ · 10% తగ్గింపు కోడ్ ATELIER10',
    nav: {
      collections: 'కలెక్షన్లు',
      sarees: 'చీరలు',
      fabrics: 'ఫ్యాబ్రిక్స్',
      bridal: 'బ్రైడల్',
      trackOrder: 'ఆర్డర్ ట్రాక్',
      signIn: 'సైన్ ఇన్',
      bag: 'బ్యాగ్',
      admin: 'అడ్మిన్',
    },
    home: {
      shopByCategoryKicker: 'విభాగాలు',
      shopByCategoryTitle: 'వర్గం వారీగా షాపింగ్ చేయండి',
      viewAllCategories: 'అన్ని వర్గాలు చూడండి',
      atelierShowcaseKicker: 'చేనేత ప్రదర్శన',
      featuredTitle: 'ప్రత్యేక నేత చీరలు & వస్త్రాలు',
      tabs: {
        new: 'కొత్తవి',
        bestseller: 'బెస్ట్ సెల్లర్స్',
        festive: 'పెళ్లి & పండుగ',
        limited: 'లిమిటెడ్ ఎడిషన్',
        yardage: 'మీటర్ల వారీగా',
      },
      reelsKicker: 'వీడియో స్టూడియో',
      reelsTitle: 'బోటిక్ వస్త్రాల వీడియో ప్రదర్శన',
      reelsSubtitle: 'జరీ మెరుపు మరియు చీర డ్రేప్‌ను వీడియోలో స్పష్టంగా చూడండి.',
      testimonialsKicker: 'వినియోగదారుల మాట',
      testimonialsTitle: 'భారతదేశమంతటా ఆదరణ పొందినది',
      recentlyViewedKicker: 'ఇటీవల చూసినవి',
      recentlyViewedTitle: 'మీరు చూసిన నేత వస్త్రాలు',
      newsletterKicker: 'లూమ్ డిస్పాచ్',
      newsletterTitle: 'కొత్త కలెక్షన్ల ముందస్తు సమాచారం',
      newsletterSubtitle: 'కొత్త పట్టు చీరలు మరియు ప్రత్యేక ఆఫర్లను WhatsApp లేదా Email లో పొందండి.',
      subscribeBtn: 'సభ్యత్వం పొందండి',
    },
    product: {
      quickView: 'త్వరిత వీక్షణ',
      addToBag: 'బ్యాగ్‌లో చేర్చు',
      outOfStock: 'స్టాక్ లేదు',
      newArrival: 'కొత్త రాక',
      bestSeller: 'బెస్ట్ సెల్లర్',
      limitedEdition: 'లిమిటెడ్ ఎడిషన్',
      soldOut: 'అమ్ముడైంది',
    },
    bot: {
      title: 'వస్త్ర WhatsApp సహాయకుడు',
      subtitle: 'బహుభాషా టెక్స్‌టైల్ గైడ్',
      greeting:
        'నమస్కారం! వస్త్ర అటెలియర్‌కు స్వాగతం. పట్టు చీరలు, మీటర్ల ఫ్యాబ్రిక్, పిన్ కోడ్ డెలివరీ లేదా ఆర్డర్ ట్రాకింగ్ గురించి అడగండి.',
      placeholder: 'పట్టు చీరలు, PIN 500001 లేదా VA-2026-1042 అని టైప్ చేయండి...',
      quickTrack: 'ఆర్డర్ ట్రాక్',
      quickRecommend: 'చీర సూచన',
      quickPincode: 'పిన్ కోడ్ చెక్',
      quickCare: 'పట్టు సంరక్షణ',
      openWhatsApp: 'WhatsApp లో చాట్ చేయండి',
      trackPrompt: 'లైవ్ స్టేటస్ కోసం VA-2026-1042 వంటి ఆర్డర్ నంబర్ పంపండి.',
      careReply:
        'స్వచ్ఛమైన బనారసి & కంజీవరం పట్టును డ్రై క్లీన్ మాత్రమే చేయించండి మరియు కాటన్ మస్లిన్ బ్యాగ్‌లో భద్రపరచండి.',
      fallbackReply:
        'ఆర్డర్ ట్రాకింగ్ (VA-2026-1042), 6 అంకెల పిన్ కోడ్ చెక్ లేదా చీరల ఎంపికలో నేను సహాయం చేయగలను.',
    },
  },
  kn: {
    announcement: '₹4,999 ಮೇಲ್ಪಟ್ಟ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ವಿಮೆ ಡೆಲಿವರಿ · ಕೋಡ್ ATELIER10 ಬಳಸಿ',
    nav: {
      collections: 'ಸಂಗ್ರಹಗಳು',
      sarees: 'ಸೀರೆಗಳು',
      fabrics: 'ಬಟ್ಟೆಗಳು',
      bridal: 'ವಧುವಿನ',
      trackOrder: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್',
      signIn: 'ಲಾಗಿನ್',
      bag: 'ಬ್ಯಾಗ್',
      admin: 'ಅಡ್ಮಿನ್',
    },
    home: {
      shopByCategoryKicker: 'ವಿಭಾಗಗಳು',
      shopByCategoryTitle: 'ವರ್ಗದ ಪ್ರಕಾರ ಖರೀದಿಸಿ',
      viewAllCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
      atelierShowcaseKicker: 'ವಿಶೇಷ ನೇಯ್ಗೆ',
      featuredTitle: 'ಆಯ್ದ ರೇಷ್ಮೆ ಮತ್ತು ಕೈಮಗ್ಗ ವಸ್ತ್ರಗಳು',
      tabs: {
        new: 'ಹೊಸ ಆಗಮನ',
        bestseller: 'ಅತಿ ಹೆಚ್ಚು ಮಾರಾಟ',
        festive: 'ಹಬ್ಬ ಮತ್ತು ವಧುವಿನ',
        limited: 'ಸೀಮಿತ ಆವೃತ್ತಿ',
        yardage: 'ಮೀಟರ್ ಲೆಕ್ಕದಲ್ಲಿ',
      },
      reelsKicker: 'ವೀಡಿಯೊ ಸ್ಟುಡಿಯೋ',
      reelsTitle: 'ಬೊಟಿಕ್ ವಸ್ತ್ರಗಳ ವೀಡಿಯೊ ನೋಟ',
      reelsSubtitle: 'ಜರಿ ಹೊಳಪು ಮತ್ತು ಸೀರೆಯ ವಿನ್ಯಾಸವನ್ನು ವೀಡಿಯೊದಲ್ಲಿ ಹತ್ತಿರದಿಂದ ನೋಡಿ.',
      testimonialsKicker: 'ಗ್ರಾಹಕರ ಅನುಭವ',
      testimonialsTitle: 'ಭಾರತದಾದ್ಯಂತ ಮೆಚ್ಚುಗೆ ಪಡೆದಿದೆ',
      recentlyViewedKicker: 'ಇತ್ತೀಚೆಗೆ ನೋಡಿದವು',
      recentlyViewedTitle: 'ನೀವು ನೋಡಿದ ನೇಯ್ಗೆಗಳು',
      newsletterKicker: 'ಲೂಮ್ ಡಿಸ್ಪ್ಯಾಚ್',
      newsletterTitle: 'ಹೊಸ ಸಂಗ್ರಹಗಳ ಮುನ್ನೋಟ',
      newsletterSubtitle: 'ಹೊಸ ಕೈಮಗ್ಗ ಸಂಗ್ರಹಗಳು ಮತ್ತು ಕೊಡುಗೆಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಿರಿ.',
      subscribeBtn: 'ಚಂದಾದಾರರಾಗಿ',
    },
    product: {
      quickView: 'ತ್ವರಿತ ನೋಟ',
      addToBag: 'ಬ್ಯಾಗ್‌ಗೆ ಸೇರಿಸಿ',
      outOfStock: 'ಸ್ಟಾಕ್ ಇಲ್ಲ',
      newArrival: 'ಹೊಸದು',
      bestSeller: 'ಬೆಸ್ಟ್ ಸೆಲ್ಲರ್',
      limitedEdition: 'ಸೀಮಿತ ಆವೃತ್ತಿ',
      soldOut: 'ಮಾರಾಟವಾಗಿದೆ',
    },
    bot: {
      title: 'ವಸ್ತ್ರ WhatsApp ಸಹಾಯಕ',
      subtitle: 'ಬಹುಭಾಷಾ ವಸ್ತ್ರ ಸಲಹೆಗಾರ',
      greeting:
        'ನಮಸ್ಕಾರ! ವಸ್ತ್ರ ಅಟೆಲಿಯರ್‌ಗೆ ಸ್ವಾಗತ. ರೇಷ್ಮೆ ಸೀರೆಗಳು, ಮೀಟರ್ ಬಟ್ಟೆ, ಪಿನ್ ಕೋಡ್ ಅಥವಾ ಆರ್ಡರ್ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಕೇಳಿ.',
      placeholder: 'ಸೀರೆ, PIN 560001 ಅಥವಾ VA-2026-1042 ಟೈಪ್ ಮಾಡಿ...',
      quickTrack: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್',
      quickRecommend: 'ಸೀರೆ ಸಲಹೆ',
      quickPincode: 'ಪಿನ್ ಕೋಡ್ ಪರಿಶೀಲಿಸಿ',
      quickCare: 'ರೇಷ್ಮೆ ಆರೈಕೆ',
      openWhatsApp: 'WhatsApp ನಲ್ಲಿ ಮುಂದುವರಿಸಿ',
      trackPrompt: 'ಲೈವ್ ಸ್ಥಿತಿಗಾಗಿ VA-2026-1042 ನಂತಹ ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಕಳುಹಿಸಿ.',
      careReply:
        'ಶುದ್ಧ ಬನಾರಸಿ ಮತ್ತು ಕಾಂಜೀವರಂ ರೇಷ್ಮೆಯನ್ನು ಡ್ರೈ ಕ್ಲೀನ್ ಮಾತ್ರ ಮಾಡಿ ಮತ್ತು ಮಸ್ಲಿನ್ ಬಟ್ಟೆಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.',
      fallbackReply:
        'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್ (VA-2026-1042), ಪಿನ್ ಕೋಡ್ ಪರಿಶೀಲನೆ ಅಥವಾ ಸೀರೆ ಆಯ್ಕೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.',
    },
  },
  fr: {
    announcement: 'Livraison assurée offerte dès ₹4,999 · Code ATELIER10 (-10%)',
    nav: {
      collections: 'Collections',
      sarees: 'Saris',
      fabrics: 'Tissus',
      bridal: 'Mariage',
      trackOrder: 'Suivi',
      signIn: 'Connexion',
      bag: 'Panier',
      admin: 'Atelier',
    },
    home: {
      shopByCategoryKicker: 'Départements',
      shopByCategoryTitle: 'Explorer par Catégorie',
      viewAllCategories: 'Toutes les catégories',
      atelierShowcaseKicker: 'Sélection Atelier',
      featuredTitle: 'Tissages & Étoffes d’Exception',
      tabs: {
        new: 'Nouveautés',
        bestseller: 'Meilleures Ventes',
        festive: 'Mariage & Fêtes',
        limited: 'Édition Limitée',
        yardage: 'Au Mètre',
      },
      reelsKicker: 'Studio Vidéo',
      reelsTitle: 'Étoffes en Mouvement',
      reelsSubtitle:
        'Observez le drapé de la soie, l’éclat du zari et la finesse du tissage artisanal.',
      testimonialsKicker: 'Avis Clients',
      testimonialsTitle: 'Porté & Chéri à Travers l’Inde',
      recentlyViewedKicker: 'Reprendre',
      recentlyViewedTitle: 'Vus Récemment',
      newsletterKicker: 'Carnets du Métier',
      newsletterTitle: 'Avant-Première des Nouveaux Tissages',
      newsletterSubtitle:
        'Accès anticipé aux éditions limitées, réassorts et lookbooks saisonniers.',
      subscribeBtn: 'S’inscrire',
    },
    product: {
      quickView: 'Aperçu Rapide',
      addToBag: 'Ajouter au Panier',
      outOfStock: 'Rupture',
      newArrival: 'Nouveauté',
      bestSeller: 'Best-Seller',
      limitedEdition: 'Édition Limitée',
      soldOut: 'Épuisé',
    },
    bot: {
      title: 'WhatsApp',
      subtitle: 'Styliste Textile Multilingue',
      greeting:
        'Namaste ! Bienvenue chez Vastra Atelier. Demandez un conseil sari, un métrage, une livraison PIN ou un suivi de commande.',
      placeholder: 'Ex: sari soie, PIN 400001 ou commande VA-2026-1042...',
      quickTrack: 'Suivre Commande',
      quickRecommend: 'Conseil Sari',
      quickPincode: 'Délai Code PIN',
      quickCare: 'Soin de la Soie',
      openWhatsApp: 'Continuer sur WhatsApp',
      trackPrompt: 'Indiquez un numéro comme VA-2026-1042 pour suivre votre colis.',
      careReply:
        'Nettoyage à sec uniquement pour les soies Banarasi et Kanjivaram. Rangez-les dans une housse en mousseline de coton.',
      fallbackReply:
        'Je peux suivre une commande (VA-2026-1042), vérifier un code PIN à 6 chiffres ou recommander des tissages !',
    },
  },
};
