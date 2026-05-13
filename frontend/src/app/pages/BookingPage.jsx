import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Users, User, CreditCard, Check, Shield, Download, MapPin, Globe, ArrowLeft, ArrowRight, X, AlertCircle, BadgePercent } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { bookingStore } from "../utils/bookingStore";
import { bookingService, authService, slotService } from "../services/api";
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
import { ThemeToggle } from "../components/ThemeToggle";
import { LiveNotifications } from "../components/LiveNotifications";
import { TermsAndConditionsModal } from "../components/TermsAndConditionsModal";

// Slots are now fetched dynamically from the API.

const SOLO_PACKAGES = [
    { id: "solo_basic", name: "Single Basic", duration: "5-7 KM", price: 2500, points: ["Certified Pilot", "Safety Gear", "Ground Photos", "Basic Insurance"] },
    { id: "solo_explorer", name: "Single Explorer", duration: "10-12 KM", price: 5499, points: ["HD Video", "Extended Route", "Premium Gear", "Full Insurance"] },
    { id: "solo_pro", name: "Single Pro Flight", duration: "15 KM", price: 7999, points: ["4K Video", "Acrobatic Moves", "Merchandise Package", "Priority Slot"] },
];

const COUPLE_PACKAGES = [
    { id: "couple_basic", name: "Couple Basic", duration: "5-7 KM", price: 6499, points: ["2 Certified Pilots", "Romantic Sunset Views", "Ground Photos", "Safety Insurance"] },
    { id: "romantic_premium", name: "Romantic Premium", duration: "10-15 KM", price: 9999, ribbon: "Most Popular", points: ["HD Couple Video", "Sunset Slot", "Surprise Bouquet", "Personal Photoshoot"] },
    { id: "romantic_sunrise", name: "Romantic Sunrise", duration: "15-20 KM", price: 12999, ribbon: "Bestseller", points: ["4K Video", "Early Morning Access", "Breakfast Included", "Goldwing T-shirts"] },
    { id: "anniversary_special", name: "Anniversary Special", duration: "25 KM", price: 15499, points: ["Proposal Banner", "Drone Shots", "Celebration Cake", "Luxury Pick-up"] },
];

const FAMILY_PACKAGES = [
    { id: "family_fun", name: "Group Fun Ride", duration: "5-7 KM", price: 8999, points: ["3 Pilots", "Group Memories", "Fun for Kids", "Standard Insurance"] },
    { id: "family_deluxe", name: "Group Deluxe Experience", duration: "10-12 KM", price: 13999, points: ["Group Montage Video", "Themed Gear", "Gift Bags", "Full Insurance"] },
    { id: "family_celebration", name: "Group Celebration Package", duration: "15 KM", price: 19999, points: ["Extended Sky Tour", "Professional Video", "Custom Apparel", "VIP Lounge Access"] },
];

const SHARING_PACKAGES = [
    { id: "sharing_saver", name: "Sharing Saver Ride", duration: "5-7 KM", price: 2999, points: ["Shared Parachute", "Reduced Cost", "New Friends", "Basic Safety"] },
    { id: "sharing_plus", name: "Sharing Plus Experience", duration: "10-12 KM", price: 4499, points: ["Extended Flight", "Group Photo", "Safety Certificate", "Insurance"] },
];

const PREMIUM_PACKAGES = [
    { id: "pre_wedding", name: "Pre-Wedding Sky Shoot", duration: "25 KM", price: 24999, ribbon: "Exclusive", points: ["Professional Drone Team", "Extended Experience", "Multiple Costume Changes", "4K Edited Video"] },
    { id: "full_day", name: "Full-Day Sky Adventure", duration: "50 KM", price: 49999, points: ["Private Transport", "Gourmet Meals", "3 Flights Guaranteed", "Exclusive Gift Set"] },
    { id: "proposal_special", name: "Proposal Special Flight", duration: "30 KM", price: 34999, points: ["Champagne on Landing", "Proposal Coordination", "Personal Violinist", "Luxury Car Transfer"] },
];

const PACKAGES_DATA = {
    SINGLE: SOLO_PACKAGES,
    COUPLE: COUPLE_PACKAGES,
    FAMILY: FAMILY_PACKAGES,
    SHARING: SHARING_PACKAGES,
    PREMIUM: PREMIUM_PACKAGES
};

const CATEGORIES = [
    {
        id: "SINGLE",
        title: "Single",
        icon: "/images/icon/new_single-removebg.png",
        bg: "/images/background/single para.webp",
        tagline: "High Fly Adventure",
        microText: "Single Flight Experience",
        cta: "Book Now",
        weightRule: "Max 150 KG"
    },
    {
        id: "COUPLE",
        title: "Couple",
        icon: "/images/icon/couple-removebg.png",
        bg: "/images/background/couple.png",
        tagline: "Share the Sky",
        microText: "Romantic Sky Tour",
        cta: "Book Now",
        weightRule: "Max 150 KG"
    },
    {
        id: "FAMILY",
        title: "Group",
        icon: "/images/icon/familynew.png",
        bg: "/images/background/3 seat para.jpg",
        tagline: "Sky Safari",
        microText: "Group Bonding",
        cta: "Book Now",
        weightRule: "Combined Max 150 KG"
    },
    {
        id: "SHARING",
        title: "Sharing",
        icon: "/images/icon/sharing.png",
        bg: "/images/background/2 seater para.avif",
        tagline: "Economical Fly",
        microText: "Team Experience",
        cta: "Book Now",
        weightRule: "Max 75 KG / Person"
    },
    {
        id: "PREMIUM",
        title: "Premium",
        icon: "/images/icon/premium_new.png",
        bg: "/images/background/premium.png",
        tagline: "Luxury Expedition",
        ribbon: "Exclusive",
        cta: "Book Now",
        weightRule: "VIP Experience"
    }
];

const GST_RATE = 0.18;
const INSURANCE_PRICE = 200;


