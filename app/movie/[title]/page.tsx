'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMovieMetadata } from '@/lib/lb';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useLoading } from '@/components/loading/SplashScreen';
import Link from 'next/link';
import CastSection from '@/components/sections/CastSection';
import { PlayIcon } from '@heroicons/react/24/outline';

export default function MovieTitlePage() {
    const { title } = useParams();
    const decodedTitle = decodeURIComponent(Array.isArray(title) ? title[0] : title);

    interface Movie {
        name: string;
        image: string;
        translations?: any;
        year?: number;
        genres?: any[];
        score?: number;
        contentRatings?: any[];
        characters?: any;
        artworks?: any[];
        file_structure?: any;
    }

    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const data = await getMovieMetadata(decodedTitle);
                setMovie(data.data as Movie);
            } catch (error) {
                console.error('Failed to fetch movie details', error);
            }
        }
        fetchMovie();
    }, [decodedTitle]);

    if (!movie) {
        return <LoadingSkeleton data-oid="jqmlniy" />;
    }

    return (
        <div
            className="page relative w-full min-h-screen h-full flex items-start landscape:pt-24 pt-28 text-white"
            style={{
                backgroundImage: `url(${movie.artworks?.[0]?.image || movie.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundAttachment: 'fixed',
            }}
            data-oid="oo5okx8"
        >
            {/* Gradient Overlays */}
            <div className="h-screen fixed inset-0" data-oid="sxu9dm_">
                <div
                    className="h-full bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-gray-900/90"
                    data-oid="ifbddio"
                ></div>
            </div>

            {/* Main Content Container */}
            <div
                className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                data-oid="igsokki"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="6kseqcc">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6" data-oid="2dark0v">
                        <div
                            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
                            data-oid="xftrcvj"
                        >
                            {/* Title and Year */}
                            <div className="space-y-2" data-oid="54-fa7v">
                                <h1 className="text-4xl font-bold text-white" data-oid="ko:o3._">
                                    {movie.translations?.nameTranslations?.find(
                                        (t: { language: string; name: string }) =>
                                            t.language === 'eng',
                                    )?.name ||
                                        movie.translations?.nameTranslations?.find(
                                            (t: {
                                                isAlias: boolean;
                                                language: string;
                                                name: string;
                                            }) => t.isAlias && t.language === 'eng',
                                        )?.name ||
                                        movie?.name ||
                                        'Unknown Title'}
                                </h1>
                                <div
                                    className="flex items-center gap-3 text-gray-300"
                                    data-oid="ioyb9wh"
                                >
                                    <span className="text-lg" data-oid=":9_szf2">
                                        {movie.year}
                                    </span>
                                    <span data-oid="o6sjf8l">•</span>
                                    <span
                                        className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm"
                                        data-oid="p08w2ui"
                                    >
                                        Movie
                                    </span>
                                </div>
                            </div>
                            {/* Genres and Score */}
                            <div
                                className="flex flex-wrap items-center gap-4 mt-4"
                                data-oid="jd_:e49"
                            >
                                <div className="flex items-center gap-2" data-oid="d:ehbw8">
                                    <span
                                        className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                        data-oid="cgw5de_"
                                    >
                                        ⭐ {movie.score ? (movie.score / 1000).toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="t6r1p.e">
                                    {Array.isArray(movie.genres)
                                        ? movie.genres.map((genre) => (
                                              <Link
                                                  key={genre.id}
                                                  href={`/genre/${encodeURIComponent(genre.slug)}`}
                                                  className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                                                  data-oid="g.wawra"
                                              >
                                                  {genre.name}
                                              </Link>
                                          ))
                                        : null}
                                </div>
                            </div>
                            {/* Content Ratings */}
                            {Array.isArray(movie.contentRatings) &&
                            movie.contentRatings.length > 0 ? (
                                <div className="mt-6" data-oid="beabj1.">
                                    <h3
                                        className="text-lg font-semibold text-gray-200 mb-3"
                                        data-oid="ypcu8ls"
                                    >
                                        Content Ratings
                                    </h3>
                                    <ul className="flex flex-wrap gap-3" data-oid="qtdbmg:">
                                        {movie.contentRatings.map((rating, index) => {
                                            const countryFlags = {
                                                AUS: '🇦🇺',
                                                USA: '🇺🇸',
                                                GBR: '🇬🇧',
                                                EU: '🇪🇺',
                                                JPN: '🇯🇵',
                                                KOR: '🇰🇷',
                                                CAN: '🇨🇦',
                                                DEU: '🇩🇪',
                                                FRA: '🇫🇷',
                                                ESP: '🇪🇸',
                                                ITA: '🇮🇹',
                                            };

                                            const flag =
                                                countryFlags[
                                                    rating.country.toUpperCase() as keyof typeof countryFlags
                                                ] || '🌍';

                                            return (
                                                <li
                                                    key={index}
                                                    className="flex items-center bg-gray-800/50 px-2 py-1 rounded-md text-xs"
                                                    data-oid="1gf7ys3"
                                                >
                                                    <span className="mr-2" data-oid="5m:gb43">
                                                        {flag}
                                                    </span>
                                                    <span
                                                        className="text-white font-semibold"
                                                        data-oid="wk7za_2"
                                                    >
                                                        {rating.name}
                                                    </span>
                                                    <span
                                                        className="text-gray-400 ml-1"
                                                        data-oid="6_0lvvu"
                                                    >
                                                        {' '}
                                                        - {rating.description || 'N/A'}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm" data-oid="_uhsf1e">
                                    No content ratings available.
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div
                                className="flex justify-start landscape:gap-2 mt-4"
                                data-oid="_uwb90y"
                            >
                                <Link
                                    href={`/watch/movie/${encodeURIComponent(decodedTitle)}`}
                                    className="bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-4 py-2 md:px-8 landscape:rounded-3xl rounded-s-2xl flex items-center gap-1 transition-colors text-sm md:text-base"
                                    data-oid="k:mbnk4"
                                >
                                    <PlayIcon className="size-5" data-oid="urpd3kx" />
                                    Play Now
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-gray-800/80 hover:bg-gray-700/80 px-4 py-2 md:px-8 landscape:rounded-3xl rounded-e-2xl transition-colors text-sm md:text-base"
                                    data-oid="v0s61bn"
                                >
                                    Add to My List
                                </Link>
                            </div>
                        </div>
                        {/* Overview Section */}
                        <div
                            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
                            data-oid="ouop9w0"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-200 mb-3"
                                data-oid="7a6ky4n"
                            >
                                Overview
                            </h3>
                            <p className="text-gray-300 leading-relaxed" data-oid="nlr586l">
                                {movie.translations?.overviewTranslations?.find(
                                    (t: { language: string; overview: string }) =>
                                        t.language === 'eng',
                                )?.overview ||
                                    movie.translations?.overviewTranslations?.[0]?.overview ||
                                    'No overview available.'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Cast */}
                    <div className="lg:col-span-1" data-oid="75iz6fx">
                        <CastSection movie={movie} data-oid="h-0mzb7" />
                    </div>
                </div>
            </div>
        </div>
    );
}
