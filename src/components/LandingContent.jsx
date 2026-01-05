import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Music, ArrowRight, LayoutDashboard, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ContactModal from './ContactModal';

export function LandingContent() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Hardcoding B2B content as requested (Icelandic primarily)
    // We can add EN translation later if needed, but for now prompt specified specific IS text.
    // I will include EN fallbacks similar to the IS text to keep the structure valid.

    const text = {
        is: {
            heroTitle: "Allar bókanir á einum stað. Ekkert vesen.",
            heroSub: "Bling er bókunarkerfi hannað fyrir tónleikastaði og bari. Við breytum ruglingslegum skilaboðum á Facebook og Instagram í skipulagt dagatal.",
            heroBtn: "Skráðu þinn stað",
            heroLink: "Sjáðu hvernig þetta virkar á dillon.bling.is",
            screenshotLabel: "Mælaborð Bling",

            originTitle: "Hannað í skotgröfunum",
            originText: "Bling var ekki hannað í fundarherbergi úti í bæ. Það var smíðað í barborðinu á Dillon til að leysa raunverulegt vandamál: Við vorum að drukkna í skilaboðum og misstu af bókunum. Við þurftum kerfi sem skildi bransann, sparaði tíma og minnkaði stress. Nú er sú lausn í boði fyrir þig.",

            card1Title: "Hættu að elta fólk í einkaskilaboðum og tölvupóstum",
            card1Text: "Sendu einn hlekk. Fólk fyllir út það sem þarf (tímasetningu, fjölda, tæknilista). Þú samþykkir eða hafnar með einum smelli.",

            card2Title: "Auðveldara fyrir „Upcoming“ senuna",
            card2Text: "Listamenn fá skýrt ferli til að koma sér á framfæri. Þeir vita nákvæmlega hvaða upplýsingar þú þarft, sem minnkar fram-og-til-baka spurningar um 90%.",

            footerTitle: "Ertu með stað? Prófaðu Bling.",
            footerBtn: "Skráðu þinn stað"
        },
        en: {
            heroTitle: "All bookings in one place. No hassle.",
            heroSub: "Bling is a booking system designed for venues and bars. We turn messy messages on Facebook and Instagram into an organized calendar.",
            heroBtn: "Register your venue",
            heroLink: "See how it works at dillon.bling.is",
            screenshotLabel: "Bling Dashboard",

            originTitle: "Built in the trenches",
            originText: "Bling wasn't built in an office. It was built to solve problems at Dillon. We needed a way to manage hundreds of requests from bands and private parties without losing our minds. Now the solution is available for you.",

            card1Title: "Stop chasing people in DMs",
            card1Text: "Send one link. People fill out what they need (time, count, tech rider). You approve or decline with one click.",

            card2Title: "Easier for the 'Upcoming' scene",
            card2Text: "Artists get a clear process to promote themselves. They know exactly what information you need, reducing back-and-forth questions by 90%.",

            footerTitle: "Run a venue? Try Bling.",
            footerBtn: "Register your venue"
        }
    };

    const content = text[language] || text.is;

    return (
        <div className="bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#ffd700] selection:text-black">

            {/* 1. HERO SECTION */}
            <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

                    {/* Left: Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {content.heroTitle}
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                            {content.heroSub}
                        </p>

                        <div className="flex flex-col items-center md:items-start gap-4">
                            <button
                                onClick={() => navigate('/signup?intent=venue')}
                                className="px-8 py-4 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold text-lg rounded-xl transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                            >
                                {content.heroBtn}
                            </button>

                            <a
                                href="https://dillon.bling.is"
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-gray-500 hover:text-[#ffd700] transition-colors flex items-center gap-1"
                            >
                                {content.heroLink} <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Dashboard Screenshot Placeholder */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700] to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-[16/10] bg-[#1a1a1a] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                            <div className="text-center p-8">
                                <LayoutDashboard className="w-16 h-16 text-[#ffd700] mx-auto mb-4 opacity-50" />
                                <span className="text-gray-500 font-mono text-sm border border-gray-700 px-3 py-1 rounded bg-black/50">
                                    {content.screenshotLabel} (Insert Screenshot)
                                </span>
                            </div>

                            {/* Abstract UI Mockup Elements */}
                            <div className="absolute top-4 left-4 right-4 h-8 bg-white/5 rounded-lg w-3/4"></div>
                            <div className="absolute top-16 left-4 right-4 bottom-4 grid grid-cols-3 gap-4 opacity-30">
                                <div className="bg-white/5 rounded-lg col-span-2 h-full"></div>
                                <div className="bg-white/5 rounded-lg col-span-1 h-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ORIGIN STORY */}
            <section className="py-24 px-6 md:px-12 bg-[#111] border-y border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-8">
                        <span className="text-2xl">🍻</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                        {content.originTitle}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                        "{content.originText}"
                    </p>
                </div>
            </section>

            {/* 3. FEATURE SPLIT */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Venue Card */}
                    <div className="glass-card p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-[#ffd700]/30 transition-all group">
                        <div className="w-14 h-14 bg-[#ffd700]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Settings className="w-7 h-7 text-[#ffd700]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{content.card1Title}</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {content.card1Text}
                        </p>
                    </div>

                    {/* Artist Card */}
                    <div className="glass-card p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-purple-500/30 transition-all group">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Music className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{content.card2Title}</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {content.card2Text}
                        </p>
                    </div>

                </div>
            </section>

            {/* 4. FOOTER CTA */}
            <section className="py-32 px-6 md:px-12 bg-[#ffd700] text-black text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight">
                        {content.footerTitle}
                    </h2>
                    <button
                        onClick={() => navigate('/signup?intent=venue')}
                        className="px-10 py-5 bg-black text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform shadow-2xl"
                    >
                        {content.footerBtn}
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold opacity-70">
                        <Check className="w-4 h-4" /> Ekkert kreditkort. Engin skuldbinding.
                    </div>
                </div>

                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black rounded-full blur-3xl"></div>
                </div>
            </section>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
}
