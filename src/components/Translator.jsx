import { useEffect, useState } from 'react';
import './Translator.css';

const LANGUAGES = [
    { code: 'cs', name: 'čeština', flag: 'cz' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'es', name: 'español', flag: 'es' },
    { code: 'fr', name: 'français', flag: 'fr' },
    { code: 'id', name: 'indonesia', flag: 'id' },
    { code: 'km', name: 'ខ្មែរ', flag: 'kh' },
    { code: 'it', name: 'italiano', flag: 'it' },
    { code: 'no', name: 'norsk', flag: 'no' },
    { code: 'pl', name: 'polski', flag: 'pl' },
    { code: 'pt', name: 'português', flag: 'pt' },
    { code: 'fi', name: 'suomi', flag: 'fi' },
    { code: 'sv', name: 'svenska', flag: 'se' },
    { code: 'ru', name: 'русский', flag: 'ru' },
    { code: 'fa', name: 'فارسی', flag: 'ir' },
    { code: 'hi', name: 'हिन्दी', flag: 'in' },
    { code: 'bn', name: 'বাংলা', flag: 'bd' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: 'in' },
    { code: 'gu', name: 'ગુજરાતી', flag: 'in' },
    { code: 'ta', name: 'தமிழ்', flag: 'in' },
    { code: 'te', name: 'తెలుగు', flag: 'in' },
    { code: 'ml', name: 'മലയാളം', flag: 'in' },
    { code: 'th', name: 'ไทย', flag: 'th' },
    { code: 'zh-CN', name: '中文(简体)旧版', flag: 'cn' },
    { code: 'zh-TW', name: '中文(繁體)舊版', flag: 'tw' },
];

const Translator = () => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const [currentLang, setCurrentLang] = useState(() => {
        const cookie = getCookie('googtrans');
        if (cookie) {
            const parts = cookie.split('/');
            return parts[parts.length - 1] || 'en';
        }
        return 'en';
    });
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (langCode) => {
        // Show loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'translator-loading-overlay';
        overlay.innerHTML = '<div class="translator-loading-spinner"></div>';
        document.body.appendChild(overlay);

        // 1. Clear existing cookies
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;

        // 2. Set new cookie if not English
        if (langCode !== 'en') {
            document.cookie = `googtrans=/auto/${langCode}; path=/;`;
            document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${window.location.hostname}`;
        }

        // 3. Reload with a slight delay to ensure overlay is visible
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    useEffect(() => {
        const checkCombo = setInterval(() => {
            const combo = document.querySelector('.goog-te-combo');
            if (combo) {
                if (combo.value && combo.value !== 'en' && combo.value !== currentLang) {
                    setCurrentLang(combo.value);
                }
                clearInterval(checkCombo);
            }
        }, 1000);

        return () => clearInterval(checkCombo);
    }, [currentLang]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES.find(l => l.code === 'en');

    return (
        <div className="translator-container">
            <div id="google_translate_element" style={{ display: 'none' }} />

            <div className="current-language" onClick={toggleDropdown}>
                <img
                    src={`https://flagcdn.com/w20/${currentLangData.flag}.png`}
                    alt={currentLangData.name}
                    className="flag-icon"
                />
                <span className="lang-name">{currentLangData.name}</span>
                <span className="dropdown-arrow">▼</span>
            </div>

            {isOpen && (
                <div className="language-dropdown">
                    {LANGUAGES.map((lang) => (
                        <div
                            key={lang.code}
                            className={`language-option ${currentLang === lang.code ? 'active' : ''}`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <img
                                src={`https://flagcdn.com/w20/${lang.flag}.png`}
                                alt={lang.name}
                                className="flag-icon"
                            />
                            <span className="lang-name">{lang.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Translator;
