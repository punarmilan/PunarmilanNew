import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, ArrowRight, UserCheck, MessageCircle } from 'lucide-react';
import { fetchRecentConversations, openChatWith, markAllChatAsRead } from '../Slice/ChatSlice';
import { motion } from 'framer-motion';

const RecentChatsCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recentConversations, loading } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(fetchRecentConversations());
    }, [dispatch]);

    const handleOpenChat = (c) => {
        navigate(`/my-shadi/chats`, {
            state: {
                openChatUser: {
                    id: c.otherUserId,
                    fullName: c.otherUserName,
                    profilePhotoUrl: c.otherProfilePhotoUrl
                }
            }
        });
    };

    const dummyChats = [
        {
            otherUserId: 1,
            otherUserName: "Julia Ann",
            otherProfilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
            lastMessage: "Hey! I saw your profile and loved it. Let's connect!",
            lastActive: new Date().toISOString(),
            isOnline: true,
            unreadCount: 2
        },
        {
            otherUserId: 2,
            otherUserName: "Aria Montgomery",
            otherProfilePhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
            lastMessage: "Are you free to talk this weekend?",
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            isOnline: true,
            unreadCount: 0
        },
        {
            otherUserId: 4,
            otherUserName: "Elena Gilbert",
            otherProfilePhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
            lastMessage: "I accept your request, looking forward to speaking with you.",
            lastActive: new Date(Date.now() - 86400000).toISOString(),
            isOnline: false,
            unreadCount: 0
        }
    ];

    const activeChats = recentConversations && recentConversations.length > 0 ? recentConversations : dummyChats;

    return (
        <div className="w-full dashboard-card-bg shadow-[0_12px_40px_rgba(229,213,192,0.15)] rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_20px_48px_rgba(229,213,192,0.22)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBDCCB]/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c99a52]/20 to-amber-50 flex items-center justify-center text-[#c99a52] border border-amber-100/50 shadow-sm">
                        <MessageCircle className="w-5 h-5 fill-[#c99a52] text-[#c99a52]" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#4A3728]">Recent Conversations</h2>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Latest accepted chats</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/my-shadi/chats')}
                    className="flex items-center gap-1 text-xs font-bold text-[#8C6D39] hover:text-[#7C5D29] transition-all duration-200 border border-[#EBDCCB]/80 hover:border-[#8C6D39] px-3.5 py-1.5 rounded-full bg-white shadow-sm hover:shadow active:scale-95"
                >
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <div className="w-8 h-8 rounded-full border-4 border-amber-100 border-t-[#c99a52] animate-spin" />
                    <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Loading chats...</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeChats.slice(0, 4).map((c, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            key={c.otherUserId || i}
                            onClick={() => handleOpenChat(c)}
                            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 hover:border-[#c99a52]/40 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#c99a52]/10 group-hover:ring-[#c99a52]/40 transition-all duration-300">
                                        <img 
                                            src={c.otherProfilePhotoUrl || `https://ui-avatars.com/api/?name=${c.otherUserName}&background=FCFAF7&color=8C6D39`} 
                                            alt={c.otherUserName} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    {c.isOnline ? (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-300 rounded-full border-2 border-white shadow-sm" />
                                    )}
                                </div>

                                {/* Text Details */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold text-[#4A3728] truncate group-hover:text-[#c99a52] transition-colors">{c.otherUserName}</h3>
                                    <p className={`text-xs mt-1 truncate ${c.unreadCount > 0 ? 'text-[#4A3728] font-bold' : 'text-gray-500 font-medium'}`}>
                                        {c.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side Info */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                    {c.lastActive ? new Date(c.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                </span>
                                {c.unreadCount > 0 ? (
                                    <span className="bg-gradient-to-r from-[#d94f73] to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                        {c.unreadCount} NEW
                                    </span>
                                ) : (
                                    <UserCheck className="w-4 h-4 text-green-500/70" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentChatsCard;
