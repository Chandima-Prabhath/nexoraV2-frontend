'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { SEARCH_API_URL } from '@/lib/config';
import { MovieCard } from '@/components/movie/MovieCard';
import { TvShowCard } from '@/components/tvshow/TvShowCard';
import ScrollSection from '@/components/sections/ScrollSection';
import { getSeasonMetadata } from '@/lib/lb';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type EpisodeMetadata = {
    id: number;
    seriesId: number;
    name: string;
    aired: string;
    runtime: number;
    overview: string;
    image: string; // e.g. "/banners/episodes/343913/6684232.jpg"
    number: number; // Episode number in the season
    seasonNumber: number;
    year?: string;
};

type Episode = {
    series: string;
    title: string;
    path: string;
    season: string;
    metadata?: EpisodeMetadata; // Attach the matched metadata here
};

type SearchResults = {
    films: string[];
    series: string[];
    episodes: Episode[];
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [error, setError] = useState('');

    // By default, all types (films, series, episodes) are selected
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['films', 'series', 'episodes']);

    // Toggle which types are displayed (using "pills" instead of checkboxes)
    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        );
    };

    // Helper: parse season number from something like "Season 1" or "S01"
    function parseSeasonNumber(seasonName: string): number | null {
        const match = seasonName.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    // Helper: parse episode number from something like "S01E03" or "E03"
    function parseEpisodeNumber(title: string): number | null {
        // Try the standard SxxExx first
        let match = title.match(/S(\d+)E(\d+)/i);
        if (match) {
            return parseInt(match[2], 10);
        }
        // Fallback: just Exx
        match = title.match(/E(\d+)/i);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    // Debounced search whenever 'query' changes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.trim() === '') {
                setResults(null);
                return;
            }
            doSearch(query);
        }, 500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // For manual searching if the user presses Enter
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim() !== '') {
            doSearch(query);
        }
    };

    // Core search function
    const doSearch = async (searchQuery: string) => {
        setSpinnerLoading(true);
        setError('');
        try {
            const res = await fetch(`${SEARCH_API_URL}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data: SearchResults = await res.json();

            // Now we have data. Next, fetch & attach metadata for episodes.
            const grouped = groupEpisodesBySeriesAndSeason(data.episodes);
            await attachSeasonMetadata(grouped);
            // Once done, flatten them back for display
            const flattened = flattenGroupedEpisodes(grouped);

            // Put the updated episodes & everything else in state
            setResults({
                ...data,
                episodes: flattened,
            });
        } catch (err) {
            setError('Error fetching search results');
        }
        setSpinnerLoading(false);
    };

    // Group episodes by series -> season
    function groupEpisodesBySeriesAndSeason(episodes: Episode[]) {
        const grouped: Record<string, Record<string, Episode[]>> = {};
        episodes.forEach((ep) => {
            if (!grouped[ep.series]) {
                grouped[ep.series] = {};
            }
            if (!grouped[ep.series][ep.season]) {
                grouped[ep.series][ep.season] = [];
            }
            grouped[ep.series][ep.season].push(ep);
        });
        return grouped;
    }

    // For each (series + season) group, fetch getSeasonMetadata once,
    // then match local episodes by episode number.
    async function attachSeasonMetadata(grouped: Record<string, Record<string, Episode[]>>) {
        const promises: Promise<void>[] = [];

        for (const [seriesName, seasons] of Object.entries(grouped)) {
            for (const [seasonName, episodesArr] of Object.entries(seasons)) {
                // We'll fetch metadata for that (seriesName, seasonName)
                const promise = getSeasonMetadata(seriesName, seasonName).then(
                    (seasonMeta: EpisodeMetadata[]) => {
                        // For each local ep, parse its episode number & find matching metadata
                        episodesArr.forEach((ep) => {
                            const epNum = parseEpisodeNumber(ep.title);
                            if (!epNum) return;
                            const matchedMeta = seasonMeta.find((m) => m.number === epNum);
                            if (matchedMeta) {
                                ep.metadata = matchedMeta;
                            }
                        });
                    },
                );
                promises.push(promise);
            }
        }
        await Promise.all(promises);
    }

    // Flatten grouped episodes back into a single array
    function flattenGroupedEpisodes(grouped: Record<string, Record<string, Episode[]>>): Episode[] {
        return Object.values(grouped).flatMap((seasons) =>
            Object.values(seasons).flatMap((eps) => eps),
        );
    }

    // Once everything is attached, we can just rely on `results.episodes` for final display
    const flattenedEpisodes = results?.episodes ?? [];

    return (
        <div className="page min-h-screen pt-20 pb-4">
            <div className="container mx-auto portrait:px-3 px-4">
                {/* Header Section */}
                <div className="mb-8 space-y-2">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Search
                    </h2>
                    <p className="text-gray-400 max-w-3xl">
                        Find your favorite movies, TV shows, and episodes
                    </p>
                </div>

                {/* Search + Filters */}
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        {/* Search Input with Icon */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search titles, actors, genres..."
                                className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-700 bg-gray-800/60 backdrop-blur-sm text-white 
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-300 shadow-lg"
                                autoFocus
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-3 items-center">
                            {['films', 'series', 'episodes'].map((type) => {
                                const isActive = selectedTypes.includes(type);
                                // Make the label more user-friendly
                                const label =
                                    type === 'films'
                                        ? 'Movies'
                                        : type === 'series'
                                          ? 'TV Shows'
                                          : 'Episodes';

                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleType(type)}
                                        className={`px-5 py-2 rounded-full transition-all duration-300 font-medium
                                        ${
                                            isActive
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20'
                                                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Error message */}
                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-md p-4 mb-6">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Loading state */}
                {spinnerLoading && query && !results && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-400">Searching for "{query}"...</p>
                    </div>
                )}

                {/* No results state */}
                {!spinnerLoading &&
                    query &&
                    results &&
                    !results.films?.length &&
                    !results.series?.length &&
                    !flattenedEpisodes.length && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 mb-4 text-gray-500">
                                <MagnifyingGlassIcon className="w-full h-full" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2">
                                No results found
                            </h3>
                            <p className="text-gray-400 max-w-md">
                                We couldn't find anything matching "{query}". Try different keywords
                                or check your spelling.
                            </p>
                        </div>
                    )}

                {/* Results */}
                {results && (
                    <div className="mt-4 space-y-12">
                        {/* Movies Section */}
                        {selectedTypes.includes('films') && results.films?.length > 0 && (
                            <ScrollSection title="Movies" link="/browse/movies">
                                {results.films.map((film, index) => (
                                    <MovieCard key={index} title={film.replace('films/', '')} />
                                ))}
                            </ScrollSection>
                        )}

                        {/* TV Shows Section */}
                        {selectedTypes.includes('series') && results.series?.length > 0 && (
                            <ScrollSection title="TV Shows" link="/browse/tvshows">
                                {results.series.map((serie, index) => (
                                    <TvShowCard key={index} title={serie} episodesCount={null} />
                                ))}
                            </ScrollSection>
                        )}

                        {/* Episodes Section (flattened, with metadata) */}
                        {selectedTypes.includes('episodes') && flattenedEpisodes.length > 0 && (
                            <ScrollSection title="Episodes" link="/browse/tvshows">
                                {flattenedEpisodes.map((episode) => (
                                    <Link
                                        href={`/watch/tvshow/${episode.series}/${episode.season}/${episode.title}`}
                                        key={episode.path}
                                        className="w-[180px] flex-shrink-0 rounded-md overflow-hidden bg-gray-800/60 backdrop-blur-sm 
                                        border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300
                                        shadow-lg hover:shadow-purple-500/10 flex flex-col"
                                    >
                                        {/* Episode image with fallback */}
                                        <div className="relative h-[100px] bg-gray-900">
                                            {episode.metadata?.image ? (
                                                <img
                                                    src={`https://artworks.thetvdb.com${episode.metadata.image}`}
                                                    alt={episode.metadata.name || episode.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
                                                    <span className="text-gray-500 text-xs">
                                                        No Preview
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 flex flex-col flex-grow">
                                            <h4 className="text-sm font-semibold line-clamp-1 mb-1 text-white">
                                                {episode.metadata?.name ?? episode.title}
                                            </h4>

                                            {/* Series and season info */}
                                            <div className="text-xs text-purple-400 mb-2">
                                                {episode.series} • {episode.season}
                                            </div>

                                            {/* Overview */}
                                            <p className="text-xs text-gray-400 line-clamp-3 flex-grow">
                                                {episode.metadata?.overview ||
                                                    'No description available'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </ScrollSection>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
