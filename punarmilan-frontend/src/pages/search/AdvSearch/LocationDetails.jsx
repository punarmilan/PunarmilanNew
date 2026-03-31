import React, { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';

const LocationDetails = ({ filters, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const countries = ['UK', 'USA', 'India', 'Canada', 'Australia', 'UAE', 'Singapore'];
    const states = ['Open to All', 'England', 'Scotland', 'Wales', 'Northern Ireland'];
    const residencyOptions = ['Open to All', 'Citizen', 'Permanent Resident', 'Work Permit', 'Student Visa'];
    const grewUpOptions = ['Open to All', 'UK', 'India', 'USA', 'Canada', 'Other'];

    const removeFilter = (field) => {
        onChange(field, 'Open to All');
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-rose-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Location & Grew Up In Details</h2>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 space-y-6 animate-fadeIn">
                    {/* Country Living In */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Country Living In
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.country}
                                onChange={(e) => onChange('country', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-100"
                            >
                                {countries.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            {filters.country !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('country')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full">
                            {filters.country}
                        </span>
                    </div>

                    {/* State Living In */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            State Living In
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.state}
                                onChange={(e) => onChange('state', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-100"
                            >
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            {filters.state !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('state')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Residency Status */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Residency Status
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.residency}
                                onChange={(e) => onChange('residency', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-100"
                            >
                                {residencyOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {filters.residency !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('residency')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Country Grew Up In */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Country Grew Up In
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.grewUp}
                                onChange={(e) => onChange('grewUp', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-rose-300 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-100"
                            >
                                {grewUpOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {filters.grewUp !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('grewUp')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationDetails;