import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const SearchOption = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [keywords, setKeywords] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const handleAddKeyword = () => {
        if (keywords.trim()) {
            const newKeywords = keywords.split(',').map(k => k.trim()).filter(k => k);
            setSelectedKeywords([...selectedKeywords, ...newKeywords]);
            setKeywords('');
        }
    };

    const handleRemoveKeyword = (index) => {
        setSelectedKeywords(selectedKeywords.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddKeyword();
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
                        <Search className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Search Using Keywords</h2>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 animate-fadeIn">
                    <div className="space-y-4">
                        {/* Description */}
                        <p className="text-gray-700 text-sm">
                            For very specific results, filter your search using keywords.
                        </p>

                        {/* Input Section */}
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g. MBA, traditional, music, etc"
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleAddKeyword}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 whitespace-nowrap"
                                >
                                    Add Keywords
                                </button>
                            </div>

                            {/* Info Text */}
                            <p className="text-xs text-gray-500 italic">
                                Choosing this option might significantly reduce the number of results.
                            </p>
                        </div>

                        {/* Selected Keywords Tags */}
                        {selectedKeywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                {selectedKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                                    >
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeyword(index)}
                                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                                            aria-label="Remove keyword"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchOption;