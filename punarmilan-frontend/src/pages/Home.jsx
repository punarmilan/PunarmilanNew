import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiHeart, HiStar, HiUserGroup, HiCheckCircle, HiShieldCheck, HiSparkles, HiCash, HiBadgeCheck, HiLightningBolt, HiShieldExclamation, HiSearch, HiChat, HiPencilAlt } from 'react-icons/hi'
import Login from "../components/Login"
import Register from "../components/Register"
import { HiX, HiArrowLeft } from "react-icons/hi"
import heroImg from '../assets/image/hero_new.png'

function Home() {
    const navigate = useNavigate()
    const { user, token } = useSelector(state => state.user)
    const isLoggedIn = !!token

    /* ---------------- MODAL STATES ---------------- */
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showMatchModal, setShowMatchModal] = useState(false)

    /* ---------------- STEP CONTROL ---------------- */
    const [step, setStep] = useState(1)

    /* ---------------- ONBOARDING DATA (TEMP) ---------------- */
    const [formData, setFormData] = useState({
        profileFor: "Myself",
        gender: "Male",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "",
        religion: "Hindu",
        community: "Hindi",
        country: "India",
    })

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (e) => {
        const { name, value } = e.target

        // For names, only allow alphabets and spaces
        if ((name === "firstName" || name === "lastName") && value && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const openMatchModal = () => {
        setShowLogin(false)
        setShowRegister(false)
        setStep(1)
        setShowMatchModal(true)
    }

    const closeMatchModal = () => {
        setShowMatchModal(false)
        setStep(1)
    }

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            // AFTER STEP 3 → OPEN REGISTER
            setShowMatchModal(false)
            setShowRegister(true)
        }
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }




    const stats = [
        { icon: <HiUserGroup className="w-6 h-6" />, value: '50 Lakh+', label: 'Active Profiles' },
        { icon: <HiStar className="w-6 h-6" />, value: '4.8', label: 'User Ratings' },
        { icon: <HiCheckCircle className="w-6 h-6" />, value: '7 Lakh+', label: 'Success Stories' }
    ]

    return (
        <div className="min-h-screen">


            {showLogin && (
                <Login
                    close={() => setShowLogin(false)}
                    openRegister={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                    }}
                />
            )}

            {/* ================= REGISTER POPUP ================= */}
            {showRegister && (
                <Register
                    close={() => setShowRegister(false)}
                    openLogin={() => {
                        setShowRegister(false)
                        setShowLogin(true)
                    }}
                />
            )}

            {/* ================= MATCH STEPS POPUP ================= */}

            {/* ================= MATCH STEPS POPUP ================= */}
            {showMatchModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white text-black w-full max-w-lg rounded-2xl p-6 relative">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            {step > 1 ? (
                                <button onClick={prevStep}>
                                    <HiArrowLeft className="w-6 h-6" />
                                </button>
                            ) : <div />}

                            <button onClick={closeMatchModal}>
                                <HiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* ---------- STEP 1 ---------- */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">This Profile is for</h2>

                                <div className="grid grid-cols-2 gap-3">
                                    {["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative"].map(item => (
                                        <button
                                            key={item}
                                            onClick={() => setFormData({ ...formData, profileFor: item })}
                                            className={`border rounded-full py-2 ${formData.profileFor === item
                                                ? "bg-cyan-500 text-white"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>

                                <h3 className="font-bold">Gender</h3>
                                <div className="flex gap-4">
                                    {["Male", "Female"].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`px-6 py-2 rounded-full border ${formData.gender === g
                                                ? "bg-cyan-500 text-white"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* ---------- STEP 2 ---------- */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Your Name</h2>

                                <input
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                />

                                <input
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                />

                                <h3 className="font-bold">Date of Birth</h3>
                                <div className="flex gap-2">
                                    <input
                                        name="day"
                                        placeholder="DD"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                    <input
                                        name="month"
                                        placeholder="MM"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                    <input
                                        name="year"
                                        placeholder="YYYY"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="border p-2 w-full text-center"
                                    />
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* ---------- STEP 3 ---------- */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Your Religion</h2>

                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>Hindu</option>
                                    <option>Muslim</option>
                                    <option>Christian</option>
                                </select>

                                <h3 className="font-bold">Community</h3>
                                <select
                                    name="community"
                                    value={formData.community}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>

                                <h3 className="font-bold">Living in</h3>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded"
                                >
                                    <option>India</option>
                                    <option>USA</option>
                                </select>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-cyan-500 text-white py-3 rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
            {/* Hero Section with Background Image */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt="Happy Couple"
                        className="w-full h-full object-cover object-[center_25%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70"></div>
                </div>

                {/* Top Navigation Buttons */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex gap-2 sm:gap-3 animate-fadeIn">
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base tracking-wide"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base tracking-wide"
                            >
                                Join Free
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/my-shadi"
                            className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base tracking-wide"
                        >
                            My Profile
                        </Link>
                    )}
                </div>

                {/* Center Hero Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="text-center w-full max-w-5xl">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white mb-4 animate-fadeIn flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                            Find your forever
                            <HiHeart className="text-[#f44336] animate-pulse shrink-0" />
                        </h1>

                        <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-10 animate-fadeIn stagger-1 font-medium italic">
                            Discover a world beyond matrimony
                        </p>

                        <div className="animate-fadeIn stagger-2">
                            <button
                                onClick={openMatchModal}
                                className="inline-block px-10 sm:px-14 py-3 sm:py-5 bg-[#00bcd4] hover:bg-[#00acc1] text-white text-lg sm:text-xl font-bold rounded-full shadow-[0_10px_30px_rgba(0,188,212,0.4)] transition-all duration-300 hover:scale-105 transform tracking-wider"
                            >
                                Find Your Match
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Statistics Bar - Matching Image 2 */}
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-t border-white/10 py-3 sm:py-4">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-14 md:gap-20 text-white">
                            <div className="flex items-center gap-3">
                                <HiUserGroup className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg sm:text-xl font-bold">50 Lakh+</span>
                                    <span className="text-xs sm:text-sm text-white/70 font-medium">Members</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg sm:text-xl font-bold">7 Lakh+</span>
                                    <span className="text-xs sm:text-sm text-white/70 font-medium">Success Stories</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <HiStar className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg sm:text-xl font-bold">4.8</span>
                                    <span className="text-xs sm:text-sm text-white/70 font-medium tracking-tight">Avg Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-tagline from Image 1 can be optionally added below the bar or as a thin line inside */}
                {/* For now, keeping it clean as per Image 2's structure which looks more "proper" */}
            </section>

            {/* The PunarMilan Experience Section */}
            <section className="py-20 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Title */}
                    <div className="text-center mb-16 sm:mb-20 animate-fadeIn">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a2b4b] mb-4">
                            The PunarMilan Experience
                        </h2>
                    </div>

                    {/* Three Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
                        {/* Card 1 - Money Back Guarantee */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-all duration-500 group animate-fadeIn border border-gray-100 flex flex-col items-center h-full">
                            <div className="w-24 h-24 bg-[#f0fdff] rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                                <HiCash className="w-12 h-12 text-[#00bcd4]" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-[900] text-[#1a2b4b] mb-6 text-center leading-[1.2] min-h-[4rem] flex items-center justify-center">
                                30 Day Money Back Guarantee
                            </h3>
                            <p className="text-gray-500 text-center leading-relaxed text-lg flex-grow">
                                Get matched with someone special within 30 days, or we'll refund your money—guaranteed!
                            </p>
                        </div>

                        {/* Card 2 - Blue Tick */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-all duration-500 group animate-fadeIn stagger-1 border border-gray-100 flex flex-col items-center h-full">
                            <div className="w-24 h-24 bg-[#f0fdff] rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                                <HiBadgeCheck className="w-12 h-12 text-[#00bcd4]" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-[900] text-[#1a2b4b] mb-6 text-center leading-[1.2] min-h-[4rem] flex items-center justify-center">
                                Blue Tick to find your Green Flag
                            </h3>
                            <p className="text-gray-500 text-center leading-relaxed text-lg flex-grow">
                                Did you know our blue-tick profiles get 40% more connection requests than others?
                            </p>
                        </div>

                        {/* Card 3 - AI Matchmaking */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-all duration-500 group animate-fadeIn stagger-2 border border-gray-100 flex flex-col items-center h-full">
                            <div className="w-24 h-24 bg-[#f0fdff] rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                                <HiLightningBolt className="w-12 h-12 text-[#00bcd4]" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-[900] text-[#1a2b4b] mb-6 text-center leading-[1.2] min-h-[4rem] flex items-center justify-center">
                                Matchmaking Powered by AI
                            </h3>
                            <p className="text-gray-500 text-center leading-relaxed text-lg flex-grow">
                                Cutting-edge technology with two decades of matchmaking expertise to help you find "the one".
                            </p>
                        </div>
                    </div>                    {/* VIP PunarMilan Banner */}
                    <div className="bg-gradient-to-r from-[#fdf4ff] via-[#fff1f2] to-[#fdf4ff] rounded-[2.5rem] p-10 sm:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#fae8ff] animate-fadeIn stagger-3">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                            {/* Left Side - VIP PunarMilan Logo/Text */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center justify-center mb-6">
                                    <div className="text-[#7e57c2]">
                                        <svg className="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-lg" viewBox="0 0 100 100" fill="currentColor">
                                            <path d="M50 10 L65 40 L95 45 L72.5 67 L78 97 L50 82 L22 97 L27.5 67 L5 45 L35 40 Z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4a148c] mb-2 tracking-tight">
                                    VIP PUNARMILAN
                                </h3>
                                <p className="text-base sm:text-lg text-[#7b1fa2] font-black uppercase tracking-widest">
                                    NO.1 MATCHMAKING SERVICE FOR ELITES
                                </p>
                            </div>

                            {/* Right Side - Content & Button */}
                            <div className="flex-1 text-center lg:text-left">
                                <p className="text-xl sm:text-2xl lg:text-3xl text-[#1a2b4b] font-medium mb-10 leading-relaxed">
                                    Experience the world of elite personalised matchmaking by PunarMilan.com
                                </p>
                                <Link
                                    to="/vip-service"
                                    className="inline-block px-12 py-5 bg-[#7e57c2] hover:bg-[#673ab7] text-white text-xl font-black rounded-full shadow-[0_15px_40px_rgba(126,87,194,0.3)] transition-all duration-300 hover:scale-105"
                                >
                                    Free Consultation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 sm:py-24 bg-[#f8f9ff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 sm:mb-20 animate-fadeIn">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a2b4b] mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-500 font-medium italic">
                            India's most trusted matrimony platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { icon: <HiShieldCheck className="w-10 h-10 text-[#fbc02d]" />, title: 'Safe & Secure', desc: 'Verified profiles with complete privacy protection' },
                            { icon: <HiHeart className="w-10 h-10 text-[#e91e63]" />, title: 'Perfect Match', desc: 'Advanced matching based on your preferences' },
                            { icon: <HiChat className="w-10 h-10 text-[#7e57c2]" />, title: 'Easy Connect', desc: 'Chat and connect with potential matches instantly' },
                            { icon: <HiStar className="w-10 h-10 text-[#f9a825]" />, title: 'Trusted Service', desc: "India's most trusted matrimony platform" }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-500 text-center group border border-gray-50 flex flex-col items-center animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-[#1a2b4b] mb-4 leading-tight">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-base">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 sm:mb-24 animate-fadeIn">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a2b4b] mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-500 font-medium italic">
                            Find your life partner in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {[
                            { step: '1', title: 'Create Profile', desc: 'Register for free and create your detailed matrimony profile with photos', icon: <HiPencilAlt className="w-12 h-12 text-[#ff7043]" /> },
                            { step: '2', title: 'Search Matches', desc: 'Browse thousands of verified profiles matching your preferences', icon: <HiSearch className="w-12 h-12 text-[#00bcd4]" /> },
                            { step: '3', title: 'Connect & Marry', desc: 'Connect with matches, chat, meet and find your perfect life partner', icon: <HiHeart className="w-12 h-12 text-[#e91e63]" /> }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.1)] transition-all duration-500 group animate-fadeIn border border-gray-50 flex flex-col items-center"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                                    <div className="w-14 h-14 bg-[#7e57c2] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl border-4 border-white">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="mb-10 mt-6 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-[#1a2b4b] mb-4 text-center">{item.title}</h3>
                                <p className="text-gray-500 text-center leading-relaxed text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Preview */}
            <section className="py-20 sm:py-24 bg-[#fcfdff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 sm:mb-20 animate-fadeIn">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a2b4b] mb-4">
                            Success Stories
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-500 font-medium italic">
                            Thousands of couples found their perfect match with us
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                        {[
                            { names: 'Rahul & Priya', location: 'Mumbai', story: 'Found each other through our platform and got married in December 2025. Forever grateful!', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop' },
                            { names: 'Amit & Sneha', location: 'Delhi', story: 'Perfect match made in heaven. Thank you for helping us find our soulmates!', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop' },
                            { names: 'Vikram & Anjali', location: 'Bangalore', story: 'We connected instantly and knew we were meant for each other. Best decision ever!', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=600&fit=crop' }
                        ].map((story, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-500 animate-fadeIn border border-gray-50 group h-full"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative h-64 sm:h-72 overflow-hidden">
                                    <img src={story.image} alt={story.names} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <h3 className="text-2xl font-black mb-1">{story.names}</h3>
                                        <p className="text-sm flex items-center text-white/90 font-medium">
                                            <HiSparkles className="w-4 h-4 mr-2 text-yellow-400" />
                                            {story.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-gray-600 italic leading-relaxed text-lg">"{story.story}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-[#1a2b4b]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e91e63]/20 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                        Your happy ever after <br className="hidden sm:block" />
                        starts right here.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fadeIn stagger-2">
                        <button
                            onClick={() => setShowRegister(true)}
                            className="px-12 py-5 bg-[#e91e63] hover:bg-[#d81b60] text-white text-xl font-black rounded-full shadow-[0_15px_40px_rgba(233,30,99,0.3)] transition-all duration-300 hover:scale-105"
                        >
                            Get Started Free
                        </button>
                        <p className="text-white/70 text-lg font-medium">
                            Join over <span className="text-white font-black">5 Million</span> members today
                        </p>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home
