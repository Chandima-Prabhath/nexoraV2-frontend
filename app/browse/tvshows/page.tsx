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
        <div className="portrait:p-2 p-4" data-oid="09.2ybf">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="t_jpmt1">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                        data-oid=":xzh3q6"
                    ></div>
                </div>
            ) : (
                <>
                    {/* Default TV Shows Grid */}
                    <div
                        key={currentPage}
                        className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                        data-oid="t:r.ca_"
                    >
                        {tvshows.map((show, index) => (
                            <div
                                key={`${show.title}-${index}`}
                                className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                data-oid="tv1r04x"
                            >
                                <TvShowCard
                                    title={show.title}
                                    episodesCount={show.episodeCount}
                                    data-oid="548h_wu"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div
                        className="mt-12 flex flex-row items-center justify-center gap-2"
                        data-oid="bjp-chb"
                    >
                        <div className="flex items-center gap-2" data-oid="xr.ttb0">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="ljt7tzz"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="a9vh2ut"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        data-oid="bxxhdmw"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="ktg382l"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="s.v6u3t"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="kpzjr3c"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2" data-oid=".uxqscd">
                            <span
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                data-oid="1nwwbr0"
                            >
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-2" data-oid="f567:x5">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid=":2k6hj8"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="1nacg4l"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="lz.ufci"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="dogid24"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="x.z95jd"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        data-oid="95j704v"
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
        <div className="page min-h-screen pt-20 pb-4" data-oid="a09u7ed">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="i1t5y7.">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="81gyiv-">
                    <h2 className="text-4xl font-bold text-white" data-oid="tfyrxwe">
                        TV Shows
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="nlzmy43">
                        Explore our collection of TV series from various genres. From drama to
                        comedy, find your next binge-worthy show here.
                    </p>
                    <GenresFilter
                        mediaType="series"
                        onFilterChange={setFilterActive}
                        data-oid="zrcr8o3"
                    />
                </div>

                {/* Content Section */}
                {!filterActive && (
                    <div
                        className="bg-gray-800/30 rounded-3xl backdrop-blur-sm border border-gray-700/50"
                        data-oid="_7abbj1"
                    >
                        <Suspense
                            fallback={
                                <div
                                    className="flex items-center justify-center min-h-[50vh]"
                                    data-oid=".flwxm7"
                                >
                                    <div
                                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                                        data-oid="q983.5."
                                    ></div>
                                </div>
                            }
                            data-oid="_x8_92:"
                        >
                            <TvShowsContent data-oid="0x0su0s" />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
