"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router";
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState("/login");
  useEffect(() => {
    // Check initial login state
    const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
    const isStaff = localStorage.getItem("isStaffLoggedIn") === "true";
    const isPilot = localStorage.getItem("isPilotLoggedIn") === "true";
    const isAgent = localStorage.getItem("isAgentLoggedIn") === "true";

    setIsLoggedIn(isAdmin || isStaff || isPilot || isAgent);

    if (isAdmin) setDashboardUrl("/admin");
    else if (isStaff) setDashboardUrl("/staff");
    else if (isPilot) setDashboardUrl("/pilot");
    else if (isAgent) setDashboardUrl("/agent");
    else setDashboardUrl("/login");
    // Initial check
    setIsLightTheme(document.documentElement.classList.contains("light-theme"));
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsLightTheme(document.documentElement.classList.contains("light-theme"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);
  return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
    ? (isLightTheme ? "bg-white shadow-lg border-b border-black/10 py-2" : "bg-[#0B0F19] shadow-lg border-b border-white/10 py-2")
    : "bg-transparent py-4"}`}>
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
          <img src="/goldwing-logo.png" alt="Goldwing Adventure Tour" className="h-10 md:h-14 w-auto object-contain" />
          <div className="block">
            <h1 className={`font-normal tracking-tight text-sm md:text-lg leading-tight transition-colors ${isScrolled && isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>
              GOLDWING
            </h1>
            <p className="text-[#D4AF37] text-[8px] md:text-xs tracking-wider">ADVENTURE TOUR</p>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className={`transition-colors font-normal ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
            About
          </Link>
          <a href="#experiences" className={`transition-colors font-normal ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
            Experiences
          </a>
          <a href="#safety" className={`transition-colors font-normal ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
            Safety
          </a>

          <a href="tel:+911234567890" className={`flex items-center gap-2 transition-colors group font-normal ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
            <motion.div animate={{
              rotate: [0, -10, 10, -10, 10, 0],
            }} transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }} className="w-8 h-8 flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
            </motion.div>
            <span>+91 123 456 7890</span>
          </a>

          <Link to={dashboardUrl} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group backdrop-blur-md border shadow-lg ${(isScrolled && isLightTheme) ? "bg-black/5 border-black/10 text-[#0B0F19] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0B0F19]" : "bg-white/10 border-white/20 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black"}`} title={isLoggedIn ? "Dashboard" : "Login"}>
            <User className={`w-5 h-5 transition-transform group-hover:scale-110 ${isLoggedIn ? "text-[#D4AF37] fill-[#D4AF37]/20" : ""}`} />
          </Link>

          <ThemeToggle className={(isScrolled && isLightTheme) ? "ring-1 ring-black/10 shadow-sm" : ""} />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Link to={dashboardUrl} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group backdrop-blur-md border shadow-lg ${(isScrolled && isLightTheme) ? "bg-black/5 border-black/10 text-[#0B0F19] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0B0F19]" : "bg-white/10 border-white/20 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black"}`} title={isLoggedIn ? "Dashboard" : "Login"}>
            <User className={`w-5 h-5 transition-transform group-hover:scale-110 ${isLoggedIn ? "text-[#D4AF37] fill-[#D4AF37]/20" : ""}`} />
          </Link>
          <ThemeToggle className={(isScrolled && isLightTheme) ? "ring-1 ring-black/10 shadow-sm" : ""} />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 transition-colors ${isScrolled && isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-full left-4 right-4 mt-2 overflow-hidden rounded-3xl z-50 border shadow-2xl transition-colors duration-300 ${isLightTheme ? "bg-white/95 border-black/5" : "bg-[#0B0F19]/95 border-white/5"} backdrop-blur-xl`}
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${isLightTheme ? "bg-black/5 hover:bg-black/10" : "bg-white/5 hover:bg-white/10"}`}>
                  <span className={`text-base font-normal ${isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>About</span>
                </Link>
                <a href="#experiences" onClick={() => setIsMobileMenuOpen(false)} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${isLightTheme ? "bg-black/5 hover:bg-black/10" : "bg-white/5 hover:bg-white/10"}`}>
                  <span className={`text-base font-normal ${isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>Experiences</span>
                </a>
                <a href="#safety" onClick={() => setIsMobileMenuOpen(false)} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${isLightTheme ? "bg-black/5 hover:bg-black/10" : "bg-white/5 hover:bg-white/10"}`}>
                  <span className={`text-base font-normal ${isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>Safety</span>
                </a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${isLightTheme ? "bg-black/5 hover:bg-black/10" : "bg-white/5 hover:bg-white/10"}`}>
                  <span className={`text-base font-normal ${isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>Reviews</span>
                </a>
              </div>

              <div className="h-px w-full bg-current opacity-10"></div>

              <a href="tel:+911234567890" className={`flex items-center justify-center gap-3 p-4 rounded-2xl transition-all ${isLightTheme ? "bg-black/5 hover:bg-black/10" : "bg-white/5 hover:bg-white/10"}`}>
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <span className={`text-sm font-normal ${isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>Call Now</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.nav>);
}
