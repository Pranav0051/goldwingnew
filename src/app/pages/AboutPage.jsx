import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Shield, Users, Heart, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router";

export function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/artifacts/about_hero_bg_1772603421107.png"
                        alt="About Hero"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/40 via-transparent to-[#0B0F19]" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-4 md:mb-6 tracking-tighter uppercase italic leading-none">
                            Redefining <span className="text-[#F4B400]">Adventure</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
                            Goldwing Adventure Tours brings you the ultimate sky-high experience with world-class safety and premium luxury.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 md:py-24 px-4 bg-[#0B0F19]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 tracking-tight uppercase">
                            Our <span className="text-[#F4B400]">Story</span>
                        </h2>
                        <div className="space-y-4 md:space-y-6 text-base sm:text-lg text-white/70 leading-relaxed">
                            <p>
                                Founded in 2020, Goldwing Adventure Tours started with a single mission: to make the dream of flying accessible to everyone while maintaining the highest standards of luxury and safety.
                            </p>
                            <p>
                                What began as a passion project for a small group of pilots has now grown into India's premier paramotoring adventure company, operating in multiple locations and serving thousands of thrill-seekers every year.
                            </p>
                            <p>
                                We believe that adventure shouldn't come at the cost of comfort. That's why every Goldwing experience is curated to provide not just a flight, but a memory that lasts a lifetime.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 border-[#F4B400]/20 shadow-[0_0_50px_rgba(244,180,0,0.15)] group">
                            <img
                                src="/images/background/premium.png"
                                alt="Our Story"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Stats Floating Card - Desktop Only */}
                        <div className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl hidden lg:block">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <h4 className="text-3xl font-black text-[#F4B400]">10K+</h4>
                                    <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Flights</p>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-3xl font-black text-[#F4B400]">50+</h4>
                                    <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Pilots</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter uppercase">
                            Why <span className="text-[#F4B400]">Goldwing?</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">Discover what makes our sky adventures truly world-class.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#F4B400]" />,
                                title: "Uncompromised Safety",
                                desc: "We use state-of-the-art paramotoring gear and every pilot is certified with over 500+ hours of flight time."
                            },
                            {
                                icon: <Heart className="w-8 h-8 md:w-10 md:h-10 text-[#F4B400]" />,
                                title: "Premium Experience",
                                desc: "From luxury pick-ups to 4K video recording, we ensure every detail of your journey feels premium."
                            },
                            {
                                icon: <Star className="w-8 h-8 md:w-10 md:h-10 text-[#F4B400]" />,
                                title: "Expert Pilots",
                                desc: "Our team consists of national-level paramotoring champions and highly trained safety professionals."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] hover:border-[#F4B400]/40 transition-colors group"
                            >
                                <div className="mb-5 md:mb-6 bg-white/10 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 md:py-24 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-gradient-to-r from-[#F4B400] to-[#FF9F1C] p-10 md:p-20 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_60px_rgba(244,180,0,0.3)] relative overflow-hidden"
                >
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-black mb-6 md:mb-8 tracking-tighter uppercase leading-none">
                            Ready to Write <br />Your Own Story?
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-4 md:px-10 md:py-5 bg-black text-white font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl w-full sm:w-auto"
                            >
                                BOOK YOUR FLIGHT <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/explore')}
                                className="px-8 py-4 md:px-10 md:py-5 bg-white/20 backdrop-blur-md text-black font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-white/30 transition-all border border-black/10 w-full sm:w-auto"
                            >
                                EXPLORE PACKAGES
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default AboutPage;
