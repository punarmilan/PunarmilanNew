import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, X, Check, Search, Filter, ChevronRight, MoreHorizontal, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import adminApi from '../../admin/services/adminApi';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegistrants, setShowRegistrants] = useState(false);
    const [selectedEventForRegistrants, setSelectedEventForRegistrants] = useState(null);
    const [registrants, setRegistrants] = useState([]);
    const [registrantsLoading, setRegistrantsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        status: 'UPCOMING',
        registeredCount: 0,
        isNew: true,
        eventType: 'OFFLINE',
        meetingLink: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await adminApi.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateNew = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            location: '',
            status: 'UPCOMING',
            registeredCount: 0,
            isNew: true,
            eventType: 'OFFLINE',
            meetingLink: ''
        });
        setShowForm(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            ...event,
            startTime: event.startTime ? event.startTime.substring(0, 16) : '',
            endTime: event.endTime ? event.endTime.substring(0, 16) : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await adminApi.delete(`/events/${id}`);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event', error);
            toast.error('Failed to delete event');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await adminApi.put(`/events/${editingEvent.id}`, formData);
                toast.success('Event updated successfully');
            } else {
                await adminApi.post('/events', formData);
                toast.success('Event created successfully');
            }
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event', error);
            toast.error(error.response?.data?.message || 'Failed to save event');
        }
    };

    const handleViewRegistrants = async (event) => {
        setSelectedEventForRegistrants(event);
        setShowRegistrants(true);
        setRegistrantsLoading(true);
        try {
            const response = await adminApi.get(`/events/${event.id}/registrants`);
            setRegistrants(response.data);
        } catch (error) {
            console.error('Error fetching registrants', error);
            toast.error('Failed to load registrants');
        } finally {
            setRegistrantsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'ONGOING': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'COMPLETED': return 'bg-slate-50 text-slate-600 border-slate-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: events.length,
        active: events.filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING').length,
        registrations: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0)
    };

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Control center for all platform gatherings and meetups</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="group bg-rose-500 hover:bg-rose-600 px-6 py-3 rounded-xl text-white font-bold flex items-center transition-all shadow-lg shadow-rose-500/25 active:scale-95"
                >
                    <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                    Create New Event
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Events', value: stats.total, icon: Calendar, color: 'blue' },
                    { label: 'Active Events', value: stats.active, icon: Clock, color: 'emerald' },
                    { label: 'Total Registrations', value: stats.registrations, icon: Users, color: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-500 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search events, locations, types..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                            <Filter size={18} /> Filters
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors text-rose-500 border-rose-100 bg-rose-50/30">
                            <Download size={18} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-500 font-bold">Fetching events data...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Event Info</th>
                                    <th className="py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Date & Time</th>
                                    <th className="py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Location</th>
                                    <th className="py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                                    <th className="py-5 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                                                    event.eventType === 'ONLINE' ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'
                                                }`}>
                                                    {event.eventType === 'ONLINE' ? 'ON' : 'OFF'}
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 group-hover:text-rose-500 transition-colors">{event.title}</h4>
                                                    <p className="text-slate-400 text-xs font-bold mt-0.5">{event.registeredCount || 0} Registrations</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 font-bold text-sm">
                                                    {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-slate-400 text-xs font-medium mt-1">
                                                    {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                    {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <MapPin size={14} className="text-slate-300" />
                                                <span className="text-sm">{event.eventType === 'ONLINE' ? 'Virtual/Zoom' : event.location}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-dashed ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleViewRegistrants(event)} className="p-2 hover:bg-purple-50 text-purple-400 hover:text-purple-600 rounded-lg transition-all" title="View Registrants">
                                                    <Users size={18} />
                                                </button>
                                                <button onClick={() => handleEdit(event)} className="p-2 hover:bg-blue-50 text-blue-400 hover:text-blue-600 rounded-lg transition-all" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-rose-50 text-rose-300 hover:text-rose-500 rounded-lg transition-all" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Event Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/40 animate-in fade-in transition-all">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Fill in the details for your upcoming gathering</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                        placeholder="Enter event name..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                        placeholder="Tell people what this event is about..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        required
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        required
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event Type</label>
                                    <select
                                        name="eventType"
                                        value={formData.eventType}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                    >
                                        <option value="OFFLINE">Offline</option>
                                        <option value="ONLINE">Online</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                        {formData.eventType === 'ONLINE' ? 'Meeting Link' : 'Venue/Location'}
                                    </label>
                                    <input
                                        type="text"
                                        name={formData.eventType === 'ONLINE' ? 'meetingLink' : 'location'}
                                        required
                                        value={formData.eventType === 'ONLINE' ? formData.meetingLink : formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700 bg-slate-50/30"
                                        placeholder={formData.eventType === 'ONLINE' ? 'Zoom/Meet link...' : 'Venue name, city...'}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-4 rounded-2xl text-slate-500 font-extrabold hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-extrabold shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center min-w-[160px]"
                                >
                                    {editingEvent ? 'Save Changes' : 'Launch Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registrants Modal */}
            {showRegistrants && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-in fade-in transition-all">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black">{selectedEventForRegistrants?.title}</h2>
                                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Attendance Sheet</p>
                            </div>
                            <button onClick={() => setShowRegistrants(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {registrantsLoading ? (
                                <div className="p-10 text-center">
                                    <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-slate-500 font-bold">Listing participants...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {registrants.length === 0 ? (
                                        <div className="py-20 text-center bg-slate-50 rounded-[2rem]">
                                            <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                            <p className="text-slate-500 font-bold text-lg">No registrations yet</p>
                                        </div>
                                    ) : (
                                        registrants.map((reg, idx) => (
                                            <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-black text-slate-500">{idx + 1}</div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900">{reg.userName}</p>
                                                        <p className="text-xs font-bold text-slate-400">{reg.userEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-rose-500 uppercase tracking-tighter">Member</p>
                                                    <p className="text-[10px] font-bold text-slate-400">Joined platform</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-8 border-t border-slate-100 flex justify-center bg-slate-50/50">
                            <button onClick={() => setShowRegistrants(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                                Close Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
