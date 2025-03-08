'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEB_VERSION } from '@/lib/config';

// Create Context
const LoadingContext = createContext<{
    loading: boolean;
    setLoading: (state: boolean) => void;
} | null>(null);

// Custom Hook
export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}

// Provider Component
export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Getting things ready for you');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let dotCount = 0;

        function loadingMessage() {
            setMessage(`Getting things ready for you ${'.'.repeat(dotCount)}`);
            dotCount = (dotCount + 1) % 4;
        }

        interval = setInterval(loadingMessage, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }} data-oid="k5me0da">
            <AnimatePresence mode="wait" data-oid="u49096x">
                {loading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
                        data-oid="_rjul_i"
                    >
                        <div className="relative flex flex-col items-center" data-oid="zmc8scv">
                            {/* Logo Animation */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="mb-8"
                                data-oid="oik_h9r"
                            >
                                <div className="w-44 h-44 relative " data-oid="3tbwztk">
                                    <div
                                        className="animate-pulse absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
                                        data-oid="nswqfs6"
                                    />

                                    {/* Inner Background */}
                                    <div
                                        className="animate-pulse absolute inset-1 bg-gray-800 rounded-xl"
                                        data-oid="p7wrz0e"
                                    />

                                    {/* Text */}
                                    <div
                                        className="absolute inset-0 flex-col items-center text-center flex justify-items-center justify-center"
                                        data-oid="8w:62dp"
                                    >
                                        <span
                                            className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
                                            data-oid="a3y25ex"
                                        >
                                            NEXORA
                                        </span>
                                        <p className="text-gray-300 font-mono" data-oid="l5hfcjt">
                                            {WEB_VERSION}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Loading Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '150px' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="animate-pulse h-1 bg-gradient-to-r m from-purple-500 to-pink-500 rounded-full"
                                data-oid="ve7kdif"
                            />

                            {/* Loading Text */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, ease: 'easeOut' }}
                                className="mt-6 text-gray-300 text-sm font-mono tracking-wide"
                                data-oid="r.-e_gs"
                            >
                                {message}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </LoadingContext.Provider>
    );
}
