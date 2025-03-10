'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ScrollSectionProps {
    title: string;
    link: string;
    children: React.ReactNode;
}

export default function ScrollSection({ title, link, children }: ScrollSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-4 relative group" data-oid="9:1ld.0">
            <div className="container mx-auto px-6" data-oid="91vxfj1">
                <div
                    className="font-bold flex flex-row items-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                    data-oid="uysovd8"
                >
                    <Link href={link} data-oid="y7f4p:h">
                        <h2 className="text-2xl" data-oid="4g6l_at">
                            {title}
                        </h2>
                    </Link>
                    <ChevronRightIcon className="size-6 text-pink-400" data-oid="kmyqnuo" />
                </div>

                {/* Scroll Arrows */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 z-10 transform -translate-y-1/6 bg-gradient-to-r from-transparent to-gray-900/50 hover:bg-gradient-to-r hover:from-transparent hover:to-purple-900 rounded-full p-1 ml-2 transition-all duration-500 ease-in-out"
                        data-oid="7ym6ppc"
                    >
                        <ChevronLeftIcon
                            className="size-8 lg:size-10 text-gray-300/50 hover:text-purple-400/50 transition-colors"
                            data-oid="5w9thhi"
                        />
                    </button>
                )}

                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 z-10 transform -translate-y-1/6 bg-gradient-to-r from-gray-600/50 to-transparent hover:bg-gradient-to-r hover:from-purple-900 hover:to-transparent rounded-full p-1 mr-2 transition-all duration-300 ease-in-out"
                        data-oid="k_ra0tj"
                    >
                        <ChevronRightIcon
                            className="size-8 lg:size-10 text-gray-300/50 hover:text-purple-400/50 transition-colors"
                            data-oid="z6l53td"
                        />
                    </button>
                )}

                {/* Scrollable Content */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex landscape:gap-5 gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
                    }}
                    data-oid="2i0zz_h"
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
