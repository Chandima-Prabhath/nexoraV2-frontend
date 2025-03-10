'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { SEARCH_API_URL } from '@/lib/config';
import { useSpinnerLoading } from '@/components/loading/Spinner';
import { MovieCard } from '@/components/movie/MovieCard';
import { TvShowCard } from '@/components/tvshow/TvShowCard';
import ScrollSection from '@/components/sections/ScrollSection';
import { getSeasonMetadata } from '@/lib/lb';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
        <div
            className="page min-h-screen pt-20 pb-4 bg-gradient-to-b from-black to-gray-900"
            data-oid="_mu3opa"
        >
            <div className="container mx-auto portrait:px-3 px-4" data-oid="38mnv40">
                {/* Header Section */}
                <div className="mb-8 space-y-2" data-oid="ku4ba_8">
                    <h2
                        className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                        data-oid="u5u7zeg"
                    >
                        Search
                    </h2>
                    <p className="text-gray-400 max-w-3xl" data-oid="xet3q:j">
                        Find your favorite movies, TV shows, and episodes
                    </p>
                </div>

                {/* Search + Filters */}
                <form onSubmit={handleSubmit} className="mb-10" data-oid="to:edb4">
                    <div
                        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
                        data-oid="3edp94o"
                    >
                        {/* Search Input with Icon */}
                        <div className="relative w-full md:w-96" data-oid="qtbbsyd">
                            <div
                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                data-oid="u1dybwu"
                            >
                                <MagnifyingGlassIcon
                                    className="h-5 w-5 text-gray-400"
                                    data-oid="p7ft_c4"
                                />
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
                                data-oid="91mqmxp"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-3 items-center" data-oid="x9gp21w">
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
                                        data-oid="sid4qkn"
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
                    <div
                        className="bg-red-900/30 border border-red-500/50 rounded-md p-4 mb-6"
                        data-oid="8_3yk:m"
                    >
                        <p className="text-red-400" data-oid="8:a-hm_">
                            {error}
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {spinnerLoading && query && !results && (
                    <div
                        className="flex flex-col items-center justify-center py-20"
                        data-oid="4vz5jhk"
                    >
                        <div
                            className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"
                            data-oid="alm1-jn"
                        ></div>
                        <p className="mt-4 text-gray-400" data-oid="03luqjn">
                            Searching for "{query}"...
                        </p>
                    </div>
                )}

                {/* No results state */}
                {!spinnerLoading &&
                    query &&
                    results &&
                    !results.films?.length &&
                    !results.series?.length &&
                    !flattenedEpisodes.length && (
                        <div
                            className="flex flex-col items-center justify-center py-20 text-center"
                            data-oid="vxe0w.g"
                        >
                            <div className="w-20 h-20 mb-4 text-gray-500" data-oid="7tbf.qu">
                                <MagnifyingGlassIcon className="w-full h-full" data-oid="kt:rl:g" />
                            </div>
                            <h3
                                className="text-2xl font-semibold text-white mb-2"
                                data-oid="uz44g0v"
                            >
                                No results found
                            </h3>
                            <p className="text-gray-400 max-w-md" data-oid="n3n2180">
                                We couldn't find anything matching "{query}". Try different keywords
                                or check your spelling.
                            </p>
                        </div>
                    )}

                {/* Results */}
                {results && (
                    <div className="mt-4 space-y-12" data-oid="sflswz4">
                        {/* Movies Section */}
                        {selectedTypes.includes('films') && results.films?.length > 0 && (
                            <ScrollSection title="Movies" link="/browse/movies" data-oid="wc.g4:q">
                                {results.films.map((film, index) => (
                                    <MovieCard
                                        key={index}
                                        title={film.replace('films/', '')}
                                        data-oid="87mdu1r"
                                    />
                                ))}
                            </ScrollSection>
                        )}

                        {/* TV Shows Section */}
                        {selectedTypes.includes('series') && results.series?.length > 0 && (
                            <ScrollSection
                                title="TV Shows"
                                link="/browse/tvshows"
                                data-oid="2-h6_nv"
                            >
                                {results.series.map((serie, index) => (
                                    <TvShowCard
                                        key={index}
                                        title={serie}
                                        episodesCount={null}
                                        data-oid="8s.js4s"
                                    />
                                ))}
                            </ScrollSection>
                        )}

                        {/* Episodes Section (flattened, with metadata) */}
                        {selectedTypes.includes('episodes') && flattenedEpisodes.length > 0 && (
                            <ScrollSection
                                title="Episodes"
                                link="/browse/tvshows"
                                data-oid="ue-gsl2"
                            >
                                {flattenedEpisodes.map((episode) => (
                                    <Link
                                        href={`/watch/tvshow/${episode.series}/${episode.season}/${episode.title}`}
                                        key={episode.path}
                                        className="w-[180px] flex-shrink-0 rounded-md overflow-hidden bg-gray-800/60 backdrop-blur-sm 
                                        border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300
                                        shadow-lg hover:shadow-purple-500/10 flex flex-col"
                                        data-oid="c08ye3r"
                                    >
                                        {/* Episode image with fallback */}
                                        <div
                                            className="relative h-[100px] bg-gray-900"
                                            data-oid="5xi4i65"
                                        >
                                            {episode.metadata?.image ? (
                                                <img
                                                    src={`https://artworks.thetvdb.com${episode.metadata.image}`}
                                                    alt={episode.metadata.name || episode.title}
                                                    className="w-full h-full object-cover"
                                                    data-oid="6-3srt0"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900"
                                                    data-oid="5xxxf6k"
                                                >
                                                    <span
                                                        className="text-gray-500 text-xs"
                                                        data-oid="uws0hj6"
                                                    >
                                                        No Preview
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                                                data-oid="8:504sx"
                                            ></div>
                                        </div>

                                        {/* Content */}
                                        <div
                                            className="p-3 flex flex-col flex-grow"
                                            data-oid="6g_fn15"
                                        >
                                            <h4
                                                className="text-sm font-semibold line-clamp-1 mb-1 text-white"
                                                data-oid="bx873ak"
                                            >
                                                {episode.metadata?.name ?? episode.title}
                                            </h4>

                                            {/* Series and season info */}
                                            <div
                                                className="text-xs text-purple-400 mb-2"
                                                data-oid="ms.pq6z"
                                            >
                                                {episode.series} • {episode.season}
                                            </div>

                                            {/* Overview */}
                                            <p
                                                className="text-xs text-gray-400 line-clamp-3 flex-grow"
                                                data-oid="s1enf_1"
                                            >
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
