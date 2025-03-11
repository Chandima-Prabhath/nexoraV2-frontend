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
        <div className="space-y-2">
            <ScrollSection title="Discover Movies" link={'/browse/movies'}>
                {movies.map((movie, index) => (
                    <MovieCard key={index} title={movie.title} />
                ))}
            </ScrollSection>

            <ScrollSection title="Discover TV Shows" link={'/browse/tvshows'}>
                {tvshows.map((tvshow, index) => (
                    <TvShowCard key={index} title={tvshow.title} episodesCount={null} />
                ))}
            </ScrollSection>
        </div>
    );
}
