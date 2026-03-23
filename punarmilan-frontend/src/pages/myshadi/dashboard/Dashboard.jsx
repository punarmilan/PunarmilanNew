import React, { useState } from 'react'
import ActivitySummary from '../../../components/ActivitySummary'
import MatchesSection from '../../../components/MatchesSection'
import PremiumMatches from '../../../components/PremiumMatches'
import EventSection from '../../../components/EventSection'
import DesktopProfileSidebar from '../../../components/DesktopProfileSidebar'
import NewMatches from '../../../components/NewMatches'
import { Link, useNavigate } from 'react-router-dom'
import RecentVistiors from './RecentVisitors'
import ProfileUpdate from './ProfileUpdate'

import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardSummary } from '../../../Slice/DashboardSlice'

function Dashboard() {
    const dispatch = useDispatch();
    const { summary, loading } = useSelector((state) => state.dashboard);
    const { subscriptionDetails } = useSelector((state) => state.user);

    const isPremium = subscriptionDetails?.active || summary?.user?.isPremium;

    React.useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const handleUpgradeNow = () => {
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container with Responsive Padding */}
            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto">

                {/* Left Sidebar - Hidden on mobile and tablet, shown on lg+ with better width handling */}
                <div className="hidden lg:block lg:w-1/4 xl:w-[22%] flex-shrink-0 relative z-20">
                    <div className="sticky top-20 p-2 xl:p-4">
                        <DesktopProfileSidebar />
                    </div>
                </div>

                {/* Main Content - Improved padding for all screens */}
                <div className="flex-1 w-full px-4 sm:px-6 lg:px-4 xl:px-6 py-4 md:py-6 relative z-10">

                    {/* Responsive Grid Layout - Better transitions */}
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                        {/* Left Column - Main Content (Spans 2 columns on XL) */}
                        <div className="xl:col-span-2 space-y-6">

                            {/* Activity Summary */}
                            <div className="w-full">
                                <ActivitySummary />
                                <ProfileUpdate />
                            </div>
                            <div className="w-full">
                                <RecentVistiors />
                            </div>

                            {/* Matches Grid - Responsive columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

                                {/* Premium Matches */}
                                <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 overflow-hidden">
                                    <PremiumMatches />
                                </div>

                                {/* New Matches */}
                                <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 overflow-hidden">
                                    <NewMatches />
                                </div>

                            </div>
                        </div>

                        {/* Right Column - Sidebar Content */}
                        <div className="space-y-4 sm:space-y-5 md:space-y-6 xl:sticky xl:top-20 xl:self-start">

                            {/* Event Section */}
                            <div className="w-full">
                                <EventSection />
                            </div>

                            {/* Advertising/Upgrade Card */}
                            {!isPremium && (
                                <div className="w-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg">
                                    {/* Badge Row */}
                                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-4 sm:mb-5">
                                        <span className="text-[10px] xs:text-xs font-semibold bg-white/20 px-2 xs:px-3 py-1 rounded-full whitespace-nowrap">
                                            30 DAY
                                        </span>
                                        <span className="text-[10px] xs:text-xs font-medium opacity-90">
                                            MONEY BACK GUARANTEE
                                        </span>
                                    </div>

                                    {/* Offer Text */}
                                    <div className="text-center mb-4 sm:mb-5">
                                        <div className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2">
                                            SAVE UP TO
                                        </div>
                                        <div className="text-4xl xs:text-5xl sm:text-6xl font-black">
                                            85%
                                        </div>
                                    </div>

                                    {/* Upgrade Button */}
                                    <div className="flex justify-center mb-3">
                                        <button onClick={handleUpgradeNow} className="w-full xs:w-auto min-w-[180px] sm:min-w-[200px] cursor-pointer bg-white text-purple-600 py-2.5 sm:py-3 px-6 sm:px-8 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 active:scale-95 transition-all duration-300 shadow-md">
                                            Upgrade Now
                                        </button>
                                    </div>

                                    {/* Terms */}
                                    <p className="text-[10px] xs:text-xs text-center opacity-80">
                                        *Conditions apply
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
