import React from "react"
import { Smartphone } from "lucide-react"

export function SubdomainPreview() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Ambient glow effects */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#9d4edd] rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6] rounded-full blur-[150px] opacity-20"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-glow">Þinn staður. Þinn hlekkur.</h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Fáðu sérsniðna bókunarsíðu sem endurspeglar þitt vörumerki. Deildu einum hlekk og stjórnaðu öllum bókunum á einum stað.
                        </p>
                        <div className="space-y-4">
                            <div className="glass-card rounded-xl p-4 border-l-4 border-[#ffd700]">
                                <div className="font-mono text-[#ffd700] text-lg">dillon.bling.is</div>
                                <div className="text-gray-400 text-sm mt-1">Fyrir Dillon Whiskey Bar</div>
                            </div>
                            <div className="glass-card rounded-xl p-4 border-l-4 border-[#9d4edd]">
                                <div className="font-mono text-[#9d4edd] text-lg">pablo.bling.is</div>
                                <div className="text-gray-400 text-sm mt-1">Fyrir Pablo Discobar</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="relative">
                            {/* Phone mockup */}
                            <div className="glass-card glow-border rounded-[3rem] p-4 w-80">
                                <div className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] rounded-[2.5rem] overflow-hidden border border-white/10">
                                    {/* Status bar */}
                                    <div className="h-8 flex items-center justify-between px-8 text-white text-xs">
                                        <span>9:41</span>
                                        <div className="flex gap-1 items-center">
                                            <div className="w-4 h-3 border border-white rounded-sm"></div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-6 py-8">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9d4edd] to-[#3b82f6] mx-auto mb-4"></div>
                                            <h3 className="text-white font-bold text-xl mb-2">Dillon Whiskey Bar</h3>
                                            <p className="text-gray-400 text-sm">dillon.bling.is</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="glass-card rounded-lg p-4">
                                                <div className="text-white font-semibold mb-1">Velja dagsetning</div>
                                                <div className="text-gray-400 text-sm">Lausir dagar í fjólubláu</div>
                                            </div>
                                            <div className="glass-card rounded-lg p-4">
                                                <div className="text-white font-semibold mb-1">Upplýsingar um viðburð</div>
                                                <div className="text-gray-400 text-sm">Bæta við þínum upplýsingum</div>
                                            </div>
                                            <div className="bg-[#ffd700] rounded-lg p-4 text-center">
                                                <div className="text-black font-bold">Bóka núna</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating icon */}
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#d4af37] rounded-2xl flex items-center justify-center shadow-lg">
                                <Smartphone className="w-8 h-8 text-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
