'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create Context
const LoadingContext = createContext<{
    spinnerLoading: boolean;
    setSpinnerLoading: (state: boolean) => void;
} | null>(null);

// Custom Hook
export function useSpinnerLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useSpinnerLoading must be used within a SpinnerLoadingProvider');
    }
    return context;
}

// Provider Component
export function SpinnerLoadingProvider({ children }: { children: ReactNode }) {
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ spinnerLoading, setSpinnerLoading }} data-oid="g5o_9r1">
            <AnimatePresence mode="wait" data-oid="tbi5fhv">
                {spinnerLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50"
                        data-oid="vwc.q9p"
                    >
                        <div className="relative flex flex-col items-center" data-oid="ns.msx6">
                            {/* Loading Animation */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                                className="relative w-16 h-16"
                                data-oid="bk95pd-"
                            >
                                {/* Outer Ring */}
                                <div
                                    className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-l-purple-500 rounded-full"
                                    data-oid="iwoc14q"
                                ></div>
                                {/* Inner Glow Effect */}
                                <div
                                    className="absolute inset-0 w-full h-full animate-ping rounded-full bg-purple-500 opacity-30"
                                    data-oid="yhr1tn0"
                                ></div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </LoadingContext.Provider>
    );
}
