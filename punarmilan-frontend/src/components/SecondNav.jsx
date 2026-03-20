import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import More from "../pages/myshadi/more/More";

export default function SecondNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: "Dashboard", path: "/my-shadi" },
        { id: "My Profile", path: "/my-shadi/my-profile" },
        { id: "My Photos", path: "/my-shadi/my-photos" },
        { id: "Partner Preferences", path: "/my-shadi/partner-preferences" },
        { id: "Settings", path: "/my-shadi/settings" },
        // { id: "More", path: "/my-shadi/more", subPaths: ["/my-shadi/my-order", "/my-tickets"], component: (isActive) => <More isActive={isActive} /> },
    ];

    // Get active tab from current URL path
    const getActiveTabFromPath = () => {
        const currentPath = location.pathname;

        // Try exact matches first
        const exactMatch = tabs.find(tab => tab.path === currentPath);
        if (exactMatch) return exactMatch.id;

        // Check subPaths (especially for "More")
        const subPathMatch = tabs.find(tab =>
            tab.subPaths?.some(sp => currentPath === sp || currentPath.startsWith(sp + "/"))
        );
        if (subPathMatch) return subPathMatch.id;

        // Check prefixes (longest first to avoid partial matches)
        const prefixMatch = [...tabs]
            .filter(tab => tab.path && tab.path !== "/my-shadi") // Exclude base path for prefix check
            .sort((a, b) => b.path.length - a.path.length)
            .find(tab => currentPath.startsWith(tab.path + "/"));

        if (prefixMatch) return prefixMatch.id;

        // Fallback to Dashboard if path starts with it
        if (currentPath === "/my-shadi" || currentPath.startsWith("/my-shadi/")) return "Dashboard";

        return "Dashboard";
    };

    const [active, setActive] = useState(getActiveTabFromPath());
    const [isMobile, setIsMobile] = useState(false);

    // Update active tab when URL changes
    useEffect(() => {
        setActive(getActiveTabFromPath());
    }, [location.pathname]);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTabClick = (tab) => {
        if (tab.component) {
            // If it's a component (like More), just set active
            setActive(tab.id);
        } else {
            // Regular navigation
            setActive(tab.id);
            navigate(tab.path);
        }
    };

    return (
        <>
            {/* Mobile/Tablet View (below 768px) */}
            <div className="md:hidden">
                <div className="pt-12 xs:pt-14">
                    <div className="w-full bg-white shadow-sm border-b">
                        <div className="w-full overflow-x-auto scrollbar-hide">
                            <div className="flex justify-center w-full min-w-max px-1 xs:px-2 sm:px-3 h-10 xs:h-11 sm:h-12 items-center gap-0.5 xs:gap-0.5">
                                {tabs.map((tab) => {
                                    // Check if it's a component tab
                                    if (tab.component) {
                                        const isActive = active === tab.id;
                                        return (
                                            <div
                                                key={tab.id}
                                                onClick={() => handleTabClick(tab)}
                                                className={`cursor-pointer px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1 sm:py-1.5 transition-all ${isActive ? "bg-rose-50 border border-rose-100 rounded-lg" : ""}`}
                                            >
                                                {tab.component(isActive)}
                                            </div>
                                        );
                                    }

                                    // Regular tab button
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabClick(tab)}
                                            className={`cursor-pointer px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1 sm:py-1.5 text-[10px] xs:text-xs font-medium rounded-lg transition-all whitespace-nowrap ${active === tab.id
                                                ? "text-rose-500 bg-rose-50 border border-rose-100"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                }`}
                                        >
                                            {tab.id}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View (768px+) */}
            <div className="hidden md:block">
                <div className="pt-14 lg:pt-16">
                    <div className="w-full bg-white shadow-sm border-b">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="overflow-x-auto scrollbar-hide">
                                <ul className="flex justify-center w-full gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 px-3 sm:px-4 lg:px-6 h-11 sm:h-12 items-center min-w-max">
                                    {tabs.map((tab) => {
                                        // Check if it's a component tab
                                        if (tab.component) {
                                            const isActive = active === tab.id;
                                            return (
                                                <li
                                                    key={tab.id}
                                                    onClick={() => handleTabClick(tab)}
                                                    className={`cursor-pointer pb-1.5 sm:pb-2 px-0.5 sm:px-1 transition-all ${isActive ? "border-b-2 border-rose-500" : ""}`}
                                                >
                                                    {tab.component(isActive)}
                                                </li>
                                            );
                                        }

                                        // Regular tab item
                                        return (
                                            <li
                                                key={tab.id}
                                                onClick={() => handleTabClick(tab)}
                                                className={`cursor-pointer pb-1.5 sm:pb-2 px-0.5 sm:px-1 text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap ${active === tab.id
                                                    ? "text-rose-500 border-b-2 border-rose-500"
                                                    : "text-gray-600 hover:text-gray-900"
                                                    } transition-colors`}
                                            >
                                                {tab.id}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS for hiding scrollbar */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
