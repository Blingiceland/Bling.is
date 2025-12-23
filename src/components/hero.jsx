import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useLanguage } from "../context/LanguageContext"
import { Search, Sparkles } from 'lucide-react';

export function Hero() {
    const [bookingMode, setBookingMode] = useState(false);
    const navigate = useNavigate();
    const { language } = useLanguage();

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="/images/bling.png"
                    alt="Luxury service bell on reflective surface with purple and blue gradient lighting"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center justify-center min-h-screen pt-20">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-white text-glow text-center">
                    {language === 'en' ? "Bling. It's Booked." : "Bling. Það er Bókað."}
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl text-center">
                    {language === 'en' ? (
                        <>
                            Bling is a simple way to book and host events. Whether you’re a venue, an artist or promoter, or someone looking for a space for a private event, Bling helps you connect, book, and move forward — without unnecessary back and forth.
                            <span className="block mt-4 text-[#ffd700] font-medium">Choose what best describes you to get started.</span>
                        </>
                    ) : (
                        <>
                            Bling er einföld leið til að bóka og halda viðburði. Hvort sem þú ert rekstraraðili, listamaður eða prómóter, eða ert að leita að stað fyrir einkaviðburð, hjálpar Bling þér að tengjast, bóka og halda áfram — án óþarfa fram og til baka.
                            <span className="block mt-4 text-[#ffd700] font-medium">Veldu það sem á best við þig til að byrja.</span>
                        </>
                    )}
                </p>

                <div className="glass-card p-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md w-full max-w-4xl mx-auto shadow-2xl">
                    {!bookingMode ? (
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold text-white mb-6 text-center">
                                {language === 'en' ? 'What are you looking for?' : 'Hverju ertu að leita eftir?'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button
                                    onClick={() => setBookingMode(true)}
                                    className="group p-8 rounded-xl bg-[#ffd700] hover:bg-[#ffd700]/90 text-black text-left transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] h-full min-h-[160px] flex flex-col justify-center"
                                >
                                    <div className="mb-4">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <div className="font-bold text-2xl mb-1">
                                        {language === 'en' ? 'Find a Venue' : 'Finna Stað'}
                                    </div>
                                    <div className="text-base opacity-80 font-medium tracking-wide">
                                        {language === 'en' ? 'For Gigs & Parties' : 'Fyrir Viðburði & Veislur'}
                                    </div>
                                </button>

                                <Link to="/signup?intent=venue" className="block h-full">
                                    <button className="w-full h-full min-h-[160px] group p-8 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-left transition-all hover:-translate-y-1 flex flex-col justify-center">
                                        <div className="mb-4">
                                            <Sparkles className="w-10 h-10 text-[#ffd700]" />
                                        </div>
                                        <div className="font-bold text-2xl mb-1">
                                            {language === 'en' ? 'List Your Space' : 'Skráðu Þinn Stað'}
                                        </div>
                                        <div className="text-base text-gray-400">
                                            {language === 'en' ? 'For Venue Owners' : 'Fyrir Staðarhaldara'}
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="navigate-animation">
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <h3 className="text-2xl font-bold text-white">
                                    {language === 'en' ? 'What kind of event?' : 'Hvernig viðburður?'}
                                </h3>
                                <button onClick={() => setBookingMode(false)} className="text-base font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    ← {language === 'en' ? 'Back' : 'Til baka'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => navigate('/signup?intent=profile')}
                                    className="group p-6 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/10 hover:bg-[#ffd700]/20 flex items-center gap-6 transition-all hover:scale-[1.02]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#ffd700]/20 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,215,0,0.2)]">🎤</div>
                                    <div className="text-left">
                                        <div className="font-bold text-xl text-[#ffd700] mb-1">
                                            {language === 'en' ? 'Public Gig' : 'Opinber Viðburður'}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {language === 'en' ? 'I am an Artist or Promoter looking for a stage' : 'Tónleikar, uppistand eða annað skemmtanahald'}
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => navigate('#private-search')}
                                    className="group p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 flex items-center gap-6 transition-all hover:scale-[1.02]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">🥂</div>
                                    <div className="text-left">
                                        <div className="font-bold text-xl text-white mb-1">
                                            {language === 'en' ? 'Private Event' : 'Einkaviðburður'}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {language === 'en' ? 'Wedding, Birthday, or Corporate Party' : 'Brúðkaup, afmæli eða fyrirtækjapartý'}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
