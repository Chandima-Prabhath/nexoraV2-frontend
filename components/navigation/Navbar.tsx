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
            data-oid="leq-rzq"
        >
            <div className="container mx-auto px-6 py-4" data-oid="26a0lep">
                <div className="flex items-center justify-between" data-oid="ml-wujf">
                    <Link
                        href={'/'}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                        data-oid="m23ll3z"
                    >
                        NEXORA
                    </Link>
                    <DesktopMenu data-oid="1e019lt" />
                    <div className="flex gap-4" data-oid="tz8pd53">
                        <button className="text-white" data-oid="5fhys6:">
                            <Link href={'/search'} data-oid="sw:4s1c">
                                <MagnifyingGlassIcon className="size-6" data-oid="dh2ec8v" />
                            </Link>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            data-oid="qnwukmq"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="size-6" data-oid="xsgi0ro" />
                            ) : (
                                <Bars3Icon className="size-6" data-oid="oq61dzi" />
                            )}
                        </button>

                        <button
                            className="hidden md:block bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full"
                            data-oid="a2duhms"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} data-oid="-i_bfrj" />
        </nav>
    );
};
