import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';

interface MobileMenuProps {
    isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
    return (
        <Transition
            as={Fragment}
            show={isOpen}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 transform scale-95"
            enterTo="opacity-100 transform scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 transform scale-100"
            leaveTo="opacity-0 transform scale-95"
            data-oid="qfxi9jm"
        >
            <div
                className="md:hidden bg-gray-900 border-t border-gray-900 bg-opacity-50 backdrop-blur-lg"
                data-oid="ltee666"
            >
                <div className="px-6 py-4 space-y-4" data-oid="hrba4.e">
                    <Link
                        href="/"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="eooe-xy"
                    >
                        Home
                    </Link>
                    <Link
                        href="/browse/movies"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="w.5t4ed"
                    >
                        Movies
                    </Link>
                    <Link
                        href="/browse/tvshows"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="kjj8bjw"
                    >
                        TV Shows
                    </Link>
                    <Link
                        href="/mylist"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="sxgw1sk"
                    >
                        My List
                    </Link>
                    <button
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full transition-colors"
                        data-oid="bs.53vf"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </Transition>
    );
};
