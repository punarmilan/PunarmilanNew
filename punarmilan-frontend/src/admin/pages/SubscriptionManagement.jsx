import React, { useState, useEffect } from 'react';
import adminSubscriptionService from '../services/adminSubscriptionService';
import { Plus, Edit2, Trash2, Check, X, Shield, Zap, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        durationInDays: '',
        durationLabel: '',
        discountPercentage: '',
        highlightTag: '',
        connects: '',
        features: '',
        active: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await adminSubscriptionService.getAllPlans();
            setPlans(data);
        } catch (error) {
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({ 
                name: plan.name || '',
                description: plan.description || '',
                price: plan.price || '',
                durationInDays: plan.durationInDays || '',
                durationLabel: plan.durationLabel || '',
                discountPercentage: plan.discountPercentage || '',
                highlightTag: plan.highlightTag || '',
                connects: plan.connects || '',
                features: plan.features || '',
                active: plan.active !== undefined ? plan.active : true
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                durationInDays: '',
                durationLabel: '',
                discountPercentage: '0',
                highlightTag: '',
                connects: '',
                features: '',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const planData = {
                ...formData,
                price: parseFloat(formData.price),
                durationInDays: parseInt(formData.durationInDays),
                connects: parseInt(formData.connects),
                discountPercentage: parseInt(formData.discountPercentage || 0)
            };

            if (editingPlan) {
                await adminSubscriptionService.updatePlan(editingPlan.id, planData);
                toast.success('Plan updated');
            } else {
                await adminSubscriptionService.createPlan(planData);
                toast.success('Plan created');
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await adminSubscriptionService.deletePlan(id);
            toast.success('Plan deleted');
            fetchPlans();
        } catch (error) {
            toast.error('Failed to delete plan');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Initializing Systems...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Membership Plans</h2>
                    <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage monetization and features</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto bg-gray-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 shrink-0"
                >
                    <Plus size={18} /> Add New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-[24px] sm:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 group">
                        <div className={`h-2 sm:h-3 ${plan.active ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                        <div className="p-6 sm:p-10 flex-1">
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${plan.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                    {plan.active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(plan)} className="p-1.5 sm:p-2 border border-blue-50 text-blue-500 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors"><Edit2 size={14} className="sm:size-4" /></button>
                                    <button onClick={() => handleDelete(plan.id)} className="p-1.5 sm:p-2 border border-rose-50 text-rose-500 rounded-lg sm:rounded-xl hover:bg-rose-50 transition-colors"><Trash2 size={14} className="sm:size-4" /></button>
                                </div>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 sm:mb-2">{plan.name}</h3>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-4 sm:mb-6">{plan.durationInDays} Days Plan</p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                                <span className="text-sm text-gray-400 font-bold">/ membership</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                    <Zap size={16} className="text-amber-500" />
                                    <span>{plan.connects} Connects included</span>
                                </div>
                                {plan.features && plan.features.split(',').map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Sparkles size={16} className="text-pink-500" />
                                        <span>{f.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plan Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl sm:rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-500">
                        <div className="bg-pink-600 p-6 sm:p-10 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black leading-none">{editingPlan ? 'Refine Plan' : 'New Membership'}</h3>
                                <p className="text-pink-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2">{editingPlan ? 'ID: PLAN-0' + editingPlan.id : 'Setup monetization structure'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-colors">
                                <X size={20} className="sm:size-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-4 sm:space-y-6 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plan Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="e.g. Gold Plus"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.durationInDays}
                                        onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="e.g. 30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration Label</label>
                                    <input
                                        type="text"
                                        value={formData.durationLabel}
                                        onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="e.g. 3 Months"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount (%)</label>
                                    <input
                                        type="number"
                                        value={formData.discountPercentage}
                                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Highlight Tag</label>
                                    <input
                                        type="text"
                                        value={formData.highlightTag}
                                        onChange={(e) => setFormData({ ...formData, highlightTag: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="TOP SELLER"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Connects</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.connects}
                                    onChange={(e) => setFormData({ ...formData, connects: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                                    placeholder="e.g. 100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Features (Comma separated)</label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none h-24 resize-none"
                                    placeholder="Unlimited chats, Profile boost, Filter by salary..."
                                />
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 accent-emerald-500"
                                    id="planActive"
                                />
                                <label htmlFor="planActive" className="text-sm font-bold text-gray-700">Display this plan to users</label>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-gray-200 active:scale-95 transition-all">
                                {editingPlan ? 'Apply Modifications' : 'Launch Membership Plan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;
