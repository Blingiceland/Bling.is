import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
    return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
    // Default to 'is' (Icelandic) if no preference, or 'en' if user wants. 
    // Actually, user asked for "Bling. It's Booked" in English and "IS version" available.
    // So default 'en'? Or maybe 'is' since it's an Icelandic site originally?
    // Let's stick with 'en' as default since the user just asked to change the main header to English.
    // wait, "can you change that to Bling, and its Booked - in English.. and I also want an IS version"
    // This implies English is the primary/default now.

    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'is' : 'en');
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        isIcelandic: language === 'is'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
