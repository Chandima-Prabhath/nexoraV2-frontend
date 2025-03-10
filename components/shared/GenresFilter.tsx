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
        <div data-oid="bh_3db8">
            <div className="flex flex-wrap gap-2" data-oid=":20.m46">
                <button
                    className={`${
                        isSelected('All') ? 'bg-gray-500' : 'hover:bg-gray-700 bg-gray-800'
                    } p-1 rounded-xl transition-all duration-300 ease-in-out flex text-center items-center`}
                    disabled={spinnerLoading}
                    onClick={handleFilter}
                    data-oid="qvppjd9"
                >
                    <FunnelIcon className="size-5" data-oid="-xnjtua" />
                    <p className="text-sm" data-oid="e4ppih1">
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
                    data-oid=":pt6to4"
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
                            data-oid="egj3f6y"
                        >
                            {genre.name}{' '}
                            <span className="text-xs text-gray-500" data-oid="p62.n__">
                                ({genre.density})
                            </span>
                        </button>
                    ))}
                {genreCategories?.length > 5 && (
                    <button
                        className="text-gray-500 hover:text-gray-400"
                        onClick={() => setShowAll(!showAll)}
                        data-oid="gd5ek54"
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>

            <div className="portrait:p-2 p-4" data-oid="aky0v6j">
                {spinnerLoading ? (
                    <></>
                ) : (
                    <>
                        <div
                            className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                            data-oid="zdvo47_"
                        >
                            {genresItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                    data-oid="rwf4mpd"
                                >
                                    {mediaType === 'movie' ? (
                                        <MovieCard title={item.title} data-oid="y4nfuoz" />
                                    ) : (
                                        <TvShowCard
                                            title={item.title}
                                            episodesCount={null}
                                            data-oid="fmkh67h"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {genresItems.length > 0 && (
                            <div
                                className="mt-12 flex flex-row items-center justify-center gap-2"
                                data-oid=".itppcn"
                            >
                                <div className="flex items-center gap-2" data-oid="r724_1x">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="sk9:p5c"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="cg6flng"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                                data-oid="701769."
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="9xbongg"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="a72n.rk"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                                data-oid="lzw6dvb"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2" data-oid="vde-8l_">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                        data-oid="wlwde74"
                                    >
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2" data-oid="z8b5gd.">
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="bbi7idz"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="pr6w0.r"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="b9fha0:"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="atmruy:"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid=".q6sqj_"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                                data-oid="i3wjxv_"
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
