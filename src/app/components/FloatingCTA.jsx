"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone } from "lucide-react";
export function FloatingCTA({ onBookClick }) {
    return (<>
      {/* WhatsApp Button */}
      <motion.a 
        href="https://wa.me/919165659595?text=Hi%20Goldwing%20Adventure!%20I'm%20interested%20in%20booking%20an%20adventure%20flight.%20Can%20you%20please%20provide%20more%20details%3F" 
        target="_blank" 
        rel="noopener noreferrer" 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }} 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        className="fixed right-6 bottom-24 md:bottom-24 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#25D366]/90 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-all duration-300"
      >
        {/* @ts-ignore */}
        <lord-icon src="https://cdn.lordicon.com/qtenrimd.json" trigger="hover" stroke="light" colors="primary:#1a1a1a,secondary:#ffffff,tertiary:#ffffff" style={{ width: '44px', height: '44px' }}/>
      </motion.a>

      {/* Call Button */}
      <motion.a 
        href="tel:+919165659595" 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }} 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        className="fixed right-6 bottom-6 md:bottom-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-[#D4AF37] hover:bg-[#D4AF37]/90 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(212,175,55,0.4)] transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-20" />
        <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-[#0B0F19] relative z-10" />
      </motion.a>

      {/* Sticky Book Now Button (Mobile) */}
      <AnimatePresence>
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 p-4">
            <button onClick={onBookClick} className="w-full bg-gradient-to-r from-[#E10600] to-[#E10600]/80 hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] text-white py-4 rounded-full font-normal transition-all flex items-center justify-center gap-2">
              <Phone className="w-5 h-5"/>
              <span>Book Your Flight Now</span>
            </button>
          </motion.div>
      </AnimatePresence>
    </>);
}
