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
        <div className="space-y-2" data-oid="oy_azwu">
            <ScrollSection title="Discover Movies" link={'/browse/movies'} data-oid="ntbj5.r">
                {movies.map((movie, index) => (
                    <MovieCard key={index} title={movie.title} data-oid="k4q4huw" />
                ))}
            </ScrollSection>

            <ScrollSection title="Discover TV Shows" link={'/browse/tvshows'} data-oid="n5ayj1:">
                {tvshows.map((tvshow, index) => (
                    <TvShowCard
                        key={index}
                        title={tvshow.title}
                        episodesCount={null}
                        data-oid="4kr.uwk"
                    />
                ))}
            </ScrollSection>
        </div>
    );
}
