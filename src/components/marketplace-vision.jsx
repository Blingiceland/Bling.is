import React from "react"
import { Sparkles, Users, TrendingUp } from "lucide-react"

export function MarketplaceVision() {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="glass-card glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9d4edd]/20 via-[#3b82f6]/20 to-[#ffd700]/20 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Sparkles className="w-10 h-10 text-black" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">Markaðstorg kemur bráðlega</h2>

                        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Núna færðu þinn eigin sérsniðna bókunarhlekkur. Bráðlega erum við að setja í loftið{" "}
                            <span className="text-[#ffd700] font-semibold">Bling farsíma app</span> — markaðstorg þar sem aðdáendur og
                            listamenn uppgötva staði eins og þinn.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#9d4edd] to-[#8b5cf6] rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Fyrir aðdáendur</h3>
                                <p className="text-gray-400 text-sm">Uppgötva og bóka upplifanir á fremstu stöðum</p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Fyrir listamenn</h3>
                                <p className="text-gray-400 text-sm">Finna og bóka staði fyrir tónleika eða sýningar</p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#d4af37] rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Fyrir þig</h3>
                                <p className="text-gray-400 text-sm">Kynntu þig fyrir stórum hópi  mögulegra viðskiptavina og/eða listamanna</p>
                            </div>
                        </div>

                        <p className="text-gray-400">
                            Fyrstu notendur fá <span className="text-[#ffd700] font-semibold">úrvals sýnileika</span> þegar
                            markaðstorg fer í loftið.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
