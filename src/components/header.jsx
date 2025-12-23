import React from "react"
import { ICELAND_REGIONS } from "../constants/locations";
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { SignupModal } from "./signup-modal"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"

import { Search, X, Menu, User, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const ADMIN_EMAILS = ['admin@bling.is', 'jonbs@bling.is'];

export function Header() {
    const { currentUser, logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();

    // Search State
    const [date, setDate] = React.useState('');
    const [location, setLocation] = React.useState('Reykjavik');
    const [type, setType] = React.useState('');
    const [showMobileSearch, setShowMobileSearch] = React.useState(false); // New Mobile State
    const navigate = require('react-router-dom').useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (date) params.set('date', date);
        if (location) params.set('location', location);
        if (type) params.set('type', type);
        setShowMobileSearch(false); // Close mobile menu on search
        navigate(`/venues?${params.toString()}`);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
            <div className="w-full px-6 flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="md:hidden p-2 text-white hover:text-[#ffd700] transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/images/bling-logo.png" alt="Bling.is" width={40} height={40} className="invert" />
                        <span className="text-2xl font-bold text-white hidden lg:block">Bling.is</span>
                    </Link>
                </div>

                {/* --- Smart Search Bar (Desktop) --- */}
                <div className="hidden md:flex items-center bg-white/10 rounded-full p-1 border border-white/10 mx-4 shadow-inner">
                    <div className="px-4 border-r border-white/10">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent text-white text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:invert cursor-pointer font-medium"
                        />
                    </div>
                    <div className="px-4 border-r border-white/10 relative group">
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer min-w-[140px] font-medium"
                        >
                            <option value="" className="text-black">{language === 'en' ? 'All Iceland' : 'Allt Ísland'}</option>
                            {ICELAND_REGIONS.map(region => (
                                <option key={region.name} value={region.name} className="text-black font-bold">
                                    {region.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
                    <div className="px-4 relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer min-w-[100px] font-medium"
                        >
                            <option value="" className="text-black">{language === 'en' ? 'Any Venue' : 'Allar Tegundir'}</option>
                            <option value="bar" className="text-black">{language === 'en' ? 'Bar / Pub' : 'Bar / Krá'}</option>
                            <option value="club" className="text-black">{language === 'en' ? 'Nightclub' : 'Skemmtistaður'}</option>
                            <option value="live" className="text-black">{language === 'en' ? 'Live Venue' : 'Tónleikastaður'}</option>
                            <option value="hall" className="text-black">{language === 'en' ? 'Banquet Hall' : 'Veislusalur'}</option>
                            <option value="restaurant" className="text-black">{language === 'en' ? 'Restaurant' : 'Veitingastaður'}</option>
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-[#ffd700] p-2.5 rounded-full hover:bg-[#ffd700]/90 transition-all hover:scale-105 shadow-lg shadow-[#ffd700]/20"
                    >
                        <Search className="w-5 h-5 text-black" />
                    </button>
                </div>

                {currentUser ? (
                    <div className="flex items-center gap-4">
                        {/* Lang Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="hidden md:flex w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 items-center justify-center text-sm font-bold text-[#ffd700] transition-colors"
                        >
                            {language === 'en' ? 'IS' : 'EN'}
                        </button>

                        {/* User Email */}
                        <div className="hidden md:block text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                            {currentUser.email}
                        </div>

                        {/* Admin Link - Only for specific emails */}
                        {ADMIN_EMAILS.includes(currentUser.email) && (
                            <Link to="/admin" className="hidden md:block text-yellow-500 hover:text-yellow-400 font-bold px-4 py-2 border border-yellow-500/30 rounded-lg bg-yellow-500/10 transition-all hover:bg-yellow-500/20">
                                Admin
                            </Link>
                        )}

                        <Link to="/create-venue" className="hidden md:block text-gray-300 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                            {language === 'en' ? '+ Add Venue Space' : '+ Bæta við rými'}
                        </Link>

                        <Link to="/dashboard" className="hidden md:block text-gray-300 hover:text-white transition-colors">
                            {language === 'en' ? 'Dashboard' : 'Mælaborð'}
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="hidden md:flex text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            {language === 'en' ? 'Log Out' : 'Útskrá'}
                        </Button>

                        {/* Mobile Menu Toggle (Simplified for now, can perform Logout/Dashboard) */}
                        <Link to="/dashboard" className="md:hidden">
                            <div className="w-8 h-8 rounded-full bg-[#ffd700] flex items-center justify-center text-black font-bold">
                                {currentUser.email[0].toUpperCase()}
                            </div>
                        </Link>

                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="hidden md:flex w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 items-center justify-center text-sm font-bold text-[#ffd700] transition-colors"
                        >
                            {language === 'en' ? 'IS' : 'EN'}
                        </button>
                        <Link to="/login">
                            <Button variant="ghost" className="text-white hover:text-[#ffd700] hover:bg-white/10">
                                Innskráning
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button
                                size="sm"
                                className="hidden md:flex bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-semibold transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                            >
                                Nýskráning
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* --- Mobile Search Overlay --- */}
            {showMobileSearch && (
                <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 animate-slide-down shadow-2xl z-40">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent text-white w-full focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10 relative">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-transparent text-white w-full focus:outline-none appearance-none"
                            >
                                <option value="" className="text-black">All Iceland</option>
                                {ICELAND_REGIONS.map(region => (
                                    <option key={region.name} value={region.name} className="text-black font-bold">
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10 relative">
                            <Search className="w-5 h-5 text-gray-400" />
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-transparent text-white w-full focus:outline-none appearance-none"
                            >
                                <option value="" className="text-black">Any Venue Type</option>
                                <option value="bar" className="text-black">Bar / Pub</option>
                                <option value="club" className="text-black">Nightclub</option>
                                <option value="hall" className="text-black">Event Hall</option>
                                <option value="restaurant" className="text-black">Restaurant</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#ffd700] p-4 rounded-xl font-bold text-black hover:bg-[#ffd700]/90 transition-all shadow-lg shadow-[#ffd700]/20 flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search Venues
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
