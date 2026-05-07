import React from "react";
import { SafetySection } from "../components/SafetySection";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <SafetySection />
      <Footer />
    </div>
  );
}