import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Slice/UserSlice';
import img from '../assets/image/profile.png'

const Profile = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: authUser, subscriptionDetails } = useSelector((state) => state.user);
    const { profile } = useSelector((state) => state.profile);
    const { summary } = useSelector((state) => state.dashboard);

    const displayUser = summary?.user || profile || authUser;
    const isPremium = subscriptionDetails?.active || displayUser?.isPremium;

    // Check if mobile and handle outside click
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Profile menu items with navigation logic
    const menuItems = [
        {
            icon: 'fa-solid fa-user',
            label: 'My Profile',
            onClick: () => navigate('/my-shadi/my-profile'),
            description: 'View and edit your profile'
        },
        {
            icon: 'fa-solid fa-envelope',
            label: 'Email / SMS Alerts',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage your notifications',
            badge: '2 New'
        },
        {
            icon: 'fa-solid fa-gear',
            label: 'Account Settings',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage your account preferences'
        },
        {
            icon: 'fa-solid fa-lock',
            label: 'Privacy Options',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Control your privacy settings'
        },
        {
            icon: 'fa-solid fa-filter',
            label: 'Contact Filters',
            onClick: () => navigate('/my-shadi/settings'),
            description: 'Manage who can contact you'
        },
        {
            icon: 'fa-solid fa-right-from-bracket',
            label: 'Logout',
            onClick: () => {
                dispatch(logout());
                navigate('/');
            },
            description: 'Sign out from your account',
            color: 'red'
        }
    ];

    // Handle menu item click
    const handleMenuItemClick = (item) => {
        setIsOpen(false);
        if (item.onClick) {
            item.onClick();
        }
    };

    // Handle upgrade click
    const handleUpgradeClick = () => {
        setIsOpen(false);
        navigate('/payment');
    };

    // Handle compare memberships click
    const handleCompareClick = () => {
        setIsOpen(false);
        navigate('/payment');
    };

    return (
        <div className="relative z-[999]" ref={dropdownRef}>
            {/* Profile Button - Now visible on all screens */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 xs:gap-2 px-1.5 xs:px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 transition-colors group"
                aria-label="Profile"
            >
                <div className="relative">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full overflow-hidden border-2 border-white/70 group-hover:border-white">
                        <img
                            src={displayUser?.profilePhotoUrl || img}
                            alt={displayUser?.fullName || "Profile"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Premium Badge */}
                    {isPremium && (
                        <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white rounded-full w-3.5 h-3.5 xs:w-4 xs:h-4 flex items-center justify-center border border-white shadow-sm z-10">
                            <i className="fa-solid fa-crown text-[6px] xs:text-[7px]"></i>
                        </div>
                    )}
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Text shown on md+ screens */}
                <div className="text-left hidden md:block">
                    <p className="text-[10px] sm:text-xs font-medium text-white leading-tight truncate max-w-[80px]">{displayUser?.profileId || 'User'}</p>
                    <p className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-tighter">{isPremium ? 'Premium member' : 'Free Account'}</p>
                </div>

                {/* Chevron only shown on mid+ screens */}
                <i className={`hidden md:block fa-solid fa-chevron-down text-[10px] text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Dropdown Content - Responsive positioning and sizing */}
                    <div className={`
                        fixed md:absolute 
                        ${isMobile
                            ? 'inset-x-2 top-[60px] mx-auto max-w-sm'
                            : 'right-0 mt-2 w-80'
                        }
                        bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden
                    `}>
                        {/* Profile Header */}
                        <div className="p-3 xs:p-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white">
                            {/* Close (X) Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-2 xs:right-3 top-2 xs:top-3 w-7 h-7 xs:w-8 xs:h-8 rounded-full cursor-pointer bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                aria-label="Close profile menu"
                            >
                                <i className="fa-solid fa-times text-white text-xs xs:text-sm"></i>
                            </button>

                            <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                                <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 xs:border-3 border-white/40 overflow-hidden flex-shrink-0">
                                    <img
                                        src={displayUser?.profilePhotoUrl || img}
                                        alt={displayUser?.fullName || "Profile"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base xs:text-lg truncate">{displayUser?.fullName || displayUser?.profileId || 'User'}</h3>
                                    <p className="text-xs xs:text-sm text-white/90">ID: {displayUser?.profileId || 'N/A'}</p>
                                    <div className="flex items-center gap-1.5 xs:gap-2 mt-0.5 xs:mt-1">
                                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-300 rounded-full"></div>
                                        <span className="text-[10px] xs:text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Type Info */}
                        <div className="p-3 xs:p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs xs:text-sm font-medium text-gray-600">Account Type:</span>
                                {isPremium ? (
                                    <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-amber-100 text-amber-700 text-[10px] xs:text-xs font-bold rounded-full">Premium</span>
                                ) : (
                                    <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-rose-100 text-rose-700 text-[10px] xs:text-xs font-bold rounded-full">Free</span>
                                )}
                            </div>
                        </div>

                        {/* Menu Items - Scrollable on mobile */}
                        <div className="py-1 xs:py-2 max-h-[50vh] xs:max-h-96 overflow-y-auto">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleMenuItemClick(item)}
                                    className="w-full flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-3 text-left hover:bg-rose-50 active:bg-rose-100 transition-colors group/item"
                                >
                                    <div className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-rose-200`}>
                                        <i className={`${item.icon} text-rose-600 text-xs xs:text-sm`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 xs:gap-2">
                                            <span className="text-xs xs:text-sm font-medium text-gray-800 text-left truncate">{item.label}</span>
                                            {item.badge && (
                                                <span className="text-[10px] xs:text-xs bg-red-100 text-red-600 px-1.5 xs:px-2 py-0.5 rounded-full flex-shrink-0">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] xs:text-xs text-gray-500 text-left truncate hidden xs:block">{item.description}</p>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover/item:text-rose-500 flex-shrink-0"></i>
                                </button>
                            ))}
                        </div>

                        {/* Upgrade Section */}
                        <div className="border-t border-gray-200 p-3 xs:p-4 bg-gradient-to-r from-rose-50 to-pink-50">
                            <div className="mb-2 xs:mb-3">
                                <h4 className="text-xs xs:text-sm font-bold text-gray-800 mb-0.5 xs:mb-1">Upgrade Your Account</h4>
                                <p className="text-[10px] xs:text-xs text-gray-600">Get premium features and better matches</p>
                            </div>
                            <button
                                onClick={handleUpgradeClick}
                                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 xs:py-3 rounded-lg font-bold text-xs xs:text-sm hover:from-rose-600 hover:to-rose-700 active:scale-95 transition-all shadow-md mb-2"
                            >
                                Upgrade Now
                            </button>
                            <button
                                onClick={handleCompareClick}
                                className="w-full text-rose-600 text-xs xs:text-sm font-medium hover:text-rose-700 active:text-rose-800 text-center underline"
                            >
                                Compare memberships
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
