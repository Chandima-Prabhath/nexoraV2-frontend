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
            data-oid="d4ianug"
        >
            <div
                className="md:hidden bg-gray-900 border-t border-gray-900 bg-opacity-50 backdrop-blur-lg"
                data-oid="5dxafg7"
            >
                <div className="px-6 py-4 space-y-4" data-oid="kerr7da">
                    <Link
                        href="/"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="v06kyn_"
                    >
                        Home
                    </Link>
                    <Link
                        href="/browse/movies"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="0ih0cg7"
                    >
                        Movies
                    </Link>
                    <Link
                        href="/browse/tvshows"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="i:sn7m."
                    >
                        TV Shows
                    </Link>
                    <Link
                        href="/mylist"
                        className="block hover:text-purple-400 transition-colors"
                        data-oid="gwhnd83"
                    >
                        My List
                    </Link>
                    <button
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-6 py-2 rounded-full transition-colors"
                        data-oid="5svmjw0"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </Transition>
    );
};
