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
            data-oid="xhs.t9v"
        >
            <div className="container mx-auto px-6 py-4" data-oid="_r3iqcz">
                <div className="flex items-center justify-between" data-oid="ejqeiyk">
                    <Link
                        href={'/'}
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                        data-oid="t1ia:3h"
                    >
                        NEXORA
                    </Link>
                    <DesktopMenu data-oid="1c90wwi" />
                    <div className="flex gap-4" data-oid="7ssrgb0">
                        <button className="text-white" data-oid="m_zp2kf">
                            <Link href={'/search'} data-oid="p2w_ogx">
                                <MagnifyingGlassIcon className="size-6" data-oid="oio6ovq" />
                            </Link>
                        </button>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            data-oid="o87-97j"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="size-6" data-oid="1.td4st" />
                            ) : (
                                <Bars3Icon className="size-6" data-oid="rcvw:30" />
                            )}
                        </button>

                        <button
                            className="hidden md:block bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full"
                            data-oid="bkaq7wq"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} data-oid="3yvtqum" />
        </nav>
    );
};
