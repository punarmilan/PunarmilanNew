import React, { useState } from 'react';
import { GraduationCap, ChevronDown, X, HelpCircle } from 'lucide-react';

const EducationDetails = ({ filters, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const qualifications = [
        'Open to All', 'High School', 'Bachelor\'s Degree', 'Master\'s Degree',
        'Doctorate/PhD', 'Diploma', 'Professional Degree'
    ];
    const educationAreas = [
        'Open to All', 'Engineering', 'Medicine', 'Business', 'Arts', 'Science',
        'Law', 'Computer Science', 'Other'
    ];
    const workingWithOptions = [
        'Open to All', 'Private Company', 'Government/Public Sector', 'Self Employed/Business',
        'Not Working', 'Other'
    ];
    const professionAreas = [
        'Open to All', 'IT/Software', 'Medical/Healthcare', 'Engineering', 'Finance',
        'Education', 'Business/Management', 'Legal', 'Other'
    ];
    const currencies = ['GBP', 'USD', 'EUR', 'INR', 'AUD', 'CAD'];
    const incomeRanges = [
        'below 20,000', '20,000-40,000', '40,000-60,000', '60,000-80,000',
        '80,000-100,000', '100,000-150,000', '150,000-200,000', '200,000-300,000',
        'above 300,000'
    ];

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
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Education & Profession Details</h2>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 space-y-6 animate-fadeIn">
                    {/* Qualification */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Qualification
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.qualification}
                                onChange={(e) => onChange('qualification', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                {qualifications.map((qual) => (
                                    <option key={qual} value={qual}>{qual}</option>
                                ))}
                            </select>
                            {filters.qualification !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('qualification')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Education Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Education Area
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.educationArea}
                                onChange={(e) => onChange('educationArea', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                {educationAreas.map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            {filters.educationArea !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('educationArea')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Working With */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Working With
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.workingWith}
                                onChange={(e) => onChange('workingWith', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                {workingWithOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {filters.workingWith !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('workingWith')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Profession Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Profession Area
                        </label>
                        <div className="relative group">
                            <select
                                value={filters.professionArea}
                                onChange={(e) => onChange('professionArea', e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                {professionAreas.map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            {filters.professionArea !== 'Open to All' && (
                                <button
                                    onClick={() => removeFilter('professionArea')}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Annual Income */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Annual Income
                        </label>

                        {/* Radio Buttons */}
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="incomeType"
                                    checked={filters.incomeType === 'all'}
                                    onChange={() => onChange('incomeType', 'all')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Open to All</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="incomeType"
                                    checked={filters.incomeType === 'range'}
                                    onChange={() => onChange('incomeType', 'range')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">Specify An Income Range</span>
                            </label>
                        </div>

                        {/* Income Range Selectors */}
                        {filters.incomeType === 'range' && (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Currency */}
                                    <div className="relative">
                                        <select
                                            value={filters.currency}
                                            onChange={(e) => onChange('currency', e.target.value)}
                                            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                        >
                                            {currencies.map((curr) => (
                                                <option key={curr} value={curr}>{curr}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Min Income */}
                                    <div className="relative">
                                        <select
                                            value={filters.minIncome}
                                            onChange={(e) => onChange('minIncome', e.target.value)}
                                            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                        >
                                            {incomeRanges.map((range) => (
                                                <option key={range} value={range}>{range}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* To Label (Hidden on mobile, shown as text on larger screens) */}
                                    <div className="hidden sm:flex items-center justify-center text-gray-500 text-sm font-medium -mx-2">
                                        to
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div></div> {/* Spacer for alignment */}

                                    {/* Max Income */}
                                    <div className="relative sm:col-start-2">
                                        <select
                                            value={filters.maxIncome}
                                            onChange={(e) => onChange('maxIncome', e.target.value)}
                                            className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                        >
                                            {incomeRanges.map((range) => (
                                                <option key={range} value={range}>{range}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Include Unspecified Checkbox */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.includeUnspecified}
                                        onChange={(e) => onChange('includeUnspecified', e.target.checked)}
                                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                            Include Profiles who have not specified their income
                                        </span>
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationDetails;