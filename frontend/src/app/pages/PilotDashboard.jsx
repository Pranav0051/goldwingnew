"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Users, Home, LogOut } from "lucide-react";
import { bookingStore } from "../utils/bookingStore";
import { authService } from "../services/api";

export function PilotDashboard() {
    const navigate = useNavigate();

    // Authentication check
    useEffect(() => {
        if (localStorage.getItem("isPilotLoggedIn") !== "true") {
            navigate("/login");
            return;
        }
    }, [navigate]);

    const [bookings, setBookings] = useState(() => bookingStore.getBookings());

    useEffect(() => {
        const handleUpdate = () => {
            setBookings(bookingStore.getBookings());
        };
        window.addEventListener('bookingsChanged', handleUpdate);
        return () => window.removeEventListener('bookingsChanged', handleUpdate);
    }, []);

    // Get current date
    const today = new Date().toISOString().split("T")[0];

    // Calculate stats per date
    const dateStats = useMemo(() => {
        const statsMap = {};
        bookings.forEach(b => {
            if (b.status === "Confirmed") {
                statsMap[b.date] = (statsMap[b.date] || 0) + 1;
            }
        });
        return statsMap;
    }, [bookings]);

    // Generate next 7 days schedule
    const upcomingSchedule = useMemo(() => {
        const days = [];
        for (let i = 0; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];

            // Get slots for this date
            const slots = {};
            bookings.filter(b => b.date === dateStr && b.status === "Confirmed").forEach(b => {
                slots[b.slot] = (slots[b.slot] || 0) + b.persons;
            });

            days.push({
                date: dateStr,
                total: Object.values(slots).reduce((a, b) => a + b, 0),
                slots: Object.entries(slots).sort((a, b) => a[0].localeCompare(b[0]))
            });
        }
        return days;
    }, [bookings]);

    // History (Past dates)
    const historyStats = useMemo(() => {
        const statsMap = {};
        bookings.forEach(b => {
            if (b.status === "Confirmed" && b.date < today) {
                statsMap[b.date] = (statsMap[b.date] || 0) + 1;
            }
        });
        return Object.entries(statsMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [bookings, today]);

    return (
        <div className="min-h-screen bg-[#05070A] text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/10 gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/?skipLoader=true")}
                            className="w-10 h-10 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
                        >
                            <Home className="w-5 h-5 group-hover:text-[#F4B400]" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black">Pilot Dashboard</h1>
                            <p className="text-sm text-white/60">Flight overview and booking counts</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            authService.logout();
                            navigate("/login?skipLoader=true");
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-normal transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>

                {/* Summary Card for Today */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#111827] to-[#0B0F19] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B400]/5 blur-[80px] -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F4B400] mb-2">Today's Schedule</p>
                            <h2 className="text-3xl md:text-5xl font-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] text-center min-w-[200px]">
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Total Bookings</p>
                            <p className="text-5xl md:text-7xl font-black text-[#F4B400] tracking-tighter">
                                {dateStats[today] || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Schedule Section */}
                <div className="bg-[#111827] border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-white/10 bg-[#F4B400]/5">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#F4B400]" /> Upcoming 7-Day Schedule
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {upcomingSchedule.map((day, idx) => (
                            <div key={day.date} className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${day.date === today ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                                        <div>
                                            <h4 className="text-xl font-black">
                                                {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                                            </h4>
                                            {day.date === today && <span className="text-[10px] text-[#F4B400] font-black uppercase tracking-widest">Active Today</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white">{day.total} PAX</div>
                                        <div className="text-xs text-white/40 uppercase tracking-widest">Total Travelers</div>
                                    </div>
                                </div>

                                {day.slots.length > 0 ? (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {day.slots.map(([time, count]) => (
                                            <div key={time} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                                                <span className="text-xs text-white/50">{time}</span>
                                                <span className="text-sm font-black text-[#F4B400]">{count} PAX</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-4 text-xs text-white/20 italic">No flights scheduled yet</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Breakdown Table */}
                <div className="bg-[#05070A] border border-white/10 rounded-[2rem] overflow-hidden opacity-60">
                    <div className="p-6 border-b border-white/10 bg-white/5">
                        <h3 className="text-lg font-black flex items-center gap-2">
                            Past Flight History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-white/5">
                                {historyStats.length > 0 ? historyStats.map((stat) => (
                                    <tr key={stat.date}>
                                        <td className="px-8 py-4 text-sm text-white/60">
                                            {new Date(stat.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-4 text-right text-sm font-black text-white/60">
                                            {stat.count} Flights
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className="px-8 py-10 text-center text-white/10 text-xs">No past history</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-white/30 text-xs font-normal">
                    * Confirmed online and offline bookings are included in the count.
                </p>

            </div>
        </div>
    );
}
