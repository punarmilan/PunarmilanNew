import React, { useState } from 'react';
import { Heart, ChevronDown } from 'lucide-react';

const Lifestyle = ({ diet, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleDietChange = (dietType) => {
        if (dietType === 'openToAll') {
            onChange({
                openToAll: true,
                veg: false,
                nonVeg: false,
                jain: false,
                vegan: false
            });
        } else {
            const newDiet = {
                ...diet,
                openToAll: false,
                [dietType]: !diet[dietType]
            };

            // Check if any specific diet remains selected
            const anySelected = newDiet.veg || newDiet.nonVeg || newDiet.jain || newDiet.vegan;
            if (!anySelected) {
                newDiet.openToAll = true;
            }

            onChange(newDiet);
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Lifestyle & Appearance</h2>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 animate-fadeIn">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Diet
                        </label>

                        {/* Diet Checkboxes */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {/* Open to All */}
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200 group">
                                <input
                                    type="checkbox"
                                    checked={diet.openToAll}
                                    onChange={() => handleDietChange('openToAll')}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Open to All
                                </span>
                            </label>

                            {/* Veg */}
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-green-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-green-200 group">
                                <input
                                    type="checkbox"
                                    checked={diet.veg}
                                    onChange={() => handleDietChange('veg')}
                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                                    Veg
                                </span>
                            </label>

                            {/* Non-Veg */}
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-red-200 group">
                                <input
                                    type="checkbox"
                                    checked={diet.nonVeg}
                                    onChange={() => handleDietChange('nonVeg')}
                                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                                    Non-Veg
                                </span>
                            </label>

                            {/* Jain */}
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-orange-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-orange-200 group">
                                <input
                                    type="checkbox"
                                    checked={diet.jain}
                                    onChange={() => handleDietChange('jain')}
                                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                    Jain
                                </span>
                            </label>

                            {/* Vegan */}
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-teal-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-teal-200 group">
                                <input
                                    type="checkbox"
                                    checked={diet.vegan}
                                    onChange={() => handleDietChange('vegan')}
                                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                                    Vegan
                                </span>
                            </label>
                        </div>

                        {/* Selected Tags Display */}
                        {(!diet.openToAll && (diet.veg || diet.nonVeg || diet.jain || diet.vegan)) && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                                {diet.veg && (
                                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Veg
                                    </span>
                                )}
                                {diet.nonVeg && (
                                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                        Non-Veg
                                    </span>
                                )}
                                {diet.jain && (
                                    <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                        Jain
                                    </span>
                                )}
                                {diet.vegan && (
                                    <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                                        Vegan
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lifestyle;