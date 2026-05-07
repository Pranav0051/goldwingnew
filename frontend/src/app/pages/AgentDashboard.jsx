"use client";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Copy, Users, Target, Trophy, ArrowRight, UserPlus, Link as LinkIcon, BadgePercent, Home, LogOut, TrendingUp, RefreshCw } from "lucide-react";
import { bookingService, authService } from "../services/api";

export function AgentDashboard() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [agentInfo, setAgentInfo] = useState({ id: "AGT105", name: "Agent" });
    const [userProfile, setUserProfile] = useState(null);

    // Authentication & Initial Data Fetch
    useEffect(() => {
        if (localStorage.getItem("isAgentLoggedIn") !== "true") {
            navigate("/login");
            return;
        }

        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const agentId = user.agentId || user.username || "agent";
                setAgentInfo({
                    id: agentId,
                    name: user.username || "Agent"
                });
                fetchAgentData(agentId);
            } catch (e) {
                console.error("Failed to parse user data", e);
                // Don't redirect - just use defaults
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [navigate]);

    const fetchAgentData = async (agentId) => {
        setIsLoading(true);
        try {
            const bookingsData = await bookingService.getBookingsByAgent(agentId);
            setBookings(bookingsData || []);
            const profileData = await authService.getUserProfile();
            if (profileData) setUserProfile(profileData);
        } catch (err) {
            console.error("Failed to fetch agent data", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic Agent Stats computed from real bookings
    const stats = useMemo(() => {
        const activeBookings = bookings.filter(b => b.status !== "CANCELLED");
        const totalBookings = activeBookings.length;
        const totalSeatsSold = activeBookings.reduce((sum, b) => sum + (b.persons || 0), 0);
        const commissionEarned = totalSeatsSold * 200; // ₹200 per seat
        
        return {
            level: totalBookings > 100 ? "Gold" : totalBookings > 50 ? "Silver" : "Bronze",
            totalBookings,
            totalSeatsSold,
            commissionEarned,
            pendingCommission: totalSeatsSold * 50, // Mock pending
            conversionRate: "12.4%",
            rank: 3
        };
    }, [bookings]);

    const referralLink = `${window.location.origin}/book?ref=${agentInfo.id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = referralLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#0B0F19] p-4 md:p-8 font-sans text-white overflow-x-hidden">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <Link to="/?skipLoader=true" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl transition-all group">
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => fetchAgentData(agentInfo.id)} 
                            disabled={isLoading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button onClick={() => {
                            authService.logout();
                            navigate("/login?skipLoader=true");
                        }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-normal transition-all group">
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Header & Level badge */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl gap-6 md:gap-4">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-700 to-[#111827] border-2 border-[#D4AF37] flex items-center justify-center text-xl md:text-2xl font-normal shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                            {agentInfo.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-xl md:text-2xl font-black text-white truncate">{agentInfo.name}</h1>
                            <p className="text-[#D4AF37] font-normal flex items-center text-sm md:text-base">
                                Agent ID: {agentInfo.id}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="flex-1 md:flex-none flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                            <span className="text-[10px] text-white/60 mb-1 uppercase tracking-wider">Top Rank</span>
                            <span className="font-normal text-lg flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#D4AF37]" /> #{stats.rank}</span>
                        </div>
                        <div className="flex-1 md:flex-none flex flex-col items-center justify-center p-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl text-black">
                            <Trophy className="w-4 h-4 mb-1 text-gray-800" />
                            <span className="font-normal text-xs tracking-widest uppercase">{stats.level}</span>
                            <span className="text-[9px] text-gray-800 mt-1 font-normal">{stats.level === "Gold" ? "MAX LEVEL" : `${stats.level === "Silver" ? 100 - stats.totalBookings : 50 - stats.totalBookings} to Next Level`}</span>
                        </div>
                    </div>
                </div>

                {/* Action Grid (Referral & Assisted Booking) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <LinkIcon className="w-24 h-24 text-white" />
                        </div>
                        <h2 className="text-xl font-normal mb-2">Your Referral Link</h2>
                        <p className="text-white/60 text-sm mb-4">Share this link with customers. Every booking through this link earns you commission!</p>

                        <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1 relative z-10">
                            <input type="text" readOnly value={referralLink} className="bg-transparent w-full px-4 text-white/80 focus:outline-none text-sm" />
                            <button onClick={handleCopy} className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-normal flex items-center shrink-0 hover:bg-[#F7C948] transition cursor-pointer">
                                {copied ? <span className="flex items-center"><Target className="w-4 h-4 mr-1" /> Copied</span> : <span className="flex items-center"><Copy className="w-4 h-4 mr-1" /> Copy</span>}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <UserPlus className="w-24 h-24 text-white" />
                        </div>
                        <h2 className="text-xl font-normal mb-2 text-white">Assisted Booking</h2>
                        <p className="text-white/80 text-sm mb-4">Book on behalf of a walk-in or offline customer. Booking is strictly tagged to your ID.</p>

                        <button onClick={() => navigate(`/book?ref=${agentInfo.id}`)} className="mt-2 w-full bg-white text-indigo-900 font-normal py-3 rounded-xl flex items-center justify-center hover:bg-white/90 transition shadow-xl">
                            Create Booking for Customer <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>

                {/* Wallet & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#D4AF37] to-[#F4B400] border border-[#D4AF37]/30 rounded-2xl p-5 md:p-6 shadow-lg text-black">
                        <h3 className="text-black/60 text-[10px] md:text-sm font-black mb-1 uppercase tracking-wider">Available Points</h3>
                        <p className="text-xl md:text-3xl font-black mb-2 flex items-center">
                            <BadgePercent className="w-6 h-6 mr-2" /> 
                            ₹ {userProfile?.walletBalance?.toLocaleString('en-IN') || "0"}
                        </p>
                        <p className="text-black/40 text-[10px] font-bold italic">Can be used for new bookings</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-normal mb-1 uppercase tracking-wider">Life-time Earned</h3>
                        <p className="text-xl md:text-2xl font-normal text-white mb-2">₹ {stats.commissionEarned.toLocaleString('en-IN')}</p>
                        <p className="text-white/40 text-[10px]">Includes used points</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-normal mb-1 uppercase tracking-wider">Total Bookings</h3>
                        <p className="text-xl md:text-2xl font-normal text-white mb-2">{stats.totalBookings}</p>
                        <div className="flex items-center justify-between text-[10px] md:text-sm">
                            <span className="text-white/40">Success Rate: {stats.totalBookings > 0 ? "100%" : "0%"}</span>
                            <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {stats.conversionRate}</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-normal mb-1 uppercase tracking-wider">Seats Sold</h3>
                        <p className="text-xl md:text-2xl font-normal text-white flex items-center">
                            <Users className="w-4 h-4 mr-1 md:mr-2 text-[#D4AF37]" /> {stats.totalSeatsSold}
                        </p>
                        <p className="text-white/40 text-[9px] md:text-[10px] mt-2 flex items-center"><BadgePercent className="w-3 h-3 mr-1" /> ₹200 commission/seat</p>
                    </motion.div>
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-lg font-normal flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" /> Recent Bookings Attributed to You
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Booking ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date & Slot</th>
                                    <th className="px-6 py-4">Pax</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Commission</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-white/40">
                                            <div className="flex flex-col items-center gap-2">
                                                <RefreshCw className="w-6 h-6 animate-spin" />
                                                Loading your performance data...
                                            </div>
                                        </td>
                                    </tr>
                                ) : bookings.length > 0 ? (
                                    bookings.map((b) => (
                                        <tr key={b.bookingId} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-indigo-400">{b.bookingId}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-normal">{b.customerName}</div>
                                                <div className="text-[10px] text-white/40">{b.category}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{b.bookingDate}</div>
                                                <div className="text-[10px] text-white/40">{b.slot}</div>
                                            </td>
                                            <td className="px-6 py-4">{b.persons} Pax</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                                    b.status === "CONFIRMED" ? "bg-green-500/10 text-green-400 border-green-500/30" : 
                                                    b.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : 
                                                    "bg-red-500/10 text-red-400 border-red-500/30"
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-normal text-[#D4AF37]">
                                                ₹ {(b.persons || 0) * 200}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-white/40">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                    <Target className="w-6 h-6 opacity-20" />
                                                </div>
                                                <p>No bookings attributed to your ID yet.<br/><span className="text-xs">Share your referral link to start earning!</span></p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
