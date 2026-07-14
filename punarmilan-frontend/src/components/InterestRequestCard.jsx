import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Check, MoreHorizontal } from 'lucide-react';
import noInterestDataImg from '../assets/image/no_interest_data.svg';
import {
  fetchReceivedRequests,
  fetchAcceptedByMe,
  fetchAcceptedByHer,
  fetchDeclinedByMe,
  fetchDeclinedByThem,
  acceptConnectionRequest,
  declineConnectionRequest
} from '../Slice/MatchSlice';

const tabs = [
  { id: "new", label: "New Requests", icon: <Heart size={14} className="fill-current" /> },
  { id: "accept", label: "Accepted", icon: <Check size={14} /> },
  { id: "deny", label: "Declined", icon: <X size={14} /> }
];

const InterestRequestCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("new");

    const { 
        receivedRequests, 
        acceptedByMe, 
        acceptedByHer, 
        declinedByMe, 
        declinedByThem,
        loading 
    } = useSelector((state) => state.match);

    useEffect(() => {
        dispatch(fetchReceivedRequests());
        dispatch(fetchAcceptedByMe());
        dispatch(fetchAcceptedByHer());
        dispatch(fetchDeclinedByMe());
        dispatch(fetchDeclinedByThem());
    }, [dispatch]);

    const mapRequest = (req, isSent) => {
        const profile = isSent ? req.receiverProfile : req.senderProfile;
        if (!profile) return null;
        return {
            id: req.id,
            profileId: profile.userId,
            name: profile.fullName,
            city: profile.city || "N/A",
            age: profile.age || "N/A",
            height: profile.height || "N/A",
            job: profile.occupation || "N/A",
            date: new Date(req.createdAt).toLocaleDateString(),
            badge: profile.isPremium ? "PREMIUM" : (profile.verificationStatus === "VERIFIED" ? "VERIFIED" : null),
            image: profile.profilePhotoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60"
        };
    };

    const getRequests = () => {
        if (activeTab === "new") {
            return (receivedRequests || []).map(r => mapRequest(r, false)).filter(Boolean);
        } else if (activeTab === "accept") {
            return [
                ...(acceptedByMe || []).map(r => mapRequest(r, false)),
                ...(acceptedByHer || []).map(r => mapRequest(r, true))
            ].filter(Boolean);
        } else if (activeTab === "deny") {
            return [
                ...(declinedByMe || []).map(r => mapRequest(r, false)),
                ...(declinedByThem || []).map(r => mapRequest(r, true))
            ].filter(Boolean);
        }
        return [];
    };

    const requests = getRequests();

    const handleAccept = (id) => {
        dispatch(acceptConnectionRequest(id)).then(() => {
            dispatch(fetchReceivedRequests());
            dispatch(fetchAcceptedByMe());
        });
    };

    const handleDecline = (id) => {
        dispatch(declineConnectionRequest(id)).then(() => {
            dispatch(fetchReceivedRequests());
            dispatch(fetchDeclinedByMe());
        });
    };

    const getBadgeCount = (tabId) => {
        if (tabId === "new") return (receivedRequests || []).length;
        if (tabId === "accept") return (acceptedByMe || []).length + (acceptedByHer || []).length;
        if (tabId === "deny") return (declinedByMe || []).length + (declinedByThem || []).length;
        return 0;
    };

    return (
        <div className="w-full bg-theme-surface shadow-[var(--theme-shadow-soft)] rounded-3xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-theme-border/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFF2EF] to-white flex items-center justify-center text-[#E86D8A] border border-[#F2D7D9] shadow-sm">
                        <Heart className="w-5 h-5 fill-[#E86D8A]" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-theme-text">Interest Requests</h2>
                        <p className="text-[11px] text-theme-text-secondary font-medium uppercase tracking-wider">Manage your connections</p>
                    </div>
                </div>
                
                {location.pathname !== '/inbox' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/inbox')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-theme-text-secondary hover:text-gray-800 text-xs font-semibold transition-all duration-200 border border-theme-border"
                        >
                            <span>See All</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modern Pill Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-theme-bg/50 p-1.5 rounded-full border border-theme-border/30 w-max max-w-full overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const count = getBadgeCount(tab.id);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                                isActive 
                                    ? "bg-[#FFF2EF] text-[#E86D8A] shadow-md border border-[#F2D7D9] scale-105" 
                                    : "text-[#7A6666] hover:text-[#E86D8A] hover:bg-[#FFF6F2]"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {count > 0 && (
                                <span className="ml-1 bg-theme-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Content List */}
            <div className="space-y-4 min-h-[200px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <div className="w-8 h-8 rounded-full border-4 border-theme-border border-t-[#E86D8A] animate-spin" />
                        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Loading requests...</span>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {requests.length > 0 ? (
                            requests.map((req, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    key={req.id}
                                    className="group relative flex flex-col xl:flex-row items-center justify-between gap-4 p-4 bg-theme-surface/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm hover:shadow-[var(--theme-shadow-soft)] hover:-translate-y-1 transition-all duration-300 flex-wrap overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                                        {/* User Image with Badge */}
                                        <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/matches/${req.profileId}`)}>
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#c99a52]/20 group-hover:ring-[#c99a52]/60 transition-all duration-300">
                                                <img src={req.image} alt={req.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            {req.badge && (
                                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-white z-10 uppercase tracking-widest ${req.badge === 'VERIFIED' ? 'bg-theme-success' : 'bg-gradient-to-r from-theme-primary to-theme-pink'}`}>
                                                    {req.badge}
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="text-center sm:text-left pt-2 sm:pt-0">
                                            <h3 
                                                className="font-bold text-base text-theme-text cursor-pointer hover:text-theme-primary transition-colors"
                                                onClick={() => navigate(`/matches/${req.profileId}`)}
                                            >
                                                {req.name}
                                            </h3>
                                            <p className="text-xs text-theme-text-secondary mt-1 font-medium">
                                                {req.age} yrs <span className="opacity-50 mx-1">•</span> {req.height} <span className="opacity-50 mx-1">•</span> {req.job}
                                            </p>
                                            <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-gray-400">
                                                <svg className="w-3 h-3 text-[#E86D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Located in {req.city}
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center sm:justify-start gap-1 bg-gray-50 w-max mx-auto sm:mx-0 px-2 py-0.5 rounded text-theme-text-secondary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Received: {req.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
                                        <button 
                                            onClick={() => navigate(`/matches/${req.profileId}`)}
                                            className="px-4 py-2 border border-theme-border bg-theme-surface hover:bg-theme-lavender hover:border-theme-primary text-theme-primary text-xs font-bold rounded-full shadow-sm hover:shadow transition-all duration-200"
                                        >
                                            View Profile
                                        </button>
                                        {activeTab === "new" && (
                                            <>
                                                <button 
                                                    onClick={() => handleAccept(req.id)}
                                                    className="px-5 py-2 bg-theme-success hover:bg-[#059669] text-white text-xs font-bold rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1"
                                                >
                                                    <Check size={14} strokeWidth={3} /> Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleDecline(req.id)}
                                                    className="px-5 py-2 border border-[#F87171] bg-theme-surface text-[#EF4444] hover:bg-theme-error hover:text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
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
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <img 
                                    src={noInterestDataImg} 
                                    alt="No Requests" 
                                    className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4" 
                                />
                                <h4 className="text-base font-bold text-[#E86D8A] mb-1 font-serif">No Requests Found</h4>
                                <p className="text-xs text-[#7A6666] max-w-[280px]">You don't have any {activeTab} requests at the moment. Keep exploring profiles!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default InterestRequestCard;
