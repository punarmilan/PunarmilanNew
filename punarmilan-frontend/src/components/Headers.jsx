import React, { useState, useEffect, useRef } from "react";
import HelpDropdown from "./HelpDropdown";
import Profile from "./Profile";
import profileImg from '../assets/image/profile.png'
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyProfileMobileMenu from "./MyProfileMobileMenu";
import MoreMenuMobile from "./MoreMenuMobile";
import MobileProfile from "./MobileProfile";
import OnlineMembers from "./OnlineMembers";
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptionDetails } from '../Slice/UserSlice';
import { ShieldCheck, CreditCard, Phone, Mail, ChevronDown } from 'lucide-react';

const Header = () => {
    const [helpOpen, setHelpOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showMyPunarMilanMenu, setShowMyPunarMilanMenu] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("Home");
    const [activeDesktopMenu, setActiveDesktopMenu] = useState("My PunarMilan");


    // const [isMobile, setIsMobile] = useState(false);
    const [showOnlineMembers, setShowOnlineMembers] = useState(false);

    const helpRef = useRef(null);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { isAuthenticated, subscriptionDetails } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchSubscriptionDetails());
        }
    }, [isAuthenticated, dispatch]);

    const isPremiumActive = subscriptionDetails?.active;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const [showPremiumDropdown, setShowPremiumDropdown] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const mobileTabs = [
        {
            id: "Home",
            icon: "fa-solid fa-house",
            label: "Home",
            path: "/"
        },
        {
            id: "Matches",
            icon: "fa-solid fa-heart",
            label: "Matches",
            path: "/matches"
        },
        {
            id: "Inbox",
            icon: "fa-solid fa-envelope",
            label: "Inbox",
            badge: "99+",
            path: "/inbox/pending/intrest"
        },
        {
            id: "Chat",
            icon: "fa-solid fa-message",
            label: "Chat",
            action: "openOnlineMembers" // Change from path to action
        },
        {
            id: "Premium",
            icon: "fa-solid fa-crown",
            badge: "85% OFF",
            label: "Premium",
            path: "/payment"
        }
    ];

    const handleTabClick = (tabId, path, action) => {
        setActiveTab(tabId);

        // Handle special action for Chat tab
        if (action === "openOnlineMembers") {
            setShowOnlineMembers(true);
            return;
        }

        // Navigate to path for other tabs
        if (path) {
            navigate(path);
        }
    };

    // Add handler to close OnlineMembers
    const handleCloseOnlineMembers = () => {
        setShowOnlineMembers(false);
        setActiveTab(""); // Reset active tab when closing
    };



    const desktopMenuItems = [
        {
            label: "My PunarMilan",
            path: "/my-shadi",
            onClick: () => {
                navigate("/my-shadi");
                setActiveDesktopMenu("My PunarMilan");
            }
        },
        {
            label: "Matches",
            path: "/matches",
            onClick: () => {
                navigate("/matches");
                setActiveDesktopMenu("Matches");
            }
        },
        {
            label: "Search",
            path: "/search",
            onClick: () => {
                navigate("/search");
                setActiveDesktopMenu("Search");
            }
        },
        {
            label: "Inbox",
            path: "/inbox/pending/intrest",
            onClick: () => {
                navigate("/inbox/pending/intrest");
                setActiveDesktopMenu("Inbox");
            }
        }
    ];

    // Update active tab based on current route
    useEffect(() => {
        const currentPath = location.pathname;
        
        // Sync Mobile Tabs
        const matchedTab = mobileTabs.find(tab =>
            tab.path === currentPath ||
            (tab.path !== "/" && currentPath.startsWith(tab.path)) ||
            (tab.id === "Inbox" && currentPath.startsWith("/inbox"))
        );
        if (matchedTab) {
            setActiveTab(matchedTab.id);
        }

        // Sync Desktop Menu
        const matchedDesktopMenu = desktopMenuItems.find(item =>
            item.path === currentPath ||
            currentPath.startsWith(item.path) ||
            (item.label === "Inbox" && currentPath.startsWith("/inbox")) ||
            (item.label === "My PunarMilan" && currentPath.startsWith("/my-shadi")) ||
            (item.label === "Matches" && currentPath.startsWith("/matches")) ||
            (item.label === "Search" && currentPath.startsWith("/search"))
        );
        if (matchedDesktopMenu) {
            setActiveDesktopMenu(matchedDesktopMenu.label);
        }
    }, [location.pathname, navigate]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (helpRef.current && !helpRef.current.contains(e.target)) setHelpOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownTimeoutRef = useRef(null);

    const handleMouseEnter = (label) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setDropdownOpen(label);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(null);
        }, 150); // Small delay to prevent flickering
    };


    const [activeMenuItem, setActiveMenuItem] = useState("My Profile");
    const menuItems = [
        {
            id: "Accepted",
            icon: "fa-solid fa-user-check",
            label: "Accepted",
            color: "text-green-600",
            count: "12",
            path: "/accepted"
        },
        {
            id: "Requested",
            icon: "fa-solid fa-user-clock",
            label: "Requested",
            color: "text-blue-600",
            count: "5",
            path: "/requested"
        },
        {
            id: "Recent Visitors",
            icon: "fa-solid fa-eye",
            label: "Recent Visitors",
            color: "text-purple-600",
            count: "23",
            path: "/visitors"
        },
        {
            id: "Account & Settings",
            icon: "fa-solid fa-cog",
            label: "Account & Settings",
            color: "text-gray-600",
            path: "/settings"
        },
        {
            id: "Notifications",
            icon: "fa-solid fa-bell",
            label: "Notifications",
            color: "text-amber-600",
            count: "3",
            path: "/notifications"
        },
        {
            id: "Be Safe Online",
            icon: "fa-solid fa-shield-halved",
            label: "Be Safe Online",
            color: "text-teal-600",
            path: "/safety"
        },
        {
            id: "Help & Support",
            icon: "fa-solid fa-circle-question",
            label: "Help & Support",
            color: "text-indigo-600",
            path: "/help"
        }
    ];

    const handleMenuItemClick = (itemId, path) => {
        setActiveMenuItem(itemId);
        navigate(path);
    };

    // Update active menu item based on current route
    React.useEffect(() => {
        const currentPath = location.pathname;
        const matchedItem = menuItems.find(item =>
            item.path === currentPath ||
            currentPath.startsWith(item.path)
        );

        if (matchedItem) {
            setActiveMenuItem(matchedItem.id);
        }
    }, [location.pathname]);

    return (
        <>
            {/* MAIN HEADER - Now fully visible on all devices */}
            <header className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16 px-2 xs:px-3 sm:px-4 md:px-6">
                        {/* LOGO */}
                        <Link to="/" className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold italic font-serif tracking-tight hover:opacity-90 transition-opacity">
                            PunarMilan
                        </Link>

                        {/* DESKTOP NAV - Hidden on mobile/tablet, shown on md+ */}
                        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-4 2xl:space-x-6 text-white font-medium h-full">
                            {desktopMenuItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => item.menuItems && handleMouseEnter(item.label)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        onClick={item.onClick}
                                        className={`cursor-pointer px-2 sm:px-3 py-2 text-xs lg:text-sm xl:text-base font-medium whitespace-nowrap flex items-center gap-1 ${activeDesktopMenu === item.label
                                            ? "text-white border-b-2 border-white"
                                            : "text-white/80 hover:text-white"
                                            } transition-colors`}
                                    >
                                        {item.label}
                                        {item.menuItems && (
                                            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`}></i>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {item.menuItems && dropdownOpen === item.label && (
                                        <div className="absolute top-full left-0 w-56 bg-white rounded-b-lg shadow-xl text-gray-800 py-2 z-50 border-t border-gray-100 animate-fadeIn">
                                            {item.menuItems.map((subItem, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={subItem.path}
                                                    className="block px-4 py-2 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-medium flex justify-between items-center"
                                                    onClick={() => {
                                                        setDropdownOpen(null);
                                                        setActiveDesktopMenu(item.label);
                                                    }}
                                                >
                                                    <span>{subItem.label}</span>
                                                    {subItem.count && <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{subItem.count}</span>}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* RIGHT SIDE - All items visible on all screens */}
                        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
                            {/* Upgrade Button - Responsive text */}
                            <Link to="/search">
                                <button className="md:hidden block ">
                                    {/* <span className="hidden xs:inline">Upgrade Now</span> */}
                                    <span className="xs:hidden">Search</span>
                                </button>
                            </Link>

                            {/* HELP BUTTON - Always visible on all devices */}
                            <div className="flex items-center" ref={helpRef}>
                                <HelpDropdown />
                            </div>

                            {/* PREMIUM DROPDOWN */}
                            {isPremiumActive && (
                                <div className="relative">
                                    <button
                                        onMouseEnter={() => setShowPremiumDropdown(true)}
                                        onMouseLeave={() => setShowPremiumDropdown(false)}
                                        className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 text-white px-1.5 xs:px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/30 transition-all cursor-pointer"
                                    >
                                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                                        <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider">Premium</span>
                                        <ChevronDown className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                    </button>

                                    {showPremiumDropdown && (
                                        <div 
                                            onMouseEnter={() => setShowPremiumDropdown(true)}
                                            onMouseLeave={() => setShowPremiumDropdown(false)}
                                            className="absolute right-0 mt-0 w-72 xs:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[1000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800"
                                        >
                                            {/* Header */}
                                            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-3 sm:p-4 text-white">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="font-bold text-sm sm:text-lg">Premium Membership</h3>
                                                    <span className="bg-white/20 px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase">Active</span>
                                                </div>
                                                <p className="text-rose-50 text-[10px] sm:text-xs opacity-90">Plan: {subscriptionDetails?.planName || 'N/A'}</p>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                                {/* Validity */}
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span>Valid Till:</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900">{formatDate(subscriptionDetails?.expiryDate)}</span>
                                                </div>

                                                {/* Connects Balance */}
                                                <div className="space-y-1 sm:space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] sm:text-sm font-medium text-gray-700">Contact Views Balance</span>
                                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                            {subscriptionDetails?.balance} Left
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2">
                                                        <div 
                                                            className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500" 
                                                            style={{ width: `${(subscriptionDetails?.balance / (subscriptionDetails?.totalConnects || 1)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-500">
                                                        <span>Used: {subscriptionDetails?.usedConnects}</span>
                                                        <span>Total: {subscriptionDetails?.totalConnects}</span>
                                                    </div>
                                                </div>

                                                {/* Extra Benefits */}
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-gray-700">
                                                    <div className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                                                        <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold text-blue-700">Phone Balance</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                                                        <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600" />
                                                        <span className="text-[9px] sm:text-[10px] font-bold text-purple-700">SMS Balance</span>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <button 
                                                    onClick={() => navigate('/payment')}
                                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors mt-1"
                                                >
                                                    Upgrade / Renew
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PROFILE COMPONENT */}
                            <div className="flex items-center" ref={profileRef}>
                                <Profile />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION - Shows on mobile only */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
                    <div className="flex justify-around items-center h-16 px-2">
                        {mobileTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id, tab.path, tab.action)}
                                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${activeTab === tab.id
                                    ? 'text-rose-500'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="relative">
                                    <i className={`${tab.icon} text-lg`}></i>
                                    {tab.badge && (
                                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center">
                                            {tab.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-rose-500 rounded-b-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* Add safe area padding for devices with notches */}
            <style>{`
                .safe-area-pb {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>

            {/* At the end of your component, before closing tag */}
            {isMobile && showOnlineMembers && (
                <OnlineMembers
                    open={showOnlineMembers}
                    setOpen={setShowOnlineMembers}
                    onClose={handleCloseOnlineMembers}
                />
            )}
        </>
    );
};

export default Header;
