// Splash Screen Animation
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 3000);
});

// Language Translation
const translations = {
    en: {
        'How to Use': 'How to Use',
        'Step 1: Register': 'Step 1: signup',
        'Create your account to get started': 'Create your account to get started',
        'Step 2:Login': 'Step 2: login',
        'After succesfull signup': 'login with your credentials',
        'Step 3: Explore Features': 'Step 3: Explore Features',
        'Discover all available features and services': 'Discover all available features and services',
        'Our Features': 'Our Features',
        '24/7 Support': '24/7 Support',
        'Round-the-clock assistance for seniors': 'Round-the-clock assistance for seniors',
        'Health Monitoring': 'Health Monitoring',
        'Regular health checkups and monitoring': 'Regular health checkups and monitoring',
        'Emergency Alert': 'Emergency Alert',
        'Quick emergency response system': 'Quick emergency response system',
        'Contact Us': 'Contact Us'
    },
    hi: {
        'How to Use': 'उपयोग कैसे करें',
        'Step 1: Register': 'चरण 1: पंजीकरण करें',
        'Create your account to get started': 'शुरू करने के लिए अपना खाता बनाएं',
        'Step 2: Set Up Profile': 'चरण 2: प्रोफ़ाइल सेट करें',
        'Complete your profile with necessary information': 'आवश्यक जानकारी के साथ अपनी प्रोफ़ाइल पूरी करें',
        'Step 3: Explore Features': 'चरण 3: सुविधाएं एक्सप्लोर करें',
        'Discover all available features and services': 'सभी उपलब्ध सुविधाओं और सेवाओं की खोज करें',
        'Our Features': 'हमारी सुविधाएं',
        '24/7 Support': '24/7 सहायता',
        'Round-the-clock assistance for seniors': 'वरिष्ठ नागरिकों के लिए चौबीसों घंटे सहायता',
        'Health Monitoring': 'स्वास्थ्य निगरानी',
        'Regular health checkups and monitoring': 'नियमित स्वास्थ्य जांच और निगरानी',
        'Emergency Alert': 'आपातकालीन अलर्ट',
        'Quick emergency response system': 'त्वरित आपातकालीन प्रतिक्रिया प्रणाली',
        'Contact Us': 'संपर्क करें'
    }
};

function changeLanguage(lang) {
    // Update active button state
    document.querySelectorAll('.language-selector button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(lang)) {
            btn.classList.add('active');
        }
    });

    // Update all translatable elements
    document.querySelectorAll('.translate').forEach(element => {
        const key = element.textContent;
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}