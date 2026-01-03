import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { SignupModal } from "./signup-modal"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"

import { Search, X, Menu, User } from 'lucide-react';

const ADMIN_EMAILS = ['admin@bling.is', 'jonbs@bling.is', 'jon@bling.is', 'jonb.steinsson@gmail.com'];

export function Header() {
    const { currentUser, logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
            <div className="w-full px-6 flex items-center justify-between py-4 relative">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4 z-20">
                    {/* Mobile: Link to Venues (Visible on simple mobile view) */}
                    <Link to="/venues" className="md:hidden bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
                        {language === 'en' ? 'Browse' : 'Skoða'}
                    </Link>

                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/images/bling-logo.png" alt="Bling.is" width={40} height={40} className="invert" />
                        <span className="text-2xl font-bold text-white hidden lg:block">Bling.is</span>
                    </Link>
                </div>

                {/* CENTER SECTION - ABSOLUTE POSITIONED */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full justify-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <Link to="/venues" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 whitespace-nowrap text-base">
                            {language === 'en' ? 'Browse Venues' : 'Staðir í Boði'}
                        </Link>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="z-20">
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

                            {/* Mobile Menu User Icon */}
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
            </div>
        </header>
    )
}
