import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, User } from 'lucide-react';

function PunarMilanSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            date: '12th Jan 2026',
            chats: [
                {
                    sender: 'bot',
                    text: "Hi Sh27142336 , I'm Dory.\nYour PunarMilan Support Assistant.",
                    time: '10:30 AM'
                },
                {
                    sender: 'bot',
                    text: 'Can I connect you to our customer care executive?',
                    time: '10:30 AM',
                    hasButtons: false
                }
            ]
        },
        {
            id: 2,
            date: 'Today',
            chats: [
                {
                    sender: 'bot',
                    text: "Hi Sh27142336 , I'm Dory.\nYour PunarMilan Support Assistant.",
                    time: '2:15 PM'
                },
                {
                    sender: 'bot',
                    text: 'Can I connect you to our customer care executive?',
                    time: '2:15 PM',
                    hasButtons: true
                }
            ]
        }
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        // Prevent body scroll on mobile when chat is open
        if (isOpen && window.innerWidth < 640) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const minimizeChat = () => {
        setIsMinimized(!isMinimized);
    };

    const handleYesNo = (response, dateId, chatIndex) => {
        const updatedMessages = messages.map(group => {
            if (group.id === dateId) {
                return {
                    ...group,
                    chats: group.chats.map((chat, idx) => {
                        if (idx === chatIndex && chat.hasButtons) {
                            return { ...chat, hasButtons: false, selectedResponse: response };
                        }
                        return chat;
                    })
                };
            }
            return group;
        });
        setMessages(updatedMessages);

        // Add bot response based on selection
        setTimeout(() => {
            const responseMessage = {
                sender: 'bot',
                text: response === 'yes'
                    ? 'Great! Connecting you to our customer care executive. Please wait a moment...'
                    : 'No problem! Feel free to ask me any questions you have.',
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            const finalMessages = updatedMessages.map(group => {
                if (group.id === dateId) {
                    return {
                        ...group,
                        chats: [...group.chats, responseMessage]
                    };
                }
                return group;
            });
            setMessages(finalMessages);
        }, 500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const today = new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const newMessage = {
                sender: 'user',
                text: message,
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // Check if today's date group exists
            const todayGroup = messages.find(group => group.date === today);

            if (todayGroup) {
                // Add to existing group
                const updatedMessages = messages.map(group => {
                    if (group.date === today) {
                        return {
                            ...group,
                            chats: [...group.chats, newMessage]
                        };
                    }
                    return group;
                });
                setMessages(updatedMessages);
            } else {
                // Create new date group
                setMessages([...messages, {
                    id: messages.length + 1,
                    date: today,
                    chats: [newMessage]
                }]);
            }

            setMessage('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    sender: 'bot',
                    text: 'Thank you for your message. Our team will get back to you shortly.',
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };

                const updatedMessagesWithResponse = messages.map(group => {
                    if (group.date === today) {
                        return {
                            ...group,
                            chats: [...group.chats, botResponse]
                        };
                    }
                    return group;
                });

                setMessages(updatedMessagesWithResponse);
            }, 1000);
        }
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 sm:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 hover:scale-110 animate-bounce-slow"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                    </span>
                </button>
            )}

            {/* Chat Window - MOBILE FULL SCREEN */}
            <div
                className={`fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 w-full sm:w-[400px] md:w-[440px] bg-white sm:rounded-2xl transition-all duration-300 z-50 shadow-2xl overflow-hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
                    } ${isMinimized ? 'sm:h-[70px]' : 'h-full sm:h-[600px] md:h-[650px]'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Chat Header - ALWAYS VISIBLE */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between shadow-lg flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <circle cx="50" cy="50" r="48" fill="white" />
                                        <circle cx="50" cy="45" r="35" fill="#f0f0f0" />
                                        <circle cx="35" cy="40" r="4" fill="#333" />
                                        <circle cx="65" cy="40" r="4" fill="#333" />
                                        <path d="M 35 55 Q 50 65 65 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
                                        <circle cx="50" cy="70" r="3" fill="#ff6b9d" />
                                    </svg>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-base sm:text-lg truncate">PunarMilan Support</h3>
                                <p className="text-xs text-pink-100 truncate">Online • Replies instantly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                            <button
                                onClick={minimizeChat}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:bg-white/30"
                                aria-label="Minimize chat"
                            >
                                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={toggleChat}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:bg-white/30"
                                aria-label="Close chat"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Content - Only show when not minimized */}
                    {!isMinimized && (
                        <>
                            {/* Chat Messages - Scrollable Area */}
                            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 bg-gray-50 custom-scrollbar">
                                {messages.map((dateGroup) => (
                                    <div key={dateGroup.id} className="mb-4 sm:mb-5 md:mb-6">
                                        {/* Date Separator */}
                                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                            <span className="text-xs text-gray-500 font-medium px-2 sm:px-3 whitespace-nowrap">
                                                {dateGroup.date}
                                            </span>
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                        </div>

                                        {/* Bot Label */}
                                        <p className="text-xs text-gray-500 mb-3 sm:mb-4 px-1">
                                            Dory (Payment page bot)
                                        </p>

                                        {/* Messages */}
                                        {dateGroup.chats.map((chat, index) => (
                                            <div
                                                key={index}
                                                className={`mb-3 sm:mb-4 flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                                                    {chat.sender === 'bot' && (
                                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md p-1.5">
                                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                                <circle cx="50" cy="50" r="48" fill="white" />
                                                                <circle cx="50" cy="45" r="35" fill="#f0f0f0" />
                                                                <circle cx="35" cy="40" r="4" fill="#333" />
                                                                <circle cx="65" cy="40" r="4" fill="#333" />
                                                                <path d="M 35 55 Q 50 65 65 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
                                                                <circle cx="50" cy="70" r="3" fill="#ff6b9d" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 shadow-sm ${chat.sender === 'user'
                                                                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-tr-none'
                                                                : 'bg-pink-100 text-gray-800 rounded-tl-none'
                                                                }`}
                                                        >
                                                            <p className="text-sm leading-relaxed whitespace-pre-line break-words">
                                                                {chat.text}
                                                            </p>
                                                        </div>

                                                        {/* Yes/No Buttons */}
                                                        {chat.hasButtons && (
                                                            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                                                                <button
                                                                    onClick={() => handleYesNo('yes', dateGroup.id, index)}
                                                                    className="flex-1 sm:flex-initial px-6 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-2.5 border-2 border-teal-400 text-teal-600 font-semibold rounded-full hover:bg-teal-50 hover:border-teal-500 transition-all duration-300 text-sm shadow-sm hover:shadow-md active:scale-95"
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button
                                                                    onClick={() => handleYesNo('no', dateGroup.id, index)}
                                                                    className="flex-1 sm:flex-initial px-6 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-2.5 border-2 border-teal-400 text-teal-600 font-semibold rounded-full hover:bg-teal-50 hover:border-teal-500 transition-all duration-300 text-sm shadow-sm hover:shadow-md active:scale-95"
                                                                >
                                                                    No
                                                                </button>
                                                            </div>
                                                        )}

                                                        {chat.selectedResponse && (
                                                            <p className="text-xs text-gray-400 mt-2 px-1">
                                                                You selected: {chat.selectedResponse === 'yes' ? 'Yes' : 'No'}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {chat.sender === 'user' && (
                                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input - Fixed at Bottom */}
                            <div className="px-3 py-3 sm:px-4 sm:py-4 bg-white border-t border-gray-200 flex-shrink-0 safe-area-bottom">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-2.5 sm:p-3 md:p-3.5 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-md flex-shrink-0"
                                        aria-label="Send message"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ec4899;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #db2777;
                }

                /* Safe area for mobile devices */
                .safe-area-bottom {
                    padding-bottom: max(12px, env(safe-area-inset-bottom));
                }

                /* Prevent scrolling issues on iOS */
                @supports (-webkit-touch-callout: none) {
                    .custom-scrollbar {
                        -webkit-overflow-scrolling: touch;
                    }
                }
            `}</style>
        </>
    );
}

export default PunarMilanSupport;