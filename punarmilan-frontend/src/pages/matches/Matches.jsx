import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDisplayName } from '../../utils/mockData';
import Header from '../../components/Headers';

import { Heart, MapPin, Briefcase, User, Star, Search, Filter, Sparkles, ChevronLeft, ChevronRight, GraduationCap, X, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MatchProfileCard from '../../components/MatchProfileCard';
import MatchesNav from '../../components/MatchesNav';
import { fetchNewMatches, fetchDailyMatches, fetchAllMatches, fetchNearMeMatches, fetchShortlist, addToShortlistServer, removeFromShortlistServer, fetchRecentlyViewed, fetchRecentVisitors, sendConnectionRequest, fetchSentRequests, fetchPreferenceMatch } from '../../Slice/MatchSlice';
import { fetchMyProfile } from '../../Slice/ProfileSlice';
import TodayMatchView from './TodayMatchView';
import { openChatWith } from '../../Slice/ChatSlice';
import ReportModal from '../../components/ReportModal';
import { motion } from 'framer-motion';

const Matches = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const {
        newMatches,
        dailyMatches,
        allMatches,
        nearMeMatches,
        shortlistedProfiles,
        recentlyViewedMatches,
        recentVisitors,
        sentRequests,
        hasFetched,
        loading: matchLoading,
        error: matchError
    } = useSelector((state) => state.match);
    const { profile: myProfile } = useSelector((state) => state.profile);

    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'new';
    });
    const [selectedFilters, setSelectedFilters] = useState({
        memberType: [],
        maritalStatus: [],
        religion: [],
        motherTongue: [],
        education: [],
        location: [],
        occupation: [],
        verificationStatus: [],
        photoSettings: [],
        recentlyJoined: [],
        activeMembers: [],
        annualIncome: [],
        community: [],
        countryLiving: [],
        stateLiving: [],
        countryGrewUp: [],
        workingWith: [],
        professionArea: [],
        profileManagedBy: [],
        eatingHabits: [],
        educationLevel: [],
        educationArea: [],
        twoWayMatches: []
    });
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const handleSendRequest = (profileId) => {
        dispatch(sendConnectionRequest(profileId));
    };

    const handleShortlist = (profile) => {
        dispatch(addToShortlistServer(profile));
    };

    const handleRemoveShortlist = (profileId) => {
        dispatch(removeFromShortlistServer(profileId));
    };

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportedUser, setReportedUser] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const handleReport = (user) => {
        setReportedUser(user);
        setIsReportModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchShortlist());
        dispatch(fetchSentRequests());
    }, [dispatch]);


    const fetchMatchesByTab = (tab, page = 0) => {
        const params = { page, size: pageSize };
        if (tab === 'new') dispatch(fetchNewMatches(params));
        else if (tab === 'today') dispatch(fetchDailyMatches(params));
        else if (tab === 'my') dispatch(fetchAllMatches(params));
        else if (tab === 'near') dispatch(fetchNearMeMatches(params));
        else if (tab === 'more') {
            dispatch(fetchAllMatches(params));
            dispatch(fetchRecentlyViewed({ page: 0, size: 5 }));
            dispatch(fetchRecentVisitors({ page: 0, size: 5 }));
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
            setCurrentPage(1);
        }

        // Fetch user's own profile for matching comparison
        if (!myProfile) {
            dispatch(fetchMyProfile());
        }

        // Always fetch the current page for the active tab
        fetchMatchesByTab(activeTab || tab || 'new', currentPage - 1);

    }, [location.search, activeTab, currentPage, dispatch, myProfile]);

    const handleFilterChange = (category, value) => {
        setSelectedFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const handleNextProfile = () => {
        if (dailyMatches.length > 0) {
            setCurrentProfileIndex((prev) => (prev + 1) % dailyMatches.length);
        }
    };

    const handlePrevProfile = () => {
        if (dailyMatches.length > 0) {
            setCurrentProfileIndex((prev) => (prev - 1 + dailyMatches.length) % dailyMatches.length);
        }
    };

    const { preferenceMatch } = useSelector((state) => state.match);

    useEffect(() => {
        if (activeTab === 'today' && dailyMatches.length > 0) {
            const currentProfile = dailyMatches[currentProfileIndex];
            if (currentProfile && currentProfile.id) {
                dispatch(fetchPreferenceMatch(currentProfile.id));
            }
        }
    }, [activeTab, currentProfileIndex, dailyMatches, dispatch]);




    const normalizeProfile = (p) => ({
        ...p,
        name: formatDisplayName(p.fullName || p.name, p.displayNameVisibility, p.profileId || `SH${p.id}`),
        img: p.profilePhotoUrl || p.img,
        hasPhoto: !!(p.profilePhotoUrl || p.img),
        bio: p.aboutMe || p.about || p.bio,
        profession: p.occupation || p.profession,
        location: p.city ? `${p.city}, ${p.state || ''}`.trim().replace(/,$/, '') : (p.location || p.country),
        matchScore: p.matchPercentage || 0
    });

    const filteredProfilesBase = React.useMemo(() => {
        let profiles = [];
        if (activeTab === 'new') profiles = newMatches;
        else if (activeTab === 'my') profiles = allMatches;
        else if (activeTab === 'near') profiles = nearMeMatches;
        else if (activeTab === 'today') profiles = []; 
        else if (activeTab === 'more') profiles = allMatches;
        else profiles = [];

        let result = profiles.map(normalizeProfile);

        return result;
    }, [activeTab, newMatches, allMatches, nearMeMatches]);

    const dynamicOptions = React.useMemo(() => {
        const counts = {
            verificationStatus: {},
            photoSettings: {},
            maritalStatus: {},
            religion: {},
            community: {},
            motherTongue: {},
            countryLiving: {},
            stateLiving: {},
            workingWith: {},
            professionArea: {},
            profileManagedBy: {},
            eatingHabits: {},
            educationLevel: {},
            educationArea: {}
        };

        const addToCount = (category, value) => {
            if (!value) return;
            counts[category][value] = (counts[category][value] || 0) + 1;
        };

        filteredProfilesBase.forEach(p => {
            addToCount('verificationStatus', p.verificationStatus);
            addToCount('photoSettings', p.profilePhotoVisibility || 'Visible to all');
            addToCount('maritalStatus', p.maritalStatus);
            addToCount('religion', p.religion);
            addToCount('community', p.caste);
            addToCount('motherTongue', p.motherTongue);
            addToCount('countryLiving', p.country);
            addToCount('stateLiving', p.state);
            addToCount('workingWith', p.workingWith);
            addToCount('professionArea', p.educationField); // Or occupation field if available
            addToCount('profileManagedBy', p.profileCreatedBy);
            addToCount('eatingHabits', p.diet);
            addToCount('educationLevel', p.educationLevel);
            addToCount('educationArea', p.educationField);
        });

        const sortOptions = (obj) => Object.entries(obj)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .map(([label, count]) => ({ label, count }));

        return {
            verificationStatus: sortOptions(counts.verificationStatus),
            photoSettings: sortOptions(counts.photoSettings),
            maritalStatus: sortOptions(counts.maritalStatus),
            religion: sortOptions(counts.religion),
            community: sortOptions(counts.community),
            motherTongue: sortOptions(counts.motherTongue),
            countryLiving: sortOptions(counts.countryLiving),
            stateLiving: sortOptions(counts.stateLiving),
            workingWith: sortOptions(counts.workingWith),
            professionArea: sortOptions(counts.professionArea),
            profileManagedBy: sortOptions(counts.profileManagedBy),
            eatingHabits: sortOptions(counts.eatingHabits),
            educationLevel: sortOptions(counts.educationLevel),
            educationArea: sortOptions(counts.educationArea),
            recentlyJoined: {
                day: filteredProfilesBase.filter(p => {
                    const diff = Math.ceil(Math.abs(new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
                    return diff <= 1;
                }).length,
                week: filteredProfilesBase.filter(p => {
                    const diff = Math.ceil(Math.abs(new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
                    return diff <= 7;
                }).length,
                month: filteredProfilesBase.filter(p => {
                    const diff = Math.ceil(Math.abs(new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
                    return diff <= 30;
                }).length
            },
            annualIncome: {
                upto1: filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('upto1')).length,
                '1to2': filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('1to2')).length,
                '2to4': filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('2to4')).length,
                '4to7': filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('4to7')).length,
                '7to10': filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('7to10')).length,
                '10plus': filteredProfilesBase.filter(p => (p.annualIncome || '').toLowerCase().includes('10plus')).length
            }
        };
    }, [filteredProfilesBase]);

    const filteredProfiles = React.useMemo(() => {
        let result = [...filteredProfilesBase];

        // 1. Member Type (Photo/Premium)
        if (selectedFilters.memberType?.length > 0) {
            result = result.filter(p => {
                if (selectedFilters.memberType.includes('With Photo') && !p.hasPhoto) return false;
                if (selectedFilters.memberType.includes('Premium Members') && !p.isPremium) return false;
                return true;
            });
        }

        // 2. Marital Status
        if (selectedFilters.maritalStatus?.length > 0) {
            result = result.filter(p => selectedFilters.maritalStatus.includes(p.maritalStatus));
        }

        // 3. Religion
        if (selectedFilters.religion?.length > 0) {
            result = result.filter(p => selectedFilters.religion.includes(p.religion));
        }

        // 4. Community (Caste)
        if (selectedFilters.community?.length > 0) {
            result = result.filter(p => selectedFilters.community.includes(p.caste) || selectedFilters.community.includes(p.subCaste));
        }

        // 5. Mother Tongue
        if (selectedFilters.motherTongue?.length > 0) {
            result = result.filter(p => selectedFilters.motherTongue.includes(p.motherTongue));
        }

        // 6. Annual Income Logic
        if (selectedFilters.annualIncome?.length > 0) {
            result = result.filter(p => {
                const income = p.annualIncome || '';
                return selectedFilters.annualIncome.some(val => income.toLowerCase().includes(val.toLowerCase()));
            });
        }

        // 7. Location (Country, State, City)
        if (selectedFilters.countryLiving?.length > 0) {
            result = result.filter(p => selectedFilters.countryLiving.includes(p.country));
        }
        if (selectedFilters.stateLiving?.length > 0) {
            result = result.filter(p => selectedFilters.stateLiving.includes(p.state));
        }
        if (selectedFilters.location?.length > 0) {
            result = result.filter(p => selectedFilters.location.includes(p.city) || selectedFilters.location.includes(p.workingCity));
        }

        // 8. Education level/area
        if (selectedFilters.educationLevel?.length > 0) {
            result = result.filter(p => selectedFilters.educationLevel.includes(p.educationLevel));
        }
        if (selectedFilters.educationArea?.length > 0) {
            result = result.filter(p => selectedFilters.educationArea.includes(p.educationField));
        }

        // 9. Eating Habits (Diet)
        if (selectedFilters.eatingHabits?.length > 0) {
            result = result.filter(p => selectedFilters.eatingHabits.includes(p.diet));
        }

        // 10. Profile Managed by (Created By)
        if (selectedFilters.profileManagedBy?.length > 0) {
            result = result.filter(p => selectedFilters.profileManagedBy.includes(p.profileCreatedBy));
        }

        // 11. Recently Joined (createdAt)
        if (selectedFilters.recentlyJoined?.length > 0) {
            const now = new Date();
            result = result.filter(p => {
                const createdDate = new Date(p.createdAt);
                const diffTime = Math.abs(now - createdDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (selectedFilters.recentlyJoined.includes('day') && diffDays <= 1) return true;
                if (selectedFilters.recentlyJoined.includes('week') && diffDays <= 7) return true;
                if (selectedFilters.recentlyJoined.includes('month') && diffDays <= 30) return true;
                return false;
            });
        }

        // 12. Verification Status
        if (selectedFilters.verificationStatus?.length > 0) {
            result = result.filter(p => selectedFilters.verificationStatus.includes(p.verificationStatus));
        }

        // 13. Photo Settings
        if (selectedFilters.photoSettings?.length > 0) {
            result = result.filter(p => {
                const visibility = p.profilePhotoVisibility || 'Visible to all';
                return selectedFilters.photoSettings.includes(visibility);
            });
        }

        // 14. Working With
        if (selectedFilters.workingWith?.length > 0) {
            result = result.filter(p => selectedFilters.workingWith.includes(p.workingWith));
        }

        return result;
    }, [activeTab, selectedFilters, newMatches, allMatches, nearMeMatches]);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const activeCategory = activeTab === 'new' ? 'newMatches' :
                          activeTab === 'my' ? 'allMatches' :
                          activeTab === 'near' ? 'nearMeMatches' :
                          activeTab === 'more' ? 'allMatches' : 'newMatches';

    const paginationInfo = useSelector((state) => state.match.pagination[activeCategory]);
    const totalPages = paginationInfo?.totalPages || 1;
    const totalElements = paginationInfo?.totalElements || 0;

    const paginatedProfiles = React.useMemo(() => {
        let profiles = [];
        if (activeTab === 'new') profiles = newMatches;
        else if (activeTab === 'my') profiles = allMatches;
        else if (activeTab === 'near') profiles = nearMeMatches;
        else if (activeTab === 'more') profiles = allMatches;
        
        return profiles.map(normalizeProfile);
    }, [activeTab, newMatches, allMatches, nearMeMatches]);

    const pageNumbers = React.useMemo(() => {
        const maxToShow = 5;
        if (totalPages <= maxToShow) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let start = Math.max(1, currentPage - Math.floor(maxToShow / 2));
        let end = start + maxToShow - 1;
        if (end > totalPages) { end = totalPages; start = end - maxToShow + 1; }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [totalPages, currentPage]);

    // computed displayed range for header
    const showingStart = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const showingEnd = Math.min(currentPage * pageSize, totalElements);

    // Determine layout style based on tab
    const layoutType = (activeTab === 'today') ? 'grid' : 'list';
    const normalizedDailyMatches = dailyMatches.map(normalizeProfile);

    const containerClass = activeTab === 'today'
        ? 'flex flex-col w-full max-w-5xl mx-auto'
        : layoutType === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'flex flex-col space-y-4';

    return (
        <div className="min-h-screen bg-white font-sans pt-12 xs:pt-14 sm:pt-16 overflow-x-hidden">
            <Header />

            {/* Secondary Option Bar (Red) - Using Reusable Component */}
            <MatchesNav />

            {/* ===== MOBILE FILTER DRAWER ===== */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileFilterOpen(false)} />
            )}
            <div
                className={`fixed inset-y-0 left-0 z-[9999] w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out ${
                    mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
                    <span className="text-lg font-bold text-gray-700">Refine Search</span>
                    <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500 hover:text-gray-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <FilterSection title="Member Type">
                        <FilterCheckbox label="With Photo" checked={selectedFilters.memberType.includes('With Photo')} onChange={() => handleFilterChange('memberType', 'With Photo')} />
                        <FilterCheckbox label="Premium Members" checked={selectedFilters.memberType.includes('Premium Members')} onChange={() => handleFilterChange('memberType', 'Premium Members')} />
                    </FilterSection>
                    <FilterSection title="Verification Status" defaultOpen={true}>
                        {dynamicOptions.verificationStatus.map(({ label, count }) => (
                            <FilterCheckbox key={label} label={`${label} (${count})`} checked={selectedFilters.verificationStatus.includes(label)} onChange={() => handleFilterChange('verificationStatus', label)} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Marital Status">
                        {dynamicOptions.maritalStatus.map(({ label, count }) => (
                            <FilterCheckbox key={label} label={`${label} (${count})`} checked={selectedFilters.maritalStatus.includes(label)} onChange={() => handleFilterChange('maritalStatus', label)} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Religion">
                        {dynamicOptions.religion.map(({ label, count }) => (
                            <FilterCheckbox key={label} label={`${label} (${count})`} checked={selectedFilters.religion.includes(label)} onChange={() => handleFilterChange('religion', label)} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Mother Tongue">
                        {dynamicOptions.motherTongue.map(({ label, count }) => (
                            <FilterCheckbox key={label} label={`${label} (${count})`} checked={selectedFilters.motherTongue.includes(label)} onChange={() => handleFilterChange('motherTongue', label)} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Education Level">
                        {dynamicOptions.educationLevel.map(({ label, count }) => (
                            <FilterCheckbox key={label} label={`${label} (${count})`} checked={selectedFilters.educationLevel.includes(label)} onChange={() => handleFilterChange('educationLevel', label)} />
                        ))}
                    </FilterSection>
                    <div className="p-4">
                        <button
                            onClick={() => { setSelectedFilters({ memberType: [], maritalStatus: [], religion: [], motherTongue: [], education: [], location: [], occupation: [], verificationStatus: [], photoSettings: [], recentlyJoined: [], activeMembers: [], annualIncome: [], community: [], countryLiving: [], stateLiving: [], countryGrewUp: [], workingWith: [], professionArea: [], profileManagedBy: [], eatingHabits: [], educationLevel: [], educationArea: [], twoWayMatches: [] }); setMobileFilterOpen(false); }}
                            className="w-full py-2.5 text-sm bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-all border border-gray-300"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            {activeTab !== 'today' && (
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden fixed bottom-20 left-4 z-[100] bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:shadow-2xl transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm font-bold">Filters</span>
                </button>
            )}

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-2 sm:pt-3 pb-12">

                <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8">

                    {/* Left Sidebar (Filters/Refine) - Desktop only, Hidden for Today's Matches */}
                    {activeTab !== 'today' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="hidden lg:block w-80 flex-shrink-0 space-y-6"
                        >
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                                <div className="bg-[#f0f0f0] px-4 py-2 text-gray-700 font-bold border-b border-gray-300 flex justify-center items-center">
                                    <span className="text-lg">Refine Search</span>
                                </div>
                                <div className="p-0">
                                    <FilterSection title="Member Type">
                                        <FilterCheckbox label="With Photo" checked={selectedFilters.memberType.includes('With Photo')} onChange={() => handleFilterChange('memberType', 'With Photo')} />
                                        <FilterCheckbox label="Premium Members" checked={selectedFilters.memberType.includes('Premium Members')} onChange={() => handleFilterChange('memberType', 'Premium Members')} />
                                    </FilterSection>

                                    <FilterSection title="Verification Status" defaultOpen={true}>
                                        {dynamicOptions.verificationStatus.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.verificationStatus.includes(label)}
                                                onChange={() => handleFilterChange('verificationStatus', label)}
                                            />
                                        ))}
                                        <FilterCheckbox label="2-way Matches" checked={selectedFilters.twoWayMatches.includes('2-way')} onChange={() => handleFilterChange('twoWayMatches', '2-way')} />
                                    </FilterSection>

                                    <FilterSection title="Photo Settings">
                                        {dynamicOptions.photoSettings.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.photoSettings.includes(label)}
                                                onChange={() => handleFilterChange('photoSettings', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Recently Joined">
                                        <FilterCheckbox label={`Within a day (${dynamicOptions.recentlyJoined.day})`} checked={selectedFilters.recentlyJoined.includes('day')} onChange={() => handleFilterChange('recentlyJoined', 'day')} />
                                        <FilterCheckbox label={`Within a week (${dynamicOptions.recentlyJoined.week})`} checked={selectedFilters.recentlyJoined.includes('week')} onChange={() => handleFilterChange('recentlyJoined', 'week')} />
                                        <FilterCheckbox label={`Within a month (${dynamicOptions.recentlyJoined.month})`} checked={selectedFilters.recentlyJoined.includes('month')} onChange={() => handleFilterChange('recentlyJoined', 'month')} />
                                    </FilterSection>

                                    <FilterSection title="Active Members">
                                        <FilterCheckbox label="Within a day" checked={selectedFilters.activeMembers.includes('day')} onChange={() => handleFilterChange('activeMembers', 'day')} />
                                        <FilterCheckbox label="Within a week" checked={selectedFilters.activeMembers.includes('week')} onChange={() => handleFilterChange('activeMembers', 'week')} />
                                        <FilterCheckbox label="Within a month" checked={selectedFilters.activeMembers.includes('month')} onChange={() => handleFilterChange('activeMembers', 'month')} />
                                    </FilterSection>

                                    <FilterSection title="Annual Income">
                                        <FilterCheckbox label={`Upto INR 1 Lakh (${dynamicOptions.annualIncome.upto1})`} checked={selectedFilters.annualIncome.includes('upto1')} onChange={() => handleFilterChange('annualIncome', 'upto1')} />
                                        <FilterCheckbox label={`INR 1 Lakh to 2 Lakh (${dynamicOptions.annualIncome['1to2']})`} checked={selectedFilters.annualIncome.includes('1to2')} onChange={() => handleFilterChange('annualIncome', '1to2')} />
                                        <FilterCheckbox label={`INR 2 Lakh to 4 Lakh (${dynamicOptions.annualIncome['2to4']})`} checked={selectedFilters.annualIncome.includes('2to4')} onChange={() => handleFilterChange('annualIncome', '2to4')} />
                                        <FilterCheckbox label={`INR 4 Lakh to 7 Lakh (${dynamicOptions.annualIncome['4to7']})`} checked={selectedFilters.annualIncome.includes('4to7')} onChange={() => handleFilterChange('annualIncome', '4to7')} />
                                        <FilterCheckbox label={`INR 7 Lakh to 10 Lakh (${dynamicOptions.annualIncome['7to10']})`} checked={selectedFilters.annualIncome.includes('7to10')} onChange={() => handleFilterChange('annualIncome', '7to10')} />
                                        <FilterCheckbox label={`INR 10 Lakh & Above (${dynamicOptions.annualIncome['10plus']})`} checked={selectedFilters.annualIncome.includes('10plus')} onChange={() => handleFilterChange('annualIncome', '10plus')} />
                                    </FilterSection>

                                    <FilterSection title="Marital Status">
                                        {dynamicOptions.maritalStatus.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.maritalStatus.includes(label)}
                                                onChange={() => handleFilterChange('maritalStatus', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Religion">
                                        {dynamicOptions.religion.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.religion.includes(label)}
                                                onChange={() => handleFilterChange('religion', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Community">
                                        {dynamicOptions.community.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.community.includes(label)}
                                                onChange={() => handleFilterChange('community', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Mother Tongue">
                                        {dynamicOptions.motherTongue.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.motherTongue.includes(label)}
                                                onChange={() => handleFilterChange('motherTongue', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Country Living In">
                                        {dynamicOptions.countryLiving.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.countryLiving.includes(label)}
                                                onChange={() => handleFilterChange('countryLiving', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="State Living In">
                                        {dynamicOptions.stateLiving.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.stateLiving.includes(label)}
                                                onChange={() => handleFilterChange('stateLiving', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Country Grew Up In">
                                        <FilterCheckbox label="India" checked={selectedFilters.countryGrewUp.includes('India')} onChange={() => handleFilterChange('countryGrewUp', 'India')} />
                                        <FilterCheckbox label="USA" checked={selectedFilters.countryGrewUp.includes('USA')} onChange={() => handleFilterChange('countryGrewUp', 'USA')} />
                                    </FilterSection>

                                    <FilterSection title="Working With">
                                        {dynamicOptions.workingWith.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.workingWith.includes(label)}
                                                onChange={() => handleFilterChange('workingWith', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Profession Area">
                                        {dynamicOptions.professionArea.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.professionArea.includes(label)}
                                                onChange={() => handleFilterChange('professionArea', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Profile Managed By">
                                        {dynamicOptions.profileManagedBy.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.profileManagedBy.includes(label)}
                                                onChange={() => handleFilterChange('profileManagedBy', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Eating Habits">
                                        {dynamicOptions.eatingHabits.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.eatingHabits.includes(label)}
                                                onChange={() => handleFilterChange('eatingHabits', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Education Level">
                                        {dynamicOptions.educationLevel.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.educationLevel.includes(label)}
                                                onChange={() => handleFilterChange('educationLevel', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Education Area">
                                        {dynamicOptions.educationArea.map(({ label, count }) => (
                                            <FilterCheckbox
                                                key={label}
                                                label={`${label} (${count})`}
                                                checked={selectedFilters.educationArea.includes(label)}
                                                onChange={() => handleFilterChange('educationArea', label)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <div className="p-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedFilters({ memberType: [], maritalStatus: [], religion: [], motherTongue: [], education: [], location: [], occupation: [], verificationStatus: [], photoSettings: [], recentlyJoined: [], activeMembers: [], annualIncome: [], community: [], countryLiving: [], stateLiving: [], countryGrewUp: [], workingWith: [], professionArea: [], profileManagedBy: [], eatingHabits: [], educationLevel: [], educationArea: [], twoWayMatches: [] })}
                                            className="w-full py-2 text-sm bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 rounded transition-all border border-gray-300"
                                        >
                                            Clear All Filters
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Center Column (Match Cards) */}
                    <div className="flex-1 w-full overflow-hidden min-w-0">
                        {(filteredProfiles.length > 0 || ['near', 'today', 'more', 'my', 'new'].includes(activeTab)) ? (
                            <>
                                <motion.div
                                    key={`${activeTab}-${JSON.stringify(selectedFilters)}-${currentPage}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className={`${containerClass} min-h-[600px]`}
                                >
                                    <div className="col-span-full mb-6 p-4 bg-white/60 backdrop-blur-md rounded-xl border border-pink-100 shadow-sm flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                {activeTab === 'new' ? "New Matches For You" :
                                                    activeTab === 'today' ? "Today's Top Picks" :
                                                        activeTab === 'my' ? "My Preferred Matches" :
                                                            activeTab === 'near' ? "Matches Near You" :
                                                                "Discover More Matches"}
                                            </h2>
                                            <p className="text-sm text-gray-500 font-medium">
                                                {totalElements === 0 ? (
                                                    'Showing 0 profiles'
                                                ) : (
                                                    <>Showing {showingStart} - {showingEnd} of {totalElements} profiles based on your preferences</>
                                                )}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Live Updates</span>
                                        </div>
                                    </div>

                                    {matchLoading ? (
                                        <div className="flex justify-center items-center py-20">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        </div>
                                    ) : activeTab === 'today' ? (
                                        <div className="flex justify-center">
                                            {dailyMatches.length > 0 ? (
                                                <TodayMatchView
                                                    profile={{
                                                        ...dailyMatches[currentProfileIndex],
                                                        name: dailyMatches[currentProfileIndex].fullName,
                                                        img: dailyMatches[currentProfileIndex].profilePhotoUrl,
                                                        bio: dailyMatches[currentProfileIndex].aboutMe,
                                                        profession: dailyMatches[currentProfileIndex].occupation,
                                                        income: dailyMatches[currentProfileIndex].annualIncome,
                                                        education: dailyMatches[currentProfileIndex].educationLevel || dailyMatches[currentProfileIndex].education,
                                                        location: `${dailyMatches[currentProfileIndex].city || ''}, ${dailyMatches[currentProfileIndex].state || ''}, ${dailyMatches[currentProfileIndex].country || ''}`.trim().replace(/^,|,$/g, '').replace(/,\s*,/g, ',') || 'Location not specified',
                                                        isPremium: dailyMatches[currentProfileIndex].isPremium,
                                                        premiumVisible: dailyMatches[currentProfileIndex].premiumVisible
                                                    }}
                                                    myProfile={myProfile}
                                                    preferenceMatch={preferenceMatch}
                                                    onNext={handleNextProfile}
                                                    onPrev={handlePrevProfile}
                                                    currentIndex={currentProfileIndex}
                                                    total={dailyMatches.length}
                                                    onShortlist={() => handleShortlist({
                                                        ...dailyMatches[currentProfileIndex],
                                                        name: dailyMatches[currentProfileIndex].fullName,
                                                        img: dailyMatches[currentProfileIndex].profilePhotoUrl,
                                                        bio: dailyMatches[currentProfileIndex].aboutMe,
                                                        profession: dailyMatches[currentProfileIndex].occupation,
                                                        income: dailyMatches[currentProfileIndex].annualIncome,
                                                        education: dailyMatches[currentProfileIndex].educationLevel || dailyMatches[currentProfileIndex].education,
                                                        location: `${dailyMatches[currentProfileIndex].city || ''}, ${dailyMatches[currentProfileIndex].state || ''}, ${dailyMatches[currentProfileIndex].country || ''}`.trim().replace(/^,|,$/g, '').replace(/,\s*,/g, ',') || 'Location not specified'
                                                    })}
                                                    isShortlisted={shortlistedProfiles.some(p => p.id === dailyMatches[currentProfileIndex].id)}
                                                    onRemoveShortlist={() => handleRemoveShortlist(dailyMatches[currentProfileIndex].id)}
                                                    onConnect={() => handleSendRequest(dailyMatches[currentProfileIndex].id)}
                                                    requestSent={sentRequests.some(r => r.receiverProfileId === dailyMatches[currentProfileIndex].id || r.receiverId === dailyMatches[currentProfileIndex].userId)}
                                                    onChat={() => {
                                                        const target = dailyMatches[currentProfileIndex];
                                                        dispatch(openChatWith({
                                                            id: target.userId || target.id,
                                                            fullName: target.fullName,
                                                            profilePhotoUrl: target.profilePhotoUrl,
                                                            displayNameVisibility: null
                                                        }));
                                                    }}
                                                    onWhatsApp={() => {
                                                        const phone = dailyMatches[currentProfileIndex].mobileNumber;
                                                        if (phone) window.open(`https://wa.me/${phone}`, '_blank');
                                                        else alert("Phone number not available.");
                                                    }}
                                                    onCall={() => {
                                                        const phone = dailyMatches[currentProfileIndex].mobileNumber;
                                                        if (phone) window.open(`tel:${phone}`, '_self');
                                                        else alert("Phone number not available.");
                                                    }}
                                                    onReport={() => handleReport({
                                                        id: dailyMatches[currentProfileIndex].userId || dailyMatches[currentProfileIndex].id,
                                                        name: dailyMatches[currentProfileIndex].fullName
                                                    })}
                                                />
                                            ) : (
                                                <div className="col-span-full py-20 text-center text-gray-500">
                                                    No top matches found for today.
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === 'new' ? (
                                        <div className="flex flex-col gap-6">
                                            {newMatches.length > 0 ? (
                                                newMatches.map((profile) => {
                                                    const normalizedProfile = {
                                                        ...profile,
                                                        name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.profileId || `SH${profile.id}`),
                                                        img: profile.profilePhotoUrl,
                                                        bio: profile.aboutMe,
                                                        profession: profile.occupation,
                                                        location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, '') || profile.country
                                                    };
                                                    return (
                                                        <MatchProfileCard
                                                            key={profile.id}
                                                            profile={normalizedProfile}
                                                            onSendRequest={() => handleSendRequest(profile.id)}
                                                            requestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                            onShortlist={() => handleShortlist(normalizedProfile)}
                                                            isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                            onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            onChat={() => {
                                                                dispatch(openChatWith({
                                                                    id: profile.userId || profile.id,
                                                                    fullName: profile.fullName,
                                                                    profilePhotoUrl: profile.profilePhotoUrl,
                                                                    displayNameVisibility: null
                                                                }));
                                                            }}
                                                            onReport={() => handleReport({
                                                                id: profile.userId || profile.id,
                                                                name: profile.fullName
                                                            })}
                                                            layout="list"
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <div className="py-20 text-center text-gray-500">
                                                    No new matches found for today.
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === 'my' ? (
                                        <div className="flex flex-col gap-6">
                                            {allMatches.length > 0 ? (
                                                allMatches.map((profile) => {
                                                    const normalizedProfile = {
                                                        ...profile,
                                                        name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.profileId || `SH${profile.id}`),
                                                        img: profile.profilePhotoUrl,
                                                        bio: profile.aboutMe,
                                                        profession: profile.occupation,
                                                        location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, '') || profile.country
                                                    };
                                                    return (
                                                        <MatchProfileCard
                                                            key={profile.id}
                                                            profile={normalizedProfile}
                                                            onSendRequest={() => handleSendRequest(profile.id)}
                                                            requestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                            onShortlist={() => handleShortlist(normalizedProfile)}
                                                            isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                            onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            onChat={() => {
                                                                dispatch(openChatWith({
                                                                    id: profile.userId || profile.id,
                                                                    fullName: profile.fullName,
                                                                    profilePhotoUrl: profile.profilePhotoUrl,
                                                                    displayNameVisibility: null
                                                                }));
                                                            }}
                                                            onReport={() => handleReport({
                                                                id: profile.userId || profile.id,
                                                                name: profile.fullName
                                                            })}
                                                            layout="list"
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <div className="py-20 text-center text-gray-500">
                                                    No preferred matches found yet.
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === 'near' ? (
                                        <div className="flex flex-col gap-6">
                                            {nearMeMatches.length > 0 ? (
                                                nearMeMatches.map((profile) => {
                                                    const normalizedProfile = {
                                                        ...profile,
                                                        name: formatDisplayName(profile.fullName, profile.displayNameVisibility, profile.profileId || `SH${profile.id}`),
                                                        img: profile.profilePhotoUrl,
                                                        bio: profile.aboutMe,
                                                        profession: profile.occupation,
                                                        location: `${profile.city || ''}, ${profile.state || ''}`.trim().replace(/^,|,$/g, '') || profile.country
                                                    };
                                                    return (
                                                        <MatchProfileCard
                                                            key={profile.id}
                                                            profile={normalizedProfile}
                                                            onSendRequest={() => handleSendRequest(profile.id)}
                                                            requestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                            onShortlist={() => handleShortlist(normalizedProfile)}
                                                            isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                            onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            onChat={() => {
                                                                dispatch(openChatWith({
                                                                    id: profile.userId || profile.id,
                                                                    fullName: profile.fullName,
                                                                    profilePhotoUrl: profile.profilePhotoUrl,
                                                                    displayNameVisibility: null
                                                                }));
                                                            }}
                                                            onReport={() => handleReport({
                                                                id: profile.userId || profile.id,
                                                                name: profile.fullName
                                                            })}
                                                            layout="list"
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <div className="py-20 text-center">
                                                    <div className="bg-rose-50 rounded-2xl p-8 max-w-md mx-auto border border-rose-100">
                                                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <MapPin className="text-rose-500" size={32} />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found near you</h3>
                                                        <p className="text-gray-600 mb-6">
                                                            {(!myProfile?.city && !myProfile?.state)
                                                                ? "Please update your location (City/State) to see matches near you."
                                                                : "No matches currently available in your area. Please check back later or update your search filters."}
                                                        </p>
                                                        <Link
                                                            to="/my-shadi/my-profile"
                                                            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-200 active:scale-95"
                                                        >
                                                            Update Location
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === 'more' ? (
                                        <div className="flex flex-col space-y-8">
                                            {/* Shortlisted Members Section */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">Shortlisted Members ({shortlistedProfiles.length})</h3>
                                                        <p className="text-xs text-gray-500">Profiles you have Shortlisted</p>
                                                    </div>
                                                </div>

                                                {shortlistedProfiles.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                        {shortlistedProfiles.map((profile) => (
                                                            <MatchProfileCard
                                                                key={profile.id}
                                                                profile={normalizeProfile(profile)}
                                                                layout="compact-grid"
                                                                onSendRequest={() => handleSendRequest(profile.id)}
                                                                isRequestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                                onShortlist={() => handleShortlist(profile)}
                                                                isShortlisted={true}
                                                                onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        No profiles added to shortlist yet.
                                                    </div>
                                                )}

                                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                                                    <button className="text-[#00bcd4] font-bold text-sm hover:underline">
                                                        View all your Shortlists
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Members You May Like Section */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">Members you may like ({allMatches.length})</h3>
                                                        <p className="text-xs text-gray-500">Members who match many of your Preferences</p>
                                                    </div>
                                                </div>

                                                {allMatches.length > 0 ? (
                                                    <div className="relative group">
                                                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth">
                                                            {allMatches.map((profile) => (
                                                                <div key={profile.id} className="flex-shrink-0 w-[220px]">
                                                                    <MatchProfileCard
                                                                        profile={normalizeProfile(profile)}
                                                                        layout="compact-grid"
                                                                        onSendRequest={() => handleSendRequest(profile.id)}
                                                                        isRequestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                                        onShortlist={() => handleShortlist(profile)}
                                                                        isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                                        onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Simple Navigation Override for horizontal scroll */}
                                                        <button
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            onClick={() => {
                                                                const container = document.querySelector('.scrollbar-hide');
                                                                container.scrollBy({ left: 300, behavior: 'smooth' });
                                                            }}
                                                        >
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center text-gray-500">
                                                        Loading suggestion profiles...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recently Viewed Members Section */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">Recently Viewed Members ({recentlyViewedMatches.length})</h3>
                                                        <p className="text-xs text-gray-500">Profiles you recently checked out</p>
                                                    </div>
                                                </div>

                                                {recentlyViewedMatches.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                        {recentlyViewedMatches.map((profile) => (
                                                            <MatchProfileCard
                                                                key={profile.id}
                                                                profile={normalizeProfile(profile)}
                                                                layout="compact-grid"
                                                                onSendRequest={() => handleSendRequest(profile.id)}
                                                                isRequestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                                onShortlist={() => handleShortlist(profile)}
                                                                isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                                onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        You haven't viewed any profiles recently.
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">Recent Visitors ({recentVisitors.length})</h3>
                                                        <p className="text-xs text-gray-500">Members who recently visited your Profile</p>
                                                    </div>
                                                </div>

                                                {recentVisitors.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                        {recentVisitors.map((profile) => (
                                                            <MatchProfileCard
                                                                key={profile.id}
                                                                profile={normalizeProfile(profile)}
                                                                layout="compact-grid"
                                                                onSendRequest={() => handleSendRequest(profile.id)}
                                                                isRequestSent={sentRequests.some(r => r.receiverProfileId === profile.id || r.receiverId === profile.userId)}
                                                                onShortlist={() => handleShortlist(profile)}
                                                                isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                                onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        No recent visitors to your profile yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : activeTab === 'my' || activeTab === 'new' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedProfiles.map((profile) => {
                                                return (
                                                    <MatchProfileCard
                                                        key={profile.id}
                                                        profile={profile}
                                                        onSendRequest={() => handleSendRequest(profile.id)}
                                                        isRequestSent={sentRequests.some(r => r.receiverProfileId === (profile.id) || r.receiverId === (profile.userId))}
                                                        onShortlist={() => handleShortlist(profile)}
                                                        isShortlisted={shortlistedProfiles.some(p => p.id === profile.id)}
                                                        onRemoveShortlist={() => handleRemoveShortlist(profile.id)}
                                                        onChat={() => {
                                                            dispatch(openChatWith({
                                                                id: profile.userId || profile.id,
                                                                fullName: profile.fullName || profile.name,
                                                                profilePhotoUrl: profile.profilePhotoUrl || profile.img,
                                                                displayNameVisibility: null
                                                            }));
                                                        }}
                                                        onReport={() => handleReport({
                                                            id: profile.userId || profile.id,
                                                            name: profile.fullName || profile.name
                                                        })}
                                                        layout="grid"
                                                    />
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </motion.div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            Prev
                                        </button>

                                        {pageNumbers.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`px-3 py-1 rounded-md border ${p === currentPage ? 'bg-pink-500 text-white border-pink-500' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/90 backdrop-blur-sm p-16 rounded-2xl shadow-xl text-center border-2 border-dashed border-pink-200"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-12 h-12 text-pink-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h3>
                                <p className="text-gray-500 text-base mb-6">Try expanding your search criteria to discover more profiles.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedFilters({ memberType: [], maritalStatus: [], religion: [] })}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Clear All Filters
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportedUser={reportedUser}
            />
        </div>
    );
};

// Helper Components for Cleaner JSX
const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="text-sm font-semibold text-gray-700">{title}</span>
                <span className="text-gray-400 font-bold">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer group py-1">
        <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            checked={checked}
            onChange={onChange}
        />
        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
);




export default Matches;
