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
            data-oid="90uin_x"
        >
            <div className="container mx-auto px-6 py-4" data-oid="qdbt3n8">
                <div className="flex items-center justify-between" data-oid="7j-7ngy">
                    <Link
                        href={'/'}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                        data-oid="t-_qli-"
                    >
                        NEXORA
                    </Link>
                    <DesktopMenu data-oid="12hlixc" />
                    <div className="flex gap-4" data-oid="4t7:7ph">
                        <button className="text-white" data-oid="8_f3qsv">
                            <Link href={'/search'} data-oid="qbms7nq">
                                <MagnifyingGlassIcon className="size-6" data-oid="0y0pv8e" />
                            </Link>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            data-oid="ul.haxw"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="size-6" data-oid="z3215xb" />
                            ) : (
                                <Bars3Icon className="size-6" data-oid="kj5xto2" />
                            )}
                        </button>

                        <button
                            className="hidden md:block bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full"
                            data-oid="vjtb.l3"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} data-oid="32owrug" />
        </nav>
    );
};
