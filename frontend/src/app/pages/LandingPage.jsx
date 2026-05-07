"use client";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { ExperienceHighlights } from "../components/ExperienceHighlights";
import { FlightTimeline } from "../components/FlightTimeline";
import { SafetySection } from "../components/SafetySection";
import { ThingsToCarry } from "../components/ThingsToCarry";
import { FAQ } from "../components/FAQ";
import { Testimonials } from "../components/Testimonials";
import { FutureAdventures } from "../components/FutureAdventures";
import { FloatingCTA } from "../components/FloatingCTA";
import { Footer } from "../components/Footer";
import { LiveNotifications } from "../components/LiveNotifications";
import { useNavigate, useSearchParams } from "react-router";
export function LandingPage({ onBookClick }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ref = searchParams.get("ref");

    const handleBookClick = (packageId) => {
        onBookClick?.();
        setTimeout(() => {
            let url = "/book";
            const params = new URLSearchParams();
            if (packageId) params.set("pkg", packageId);
            if (ref) params.set("ref", ref);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            navigate(url);
        }, 500);
    };
    return (<div className="min-h-[100dvh] bg-[#0B0F19] overflow-x-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero onBookClick={() => handleBookClick()} />

        {/* Experience Highlights */}
        <ExperienceHighlights />

        {/* Flight Timeline */}
        <FlightTimeline />

        {/* Safety Section */}
        <SafetySection />

        {/* Things To Carry */}
        <ThingsToCarry />

        {/* FAQ Section */}
        <FAQ />

        {/* Testimonials */}
        <Testimonials />

        {/* Future Adventures */}
        <FutureAdventures />

        {/* Map Location Section */}
        <section className="py-20 bg-[#111827]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Location</h2>
                    <p className="text-white/70">Find us easily and start your premium adventure today.</p>
                </div>
                <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px]">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.03102409015!2d74.49315091157973!3d19.77138788150495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc5b40353b0073%3A0xf81cc88003c0a0c5!2sGoldwing%20Adventure!5e0!3m2!1sen!2sin!4v1713892288151!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade" 
                        title="Goldwing Location"
                        className="opacity-90"
                    ></iframe>
                </div>
            </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Floating CTA */}
        <FloatingCTA onBookClick={() => handleBookClick()} />

        {/* Live Notifications */}
        <LiveNotifications />
    </div>);
}
