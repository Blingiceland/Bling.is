import React from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { Sparkles } from 'lucide-react';

export function Hero() {
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

                <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">

                    {/* 1. Register Venue - Hero Button - Moved to Top & Enhanced */}
                    <div className="w-full flex justify-center">
                        <Link to="/signup?intent=venue" className="group w-full max-w-2xl">
                            <button className="w-full p-6 md:p-8 rounded-2xl border-2 border-[#ffd700] bg-[#ffd700]/10 hover:bg-[#ffd700]/20 text-white text-center transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] shadow-[0_0_15px_rgba(255,215,0,0.1)] relative overflow-hidden flex flex-col items-center gap-3 md:gap-4 backdrop-blur-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity"><Sparkles className="w-32 h-32 text-[#ffd700]" /></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#ffd700] mb-1" />
                                    <div className="font-bold text-2xl md:text-4xl text-[#ffd700] mb-1 tracking-wide uppercase">
                                        {language === 'en' ? 'List Your Space' : 'Skráðu Þinn Stað'}
                                    </div>
                                    <div className="text-base md:text-lg text-gray-300 font-medium">
                                        {language === 'en' ? 'For Venue Owners' : 'Fyrir Staðarhaldara'}
                                    </div>
                                </div>
                            </button>
                        </Link>
                    </div>

                    {/* Secondary Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto w-full">

                        {/* 2. Private Event */}
                        <Link to="/venues" className="group h-full">
                            <button className="w-full h-full min-h-[140px] p-6 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-white text-left transition-all hover:-translate-y-1 flex flex-col justify-center relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-2 right-4 text-4xl opacity-20 grayscale group-hover:grayscale-0 transition-all">🥂</div>
                                <div className="relative z-10">
                                    <div className="font-bold text-xl md:text-2xl mb-2 text-white">
                                        {language === 'en' ? 'Private Event' : 'Einkaviðburður'}
                                    </div>
                                    <div className="text-sm text-gray-400 leading-snug">
                                        {language === 'en' ? 'Weddings, Birthday, or Corporate Party' : 'Brúðkaup, afmæli eða fyrirtækjapartý'}
                                    </div>
                                </div>
                            </button>
                        </Link>

                        {/* 3. Live Gig */}
                        <Link to="/venues?type=Live Venue" className="group h-full">
                            <button className="w-full h-full min-h-[140px] p-6 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-900/50 text-white text-left transition-all hover:-translate-y-1 flex flex-col justify-center relative overflow-hidden shadow-lg shadow-blue-900/10 backdrop-blur-md">
                                <div className="absolute top-2 right-4 text-4xl opacity-40 group-hover:scale-110 transition-transform">🎤</div>
                                <div className="relative z-10">
                                    <div className="font-bold text-xl md:text-2xl mb-2 text-blue-100">
                                        {language === 'en' ? 'Public Gig' : 'Opinber Viðburður'}
                                    </div>
                                    <div className="text-sm text-blue-200/70 leading-snug">
                                        {language === 'en' ? 'Concerts, stand-up or other entertainment' : 'Tónleikar, uppistand eða annað skemmtanahald'}
                                    </div>
                                </div>
                            </button>
                        </Link>

                    </div>
                </div>

            </div>
        </section>
    )
}
