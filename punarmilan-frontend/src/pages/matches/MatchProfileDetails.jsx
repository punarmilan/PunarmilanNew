import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDisplayName } from '../../utils/mockData';
import {
    logProfileView, sendConnectionRequest, fetchSentRequests,
    fetchProfileById, addToShortlistServer, fetchShortlist,
    removeFromShortlistServer, fetchPreferenceMatch
} from '../../Slice/MatchSlice';
import { fetchMyProfile } from '../../Slice/ProfileSlice';
import { openChatWith } from '../../Slice/ChatSlice';
import { trackContactView, fetchSubscriptionDetails } from '../../Slice/UserSlice';
import Header from '../../components/Headers';
import MatchesNav from '../../components/MatchesNav';
import { generateProfiles, getProfileById } from './matchesMockData';

import {
    CheckCircle, MapPin, User, Clock,
    Phone, Mail, Lock, Music, Coffee,
    Briefcase, Book, Heart, ArrowLeft,
    ChevronDown, ChevronUp, Share2, Printer, Star, Shield,
    MessageSquare, Copy, ExternalLink, Calendar, GraduationCap,
    Home, Users, HeartHandshake, Info, Flag, Ban, Check, BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumLock from '../../components/PremiumLock';

const MatchProfileDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sentRequests, currentProfile, shortlistedProfiles, preferenceMatch } = useSelector((state) => state.match);
    const { profile: myProfile } = useSelector((state) => state.profile);
    const { user, subscriptionDetails } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('detailed');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Initial data fetching
    useEffect(() => {
        dispatch(fetchSentRequests());
        dispatch(fetchMyProfile());
        dispatch(fetchShortlist());
        if (!subscriptionDetails) {
            dispatch(fetchSubscriptionDetails());
        }
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isShortlisted = profile && shortlistedProfiles?.some(p => p.id === profile.rawId);

    const toggleShortlist = async () => {
        if (!profile || !profile.rawId) return;
        try {
            if (isShortlisted) {
                await dispatch(removeFromShortlistServer(profile.rawId)).unwrap();
                alert("Removed from shortlist successfully!");
            } else {
                await dispatch(addToShortlistServer({ id: profile.rawId })).unwrap();
                alert("Added to shortlist successfully!");
            }
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Shortlist error:", error);
            alert(`Failed to ${isShortlisted ? 'remove' : 'add'} shortlist. Please try again.`);
        }
    };

    // Helper to map backend DTO to local profile structure
    const mapBackendToLocal = (backendProfile) => {
        const photos = [
            backendProfile.profilePhotoUrl,
            backendProfile.photoUrl2,
            backendProfile.photoUrl3,
            backendProfile.photoUrl4,
            backendProfile.photoUrl5,
            backendProfile.photoUrl6
        ].filter(Boolean);

        return {
            id: backendProfile.id,
            rawId: backendProfile.id,
            userId: backendProfile.userId,
            name: formatDisplayName(
                backendProfile.fullName,
                backendProfile.displayNameVisibility,
                backendProfile.profileId
            ),
            img: backendProfile.profilePhotoUrl || null,
            image: backendProfile.profilePhotoUrl || null,
            allPhotos: photos.length > 0 ? photos : [],
            age: backendProfile.age || "N/A",
            height: backendProfile.height || "N/A",
            weight: backendProfile.weight || "N/A",
            religion: backendProfile.religion || 'Not Specified',
            caste: backendProfile.caste || 'Not Specified',
            subCaste: backendProfile.subCaste || '',
            gotra: backendProfile.gotra || '',
            manglikStatus: backendProfile.manglikStatus || 'Not Specified',
            motherTongue: backendProfile.motherTongue || 'Not Specified',
            maritalStatus: backendProfile.maritalStatus || 'Never Married',
            education: backendProfile.educationLevel || 'Not Specified',
            educationField: backendProfile.educationField || '',
            college: backendProfile.college || '',
            profession: backendProfile.occupation || 'Professional',
            location: `${backendProfile.city || ''}, ${backendProfile.state || ''}`.trim().replace(/^,/, '').trim() || (backendProfile.country || 'N/A'),
            city: backendProfile.city,
            state: backendProfile.state,
            country: backendProfile.country || 'India',
            gender: backendProfile.gender,
            managedBy: backendProfile.profileCreatedBy || 'Self',
            about: backendProfile.aboutMe || "N/A",
            phone: backendProfile.mobileNumber || "",
            income: backendProfile.annualIncome || 'Not Specified',
            diet: backendProfile.diet || 'Not Specified',
            smokingHabit: backendProfile.smokingHabit || 'No',
            drinkingHabit: backendProfile.drinkingHabit || 'No',
            bloodGroup: backendProfile.bloodGroup || '',
            verificationStatus: backendProfile.verificationStatus,
            photoVerificationStatus: backendProfile.photoVerificationStatus,
            mobileVerified: backendProfile.mobileVerified,
            isContactViewed: backendProfile.isContactViewed,
            email: backendProfile.email,

            // Horoscope
            horoscope: {
                rashi: backendProfile.rashi,
                nakshatra: backendProfile.nakshatra,
                placeOfBirth: backendProfile.placeOfBirth,
                timeOfBirth: backendProfile.timeOfBirth,
                dateOfBirth: backendProfile.dateOfBirth
            },

            // Family
            family: {
                fatherStatus: backendProfile.fatherStatus,
                motherStatus: backendProfile.motherStatus,
                brothersCount: backendProfile.brothersCount,
                sistersCount: backendProfile.sistersCount,
                familyFinancialStatus: backendProfile.familyFinancialStatus,
                familyLocation: backendProfile.familyLocation,
                familyIncome: backendProfile.familyIncome // Note: Backend might not have this separately yet
            },

            partnerPreference: backendProfile.partnerPreference,
            isPremium: backendProfile.isPremium,
            premiumVisible: backendProfile.premiumVisible,
            preferences: {
                age: backendProfile.partnerPreference ? `${backendProfile.partnerPreference.minAge || 18} to ${backendProfile.partnerPreference.maxAge || 70}` : "Not Specified",
                height: backendProfile.partnerPreference ? `${backendProfile.partnerPreference.minHeight || "Any"} to ${backendProfile.partnerPreference.maxHeight || "Any"}` : "Not Specified",
                maritalStatus: backendProfile.partnerPreference?.maritalStatus || "Any",
                community: backendProfile.partnerPreference?.preferredReligion || "Any",
                motherTongue: backendProfile.partnerPreference?.preferredMotherTongue || "Any",
                country: backendProfile.partnerPreference?.preferredCountry || "Any",
                state: backendProfile.partnerPreference?.preferredState || "Any",
                income: backendProfile.partnerPreference?.minAnnualIncome || "Any"
            }
        };
    };

    const handleRevealContact = async () => {
        if (!user?.isPremium || !subscriptionDetails?.active) {
            alert("Upgrade to Premium to reveal contact details.");
            navigate('/payment');
            return;
        }

        if (subscriptionDetails.balance <= 0 && !profile.isContactViewed) {
            alert("You have exhausted your contact views balance. Please upgrade your plan.");
            navigate('/payment');
            return;
        }

        try {
            await dispatch(trackContactView(profile.rawId)).unwrap();
            // Refresh profile to get updated isContactViewed flag
            dispatch(fetchProfileById(profile.rawId));
        } catch (error) {
            alert(error?.message || error || "Failed to reveal contact. Please try again.");
        }
    };

    // Load a small list of mock profiles (same `type` as the current id) and set the shown profile
    useEffect(() => {
        dispatch(fetchSentRequests());
        dispatch(fetchMyProfile());
    }, [dispatch]);

    useEffect(() => {
        if (currentProfile && id && (currentProfile.id.toString() === id || currentProfile.userId?.toString() === id)) {
            setProfile(mapBackendToLocal(currentProfile));
            setLoading(false);
        }
    }, [currentProfile, id]);

    useEffect(() => {
        if (id && !isNaN(id)) {
            setLoading(true);
            dispatch(fetchProfileById(id));
            dispatch(fetchPreferenceMatch(id));
            dispatch(logProfileView(parseInt(id)));
            return;
        }

        setLoading(true);

        const timer = setTimeout(() => {
            let type = 'today';
            let index = 0;
            if (id) {
                const parts = id.split('-');
                if (parts.length >= 2) {
                    type = parts[0] || 'today';
                    const num = parseInt(parts[1]);
                    if (!isNaN(num)) index = Math.max(0, num - 1);
                }
            }

            // Generate a larger list to cover potential navigation
            const list = generateProfiles(100, type);
            setProfiles(list);

            const fetchedProfile = getProfileById(id);
            setProfile(fetchedProfile || list[index] || list[0]);

            // Adjust index to match the ID
            if (fetchedProfile && list.findIndex(p => p.id === fetchedProfile.id) !== -1) {
                setCurrentIndex(list.findIndex(p => p.id === fetchedProfile.id));
            } else {
                setCurrentIndex(index);
            }

            setLoading(false);

            // Log profile view to backend if id is a numeric ID (real profile)
            if (id && !isNaN(id.split('-')[1])) {
                const numericId = parseInt(id.split('-')[1]);
                dispatch(logProfileView(numericId));
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"
                    />
                </div>

            </div>
        );
    }

    if (!profile) return <div>Profile not found.</div>;

    return (
        <div className="min-h-screen bg-white font-sans text-[#4a4a4a]">
            <Header />

            <MatchesNav />

            <main className="max-w-5xl mx-auto px-4 py-6">
                <p className="text-center text-[15px] mb-6">Here are Today's top Matches for you. Connect with them now!</p>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                    {/* Header Pager */}
                    <div className="flex justify-end items-center gap-4 px-6 py-2 border-b border-gray-100 text-[13px] text-blue-500">
                        <button
                            onClick={() => {
                                const prev = Math.max(0, currentIndex - 1);
                                setCurrentIndex(prev);
                                const nextProfile = profiles[prev];
                                if (nextProfile) {
                                    setProfile(nextProfile);
                                    navigate(`/matches/${nextProfile.rawId}`);
                                }
                            }}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1 hover:underline disabled:opacity-50"
                        >
                            <ArrowLeft className="w-3 h-3" /> Prev
                        </button>

                        <div className="flex gap-2 items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {profile.img ? (
                                    <img src={profile.img} className="w-full h-full object-cover grayscale opacity-50" />
                                ) : (
                                    <User className="w-3 h-3 text-gray-400" />
                                )}
                            </div>
                            <div className="text-sm font-medium">{currentIndex + 1} / {profiles.length}</div>
                        </div>

                        <button
                            onClick={() => {
                                const next = Math.min(profiles.length - 1, currentIndex + 1);
                                setCurrentIndex(next);
                                const nextProfile = profiles[next];
                                if (nextProfile) {
                                    setProfile(nextProfile);
                                    navigate(`/matches/${nextProfile.rawId}`);
                                }
                            }}
                            disabled={currentIndex >= profiles.length - 1}
                            className="flex items-center gap-1 hover:underline disabled:opacity-50"
                        >
                            Next <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                        </button>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row gap-8">
                        {/* Profile Image Column */}
                        <div className="w-full md:w-[300px] flex-shrink-0">
                            <div className="relative group">
                                <div className={`w-full h-auto rounded shadow-sm aspect-[3/4] border-2 bg-gray-50 flex items-center justify-center overflow-hidden ${profile.isPremium ? 'border-amber-400' : 'border-transparent'} ${profile.premiumVisible === false ? 'blur-lg scale-110' : ''}`}>
                                    {profile.img ? (
                                        <img
                                            src={profile.img}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-20 h-20 text-gray-200" />
                                    )}
                                </div>
                                {profile.premiumVisible === false && (
                                    <PremiumLock onViewPlans={() => navigate('/payment')} />
                                )}
                                {profile.isPremium && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-20">
                                        <Star size={10} className="fill-white" />
                                        PREMIUM PLUS
                                    </div>
                                )}
                                {profile.allPhotos && profile.allPhotos.length > 1 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {profile.allPhotos.map((photo, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setProfile({ ...profile, img: photo })}
                                                className={`w-12 h-12 rounded border-2 cursor-pointer transition-all overflow-hidden ${profile.img === photo ? 'border-rose-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            >
                                                <img src={photo} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {profile && sentRequests.some(r => r.receiverId === (profile.userId || profile.id)) ? (
                                    <div className="mt-4 text-[12px] text-pink-600 text-center font-medium bg-pink-50 py-1 rounded">
                                        Invitation sent. {profile.gender === 'male' ? 'He' : 'She'} hasn't viewed it yet.
                                    </div>
                                ) : (
                                    <div className="mt-4 text-[12px] text-gray-400 text-center font-medium py-1">
                                        Interested in {profile?.gender === 'male' ? 'him' : 'her'}? Send a request.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Info Column */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-[22px] font-bold text-gray-800 flex items-center gap-2">
                                        {profile.name} 
                                        {profile.premiumVisible === false ? (
                                            <Lock className="w-4 h-4 text-rose-500 opacity-60" />
                                        ) : profile.isPremium ? (
                                            <div className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-500" /> Premium
                                            </div>
                                        ) : null}
                                        {profile.verificationStatus === 'VERIFIED' && (
                                            <div className="relative group/verify">
                                                <div className="cursor-pointer">
                                                    <BadgeCheck className="w-6 h-6 text-cyan-500 fill-cyan-500 text-white" />
                                                </div>
                                                {/* Verification Tooltip */}
                                                <div className="invisible group-hover/verify:visible absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-[60] animate-in fade-in zoom-in duration-200">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-[#1a1a1a] rotate-45"></div>
                                                    <h4 className="text-sm font-bold mb-3 border-b border-white/10 pb-2">Verified Profile</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-2">
                                                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profile.photoVerificationStatus === 'VERIFIED' ? 'border-green-500' : 'border-gray-600'}`}>
                                                                {profile.photoVerificationStatus === 'VERIFIED' && <Check className="w-2.5 h-2.5 text-green-500" strokeWidth={4} />}
                                                            </div>
                                                            <span className="text-[11px] font-medium leading-tight">Selfie verified with Profile Photo</span>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profile.mobileVerified ? 'border-green-500' : 'border-gray-600'}`}>
                                                                {profile.mobileVerified && <Check className="w-2.5 h-2.5 text-green-500" strokeWidth={4} />}
                                                            </div>
                                                            <span className="text-[11px] font-medium leading-tight">Mobile no. is verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Online</span>
                                    </h1>
                                    <div className="text-[13px] text-green-600 flex items-center gap-1 mt-1">
                                        <Clock className="w-4 h-4" /> Online 14h ago
                                    </div>
                                </div>
                                <div className="flex gap-4 text-[13px] text-rose-500 font-medium relative">
                                    <span className="flex items-center gap-1 cursor-pointer transition-colors hover:text-rose-600">
                                        <Users className="w-4 h-4" /> You & {profile?.gender === 'male' ? 'Him' : 'Her'}
                                    </span>
                                    <span className="flex items-center gap-1 cursor-pointer transition-colors hover:text-rose-600">
                                        <Star className="w-4 h-4" /> {profile?.gender === 'male' ? 'His' : 'Her'} Astra
                                    </span>
                                    <div className="relative" ref={dropdownRef}>
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-400 cursor-pointer transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        />

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-50 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={toggleShortlist}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Star className={`w-[18px] h-[18px] ${isShortlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                                                        <span>{isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            alert("Report functionality coming soon.");
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Flag className="w-[18px] h-[18px] text-gray-500" />
                                                        <span>Report User</span>
                                                    </button>
                                                    <div className="h-px bg-gray-100 my-1.5 mx-2"></div>
                                                    <button
                                                        onClick={() => {
                                                            alert("Block functionality coming soon.");
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Ban className="w-[18px] h-[18px]" />
                                                        <span>Block User</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-[14px]">
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-medium">{profile.age} yrs, {profile.height}, Gemini</span>
                                    <span className="text-gray-900 font-medium">{profile.religion}, {profile.caste}</span>
                                    <span className="text-gray-900 font-medium">{profile.education}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500">{profile.maritalStatus}</span>
                                    <span className="text-gray-500">{profile.location}</span>
                                    <span className="text-gray-500">{profile.profession}</span>
                                    <span className="text-gray-500">{profile.income}</span>
                                </div>
                            </div>

                            {/* Action Buttons Right Side */}
                            <div className="mt-6 flex flex-col gap-2 items-end">
                                <span className="text-[11px] text-gray-500 mb-1">
                                    <button onClick={() => navigate('/payment')} className="text-blue-500 font-bold hover:underline">Upgrade</button> to Contact her directly
                                </span>
                                <button
                                    onClick={() => {
                                        if (profile.isContactViewed) {
                                            if (profile?.phone) window.open(`tel:+${profile.phone}`, '_self');
                                        } else {
                                            handleRevealContact();
                                        }
                                    }}
                                    className="w-[150px] flex items-center justify-center gap-2 py-1.5 border border-blue-500 rounded text-blue-500 hover:bg-blue-50 text-[14px] font-bold transition-all"
                                >
                                    <Phone className="w-4 h-4" /> {profile.isContactViewed ? 'Call' : 'Reveal Contact'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (profile.isContactViewed) {
                                            if (profile?.phone) window.open(`https://wa.me/${profile.phone}`, '_blank');
                                        } else {
                                            handleRevealContact();
                                        }
                                    }}
                                    className="w-[150px] flex items-center justify-center gap-2 py-1.5 border border-green-500 rounded text-green-500 hover:bg-green-50 text-[14px] font-bold transition-all"
                                >
                                    <Phone className="w-4 h-4" /> WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        const receiverId = profile.userId || profile.id;
                                        if (!sentRequests.some(r => r.receiverId === receiverId)) {
                                            dispatch(sendConnectionRequest(receiverId));
                                        }
                                    }}
                                    disabled={sentRequests.some(r => r.receiverId === (profile?.userId || profile?.id))}
                                    className={`w-[150px] flex items-center justify-center gap-2 py-1.5 rounded text-white text-[14px] font-bold transition-all ${sentRequests.some(r => r.receiverId === (profile?.userId || profile?.id)) ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 shadow-md shadow-pink-100'}`}
                                >
                                    {sentRequests.some(r => r.receiverId === (profile?.userId || profile?.id)) ? 'Request Sent' : 'Connect Now'}
                                </button>
                                <button
                                    onClick={() => {
                                        const targetUserId = profile.userId || profile.id;
                                        dispatch(openChatWith({
                                            id: targetUserId,
                                            fullName: profile.name,
                                            profilePhotoUrl: profile.img,
                                            displayNameVisibility: null
                                        }));
                                    }}
                                    className="w-[150px] flex items-center justify-center gap-2 py-1.5 bg-blue-500 rounded text-white hover:bg-blue-600 text-[14px] font-bold"
                                >
                                    <MessageSquare className="w-4 h-4" /> Shaadi Chat
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-gray-100 px-6 flex items-center justify-between">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('detailed')}
                                className={`px-6 py-4 text-[14px] font-bold border-b-2 transition-all
                                    ${activeTab === 'detailed' ? 'border-rose-500 text-rose-500' : 'border-transparent text-gray-500'}`}
                            >
                                Detailed Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`px-6 py-4 text-[14px] font-bold border-b-2 transition-all
                                    ${activeTab === 'preferences' ? 'border-rose-500 text-rose-500' : 'border-transparent text-gray-500'}`}
                            >
                                Partner Preferences
                            </button>
                        </div>
                        <div className="flex gap-4 text-gray-400">
                            <Share2 className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                            <Printer className="w-5 h-5 cursor-pointer hover:text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Tab Content Area */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-8 md:p-12 mb-12">
                    <AnimatePresence mode="wait">
                        {activeTab === 'detailed' ? (
                            <motion.div
                                key="detailed"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-12 max-w-2xl mx-auto"
                            >
                                {/* About Section */}
                                <SectionLayout icon={<Users className="w-6 h-6 text-gray-300" />} title={`About ${profile.name}`}>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-[12px] text-gray-500 border border-gray-200 rounded px-2 py-0.5">
                                            ID: {profile.id} <Copy className="w-3 h-3 hover:text-rose-500 cursor-pointer" />
                                        </div>
                                        <div className="text-[12px] text-gray-500 border border-gray-200 rounded px-2 py-0.5">
                                            Profile Managed by {profile.managedBy}
                                        </div>
                                    </div>
                                    <p className="text-[14px] leading-relaxed text-gray-600">
                                        {profile.about}
                                    </p>
                                </SectionLayout>

                                {/* Contact Details */}
                                <SectionLayout icon={<Phone className="w-6 h-6 text-gray-300" />} title="Contact Details">
                                    <div className="bg-[#fcf8e3] border border-[#faebcc] p-6 rounded relative overflow-hidden group">
                                        <div className={`${profile.isContactViewed ? '' : 'opacity-40 blur-[4px]'} space-y-3 transition-all duration-500`}>
                                            <p className="flex items-center gap-3 text-[14px] font-medium text-[#8a6d3b]">
                                                <Phone className="w-4 h-4 text-[#8a6d3b]" /> Contact Number: {profile.isContactViewed ? (profile.phone || 'N/A') : '+91 7XXXXXXXXX'}
                                            </p>
                                            <p className="flex items-center gap-3 text-[14px] font-medium text-[#8a6d3b]">
                                                <Mail className="w-4 h-4 text-[#8a6d3b]" /> Email ID: {profile.isContactViewed ? (profile.email || 'N/A') : 'XXXXXXXXXX@gmail.com'}
                                            </p>
                                        </div>
                                        {!profile.isContactViewed && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-50/10 backdrop-blur-[1px]">
                                                <button 
                                                    onClick={handleRevealContact}
                                                    className="bg-white px-6 py-2 rounded-full shadow-lg border border-yellow-200 text-[#8a6d3b] font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
                                                >
                                                    <Lock className="w-4 h-4 text-rose-500" />
                                                    Reveal Contact Details
                                                </button>
                                                <p className="text-[11px] mt-2 text-[#8a6d3b] opacity-80">
                                                    (Uses 1 Contact View from your balance)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </SectionLayout>

                                {/* Lifestyle */}
                                <SectionLayout icon={<Book className="w-6 h-6 text-gray-300" />} title="Lifestyle">
                                    <div className="flex gap-4">
                                        <div className="border border-gray-100 rounded p-4 w-[100px] flex flex-col items-center">
                                            <div className="text-green-500 mb-2">
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <span className="text-[12px] font-medium">{profile.diet}</span>
                                        </div>
                                        {profile.smokingHabit && (
                                            <div className="border border-gray-100 rounded p-4 w-[100px] flex flex-col items-center">
                                                <span className="text-[12px] text-gray-400 mb-1">Smoking</span>
                                                <span className="text-[14px] font-medium">{profile.smokingHabit}</span>
                                            </div>
                                        )}
                                        {profile.drinkingHabit && (
                                            <div className="border border-gray-100 rounded p-4 w-[100px] flex flex-col items-center">
                                                <span className="text-[12px] text-gray-400 mb-1">Drinking</span>
                                                <span className="text-[14px] font-medium">{profile.drinkingHabit}</span>
                                            </div>
                                        )}
                                    </div>
                                </SectionLayout>

                                {/* Background */}
                                <SectionLayout icon={<Home className="w-6 h-6 text-gray-300" />} title="Background">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2 text-gray-500">Religion/Mother Tongue</p>
                                            <p className="font-medium">{profile.religion}, {profile.motherTongue}</p>

                                            <p className="flex items-center gap-2 text-gray-500 mt-4">Community/Caste</p>
                                            <p className="font-medium">{profile.caste}{profile.subCaste ? `, ${profile.subCaste}` : ''}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2 text-gray-500">Gotra/Manglik Status</p>
                                            <p className="font-medium">{profile.gotra || 'Not Specified'}, {profile.manglikStatus}</p>

                                            <p className="flex items-center gap-2 text-gray-500 mt-4">Location</p>
                                            <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> Lives in {profile.location}</p>
                                        </div>
                                    </div>
                                </SectionLayout>

                                {/* Horoscope Details */}
                                <SectionLayout icon={<Info className="w-6 h-6 text-gray-300" />} title="Horoscope Details">
                                    {profile.horoscope && (profile.horoscope.rashi || profile.horoscope.nakshatra) ? (
                                        <div className="grid grid-cols-2 gap-4 text-[14px]">
                                            <div>
                                                <p className="text-gray-500">Rashi/Nakshatra</p>
                                                <p className="font-medium">{profile.horoscope.rashi || 'Not Specified'}, {profile.horoscope.nakshatra || 'Not Specified'}</p>
                                                <p className="text-gray-500 mt-4">Time of Birth</p>
                                                <p className="font-medium">{profile.horoscope.timeOfBirth || 'Not Specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Place of Birth</p>
                                                <p className="font-medium">{profile.horoscope.placeOfBirth || 'Not Specified'}</p>
                                                <p className="text-gray-500 mt-4">Date of Birth</p>
                                                <p className="font-medium">{profile.horoscope.dateOfBirth?.split('T')[0] || 'Not Specified'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#fff9e6] border border-[#ffe082] border-dashed rounded-lg p-10 flex flex-col items-center text-center">
                                            <div className="text-amber-200 mb-3">
                                                <ExternalLink className="w-12 h-12" />
                                            </div>
                                            <p className="text-[13px] text-gray-600 mb-2">For the common interest of members, quickly enter your horoscope details and better info.</p>
                                            <button className="text-blue-500 font-bold text-[13px] hover:underline" onClick={() => navigate('/my-profile')}>Add My Details »</button>
                                        </div>
                                    )}
                                </SectionLayout>

                                {/* Family Details */}
                                <SectionLayout icon={<Home className="w-6 h-6 text-gray-300" />} title="Family Details">
                                    {profile.family && (profile.family.fatherStatus || profile.family.motherStatus) ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-gray-500">Father's Status</p>
                                                    <p className="font-medium">{profile.family.fatherStatus}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Mother's Status</p>
                                                    <p className="font-medium">{profile.family.motherStatus}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-gray-500">Siblings</p>
                                                    <p className="font-medium">{profile.family.brothersCount || 0} Brother(s), {profile.family.sistersCount || 0} Sister(s)</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Financial Status</p>
                                                    <p className="font-medium">{profile.family.familyFinancialStatus || 'Not Specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#fff9e6] border border-[#ffe082] border-dashed rounded-lg p-10 flex flex-col items-center text-center">
                                            <div className="text-amber-200 mb-3">
                                                <Home className="w-12 h-12" />
                                            </div>
                                            <p className="text-[13px] text-gray-600 mb-2">Add details to unlock her family details instantly.</p>
                                            <button className="text-blue-500 font-bold text-[13px] hover:underline" onClick={() => navigate('/my-profile')}>Add Family Details »</button>
                                        </div>
                                    )}
                                </SectionLayout>

                                {/* Education & Career */}
                                <SectionLayout icon={<GraduationCap className="w-6 h-6 text-gray-300" />} title="Education & Career">
                                    <div className="space-y-4 text-[14px]">
                                        <p className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-blue-500" /> {profile.education}{profile.educationField ? ` - ${profile.educationField}` : ''}</p>
                                        {profile.college && <p className="flex items-center gap-3"><Home className="w-4 h-4 text-blue-500" /> {profile.college}</p>}
                                        <p className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-blue-500" /> {profile.profession}</p>
                                        <p className="flex items-start gap-3">
                                            <span className="bg-green-100 text-green-600 p-0.5 rounded mt-0.5"><Lock className="w-3 h-3" /></span>
                                            <span>
                                                <span className="font-bold">Annual Income:</span> {profile.income}
                                            </span>
                                        </p>
                                    </div>
                                </SectionLayout>

                                {/* What She Is Looking For */}
                                <SectionLayout icon={<HeartHandshake className="w-6 h-6 text-gray-300" />} title={`What ${profile.gender === 'male' ? 'He' : 'She'} Is Looking For`}>
                                    {preferenceMatch ? (
                                        <>
                                            <div className="flex flex-col items-center mb-8">
                                                <div className="flex items-center gap-10 md:gap-20">
                                                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                        {profile.image ? (
                                                            <img src={profile.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-8 h-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="relative border-b border-dashed border-gray-300 px-4 md:px-8 pb-1">
                                                        <span className="text-[11px] md:text-[12px] bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                                            {`You match ${preferenceMatch.matchedCount}/${preferenceMatch.totalPreferences} of ${profile.gender === 'male' ? 'his' : 'her'} Preferences`}
                                                        </span>
                                                    </div>
                                                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                        {myProfile?.profilePhotoUrl ? (
                                                            <img src={myProfile.profilePhotoUrl} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-8 h-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between w-full mt-2 text-[12px] font-bold text-gray-500 px-8">
                                                    <span>{profile.gender === 'male' ? 'His' : 'Her'} Preferences</span>
                                                    <span>You match</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 px-4">
                                                {preferenceMatch.matchList.map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center text-[13px] border-b border-gray-50 pb-2">
                                                        <div className="w-[200px]">
                                                            <span className="text-pink-400 block text-[11px] font-bold tracking-tight uppercase mb-0.5">{item.fieldLabel}</span>
                                                            <span className="text-gray-700 font-medium leading-tight">{item.prefValue}</span>
                                                        </div>
                                                        <div className="pr-2">
                                                            {item.isMatch ? (
                                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-300 font-light text-lg pr-1">—</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">
                                            Partner preferences not specified or loading...
                                        </div>
                                    )}
                                </SectionLayout>

                                <div className="text-center pt-8">
                                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-blue-500 text-[13px] font-bold hover:underline">
                                        Back to Top ↑
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* Preferences Tab */
                            <motion.div
                                key="preferences"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="max-w-2xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-[20px] font-bold text-gray-800">{profile.gender === 'male' ? 'His' : 'Her'} Partner Preferences</h2>
                                    <p className="text-[14px] text-gray-500">Matches are based on the criteria below.</p>
                                </div>

                                <div className="space-y-4">
                                    {preferenceMatch ? (
                                        preferenceMatch.matchList.map((pref, i) => (
                                            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                                                <div className="w-1/3 text-[14px] font-medium text-gray-500">{pref.fieldLabel}</div>
                                                <div className="w-1/2 text-[14px] font-bold text-gray-800">{pref.prefValue}</div>
                                                <div className="ml-auto">
                                                    {pref.isMatch ? (
                                                        <CheckCircle className="w-5 h-5 fill-green-500 text-white" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border border-gray-200"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">Loading preferences match...</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
};

// Internal Layout Component for Sections
const SectionLayout = ({ icon, title, children }) => (
    <div className="relative pl-12">
        <div className="absolute left-0 top-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white z-10">
            {icon}
        </div>
        <div className="absolute left-5 top-10 bottom-[-48px] w-px bg-gray-100 z-0"></div>
        <h3 className="text-[18px] font-normal text-rose-500 mb-6 flex items-center gap-4">
            {title}
            <div className="h-px bg-gray-100 flex-1"></div>
        </h3>
        <div>{children}</div>
    </div>
);

export default MatchProfileDetails;
