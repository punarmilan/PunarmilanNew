import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Check, MoreHorizontal } from 'lucide-react';

const dummyInterestRequests = {
  new: [
    {
      id: 1,
      name: "Hannah Marin",
      city: "Philadelphia",
      age: 23,
      height: "5'5\"",
      job: "Fashion Designer",
      date: "2026-06-20 10:30 AM",
      badge: "PLATINUM USER",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Spencer Hastings",
      city: "Seattle",
      age: 24,
      height: "5'7\"",
      job: "Research Analyst",
      date: "2026-06-19 04:15 PM",
      badge: "VERIFIED",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60"
    }
  ],
  accept: [
    {
      id: 3,
      name: "Caleb Rivers",
      city: "New York",
      age: 26,
      height: "5'11\"",
      job: "Software Engineer",
      date: "2026-06-18 09:00 AM",
      badge: "PREMIUM USER",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60"
    }
  ],
  deny: []
};

const tabs = [
  { id: "new", label: "New Requests", icon: <Heart size={14} className="fill-current" /> },
  { id: "accept", label: "Accepted", icon: <Check size={14} /> },
  { id: "deny", label: "Declined", icon: <X size={14} /> }
];

const InterestRequestCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("new");

    const requests = dummyInterestRequests[activeTab] || [];

    return (
        <div className="w-full dashboard-card-bg shadow-[0_12px_40px_rgba(229,213,192,0.15)] rounded-3xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EBDCCB]/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d94f73]/20 to-pink-50 flex items-center justify-center text-[#d94f73] border border-pink-100/50 shadow-sm">
                        <Heart className="w-5 h-5 fill-[#d94f73]" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#4A3728]">Interest Requests</h2>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Manage your connections</p>
                    </div>
                </div>
                
                {location.pathname !== '/inbox' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/inbox')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-xs font-semibold transition-all duration-200 border border-gray-200"
                        >
                            <span>See All</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modern Pill Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#FCFAF7]/50 p-1.5 rounded-full border border-[#EBDCCB]/30 w-max max-w-full overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                                isActive 
                                    ? "bg-white text-[#d94f73] shadow-md border border-pink-100/50 scale-105" 
                                    : "text-gray-500 hover:text-[#d94f73] hover:bg-white/50"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {isActive && dummyInterestRequests[tab.id]?.length > 0 && (
                                <span className="ml-1 bg-[#d94f73] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                    {dummyInterestRequests[tab.id].length}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Content List */}
            <div className="space-y-4 min-h-[200px]">
                <AnimatePresence mode="popLayout">
                    {requests.length > 0 ? (
                        requests.map((req, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                key={req.id}
                                className="group relative flex flex-col xl:flex-row items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm hover:shadow-[0_15px_30px_rgba(229,213,192,0.2)] hover:-translate-y-1 transition-all duration-300 flex-wrap overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                    {/* User Image with Badge */}
                                    <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/matches/${req.id}`)}>
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#c99a52]/20 group-hover:ring-[#c99a52]/60 transition-all duration-300">
                                            <img src={req.image} alt={req.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        {req.badge && (
                                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C5A059] to-[#8C6D39] text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-white z-10 uppercase tracking-widest">
                                                {req.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="text-center sm:text-left pt-2 sm:pt-0">
                                        <h3 
                                            className="font-bold text-base text-[#4A3728] cursor-pointer hover:text-[#C5A059] transition-colors"
                                            onClick={() => navigate(`/matches/${req.id}`)}
                                        >
                                            {req.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">
                                            {req.age} yrs <span className="opacity-50 mx-1">•</span> {req.height} <span className="opacity-50 mx-1">•</span> {req.job}
                                        </p>
                                        <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-gray-400">
                                            <svg className="w-3 h-3 text-[#43b978]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Located in {req.city}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center sm:justify-start gap-1 bg-gray-50 w-max mx-auto sm:mx-0 px-2 py-0.5 rounded text-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Received: {req.date}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
                                    <button 
                                        onClick={() => navigate(`/matches/${req.id}`)}
                                        className="px-4 py-2 border border-gray-200 bg-white hover:bg-[#FCFAF7] hover:border-[#C5A059] text-gray-600 hover:text-[#8C6D39] text-xs font-bold rounded-full shadow-sm hover:shadow transition-all duration-200"
                                    >
                                        View Profile
                                    </button>
                                    {activeTab === "new" && (
                                        <>
                                            <button 
                                                onClick={() => {/* placeholder accept interest action */}}
                                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-bold rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1"
                                            >
                                                <Check size={14} strokeWidth={3} /> Accept
                                            </button>
                                            <button 
                                                onClick={() => {/* placeholder deny interest action */}}
                                                className="px-5 py-2 border border-red-200 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                            >
                                                <X size={14} strokeWidth={3} /> Decline
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Heart className="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-600 mb-1">No requests here</h4>
                            <p className="text-xs text-gray-400">You don't have any {activeTab} requests right now.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InterestRequestCard;
