'use client';

import { useState, useEffect } from 'react';
import NewContentSection from '@components/sections/NewContentSection';
import { getRecentItems } from '@lib/lb';
import Link from 'next/link';
import { useLoading } from '@/components/loading/SplashScreen';
import { InformationCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

interface Slide {
    image: string;
    genre: string | string[];
    title: string;
    description: string;
    type: 'movie' | 'tvshow';
}

export default function Page() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { loading, setLoading } = useLoading();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function fetchSlides() {
            try {
                setLoading(true);
                const slidesData = await getRecentItems();
                setSlides(slidesData);
            } catch (error) {
                console.error('Error fetching slides:', error);
            } finally {
                setLoading(false);
                setTimeout(() => setLoaded(true), 100); // Delay to ensure smooth transition
            }
        }
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides]);

    return (
        <div className="page" data-oid="cw.1:dv">
            {/* Hero Slideshow */}
            <div className="relative landscape:h-[100vh] portrait:h-[80vh]" data-oid="y_:wl1s">
                {/* Loading Skeleton */}
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-gray-900 transition-opacity duration-1000 ${
                        loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    data-oid="l::hd_."
                >
                    <div
                        className="w-full h-full flex flex-col justify-end bg-gray-800 rounded-lg animate-pulse"
                        data-oid="4mrtdzm"
                    >
                        <div
                            className="w-2/4 h-5 landscape:w-1/4 ml-10 landscape:ml-20 mb-4 bg-gray-700 rounded-lg"
                            data-oid=".at4xd9"
                        ></div>
                        <div
                            className="w-3/4 h-14 landscape:w-2/4 ml-10 landscape:ml-20 mb-4 bg-gray-700 rounded-lg"
                            data-oid="q0pc.vy"
                        ></div>
                        <div
                            className="w-3/4 h-1/4 landscape:w-2/4 ml-10 landscape:ml-20 mb-20 bg-gray-700 rounded-lg"
                            data-oid="z0oswi8"
                        ></div>
                    </div>
                </div>

                {/* Actual Content with Fade-in Effect */}
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    data-oid="3g:tb06"
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            data-oid="n9av4rc"
                        >
                            <div className="absolute inset-0 bg-black/50 z-10" data-oid="w1.bp86" />
                            <div
                                className="w-full h-full bg-center pan-animation transition-transform duration-1000 transform-gpu"
                                style={{ backgroundImage: `url(${slide.image})` }}
                                data-oid="oge2g_e"
                            ></div>
                            <div
                                className="absolute bottom-0 left-0 right-0 z-20 p-10 md:p-20 bg-gradient-to-t from-gray-900"
                                data-oid="r67whkn"
                            >
                                <div className="container mx-auto" data-oid="4w:sfq7">
                                    <h1
                                        className="text-4xl md:text-5xl font-sans font-medium mt-2 mb-4"
                                        data-oid="c1vi563"
                                    >
                                        {slide.title}
                                    </h1>
                                    <span
                                        className="text-purple-400 text-base font-semibold flex flex-wrap gap-2"
                                        data-oid="q7:itw5"
                                    >
                                        {Array.isArray(slide.genre) ? (
                                            slide.genre.map((genre, index) => (
                                                <span key={index} data-oid="awdxz__">
                                                    <Link
                                                        href={`/genre/${encodeURIComponent(genre)}`}
                                                        className="bg-purple-700/50 hover:bg-gray-600/50 text-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                                                        data-oid="i08_kh4"
                                                    >
                                                        {genre}
                                                    </Link>
                                                </span>
                                            ))
                                        ) : (
                                            <Link
                                                href={`/genre/${encodeURIComponent(slide.genre)}`}
                                                className="bg-purple-700/50 hover:bg-gray-600/50 text-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                                                data-oid="gy5qx_-"
                                            >
                                                {slide.genre}
                                            </Link>
                                        )}
                                    </span>

                                    <p
                                        className="text-gray-300 text-lg font-sans max-w-xl overflow-hidden line-clamp-5"
                                        data-oid="a:-go_r"
                                    >
                                        {slide.description}
                                    </p>
                                    <div
                                        className="flex justify-start landscape:gap-4 mt-8"
                                        data-oid="7pc69z8"
                                    >
                                        <Link
                                            href={
                                                slide.type === 'movie'
                                                    ? `/watch/movie/${slide.title}`
                                                    : `/watch/tvshow/${slide.title}`
                                            }
                                            className="bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-4 landscape:py-2 py-2 md:px-8 md:py-3 landscape:rounded-3xl rounded-s-2xl flex flex-row gap-1 items-center transition-colors text-sm md:text-base"
                                            data-oid="9kxi2kg"
                                        >
                                            <PlayIcon className="size-5" data-oid="nhshn52" />
                                            Play Now
                                        </Link>
                                        <Link
                                            href={
                                                slide.type === 'movie'
                                                    ? `/movie/${slide.title}`
                                                    : `/tvshow/${slide.title}`
                                            }
                                            className="bg-gray-800/80 hover:bg-gray-700/80 px-4 landscape:py-2 py-2  md:px-8 md:py-3 landscape:rounded-3xl rounded-e-2xl transition-colors text-sm md:text-base flex flex-row gap-1"
                                            data-oid="g-l4vns"
                                        >
                                            More Info{' '}
                                            <InformationCircleIcon
                                                className="size-5"
                                                data-oid="lc1q9kp"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <NewContentSection data-oid=":giuhms" />
        </div>
    );
}
