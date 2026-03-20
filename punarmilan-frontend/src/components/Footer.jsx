import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {

    const sections = {
        company: {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about-us' },
                { name: 'Contact Us', href: '#contact' },
            ]
        },
        privacy: {
            title: 'Privacy & Legal',
            links: [
                { name: 'Be Safe Online', href: '#safety' },
                { name: 'Privacy Policy', href: '#privacy' },
                { name: 'Terms of Use', href: '#terms' },
                { name: 'Grievance Officer', href: '#grievance' }
            ]
        }
    };

    const socialLinks = [
        { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" /> },
        { name: 'Instagram', href: '#', icon: <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" /> },
        { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" /> },
        { name: 'YouTube', href: '#', icon: <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" /> },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" /> }
    ];

    return (
        <footer className="bg-[#0a0e1b] text-white pt-12 sm:pt-20 pb-8 sm:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 mb-12 sm:mb-20">
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#e91e63] p-2 rounded-lg shadow-[0_0_20px_rgba(233,30,99,0.3)]">
                                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
                                PUNAR<span className="text-[#e91e63]">MILAN</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-sm mb-8 sm:mb-10">
                            The World's No.1 Matchmaking Service. We help thousands find their perfect partner and begin a beautiful journey together.
                        </p>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {Object.entries(sections).map(([key, section]) => (
                            <div key={key}>
                                <h3 className="text-white font-black text-lg sm:text-xl mb-5 sm:mb-8 uppercase tracking-wider">{section.title}</h3>
                                <ul className="space-y-3 sm:space-y-5">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 font-medium text-base sm:text-lg">
                                                <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Icons Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 py-8 sm:py-12 border-y border-white/5 mb-8 sm:mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#e91e63]/10 rounded-2xl flex items-center justify-center">
                            <Phone className="w-7 h-7 text-[#e91e63]" />
                        </div>
                        <div>
                            <div className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Call Us</div>
                            <div className="text-white font-black text-lg tracking-wide">+91 1800 200 1234</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <Mail className="w-7 h-7 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Email Us</div>
                            <div className="text-white font-black text-lg tracking-wide">punarmilan2@gmail.com</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                            <MapPin className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-1">Visit Us</div>
                            <div className="text-white font-black text-lg tracking-wide">Mumbai, India</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10">
                    <div className="flex items-center gap-8 text-gray-400 font-black uppercase tracking-widest text-[12px]">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#00a65a]" />
                            100% Verified Profiles
                        </div>
                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                        <div>Since 2026</div>
                    </div>

                    <div className="flex flex-col md:flex-end items-center md:items-end gap-1">
                        <div className="flex gap-4 mb-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#e91e63] flex items-center justify-center transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <div className="text-gray-400 font-black text-sm tracking-wide">
                            Copyright © 2026-2027 <span className="text-white">PunarMilan.com</span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">
                            Created by WorknAi Technologies India Pvt Ltd
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
