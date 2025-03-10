import { getGenresItems, getGenreCategories } from '@/lib/lb';
import { useEffect, useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { TvShowCard } from '../tvshow/TvShowCard';
import { MovieCard } from '../movie/MovieCard';
import { useSpinnerLoading } from '../loading/Spinner';

interface Genre {
    name: string;
    density: number;
}

interface GenreCompProps {
    mediaType: string;
    onFilterChange?: (active: boolean) => void;
}

export default function GenresFilter({ mediaType, onFilterChange }: GenreCompProps) {
    const [genreCategories, setGenreCategories] = useState<Genre[]>([]);
    const [selectedGenreCategories, setSelectedGenreCategories] = useState<string[]>(['All']);
    const [genresItems, setGenresItems] = useState<any[]>([]);
    const { spinnerLoading, setSpinnerLoading } = useSpinnerLoading();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        async function fetchGenreCategories() {
            setSpinnerLoading(true);
            try {
                const response = await getGenreCategories(mediaType);
                setGenreCategories(response);
            } catch (error) {
                console.error('Error fetching genre categories:', error);
            } finally {
                setSpinnerLoading(false);
            }
        }
        fetchGenreCategories();
    }, [mediaType, setSpinnerLoading]);

    const handleGenreClick = (genre: string) => {
        if (genre === 'All') {
            setSelectedGenreCategories(['All']);
            setGenresItems([]);
            setCurrentPage(1);
        } else {
            setSelectedGenreCategories((prev) => {
                const filtered = prev.filter((g) => g !== 'All');
                return filtered.includes(genre)
                    ? filtered.filter((g) => g !== genre)
                    : [...filtered, genre];
            });
            setCurrentPage(1);
        }
    };

    const isSelected = (genre: string) => selectedGenreCategories.includes(genre);

    const handleFilter = async () => {
        setSpinnerLoading(true);
        try {
            const response = await getGenresItems(
                selectedGenreCategories,
                mediaType,
                itemsPerPage,
                currentPage,
            );
            if (mediaType === 'movie') {
                setGenresItems(response?.movies || []);
            } else {
                setGenresItems(response?.series || []);
            }

            setTotalPages(Math.ceil(response?.total_series / itemsPerPage) || 1);
            const filteringActive =
                selectedGenreCategories.length > 0 &&
                !(selectedGenreCategories.length === 1 && selectedGenreCategories[0] === 'All');
            if (onFilterChange) {
                onFilterChange(filteringActive);
            }
        } catch (error) {
            console.error('Error fetching genre items:', error);
        } finally {
            setSpinnerLoading(false);
        }
    };

    // If no filter is active, clear any filtered items and notify parent.
    useEffect(() => {
        const filteringActive =
            selectedGenreCategories.length > 0 &&
            !(selectedGenreCategories.length === 1 && selectedGenreCategories[0] === 'All');
        if (!filteringActive) {
            setGenresItems([]);
            if (onFilterChange) {
                onFilterChange(false);
            }
        }
    }, [selectedGenreCategories, onFilterChange]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div data-oid="9.ae7rc">
            <div className="flex flex-wrap gap-2" data-oid="2h3f8_p">
                <button
                    className={`${
                        isSelected('All') ? 'bg-gray-500' : 'hover:bg-gray-700 bg-gray-800'
                    } p-1 rounded-xl transition-all duration-300 ease-in-out flex text-center items-center`}
                    disabled={spinnerLoading}
                    onClick={handleFilter}
                    data-oid="k3h4ib7"
                >
                    <FunnelIcon className="size-5" data-oid="5izlqul" />
                    <p className="text-sm" data-oid="tz9ei9w">
                        Filter
                    </p>
                </button>
                {/* "All" Button */}
                <button
                    key="All"
                    onClick={() => handleGenreClick('All')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-400/50 ${
                        isSelected('All')
                            ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    data-oid="l8y.amq"
                >
                    All
                </button>
                {/* Other Genre Buttons */}
                {genreCategories?.length > 0 &&
                    genreCategories.slice(0, showAll ? genreCategories.length : 5).map((genre) => (
                        <button
                            key={genre.name}
                            onClick={() => handleGenreClick(genre.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-400/50 ${
                                isSelected(genre.name)
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            data-oid="bos_d.i"
                        >
                            {genre.name}{' '}
                            <span className="text-xs text-gray-500" data-oid="ipadb5x">
                                ({genre.density})
                            </span>
                        </button>
                    ))}
                {genreCategories?.length > 5 && (
                    <button
                        className="text-gray-500 hover:text-gray-400"
                        onClick={() => setShowAll(!showAll)}
                        data-oid="7pi8z41"
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>

            <div className="portrait:p-2 p-4" data-oid="ezs0d7i">
                {spinnerLoading ? (
                    <></>
                ) : (
                    <>
                        <div
                            className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                            data-oid="hj6oc0c"
                        >
                            {genresItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                    data-oid="s50qugo"
                                >
                                    {mediaType === 'movie' ? (
                                        <MovieCard title={item.title} data-oid="6xbzo_k" />
                                    ) : (
                                        <TvShowCard
                                            title={item.title}
                                            episodesCount={null}
                                            data-oid="bfkigl7"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {genresItems.length > 0 && (
                            <div
                                className="mt-12 flex flex-row items-center justify-center gap-2"
                                data-oid="e_y1l6j"
                            >
                                <div className="flex items-center gap-2" data-oid="lfx69_l">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="d9t9:1a"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="7vd11vy"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                                data-oid="5pv:bzq"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="..ke9z."
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="yz27-fe"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                                data-oid="2k7o:fp"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2" data-oid="cy:xc5-">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                        data-oid="ao7r1-k"
                                    >
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2" data-oid="91:p308">
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="zfs8hcs"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="-9enldg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="csgx5.j"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="abdrcpa"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="xvtb-6_"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                                data-oid="lb9gk2t"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
