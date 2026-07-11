import React from "react";
import {
    UserIcon,
    Camera,
    Phone,
    Edit,
    LayoutDashboard,
    User,
    Images,
    Heart,
    Settings,
    Search,
    MapPin,
    Users,
    Star,
    Sliders,
    MessageCircle,
    CreditCard,
    LogOut,
    Handshake,
    Crown,
} from "lucide-react";

// Map tab IDs to Lucide icons — extend as needed
const TAB_ICONS = {
    Dashboard:              LayoutDashboard,
    Profile:                User,
    Interests:              Handshake,
    "Chat list":            MessageCircle,
    Plan:                   CreditCard,
    Setting:                Settings,
    "Log out":              LogOut,
    "My Profile":           User,
    "My Photos":            Images,
    "Partner Preferences":  Sliders,
    Settings:               Settings,
    "New Matches":          Star,
    "Today's Match":        Heart,
    "My Matches":           Users,
    "Near Me":              MapPin,
    "More Matches":         Search,
};

export default function ProfileAside({
    user,
    tabs,
    active,
    handleTabClick,
    handleEditProfile,
    photoPreview,
    handleAddPicture,
    fileInputRef,
    handleFileChange,
}) {
    return (
        <aside
            className="
                hidden md:block
                w-full max-w-[280px]
                flex-shrink-0
            "
        >
            <div
                className="
                    dashboard-card-bg rounded-3xl
                    border border-white/50
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                    overflow-hidden
                "
            >
                {/* ── Profile Section ── */}
                <div
                    className="
                        flex items-center gap-3 p-4
                        bg-white/30
                        border-b border-white/40
                    "
                >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="
                                w-[72px] h-[72px] rounded-full overflow-hidden
                                border-4 border-white shadow-xl
                                ring-2 ring-rose-100
                                bg-gray-100 flex items-center justify-center
                            "
                        >
                            {photoPreview || user?.profilePhotoUrl ? (
                                <img
                                    src={photoPreview || user?.profilePhotoUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={32} className="text-gray-400" />
                            )}
                        </div>

                        {/* Camera button triggers file input via parent's handleAddPicture */}
                        <button
                            onClick={handleAddPicture}
                            className="
                                absolute -bottom-1 -right-1
                                w-7 h-7 rounded-full
                                bg-gradient-to-r from-rose-500 to-pink-600
                                text-white flex items-center justify-center
                                shadow-lg hover:scale-110 transition-all
                            "
                        >
                            <Camera size={13} />
                        </button>

                        {/* Hidden file input — ref and onChange come from SecondNav */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.heic,.heif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* User details */}
                    <div className="flex-1 min-w-0">
                        <span
                            className="
                                px-2 py-0.5 text-[11px] font-bold
                                bg-rose-100 text-[#C5A059] rounded-full inline-block mb-1
                            "
                        >
                            {user?.profileId || "Loading..."}
                        </span>

                        <h3 className="text-[15px] font-bold text-gray-800 truncate leading-tight">
                            {user?.fullName || (
                                <span className="animate-pulse text-gray-400">
                                    Loading...
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                            <Phone size={12} />
                            <span className="truncate">
                                {user?.mobileNumber || "Fetching..."}
                            </span>
                        </div>

                        <button
                            onClick={handleEditProfile}
                            className="
                                mt-2 inline-flex items-center gap-1.5
                                px-3 py-1.5 rounded-xl
                                bg-blue-50 text-blue-800
                                text-xs font-semibold
                                hover:bg-blue-100 transition-all
                            "
                        >
                            <Edit size={11} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Tab Menu ── */}
                <nav className="p-3 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = TAB_ICONS[tab.id] || LayoutDashboard;
                        const isActive = active === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab)}
                                className={`
                                    w-full flex items-center gap-3
                                    px-4 py-3 rounded-2xl
                                    text-sm font-semibold
                                    transition-all duration-200 border
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-rose-50 to-pink-50 text-[#C5A059] border-rose-100 shadow-sm"
                                            : "text-gray-700 font-bold hover:bg-white/50 hover:text-rose-600 border-transparent"
                                    }
                                `}
                            >
                                {/* Icon pill */}
                                <div
                                    className={`
                                        w-8 h-8 rounded-xl flex items-center justify-center
                                        flex-shrink-0 transition-all
                                        ${isActive ? "bg-rose-100" : "bg-white/60 shadow-sm border border-gray-100"}
                                    `}
                                >
                                    <Icon
                                        size={15}
                                        className={
                                            isActive
                                                ? "text-[#C5A059]"
                                                : "text-gray-700"
                                        }
                                    />
                                </div>

                                <span className="truncate">{tab.id}</span>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-5 rounded-full bg-rose-400 flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Upgrade Plan Banner ── */}
                <div className="p-4 mx-4 mb-5 mt-2 rounded-2xl bg-gradient-to-br from-slate-900 to-[#8C6D39] text-white text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-400 drop-shadow-md animate-pulse" />
                        <h4 className="font-bold text-sm mb-1 tracking-wide">Upgrade to Premium</h4>
                        <p className="text-[10px] text-white/90 mb-3 font-medium leading-relaxed">Unlock advanced filters & 10x more matches</p>
                        <button 
                            onClick={() => window.location.href = '/payment'} 
                            className="bg-white text-[#8C6D39] text-xs font-black px-5 py-2 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300 w-full"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