export function BookingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const refCode = searchParams.get("ref") || sessionStorage.getItem("agentRef");
    const pkgParam = searchParams.get("pkg");

    // --- ALL STATE HOOKS AT THE TOP ---
    const [step, setStep] = useState(1); // 1=Category, 2=Packages, 3=Details, 4=Location, 5=Slot, 6=Payment, 7=Confirmation
    const [availableSlots, setAvailableSlots] = useState([]);
    const [backgroundIndex, setBackgroundIndex] = useState("/images/background/solo.png");
    const [showSplash, setShowSplash] = useState(true);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAgent, setIsAgent] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [bookingId, setBookingId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [consent, setConsent] = useState({ terms: false, media: false });
    
    // Booking details state
    const [passengers, setPassengers] = useState([{ gender: "M", weight: "", age: "", coPassengerName: "" }]);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", state: "", city: "" });
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("Shirdi");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
    const [isVipCheckin, setIsVipCheckin] = useState(false);

    // --- ERROR HANDLING ---
    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 4000);
    };

    // --- EFFECTS ---
    useEffect(() => {
        setIsAdmin(localStorage.getItem("isAdminLoggedIn") === "true");
        setIsAgent(localStorage.getItem("isAgentLoggedIn") === "true");
        
        if (localStorage.getItem("isAgentLoggedIn") === "true") {
            authService.getUserProfile().then(profile => {
                setUserProfile(profile);
            }).catch(err => {
                console.error("Failed to fetch agent profile", err);
            });
        }
    }, []);

    useEffect(() => {
        if (step === 5 && selectedDate) {
            slotService.getAvailability(selectedDate)
                .then(data => {
                    setAvailableSlots(data);
                })
                .catch(err => {
                    console.error("Failed to fetch slots", err);
                    showError("Failed to fetch available slots.");
                });
        }
    }, [step, selectedDate]);

    useEffect(() => {
        if (pkgParam) {
            let foundCategory = null;
            let foundPackage = null;
            foundPackage = SOLO_PACKAGES.find(p => p.id === pkgParam);
            if (foundPackage) foundCategory = "SINGLE";
            if (!foundPackage) {
                foundPackage = COUPLE_PACKAGES.find(p => p.id === pkgParam);
                if (foundPackage) foundCategory = "COUPLE";
            }
            if (!foundPackage) {
                foundPackage = FAMILY_PACKAGES.find(p => p.id === pkgParam);
                if (foundPackage) foundCategory = "FAMILY";
            }
            if (foundCategory && foundPackage) {
                setSelectedCat(foundCategory);
                setSelectedPkg(pkgParam);
                setStep(3);
            }
        }
    }, [pkgParam]);

    useEffect(() => {
        if (selectedCat) {
            const catInfo = CATEGORIES.find(c => c.id === selectedCat);
            if (catInfo) setBackgroundIndex(catInfo.bg);
        }
    }, [selectedCat]);

    useEffect(() => {
        if (step === 2) {
            setSelectedPkg(null);
        }
    }, [step]);

    const isConsentValid = consent.terms;

    // Handlers for selection
    const handleCategorySelect = (catId) => {
        setSelectedCat(catId);
        setSelectedPkg(null);
        if (catId === "SINGLE" || catId === "SHARING" || catId === "PREMIUM") {
            setPassengers([{ gender: "M", weight: "", age: "" }]);
        } else if (catId === "COUPLE") {
            setPassengers([
                { gender: "M", weight: "", age: "" },
                { gender: "F", weight: "", age: "", coPassengerName: "" }
            ]);
        } else if (catId === "FAMILY") {
            setPassengers([{ gender: "M", weight: "", age: "" }]); // Initial family member
        }
    };

    const handleProceedToDetails = (catId) => {
        handleCategorySelect(catId);
        setStep(2); // Goes to Packages now (swapped visually)
    };

    const validateDetailsForm = () => {
        for (let i = 0; i < passengers.length; i++) {
            const age = parseInt(passengers[i].age);
            if (!age || age < 12) return showError(`Passenger ${i + 1} must be at least 12 years old.`);
        }

        if (selectedCat === "SINGLE") {
            const w = parseInt(passengers[0].weight);
            if (!w || w <= 0) return showError("Please enter a valid weight.");
            if (w > 150) {
                showError("Weight limit is 150 KG for Single rides.");
                return false;
            }
        } else if (selectedCat === "SHARING") {
            const w = parseInt(passengers[0].weight);
            if (!w || w <= 0) return showError("Please enter a valid weight.");
            if (w > 75) {
                showError("Weight limit is 75 KG per person for Sharing rides. For higher weight, please book a Single ride.");
                return false;
            }
        } else if (selectedCat === "COUPLE") {
            const w1 = parseInt(passengers[0].weight) || 0;
            const w2 = parseInt(passengers[1].weight) || 0;
            if (!w1 || !w2) return showError("Please enter weight for both individuals.");
            if (!passengers[1].coPassengerName?.trim()) return showError("Please enter Co-Passenger Name.");
            
            if (w1 > 75 || w2 > 75) {
                return showError("Individual weight limit is 75 KG for Couple rides. Please book separate Single rides if anyone exceeds 75 KG.");
            }

            if (w1 + w2 > 150) {
                showError("Your combined weight is more than 150 kg, you have to share ride with another people.");
                return false;
            }
        } else if (selectedCat === "FAMILY") {
            for (let i = 0; i < passengers.length; i++) {
                const w = parseInt(passengers[i].weight);
                if (!w || w <= 0) return showError(`Please enter weight for Member ${i + 1}`);
                if (w > 75) {
                    return showError(`Member ${i + 1} exceeds the 75 KG limit for Group rides. Please book a separate Single ride.`);
                }
            }
            
            // Check if any two passengers combined exceed 150
            for (let i = 0; i < passengers.length; i++) {
                for (let j = i + 1; j < passengers.length; j++) {
                    const wSum = (parseInt(passengers[i].weight) || 0) + (parseInt(passengers[j].weight) || 0);
                    if (wSum > 150) {
                        showError("Your combined weight is more than 150 kg, you have to share ride with another people.");
                        return false;
                    }
                }
            }
        }

        if (!formData.name.trim()) return showError("Please enter contact name.");
        if (!formData.phone.trim() || formData.phone.length < 10) return showError("Valid 10-digit mobile number required.");

        setStep(5); // Skip Location, go directly to Slot
        return true;
    };

    const calculateTotal = () => {
        const pkg = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        if (!pkg) return { total: 0, sub: 0, gst: 0, ins: 0, travelers: 1, base: 0 };

        const travelersCount = passengers.length;
        let basePrice = pkg.price;

        // For SHARING, multiply by person count
        if (selectedCat === "SHARING" || selectedCat === "SINGLE") {
            basePrice = pkg.price * travelersCount;
        }

        const ins = INSURANCE_PRICE * travelersCount;
        const vip = isVipCheckin ? 500 * travelersCount : 0;
        const sub = basePrice + ins + vip;
        const gst = sub * GST_RATE;
        const total = sub + gst;

        return {
            total: Math.round(total),
            sub: Math.round(sub),
            gst: Math.round(gst),
            ins: Math.round(ins),
            vip: Math.round(vip),
            travelers: travelersCount,
            base: Math.round(basePrice),
            cgst: Math.round(gst / 2),
            sgst: Math.round(gst / 2)
        };
    };



    const handlePayment = async () => {
        console.log("handlePayment initiated. Current Payment Method:", paymentMethod);
        
        if (paymentMethod === "Pay Later" || paymentMethod === "Cash") {
            console.log("Processing as Offline/Pay Later");
            confirmBooking("OFFLINE_PAY", "OFFLINE");
            return;
        }

        if (paymentMethod === "Points") {
            if (!userProfile || userProfile.walletBalance < calculateTotal().total) {
                showError("Insufficient points balance. You have ₹" + (userProfile?.walletBalance || 0));
                return;
            }
            
            try {
                const calc = calculateTotal();
                const slotObj = availableSlots.find(s => s.id === selectedSlot);
                const bookingRequest = {
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email,
                    customerCity: formData.city,
                    category: selectedCat,
                    packageId: selectedPkg,
                    packageName: PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name,
                    bookingDate: selectedDate,
                    slot: slotObj ? slotObj.time : "06:00 AM",
                    location: selectedLocation,
                    amount: calc.total,
                    paymentMethod: "POINTS",
                    agentRef: refCode,
                    passengers: passengers.map(p => ({
                        name: p.coPassengerName || "Passenger",
                        age: parseInt(p.age),
                        weight: parseInt(p.weight),
                        gender: p.gender
                    }))
                };

                const backendBooking = await bookingService.createBooking(bookingRequest);
                confirmBooking("POINTS_PAY", "POINTS", backendBooking.bookingId);
                return;
            } catch (error) {
                showError(error.response?.data?.message || error.message);
                return;
            }
        }

        if (!window.Razorpay) {
            const scriptLoaded = await new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
            
            if (!scriptLoaded || !window.Razorpay) {
                console.error("Razorpay SDK not found on window object and failed to load dynamically");
                showError("Razorpay SDK is not loaded. Please refresh the page, disable adblockers, or check your connection.");
                return;
            }
        }

        try {
            const calc = calculateTotal();
            const slotObj = availableSlots.find(s => s.id === selectedSlot);

            console.log("Creating pending booking in backend...");
            // Step 1: Create a PENDING booking in backend to get Razorpay Order ID
            const bookingRequest = {
                customerName: formData.name,
                customerPhone: formData.phone,
                customerEmail: formData.email,
                customerCity: formData.city,
                category: selectedCat,
                packageId: selectedPkg,
                packageName: PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name,
                bookingDate: selectedDate,
                slot: slotObj ? slotObj.time : "06:00 AM",
                location: selectedLocation,
                amount: calc.total,
                paymentMethod: paymentMethod,
                agentRef: refCode,
                passengers: passengers.map(p => ({
                    name: p.coPassengerName || "Passenger",
                    age: parseInt(p.age),
                    weight: parseInt(p.weight),
                    gender: p.gender
                }))
            };

            const backendBooking = await bookingService.createBooking(bookingRequest);
            console.log("Backend booking created:", backendBooking);
            
            const orderId = backendBooking.transactionId; 

            if (!orderId) {
                console.error("No transactionId (Order ID) returned from backend");
                throw new Error("Failed to create Razorpay Order ID.");
            }

            console.log("Opening Razorpay Modal with Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
            console.log("Opening Razorpay Modal with Order ID:", orderId);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: calc.total * 100,
                currency: "INR",
                name: "Goldwing Adventure Tours",
                description: selectedCat + " Booking",
                image: "/images/icon/premium_new.png",
                order_id: orderId,
                handler: async function (response) {
                    console.log("Razorpay payment success handler triggered", response);
                    try {
                        console.log("Verifying payment on backend...");
                        await bookingService.verifyPayment({
                            transactionId: orderId,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            status: "SUCCESS"
                        });
                        console.log("Payment verified. Confirming booking...");
                        confirmBooking(response.razorpay_payment_id, "ONLINE", backendBooking.bookingId);
                    } catch (verifyError) {
                        console.error("Verification error:", verifyError);
                        showError("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email || "",
                    contact: formData.phone
                },
                theme: {
                    color: "#F4B400"
                },
                modal: {
                    ondismiss: function() {
                        console.log("Razorpay modal dismissed by user");
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                console.error("Razorpay payment failed:", response.error);
                showError("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment initiation error:", error);
            showError("Error: " + (error.response?.data?.message || error.message));
        }
    };

    const confirmBooking = (paymentId, type, backendId = null) => {
        console.log("confirmBooking called. Type:", type, "ID:", backendId);
        const id = backendId || `GW-${Math.floor(Math.random() * 900000 + 100000)}`;
        setBookingId(id);

        const calc = calculateTotal();
        const slotObj = availableSlots.find(s => s.id === selectedSlot);

        const newBooking = {
            id,
            customerName: formData.name,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            customerCity: formData.city,
            persons: passengers.length,
            passengers: passengers.map(p => ({
                name: p.coPassengerName || "Passenger",
                age: p.age,
                weight: p.weight,
                gender: p.gender
            })),
            slot: slotObj ? slotObj.time : "06:00 AM",
            category: selectedCat,
            type: type,
            location: selectedLocation,
            date: selectedDate,
            status: "Confirmed",
            price: calc.total,
            paymentMethod: paymentMethod,
            paymentId: paymentId,
            consentAccepted: true,
            consentTimestamp: new Date().toISOString(),
            consentMedia: consent.media,
            userIpAddress: "Client-IP-Logged",
            isFemaleSharing: passengers[0]?.isFemaleSharing || false,
            isVipCheckin,
            agent: refCode || "Direct",
            amount: calc.total,
            packageId: selectedPkg,
            packageName: PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name,
            bookingDate: selectedDate
        };
        
        bookingStore.addBooking(newBooking);
        
        // Generate QR for UI
        const qrContent = `${window.location.origin}/gate?data=VERIFY:${id}|PAY_INTERNAL`;
        QRCode.toDataURL(qrContent, { width: 300, margin: 2 })
            .then(url => setQrCodeDataUrl(url))
            .catch(err => console.error("QR Generation failed", err));

        setStep(7); // Go to confirmation
        console.log("Navigation to Step 7 complete");
        
        setTimeout(() => {
            if (typeof handleDownloadTicket === 'function') {
                handleDownloadTicket();
            }
        }, 1000);
    };

    const handleDownloadTicket = async () => {
        const docHeight = 340 + (passengers.length * 8);
        const doc = new jsPDF({ format: [100, docHeight], unit: "mm" });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, docHeight, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
        const payId = `PAY${Math.floor(Math.random() * 9000000 + 1000000)}`;
        const pkgObj = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        const tourDate = selectedDate;
        const pkgName = pkgObj?.name || "Tour Package";
        const slotObj = availableSlots.find((s) => s.id === selectedSlot);
        const slotTime = slotObj ? slotObj.time : "N/A";
        let y = 15;
        const centerX = 50;
        const setCenteredText = (text, fontStyle = "normal", size = 10, yOffset = 5) => {
            doc.setFont("times", fontStyle);
            doc.setFontSize(size);
            doc.text(text, centerX, y, { align: "center" });
            y += yOffset;
        };
        const drawDivider = () => {
            y += 4;
            doc.setLineDashPattern([1.5, 1.5], 0);
            doc.line(15, y - 4, 85, y - 4);
            doc.setLineDashPattern([], 0);
            y += 6;
        };
        setCenteredText("GOLDWING ADVENTURE TOURS", "bold", 10, 6);
        setCenteredText("Adventure | Safety | Experience", "normal", 9, 6);
        setCenteredText("Mumbai, Maharashtra - 400001", "normal", 9, 6);
        setCenteredText("Phone: +91-XXXXXXXXXX", "normal", 9, 6);
        setCenteredText("GSTIN: 27AAACR5055K1ZQ", "normal", 9, 6);
        drawDivider();
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text(`Booking No: ${bookingId}`, 15, y);
        y += 6;
        const maskedPhone = formData.phone ? formData.phone.slice(-4).padStart(formData.phone.length, 'X') : "N/A";
        doc.text(`Mobile:     ${maskedPhone}`, 15, y);
        y += 6;
        drawDivider();
        doc.text(`Category: ${selectedCat || 'Unknown'}`, 15, y);
        y += 6;
        doc.text(`Tour: ${pkgName}`, 15, y);
        y += 6;
        doc.text(`Tour Date: ${tourDate.split("-").reverse().join("/")}`, 15, y);
        y += 6;
        doc.text(`Slot Time: ${slotTime}`, 15, y);
        y += 6;

        if (selectedCat === "SHARING") {
            doc.setFont("times", "bolditalic");
            doc.text(`Ride Type: SHARING RIDE`, 15, y);
            y += 6;
            if (passengers[0]?.isFemaleSharing) {
                doc.setTextColor(255, 0, 150);
                doc.text(`PREFERENCE: FEMALE SHARING`, 15, y);
                y += 6;
                doc.setTextColor(0, 0, 0);
            }
            doc.setFont("times", "normal");
        }
        if (isVipCheckin) {
            doc.setFont("times", "bolditalic");
            doc.setTextColor(255, 150, 0);
            doc.text(`SERVICE: EXPRESS CHECK-IN`, 15, y);
            doc.setTextColor(0, 0, 0);
            doc.setFont("times", "normal");
            y += 6;
        }
        drawDivider();
        setCenteredText("Passenger Details", "bold", 10, 8);
        doc.setFont("times", "bold");
        doc.setFontSize(9);
        doc.text("Passenger", 15, y);
        doc.text("Gender/Weight", 85, y, { align: "right" });
        y += 6;
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        passengers.forEach((p, idx) => {
            const pName = idx === 0 ? formData.name : (p.coPassengerName || 'Co-Passenger');
            doc.text(`P${idx + 1}: ${pName}`, 15, y);
            doc.text(`${p.gender || "-"} / ${p.weight || "-"} Kg`, 85, y, { align: "right" });
            y += 6;
        });
        drawDivider();
        const calc = calculateTotal();
        doc.text("ITEM", 15, y);
        doc.text("QTY", 55, y, { align: "right" });
        doc.text("RATE", 70, y, { align: "right" });
        doc.text("AMT", 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("Tour Package", 15, y);
        doc.text("1", 55, y, { align: "right" });
        doc.text(calc.base.toString(), 70, y, { align: "right" });
        doc.text(calc.base.toString(), 85, y, { align: "right" });
        y += 6;
        doc.text("Insurance", 15, y);
        doc.text(calc.travelers.toString(), 55, y, { align: "right" });
        doc.text(INSURANCE_PRICE.toString(), 70, y, { align: "right" });
        doc.text(calc.ins.toString(), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("Sub Total", 15, y);
        doc.text(calc.sub.toString(), 85, y, { align: "right" });
        y += 6;
        doc.text("CGST (9%)", 15, y);
        doc.text(calc.cgst.toString(), 85, y, { align: "right" });
        y += 6;
        doc.text("SGST (9%)", 15, y);
        doc.text(calc.sgst.toString(), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("GRAND TOTAL", 15, y);
        doc.text(calc.total.toFixed(0), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        setCenteredText(`Payment Method: ${paymentMethod}`, "normal", 10, 6);
        setCenteredText(`Payment ID: ${payId}`, "normal", 10, 8);
        drawDivider();
        setCenteredText("Scan QR for Verification", "normal", 10, 6);
        try {
            const qrContent = `${window.location.origin}/gate?data=VERIFY:${bookingId}|${payId}`;
            const qrDataUrl = await QRCode.toDataURL(qrContent, { width: 150, margin: 1 });
            doc.addImage(qrDataUrl, "PNG", 35, y, 30, 30);
            y += 35;
        } catch (err) {
            y += 10;
            setCenteredText("[ QR CODE ]", "normal", 10, 20);
        }
        drawDivider();
        setCenteredText("This is a computer-generated ticket.", "normal", 10, 6);
        setCenteredText("Mandatory insurance included.", "normal", 10, 6);
        setCenteredText("Subject to climate change, delays may occur.", "normal", 10, 6);
        setCenteredText("Report 30 minutes before slot time.", "normal", 10, 8);

        if (selectedCat === "SHARING") {
            setCenteredText("SHARING DISCLAIMER:", "bold", 9, 5);
            setCenteredText("You may share the flight with another rider.", "normal", 8, 4);
            if (passengers[0]?.isFemaleSharing) {
                setCenteredText("Waiting for another female rider may apply.", "normal", 8, 4);
            }
            y += 4;
        }

        setCenteredText("Thank You & Ride Safe!", "bold", 11, 8);
        drawDivider();
        doc.save(`Goldwing_Ticket_${bookingId}.pdf`);
    };

    const handleDownloadInvoice = () => {
        const docHeight = 250;
        const doc = new jsPDF({ format: [100, docHeight], unit: "mm" });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, docHeight, "F");
        doc.setTextColor(0, 0, 0);
        let y = 15;
        const centerX = 50;
        const setCenteredText = (text, fontStyle = "normal", size = 10, yOffset = 5) => {
            doc.setFont("times", fontStyle);
            doc.setFontSize(size);
            doc.text(text, centerX, y, { align: "center" });
            y += yOffset;
        };
        const drawDivider = () => {
            y += 4;
            doc.setLineDashPattern([1.5, 1.5], 0);
            doc.line(15, y - 4, 85, y - 4);
            doc.setLineDashPattern([], 0);
            y += 6;
        };
        setCenteredText("GOLDWING ADVENTURE TOURS", "bold", 10, 6);
        setCenteredText("INVOICE", "bold", 12, 6);
        drawDivider();
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text(`Invoice No: INV-${Math.floor(Math.random() * 90000 + 10000)}`, 15, y);
        y += 6;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
        y += 6;
        doc.text(`Customer: ${formData.name || "N/A"}`, 15, y);
        y += 6;
        doc.text(`Booking ID: ${bookingId}`, 15, y);
        y += 6;
        drawDivider();
        doc.setFont("times", "bold");
        doc.text("ITEM", 15, y);
        doc.text("QTY", 55, y, { align: "right" });
        doc.text("RATE", 70, y, { align: "right" });
        doc.text("AMT", 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.setFont("times", "normal");
        doc.setFontSize(9);
        const addRow = (desc, qty, rate, amt) => {
            if (desc.length > 20) {
                doc.text(desc.substring(0, 20), 15, y);
                y += 4;
                doc.text(desc.substring(20), 15, y);
            } else {
                doc.text(desc, 15, y);
            }
            doc.text(qty, 55, y, { align: "right" });
            doc.text(rate, 70, y, { align: "right" });
            doc.text(amt, 85, y, { align: "right" });
            y += 6;
        };
        const calc = calculateTotal();
        const pkgObj = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        addRow(`${pkgObj?.name || 'Package'}`, "1", `Rs. ${calc.base}`, `Rs. ${calc.base}`);
        addRow(`Insurance`, calc.travelers.toString(), `Rs. ${INSURANCE_PRICE}`, `Rs. ${calc.ins}`);
        if (isVipCheckin) addRow(`Express Check-in`, calc.travelers.toString(), `Rs. 500`, `Rs. ${calc.vip}`);

        y += 2;
        drawDivider();
        doc.setFontSize(10);
        doc.text("Sub Total", 15, y);
        doc.text(`Rs. ${calc.sub.toFixed(2)}`, 85, y, { align: "right" });
        y += 6;
        doc.text("CGST (9%)", 15, y);
        doc.text(`Rs. ${calc.cgst.toFixed(2)}`, 85, y, { align: "right" });
        y += 6;
        doc.text("SGST (9%)", 15, y);
        doc.text(`Rs. ${calc.sgst.toFixed(2)}`, 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.setFont("times", "bold");
        doc.text("GRAND TOTAL", 15, y);
        doc.text(`Rs. ${calc.total.toFixed(2)}`, 85, y, { align: "right" });
        y += 8;
        drawDivider();
        setCenteredText("Thank you for choosing", "normal", 10, 5);
        setCenteredText("Goldwing Adventure Tours.", "normal", 10, 8);
        setCenteredText("This is a computer-generated invoice.", "normal", 9, 6);
        doc.save(`Goldwing_Invoice_${bookingId}.pdf`);
    };



    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white font-sans overflow-x-hidden relative selection-bg transition-colors duration-300">
            {/* Dynamic Background Image Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AnimatePresence mode="wait">
                    {!selectedCat ? (
                        <motion.video
                            key="bg-video"
                            src="/video/homepage.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.85 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <motion.img
                            key={backgroundIndex}
                            src={backgroundIndex}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 0.85, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1 }}
                            className="w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/20 dark:bg-[#0B0F19]/60" />
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 bg-red-600 px-6 py-4 rounded-full shadow-2xl font-black max-w-sm w-[90%]"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="flex-1 text-sm">{errorMsg}</span>
                        <button onClick={() => setErrorMsg("")}><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 p-4 md:p-12 w-full max-w-[1600px] mx-auto min-h-[100dvh] flex flex-col justify-start md:justify-center pt-24 md:pt-16 pb-40">

                {/* Back navigation & Header */}
                <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex justify-between items-center z-50">
                    <div className="flex items-center gap-2 md:gap-4">
                        {step > 1 && step < 7 ? (
                            <button
                                onClick={() => setStep(step === 5 ? 3 : step - 1)}
                                className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition bg-white/10 rounded-full backdrop-blur-md border border-white/10 shadow-lg group"
                                title="Back"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                        ) : step === 7 ? (
                            <button
                                onClick={() => navigate('/?skipLoader=true')}
                                className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition bg-white/10 rounded-full backdrop-blur-md border border-white/10 shadow-lg group"
                                title="Back to Home"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={() => navigate('/?skipLoader=true')}
                                    className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition bg-white/10 rounded-full backdrop-blur-md border border-white/10 shadow-lg group"
                                    title="Back to Website"
                                >
                                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link to={isAdmin ? "/admin" : "/login"} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/40 text-gray-900 dark:text-white backdrop-blur-md transition border border-gray-200 dark:border-white/10 shadow-sm group">
                            <User className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAdmin ? "text-yellow-500 fill-yellow-500" : ""}`} />
                        </Link>
                        {step > 0 && <ThemeToggle />}
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <div className="text-center mb-6 md:mb-12 px-4">
                                <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-3 md:mb-4 tracking-tighter text-white">
                                    Choose Your Adventure Style
                                </h1>
                                <p className="text-base sm:text-lg md:text-2xl text-white/80 font-medium">Pick how you want to experience the skies.</p>
                            </div>

                            <div className="flex flex-wrap lg:flex-nowrap items-stretch justify-center gap-4 md:gap-6 px-4 w-auto max-w-full mx-auto">
                                {CATEGORIES.map((cat, idx) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="perspective-1000 group h-[320px] sm:h-[360px] w-full sm:w-[calc(50%-1rem)] lg:w-auto lg:min-w-0 lg:flex-1 cursor-pointer"
                                        onHoverStart={() => setBackgroundIndex(cat.bg)}
                                        onClick={() => handleProceedToDetails(cat.id)}
                                    >
                                        <motion.div
                                            whileHover={{ rotateY: 180 }}
                                            whileTap={{ rotateY: 180 }}
                                            transition={{ duration: 0.8, ease: "backOut" }}
                                            style={{ transformStyle: "preserve-3d" }}
                                            className="relative w-full h-full"
                                        >
                                            {/* FRONT SIDE */}
                                            <div className="absolute inset-0 backface-hidden w-full h-full rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.03] bg-transparent backdrop-blur-[2px] flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                                                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-y-4 md:gap-y-6 p-4">
                                                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.05] shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300">
                                                        <img
                                                            src={cat.icon}
                                                            alt={cat.title}
                                                            className={`w-full h-full object-contain transition-transform duration-300 ${['SINGLE', 'COUPLE', 'FAMILY', 'SHARING'].includes(cat.id) ? 'scale-[1.5] sm:scale-[1.7] translate-y-[-5%]' : cat.id === 'PREMIUM' ? 'scale-[1.1] sm:scale-[1.2]' : 'p-4 sm:p-6'}`}
                                                        />
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white/90 uppercase tracking-widest font-sans">
                                                        {cat.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* BACK SIDE */}
                                            <div className="absolute inset-0 backface-hidden w-full h-full rounded-[1.5rem] md:rounded-[2rem] border border-[#F4B400]/60 bg-black flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(244,180,0,0.2)] [transform:rotateY(180deg)]">
                                                <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8 items-center text-center justify-between">
                                                    <div className="w-24 h-24 sm:w-32 sm:h-32 mt-2 md:mt-4 opacity-40">
                                                        <img src={cat.icon} alt={cat.title} className="w-full h-full object-contain" />
                                                    </div>

                                                    <div className="flex flex-col items-center mb-4 md:mb-6">
                                                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter uppercase">{cat.title}</h3>
                                                        <p className="text-base sm:text-lg md:text-xl font-black text-[#F4B400] italic leading-tight">{cat.tagline}</p>
                                                    </div>

                                                    <div className="w-full mb-2 px-2">
                                                        <button
                                                            className="w-full py-4 rounded-xl bg-[#F4B400] text-black font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(244,180,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
                                                        >
                                                            {cat.cta} <ArrowRight className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>


                        </motion.div>
                    )}

                    {/* STEP 2: PACKAGES */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <div className="text-center mb-4 md:mb-6">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 text-white">
                                    Choose Your {selectedCat?.charAt(0) + selectedCat?.slice(1).toLowerCase()} Experience
                                </h2>
                                <p className="text-sm md:text-base text-white/70 font-black max-w-2xl mx-auto px-4">Select the perfect flight duration for your selected adventure.</p>
                                <p className="text-base md:text-lg text-red-500 font-black mt-4 italic animate-pulse bg-white/10 py-2 px-6 rounded-full inline-block backdrop-blur-sm border border-red-500/20">
                                    * Subject to climate change, there may be delays in flight schedules.
                                </p>
                            </div>

                            <div className={`${PACKAGES_DATA[selectedCat]?.length < 4 ? "flex flex-wrap justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"} gap-4 max-w-[1440px] mx-auto pb-12 px-4 w-full h-full items-stretch`}>
                                {PACKAGES_DATA[selectedCat]?.map((pkg, idx) => (
                                    <motion.div
                                        key={pkg.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => { setSelectedPkg(pkg.id); setStep(3); }}
                                        className={`cursor-pointer flex flex-col rounded-[2rem] p-5 md:p-6 min-w-[280px] max-w-[350px] flex-1 relative overflow-hidden backdrop-blur-3xl border-2 transition-all duration-500 shadow-2xl group ${selectedPkg === pkg.id
                                            ? "bg-white/20 border-[#F4B400] text-white"
                                            : "bg-white/5 border-white/10 hover:border-[#F4B400]/40 text-white"
                                            }`}
                                    >
                                        <div className="mb-4">
                                            {pkg.ribbon && (
                                                <div className="mb-2">
                                                    <span className="bg-[#F4B400] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest inline-block">
                                                        {pkg.ribbon}
                                                    </span>
                                                </div>
                                            )}
                                            <h3 className="text-lg md:text-xl font-black mb-1 opacity-90 group-hover:opacity-100 uppercase tracking-tight leading-tight">
                                                {pkg.name}
                                            </h3>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-2xl md:text-3xl font-black text-[#F4B400]">₹ {pkg.price.toLocaleString('en-IN')}</span>
                                                <span className="text-white/40 text-[9px] font-black uppercase">/ Slot</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm md:text-base font-black mb-4 py-2 border-y border-white/10 uppercase tracking-tight">
                                            <MapPin className="w-4 h-4 text-[#F4B400]" /> {pkg.duration}
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            {pkg.points?.map((point, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs md:text-sm font-normal text-white/70 group-hover:text-white/90">
                                                    <div className="w-4 h-4 rounded-full bg-[#F4B400]/20 flex items-center justify-center shrink-0">
                                                        <Check className="w-2.5 h-2.5 text-[#F4B400]" />
                                                    </div>
                                                    <span className="line-clamp-1">{point}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className={`mt-auto w-full py-4 rounded-2xl font-black transition-all duration-300 ${selectedPkg === pkg.id
                                                ? "bg-[#F4B400] text-black shadow-[0_0_20px_rgba(244,180,0,0.4)]"
                                                : "bg-white/10 text-white group-hover:bg-[#F4B400] group-hover:text-black"
                                                }`}
                                        >
                                            {selectedPkg === pkg.id ? "Selected Package" : "Choose Experience"}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: DETAILS FORM */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-2xl mx-auto px-2"
                        >
                            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-sm border border-white/30 dark:border-white/5 p-5 md:p-8 rounded-3xl shadow-xl dark:shadow-none">
                                <h2 className="text-2xl md:text-3xl font-black mb-2 text-gray-900 dark:text-white">{selectedCat} Verification</h2>
                                <p className="text-sm md:text-base text-gray-700 dark:text-white/60 mb-6">Safety parameter verification for your ride category.</p>

                                {/* Passenger Information - Consolidated Section */}
                                <div className="space-y-6">
                                    <h3 className="font-black text-gray-900 dark:text-white mb-4">Passenger Information</h3>

                                    {/* Lead Passenger / Contact Details */}
                                    <div className="bg-gray-50 dark:bg-black/30 p-5 rounded-3xl border border-gray-200 dark:border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-black">#1</div>
                                            <span className="font-black text-gray-900 dark:text-white">Lead Passenger</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 text-gray-900 dark:text-white font-black"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number"
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 text-gray-900 dark:text-white font-black"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 text-gray-900 dark:text-white font-black appearance-none cursor-pointer"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            >
                                                <option value="" className="text-black">Select Your City</option>
                                                {["Delhi", "Mumbai", "Pune", "Goa", "Bangalore", "Chennai", "Hyderabad", "Chandigarh", "Jaipur", "Ahmedabad"].map(city => (
                                                    <option key={city} value={city} className="text-black">{city}</option>
                                                ))}
                                                <option value="Other" className="text-black">Other</option>
                                            </select>
                                            <div className="flex gap-2 bg-gray-200 dark:bg-white/5 p-1 rounded-xl items-center">
                                                {['M', 'F', 'O'].map(g => (
                                                    <button
                                                        key={g}
                                                        className={`flex-1 py-2 px-2 rounded-lg font-black flex items-center justify-center gap-2 transition-all text-xs group ${passengers[0].gender === g ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'}`}
                                                        onClick={() => {
                                                            const newP = [...passengers];
                                                            newP[0].gender = g;
                                                            if (g !== 'F') newP[0].isFemaleSharing = false;
                                                            setPassengers(newP);
                                                        }}
                                                    >
                                                        {g === 'M' || g === 'F' ? (
                                                            <img
                                                                src={g === 'M' ? '/images/sign/male.png' : '/images/sign/female.png'}
                                                                className={`w-4 h-4 transition-all ${passengers[0].gender === g ? 'brightness-0' : 'invert opacity-40 group-hover:opacity-100'}`}
                                                                alt={g}
                                                            />
                                                        ) : (
                                                            <User className={`w-4 h-4 transition-all ${passengers[0].gender === g ? 'text-black' : 'text-current opacity-40 group-hover:opacity-100'}`} />
                                                        )}
                                                        {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedCat === "SHARING" && passengers[0].gender === "F" && (
                                                <div className="flex flex-col gap-2 w-full mt-2 md:col-span-2">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <div
                                                            className={`w-10 h-6 rounded-full p-1 transition-colors ${passengers[0].isFemaleSharing ? 'bg-pink-500' : 'bg-gray-300 dark:bg-white/10'}`}
                                                            onClick={() => {
                                                                const newP = [...passengers];
                                                                newP[0].isFemaleSharing = !newP[0].isFemaleSharing;
                                                                setPassengers(newP);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${passengers[0].isFemaleSharing ? 'translate-x-4' : 'translate-x-0'}`} />
                                                        </div>
                                                        <span className="text-sm font-black text-white/70 group-hover:text-white transition-colors">Pair with female rider only</span>
                                                    </label>
                                                    {passengers[0].isFemaleSharing && (
                                                        <p className="text-[10px] text-pink-500 font-black italic animate-pulse">
                                                            * Warning: You may have to wait until another female rider books this slot.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-black outline-none focus:border-yellow-500 text-center"
                                                value={passengers[0].age}
                                                onChange={(e) => {
                                                    const newP = [...passengers];
                                                    newP[0].age = e.target.value;
                                                    setPassengers(newP);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Weight (KG)"
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-black outline-none focus:border-yellow-500 text-center"
                                                value={passengers[0].weight}
                                                onChange={(e) => {
                                                    const newP = [...passengers];
                                                    newP[0].weight = e.target.value;
                                                    setPassengers(newP);
                                                    if (selectedCat === "SINGLE" && parseInt(e.target.value) > 150) {
                                                        showError("Single ride limit is 150 KG.");
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Passengers */}
                                    {passengers.slice(1).map((p, pIdx) => {
                                        const idx = pIdx + 1; // Real index in passengers array
                                        return (
                                            <div key={idx} className="bg-gray-50 dark:bg-black/30 p-5 rounded-3xl border border-gray-200 dark:border-white/5 space-y-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-black">#{idx + 1}</div>
                                                        <span className="font-black text-gray-900 dark:text-white">Passenger {idx + 1}</span>
                                                    </div>
                                                    {selectedCat === "FAMILY" && (
                                                        <button
                                                            onClick={() => {
                                                                const newP = passengers.filter((_, i) => i !== idx);
                                                                setPassengers(newP);
                                                            }}
                                                            className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                                            title="Remove Passenger"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder={selectedCat === "COUPLE" ? "Co-Passenger Name" : `Passenger ${idx + 1} Name`}
                                                    className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-black outline-none focus:border-yellow-500"
                                                    value={p.coPassengerName || ""}
                                                    onChange={(e) => {
                                                        const newP = [...passengers];
                                                        newP[idx].coPassengerName = e.target.value;
                                                        setPassengers(newP);
                                                    }}
                                                />

                                                <div className="flex bg-gray-200 dark:bg-white/5 p-1 rounded-xl items-center">
                                                    {['M', 'F', 'O'].map(g => (
                                                        <button
                                                            key={g}
                                                            className={`flex-1 py-3 px-2 rounded-lg font-black flex items-center justify-center gap-2 transition-all group ${p.gender === g ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'}`}
                                                            onClick={() => {
                                                                const newP = [...passengers];
                                                                newP[idx].gender = g;
                                                                setPassengers(newP);
                                                            }}
                                                        >
                                                            {g === 'M' || g === 'F' ? (
                                                                <img
                                                                    src={g === 'M' ? '/images/sign/male.png' : '/images/sign/female.png'}
                                                                    className={`w-5 h-5 transition-all ${p.gender === g ? 'brightness-0' : 'invert opacity-40 group-hover:opacity-100'}`}
                                                                    alt={g}
                                                                />
                                                            ) : (
                                                                <User className={`w-5 h-5 transition-all ${p.gender === g ? 'text-black' : 'text-current opacity-40 group-hover:opacity-100'}`} />
                                                            )}
                                                            {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="number"
                                                        placeholder="Age"
                                                        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-black outline-none focus:border-yellow-500 text-center"
                                                        value={p.age}
                                                        onChange={(e) => {
                                                            const newP = [...passengers];
                                                            newP[idx].age = e.target.value;
                                                            setPassengers(newP);
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Weight (KG)"
                                                        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-black outline-none focus:border-yellow-500 text-center"
                                                        value={p.weight}
                                                        onChange={(e) => {
                                                            const newP = [...passengers];
                                                            newP[idx].weight = e.target.value;
                                                            setPassengers(newP);
                                                            if (selectedCat === "COUPLE" && idx === 1 && parseInt(newP[0].weight) + parseInt(e.target.value) > 150) {
                                                                showError("Combined weight exceeds 150 KG limit for Couple ride.");
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {selectedCat === "FAMILY" && (
                                        <button
                                            className="w-full py-4 border border-dashed border-yellow-500/50 rounded-2xl text-yellow-500 hover:bg-yellow-500/5 transition-colors font-black flex items-center justify-center gap-2"
                                            onClick={() => setPassengers([...passengers, { gender: "M", weight: "", age: "", coPassengerName: "" }])}
                                        >
                                            <Users className="w-5 h-5" /> Add Group Member
                                        </button>
                                    )}

                                    <button
                                        onClick={validateDetailsForm}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 font-black text-black text-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                                    >
                                        Submit & Verify Slot
                                    </button>

                                    {selectedCat === "SHARING" && (
                                        <div className="text-center text-xs space-y-1 mt-2">
                                            <div className="text-yellow-400 font-black">
                                                "In sharing ride, you may share the flight with another male or female rider."
                                            </div>
                                            <div className="text-white/40 italic font-black">
                                                (Based on slot availability and pilot configuration)
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    )}




                    {/* STEP 5 & 6: Slot and Payment */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4"
                        >
                            {/* Slot Selection Panel */}
                            <div className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-wider">Schedule Flight</h3>
                                    <p className="text-sm md:text-base text-red-500 font-black mt-2 italic bg-black/40 py-1 px-4 rounded-lg border border-red-500/20 inline-block">
                                        * Subject to climate change, there may be delays in flight schedules.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Select Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-[#F4B400] [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Available Slots</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {availableSlots.length === 0 ? (
                                                <div className="text-center text-white/50 p-4">No slots available for this date</div>
                                            ) : (
                                                availableSlots.map(slot => {
                                                    const available = slot.availableSeats;
                                                    const isFull = available <= 0;
                                                    return (
                                                        <button
                                                            key={slot.id}
                                                            disabled={isFull}
                                                            onClick={() => setSelectedSlot(slot.id)}
                                                            className={`p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${isFull ? 'opacity-30 bg-red-900/20 border-red-500/30 cursor-not-allowed' :
                                                                selectedSlot === slot.id ? 'bg-[#F4B400] border-[#F4B400] text-black font-black shadow-glow-amber' :
                                                                    'bg-white/5 border-white/10 hover:border-[#F4B400]/40'
                                                                }`}
                                                        >
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-xl font-black">{slot.time}</span>
                                                                <span className={`text-[10px] font-black uppercase ${selectedSlot === slot.id ? 'text-black/60' : 'text-white/40'}`}>
                                                                    {isFull ? 'Sold Out' : `${available} Wings Left`}
                                                                </span>
                                                            </div>
                                                            {!isFull && selectedSlot === slot.id && <Check className="w-5 h-5" />}
                                                        </button>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary Panel */}
                            <div className="flex-[0.8] flex flex-col gap-6">
                                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl">
                                    <h3 className="text-2xl font-black mb-8 text-white uppercase tracking-wider">Price Summary</h3>

                                    <div className="space-y-5 mb-8">
                                        <div className="flex justify-between items-center text-white/60">
                                            <span className="font-black text-sm">Package</span>
                                            <span className="font-black text-white">{PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-white/60">
                                            <span className="font-black text-sm">Travelers</span>
                                            <span className="font-black text-white">{calculateTotal().travelers} Pax</span>
                                        </div>
                                        <div className="flex justify-between items-center text-white/60">
                                            <span className="font-black text-sm">Base Price</span>
                                            <span className="font-black text-white">₹{calculateTotal().base.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-white/60">
                                            <span className="font-black text-sm">Insurance</span>
                                            <span className="font-black text-white">₹{calculateTotal().ins.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-[#F4B400]">Express Check-in</span>
                                                <span className="text-[10px] text-white/40 font-black">+₹500 / person</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={isVipCheckin} 
                                                    onChange={(e) => setIsVipCheckin(e.target.checked)} 
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4B400]"></div>
                                            </label>
                                        </div>
                                        {isVipCheckin && (
                                            <div className="flex justify-between items-center text-[#F4B400] px-2">
                                                <span className="font-black text-sm">Express Check-in ({calculateTotal().travelers}x)</span>
                                                <span className="font-black">₹{calculateTotal().vip.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-white/10 w-full" />
                                        <div className="space-y-2 py-2">
                                            <div className="flex justify-between items-center text-white/40 text-[11px] font-black uppercase tracking-wider">
                                                <span>CGST (9%)</span>
                                                <span>₹{calculateTotal().cgst.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-white/40 text-[11px] font-black uppercase tracking-wider">
                                                <span>SGST (9%)</span>
                                                <span>₹{calculateTotal().sgst.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="h-px bg-white/10 w-full" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-xl text-[#F4B400]">TOTAL</span>
                                            <span className="text-3xl font-black text-white">₹{calculateTotal().total.toLocaleString()}</span>
                                        </div>
                                        <div className="text-[10px] text-white/40 font-black text-right">(GST 18% Applied)</div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Payment Method</label>
                                            {isAgent && userProfile && (
                                                <span className="text-[10px] font-black text-[#F4B400] uppercase tracking-widest bg-[#F4B400]/10 px-2 py-0.5 rounded">
                                                    Wallet: ₹{userProfile.walletBalance.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['UPI', 'Card', 'NetBanking', 'Pay Later', ...(isAgent ? ['Points'] : [])].map(method => (
                                                <button
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${paymentMethod === method
                                                        ? 'border-[#F4B400] bg-[#F4B400]/10 text-[#F4B400]'
                                                        : 'border-white/5 text-white/30 hover:border-white/20'
                                                        } ${method === 'Points' ? 'relative overflow-hidden' : ''}`}
                                                >
                                                    {method}
                                                    {method === 'Points' && <BadgePercent className="w-3 h-3 absolute top-1 right-1 opacity-50" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    disabled={!selectedSlot}
                                    onClick={() => setStep(6)}
                                    className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 ${!selectedSlot
                                        ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-black hover:scale-[1.02] shadow-2xl'
                                        }`}
                                >
                                    Proceed to Confirmation <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: CONSENT & FINAL CONFIRM */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-3xl mx-auto px-4"
                        >
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl">
                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                        <Shield className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black mb-4 text-white">Final Confirmation</h3>
                                    <p className="text-white/60 font-black">Review & accept the mandatory safety terms.</p>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 hover:border-[#F4B400]/20 transition-all">
                                        <label className="flex items-start gap-5 cursor-pointer group">
                                            <div className="mt-1">
                                                <input
                                                    type="checkbox"
                                                    className="w-6 h-6 rounded bg-[#0E1B2A] border-white/10 text-[#F4B400] focus:ring-[#F4B400]"
                                                    checked={consent.terms}
                                                    onChange={(e) => setConsent({ ...consent, terms: e.target.checked })}
                                                />
                                            </div>
                                            <span className="text-sm md:text-base font-black text-white/70 leading-relaxed group-hover:text-white transition-colors">
                                                I confirm medical fitness, sobriety, and weight within limits
                                                <span className="text-[#F4B400] font-black mx-1">({selectedCat === "COUPLE" ? "150KG Combined" : "75KG Single"})</span>.
                                                I accept the <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-[#F4B400] underline underline-offset-4 decoration-[#F4B400]/30 hover:decoration-[#F4B400]">Safety Terms & Conditions</a>.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                        <label className="flex items-center gap-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded bg-[#0E1B2A] border-white/10 text-[#F4B400]"
                                                checked={consent.media}
                                                onChange={(e) => setConsent({ ...consent, media: e.target.checked })}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">Optional Media Consent for Socials</span>
                                                <p className="text-[10px] text-white/50 leading-tight">By checking this, you allow us to capture and share your flight moments on our official social media handles for promotional purposes.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    disabled={!isConsentValid}
                                    onClick={handlePayment}
                                    className={`w-full py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-4 ${!isConsentValid
                                        ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                                        : 'bg-[#F4B400] text-black shadow-glow-amber hover:scale-[1.02]'
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6" /> Confirm & Secure Booking
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 7: CONFIRMATION SCREEN */}
                    {step === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-4xl mx-auto text-center px-4"
                        >
                            <div className="w-28 h-28 bg-[#F4B400] rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-amber">
                                <Check className="w-14 h-14 text-black" strokeWidth={3} />
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black mb-4 text-white tracking-tighter">Your Sky Adventure is Confirmed</h2>
                            <p className="text-lg md:text-2xl text-white/60 font-black mb-12">Get ready to touch the clouds. Your booking is finalized.</p>

                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-14 rounded-[4rem] text-left mb-12 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B400]/5 blur-[80px] -mr-32 -mt-32" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4B400] mb-3">Booking Identifier</p>
                                            <p className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest">{bookingId}</p>
                                            
                                            <div className="grid grid-cols-2 gap-6 mt-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Slot Time</p>
                                                    <p className="font-black text-white text-lg">{availableSlots.find(s => s.id === selectedSlot)?.time}</p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="space-y-6 pt-6 md:pt-0 md:pl-12 md:border-l border-white/10">
                                        <div className="flex justify-between items-center group/item">
                                            <span className="text-sm font-black text-white/40">Flight Date</span>
                                            <span className="font-black text-white">{selectedDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-black text-white/40">Category</span>
                                            <span className="font-black text-white">{selectedCat}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-black text-white/40">Passengers</span>
                                            <span className="font-black text-white">{passengers.length} Persons</span>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-sm font-black text-[#F4B400]">PAYMENT SETTLED</span>
                                            <span className="font-black text-xl text-white">₹ {calculateTotal().total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                <button onClick={handleDownloadTicket} className="flex items-center justify-center py-5 bg-[#F4B400] text-black hover:bg-[#FF9F1C] rounded-[2rem] font-black transition-all shadow-glow-amber">
                                    <Download className="w-5 h-5 mr-3" /> Get Ticket
                                </button>
                                <button onClick={handleDownloadInvoice} className="flex items-center justify-center py-5 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-[2rem] font-black transition-all">
                                    <Download className="w-5 h-5 mr-3" /> Get Invoice
                                </button>
                                <button onClick={() => window.open('https://maps.apple.com/maps?daddr=19.0760,72.8777', '_blank')} className="flex items-center justify-center py-5 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-[2rem] font-black transition-all">
                                    <MapPin className="w-5 h-5 mr-3" /> Office Directions
                                </button>
                                <button onClick={() => navigate('/')} className="flex items-center justify-center py-5 bg-white text-black hover:scale-[1.05] rounded-[2rem] font-black transition-all">
                                    <ArrowLeft className="w-5 h-5 mr-3" /> Back to Home
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Floating CTA */}
            <FloatingCTA onBookClick={() => setStep(3)} />

            {/* Live Notifications */}
            <LiveNotifications />

            {/* Terms and Conditions Modal */}
            <TermsAndConditionsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
        </div >
    );
}
