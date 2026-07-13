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
                    bg-white rounded-3xl
                    border border-[#F2D7D9]
                    shadow-[0_10px_30px_rgba(216,154,116,0.12)]
                    overflow-hidden
                "
            >
                {/* ── Profile Section ── */}
                <div
                    className="
                        flex items-center gap-3 p-4
                        bg-[#FFFDFC]
                        border-b border-[#F2D7D9]
                    "
                >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="
                                w-[72px] h-[72px] rounded-full overflow-hidden
                                border-4 border-white shadow-md
                                ring-2 ring-[#E86D8A]
                                bg-gray-50 flex items-center justify-center
                            "
                        >
                            {photoPreview || user?.profilePhotoUrl ? (
                                <img
                                    src={photoPreview || user?.profilePhotoUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={32} className="text-[#7A6666]" />
                            )}
                        </div>

                        {/* Camera button triggers file input via parent's handleAddPicture */}
                        <button
                            onClick={handleAddPicture}
                            className="
                                absolute -bottom-1 -right-1
                                w-7 h-7 rounded-full
                                bg-gradient-to-r from-[#E86D8A] to-[#D89A74]
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
                                bg-[#F9E6E7] text-[#E86D8A] rounded-full inline-block mb-1
                            "
                        >
                            {user?.profileId || "Loading..."}
                        </span>

                        <h3 className="text-[15px] font-bold text-[#3B2F2F] truncate leading-tight">
                            {user?.fullName || (
                                <span className="animate-pulse text-gray-400">
                                    Loading...
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center gap-1.5 text-[#7A6666] text-xs mt-0.5">
                            <Phone size={12} />
                            <span className="truncate">
                                {user?.mobileNumber || "Fetching..."}
                            </span>
                        </div>

                        <button
                            onClick={handleEditProfile}
                            className="
                                mt-2 inline-flex items-center gap-1.5
                                px-4 py-1.5 rounded-full
                                bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white
                                text-xs font-semibold
                                hover:shadow-[0_4px_10px_rgba(216,154,116,0.2)] transition-all
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
                                            ? "bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white border-transparent shadow-[0_4px_15px_rgba(216,154,116,0.3)]"
                                            : "text-[#7A6666] hover:bg-[#FFF6F2] hover:text-[#3B2F2F] border-transparent"
                                    }
                                `}
                            >
                                {/* Icon pill */}
                                <div
                                    className={`
                                        w-8 h-8 rounded-xl flex items-center justify-center
                                        flex-shrink-0 transition-all
                                        ${isActive ? "bg-transparent" : "bg-[#FFF6F2] shadow-sm border border-transparent"}
                                    `}
                                >
                                    <Icon
                                        size={15}
                                        className={
                                            isActive
                                                ? "text-white"
                                                : "text-[#D89A74]"
                                        }
                                    />
                                </div>

                                <span className="truncate">{tab.id}</span>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-5 rounded-full bg-[#FFFFFF] flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Upgrade Plan Banner ── */}
                <div className="p-4 mx-4 mb-5 mt-2 rounded-2xl bg-[#FFF6F2] border border-[#F2D7D9] text-[#3B2F2F] text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#E86D8A]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <Crown className="w-8 h-8 mx-auto mb-2 text-[#C99853] drop-shadow-sm animate-pulse" />
                        <h4 className="font-bold text-sm mb-1 tracking-wide text-[#3B2F2F]">Upgrade to Premium</h4>
                        <p className="text-[10px] text-[#7A6666] mb-3 font-medium leading-relaxed">Unlock exclusive features & stand out from the crowd.</p>
                        <button 
                            onClick={() => window.location.href = '/payment'} 
                            className="bg-gradient-to-r from-[#E86D8A] to-[#D89A74] text-white text-xs font-black px-5 py-2 rounded-full hover:scale-105 hover:shadow-[0_8px_20px_rgba(216,154,116,0.3)] transition-all duration-300 w-full"
                        >
                            Upgrade Now →
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
