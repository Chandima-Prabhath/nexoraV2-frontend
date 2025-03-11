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
        <div className="portrait:p-2 p-4" data-oid="jb-zwes">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="3:b_wbb">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                        data-oid=":p86tfv"
                    ></div>
                </div>
            ) : (
                <>
                    {/* Default Movies Grid */}
                    <div
                        key={currentPage}
                        className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                        data-oid="iysxn3:"
                    >
                        {movies.map((movie, index) => (
                            <div
                                key={`${movie.title}-${index}`}
                                className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                data-oid="ralsfjy"
                            >
                                <MovieCard title={movie.title} data-oid="7-7i-wl" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div
                        className="mt-12 flex flex-row items-center justify-center gap-2"
                        data-oid="_fumrg0"
                    >
                        <div className="flex items-center gap-2" data-oid="n3mkczb">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="so3e3j_"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="s:y8ivy"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        data-oid="oy88951"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="l2b3jqf"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="fmwlixs"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="ch6s:ye"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2" data-oid="-26w70m">
                            <span
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                data-oid="q-fok63"
                            >
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className="flex items-center gap-2" data-oid="-rtj8gn">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="j.:i4ud"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="08qu63t"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="i8e0b4-"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 transition-colors"
                                data-oid="c:nyp:w"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="otd2s70"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        data-oid="r7-sz:e"
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
        <div className="page min-h-screen pt-20 pb-4" data-oid="57.rf:y">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="7txq7pb">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="2s:izep">
                    <h2 className="text-4xl font-bold text-white" data-oid="_hy3yqm">
                        Movies
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="5jp-jv.">
                        Explore our collection of movies from various genres. From action to
                        romance, find your next movie night selection here.
                    </p>
                    <GenresFilter
                        mediaType="movie"
                        onFilterChange={setFilterActive}
                        data-oid="gumf0mr"
                    />
                </div>

                {/* Content Section */}
                {!filterActive && (
                    <div
                        className="bg-gray-800/30 rounded-3xl backdrop-blur-sm border border-gray-700/50"
                        data-oid="45m3bme"
                    >
                        <Suspense
                            fallback={
                                <div
                                    className="flex items-center justify-center min-h-[50vh]"
                                    data-oid="5gyp5i-"
                                >
                                    <div
                                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
                                        data-oid="lg0uu4b"
                                    ></div>
                                </div>
                            }
                            data-oid="v7d9f3w"
                        >
                            <MoviesContent data-oid="9k38v0j" />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
