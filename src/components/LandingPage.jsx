import React from "react"
import { Hero } from "./hero"
import { LandingContent } from "./LandingContent"
import { SubdomainPreview } from "./subdomain-preview"
import { Header } from "./header"

export function LandingPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Header />
            <Hero />
            <LandingContent />
            <SubdomainPreview />
        </main>
    )
}
