import React from 'react';
import InterestRequestCard from '../../../components/InterestRequestCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function InterestsPage() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto pb-8 px-0 sm:px-4"
        >
            {/* Header Area */}
            <div className="dashboard-card-bg border border-white/50 rounded-3xl p-4 md:px-6 shadow-sm mb-6 relative overflow-hidden mt-3 h-[120px] flex flex-col justify-center">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-100/40 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100/40 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <h1 className="text-2xl md:text-3xl font-black font-serif text-[#c99a52] mb-2 flex items-center gap-3 drop-shadow-sm">
                    My Interests
                    <motion.div 
                        animate={{ rotate: [0, 15, -15, 0] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <Sparkles className="text-[#d94f73] w-5 h-5" />
                    </motion.div>
                </h1>
                <p className="text-xs md:text-sm text-gray-700 font-medium max-w-2xl leading-relaxed">
                    View and manage all your pending, accepted, and declined connection requests in one beautifully organized place.
                </p>
            </div>

            {/* Main Component */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10"
            >
                <InterestRequestCard />
            </motion.div>
        </motion.div>
    );
}

export default InterestsPage;
