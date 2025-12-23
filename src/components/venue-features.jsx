import React from "react"
import { Calendar, Shield, CheckCircle2 } from "lucide-react"

export function VenueFeatures() {
    const features = [
        {
            icon: Calendar,
            title: "Sjálfvirk Google Sheets samstilling",
            description:
                "Þínar bókanir samstillast sjálfkrafa við þitt núverandi dagatal kerfi. Engin handvirk skráning, engar villur.",
            color: "from-[#9d4edd] to-[#8b5cf6]",
        },
        {
            icon: Shield,
            title: "Áhættulausar tryggingargreiðslur",
            description:
                "Innheimta tafarlausar tryggingargreiðslur til að tryggja bókanir. Peningar á þinn reikning áður en viðburður fer fram.",
            color: "from-[#3b82f6] to-[#06b6d4]",
        },
        {
            icon: CheckCircle2,
            title: "Einsmellis samþykki listamanna",
            description: "Yfirfara bókunarbeiðnir og samþykkja eða hafna með einum smelli. Full stjórn, engin vesen.",
            color: "from-[#ffd700] to-[#d4af37]",
        },
    ]

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow">
                        Hannað fyrir eigendur viðburðastaða
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Allt sem þú þarft til að reka þinn stað á sem hagkvæmasta máta
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="glass-card glow-border rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                                >
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
