'use client';

import { useState } from 'react';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-20 bg-gradient-to-b from-gray-900 to-transparent backdrop-blur-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href={'/'}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                    >
                        NEXORA
                    </Link>
                    <DesktopMenu />
                    <div className="flex gap-4">
                        <button className="text-white">
                            <Link href={'/search'}>
                                <MagnifyingGlassIcon className="size-6" />
                            </Link>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="size-6" />
                            ) : (
                                <Bars3Icon className="size-6" />
                            )}
                        </button>

                        <button className="hidden md:block bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} />
        </nav>
    );
};
