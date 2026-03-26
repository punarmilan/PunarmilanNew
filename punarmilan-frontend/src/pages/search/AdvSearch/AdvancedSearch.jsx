import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProfiles } from '../../../Slice/SearchSlice';
import { Search, RotateCcw, HelpCircle } from 'lucide-react';
import LocationDetails from './LocationDetails';
import EducationDetails from './EducationDetails';
import Lifestyle from './LifeStyle';
// import KeywordSearch from './KeywordSearch';
import SearchNav from '../SearchNav';
import ProfileId from '../basicSearch/ProfileId';
import AgeBasic from '../basicSearch/AgeBasic';


const AdvancedSearchApp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myProfile } = useSelector((state) => state.profile);
    const [isSearching, setIsSearching] = useState(false);

    // Centralized Search State
    const [filters, setFilters] = useState({
        // Location Details
        country: 'UK',
        state: 'Open to All',
        residency: 'Open to All',
        grewUp: 'Open to All',
        // Education & Profession
        qualification: 'Open to All',
        educationArea: 'Open to All',
        workingWith: 'Open to All',
        professionArea: 'Open to All',
        incomeType: 'range', // 'all' or 'range'
        currency: 'GBP',
        minIncome: 'below 20,000',
        maxIncome: 'above 300,000',
        includeUnspecified: false,
        // Lifestyle
        diet: {
            openToAll: true,
            veg: false,
            nonVeg: false,
            jain: false,
            vegan: false
        },
        // Search Options
        chatStatus: false,
        visibleToAll: false,
        protectedPhoto: false,
        managedBy: {
            openToAll: true,
            self: false,
            parentGuardian: false,
            siblingFriendOthers: false
        },
        profilesFilteredMeOut: true,
        profilesAlreadyViewed: false,
        isPremium: false
    });

    const handleFilterChange = (section, key, value) => {
        if (section === 'managedBy') {
            if (key === 'openToAll') {
                setFilters(prev => ({
                    ...prev,
                    managedBy: {
                        openToAll: true,
                        self: false,
                        parentGuardian: false,
                        siblingFriendOthers: false
                    }
                }));
            } else {
                setFilters(prev => ({
                    ...prev,
                    managedBy: {
                        ...prev.managedBy,
                        openToAll: false,
                        [key]: value
                    }
                }));
            }
            return;
        }

        if (section) {
            setFilters(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const handleSearch = () => {
        setIsSearching(true);
        const targetGender = myProfile ? (myProfile.gender === 'Male' ? 'Female' : 'Male') : null;

        const dietList = [];
        if (!filters.diet.openToAll) {
            if (filters.diet.veg) dietList.push('Veg');
            if (filters.diet.nonVeg) dietList.push('Non-Veg');
            if (filters.diet.jain) dietList.push('Jain');
            if (filters.diet.vegan) dietList.push('Vegan');
        }

        const managedByList = [];
        if (!filters.managedBy.openToAll) {
            if (filters.managedBy.self) managedByList.push('Self');
            if (filters.managedBy.parentGuardian) managedByList.push('Parent / Guardian');
            if (filters.managedBy.siblingFriendOthers) managedByList.push('Sibling / Friend / Others');
        }

        const cleanList = (val) => {
            if (val === 'Open to All' || !val) return [];
            return Array.isArray(val) ? val.filter(v => v !== 'Open to All') : [val];
        };

        const criteria = {
            gender: targetGender,
            country: cleanList(filters.country),
            state: cleanList(filters.state),
            residencyStatus: cleanList(filters.residency),
            grewUpIn: cleanList(filters.grewUp),
            educationLevel: cleanList(filters.qualification),
            educationField: cleanList(filters.educationArea),
            workingWith: cleanList(filters.workingWith),
            occupation: cleanList(filters.professionArea),
            minIncome: filters.incomeType === 'range' ? filters.minIncome : null,
            maxIncome: filters.incomeType === 'range' ? filters.maxIncome : null,
            diet: dietList,
            profileCreatedBy: managedByList,
            isPremium: filters.isPremium ? true : null,
            chatStatus: filters.chatStatus ? true : null,
            showWithPhoto: filters.visibleToAll ? true : null,
            showProtectedPhoto: filters.protectedPhoto ? true : null
        };

        dispatch(searchProfiles({ criteria }));
        navigate('/search-results', { state: { filters: criteria } });
        setIsSearching(false);
    };

    const handleReset = () => {
        window.location.reload();
    };

    return (
        <>
            <SearchNav />
            <ProfileId />
            <AgeBasic />

            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Location Details */}
                        <LocationDetails
                            filters={filters}
                            onChange={(key, value) => handleFilterChange(null, key, value)}
                        />

                        {/* Education & Profession Details */}
                        <EducationDetails
                            filters={filters}
                            onChange={(key, value) => handleFilterChange(null, key, value)}
                        />

                        {/* Lifestyle & Appearance */}
                        <Lifestyle
                            diet={filters.diet}
                            onChange={(dietState) => handleFilterChange(null, 'diet', dietState)}
                        />

                        {/* Search Options Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-4 sm:p-6">
                            <div className="space-y-6">
                                {/* Chat Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                                    <label className="text-sm text-gray-600 font-medium sm:font-normal sm:pt-3">Chat Status</label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.chatStatus}
                                            onChange={() => handleFilterChange(null, 'chatStatus', !filters.chatStatus)}
                                            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-700">Only Profiles available for Chat</span>
                                    </label>
                                </div>

                                {/* Photo Settings */}
                                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                                    <label className="text-sm text-gray-600 font-medium sm:font-normal sm:pt-3">Photo Settings</label>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.visibleToAll}
                                                onChange={() => handleFilterChange(null, 'visibleToAll', !filters.visibleToAll)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-700">Visible to all</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.protectedPhoto}
                                                onChange={() => handleFilterChange(null, 'protectedPhoto', !filters.protectedPhoto)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-700 flex items-center gap-1">
                                                Protected Photo
                                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Profile Managed by */}
                                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                                    <label className="text-sm text-gray-900 font-semibold sm:font-medium sm:pt-3">Profile Managed by</label>
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.managedBy.openToAll}
                                                    onChange={() => handleFilterChange('managedBy', 'openToAll', true)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">Open to All</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.managedBy.self}
                                                    onChange={() => handleFilterChange('managedBy', 'self', !filters.managedBy.self)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">Self</span>
                                            </label>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.managedBy.parentGuardian}
                                                    onChange={() => handleFilterChange('managedBy', 'parentGuardian', !filters.managedBy.parentGuardian)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">Parent / Guardian</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.managedBy.siblingFriendOthers}
                                                    onChange={() => handleFilterChange('managedBy', 'siblingFriendOthers', !filters.managedBy.siblingFriendOthers)}
                                                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">Sibling / Friend / Others</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Do Not Show */}
                                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                                    <label className="text-sm text-gray-600 font-medium sm:font-normal sm:pt-3">Do Not Show</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.profilesFilteredMeOut}
                                                onChange={() => handleFilterChange(null, 'profilesFilteredMeOut', !filters.profilesFilteredMeOut)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-700 flex items-center gap-1">
                                                Profiles that have Filtered me out
                                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.profilesAlreadyViewed}
                                                onChange={() => handleFilterChange(null, 'profilesAlreadyViewed', !filters.profilesAlreadyViewed)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-700">Profiles that I have already Viewed</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.isPremium}
                                                onChange={() => handleFilterChange(null, 'isPremium', !filters.isPremium)}
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-700 font-medium text-amber-600">Premium Members only</span>
                                        </label>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-4'>
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className='bg-blue-400 text-white rounded p-2 px-6 cursor-pointer hover:bg-blue-500 transition-colors'
                                    >
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className='bg-white rounded border p-2 px-6 cursor-pointer hover:bg-gray-50 transition-colors'
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for mobile sticky button */}
                    <div className="h-24 sm:hidden"></div>
                </div>

                <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
            </div>

        </>
    );
};

export default AdvancedSearchApp;