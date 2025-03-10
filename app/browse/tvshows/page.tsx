'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllTvShows } from '@/lib/lb';
import { TvShowCard } from '@/components/tvshow/TvShowCard';
import { useLoading } from '@/components/loading/SplashScreen';
import GenresFilter from '@/components/shared/GenresFilter';

function TvShowsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [allTvShows, setAllTvShows] = useState<{ title: string; episodeCount: any }[]>([]);
    const [tvshows, setTvShows] = useState<{ title: string; episodeCount: any }[]>([]);
    const { loading, setLoading } = useLoading();
    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(1);

    // Fetch all TV shows once on mount
    useEffect(() => {
        async function fetchTvShows() {
            setLoading(true);
            try {
                const data = await getAllTvShows();
                if (data.length) {
                    // Sort the data to ensure a consistent order (e.g., alphabetically by title)
                    const sortedData = [...data].sort((a, b) => a.title.localeCompare(b.title));
                    setAllTvShows(sortedData);
                    setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching TV shows:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTvShows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update the displayed tv shows when the page or full list changes
    useEffect(() => {
        if (allTvShows.length) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            setTvShows(allTvShows.slice(startIndex, startIndex + itemsPerPage));
        }
    }, [allTvShows, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            router.push(`/tvshows?page=${newPage}`);
        }
    };

    return (
        <div className="portrait:p-2 p-4" data-oid="1p5be7j">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="nl22l95">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                        data-oid="tj2f3ji"
                    ></div>
                </div>
            ) : (
                <>
                    {/* Default TV Shows Grid */}
                    <div
                        key={currentPage}
                        className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                        data-oid="ssuo57b"
                    >
                        {tvshows.map((show, index) => (
                            <div
                                key={`${show.title}-${index}`}
                                className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                data-oid="-l4yiwk"
                            >
                                <TvShowCard
                                    title={show.title}
                                    episodesCount={show.episodeCount}
                                    data-oid="s5:2u6g"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div
                        className="mt-12 flex flex-row items-center justify-center gap-2"
                        data-oid="k5ly-77"
                    >
                        <div className="flex items-center gap-2" data-oid="f74luhk">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="opl-pvq"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="up_wzhm"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        data-oid="5uk9lb1"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="ccaml_8"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="zf15qqy"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="ugkfgxl"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2" data-oid="3bf84t-">
                            <span
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                data-oid="kfidk23"
                            >
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-2" data-oid="jpf1n9v">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="cp3bv8g"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="4rs_t.:"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="z1qk.64"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="zr8lutq"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="82h8got"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        data-oid=".kny7b4"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function TvShowsPage() {
    const [filterActive, setFilterActive] = useState(false);

    return (
        <div className="page min-h-screen pt-20 pb-4" data-oid="r6fjd7e">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="y0k1hjq">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="0kseww5">
                    <h2 className="text-4xl font-bold text-white" data-oid="nw0cynl">
                        TV Shows
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="36y2l3v">
                        Explore our collection of TV series from various genres. From drama to
                        comedy, find your next binge-worthy show here.
                    </p>
                    <GenresFilter
                        mediaType="series"
                        onFilterChange={setFilterActive}
                        data-oid="1zsl3y9"
                    />
                </div>

                {/* Content Section */}
                {!filterActive && (
                    <div
                        className="bg-gray-800/30 rounded-3xl backdrop-blur-sm border border-gray-700/50"
                        data-oid="j50jzou"
                    >
                        <Suspense
                            fallback={
                                <div
                                    className="flex items-center justify-center min-h-[50vh]"
                                    data-oid="5rlyox2"
                                >
                                    <div
                                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                                        data-oid="h7pmy:e"
                                    ></div>
                                </div>
                            }
                            data-oid="2e949gq"
                        >
                            <TvShowsContent data-oid="z4m90ox" />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
