"use client";
import { motion, AnimatePresence } from "motion/react";
import { Play, ChevronDown, X } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useEffect } from "react";

export function Hero({ onBookClick }) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  // Check for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsLightTheme(document.documentElement.classList.contains('light-theme'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const textColor = isLightTheme ? '#1a1a1a' : '#FFFFFF';
  const textShadow = isLightTheme
    ? '0 2px 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)'
    : '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2)';
  const subTextShadow = isLightTheme
    ? '0 2px 10px rgba(255, 255, 255, 0.7)'
    : '0 3px 15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 255, 255, 0.2)';

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
      <div className="relative z-10 container mx-auto px-4 text-center pt-32 md:pt-40 lg:pt-48 pb-12">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="space-y-4 md:space-y-6 lg:space-y-8 max-w-4xl mx-auto items-center flex flex-col">
          {/* Location Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 sm:px-3 md:px-4 py-1 md:py-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0">
              <DotLottieReact src="https://lottie.host/20ac7946-ea2b-43a7-ab94-26bdf16b4f3e/WqmDmw9IXK.lottie" loop autoplay />
            </div>
            <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '600',
              color: textColor,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
            }}>Shirdi, Maharashtra</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 initial={{ opacity: 0, y: 40, rotateX: -15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 100 }} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-normal px-2 flex flex-wrap justify-center" style={{
            fontFamily: "'Pacifico', cursive",
            color: textColor,
            textShadow: textShadow,
            lineHeight: '1.2',
            paddingBottom: '0.1em'
          }}>
            {"Own The Sky".split("").map((char, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
                style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium max-w-3xl mx-auto px-4 leading-relaxed" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '500',
            textShadow: subTextShadow,
            letterSpacing: '0.01em',
            color: textColor,
            opacity: 0.95
          }}>
            Premium Paramotor Adventures with Certified Pilots
          </motion.p>

          {/* Rating Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  initial={{ color: "rgba(255, 255, 255, 0.2)", scale: 1 }}
                  animate={{ color: "#FACC15", scale: [1, 1.2, 1] }}
                  transition={{
                    delay: 1 + (i * 0.15),
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="text-lg"
                >
                  ★
                </motion.span>
              ))}
            </div>
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg">4.9</span>
                <span className="text-yellow-500/80 text-[10px] font-bold uppercase tracking-widest">Excellent</span>
              </div>
              <span className="text-white/60 text-[10px] font-medium uppercase tracking-tight">2,000+ Adventure Seekers</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <button onClick={onBookClick} className="group relative bg-[#E10600] hover:bg-[#E10600]/90 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] hover:scale-105 font-black text-xs sm:text-sm md:text-base whitespace-nowrap" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '900',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              <span className="relative z-10">Book Your Flight</span>
              <div className="absolute inset-0 rounded-full bg-[#E10600] blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>

            <button
              onClick={() => setShowVideoModal(true)}
              className="group flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#D4AF37]/50 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all hover:bg-white/20 font-black text-xs sm:text-sm md:text-base whitespace-nowrap"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                color: textColor
              }}
            >
              <Play className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 flex-shrink-0 fill-white" />
              <span>Watch Experience</span>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }} className="flex flex-col items-center gap-2">
            <span className="text-sm" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: '500',
              color: textColor,
              opacity: isLightTheme ? 0.7 : 0.6
            }}>Scroll to explore</span>
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

