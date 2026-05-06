"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Give time for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F19]"
        >
          {/* Animated Background Rings */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#D4AF37]/20"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#D4AF37]/10"
            />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Outer Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-[#D4AF37] blur-[60px] opacity-20 rounded-full"
              />
              
              <img 
                src="/goldwing-logo.png" 
                alt="Goldwing" 
                className="h-48 md:h-72 w-auto object-contain relative z-10"
              />
            </motion.div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <h1 className="text-white text-3xl md:text-5xl font-black tracking-[0.2em] mb-2 uppercase">
                GOLDWING
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs md:text-sm tracking-[0.4em] font-light uppercase whitespace-nowrap">
                  Adventure Tour
                </span>
                <div className="h-px w-8 md:w-12 bg-[#D4AF37]" />
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div className="mt-16 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
