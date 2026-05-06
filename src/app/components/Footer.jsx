"use client";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router";
export function Footer() {
  return (<footer className="bg-[#0B0F19] border-t border-white/10 pt-16 md:pt-20 pb-10">
    <div className="container mx-auto px-6 md:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src="/goldwing-logo.png" alt="Goldwing Adventure Tour" className="h-20 md:h-28 w-auto object-contain" />
            <div>
              <h1 className="text-white font-normal tracking-tight text-base md:text-lg">
                GOLDWING
              </h1>
              <p className="text-[#D4AF37] text-[10px] md:text-xs tracking-widest">ADVENTURE TOUR</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-xs">
            Experience the thrill of flight with premium paramotor adventures. Your safety is our top priority.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
              <Facebook className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
              <Instagram className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
              <Twitter className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
              <Youtube className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-normal mb-5 md:mb-6">Quick Links</h3>
          <ul className="space-y-3.5">
            <li>
              <Link to="/about" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                About
              </Link>
            </li>
            <li>
              <a href="#experiences" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Experiences
              </a>
            </li>
            <li>
              <a href="#safety" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Safety
              </a>
            </li>
            <li>
              <a href="#testimonials" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Gallery
              </a>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-normal mb-5 md:mb-6">Policies</h3>
          <ul className="space-y-3.5">
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Cancellation Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Refund Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors py-1 inline-block">
                Safety Guidelines
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-normal mb-5 md:mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <span className="text-white/70 text-sm max-w-[200px]">
                Corporate: Jaysingpur <br/> Site: Shirdi
              </span>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
              <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <a href="tel:+919165659595" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm">
                +91 91656 59595
              </a>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
              <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <a href="mailto:info@goldwingadventure.com" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm">
                info@goldwingadventure.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/60 text-sm text-center md:text-left">
            © 2026 Gold Wing Adventure. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
              <span className="text-white/60 text-xs md:text-sm">Live Weather Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>);
}
