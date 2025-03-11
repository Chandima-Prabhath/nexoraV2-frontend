'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTvShowMetadata } from '@/lib/lb';
import { LoadingSkeleton } from './LoadingSkeleton';
import { convertMinutesToHM } from '@lib/utils';
import Link from 'next/link';
import CastSection from '@components/sections/CastSection';
import EpisodesSection from '@/components/sections/EpisodesSection';

export default function TvShowTitlePage() {
    const { title } = useParams();
    const decodedTitle = decodeURIComponent(Array.isArray(title) ? title[0] : title);

    interface TvShow {
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

    interface FileStructure {
        contents?: any[];
    }

    const [tvshow, setTvShow] = useState<TvShow | null>(null);
    const [fileStructure, setFileStructure] = useState<FileStructure>({});

    useEffect(() => {
        async function fetchMovie() {
            try {
                const data = await getTvShowMetadata(decodedTitle);
                setTvShow(data.data);
                setFileStructure(data.file_structure);
            } catch (error) {
                console.error('Failed to fetch movie details', error);
            }
        }
        fetchMovie();
    }, [decodedTitle]);

    if (!tvshow) {
        return <LoadingSkeleton data-oid="k82utn2" />;
    }

    return (
        <div
            className="page relative w-full min-h-screen h-full flex items-start landscape:pt-24 pt-28 text-white"
            style={{
                backgroundImage: `url(${tvshow.artworks?.[0]?.image || tvshow.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundAttachment: 'fixed',
            }}
            data-oid="djf6x45"
        >
            {/* Gradient Overlays */}
            <div className="h-screen fixed inset-0" data-oid="8u8si3b">
                <div
                    className="h-full bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-gray-900/90"
                    data-oid="ru-.q:z"
                ></div>
            </div>

            {/* Main Content Container */}
            <div
                className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                data-oid="j9xp1pc"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="gtkp3n3">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6" data-oid="j9y-hv9">
                        <div
                            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
                            data-oid="5rgy.u8"
                        >
                            {/* Title and Year */}
                            <div className="space-y-2" data-oid=":u-n38k">
                                <h1 className="text-4xl font-bold text-white" data-oid="n97hmsp">
                                    {tvshow.translations?.nameTranslations?.find(
                                        (t: { language: string; name: string }) =>
                                            t.language === 'eng',
                                    )?.name ||
                                        tvshow.translations?.nameTranslations?.find(
                                            (t: {
                                                isAlias: boolean;
                                                language: string;
                                                name: string;
                                            }) => t.isAlias && t.language === 'eng',
                                        )?.name ||
                                        tvshow?.name ||
                                        'Unknown Title'}
                                </h1>
                                <div
                                    className="flex items-center gap-3 text-gray-300"
                                    data-oid="6.j1x1:"
                                >
                                    <span className="text-lg" data-oid="bif5hj1">
                                        {tvshow.year}
                                    </span>
                                    <span data-oid="qmsgcfg">•</span>
                                    <span
                                        className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm"
                                        data-oid="dq23-8a"
                                    >
                                        TV Series
                                    </span>
                                </div>
                            </div>
                            {/* Genres and Score */}
                            <div
                                className="flex flex-wrap items-center gap-4 mt-4"
                                data-oid="nsgzatq"
                            >
                                <div className="flex items-center gap-2" data-oid="s1og87b">
                                    <span
                                        className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                                        data-oid="oc92vqg"
                                    >
                                        ⭐ {tvshow.score ? (tvshow.score / 1000).toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2" data-oid="rxkwtrs">
                                    {Array.isArray(tvshow.genres)
                                        ? tvshow.genres.map((genre) => (
                                              <Link
                                                  key={genre.id}
                                                  href={`/genre/${encodeURIComponent(genre.slug)}`}
                                                  className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                                                  data-oid="h3k8:dv"
                                              >
                                                  {genre.name}
                                              </Link>
                                          ))
                                        : null}
                                </div>
                            </div>
                            {/* Content Ratings */}
                            {Array.isArray(tvshow.contentRatings) &&
                            tvshow.contentRatings.length > 0 ? (
                                <div className="mt-6" data-oid="5s_dn3a">
                                    <h3
                                        className="text-lg font-semibold text-gray-200 mb-3"
                                        data-oid="f2cm6vz"
                                    >
                                        Content Ratings
                                    </h3>
                                    <ul className="flex flex-wrap gap-3" data-oid="anepq7w">
                                        {tvshow.contentRatings.map((rating, index) => {
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
                                                    data-oid="g6sv98o"
                                                >
                                                    <span className="mr-2" data-oid="kjun7n6">
                                                        {flag}
                                                    </span>
                                                    <span
                                                        className="text-white font-semibold"
                                                        data-oid="z5_-t6d"
                                                    >
                                                        {rating.name}
                                                    </span>
                                                    <span
                                                        className="text-gray-400 ml-1"
                                                        data-oid="zt0ixi."
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
                                <p className="text-gray-400 text-sm" data-oid="m7f_taw">
                                    No content ratings available.
                                </p>
                            )}
                            {/* Action Buttons */}
                            <div
                                className="flex justify-start landscape:gap-2 mt-4"
                                data-oid="xlgjjmq"
                            >
                                <Link
                                    href={'#play'}
                                    className="bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-4 py-2 md:px-8 landscape:rounded-3xl rounded-s-2xl flex items-center transition-colors text-sm md:text-base"
                                    data-oid="q29mt4r"
                                >
                                    <svg
                                        className="w-4 h-4 md:w-5 md:h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="is-ep73"
                                    >
                                        <path d="M4 4l12 6-12 6V4z" data-oid="k4_y71k" />
                                    </svg>
                                    Play Now
                                </Link>
                                <Link
                                    href={'#'}
                                    className="bg-gray-800/80 hover:bg-gray-700/80 px-4 py-2 md:px-8 landscape:rounded-3xl rounded-e-2xl transition-colors text-sm md:text-base"
                                    data-oid="qim:dia"
                                >
                                    Add to My List
                                </Link>
                            </div>
                        </div>
                        {/* Overview Section */}
                        <div
                            className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50"
                            data-oid="4_yj2i3"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-200 mb-3"
                                data-oid="5gynmya"
                            >
                                Overview
                            </h3>
                            <p className="text-gray-300 leading-relaxed" data-oid="u2dv0.y">
                                {tvshow.translations?.overviewTranslations?.find(
                                    (t: { language: string; overview: string }) =>
                                        t.language === 'eng',
                                )?.overview ||
                                    tvshow.translations?.overviewTranslations?.[0]?.overview ||
                                    'No overview available.'}
                            </p>
                        </div>
                        {/* Episodes Section */}
                        <EpisodesSection
                            fileStructure={fileStructure}
                            tvshow={title}
                            data-oid="7nv4gbq"
                        />
                    </div>

                    {/* Right Column - Cast */}
                    <div className="lg:col-span-1" data-oid="nyled:p">
                        <CastSection movie={tvshow} data-oid="fxs3q8x" />
                    </div>
                </div>
            </div>
        </div>
    );
}
