import React from "react"
import { Bell } from "lucide-react"

import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useLanguage } from "../context/LanguageContext"

export function Footer() {
    const { language } = useLanguage();
    const handleComingSoon = () => toast.info(language === 'en' ? "Coming soon!" : "Væntanlegt!");

    const text = {
        en: {
            desc: "Premier marketplace for discovering and booking outstanding event venues.",
            venue: "Venue",
            browse: "Browse Venues",
            list: "List Your Space",
            pricing: "Pricing",
            features: "Features",
            company: "Company",
            about: "About Us",
            careers: "Careers",
            blog: "Blog",
            press: "Press",
            support: "Support",
            help: "Help Center",
            contact: "Contact Us",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            rights: "© 2025 Bling.is. All rights reserved."
        },
        is: {
            desc: "Úrvals markaðstorg fyrir að uppgötva og bóka framúrskarandi viðburðastaði.",
            venue: "Vettvangur",
            browse: "Skoða staði",
            list: "Skrá þinn stað",
            pricing: "Verðskrá",
            features: "Eiginleikar",
            company: "Fyrirtæki",
            about: "Um okkur",
            careers: "Störf",
            blog: "Blogg",
            press: "Pressa",
            support: "Aðstoð",
            help: "Hjálp miðstöð",
            contact: "Hafa samband",
            privacy: "Persónuvernd",
            terms: "Skilmálar",
            rights: "© 2025 Bling.is. Allur réttur áskilinn."
        }
    };

    const content = text[language];

    return (
        <footer className="border-t border-[#9d4edd]/20 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <Bell className="w-6 h-6 text-[#d4af37]" />
                            <span className="text-xl font-bold gradient-text">Bling.is</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            {content.desc}
                        </p>
                    </div>

                    <div className="text-center md:text-right">
                        <Link to="/signup?intent=venue" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#ffd700] transition-colors text-lg">
                            {language === 'en' ? 'Run a venue? Join Bling' : 'Ertu með stað? Skráðu þig'} <Bell className="w-4 h-4" />
                        </Link>
                        <div className="mt-2 text-sm text-gray-500">
                            <span onClick={() => window.location.href = 'mailto:hello@bling.is'} className="cursor-pointer hover:text-white transition-colors">hello@bling.is</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#9d4edd]/20 pt-8 text-center text-sm text-gray-400">
                    <div className="mb-4">
                        <Link to="/venues" className="hover:text-[#ffd700] transition-colors font-medium">
                            {language === 'en' ? 'Browse Venues' : 'Staðir í boði'}
                        </Link>
                    </div>
                    <p>{content.rights}</p>
                </div>
            </div>
        </footer>
    )
}

