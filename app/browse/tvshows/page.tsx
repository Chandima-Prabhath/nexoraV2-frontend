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
        <div className="portrait:p-2 p-4" data-oid="n2:_pgl">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="ae6-.3e">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                        data-oid="nmkri01"
                    ></div>
                </div>
            ) : (
                <>
                    {/* Default TV Shows Grid */}
                    <div
                        key={currentPage}
                        className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                        data-oid="lzyd1tg"
                    >
                        {tvshows.map((show, index) => (
                            <div
                                key={`${show.title}-${index}`}
                                className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                data-oid="rct63vr"
                            >
                                <TvShowCard
                                    title={show.title}
                                    episodesCount={show.episodeCount}
                                    data-oid="k259d8k"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div
                        className="mt-12 flex flex-row items-center justify-center gap-2"
                        data-oid="tv8c_oq"
                    >
                        <div className="flex items-center gap-2" data-oid="djdzja-">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="vy3:pbt"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ithecvc"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        data-oid="s6-ahz3"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="3o:hlwp"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="hshz1fz"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="ur0xm_r"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2" data-oid="flleluo">
                            <span
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                data-oid="o6jdc8l"
                            >
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-2" data-oid="mvf4as4">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="urckp54"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ic4kb.e"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="k3a5i-q"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="r.gov:g"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="stt:nzr"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        data-oid="qf14v4d"
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
        <div className="page min-h-screen pt-20 pb-4" data-oid="g:6lbe-">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="rfwhupx">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="s_fx0hn">
                    <h2 className="text-4xl font-bold text-white" data-oid="i2lnnbw">
                        TV Shows
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="_-_30bb">
                        Explore our collection of TV series from various genres. From drama to
                        comedy, find your next binge-worthy show here.
                    </p>
                    <GenresFilter
                        mediaType="series"
                        onFilterChange={setFilterActive}
                        data-oid="rm:i33j"
                    />
                </div>

                {/* Content Section */}
                {!filterActive && (
                    <div
                        className="bg-gray-800/30 rounded-3xl backdrop-blur-sm border border-gray-700/50"
                        data-oid="qbe.vm6"
                    >
                        <Suspense
                            fallback={
                                <div
                                    className="flex items-center justify-center min-h-[50vh]"
                                    data-oid="y_wp-ye"
                                >
                                    <div
                                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                                        data-oid="12i7scm"
                                    ></div>
                                </div>
                            }
                            data-oid="ocs:-_m"
                        >
                            <TvShowsContent data-oid="0vw1_jx" />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
