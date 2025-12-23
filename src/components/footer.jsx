import React from "react"
import { Bell } from "lucide-react"

import { Link } from "react-router-dom"
import { toast } from "sonner"

export function Footer() {
    const handleComingSoon = () => toast.info("Coming soon!");

    return (
        <footer className="border-t border-[#9d4edd]/20 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-6 h-6 text-[#d4af37]" />
                            <span className="text-xl font-bold gradient-text">Bling.is</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Úrvals markaðstorg fyrir að uppgötva og bóka framúrskarandi viðburðastaði.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Vettvangur</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/venues" className="hover:text-[#9d4edd] cursor-pointer transition-colors">Skoða staði</Link></li>
                            <li><Link to="/create-venue" className="hover:text-[#9d4edd] cursor-pointer transition-colors">Skrá þinn stað</Link></li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Verðskrá</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Eiginleikar</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Fyrirtæki</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Um okkur</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Störf</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Blogg</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Pressa</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Aðstoð</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Hjálp miðstöð</li>
                            <li onClick={() => window.location.href = 'mailto:hello@bling.is'} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Hafa samband</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Persónuvernd</li>
                            <li onClick={handleComingSoon} className="hover:text-[#9d4edd] cursor-pointer transition-colors">Skilmálar</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#9d4edd]/20 pt-8 text-center text-sm text-gray-400">
                    <p>© 2025 Bling.is. Allur réttur áskilinn.</p>
                </div>
            </div>
        </footer>
    )
}
