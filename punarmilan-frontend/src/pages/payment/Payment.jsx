import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

import { X, Check, HelpCircle, ChevronDown } from 'lucide-react';
import FaqSection from './FaqSection';
import TestimalCarousel from './TestimalCarousel';
import PunarMilanSupport from './ShadiSupport';
import HelpDropdown from '../../components/HelpDropdown';

function Payment() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        addContacts: false,
        promoteProfile: false,
        contributePunarMilan: true
    });

    const navigate = useNavigate()


    // Countdown timer (you can make this dynamic)
    const [timeLeft] = useState({ hours: 13, minutes: 8, seconds: 56 });

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/subscriptions/plans');
            if (Array.isArray(response.data)) {
                // Map backend plans to our UI structure
                const mappedPlans = response.data.map(p => ({
                    id: p.id,
                    name: p.name,
                    duration: p.durationLabel || `${p.durationInDays / 30} Months`,
                    originalPrice: p.discountPercentage > 0 
                        ? Math.round(p.price / (1 - (p.discountPercentage / 100)))
                        : p.price,
                    discountedPrice: p.price,
                    perMonth: Math.round(p.price / (p.durationInDays / 30)),
                    discount: p.discountPercentage,
                    badge: p.highlightTag || null,
                    features: p.features ? p.features.split(',').map(f => f.trim()) : [],
                    extraContacts: p.extraContacts || 20,
                    extraContactPrice: p.extraContactPrice || 255,
                    promotePrice: p.promotePrice || 339,
                    contribution: 17
                }));
                setPlans(mappedPlans);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setLoading(false);
        }
    };

    const handleContinue = (plan) => {
        setSelectedPlan(plan);
        setOrderDetails({
            addContacts: false,
            promoteProfile: false,
            contributePunarMilan: true
        });
        setShowModal(true);
    };

    const calculateTotal = () => {
        if (!selectedPlan) return 0;
        let total = selectedPlan.discountedPrice;
        if (orderDetails.addContacts) total += selectedPlan.extraContactPrice;
        if (orderDetails.promoteProfile) total += selectedPlan.promotePrice;
        if (orderDetails.contributePunarMilan) total += selectedPlan.contribution;
        return total;
    };

    const calculateSavings = () => {
        if (!selectedPlan) return 0;
        return selectedPlan.originalPrice - selectedPlan.discountedPrice;
    };


    const handlPayment = async () => {
        try {
            const finalAmount = calculateTotal();
            setShowModal(false);
            const { data: orderResponse } = await api.post(`/payments/create-order/${selectedPlan.id}`);
            
            const options = {
                key: orderResponse.key,
                amount: finalAmount * 100,
                currency: orderResponse.currency,
                name: 'Punarmilan',
                description: `Subscription for ${selectedPlan.name}`,
                order_id: orderResponse.orderId,
                handler: async (response) => {
                    try {
                        const verificationData = {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            planId: selectedPlan.id
                        };
                        const { data: subscription } = await api.post('/payments/verify', verificationData);
                        alert('Subscription successful!');
                        window.location.href = '/dashboard';
                    } catch (err) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'User Name',
                    email: 'user@example.com',
                },
                theme: {
                    color: '#12b36a',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to initiate payment');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1] text-teal-600 font-bold">Loading Subscription Plans...</div>;
    return (
        <div className="min-h-screen bg-[#f1f1f1] font-sans">
            {/* Bright Green Hero Section */}
            <div className="bg-[#12b36a] pt-8 pb-32 md:pb-48 px-4" style={{ backgroundColor: '#12b36a' }}>
                {/* Minimal Header */}
                <div className="max-w-[1240px] mx-auto flex items-center justify-between mb-16">
                    <h1 className="text-2xl md:text-[32px] font-bold text-white tracking-tight font-serif italic">
                        punarmilan
                    </h1>
                    <div className="flex items-center space-x-10">
                        <button className="hidden md:block px-8 py-2 border border-white/60 text-white rounded-full text-[14px] font-bold hover:bg-white/10 transition-all">
                            Personalised Plan <i className="fa-solid fa-chevron-right text-[10px] ml-1"></i>
                        </button>
                    </div>
                </div>

                {/* Banner Text */}
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-[56px] font-bold text-white leading-tight mb-8 tracking-tighter">
                        Upgrade now & Get upto 85% discount!
                    </h2>
                    
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#0d8a56] px-10 py-3 rounded-md border border-white/10 shadow-lg inline-block" style={{ backgroundColor: '#0d8a56' }}>
                            <p className="text-white text-sm sm:text-lg font-bold">
                                Save upto 85% on Premium Plans!! Valid for limited period!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Container - Aggressively Forced Single Row */}
            <div className="max-w-[1600px] mx-auto px-4 -mt-24 sm:-mt-32 md:-mt-40 pb-20">
                <div 
                    className="flex flex-nowrap items-stretch justify-center gap-4 py-4"
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto' }}
                >
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                                plan.badge ? 'pt-0' : 'pt-12'
                            }`}
                            style={{ minWidth: '260px', flex: '0 0 auto' }}
                        >
                            {/* Special Badge Labels */}
                            {plan.badge && (
                                <div className="text-center pt-6 pb-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-full flex items-center justify-center mb-4 px-6">
                                            <div className="h-[1px] flex-grow bg-rose-200"></div>
                                            <span className={`px-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                                                plan.badge === 'TOP SELLER' ? 'text-rose-500' : 'text-rose-500'
                                            }`}>
                                                {plan.badge}
                                            </span>
                                            <div className="h-[1px] flex-grow bg-rose-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Plan Name & Duration */}
                            <div className="px-6 text-center mb-10">
                                <h3 className="text-[20px] font-black text-gray-800 tracking-tight leading-tight">
                                    {plan.name} <span className="text-gray-400 font-medium ml-1">{plan.duration}</span>
                                </h3>
                            </div>

                            {/* Price Section */}
                            <div className="px-6 text-center mb-10">
                                <div className="flex items-center justify-center gap-3 mb-3 text-[15px]">
                                    <span className="text-[#12b36a] font-black" style={{ color: '#12b36a' }}>{plan.discount}% off</span>
                                    <span className="text-gray-400 line-through">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-[48px] font-black text-gray-900 leading-none mb-4">
                                    ₹{plan.discountedPrice.toLocaleString('en-IN')}
                                </div>
                                <p className="text-[14px] text-gray-400 font-bold">
                                    ₹{plan.perMonth} per month
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="px-6 mb-6">
                                <button
                                    onClick={() => handleContinue(plan)}
                                    className="w-full py-4 rounded-full border border-gray-200 text-gray-400 font-black text-[16px] hover:border-[#12b36a] hover:text-[#12b36a] hover:bg-green-50 transition-all shadow-sm"
                                >
                                    Continue
                                </button>
                                <p className="text-[12px] text-gray-400 text-center mt-5 leading-tight font-bold opacity-80">
                                    Auto-renews on expiry. Cancel anytime.
                                </p>
                            </div>

                            <div className="h-[1px] bg-gray-50 mx-8 mb-10"></div>

                            {/* Features */}
                            <div className="px-6 pb-12 space-y-6 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3.5">
                                        <div className="mt-1 flex-shrink-0">
                                            <Check className="w-4.5 h-4.5 text-[#12b36a] stroke-[4px]" style={{ color: '#12b36a' }} />
                                        </div>
                                        <span className="text-[14px] text-gray-600 leading-[1.3] font-bold tracking-tight">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto text-center pb-20">
                <p className="text-gray-400 text-sm font-bold opacity-60">
                    Trusted by thousands of members. Secure payment options available.
                </p>
            </div>
  

            {/* Modal */}
            {showModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideUp">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6 cursor-pointer" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Plan Details */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedPlan.name} ({selectedPlan.duration})
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-gray-800">
                                    ₹{selectedPlan.originalPrice.toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Savings */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <p className="text-emerald-600 font-semibold">
                                    Savings ({selectedPlan.discount}% off)
                                </p>
                                <p className="text-emerald-600 font-bold">
                                    -₹{calculateSavings().toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-3">
                                {/* Extra Contacts */}
                                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.addContacts}
                                            onChange={(e) =>
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    addContacts: e.target.checked
                                                })
                                            }
                                            className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <span className="text-gray-700">
                                            Add {selectedPlan.extraContacts} extra Contact nos.
                                        </span>
                                    </div>
                                    <span className="text-gray-500">
                                        ₹{selectedPlan.extraContactPrice}
                                    </span>
                                </label>

                                {/* Promote Profile */}
                                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.promoteProfile}
                                            onChange={(e) =>
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    promoteProfile: e.target.checked
                                                })
                                            }
                                            className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">Promote my Profile</span>
                                            <HelpCircle className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="text-gray-500">
                                        ₹{selectedPlan.promotePrice}
                                    </span>
                                </label>

                                {/* Contribute to PunarMilan.org */}
                                <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={orderDetails.contributePunarMilan}
                                            onChange={(e) =>
                                                setOrderDetails({
                                                    ...orderDetails,
                                                    contributePunarMilan: e.target.checked
                                                })
                                            }
                                            className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">Contribute to PunarMilan.org</span>
                                            <HelpCircle className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="text-gray-500">₹{selectedPlan.contribution}</span>
                                </label>
                            </div>

                            {/* Total Amount */}
                            <div className="pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xl font-bold text-gray-800">Total Amount</p>
                                    <p className="text-3xl font-bold text-teal-600">
                                        ₹{calculateTotal().toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {/* Savings Banner */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                                    <p className="text-center text-emerald-700 font-semibold">
                                        🎉 You are saving ₹{calculateSavings().toLocaleString('en-IN')} on this order 🎉
                                    </p>
                                </div>

                                {/* Proceed Button */}
                                <button 
                                    onClick={handlPayment}
                                    className="w-full bg-gradient-to-r cursor-pointer from-cyan-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
            <FaqSection />
            <TestimalCarousel />
            <div className='flex justify-center items-center'>
                <PunarMilanSupport />

            </div>
        </div>
    );
}

export default Payment;