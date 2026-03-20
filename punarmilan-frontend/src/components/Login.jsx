import React, { useState } from "react";
import { X, Eye, EyeOff, Info, Mail, Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, clearError } from "../Slice/UserSlice";

function Login({ close, openRegister }) {
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(true);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error: reduxError } = useSelector((state) => state.user);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!email) return "Email or Mobile number is required";
        if (!emailRegex.test(email) && !phoneRegex.test(email)) {
            return "Enter valid email or 10-digit mobile number";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    // Handle input change with validation
    function handleChange(e) {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        // Clear local error when user starts typing
        if (touched[name]) {
            setErrors({ ...errors, [name]: "" });
        }

        // Clear global redux error on type
        if (reduxError) {
            dispatch(clearError());
        }
    }

    // Handle blur to show validation errors
    function handleBlur(field) {
        setTouched({ ...touched, [field]: true });

        let error = "";
        if (field === "email") {
            error = validateEmail(user.email);
        } else if (field === "password") {
            error = validatePassword(user.password);
        }

        setErrors({ ...errors, [field]: error });
    }

    // Form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const emailError = validateEmail(user.email);
        const passwordError = validatePassword(user.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            setTouched({ email: true, password: true });

            // Show toast for validation errors
            if (emailError) toast.error(emailError);
            else if (passwordError) toast.error(passwordError);

            return;
        }

        try {
            const resultAction = await dispatch(login(user));
            if (login.fulfilled.match(resultAction)) {
                toast.success("Login successful! 🎉");
                // Navigate first, then reload to ensure state is completely fresh for the new user session
                navigate('/my-shadi');
                close();
                // Short delay to let toast show, then hard reload to ensure all app state is fresh
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // If it fails, the error is in reduxError, but since we await, we can also see payload
                const errorMessage = resultAction.payload || "Login failed";

                // Specific handling for common auth errors if backend returns them
                if (errorMessage.toLowerCase().includes("not found")) {
                    toast.error("User not found. Please register first.");
                } else if (errorMessage.toLowerCase().includes("password")) {
                    toast.error("Invalid password. Please try again.");
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
    }

    function handleOTPLogin() {
        alert("OTP Login feature coming soon!");
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-[95%] sm:max-w-md md:max-w-lg animate-slideUp">
                {/* Main Card */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={onInternalClose}
                        className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 hover:bg-gray-100 rounded-full"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Logo Section */}
                    <div className="flex justify-center pt-6 sm:pt-8 pb-4 sm:pb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-2xl sm:text-3xl font-bold">S</span>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-6 sm:mb-8 px-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            Welcome back!
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">Please login to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">

                        {/* Redux Error Alert */}
                        {reduxError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-fadeIn">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{reduxError}</span>
                            </div>
                        )}

                        {/* Email/Mobile Input */}
                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                Mobile No. / Email ID <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Enter mobile no. / email"
                                    value={user.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.email && touched.email
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-rose-400"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-400`}
                                />
                            </div>
                            {errors.email && touched.email && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={user.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("password")}
                                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.password && touched.password
                                        ? "border-red-500 focus:ring-red-400"
                                        : "border-gray-300 focus:ring-rose-400"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-400`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Stay Logged In & Forgot Password */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={stayLoggedIn}
                                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                                    className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                                    Stay Logged in
                                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    close();
                                    navigate("/forgot-password");
                                }}
                                className="text-xs sm:text-sm text-cyan-500 hover:text-cyan-600 font-medium transition-colors text-left sm:text-right"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                            </div>
                        </div>

                        {/* Login with OTP Button */}
                        <button
                            type="button"
                            onClick={handleOTPLogin}
                            className="w-full bg-white border-2 border-cyan-400 text-cyan-500 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-cyan-50 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                        >
                            Login with OTP
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center pt-2">
                            <span className="text-gray-600 text-xs sm:text-sm">New to PunarMilan? </span>
                            <button
                                type="button"
                                onClick={openRegister}
                                className="text-cyan-500 hover:text-cyan-600 font-semibold text-xs sm:text-sm transition-colors"
                            >
                                Sign Up Free →
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </div>
    );
}

export default Login;
