import React, { useState, useEffect } from 'react';
import adminSupportService from '../services/adminSupportService';
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, Send, User, Info, X, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetchTickets();
    }, [page, size]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await adminSupportService.getAllTickets({ page, size });
            setTickets(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async () => {
        if (!response) return toast.error('Please enter a response');
        try {
            await adminSupportService.respondToTicket(selectedTicket.id, response);
            toast.success('Response sent');
            setSelectedTicket(null);
            setResponse('');
            fetchTickets();
        } catch (error) {
            toast.error('Failed to send response');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'IN_PROGRESS': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'CLOSED': return 'text-gray-400 bg-gray-50 border-gray-100';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'URGENT': return 'text-rose-600 font-black';
            case 'HIGH': return 'text-amber-600 font-black';
            default: return 'text-gray-400 font-bold';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Support Center</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage user queries and technical issues</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-black uppercase">
                        {tickets.filter(t => t.status === 'OPEN').length} Open Tickets
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket Info</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading tickets...</td></tr>
                            ) : tickets.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <MessageSquare size={48} className="opacity-20" />
                                        <p className="font-bold">Inbox clear! No active tickets.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-800">{ticket.subject}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{ticket.message}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                    <Calendar size={10} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] uppercase tracking-widest ${getPriorityStyle(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                            >
                                                Resolve
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalElements > size && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
                        <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold disabled:opacity-50">Previous</button>
                        <button disabled={(page + 1) * size >= totalElements} onClick={() => setPage(page + 1)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>

            {/* Resolve Drawer/Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="h-full w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-none">Handle Ticket</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">ID: TK-{selectedTicket.id}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                            <div className="space-y-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                                <h4 className="text-xl font-black text-gray-800">{selectedTicket.subject}</h4>
                                <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                                    "{selectedTicket.message}"
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Response</label>
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className="w-full h-48 px-6 py-5 bg-gray-50 border-none rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                    placeholder="Draft your response to the user here..."
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100">
                            <button
                                onClick={handleRespond}
                                className="w-full bg-pink-600 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-pink-100 hover:bg-pink-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Solve and Notify User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTickets;
