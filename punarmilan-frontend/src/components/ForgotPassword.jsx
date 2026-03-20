import React, { useState } from "react";
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { forgotPassword } from "../Slice/UserSlice";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.user);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Enter valid email address";
        return "";
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const emailError = validateEmail(email);

        if (emailError) {
            setError(emailError);
            toast.error(emailError);
            return;
        }

        setError("");

        try {
            const resultAction = await dispatch(forgotPassword({ email }));
            if (forgotPassword.fulfilled.match(resultAction)) {
                setIsSubmitted(true);
                toast.success("Reset link sent successfully! Check your email.");
            } else {
                const errorMessage = resultAction.payload || "Failed to send reset link";
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl text-center">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Check your email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We have sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/"
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`appearance-none rounded-lg relative block w-full px-10 py-3 border ${error ? "border-red-500" : "border-gray-300"
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {error && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? "Sending..." : "Reset password"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
