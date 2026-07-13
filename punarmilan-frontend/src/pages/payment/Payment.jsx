 import React, { useState, useEffect } from 'react';
 import { createPortal } from 'react-dom';
 import api from '../../services/api';
 import Swal from 'sweetalert2';
 import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
  Crown,
  Sparkles
} from "lucide-react";
 import { X, Check, HelpCircle, ChevronDown, ChevronRight, Navigation } from 'lucide-react';
 import FaqSection from './FaqSection';
 import TestimalCarousel from './TestimalCarousel';
 
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
            console.log("Subscription plans : " , response);
            if (Array.isArray(response.data)) {
                // Filter out special services and upgrades from the standard payment page
                const membershipPlans = response.data.filter(p => !p.planType || p.planType === 'MEMBERSHIP');

                // Map backend plans to our UI structure
                const mappedPlans = membershipPlans.map((p, index) => ({
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
                    contribution: 17,
                    icon: index === 0 ? (
                        <Navigation size={28} className="text-[#1a56db] fill-[#1a56db]" />
                    ) : index === 1 ? (
                        <Sparkles size={28} className="text-[#eab308]" />
                    ) : (
                        <Crown size={28} className="text-[#0d9488] fill-[#0d9488]" />
                    ),
                    design: index === 0 ? {
                        bg: "bg-gradient-to-b from-[#eff6ff] to-white border-[#dbeafe]",
                        textMain: "text-[#1a56db]",
                        badgeBg: "bg-[#dbeafe] text-[#1a56db]",
                        btnBg: "bg-[#1a56db] hover:bg-[#1e40af] text-white",
                        checkBg: "bg-[#1a56db]",
                        ribbon: null
                    } : index === 1 ? {
                        bg: "bg-gradient-to-b from-[#fefce8] to-white border-[#fef08a]",
                        textMain: "text-[#eab308]",
                        badgeBg: "bg-[#fef08a] text-[#ca8a04]",
                        btnBg: "bg-[#eab308] hover:bg-[#ca8a04] text-white",
                        checkBg: "bg-[#eab308]",
                        ribbon: "TOP SELLER",
                        ribbonBg: "bg-[#eab308]"
                    } : {
                        bg: "bg-gradient-to-b from-[#f0fdfa] to-white border-[#ccfbf1]",
                        textMain: "text-[#0d9488]",
                        badgeBg: "bg-[#ccfbf1] text-[#0d9488]",
                        btnBg: "bg-[#0d9488] hover:bg-[#0f766e] text-white",
                        checkBg: "bg-[#0d9488]",
                        ribbon: "BEST VALUE",
                        ribbonBg: "bg-[#0d9488]"
                    }
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
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Subscription successful!',
                            confirmButtonColor: '#8C6D39'
                        });
                        window.location.href = '/my-shadi';
                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Payment verification failed',
                            confirmButtonColor: '#8C6D39'
                        });
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to initiate payment',
                confirmButtonColor: '#8C6D39'
            });
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-transparent text-teal-600 font-bold">Loading Subscription Plans...</div>;
    return (
        <div className="w-full bg-transparent font-sans">
            <div className="max-w-7xl mx-auto flex flex-col">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {/* Premium Hero Section */}
                    <div className="dashboard-card-bg border border-white/50 pt-8 pb-24 md:pb-28 px-4 rounded-b-3xl md:rounded-3xl shadow-sm">
                        {/* Banner Text */}
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-sm leading-tight mb-4 tracking-tighter">
                                Upgrade now & Get upto 85% discount!
                            </h2>
                            
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white/40 backdrop-blur-md px-6 py-2 md:px-8 md:py-3 rounded-full border border-white/50 shadow-sm inline-block">
                                    <p className="text-[#8C6D39] text-sm md:text-base font-black tracking-wide">
                                        Save upto 85% on Premium Plans!! Valid for limited period!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Container */}
                    <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-20 pb-12 relative z-10">
            <div className="grid md:grid-cols-3 gap-8 py-10 drop-shadow-2xl">
              {plans.map((plan, index) => (
                <div key={plan.id} className="h-full">
                  <div
                    className={`relative rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col p-6 text-center ${plan.design.bg}`}
                  >
                    {/* Ribbon */}
                    {plan.design.ribbon && (
                      <div className={`absolute top-0 right-4 px-4 py-1.5 rounded-b-lg text-[10px] font-bold text-white tracking-wider ${plan.design.ribbonBg}`}>
                        {plan.design.ribbon}
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 mt-2 relative z-10">
                      {plan.icon}
                    </div>

                    {/* Title & Duration */}
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-4">{plan.duration}</p>

                    {/* Pricing */}
                    <div className="flex justify-center items-center gap-2 mb-1">
                      <span className="text-gray-400 line-through text-xs font-medium">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.design.badgeBg}`}>
                        {plan.discount}% OFF
                      </span>
                    </div>
                    <div className={`text-4xl font-black mb-1 tracking-tighter ${plan.design.textMain}`}>
                      ₹{plan.discountedPrice.toLocaleString("en-IN")}
                    </div>
                    <p className="text-[10px] text-gray-500 mb-6 font-medium">
                      ₹{plan.perMonth}/month
                    </p>

                    {/* Features List */}
                    <div className="flex-1 text-left">
                      <ul className="space-y-3 mb-8 pl-1">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 text-[13px] text-gray-600 font-medium"
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0 ${plan.design.checkBg}`}>
                              <Check size={10} strokeWidth={4} />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleContinue(plan)}
                      className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 text-sm shadow-sm ${plan.design.btnBg}`}
                    >
                      Choose Plan <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e2e8f0;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #cbd5e1;
            }
          `}</style>
          <div className="max-w-7xl mx-auto text-center pb-8 pt-2">
                <p className="text-gray-600 drop-shadow-sm text-sm font-bold opacity-90 tracking-wide">
                    Trusted by thousands of members. Secure payment options available.
                </p>
            </div>
  

            {/* Modal */}
            {showModal && selectedPlan && createPortal(
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn" onClick={(e) => { if(e.target === e.currentTarget) setShowModal(false) }}>
                    <div className="dashboard-card-bg flex flex-col rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] transform transition-all duration-300 animate-slideUp border border-white/50" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/30">
                            <h3 className="text-2xl font-bold text-gray-800 font-serif flex items-center gap-2">
                                Order Summary
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-rose-600 bg-white/50 hover:bg-white p-2 rounded-full shadow-sm hover:shadow transition-all"
                            >
                                <X className="w-5 h-5 cursor-pointer" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            {/* Plan Details */}
                            <div className="flex justify-between items-center pb-5 border-b border-white/30">
                                <div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {selectedPlan.name} <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-1">({selectedPlan.duration})</span>
                                    </p>
                                </div>
                                <p className="text-xl font-black text-gray-800">
                                    ₹{selectedPlan.originalPrice.toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Savings */}
                            <div className="flex justify-between items-center pb-5 border-b border-white/30">
                                <p className="text-emerald-500 font-bold flex items-center gap-1">
                                    Savings <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{selectedPlan.discount}% off</span>
                                </p>
                                <p className="text-emerald-500 font-bold">
                                    -₹{calculateSavings().toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-3 bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm">
                                {/* Extra Contacts */}
                                <label className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={orderDetails.addContacts}
                                                onChange={(e) =>
                                                    setOrderDetails({
                                                        ...orderDetails,
                                                        addContacts: e.target.checked
                                                    })
                                                }
                                                className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-rose-500 checked:border-rose-500 transition-all cursor-pointer"
                                            />
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-700 font-medium group-hover:text-rose-600 transition-colors">
                                            Add {selectedPlan.extraContacts} extra Contact nos.
                                        </span>
                                    </div>
                                    <span className="text-gray-500 font-semibold">
                                        ₹{selectedPlan.extraContactPrice}
                                    </span>
                                </label>

                                {/* Promote Profile */}
                                <label className="flex items-center justify-between group cursor-pointer pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={orderDetails.promoteProfile}
                                                onChange={(e) =>
                                                    setOrderDetails({
                                                        ...orderDetails,
                                                        promoteProfile: e.target.checked
                                                    })
                                                }
                                                className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-rose-500 checked:border-rose-500 transition-all cursor-pointer"
                                            />
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-700 font-medium group-hover:text-rose-600 transition-colors">Promote my Profile</span>
                                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </div>
                                    </div>
                                    <span className="text-gray-500 font-semibold">
                                        ₹{selectedPlan.promotePrice}
                                    </span>
                                </label>

                                {/* Contribute to PunarMilan.org */}
                                <label className="flex items-center justify-between group cursor-pointer pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={orderDetails.contributePunarMilan}
                                                onChange={(e) =>
                                                    setOrderDetails({
                                                        ...orderDetails,
                                                        contributePunarMilan: e.target.checked
                                                    })
                                                }
                                                className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-rose-500 checked:border-rose-500 transition-all cursor-pointer"
                                            />
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-700 font-medium group-hover:text-rose-600 transition-colors">Contribute to PunarMilan.org</span>
                                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </div>
                                    </div>
                                    <span className="text-gray-500 font-semibold">₹{selectedPlan.contribution}</span>
                                </label>
                            </div>

                            {/* Total Amount */}
                            <div className="pt-5 border-t-2 border-dashed border-white/40">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-xl font-bold text-gray-800 uppercase tracking-wide text-sm">Total Amount</p>
                                    <p className="text-4xl font-black text-rose-600 drop-shadow-sm">
                                        ₹{calculateTotal().toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {/* Savings Banner */}
                                <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-xl p-3 mb-6 shadow-sm">
                                    <p className="text-center text-emerald-700 font-bold text-sm">
                                        🎉 You are saving ₹{calculateSavings().toLocaleString('en-IN')} on this order!
                                    </p>
                                </div>

                                {/* Proceed Button */}
                                <button 
                                    onClick={handlPayment}
                                    className="w-full bg-gradient-to-r cursor-pointer from-rose-500 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-rose-500/30 active:translate-y-0"
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
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


            </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;

// import React, { useState, useEffect } from "react";
// import api from "../../services/api";
//  import { useNavigate , Link  } from "react-router-dom";
//  import { Check, Crown, Sparkles, ShieldCheck, Star, Zap } from "lucide-react";

//  import FaqSection from './FaqSection';
//  import TestimalCarousel from './TestimalCarousel';
//  import PunarMilanSupport from './ShadiSupport';
//  import HelpDropdown from '../../components/HelpDropdown';

//  function Payment() {

//   const navigate = useNavigate();

//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [orderDetails, setOrderDetails] = useState({
//     addContacts: false,
//     promoteProfile: false,
//     contributePunarMilan: true,
//   });

//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//     const fetchPlans = async () => {
//         try {
//             const response = await api.get('/subscriptions/plans');
//             console.log("Plans API Response:", response.data);
//             if (Array.isArray(response.data)) {
//                 // Map backend plans to our UI structure
//                 const mappedPlans = response.data.map(p => ({
//                     id: p.id,
//                     name: p.name,
//                     duration: p.durationLabel || `${p.durationInDays / 30} Months`,
//                     originalPrice: p.discountPercentage > 0 
//                         ? Math.round(p.price / (1 - (p.discountPercentage / 100)))
//                         : p.price,
//                     discountedPrice: p.price,
//                     perMonth: Math.round(p.price / (p.durationInDays / 30)),
//                     discount: p.discountPercentage,
//                     badge: p.highlightTag || null,
//                     features: p.features ? p.features.split(',').map(f => f.trim()) : [],
//                     extraContacts: p.extraContacts || 20,
//                     extraContactPrice: p.extraContactPrice || 255,
//                     promotePrice: p.promotePrice || 339,
//                     contribution: 17
//                 }));
//                 setPlans(mappedPlans);
//             }
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching plans:', error);
//             setLoading(false);
//         }
//     };

//     const handleContinue = (plan) => {
//         setSelectedPlan(plan);
//         setOrderDetails({
//             addContacts: false,
//             promoteProfile: false,
//             contributePunarMilan: true
//         });
//         setShowModal(true);
//     };

//     const calculateTotal = () => {
//         if (!selectedPlan) return 0;
//         let total = selectedPlan.discountedPrice;
//         if (orderDetails.addContacts) total += selectedPlan.extraContactPrice;
//         if (orderDetails.promoteProfile) total += selectedPlan.promotePrice;
//         if (orderDetails.contributePunarMilan) total += selectedPlan.contribution;
//         return total;
//     };

//     const calculateSavings = () => {
//         if (!selectedPlan) return 0;
//         return selectedPlan.originalPrice - selectedPlan.discountedPrice;
//     };


//     const handlPayment = async () => {
//         try {
//             const finalAmount = calculateTotal();
//             setShowModal(false);
//             const { data: orderResponse } = await api.post(`/payments/create-order/${selectedPlan.id}`);
            
//             const options = {
//                 key: orderResponse.key,
//                 amount: finalAmount * 100,
//                 currency: orderResponse.currency,
//                 name: 'Punarmilan',
//                 description: `Subscription for ${selectedPlan.name}`,
//                 order_id: orderResponse.orderId,
//                 handler: async (response) => {
//                     try {
//                         const verificationData = {
//                             razorpayOrderId: response.razorpay_order_id,
//                             razorpayPaymentId: response.razorpay_payment_id,
//                             razorpaySignature: response.razorpay_signature,
//                             planId: selectedPlan.id
//                         };
//                         const { data: subscription } = await api.post('/payments/verify', verificationData);
//                         Swal.fire({ text: 'Subscription successful!', confirmButtonColor: '#8C6D39' });
//                         window.location.href = '/my-shadi';
//                     } catch (err) {
//                         Swal.fire({ text: 'Payment verification failed', confirmButtonColor: '#8C6D39' });
//                     }
//                 },
//                 prefill: {
//                     name: 'User Name',
//                     email: 'user@example.com',
//                 },
//                 theme: {
//                     color: '#12b36a',
//                 },
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (error) {
//             console.error('Error creating order:', error);
//             Swal.fire({ text: 'Failed to initiate payment', confirmButtonColor: '#8C6D39' });
//         }
//     };

//     if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1] text-teal-600 font-bold">Loading Subscription Plans...</div>;
  

//   // const plans = [
//   //   {
//   //     name: "Basic",
//   //     price: "₹499",
//   //     duration: "30 days",
//   //     icon: <ShieldCheck />,
//   //     popular: false,
//   //     color: "from-gray-700 to-gray-900",
//   //     benefits: [
//   //       "View 25 profiles",
//   //       "Send 10 interests",
//   //       "Basic search filters",
//   //       "Profile visibility boost",
//   //       "Email support",
//   //     ],
//   //   },
//   //   {
//   //     name: "Pro",
//   //     price: "₹999",
//   //     duration: "60 days",
//   //     icon: <Crown />,
//   //     popular: true,
//   //     color: "from-rose-500 to-[#8C6D39]",
//   //     benefits: [
//   //       "View 100 profiles",
//   //       "Send unlimited interests",
//   //       "Contact number access",
//   //       "Advanced search filters",
//   //       "Priority profile listing",
//   //       "Chat support",
//   //     ],
//   //   },
//   //   {
//   //     name: "Max Pro",
//   //     price: "₹1999",
//   //     duration: "90 days",
//   //     icon: <Sparkles />,
//   //     popular: false,
//   //     color: "from-purple-600 to-rose-600",
//   //     benefits: [
//   //       "Unlimited profile views",
//   //       "Unlimited contact access",
//   //       "Top profile highlight",
//   //       "Dedicated relationship support",
//   //       "Verified badge",
//   //       "Premium matches first",
//   //       "Priority customer support",
//   //     ],
//   //   },
//   // ];

//   return (
//     <div className="min-h-screen bg-[#f8f5f2] p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-rose-100 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-[#FAF6F0] text-[#C5A059] px-4 py-2 rounded-full text-sm font-semibold mb-4">
//                 <Zap size={17} />
//                 Premium Membership
//               </div>

//               <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
//                 Upgrade Your Plan
//               </h1>

//               <p className="text-gray-500 mt-3 max-w-2xl">
//                 Get more profile views, direct contact access, premium matches,
//                 and better visibility for your matrimonial profile.
//               </p>
//             </div>

//             <Link to="/my-shadi" className="self-start lg:self-auto">
//             <div className="bg-gradient-to-r from-rose-500 to-[#8C6D39] text-white rounded-3xl p-5 min-w-[230px] shadow-lg">
//               <div className="flex items-center gap-3">
//                 <Star fill="white" />
//                 <div>
//                   <p className="text-sm text-rose-100">
//                     Current Plan
//                     </p>
//                   <h3 className="text-xl font-bold">Free Member</h3>
//                 </div>
//               </div>
//             </div>
//             </Link>    
//           </div>
//         </div>

//         {/* Plans */}
//         <div className="grid md:grid-cols-3 gap-32 ">
//           {plans.map((plan) => (
//             <div
//               key={plan.name}
//               className={`relative bg-white rounded-[2rem] border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 overflow-hidden ${
//                 plan.popular ? "border-rose-300 scale-[1.02]" : "border-gray-100"
//               }`}
//             >
//               {plan.badge && (
//                 <div className="absolute top-5 right-5 bg-[#8C6D39] text-white text-xs font-bold px-4 py-2 rounded-full">
//                   {plan.badge}
//                 </div>
//               )}

//               <div className={`bg-gradient-to-r ${plan.color} p-7 text-white`}>
//                 <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
//                   {plan.icon}
//                 </div>

//                 <h2 className="text-2xl font-extrabold">{plan.name}</h2>

//                 <div className="mt-4 flex items-end gap-2">
//                   <span className="text-4xl font-black">₹{plan.discountedPrice?.toLocaleString("en-IN")}</span>
//                   <span className="text-sm text-white/80 mb-1">
//                     / {plan.duration}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-7">
//                 <ul className="space-y-4">
//                  {plan.features.map((benefit) => (
//                     <li key={benefit} className="flex items-start gap-3">
//                       <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#C5A059] flex items-center justify-center flex-shrink-0">
//                         <Check size={16} />
//                       </span>
//                       <span className="text-sm text-gray-700">{benefit}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button
//                   onClick={() => handleContinue(plan)}
//                   className={`mt-8 w-full py-4 rounded-2xl font-bold transition ${
//                     plan.popular
//                       ? "bg-gradient-to-r from-[#C5A059] to-[#8C6D39] text-white shadow-lg shadow-rose-200 hover:scale-[1.02]"
//                       : "bg-rose-100 text-[#C5A059] hover:bg-rose-200"
//                   }`}
//                 >
//                   Choose {plan.name}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal */}
//             {showModal && selectedPlan && (
//                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
//                     <div className="dashboard-card-bg rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideUp">
//                         {/* Modal Header */}
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                             <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 <X className="w-6 h-6 cursor-pointer" />
//                             </button>
//                         </div>

//                         {/* Modal Body */}
//                         <div className="p-6 space-y-4">
//                             {/* Plan Details */}
//                             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//                                 <div>
//                                     <p className="text-lg font-semibold text-gray-800">
//                                         {selectedPlan.name} ({selectedPlan.duration})
//                                     </p>
//                                 </div>
//                                 <p className="text-lg font-bold text-gray-800">
//                                     ₹{selectedPlan.originalPrice.toLocaleString('en-IN')}
//                                 </p>
//                             </div>

//                             {/* Savings */}
//                             <div className="flex justify-between items-center pb-4 border-b border-gray-200">
//                                 <p className="text-emerald-600 font-semibold">
//                                     Savings ({selectedPlan.discount}% off)
//                                 </p>
//                                 <p className="text-emerald-600 font-bold">
//                                     -₹{calculateSavings().toLocaleString('en-IN')}
//                                 </p>
//                             </div>

//                             {/* Add-ons */}
//                             <div className="space-y-3">
//                                 {/* Extra Contacts */}
//                                 <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <input
//                                             type="checkbox"
//                                             checked={orderDetails.addContacts}
//                                             onChange={(e) =>
//                                                 setOrderDetails({
//                                                     ...orderDetails,
//                                                     addContacts: e.target.checked
//                                                 })
//                                             }
//                                             className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
//                                         />
//                                         <span className="text-gray-700">
//                                             Add {selectedPlan.extraContacts} extra Contact nos.
//                                         </span>
//                                     </div>
//                                     <span className="text-gray-500">
//                                         ₹{selectedPlan.extraContactPrice}
//                                     </span>
//                                 </label>

//                                 {/* Promote Profile */}
//                                 <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <input
//                                             type="checkbox"
//                                             checked={orderDetails.promoteProfile}
//                                             onChange={(e) =>
//                                                 setOrderDetails({
//                                                     ...orderDetails,
//                                                     promoteProfile: e.target.checked
//                                                 })
//                                             }
//                                             className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
//                                         />
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-700">Promote my Profile</span>
//                                             <HelpCircle className="w-4 h-4 text-gray-400" />
//                                         </div>
//                                     </div>
//                                     <span className="text-gray-500">
//                                         ₹{selectedPlan.promotePrice}
//                                     </span>
//                                 </label>

//                                 {/* Contribute to PunarMilan.org */}
//                                 <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <input
//                                             type="checkbox"
//                                             checked={orderDetails.contributePunarMilan}
//                                             onChange={(e) =>
//                                                 setOrderDetails({
//                                                     ...orderDetails,
//                                                     contributePunarMilan: e.target.checked
//                                                 })
//                                             }
//                                             className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
//                                         />
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-700">Contribute to PunarMilan.org</span>
//                                             <HelpCircle className="w-4 h-4 text-gray-400" />
//                                         </div>
//                                     </div>
//                                     <span className="text-gray-500">₹{selectedPlan.contribution}</span>
//                                 </label>
//                             </div>

//                             {/* Total Amount */}
//                             <div className="pt-4 border-t-2 border-gray-200">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <p className="text-xl font-bold text-gray-800">Total Amount</p>
//                                     <p className="text-3xl font-bold text-teal-600">
//                                         ₹{calculateTotal().toLocaleString('en-IN')}
//                                     </p>
//                                 </div>

//                                 {/* Savings Banner */}
//                                 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
//                                     <p className="text-center text-emerald-700 font-semibold">
//                                         🎉 You are saving ₹{calculateSavings().toLocaleString('en-IN')} on this order 🎉
//                                     </p>
//                                 </div>

//                                 {/* Proceed Button */}
//                                 <button 
//                                     onClick={handlPayment}
//                                     className="w-full bg-gradient-to-r cursor-pointer from-cyan-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                                 >
//                                     Proceed to Pay
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         {/* Bottom Info */}
//         <div className="mt-8 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-900 mb-3">
//             Why upgrade?
//           </h3>

//           <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
//             <p>✅ Increase your profile visibility among suitable matches.</p>
//             <p>✅ Contact interested profiles directly and faster.</p>
//             <p>✅ Get premium support and better match recommendations.</p>
//           </div>
//         </div>

//         <style>{`
//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 1;
//     }
//   }

//   @keyframes slideUp {
//     from {
//       transform: translateY(20px);
//       opacity: 0;
//     }
//     to {
//       transform: translateY(0);
//       opacity: 1;
//     }
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.3s ease-out;
//   }

//   .animate-slideUp {
//     animation: slideUp 0.3s ease-out;
//   }
// `}</style>
           
//             <FaqSection />
//             <TestimalCarousel />
//             <div className='flex justify-center items-center'>
//                 <PunarMilanSupport />
            
//       </div>     

//     </div>
//     </div>
//   );
// }
// export default Payment;

    
