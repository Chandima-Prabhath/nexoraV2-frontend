'use client';

import { useEffect, useState } from 'react';
import { getNewContents } from '@/lib/lb';
import { MovieCard } from '../movie/MovieCard';
import { TvShowCard } from '@/components/tvshow/TvShowCard';
import ScrollSection from './ScrollSection';

export default function NewContentSection() {
    const [movies, setMovies] = useState<any[]>([]);
    const [tvshows, setTvShows] = useState<any[]>([]);
    useEffect(() => {
        async function fetchMovies() {
            try {
                const { movies, tvshows } = await getNewContents(20); // Correctly destructure as an object
                setMovies(movies as any[]);
                setTvShows(tvshows as any[]);
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        }
        fetchMovies();
    }, []);

    return (
        <div className="space-y-2" data-oid="d83i8ht">
            <ScrollSection title="Discover Movies" link={'/browse/movies'} data-oid="j_3ih4m">
                {movies.map((movie, index) => (
                    <MovieCard key={index} title={movie.title} data-oid="8s6jcbz" />
                ))}
            </ScrollSection>

            <ScrollSection title="Discover TV Shows" link={'/browse/tvshows'} data-oid="xbvv4v5">
                {tvshows.map((tvshow, index) => (
                    <TvShowCard
                        key={index}
                        title={tvshow.title}
                        episodesCount={null}
                        data-oid="nno-s83"
                    />
                ))}
            </ScrollSection>
        </div>
    );
}
