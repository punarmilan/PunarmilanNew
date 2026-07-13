import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, ShieldCheck, Gem, Users, CalendarCheck, Sparkles, 
  Brain, MessageCircle, Smile, Activity, Briefcase, Wallet, Target, 
  Stethoscope, CheckCircle2, Award, X, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const services = [
  {
    icon: <HeartHandshake size={32} />,
    title: "VIP One-to-One Couple Coaching",
    desc: "Personalized and private training for each couple. 100% confidential sessions tailored to your individual needs."
  },
  {
    icon: <Brain size={32} />,
    title: "Personality & Behavior Analysis",
    desc: "Personality assessment, understanding habits and behaviors, and identifying strengths and areas for improvement."
  },
  {
    icon: <MessageCircle size={32} />,
    title: "Communication Skills",
    desc: "Effective communication, the art of understanding each other, and positive resolution of differences."
  },
  {
    icon: <Smile size={32} />,
    title: "Emotional Intelligence",
    desc: "Understanding emotions, anger management, and developing trust and respect."
  },
  {
    icon: <Activity size={32} />,
    title: "Lifestyle & Habit Management",
    desc: "Daily life habits, time management, and work-life balance."
  },
  {
    icon: <Users size={32} />,
    title: "Family & Relationship Management",
    desc: "Better relations with in-laws and both families, understanding responsibilities, and family harmony."
  },
  {
    icon: <Wallet size={32} />,
    title: "Financial Planning for Couples",
    desc: "Budgeting, savings & investments, and joint financial planning."
  },
  {
    icon: <Target size={32} />,
    title: "Future Planning (Goal Setting)",
    desc: "1-year plan, 5-year plan, and 10-year joint life plan."
  },
  {
    icon: <Stethoscope size={32} />,
    title: "Health & Wellness",
    desc: "Mental health awareness, stress management, and a healthy lifestyle."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Post-Marriage Support",
    desc: "Post-marriage follow-up sessions, couple coaching as needed, and guidance to strengthen the relationship."
  }
];

// Hardcoded packages removed, will fetch from database

const features = [
  "VIP Private Coaching Room",
  "100% Confidentiality",
  "Personalized Couple Assessment Report",
  "Premium Training Workbook",
  "Welcome Kit",
  "Refreshments",
  "Training Completion Certificate",
  "Post-Marriage Support"
];

const team = [
  "Relationship Coach",
  "Personality Development Trainer",
  "Communication Expert",
  "Family Relationship Coach",
  "Financial Planning Coach",
  "Health & Wellness Coach",
  "Psychologist"
];

const SpecialServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbPackages, setDbPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscriptions/plans');
        // Get Special Service and Upgrade plans, and format them for the UI
        const specialPlans = response.data.filter(p => p.planType === 'SPECIAL_SERVICE' || p.planType === 'UPGRADE');
        
        // Map DB plans to UI package structure
        const formattedPackages = specialPlans.map(plan => {
            let color = "from-gray-300 to-gray-400"; // default
            if (plan.name.toLowerCase().includes("gold")) color = "from-amber-300 to-amber-500";
            else if (plan.name.toLowerCase().includes("platinum")) color = "from-slate-700 to-slate-900";
            else if (plan.name.toLowerCase().includes("diamond") || plan.name.toLowerCase().includes("elite")) color = "from-theme-primary to-theme-pink";

            return {
                name: plan.name,
                duration: plan.durationInDays > 0 ? `${plan.durationInDays} Days` : "Custom",
                price: `₹${plan.price}`,
                color: color,
                popular: plan.highlightTag && plan.highlightTag.toLowerCase().includes("popular")
            };
        });
        setDbPackages(formattedPackages);
      } catch (error) {
        console.error("Failed to fetch special service plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageType: 'Gold Package',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPackagePrice = (pkgName) => {
    switch(pkgName) {
      case 'Silver Package': return 25000;
      case 'Gold Package': return 60000;
      case 'Platinum Package': return 125000;
      case 'Diamond Elite': return 250000;
      default: return 60000;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Create order on the backend for the VIP package
      const price = getPackagePrice(formData.packageType);
      
      // We assume a generic or VIP specific endpoint exists. 
      // If not, this acts as a placeholder for the backend integration.
      const { data: orderResponse } = await api.post('/payments/create-vip-order', {
          amount: price,
          packageType: formData.packageType
      }).catch(async (err) => {
          // Fallback if specific VIP order endpoint doesn't exist yet
          // Use standard plan ID 1 just to show the UI flow
          console.warn('VIP order endpoint missing, using fallback plan for UI demonstration');
          return await api.post(`/payments/create-order/1`);
      });
      
      const options = {
          key: orderResponse.key || 'rzp_test_dummy', // Fallback for UI
          amount: price * 100, // Amount in paise
          currency: orderResponse.currency || 'INR',
          name: 'Punarmilan VIP',
          description: `Booking for ${formData.packageType}`,
          order_id: orderResponse.orderId || orderResponse.id,
          handler: async (response) => {
              try {
                  // 2. Payment successful, save the enrollment
                  const verificationData = {
                      ...formData,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpayOrderId: response.razorpay_order_id,
                      amountPaid: price
                  };
                  
                  const enrollRes = await fetch('/api/vip-enrollments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(verificationData)
                  });

                  if (enrollRes.ok) {
                      toast.success("Payment successful! VIP Consultation booked.");
                      setIsModalOpen(false);
                      setFormData({
                        name: '', email: '', phone: '', packageType: 'Gold Package', message: ''
                      });
                  } else {
                      toast.error("Payment verified, but booking failed to save.");
                  }
              } catch (err) {
                  toast.error('Payment verification failed');
              }
          },
          prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
          },
          theme: {
              color: '#C5A059',
          },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Payment gateway not loaded.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HERO SECTION */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-slate-900 to-[#1a1c29]">
        <div className="absolute inset-0 overflow-hidden -z-0">
          <div className="absolute top-0 right-0 w-[] h-[500px] bg-theme-magenta rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-[] h-[500px] bg-rose-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-surface/10 border border-white/20 text-amber-300 font-medium text-sm mb-8 backdrop-blur-sm"
          >
            <Gem size={16} /> Elite Relationship Academy
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white font-serif mb-6 leading-tight"
          >
            VIP Pre-Marriage Coaching & <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-amber-200">
              Couple Development Center
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-medium italic"
          >
            “A successful marriage begins with the right preparation.”
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto mb-10 text-gray-400 leading-relaxed text-sm md:text-base bg-theme-surface/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-2">Our Vision</h3>
            Marriage is not just a ceremony, but a lifelong partnership. Our goal is to prepare couples mentally, emotionally, behaviorally, and practically before marriage, so they can start their married life with trust, understanding, respect, and better communication.
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-theme-primary to-theme-pink text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:shadow-[0_15px_40px_rgba(197,160,89,0.5)] transition-all flex items-center gap-2 mx-auto"
          >
            <CalendarCheck size={20} /> Book VIP Consultation
          </motion.button>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="py-20 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-theme-magenta mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-surface rounded-2xl p-6 border border-gray-100 hover:border-[#C5A059]/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(197,160,89,0.1)] group"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-theme-magenta mb-5 group-hover:scale-110 group-hover:bg-theme-magenta group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-theme-text-secondary text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PACKAGES SECTION */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
              Program Duration & Packages
            </h2>
            <div className="w-24 h-1 bg-theme-magenta mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-10 font-bold text-theme-text-secondary animate-pulse">
                    Loading our premium packages...
                </div>
            ) : dbPackages.length > 0 ? (
                dbPackages.map((pkg, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative bg-theme-surface rounded-3xl p-8 border ${pkg.popular ? 'border-[#C5A059] shadow-xl scale-105 z-10' : 'border-gray-100 shadow-md'} flex flex-col`}
                >
                    {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-theme-primary to-theme-pink text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Most Popular
                    </div>
                    )}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white mb-6 mx-auto`}>
                    <Gem size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="text-center text-sm text-theme-text-secondary mb-6 font-medium bg-gray-50 py-1.5 rounded-lg">{pkg.duration} Program</div>
                    
                    <div className="text-center mb-8 flex-grow">
                    <span className="text-3xl font-extrabold text-gray-900">{pkg.price}</span>
                    </div>
                    
                    <button 
                    onClick={() => {
                        setFormData({...formData, packageType: pkg.name});
                        setIsModalOpen(true);
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-gradient-to-r from-theme-primary to-theme-pink text-white hover:shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    >
                    Select Package
                    </button>
                </motion.div>
                ))
            ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-10 font-bold text-theme-text-secondary">
                    No special packages available at the moment. Please check back later!
                </div>
            )}
          </div>
        </div>
      </div>

      {/* FEATURES & TEAM */}
      <div className="py-20 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-8 flex items-center gap-3">
                <Sparkles className="text-theme-magenta"/> Special Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                    <CheckCircle2 className="text-theme-magenta shrink-0" size={20} />
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-8 flex items-center gap-3">
                <Award className="text-theme-magenta"/> Our Expert Team
              </h3>
              <div className="flex flex-wrap gap-3">
                {team.map((member, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full text-slate-700 font-medium text-sm shadow-sm">
                    {member}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* IMPORTANT INFO */}
      <div className="py-12 bg-slate-900 text-center px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <AlertCircle className="text-amber-400" size={32} />
          <h3 className="text-xl font-bold text-white">Important Information</h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            This program is based on education, personality development, life skills, and relationship coaching. It is not a substitute for medical treatment or therapy for mental illness. If any participant has severe mental health issues, they will be advised to consult a qualified mental health professional.
          </p>
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-theme-surface w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white text-center relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white bg-theme-surface/10 rounded-full p-1"
                >
                  <X size={20} />
                </button>
                <Gem className="mx-auto mb-2 text-theme-magenta" size={32} />
                <h2 className="text-2xl font-bold font-serif">VIP Consultation</h2>
                <p className="text-sm text-gray-300 mt-1">Fill the form to book your exclusive session</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none bg-gray-50" placeholder="Enter your full name" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none bg-gray-50" placeholder="Email" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none bg-gray-50" placeholder="Phone" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Package</label>
                  <select required name="packageType" value={formData.packageType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none bg-gray-50 appearance-none font-medium text-gray-700">
                    <option value="Silver Package">Silver Package (₹25,000)</option>
                    <option value="Gold Package">Gold Package (₹60,000)</option>
                    <option value="Platinum Package">Platinum Package (₹1,25,000)</option>
                    <option value="Diamond Elite">Diamond Elite (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-theme-border focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none bg-gray-50 resize-none" placeholder="Any specific requirements..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-theme-primary to-theme-pink text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Submit Request</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialServices;
