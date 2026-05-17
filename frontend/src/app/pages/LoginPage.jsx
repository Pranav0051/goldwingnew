"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { EyeOff, Eye, ArrowRight, AlertCircle, X } from "lucide-react";
import { authService } from "../services/api";
import { ThemeToggle } from "../components/ThemeToggle";
export function LoginPage() {
    const navigate = useNavigate();
    const [loginRole, setLoginRole] = useState("agent");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 4000);
    };
    // Removed auto-redirect logic to prevent stale redirects
    // User should only be redirected after a successful login attempt
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            showError("Please enter both username and password.");
            return;
        }

        try {
            console.log(`Attempting login for ${email} with role ${loginRole}`);
            const data = await authService.login(email, password);
            console.log("Login successful, received data:", data);
            const roles = data.roles || [];
            
            // Clear all role flags to prevent stale session conflicts
            localStorage.removeItem("isAdminLoggedIn");
            localStorage.removeItem("isStaffLoggedIn");
            localStorage.removeItem("isPilotLoggedIn");
            localStorage.removeItem("isAgentLoggedIn");

            // Check if user has the authority for the selected panel
            if (loginRole === "admin" && roles.includes("ROLE_ADMIN")) {
                localStorage.setItem("isAdminLoggedIn", "true");
                navigate("/admin");
            } else if (loginRole === "staff" && (roles.includes("ROLE_STAFF") || roles.includes("ROLE_MODERATOR") || roles.includes("ROLE_ADMIN"))) {
                localStorage.setItem("isStaffLoggedIn", "true");
                navigate("/staff");
            } else if (loginRole === "pilot" && (roles.includes("ROLE_PILOT") || roles.includes("ROLE_MODERATOR") || roles.includes("ROLE_ADMIN"))) {
                localStorage.setItem("isPilotLoggedIn", "true");
                navigate("/pilot");
            } else if (loginRole === "agent" && (roles.includes("ROLE_USER") || roles.includes("ROLE_ADMIN"))) {
                localStorage.setItem("isAgentLoggedIn", "true");
                navigate("/agent");
            } else {
                console.warn("User authenticated but missing role for selected panel. Roles:", roles);
                // If they don't have the specific role, try to redirect to their highest privilege
                if (roles.includes("ROLE_ADMIN")) {
                    localStorage.setItem("isAdminLoggedIn", "true");
                    navigate("/admin");
                } else if (roles.includes("ROLE_STAFF") || roles.includes("ROLE_MODERATOR")) {
                    localStorage.setItem("isStaffLoggedIn", "true");
                    navigate("/staff");
                } else if (roles.includes("ROLE_PILOT")) {
                    localStorage.setItem("isPilotLoggedIn", "true");
                    navigate("/pilot");
                } else if (roles.includes("ROLE_USER")) {
                    localStorage.setItem("isAgentLoggedIn", "true");
                    navigate("/agent");
                } else {
                    showError("Unauthorized role access.");
                }
            }
        } catch (err) {
            console.error("Full Login Error Object:", err);
            const errorDetail = err.response?.data?.message || err.message;
            showError("Login failed: " + errorDetail);
        }
    };
    return (<div className="min-h-[100dvh] bg-gradient-to-br from-[#9Bc2d3] to-[#e4a8c9] dark:from-[#0B0F19] dark:to-[#111827] flex items-center justify-center p-4 md:p-12 font-sans relative overflow-x-hidden transition-colors duration-300">
        {/* Error Toast */}
        <AnimatePresence>
            {errorMsg && (<motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-normal max-w-sm w-[90%]">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span className="flex-1 text-sm">{errorMsg}</span>
                <button onClick={() => setErrorMsg("")} className="shrink-0 p-1 hover:bg-white/20 rounded-full transition">
                    <X className="w-5 h-5" />
                </button>
            </motion.div>)}
        </AnimatePresence>

        <Link to="/?skipLoader=true" className="absolute top-6 left-6 inline-flex items-center text-white/90 dark:text-white/70 font-normal hover:text-white dark:hover:text-white transition drop-shadow-md z-50">
            ← Back to Home
        </Link>

        <div className="absolute top-6 right-6 z-50">
            <ThemeToggle />
        </div>

        <div className="w-full max-w-5xl bg-white dark:bg-[#1A2235] rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-0 transition-colors duration-300">
            {/* Left Form Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-[#1A2235] relative items-center transition-colors duration-300">
                
                <div className="w-full max-w-[420px]">
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-5xl text-[#1a1a1a] dark:text-white tracking-tight flex items-center whitespace-nowrap transition-colors duration-300" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700 }}>
                            Welcome Back <span className="text-[#d98cb3] ml-3 text-3xl md:text-4xl mt-1">✨</span>
                        </h1>
                    </div>
                    
                    <p className="text-base text-gray-600 dark:text-gray-400 mb-8 font-medium tracking-wide transition-colors duration-300">Please select your role and log in</p>

                    <div className="mb-10 p-1.5 bg-[#dae9f2]/40 dark:bg-black/20 rounded-2xl flex flex-wrap shadow-inner border border-[#dae9f2]/60 dark:border-white/5 transition-colors duration-300">
                        <button 
                            type="button" 
                            onClick={() => setLoginRole("admin")} 
                            className={`flex-1 min-w-[70px] py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${loginRole === "admin" ? 'bg-white dark:bg-gray-800 text-[#cc7a9c] dark:text-[#d98cb3] shadow-sm transform scale-[1.02]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Admin
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setLoginRole("agent")} 
                            className={`flex-1 min-w-[70px] py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${loginRole === "agent" ? 'bg-white dark:bg-gray-800 text-[#cc7a9c] dark:text-[#d98cb3] shadow-sm transform scale-[1.02]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Agent
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setLoginRole("pilot")} 
                            className={`flex-1 min-w-[70px] py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${loginRole === "pilot" ? 'bg-white dark:bg-gray-800 text-[#cc7a9c] dark:text-[#d98cb3] shadow-sm transform scale-[1.02]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Pilot
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setLoginRole("staff")} 
                            className={`flex-1 min-w-[70px] py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${loginRole === "staff" ? 'bg-white dark:bg-gray-800 text-[#cc7a9c] dark:text-[#d98cb3] shadow-sm transform scale-[1.02]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            Staff
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide block transition-colors duration-300">Username</label>
                            <input 
                                type="text" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                autoComplete="off"
                                className="w-full bg-[#dae9f2]/60 dark:bg-black/30 text-gray-800 dark:text-gray-100 rounded-xl px-5 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#d98cb3] transition-all border border-transparent focus:border-[#d98cb3] focus:bg-white dark:focus:bg-[#0B0F19] placeholder-gray-400 dark:placeholder-gray-500" 
                                placeholder="Enter your username" 
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide transition-colors duration-300">Password</label>
                                <a href="#" onClick={(e) => { e.preventDefault(); showError("Password reset link sent to your email!"); }} className="text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-[#d98cb3] dark:hover:text-[#d98cb3] transition-colors">Forgot Password ?</a>
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    autoComplete="new-password"
                                    className="w-full bg-[#dae9f2]/60 dark:bg-black/30 text-gray-800 dark:text-gray-100 rounded-xl px-5 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#d98cb3] transition-all border border-transparent focus:border-[#d98cb3] focus:bg-white dark:focus:bg-[#0B0F19] placeholder-gray-400 dark:placeholder-gray-500" 
                                    placeholder="••••••••••••" 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d98cb3]/70 hover:text-[#d98cb3] transition-colors">
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full sm:w-auto bg-[#cc7a9c] hover:bg-[#b06181] text-white text-base font-semibold py-3.5 px-10 rounded-full flex items-center justify-center transition-all shadow-lg shadow-[#cc7a9c]/30 hover:shadow-xl hover:shadow-[#cc7a9c]/40 hover:-translate-y-0.5">
                                LOGIN <ArrowRight className="w-5 h-5 ml-2.5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>            {/* Right Image Section */}
            <div className="hidden md:block w-1/2 bg-[#c2e0ee] dark:bg-[#0B0F19] rounded-[30px] p-2 m-4 shadow-inner relative overflow-hidden transition-colors duration-300">
                <img src="/login-illustration.png" alt="Login Illustration" className="w-full h-full object-cover object-center rounded-[20px] dark:brightness-75 dark:contrast-125 transition-all duration-300" />
            </div>

        </div>
    </div>);
}
