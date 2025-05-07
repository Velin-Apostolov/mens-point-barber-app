import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            gallery: "Gallery",
            about: "About Me",
            home: "Home",
            upcoming: 'Upcoming',
            past: 'Past',
        },
    },
    bg: {
        translation: {
            gallery: "Галерия",
            about: "За Мен",
            home: "Начало",
            upcoming: 'Предстоящи',
            past: 'Предишни',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
