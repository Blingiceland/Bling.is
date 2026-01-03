import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Smartphone, Globe, Shield, Activity, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ContactModal from './ContactModal';

export function LandingContent() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const text = {
        en: {
            whatIsBlingHeading: <>What is <span className="text-[#ffd700]">Bling?</span></>,
            whatIsBlingP1: "Bling is a booking and promotion platform for bars and venues that host live events, private functions, or both. It’s built with real-world operations in mind and makes it easy for people to book events directly — with clear expectations, fewer questions, and more confirmed bookings.",
            whatIsBlingP2: "Bling works whether you already have a website, want to connect bookings through social media, or prefer a simple standalone booking page. You can start where you are and grow from there.",
            whatIsBlingHighlight: "Bling is especially well suited for venues outside major city centers.",
            inShortHeading: "In Short",
            inShort1Title: "All bookings in one place",
            inShort1Desc: "Centralized management for every event type.",
            inShort2Title: "Fewer inquiries, more confirmed requests",
            inShort2Desc: "Filter out the noise and focus on real bookings.",
            inShort3Title: "Works with what you already have",
            inShort3Desc: "Integrates with your existing workflow.",
            featuresHeading: "Features",
            featuresP1: "Bling brings together what is often scattered across emails, messages, and spreadsheets: event promotion, booking requests, and a clear overview of your venue’s activity.",
            featuresP2: "The platform supports both public events — such as concerts, comedy nights, and ticketed shows — and private events like birthdays, weddings, and corporate bookings. Requests are structured, information is standardized, and bookings are more serious from the start.",
            feat1Title: "Public Events",
            feat1Desc: "Streamlined tools for concerts, comedy, and ticketed shows.",
            feat2Title: "Private Inquiries",
            feat2Desc: "Structured forms for weddings, parties, and corporate events.",
            feat3Title: "Clear Overview",
            feat3Desc: "Less daily admin and follow-up with a unified dashboard.",
            yourVenueHeading: "Your Venue",
            yourVenueP1: "No two venues are the same — and no single setup works for everyone. Bling is designed to work with what you already use.",
            yourVenueP2: "If you have a website, Bling can be connected directly to it. If you don’t, or if you want something simpler, you can use Bling through a single booking link that you share on social media or in ads.",
            yourVenueP3: "For venues that want to go further, we can also build a new website designed specifically around the venue and its booking flow — but this is never required to get started.",
            flexTitle: "Flexibility",
            flex1Title: "Works with your website",
            flex1Desc: "Bling can be connected directly to your existing site.",
            flex2Title: "Or with a single link",
            flex2Desc: "Use Bling as a standalone booking page for social media.",
            flex3Title: "New website optional",
            flex3Desc: "We can build a dedicated site, but it's never required.",
            howItWorksHeading: "How It Works",
            howItWorksP1: "Getting started is simple. We set up Bling for your venue and tailor how it’s connected, whether through your website, social channels, or a dedicated booking page.",
            howItWorksP2: "Clients book directly with all the information you need, and you receive clear, structured requests instead of vague messages and endless follow-ups.",
            inBriefTitle: "In Brief",
            brief1: "No requirement for a new website",
            brief2: "One system, multiple ways to use it",
            brief3: "Confirmed booking requests",
            brief4: "Better visibility and control",
            lookingAheadTitle: "Looking Ahead",
            lookingAheadP1: "Bling is designed as a platform, not just a tool. The goal is to strengthen venues — especially outside major cities — by making them more visible, more professional, and easier to book.",
            lookingAheadHighlight: "A system that adapts to you.",
            ctaHeading: "Ready to get started?",
            ctaDesc: "If you’d like to see how Bling could work for your venue, we can set up a walkthrough based on what you already have.",
            ctaBtnReg: "Register your venue",
            ctaBtnContact: "Get in touch"
        },
        is: {
            whatIsBlingHeading: <>Hvað er <span className="text-[#ffd700]">Bling?</span></>,
            whatIsBlingP1: "Bling er bókunar- og kynningarvettvangur fyrir bari og venues sem halda tónleika, einkaviðburði eða hvort tveggja. Lausnin er byggð með raunverulegan rekstur í huga og gerir fólki kleift að bóka viðburði beint — með skýrari upplýsingum, færri spurningum og fleiri staðfestum bókunum.",
            whatIsBlingP2: "Bling virkar hvort sem þú ert með heimasíðu í dag, vilt tengjast bókunum í gegnum samfélagsmiðla eða kýst einfaldan, sjálfstæðan bókunarhlekk. Þú getur byrjað þar sem þú ert og byggt ofan á það eftir þörfum.",
            whatIsBlingHighlight: "Bling hentar sérstaklega vel fyrir staði utan höfuðborgarsvæðisins.",
            inShortHeading: "Í stuttu máli",
            inShort1Title: "Allar bókanir á einum stað",
            inShort1Desc: "Miðlæg umsýsla fyrir allar tegundir viðburða.",
            inShort2Title: "Færri fyrirspurnir, fleiri staðfestingar",
            inShort2Desc: "Minni hávaði, meiri fókuse á raunverulegar bókanir.",
            inShort3Title: "Tengist við það sem þú ert nú þegar með",
            inShort3Desc: "Fellur að þínu núverandi vinnulagi.",
            featuresHeading: "Eiginleikar",
            featuresP1: "Bling sameinar það sem oft er dreift á marga staði: viðburðakynningu, bókunarbeiðnir og yfirsýn yfir starfsemi staðarins.",
            featuresP2: "Í stað þess að halda utan um viðburði í tölvupósti, skilaboðum og skjölum færðu eina lausn þar sem allt er á einum stað. Kerfið styður bæði opinbera viðburði, eins og tónleika og uppistand, og einkaviðburði á borð við afmæli, brúðkaup og fyrirtækjaviðburði. Beiðnir eru skýrar, upplýsingar staðlaðar og bókanir alvarlegri frá upphafi.",
            feat1Title: "Opinberir viðburðir",
            feat1Desc: "Einfaldari utanumhald fyrir tónleika, uppistand og miðasölu.",
            feat2Title: "Einkaviðburðir",
            feat2Desc: "Staðlaðar fyrirspurnir fyrir brúðkaup, afmæli og fyrirtæki.",
            feat3Title: "Skýr yfirsýn",
            feat3Desc: "Minna vesen í daglegum samskiptum og betri yfirsýn.",
            yourVenueHeading: "Þinn staður",
            yourVenueP1: "Engir tveir staðir eru eins — og engin ein lausn hentar öllum. Bling er hannað til að vinna með því sem þú ert nú þegar með.",
            yourVenueP2: "Ef þú ert með heimasíðu er hægt að tengja Bling beint við hana. Ef þú ert ekki með síðu, eða vilt einfaldari lausn, geturðu notað Bling í gegnum einn bókunarhlekk sem þú deilir á samfélagsmiðlum eða í auglýsingum.",
            yourVenueP3: "Fyrir þá sem vilja ganga lengra er einnig í boði að byggja nýja heimasíðu sem er sérstaklega hönnuð utan um staðinn og bókunarferlið — en það er alls ekki nauðsynlegt til að byrja.",
            flexTitle: "Sveigjanleiki",
            flex1Title: "Virkar með núverandi heimasíðu",
            flex1Desc: "Hægt að tengja Bling beint við hana.",
            flex2Title: "Eða bara með einum hlekk",
            flex2Desc: "Auðvelt að deila á samfélagsmiðlum.",
            flex3Title: "Ný heimasíða valkvæð",
            flex3Desc: "Í boði ef vilji er til, en ekki nauðsyn.",
            howItWorksHeading: "Hvernig þetta virkar",
            howItWorksP1: "Ferlið er einfalt, bæði fyrir þig og þá sem vilja bóka staðinn. Við setjum upp Bling fyrir þinn stað og aðlögum tenginguna að því sem hentar best — hvort sem það er heimasíða, samfélagsmiðlar eða sérstök bókunarsíða.",
            howItWorksP2: "Viðskiptavinir bóka beint með öllum nauðsynlegum upplýsingum og þú færð skýrar, staðfestar beiðnir í stað óljósra spurninga og endalausra skilaboða.",
            inBriefTitle: "Í stuttu máli",
            brief1: "Engin krafa um nýja heimasíðu",
            brief2: "Ein lausn, margir möguleikar",
            brief3: "Staðfestar bókanir",
            brief4: "Betri yfirsýn",
            lookingAheadTitle: "Framtíðarsýn",
            lookingAheadP1: "Bling er hugsað sem vettvangur, ekki bara tól. Markmiðið er að styrkja stöðu venues — sérstaklega utan höfuðborgarsvæðisins — og gera þeim kleift að vera sýnilegri, faglegri og auðveldari í bókun, óháð stærð eða tæknilegri stöðu í dag.",
            lookingAheadHighlight: "Lausn sem aðlagast þér.",
            ctaHeading: "Viltu pröfa?",
            ctaDesc: "Ef þú vilt sjá hvernig Bling gæti virkað fyrir þinn stað setjum við upp kynningu sem byggir á því sem þú ert nú þegar með. Finnum lausn sem hentar.",
            ctaBtnReg: "Skráðu þinn stað",
            ctaBtnContact: "Hafðu samband"
        }
    };

    const content = text[language];

    return (
        <div className="bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#ffd700] selection:text-black">

            {/* SECTION 1: What is Bling? */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {content.whatIsBlingHeading}
                        </h2>
                        <div className="space-y-6 text-lg leading-relaxed">
                            <p>{content.whatIsBlingP1}</p>
                            <p>{content.whatIsBlingP2}</p>
                            <p className="text-white font-medium border-l-4 border-[#ffd700] pl-4">
                                {content.whatIsBlingHighlight}
                            </p>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="glass-card p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity className="w-32 h-32 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="w-8 h-1 bg-[#ffd700]"></span> {content.inShortHeading}
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 rounded-full bg-[#ffd700]/10 text-[#ffd700]">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-lg">{content.inShort1Title}</span>
                                    <span className="text-sm">{content.inShort1Desc}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 rounded-full bg-[#ffd700]/10 text-[#ffd700]">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-lg">{content.inShort2Title}</span>
                                    <span className="text-sm">{content.inShort2Desc}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 rounded-full bg-[#ffd700]/10 text-[#ffd700]">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-lg">{content.inShort3Title}</span>
                                    <span className="text-sm">{content.inShort3Desc}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Features */}
            <section className="py-24 px-6 md:px-12 bg-white/5 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.featuresHeading}</h2>
                        <p className="text-lg leading-relaxed">
                            {content.featuresP1}
                        </p>
                        <p className="text-lg leading-relaxed mt-4">
                            {content.featuresP2}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#ffd700]/50 transition-colors group">
                            <div className="w-12 h-12 bg-[#ffd700]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-[#ffd700]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{content.feat1Title}</h3>
                            <p className="text-gray-400">{content.feat1Desc}</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#ffd700]/50 transition-colors group">
                            <div className="w-12 h-12 bg-[#ffd700]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-[#ffd700]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{content.feat2Title}</h3>
                            <p className="text-gray-400">{content.feat2Desc}</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#ffd700]/50 transition-colors group">
                            <div className="w-12 h-12 bg-[#ffd700]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6 text-[#ffd700]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{content.feat3Title}</h3>
                            <p className="text-gray-400">{content.feat3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Your Venue */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="glass-card p-10 rounded-3xl border border-white/10 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-50"></div>
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#ffd700]"></span> {content.flexTitle}
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">{content.flex1Title}</h4>
                                    <p className="text-sm">{content.flex1Desc}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">{content.flex2Title}</h4>
                                    <p className="text-sm">{content.flex2Desc}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-2">{content.flex3Title}</h4>
                                    <p className="text-sm">{content.flex3Desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{content.yourVenueHeading}</h2>
                        <div className="space-y-6 text-lg leading-relaxed">
                            <p>{content.yourVenueP1}</p>
                            <p>{content.yourVenueP2}</p>
                            <p>{content.yourVenueP3}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: How It Works & Looking Ahead (Combined for flow) */}
            <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-white/5 to-transparent border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{content.howItWorksHeading}</h2>
                    <p className="text-lg leading-relaxed mb-6">
                        {content.howItWorksP1}
                    </p>
                    <p className="text-lg leading-relaxed">
                        {content.howItWorksP2}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    <div className="p-8 rounded-2xl bg-black/40 border border-white/10">
                        <h3 className="text-xl font-bold text-[#ffd700] mb-4">{content.inBriefTitle}</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white" /> {content.brief1}</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white" /> {content.brief2}</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white" /> {content.brief3}</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white" /> {content.brief4}</li>
                        </ul>
                    </div>
                    <div className="p-8 rounded-2xl bg-black/40 border border-white/10">
                        <h3 className="text-xl font-bold text-[#ffd700] mb-4">{content.lookingAheadTitle}</h3>
                        <p className="text-gray-300 mb-4">
                            {content.lookingAheadP1}
                        </p>
                        <div className="font-bold text-white">{content.lookingAheadHighlight}</div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: Call to Action */}
            <section className="py-32 px-6 md:px-12 bg-[#ffd700] text-black text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">{content.ctaHeading}</h2>
                    <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">
                        {content.ctaDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/signup?intent=venue')}
                            className="px-8 py-4 bg-black text-white text-lg font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
                        >
                            {content.ctaBtnReg}
                        </button>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="px-8 py-4 bg-transparent border-2 border-black text-black text-lg font-bold rounded-xl hover:bg-black/5 transition-colors"
                        >
                            {content.ctaBtnContact}
                        </button>
                    </div>
                </div>
            </section>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
}
