import React, { useState } from 'react';
import { MoreHorizontal, Heart, Eye, ThumbsUp, MousePointer2 } from 'lucide-react';

export default function ProfileStatusCards({ user, onEditProfile }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Provide default fallback values if the user prop lacks data
    const profileImageUrl = user?.profilePhotoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60";
    const profileCompletion = user?.profileCompletion || 50;

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full mb-8">
            {/* Left Card - Profile Image */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-[#6D4C41] mb-4 font-serif">Profiles status</h3>
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 h-[380px] flex flex-col overflow-hidden relative group">
                    <img 
                        src={profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                    {/* Edit Profile Overlay */}
                    <button 
                        onClick={onEditProfile}
                        className="absolute bottom-3 left-3 right-3 bg-black text-white py-3 rounded-xl font-bold tracking-wider hover:bg-gray-900 transition-colors z-10"
                    >
                        EDIT PROFILE
                    </button>
                </div>
            </div>

            {/* Right Card - Profile Completion */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-[#6D4C41] mb-4 font-serif">Profiles status</h3>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[380px] flex flex-col justify-between">
                    
                    {/* Top Row: Title & Menu */}
                    <div className="flex justify-between items-center mb-4 relative">
                        <span className="text-[#6D4C41] font-semibold">Profile completion</span>
                        <button 
                            className="bg-gray-500 text-white rounded-full p-1.5 hover:bg-gray-600 transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-10 right-0 bg-white shadow-xl rounded-xl border border-gray-100 py-2 w-48 z-20 text-sm text-gray-700">
                                <button onClick={onEditProfile} className="w-full text-left px-4 py-2 hover:bg-gray-50">Edit profile</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">View profile</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Profile visibility settings</button>
                            </div>
                        )}
                    </div>

                    {/* Circular Progress (CSS based) */}
                    <div className="flex justify-center my-2">
                        <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 shadow-inner">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path
                                    className="text-gray-200"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                {/* Progress Circle */}
                                <path
                                    className="text-purple-600"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="3"
                                    strokeDasharray={`${profileCompletion}, 100`}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#c026d3" />
                                        <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                                {profileCompletion}%
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-6 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
                                <Heart size={18} fill="currentColor" />
                            </div>
                            <span className="font-bold text-gray-800">12 <span className="font-normal text-gray-500">Likes</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 shadow-sm">
                                <Eye size={18} />
                            </div>
                            <span className="font-bold text-gray-800">12 <span className="font-normal text-gray-500">Views</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                                <ThumbsUp size={18} />
                            </div>
                            <span className="font-bold text-gray-800">12 <span className="font-normal text-gray-500">Interests</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                <MousePointer2 size={18} />
                            </div>
                            <span className="font-bold text-gray-800">12 <span className="font-normal text-gray-500">Clicks</span></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
