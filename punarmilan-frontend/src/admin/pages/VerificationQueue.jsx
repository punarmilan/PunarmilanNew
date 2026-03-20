import React, { useState, useEffect } from 'react';
import adminVerificationService from '../services/adminVerificationService';
import { Check, X, Shield, Eye, FileText, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VerificationQueue = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchPendingProfiles();
    }, [page, size]);

    const fetchPendingProfiles = async () => {
        setLoading(true);
        try {
            const data = await adminVerificationService.getPendingProfiles({ page, size });
            setProfiles(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load pending profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminVerificationService.approveProfile(id);
            toast.success('Profile approved successfully');
            fetchPendingProfiles();
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async () => {
        if (!rejectReason) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            await adminVerificationService.rejectProfile(rejectingId, rejectReason);
            toast.success('Profile rejected');
            setRejectingId(null);
            setRejectReason('');
            fetchPendingProfiles();
        } catch (error) {
            toast.error('Rejection failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Verification Queue</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage pending profile and ID proof verifications</p>
                </div>
                <div className="px-4 py-2 bg-pink-50 text-pink-700 rounded-xl text-sm font-black">
                    {totalElements} Pending
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 font-medium">Loading queue...</div>
                ) : profiles.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <Shield size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">Queue is empty!</p>
                        <p className="text-sm">All profiles are currently processed.</p>
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <div key={profile.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                {/* User Basic Info */}
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-16 w-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 text-xl font-bold border-2 border-pink-50 shadow-sm shrink-0">
                                            {profile.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 leading-tight">{profile.fullName}</h3>
                                            <p className="text-xs font-black text-pink-600 uppercase tracking-widest">{profile.profileId}</p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <MapPin size={12} className="text-pink-500" />
                                            {profile.city}, {profile.state}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Calendar size={12} className="text-pink-500" />
                                            {profile.gender} • {profile.age} Years
                                        </div>
                                    </div>
                                </div>

                                {/* ID Proof Details */}
                                <div className="p-6 md:flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <FileText size={14} className="text-pink-600" />
                                            ID Proof Information
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Document Type</p>
                                            <p className="text-sm font-bold text-gray-800">{profile.idProofType || 'Aadhar Card'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Document Number</p>
                                            <p className="text-sm font-bold text-gray-800">{profile.idProofNumber || 'XXXX-XXXX-1234'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div
                                            onClick={() => profile.idProofUrl && window.open(profile.idProofUrl, '_blank')}
                                            className="h-20 w-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden group relative cursor-pointer"
                                        >
                                            {profile.idProofUrl ? (
                                                <img src={profile.idProofUrl} alt="ID Proof" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText className="text-gray-300" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                                Click to View
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            <p>Verify that name on ID matches</p>
                                            <p className="text-gray-800 font-bold">"{profile.fullName}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 md:w-48 bg-gray-50/50 flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 border-gray-100">
                                    <button
                                        onClick={() => handleApprove(profile.id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95"
                                    >
                                        <Check size={18} />
                                        Verified
                                    </button>
                                    <button
                                        onClick={() => setRejectingId(profile.id)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-rose-200 text-rose-500 rounded-2xl font-bold text-sm hover:bg-rose-50 transition-all active:scale-95"
                                    >
                                        <X size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {/* Rejection form overlay */}
                            {rejectingId === profile.id && (
                                <div className="p-6 bg-rose-50 border-t border-rose-100 animate-in slide-in-from-top duration-300">
                                    <label className="block text-xs font-bold text-rose-700 uppercase mb-2">Reason for Rejection</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="e.g. ID blurred, Name mismatch..."
                                            className="flex-1 px-4 py-2 border border-rose-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                                        />
                                        <button
                                            onClick={handleReject}
                                            className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                            className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl font-bold text-sm hover:bg-rose-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination placeholder */}
            {totalElements > size && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={(page + 1) * size >= totalElements}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerificationQueue;
