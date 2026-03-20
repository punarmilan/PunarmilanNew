import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SearchNav() {
    const location = useLocation();

    const navItems = [
        { path: '/search', label: 'Basic Search' },
        { path: '/search/advance', label: 'Advanced Search' },
    ];

    return (
        <nav className="bg-white shadow-md border-b-2 border-gray-200 flex">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-1 sm:space-x-4 md:space-x-8">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    group relative py-4 sm:py-5 px-3 sm:px-4 md:px-6
                                    font-semibold text-sm sm:text-base
                                    transition-all duration-300 ease-out
                                    ${isActive
                                        ? 'text-pink-600 scale-105'
                                        : 'text-gray-600 hover:text-pink-500 hover:scale-105'
                                    }
                                `}
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                {/* Label */}
                                <span className="relative z-10">
                                    {item.label}
                                </span>

                                {/* Active Indicator - Bottom Border */}
                                <div
                                    className={`
                                        absolute bottom-0 left-0 right-0 h-1
                                        transition-all duration-300 ease-out
                                        ${isActive
                                            ? 'bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 opacity-100 scale-x-100'
                                            : 'bg-pink-400 opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
                                        }
                                    `}
                                ></div>

                                {/* Hover Background Effect */}
                                <div
                                    className={`
                                        absolute inset-0 -z-10
                                        bg-gradient-to-br from-pink-50 to-rose-50
                                        rounded-lg
                                        transition-all duration-300 ease-out
                                        ${isActive
                                            ? 'opacity-100 scale-100'
                                            : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                                        }
                                    `}
                                ></div>

                                {/* Active Badge (Mobile only) */}
                                {isActive && (
                                    <div className="absolute top-2 right-2 sm:hidden w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
        </nav>
    );
}

export default SearchNav;