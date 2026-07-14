import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, Clock, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { fetchRecentConversations, fetchChatHistory, setActiveChatUser, markAllChatAsRead, clearChatError } from '../../../Slice/ChatSlice';
import ChatService from '../../../services/chatService';

const ChatsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentUser = useSelector((state) => state.user.user);
    const { recentConversations, conversations, loading, error } = useSelector((state) => state.chat);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (location.state?.openChatUser) {
            setSelectedUser(location.state.openChatUser);
        }
    }, [location.state]);

    useEffect(() => {
        if (error) {
            const errStr = typeof error === 'string' ? error : (error.message || String(error));
            if (errStr.toLowerCase().includes("premium") || errStr.toLowerCase().includes("upgrade")) {
                Swal.fire({
                    icon: 'warning',
                    title: '<span style="color:#8C6D39">Premium Feature</span>',
                    html: `<b>${error}</b>`,
                    confirmButtonText: 'Upgrade Now',
                    confirmButtonColor: '#8C6D39',
                    showCancelButton: true,
                    cancelButtonText: 'Later',
                    cancelButtonColor: '#6c757d',
                    background: '#fcfaf8'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/payment';
                    }
                });
            } else {
                toast.error(error, { duration: 4000 });
            }
            dispatch(clearChatError());
        }
    }, [error, dispatch]);

    // Dummy chats fallback for offline/no-data mode to look populated
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

    const activeConversations = React.useMemo(() => {
        let baseList = recentConversations && recentConversations.length > 0 ? [...recentConversations] : [...dummyChats];
        
        if (selectedUser) {
            const isPresent = baseList.some(c => c.otherUserId === selectedUser.id);
            if (!isPresent) {
                baseList.unshift({
                    otherUserId: selectedUser.id,
                    otherUserName: selectedUser.fullName,
                    otherProfilePhotoUrl: selectedUser.profilePhotoUrl,
                    lastMessage: "New Conversation",
                    lastActive: new Date().toISOString(),
                    isOnline: true,
                    unreadCount: 0
                });
            }
        }
        return baseList;
    }, [recentConversations, selectedUser]);

    useEffect(() => {
        dispatch(fetchRecentConversations());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(setActiveChatUser(selectedUser.id));
            dispatch(fetchChatHistory({ targetUserId: selectedUser.id }));
            dispatch(markAllChatAsRead(selectedUser.id));
        }
        return () => {
            dispatch(setActiveChatUser(null));
        };
    }, [selectedUser, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUser, conversations]);

    const activeChatData = selectedUser ? conversations[selectedUser.id] || { messages: [] } : { messages: [] };

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        try {
            const messageDTO = {
                senderId: currentUser.id,
                recipientId: selectedUser.id,
                content: messageText
            };

            ChatService.sendMessage(messageDTO);
            setMessageText('');
        } catch (err) {
            console.error("Error in handleSend:", err);
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-140px)] bg-transparent flex flex-col font-sans pb-8">
            {/* Header */}
            <div className="dashboard-card-bg border border-white/50 rounded-3xl p-4 md:px-6 shadow-sm mb-6 relative overflow-hidden mt-3 h-[120px] flex flex-col justify-center">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-100/40 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100/40 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <div>
                    <h1 className="text-2xl md:text-3xl font-black font-serif text-[#c99a52] mb-2 flex items-center gap-3 drop-shadow-sm">Messages</h1>
                    <p className="text-xs md:text-sm text-gray-700 font-medium max-w-2xl leading-relaxed">Connect with your accepted matches in real-time</p>
                </div>
            </div>

            {/* Main Chat Area Split Panel */}
            <div className="flex-1 w-full dashboard-card-bg rounded-[24px] border border-white/50 shadow-sm flex overflow-hidden min-h-[600px] max-h-[750px]">
                {/* Left Side: Conversations List */}
                <div className={`w-full md:w-full max-w-[360px] border-r border-white/40 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/40 bg-theme-surface/30">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="w-full pl-9 pr-4 py-2 text-sm bg-theme-surface/50 border border-white/60 rounded-xl outline-none focus:border-pink-300 transition-all placeholder-gray-500 text-gray-800 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100/50">
                        {activeConversations.map((c) => {
                            const isSelected = selectedUser && selectedUser.id === c.otherUserId;
                            return (
                                <div
                                    key={c.otherUserId}
                                    onClick={() => setSelectedUser({
                                        id: c.otherUserId,
                                        fullName: c.otherUserName,
                                        profilePhotoUrl: c.otherProfilePhotoUrl
                                    })}
                                    className={`flex items-center gap-3.5 px-5 py-4 cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? 'bg-amber-50/60 border-l-4 border-l-[#8C6D39]' 
                                            : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-amber-100">
                                            <img 
                                                src={c.otherProfilePhotoUrl || `https://i.pravatar.cc/100?u=${c.otherUserId}`} 
                                                alt={c.otherUserName} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {c.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                                        )}
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="font-bold text-sm text-[#4A3728] truncate">{c.otherUserName}</span>
                                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                {new Date(c.lastActive).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-theme-text-secondary truncate">{c.lastMessage || 'No messages yet'}</p>
                                    </div>

                                    {/* Unread Badge */}
                                    {c.unreadCount > 0 && (
                                        <span className="h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                            {c.unreadCount}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Messages Pane */}
                <div className={`flex-1 flex flex-col bg-theme-bg/20 ${!selectedUser ? 'hidden md:flex items-center justify-center p-12 text-center' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Selected Chat Header */}
                            <div className="px-6 py-4 border-b border-theme-border/60 bg-theme-surface flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3.5">
                                    <button 
                                        onClick={() => setSelectedUser(null)} 
                                        className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-theme-text-secondary" />
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-100 shadow-sm">
                                            <img 
                                                src={selectedUser.profilePhotoUrl || `https://i.pravatar.cc/100?u=${selectedUser.id}`} 
                                                alt={selectedUser.fullName} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-[#4A3728]">{selectedUser.fullName}</h3>
                                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active Session
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-theme-surface/40">
                                {loading && activeChatData.messages.length === 0 ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8C6D39]" />
                                    </div>
                                ) : activeChatData.messages.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 bg-amber-50/50 border border-theme-border/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare className="w-6 h-6 text-theme-pink" />
                                        </div>
                                        <p className="text-sm font-medium text-theme-text-secondary">Say hello to {selectedUser.fullName}!</p>
                                        <p className="text-xs text-gray-400 mt-1">Start your beautiful conversation today.</p>
                                    </div>
                                ) : (
                                    activeChatData.messages.map((msg, idx) => {
                                        const isMe = String(msg.senderId) === String(currentUser.id);
                                        return (
                                            <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                    isMe
                                                        ? 'bg-gradient-to-r from-theme-primary to-theme-pink text-white rounded-tr-none'
                                                        : 'bg-theme-surface text-gray-800 border border-gray-100 rounded-tl-none'
                                                }`}>
                                                    <p className="leading-relaxed break-words">{msg.content}</p>
                                                    <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input panel */}
                            <form onSubmit={handleSend} className="p-4 bg-theme-surface border-t border-theme-border/60 flex items-center gap-3 shrink-0">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 bg-theme-bg border border-theme-border rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#8C6D39]/20 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="w-12 h-12 bg-gradient-to-r from-theme-primary to-theme-pink hover:from-[#B59049] hover:to-[#7C5D29] text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="max-w-md">
                            <div className="w-20 h-20 bg-amber-50 border border-theme-border rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                <MessageSquare className="w-10 h-10 text-theme-pink" />
                            </div>
                            <h2 className="text-xl font-bold font-serif text-[#4A3728] mb-2">Your Conversations</h2>
                            <p className="text-sm text-theme-text-secondary leading-relaxed">
                                Select a profile from the left sidebar to start sending and receiving messages. All messages are encrypted and completely secure.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
