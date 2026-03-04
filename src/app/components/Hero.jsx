"use client";
import { motion, AnimatePresence } from "motion/react";
import { Play, ChevronDown, X } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from "react";

export function Hero({ onBookClick }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/homepage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/70 via-[#0B0F19]/50 to-[#0B0F19]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 md:pt-32 pb-12">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="space-y-6 md:space-y-8 max-w-4xl mx-auto items-center flex flex-col">
          {/* Location Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
            <div className="w-6 h-6 md:w-8 md:h-8">
              <DotLottieReact src="https://lottie.host/20ac7946-ea2b-43a7-ab94-26bdf16b4f3e/WqmDmw9IXK.lottie" loop autoplay />
            </div>
            <span className="text-white/90 text-xs md:text-sm">Shirdi, Maharashtra</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight wave-text px-2" style={{
            fontFamily: "'Pacifico', cursive",
            color: '#FFFFFF',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 255, 255, 0.3)',
            lineHeight: '1.2'
          }}>
            <span>Own&nbsp;</span><span>The&nbsp;</span><span>Sky</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="text-base sm:text-lg md:text-2xl text-white/90 max-w-2xl mx-auto px-4 leading-relaxed">
            Premium Paramotor Adventures with Certified Pilots
          </motion.p>

          {/* Rating Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="inline-flex items-center gap-2 md:gap-4 bg-white/10 backdrop-blur-lg border border-[#D4AF37]/30 rounded-full pl-2 pr-6 md:pl-4 md:pr-8 h-12 md:h-16 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-20 h-20 md:w-32 md:h-32 -mx-2 md:-mx-4 flex items-center justify-center">
              <DotLottieReact src="https://lottie.host/68d8ce56-89c9-4a71-b947-64c0f2786540/q7l6dX887n.lottie" loop autoplay />
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-white font-extrabold text-lg md:text-2xl tracking-tight">4.9</span>
                <span className="text-[#D4AF37] text-[10px] md:text-xs font-normal uppercase tracking-[0.1em] md:tracking-[0.2em]">Excellent</span>
              </div>
              <span className="text-white/70 text-[10px] md:text-xs font-normal whitespace-nowrap">2,000+ Adventure Seekers</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onBookClick} className="group relative bg-[#E10600] hover:bg-[#E10600]/90 text-white px-8 py-4 rounded-full transition-all hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] hover:scale-105 w-full sm:w-auto font-black">
              <span className="relative z-10">Book Your Flight</span>
              <div className="absolute inset-0 rounded-full bg-[#E10600] blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>

            <button
              onClick={() => setShowVideoModal(true)}
              className="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#D4AF37]/50 text-white px-8 py-4 rounded-full transition-all hover:bg-white/20 w-full sm:w-auto font-black"
            >
              <Play className="w-5 h-5" />
              <span>Watch Experience</span>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }} className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-sm">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 text-[#D4AF37]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <video
                src="/video/goldwing.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

