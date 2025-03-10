'use client';

import { useState } from 'react';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav
            className="fixed w-full z-20 bg-gradient-to-b from-gray-900 to-transparent backdrop-blur-lg"
            data-oid="bohq5il"
        >
            <div className="container mx-auto px-6 py-4" data-oid="6hoih-7">
                <div className="flex items-center justify-between" data-oid="ztt_86x">
                    <Link
                        href={'/'}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                        data-oid="_8a770q"
                    >
                        NEXORA
                    </Link>
                    <DesktopMenu data-oid="3f-2fpi" />
                    <div className="flex gap-4" data-oid="9qm6p8h">
                        <button className="text-white" data-oid="-k9ytg.">
                            <Link href={'/search'} data-oid="bpfai3i">
                                <MagnifyingGlassIcon className="size-6" data-oid="e:hg56q" />
                            </Link>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            data-oid="3wtq6.d"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="size-6" data-oid="la3rflc" />
                            ) : (
                                <Bars3Icon className="size-6" data-oid="mlayy07" />
                            )}
                        </button>

                        <button
                            className="hidden md:block bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full"
                            data-oid=".uvnxj2"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} data-oid="_661on9" />
        </nav>
    );
};
