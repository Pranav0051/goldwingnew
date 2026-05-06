import React, { Suspense, useEffect } from "react";
import "./theme.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { PageLoader } from "./components/PageLoader";
import { SplashScreen } from "./components/SplashScreen";
import { useState } from "react";

// Scroll to Top Wrapper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Handle hash scrolling
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure page is rendered
    }
  }, [pathname]);
  return null;
}

// Global Referral Tracker
function ReferralTracker() {
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("agentRef", ref);
    }
  }, [search]);
  return null;
}

// Lazy Load All Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const AdventureSelector = React.lazy(() => import("./pages/AdventureSelector").then(m => ({ default: m.AdventureSelector })));
const BookingPage = React.lazy(() => import("./pages/BookingPage").then(m => ({ default: m.BookingPage })));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AgentDashboard = React.lazy(() => import("./pages/AgentDashboard").then(m => ({ default: m.AgentDashboard })));
const LoginPage = React.lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const ScannerPage = React.lazy(() => import("./pages/ScannerPage").then(m => ({ default: m.ScannerPage })));
const StaffDashboard = React.lazy(() => import("./pages/StaffDashboard").then(m => ({ default: m.StaffDashboard })));
const AboutPage = React.lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const PilotDashboard = React.lazy(() => import("./pages/PilotDashboard").then(m => ({ default: m.PilotDashboard })));
const SafetyPage = React.lazy(() => import("./pages/SafetyPage").then(m => ({ default: m.SafetyPage })));

export default function App() {
  const [showSplash, setShowSplash] = useState(false);

  const handleBookingNavigation = () => {
    setShowSplash(true);
  };

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <ScrollToTop />
      <ReferralTracker />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage onBookClick={handleBookingNavigation} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/pilot" element={<PilotDashboard />} />
          <Route path="/gate" element={<ScannerPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
