'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { SEARCH_API_URL } from '@/lib/config';
import { useSpinnerLoading } from '@/components/loading/Spinner';
import { MovieCard } from '@/components/movie/MovieCard';
import { TvShowCard } from '@/components/tvshow/TvShowCard';
import ScrollSection from '@/components/sections/ScrollSection';
import { getSeasonMetadata } from '@/lib/lb';
// ^ assumed signature: getSeasonMetadata(seriesName: string, seasonNum: number) => Promise<Metadata[]>

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

    const { spinnerLoading, setSpinnerLoading } = useSpinnerLoading();
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
        <div className="page min-h-screen pt-20 pb-4" data-oid="c30dpdf">
            <div className="container mx-auto portrait:px-3 px-4" data-oid="qc8wc5o">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="l_h1wg-">
                    <h2 className="text-4xl font-bold text-white" data-oid="q5f:fz6">
                        Search
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="087lc-o">
                        Search for movies, TV shows, and episodes.
                    </p>
                </div>
                {/* Search + Filters */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        {/* Search Input */}
                        <div className="flex flex-col">
                            <input
                                id="search"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type to search..."
                                className="p-2 w-72 rounded border border-gray-700 bg-[#1E1E1E] text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-2 items-center">
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
                                        className={`px-4 py-1 rounded-full transition-colors 
                    ${isActive ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 text-white' : 'bg-gray-700 text-gray-300'}
                    hover:bg-gray-600`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Error message */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Results */}
                {results && (
                    <div className="mt-4 space-y-8">
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
                                        className="w-[160px] flex-shrink-0 rounded-md bg-[#1E1E1E] border border-gray-700
                               p-2 flex flex-col text-center"
                                    >
                                        {/* If you want to show the metadata image */}
                                        {episode.metadata?.image && (
                                            <img
                                                src={`https://artworks.thetvdb.com${episode.metadata.image}`}
                                                alt={episode.metadata.name || episode.title}
                                                className="h-[90px] w-full object-contain rounded mb-2"
                                            />
                                        )}
                                        <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                                            {episode.metadata?.name ?? episode.title}
                                        </h4>
                                        {/* Display short overview, or the local series-season text */}
                                        <p className="text-xs text-gray-300 line-clamp-3">
                                            {episode.metadata?.overview
                                                ? episode.metadata.overview
                                                : `${episode.series} - ${episode.season}`}
                                        </p>
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
