import React, { useState } from 'react';
import { MessageCircle, Image, Users, EyeOff, ChevronDown, HelpCircle } from 'lucide-react';

const ChatSearch = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [options, setOptions] = useState({
        chatStatus: {
            onlyProfilesForChat: false
        },
        photoSettings: {
            visibleToAll: false,
            protectedPhoto: false
        },
        profileManagedBy: {
            openToAll: true,
            self: false,
            parentGuardian: false,
            siblingFriendOthers: false
        },
        doNotShow: {
            profilesFilteredMeOut: true,
            profilesAlreadyViewed: false
        }
    });

    const handleCheckboxChange = (section, key) => {
        if (section === 'profileManagedBy') {
            if (key === 'openToAll') {
                setOptions({
                    ...options,
                    profileManagedBy: {
                        openToAll: true,
                        self: false,
                        parentGuardian: false,
                        siblingFriendOthers: false
                    }
                });
            } else {
                setOptions({
                    ...options,
                    profileManagedBy: {
                        ...options.profileManagedBy,
                        openToAll: false,
                        [key]: !options.profileManagedBy[key]
                    }
                });
            }
        } else {
            setOptions({
                ...options,
                [section]: {
                    ...options[section],
                    [key]: !options[section][key]
                }
            });
        }
    };

    // Auto-select "Open to All" if no specific option is selected
    React.useEffect(() => {
        const { self, parentGuardian, siblingFriendOthers } = options.profileManagedBy;
        if (!self && !parentGuardian && !siblingFriendOthers && !options.profileManagedBy.openToAll) {
            setOptions({
                ...options,
                profileManagedBy: { ...options.profileManagedBy, openToAll: true }
            });
        }
    }, [options]);

    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Search Options</h2>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 animate-fadeIn space-y-6">
                    {/* Chat Status */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">Chat Status</label>
                        </div>
                        <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-cyan-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-cyan-200 group">
                            <input
                                type="checkbox"
                                checked={options.chatStatus.onlyProfilesForChat}
                                onChange={() => handleCheckboxChange('chatStatus', 'onlyProfilesForChat')}
                                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition-colors">
                                Only Profiles available for Chat
                            </span>
                        </label>
                    </div>

                    {/* Photo Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">Photo Settings</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.photoSettings.visibleToAll}
                                    onChange={() => handleCheckboxChange('photoSettings', 'visibleToAll')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                    Visible to all
                                </span>
                            </label>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.photoSettings.protectedPhoto}
                                    onChange={() => handleCheckboxChange('photoSettings', 'protectedPhoto')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                    Protected Photo
                                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Profile Managed by */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">Profile Managed by</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.profileManagedBy.openToAll}
                                    onChange={() => handleCheckboxChange('profileManagedBy', 'openToAll')}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Open to All
                                </span>
                            </label>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.profileManagedBy.self}
                                    onChange={() => handleCheckboxChange('profileManagedBy', 'self')}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Self
                                </span>
                            </label>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.profileManagedBy.parentGuardian}
                                    onChange={() => handleCheckboxChange('profileManagedBy', 'parentGuardian')}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Parent / Guardian
                                </span>
                            </label>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.profileManagedBy.siblingFriendOthers}
                                    onChange={() => handleCheckboxChange('profileManagedBy', 'siblingFriendOthers')}
                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                                    Sibling / Friend / Others
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Do Not Show */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4 text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">Do Not Show</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-red-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.doNotShow.profilesFilteredMeOut}
                                    onChange={() => handleCheckboxChange('doNotShow', 'profilesFilteredMeOut')}
                                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors flex items-center gap-1">
                                    Profiles that have Filtered me out
                                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                </span>
                            </label>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-red-200 group">
                                <input
                                    type="checkbox"
                                    checked={options.doNotShow.profilesAlreadyViewed}
                                    onChange={() => handleCheckboxChange('doNotShow', 'profilesAlreadyViewed')}
                                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                                    Profiles that I have already Viewed
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Selected Options Display */}
                    {(options.chatStatus.onlyProfilesForChat ||
                        options.photoSettings.visibleToAll ||
                        options.photoSettings.protectedPhoto ||
                        !options.profileManagedBy.openToAll ||
                        options.doNotShow.profilesFilteredMeOut ||
                        options.doNotShow.profilesAlreadyViewed) && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                {options.chatStatus.onlyProfilesForChat && (
                                    <span className="inline-flex items-center px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                                        Chat Available
                                    </span>
                                )}
                                {options.photoSettings.visibleToAll && (
                                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        Visible Photos
                                    </span>
                                )}
                                {options.photoSettings.protectedPhoto && (
                                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        Protected Photos
                                    </span>
                                )}
                                {options.profileManagedBy.self && (
                                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                        Self Managed
                                    </span>
                                )}
                                {options.profileManagedBy.parentGuardian && (
                                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                        Parent/Guardian
                                    </span>
                                )}
                                {options.profileManagedBy.siblingFriendOthers && (
                                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                        Sibling/Friend
                                    </span>
                                )}
                                {options.doNotShow.profilesFilteredMeOut && (
                                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                        Hide Filtered
                                    </span>
                                )}
                                {options.doNotShow.profilesAlreadyViewed && (
                                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                        Hide Viewed
                                    </span>
                                )}
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default ChatSearch;