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
                    {language === 'en' ? "All bookings in one place. No hassle." : "Allar bókanir á einum stað. Ekkert vesen."}
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl text-center">
                    {language === 'en' ? (
                        "Bling is a booking system designed for venues and bars. We turn messy messages on Facebook and Instagram into an organized calendar."
                    ) : (
                        "Bling er bókunarkerfi hannað fyrir tónleikastaði og bari. Við breytum ruglingslegum skilaboðum á Facebook og Instagram í skipulagt dagatal."
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


                </div>

            </div>
        </section>
    )
}
