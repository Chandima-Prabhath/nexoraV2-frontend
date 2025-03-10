'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllMovies } from '@/lib/lb';
import { MovieCard } from '@/components/movie/MovieCard';
import { useLoading } from '@/components/loading/SplashScreen';
import GenresFilter from '@/components/shared/GenresFilter';

function MoviesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [movies, setMovies] = useState<any[]>([]);
    const [allMovies, setAllMovies] = useState<any[]>([]);
    const { loading, setLoading } = useLoading();
    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(1);

    // Fetch all movies once on mount
    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            try {
                const data = await getAllMovies();
                if (data.length) {
                    // Sort the data to ensure a consistent order (e.g., alphabetically by title)
                    const sortedData = [...data].sort((a, b) => a.title.localeCompare(b.title));
                    setAllMovies(sortedData);
                    setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching TV shows:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update the displayed movies when the page or full list changes
    useEffect(() => {
        if (allMovies.length) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            setMovies(allMovies.slice(startIndex, startIndex + itemsPerPage));
        }
    }, [allMovies, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            router.push(`/movies?page=${newPage}`);
        }
    };

    return (
        <div className="portrait:p-2 p-4" data-oid="qkl93:n">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="4:_e-5o">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                        data-oid="ss1s4:7"
                    ></div>
                </div>
            ) : (
                <>
                    {/* Default Movies Grid */}
                    <div
                        key={currentPage}
                        className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                        data-oid="hqe2alr"
                    >
                        {movies.map((movie, index) => (
                            <div
                                key={`${movie.title}-${index}`}
                                className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                data-oid="sg1w1u4"
                            >
                                <MovieCard title={movie.title} data-oid="dggbko5" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div
                        className="mt-12 flex flex-row items-center justify-center gap-2"
                        data-oid="2z7h7v6"
                    >
                        <div className="flex items-center gap-2" data-oid="x6e7q3-">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="y4b5qgq"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="hyfrivc"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        data-oid="ieth:b8"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="f9on855"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="_f-f1_n"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="y8gkmzp"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2" data-oid="mz39fub">
                            <span
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                data-oid="tx7xzpw"
                            >
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-2" data-oid="6s.kasa">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="ia_:lby"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="aavpwsx"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="bxyoj2j"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="rxuw:a2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="7d7ua.p"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        data-oid="b8a6p.5"
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

export default function MoviesPage() {
    const [filterActive, setFilterActive] = useState(false);

    return (
        <div className="page min-h-screen pt-20 pb-4" data-oid="b.2afzc">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="wsskd0_">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="cttwb7d">
                    <h2 className="text-4xl font-bold text-white" data-oid="s7bikhw">
                        Movies
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="ga0gn-r">
                        Explore our collection of movies from various genres. From action to
                        romance, find your next movie night selection here.
                    </p>
                    <GenresFilter
                        mediaType="movie"
                        onFilterChange={setFilterActive}
                        data-oid="kkm:46c"
                    />
                </div>

                {/* Content Section */}
                {!filterActive && (
                    <div
                        className="bg-gray-800/30 rounded-3xl backdrop-blur-sm border border-gray-700/50"
                        data-oid="vagw0.-"
                    >
                        <Suspense
                            fallback={
                                <div
                                    className="flex items-center justify-center min-h-[50vh]"
                                    data-oid="ljf0ydj"
                                >
                                    <div
                                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                                        data-oid="wp6qe4o"
                                    ></div>
                                </div>
                            }
                            data-oid="m5xvynv"
                        >
                            <MoviesContent data-oid="w4vrpxl" />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
