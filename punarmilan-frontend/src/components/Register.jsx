import React, { useState } from "react";
import { X, Eye, EyeOff, Phone, Mail, Lock, AlertCircle, CheckCircle, Heart, Send, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { register } from "../Slice/UserSlice";


function Register({ close, openLogin }) {
    const [user, setUser] = useState({
        mobileNumber: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        profileCreatedBy: "",
        gender: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isCreatedByOpen, setIsCreatedByOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error: reduxError } = useSelector((state) => state.user);

    // Validation functions
    const validateMobile = (mobile) => {
        if (!mobile) return "Mobile number is required";
        if (!/^[0-9]{10}$/.test(mobile)) return "Enter valid 10-digit mobile number";
        return "";
    };

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Enter valid email address";
        
        // Check for uppercase letters
        if (/[A-Z]/.test(email)) {
            console.log("Validation error (Register): Uppercase letters found:", email);
            return "Please use smallcase only";
        }
        
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        if (!/(?=.*[a-z])/.test(password)) return "Password must contain lowercase letter";
        if (!/(?=.*[A-Z])/.test(password)) return "Password must contain uppercase letter";
        if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
        return "";
    };

    const validateConfirmPassword = (confirm) => {
        if (!confirm) return "Please confirm password";
        if (confirm !== user.password) return "Passwords do not match";
        return "";
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/(?=.*[a-z])/.test(password)) strength += 15;
        if (/(?=.*[A-Z])/.test(password)) strength += 15;
        if (/(?=.*\d)/.test(password)) strength += 10;
        if (/(?=.*[@$!%*?&#])/.test(password)) strength += 10;

        if (strength <= 30) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 60) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 85) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(user.password);

    // Handle input change
    function handleChange(e) {
        const { name, value } = e.target;

        // For mobile number, only allow digits
        if (name === "mobileNumber" && value && !/^\d*$/.test(value)) {
            return;
        }

        setUser({ ...user, [name]: value });

        // Clear error when user starts typing
        if (touched[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    }

    // Handle blur to show validation errors
    function handleBlur(field) {
        setTouched({ ...touched, [field]: true });

        let error = "";
        if (field === "mobileNumber") {
            error = validateMobile(user.mobileNumber);
        } else if (field === "email") {
            error = validateEmail(user.email);
        } else if (field === "password") {
            error = validatePassword(user.password);
        } else if (field === "confirmPassword") {
            error = validateConfirmPassword(confirmPassword);
        } else if (field === "firstName") {
            error = validateName(user.firstName, "First name");
        } else if (field === "lastName") {
            error = validateName(user.lastName, "Last name");
        } else if (field === "profileCreatedBy") {
            error = validateCreatedBy(user.profileCreatedBy);
        } else if (field === "gender") {
            error = validateGender(user.gender);
        }

        setErrors({ ...errors, [field]: error });
    }

    const validateName = (name, label) => {
        if (!name) return `${label} is required`;
        if (name.length < 2) return `${label} must be at least 2 characters`;
        return "";
    };

    const validateCreatedBy = (value) => {
        if (!value) return "Please select who is creating this profile";
        return "";
    };

    const validateGender = (value) => {
        if (!value) return "Please select your gender";
        return "";
    };

    // Form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const mobileError = validateMobile(user.mobileNumber);
        const emailError = validateEmail(user.email);
        const passwordError = validatePassword(user.password);
        const confirmError = validateConfirmPassword(confirmPassword);
        const firstNameError = validateName(user.firstName, "First name");
        const lastNameError = validateName(user.lastName, "Last name");
        const createdByError = validateCreatedBy(user.profileCreatedBy);
        const genderError = validateGender(user.gender);

        if (mobileError || emailError || passwordError || confirmError || firstNameError || lastNameError || createdByError || genderError) {
            setErrors({
                mobileNumber: mobileError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmError,
                firstName: firstNameError,
                lastName: lastNameError,
                profileCreatedBy: createdByError,
                gender: genderError
            });
            setTouched({
                mobileNumber: true,
                email: true,
                password: true,
                confirmPassword: true,
                firstName: true,
                lastName: true,
                profileCreatedBy: true,
                gender: true
            });
            toast.error("Please fix the errors in the form");
            return;
        }

        if (!acceptedTerms) {
            toast.error("Please accept terms and conditions");
            return;
        }

        try {
            const resultAction = await dispatch(register(user));
            if (register.fulfilled.match(resultAction)) {
                toast.success("Registration successful! Welcome to Punarmilan. 🎉");
                setShowVerificationModal(false);
                close();
                navigate("/my-shadi");
            } else {
                toast.error(resultAction.payload || "Registration failed");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        }
    }

    // Click outside to close
    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            if (close) {
                close();
            } else {
                navigate("/");
            }
        }
    }

    const onInternalClose = (e) => {
        if (e) e.stopPropagation();
        if (close) {
            close();
        } else {
            navigate("/");
        }
    };

    if (showVerificationModal) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
                onClick={handleBackdropClick}
            >
                <div className="relative w-full max-w-md animate-slideUp bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <Mail className="w-10 h-10 text-emerald-600" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                        <p className="text-gray-600">
                            We've sent a verification link to <br />
                            <span className="font-semibold text-emerald-600">{user.email}</span>
                        </p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-800 leading-relaxed">
                        Please check your inbox (and spam folder) and click the verification link to complete your registration.
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                close();
                                if (openLogin) openLogin();
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
                        >
                            I've Verified, Continue to Login
                        </button>
                        <button
                            onClick={() => setShowVerificationModal(false)}
                            className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-colors"
                        >
                            Back to Registration
                        </button>
                    </div>

                    <p className="text-xs text-gray-400">
                        Registration will only be complete once your email is verified.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-[95%] sm:max-w-md md:max-w-lg my-4 sm:my-8 animate-slideUp">
                {/* Glow Effect - Hidden on mobile for performance */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl blur-xl opacity-30 animate-pulse" />

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-gradient-to-br from-emerald-600 via-cyan-600 to-teal-600 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
                        {/* Close Button */}
                        <button
                            onClick={onInternalClose}
                            className="absolute right-3 top-3 sm:right-4 sm:top-4 text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 p-1 hover:bg-white/10 rounded-full"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Header Content */}
                        <div className="relative">
                            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300 animate-pulse" />
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Create Account</h2>
                            </div>
                            <p className="text-white/90 text-xs sm:text-sm">Join thousands finding their perfect match</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 bg-white max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">

                        {/* Profile Created By */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Profile Created By</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className={`w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.profileCreatedBy && touched.profileCreatedBy
                                        ? "border-red-500 focus:ring-red-400"
                                        : user.profileCreatedBy
                                            ? "border-green-500"
                                            : "border-gray-200"
                                        } rounded-lg sm:rounded-xl cursor-pointer flex items-center bg-white transition-all`}
                                    onClick={() => setIsCreatedByOpen(!isCreatedByOpen)}
                                >
                                    <Send className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 rotate-[-45deg]" />
                                    <span className={user.profileCreatedBy ? "text-gray-900" : "text-gray-400"}>
                                        {user.profileCreatedBy || "Select Option"}
                                    </span>
                                    <ChevronDown className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isCreatedByOpen ? "rotate-180" : ""}`} />
                                </div>

                                {isCreatedByOpen && (
                                    <div className="absolute z-30 w-full mt-1 bg-white border-2 border-gray-100 rounded-xl shadow-xl py-1 animate-slideDown overflow-hidden">
                                        {["Self", "Parent", "Sibling", "Friend", "Relative", "Other"].map((option) => (
                                            <div
                                                key={option}
                                                className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer text-sm sm:text-base text-gray-700 transition-colors"
                                                onClick={() => {
                                                    setUser({ ...user, profileCreatedBy: option });
                                                    setErrors({ ...errors, profileCreatedBy: "" });
                                                    setIsCreatedByOpen(false);
                                                }}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.profileCreatedBy && touched.profileCreatedBy && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.profileCreatedBy}</span>
                                </div>
                            )}
                        </div>

                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>First Name</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("firstName")}
                                        className={`w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.firstName && touched.firstName
                                            ? "border-red-500 focus:ring-red-400"
                                            : user.firstName
                                                ? "border-green-500"
                                                : "border-gray-200"
                                            } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                    />
                                </div>
                                {errors.firstName && touched.firstName && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.firstName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                    <span>Last Name</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("lastName")}
                                        className={`w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.lastName && touched.lastName
                                            ? "border-red-500 focus:ring-red-400"
                                            : user.lastName
                                                ? "border-green-500"
                                                : "border-gray-200"
                                            } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                    />
                                </div>
                                {errors.lastName && touched.lastName && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{errors.lastName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Gender</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUser({ ...user, gender: "Male" });
                                        setErrors({ ...errors, gender: "" });
                                    }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${user.gender === "Male"
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-md"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${user.gender === "Male" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                                        {user.gender === "Male" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                    </div>
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUser({ ...user, gender: "Female" });
                                        setErrors({ ...errors, gender: "" });
                                    }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${user.gender === "Female"
                                            ? "border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-md"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${user.gender === "Female" ? "border-pink-500 bg-pink-500" : "border-gray-300"}`}>
                                        {user.gender === "Female" && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                    </div>
                                    Female
                                </button>
                            </div>
                            {errors.gender && touched.gender && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.gender}</span>
                                </div>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Mobile Number</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    placeholder="Enter 10-digit mobile"
                                    value={user.mobileNumber}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("mobileNumber")}
                                    maxLength="10"
                                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.mobileNumber && touched.mobileNumber
                                        ? "border-red-500 focus:ring-red-400"
                                        : user.mobileNumber.length === 10
                                            ? "border-green-500 focus:ring-green-400"
                                            : "border-gray-200 focus:ring-emerald-400"
                                        } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                />
                            </div>
                            {errors.mobileNumber && touched.mobileNumber ? (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.mobileNumber}</span>
                                </div>
                            ) : user.mobileNumber.length === 10 ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Valid mobile number</span>
                                </div>
                            ) : null}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Email Address</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={user.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.email && touched.email
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-200 focus:ring-emerald-400"
                                        } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                />
                            </div>
                            {errors.email && touched.email && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Password</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create password"
                                    value={user.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("password")}
                                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.password && touched.password
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-200 focus:ring-emerald-400"
                                        } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {user.password && (
                                <div className="space-y-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                        <div
                                            className={`${passwordStrength.color} h-full rounded-full transition-all duration-300`}
                                            style={{ width: `${passwordStrength.strength}%` }}
                                        />
                                    </div>
                                    <p className={`text-xs sm:text-sm font-medium ${passwordStrength.color === 'bg-red-500' ? 'text-red-500' :
                                        passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                                            passwordStrength.color === 'bg-blue-500' ? 'text-blue-600' :
                                                'text-green-600'
                                        }`}>
                                        Password strength: {passwordStrength.label}
                                    </p>
                                </div>
                            )}

                            {errors.password && touched.password && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-1">
                                <span>Confirm Password</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (touched.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: "" });
                                        }
                                    }}
                                    onBlur={() => handleBlur("confirmPassword")}
                                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 ${errors.confirmPassword && touched.confirmPassword
                                        ? "border-red-500 focus:ring-red-400"
                                        : confirmPassword && user.password === confirmPassword
                                            ? "border-green-500 focus:ring-green-400"
                                            : "border-gray-200 focus:ring-emerald-400"
                                        } rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all bg-white`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword ? (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.confirmPassword}</span>
                                </div>
                            ) : confirmPassword && user.password === confirmPassword ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Passwords match</span>
                                </div>
                            ) : null}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-2 sm:space-x-3 bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-100">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-0.5 sm:mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 cursor-pointer">
                                I agree to the{" "}
                                <button type="button" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                                    Terms & Conditions
                                </button>{" "}
                                and{" "}
                                <button type="button" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                                    Privacy Policy
                                </button>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 hover:from-emerald-700 hover:via-cyan-700 hover:to-teal-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <button
                            type="button"
                            onClick={openLogin}
                            className="w-full py-3 sm:py-3.5 border-2 border-emerald-200 text-emerald-600 rounded-lg sm:rounded-xl font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                        >
                            Sign In to Existing Account
                        </button>
                    </form>

                    {/* Footer Trust Badge */}
                    <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 bg-gradient-to-b from-white to-gray-50">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                <span>Secure</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                <span>Verified</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                                <span>7L+ Matches</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
                
                /* Responsive adjustments */
                @media (max-width: 640px) {
                    .animate-slideUp {
                        animation: slideUp 0.3s ease-out;
                    }
                }
                
                /* Custom scrollbar for form */
                form::-webkit-scrollbar {
                    width: 6px;
                }
                form::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                form::-webkit-scrollbar-thumb {
                    background: #10b981;
                    border-radius: 10px;
                }
                form::-webkit-scrollbar-thumb:hover {
                    background: #059669;
                }
            `}</style>

        </div>
    );
}

export default Register;
