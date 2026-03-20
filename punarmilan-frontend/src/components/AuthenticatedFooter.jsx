import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Users } from 'lucide-react';

const AuthenticatedFooter = () => {
    return (
        <div className="w-full">
            {/* Top Footer Section */}
            <div className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                    <Link to="/about-us" className="hover:text-pink-600 transition-colors">About us</Link>
                    <Link to="/vip-shaadi" className="hover:text-pink-600 transition-colors">VIP PunarMilan</Link>
                    <Link to="/blog" className="hover:text-pink-600 transition-colors">PunarMilan Blog</Link>
                    <Link to="/success-stories" className="hover:text-pink-600 transition-colors">Success Stories</Link>
                    <Link to="/centres" className="hover:text-pink-600 transition-colors">PunarMilan Centres</Link>
                    <Link to="/contact-us" className="hover:text-pink-600 transition-colors">Contact Us</Link>
                    <Link to="/live" className="hover:text-pink-600 transition-colors">PunarMilan Live</Link>
                    <Link to="/work-with-us" className="hover:text-pink-600 transition-colors">Work with us</Link>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="bg-[#e9ebed] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[13px] text-gray-600">
                            <Link to="/safety" className="hover:underline">Be Safe Online</Link>
                            <Link to="/grievance" className="hover:underline">Grievance Officer details</Link>
                            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                            <Link to="/terms" className="hover:underline">Terms of Use</Link>
                            <Link to="/offer-terms" className="hover:underline">Offer Terms</Link>
                        </div>

                        {/* Copyright / Attribution */}
                        <div className="text-right text-[12px] text-gray-500 leading-relaxed">
                            <p>© 1996-2026 PunarMilan.com - The World's No.1 Matchmaking Service™</p>
                            <p className="mt-1">
                                Created by <span className="text-cyan-600 font-semibold cursor-pointer hover:underline">WorknAi Technologies India Pvt Ltd</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AuthenticatedFooter;
