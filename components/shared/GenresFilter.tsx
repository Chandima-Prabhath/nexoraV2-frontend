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
        <div data-oid="9die8se">
            <div className="flex flex-wrap gap-2" data-oid="bj4:wwy">
                <button
                    className={`${
                        isSelected('All') ? 'bg-gray-500' : 'hover:bg-gray-700 bg-gray-800'
                    } p-1 rounded-xl transition-all duration-300 ease-in-out flex text-center items-center`}
                    disabled={spinnerLoading}
                    onClick={handleFilter}
                    data-oid="s_9j2ih"
                >
                    <FunnelIcon className="size-5" data-oid="petw.01" />
                    <p className="text-sm" data-oid="7poe5xe">
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
                    data-oid="ln547hu"
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
                            data-oid=".3oi1t."
                        >
                            {genre.name}{' '}
                            <span className="text-xs text-gray-500" data-oid="ongx_:p">
                                ({genre.density})
                            </span>
                        </button>
                    ))}
                {genreCategories?.length > 5 && (
                    <button
                        className="text-gray-500 hover:text-gray-400"
                        onClick={() => setShowAll(!showAll)}
                        data-oid="rci0of1"
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>

            <div className="portrait:p-2 p-4" data-oid="4pvdp4p">
                {spinnerLoading ? (
                    <></>
                ) : (
                    <>
                        <div
                            className="flex flex-wrap justify-center items-center portrait:gap-2 gap-10"
                            data-oid="6m4xsk:"
                        >
                            {genresItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="transform transition-transform duration-300 hover:scale-105 w-[fit-content]"
                                    data-oid="09cv.-s"
                                >
                                    {mediaType === 'movie' ? (
                                        <MovieCard title={item.title} data-oid="4h7wqr8" />
                                    ) : (
                                        <TvShowCard
                                            title={item.title}
                                            episodesCount={null}
                                            data-oid="qgd80tn"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {genresItems.length > 0 && (
                            <div
                                className="mt-12 flex flex-row items-center justify-center gap-2"
                                data-oid="tmsw.-s"
                            >
                                <div className="flex items-center gap-2" data-oid="sz:_atq">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="34uetrk"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="r559lz_"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                                data-oid="608gu6u"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1 || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="yq8mac5"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="3i.rjbl"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                                data-oid="iaaufmm"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2" data-oid="kl04q-n">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium"
                                        data-oid="-b4gz40"
                                    >
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2" data-oid="kg2tms:">
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="mfip:l7"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid=":59332u"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="z:-n9ds"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage >= totalPages || spinnerLoading}
                                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
                                        data-oid="0jxy09g"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="sz9gt8."
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                                data-oid="vv4qzwt"
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
