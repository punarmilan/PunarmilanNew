import React, { useState } from 'react'
import { HiSparkles, HiCheckCircle, HiArrowRight, HiOutlineHeart, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import RecentChatsCard from '../../../components/RecentChatsCard'
import MatchesSection from '../../../components/MatchesSection'
import PremiumMatches from '../../../components/PremiumMatches'
import EventSection from '../../../components/EventSection'
import NewMatches from '../../../components/NewMatches'
import InterestRequestCard from '../../../components/InterestRequestCard'
import { Link, useNavigate } from 'react-router-dom'
import RecentVistiors from './RecentVisitors'
import ProfileUpdate from './ProfileUpdate'

import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardSummary } from '../../../Slice/DashboardSlice'
import { fetchNewMatches } from '../../../Slice/MatchSlice'

import api from '../../../services/api'
import { toast } from 'react-hot-toast'
import layoutBg from '../../../assets/image/sunny-floral-path.png'

const dummyNewMatches = [
  {
    id: 1,
    name: "Julia Ann",
    city: "New York",
    age: 22,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
    online: true,
    occupation: "Software Engineer",
    education: "Master's Degree",
    height: "5'4\"",
    religion: "Christian"
  },
  {
    id: 2,
    name: "Aria Montgomery",
    city: "Boston",
    age: 24,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
    online: true,
    occupation: "Fashion Journalist",
    education: "Bachelor of Arts",
    height: "5'5\"",
    religion: "Hindu"
  },
  {
    id: 3,
    name: "Serena van der Woodsen",
    city: "Los Angeles",
    age: 23,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
    online: false,
    occupation: "Public Relations Specialist",
    education: "Undergraduate",
    height: "5'8\"",
    religion: "Jewish"
  },
  {
    id: 4,
    name: "Elena Gilbert",
    city: "Chicago",
    age: 21,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
    online: true,
    occupation: "Medical Resident",
    education: "Pre-Med",
    height: "5'6\"",
    religion: "Orthodox"
  },
  {
    id: 5,
    name: "Rachel Green",
    city: "San Francisco",
    age: 25,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=60",
    online: false,
    occupation: "Buying Manager",
    education: "Associate Degree",
    height: "5'4\"",
    religion: "Sikh"
  }
];

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { summary, loading } = useSelector((state) => state.dashboard);
    const { subscriptionDetails } = useSelector((state) => state.user);
    const { newMatches } = useSelector((state) => state.match);
    const [sentInterests, setSentInterests] = useState(new Set());

    const handleSendInterest = async (e, profileId) => {
        e.stopPropagation();
        try {
            await api.post(`/connections/send/${profileId}`);
            toast.success("Interest sent successfully!");
            setSentInterests((prev) => new Set(prev).add(profileId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send interest");
        }
    };

    const isPremium = subscriptionDetails?.active || summary?.user?.isPremium;

    React.useEffect(() => {
        dispatch(fetchDashboardSummary());
        dispatch(fetchNewMatches({ page: 0, size: 6 }));

        const fetchSentConnections = async () => {
            try {
                const response = await api.get('/connections/sent');
                // The receiverProfile or receiverProfileId tells us who we sent an interest to
                const sentIds = new Set(response.data.map(conn => conn.receiverProfile?.id || conn.receiverProfileId));
                setSentInterests(sentIds);
            } catch (error) {
                console.error("Failed to fetch sent connections", error);
            }
        };
        fetchSentConnections();
    }, [dispatch]);

    const [open, setOpen] = useState(false);

    const handleUpgradeNow = () => {
        navigate('/payment');
    };

    const MALE_AVATARS = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60"
    ];

    const FEMALE_AVATARS = [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=60"
    ];

    const displayNewMatches = newMatches && newMatches.length > 0 
        ? newMatches.map(m => {
            const idVal = m.id || m.userId || 0;
            const isMale = (m.gender || 'female').toLowerCase() === 'male';
            const fallbackAvatar = isMale 
                ? MALE_AVATARS[idVal % MALE_AVATARS.length] 
                : FEMALE_AVATARS[idVal % FEMALE_AVATARS.length];
            return {
                id: m.id,
                name: m.fullName || m.name,
                city: m.city || m.state || "India",
                age: m.age || 25,
                image: m.profilePhotoUrl || m.image || fallbackAvatar,
                online: m.isOnline || false,
                occupation: m.occupation || "Profession",
                education: m.educationLevel || m.education || "Graduate",
                height: m.height || "5'5\"",
                religion: m.religion || "Hindu"
            };
          })
        : dummyNewMatches;

    return (
        <div className="relative w-full min-h-screen font-sans overflow-x-hidden text-[#4A3728] bg-transparent">
            {/* Elegant Matrimony Decorative Ornaments */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#EBDCCB]/30 to-transparent rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 left-0 w-96 h-96 bg-gradient-to-tr from-[#EBDCCB]/30 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto relative z-10 px-0 sm:px-2 lg:px-4">
                {/* Main Content Section */}
                <div className="flex-1 w-full pb-4 md:pb-6">
                    
                    {/* Welcome Profile Header Card */}
                    <div className="dashboard-card-bg mb-6 rounded-[24px] border border-white/50 shadow-[0_8px_30px_rgb(229,213,192,0.2)] p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-1 md:gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#C5A059] shadow-md">
                                        <img 
                                            src={summary?.user?.profilePhotoUrl?.url || summary?.user?.profilePhotoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60"} 
                                            alt={summary?.user?.fullName || "User Profile"} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {isPremium && (
                                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C5A059] to-[#8C6D39] text-white p-1.5 rounded-full shadow-md border border-[#FCFAF7] flex items-center justify-center animate-bounce">
                                            <span className="text-[10px] font-bold px-1">PRO</span>
                                        </div>
                                    )}
                                </div>

                                {/* Profile info */}
                                <div className="text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#4A3728]">
                                            Namaste, {summary?.user?.fullName || "Partner"}
                                        </h1>
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${isPremium ? 'bg-[#FCFAF7] text-[#8C6D39] border border-[#C5A059]' : 'bg-[#FAF6F0] text-gray-500 border border-gray-200'}`}>
                                            {isPremium ? "Premium Member" : "Free Account"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Profile ID: <span className="font-mono font-bold text-[#8C6D39]">{summary?.user?.profileId || `SH${summary?.user?.id || '29482'}`}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Logged in as: {summary?.user?.email || "User"}
                                    </p>

                                    {/* Sleek, Modern Stats Grid */}
                                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mt-3 pt-3 border-t border-[#EBDCCB]/60">
                                        {/* Stat 1 */}
                                        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#C5A059] transition-all duration-300 shadow-sm">
                                            <span className="text-sm">👁️</span>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-[#4A3728] leading-tight">{summary?.recentVisitorsCount || 0}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Views</p>
                                            </div>
                                        </div>

                                        {/* Stat 2 */}
                                        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#C5A059] transition-all duration-300 shadow-sm">
                                            <span className="text-sm">📩</span>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-[#4A3728] leading-tight">{summary?.pendingInvitations || 0}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Received</p>
                                            </div>
                                        </div>

                                        {/* Stat 3 */}
                                        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#C5A059] transition-all duration-300 shadow-sm">
                                            <span className="text-sm">🤝</span>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-[#4A3728] leading-tight">{summary?.acceptedInvitations || 0}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Accepted</p>
                                            </div>
                                        </div>

                                        {/* Stat 4 */}
                                        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#C5A059] transition-all duration-300 shadow-sm">
                                            <span className="text-sm">💖</span>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-[#4A3728] leading-tight">{summary?.shortlistCount || summary?.shortlistedCount || 0}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Saved</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Completion Dial / Bar */}
                            <div className="dashboard-card-bg w-full md:w-64 border border-white/50 rounded-2xl p-3 flex flex-col justify-between mt-2 md:mt-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-gray-600">Profile Completion</span>
                                    <span className="text-sm font-bold text-[#8C6D39]">{summary?.profileCompletionPercentage || 0}%</span>
                                </div>
                                <div className="w-full bg-[#EBDCCB] h-2.5 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-[#C5A059] to-[#8C6D39] h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${summary?.profileCompletionPercentage || 0}%` }}
                                    />
                                </div>
                                <button 
                                    onClick={() => navigate('/my-shadi/my-profile')}
                                    className="mt-3 w-full py-1.5 text-center text-xs font-bold bg-[#8C6D39] hover:bg-[#7C5D29] text-white rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    Improve Score
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* New Profiles Matches horizontal carousel */}
                    <div className="mb-8 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#7a5e3d] flex items-center gap-2 drop-shadow-sm">
                                <span className="text-[#C5A059]">✦</span> Matches for You
                            </h2>
                            <button onClick={() => navigate('/matches')} className="text-sm font-semibold text-[#8C6D39] hover:text-[#7C5D29] flex items-center gap-1">
                                View All Matches <HiArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        
                        <div className="relative group">
                            {/* Left Arrow */}
                            <button 
                                className="absolute left-[-20px] top-[40%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-[#F5E6D3] flex items-center justify-center text-[#8C6D39] z-10 hover:bg-[#FCFAF7] transition-all hidden md:flex opacity-0 group-hover:opacity-100" 
                                onClick={() => document.getElementById('matches-carousel').scrollBy({ left: -300, behavior: 'smooth' })}
                            >
                                <HiChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Scroll Container */}
                            <div id="matches-carousel" className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth px-1">
                                {displayNewMatches.map((profile, idx) => (
                                    <div 
                                        key={profile.id}
                                        onClick={() => navigate(`/matches/${profile.id}`)}
                                        className="flex-shrink-0 w-[240px] snap-center bg-gradient-to-b from-[#FFFDF9] to-[#FCFAF7] rounded-[20px] border border-[#F0E6D8] overflow-hidden shadow-[0_4px_20px_rgb(229,213,192,0.3)] hover:shadow-[0_8px_30px_rgb(200,180,150,0.4)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group/card"
                                    >
                                        {/* Top Image Section */}
                                        <div className="relative w-full h-[190px] overflow-hidden">
                                            <img 
                                                src={profile.image} 
                                                alt={profile.name} 
                                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/80 via-transparent to-black/20" />
                                            
                                            {/* Tag */}
                                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[9px] uppercase tracking-wider font-extrabold text-white shadow-md backdrop-blur-sm ${idx % 4 === 1 ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8A25]' : 'bg-gradient-to-r from-[#10B981] to-[#059669]'}`}>
                                                {idx % 4 === 1 ? 'Premium' : 'New'}
                                            </div>
                                            
                                            {/* Heart icon top right */}
                                            <button className="absolute top-3 right-3 text-white/90 hover:text-rose-400 hover:scale-110 transition-all duration-200 drop-shadow-md">
                                                <HiOutlineHeart className="w-5 h-5" />
                                            </button>

                                            {/* Quick info overlaid on image bottom - REMOVED to match screenshot */}
                                        </div>
                                        
                                        {/* Bottom Details Section */}
                                        <div className="p-4 flex flex-col flex-1 relative bg-white rounded-t-[24px] -mt-5 z-10">
                                            
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <h3 className="font-bold text-[#4A3728] text-base truncate">{profile.name}</h3>
                                                <HiCheckCircle className="text-[#10B981] w-4 h-4" />
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-medium mb-3">
                                                {profile.age} yrs • {profile.height}
                                            </p>
                                            
                                            <div className="space-y-2 mb-4">
                                                <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-400 text-xs shadow-sm">📋</span> 
                                                    <span className="truncate">{profile.religion} • {profile.education}</span>
                                                </p>
                                                <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-400 text-xs shadow-sm">📍</span> 
                                                    <span className="truncate">Located in {profile.city}</span>
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-auto flex items-center gap-2.5">
                                                <button className="w-9 h-9 rounded-full border border-rose-200 bg-white shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 flex-shrink-0 hover:scale-105">
                                                    <HiOutlineHeart className="w-4 h-4" />
                                                </button>
                                                
                                                {sentInterests.has(profile.id) ? (
                                                    <button disabled className="flex-1 h-9 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-xs font-bold shadow-md opacity-90 cursor-not-allowed">
                                                        Interest Sent
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={(e) => handleSendInterest(e, profile.id)}
                                                        className="flex-1 h-9 bg-gradient-to-r from-[#E85D75] to-[#D64C63] hover:from-[#D64C63] hover:to-[#C03950] text-white rounded-full text-xs font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                                    >
                                                        Send Interest
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button 
                                className="absolute right-[-20px] top-[40%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-[#F5E6D3] flex items-center justify-center text-[#8C6D39] z-10 hover:bg-[#FCFAF7] transition-all hidden md:flex opacity-0 group-hover:opacity-100" 
                                onClick={() => document.getElementById('matches-carousel').scrollBy({ left: 300, behavior: 'smooth' })}
                            >
                                <HiChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Interest Request section with tabs and Accept/Deny buttons */}
                    <div className="mb-8 animate-fade-in-up">
                        <InterestRequestCard />
                    </div>

                    {/* Dashboard Grid Container */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Main Left Columns */}
                        <div className="xl:col-span-2 space-y-8">
                            
                            {/* Recent Conversations */}
                            <RecentChatsCard />

                            {/* <div className="bg-white rounded-[24px] border border-[#EBDCCB] shadow-[0_8px_30px_rgb(229,213,192,0.2)] p-6 hover:-translate-y-1 transition-all duration-300">
                                <RecentVistiors />
                            </div> */}


                        </div>

                        {/* Right Sidebar Columns */}
                        <div className="space-y-6">
                            
                            {/* Premium Upgrade Promotion Banner */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[20px] border border-slate-700/50 p-5 shadow-2xl relative overflow-hidden group hover:border-[#C5A059]/50 transition-all duration-300">
                                {/* Decorative elements */}
                                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />
                                <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-[#8C6D39]/20 rounded-full blur-xl pointer-events-none" />
                                
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className="flex items-center gap-1.5 bg-[#C5A059]/15 px-2.5 py-1 rounded-md border border-[#C5A059]/30">
                                        <HiSparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                                        <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">Premium</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">Save 85%</span>
                                </div>

                                <div className="text-4xl mb-2 relative z-10 drop-shadow-md text-center">💎</div>
                                
                                <h3 className="text-lg font-bold font-serif mb-3 text-white leading-tight relative z-10">
                                    Find Your Perfect Match <br/> <span className="text-[#C5A059]">Faster</span>
                                </h3>
                                
                                <ul className="space-y-2 mb-5 relative z-10">
                                    {[
                                        'Message profiles directly',
                                        'See who viewed your profile',
                                        'Priority profile listing'
                                    ].map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                            <HiCheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={handleUpgradeNow}
                                    className="w-full relative z-10 bg-gradient-to-r from-[#C5A059] to-[#8C6D39] hover:from-[#B59049] hover:to-[#7C5D29] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-[#C5A059]/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm group-hover:shadow-[#C5A059]/40"
                                >
                                    Upgrade Now
                                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Events/Calendar Section */}
                            {/* <div className="bg-white rounded-[24px] border border-[#EBDCCB] shadow-[0_8px_30px_rgb(229,213,192,0.2)] p-6 hover:-translate-y-1 transition-all duration-300">
                                <EventSection />
                            </div> */}


                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
