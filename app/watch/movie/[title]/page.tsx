'use client';

import { useRouter } from 'next/navigation';
import MoviePlayer from '@/components/movie/MoviePlayer';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMovieMetadata } from '@/lib/lb';

interface Movie {
    name: string;
    image: string;
    translations?: any;
    year?: number;
    genres?: any[];
    score?: number;
    contentRatings?: any[];
    characters?: any;
    artworks?: any[];
}

interface ContentRating {
    country: string;
    name: string;
    description: string;
}

const MoviePlayerPage = () => {
    // Assuming you get the movie title from the route params
    const router = useRouter();
    const { title } = useParams();
    const videoTitle = Array.isArray(title) ? title[0] : title;

    const handleClose = () => {
        router.back();
    };

    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const data = await getMovieMetadata(decodeURIComponent(videoTitle));
                setMovie(data.data as Movie);
                console.log(data.data?.contentRatings);
            } catch (error) {
                console.error('Failed to fetch movie details', error);
            }
        }
        fetchMovie();
    }, [videoTitle]);

    function formatContentRatings(contentRatings: any[]): ContentRating[] | undefined {
        if (!contentRatings || contentRatings.length === 0) return undefined;
        return contentRatings.map(({ country, name, description }) => ({ country, name, description }));
    }
        
    const formattedContentRating = movie?.contentRatings ? formatContentRatings(movie.contentRatings) : undefined;

    console.log(formattedContentRating);

    // Select a random background image (type 15) for the thumbnail
    const getRandomThumbnail = (artworks?: any[]): string => {
        if (!artworks) return '';
        const backgrounds = artworks.filter((artwork) => artwork.type === 15); // Filter for type 15 (backgrounds)
        if (backgrounds.length === 0) return ''; // No backgrounds found, return default empty string
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]; // Randomly select one
        return randomBackground.thumbnail || ''; // Return the thumbnail (or fallback if undefined)
    };

    const randomThumbnail = getRandomThumbnail(movie?.artworks);

    if (!title) {
        handleClose();
    }

    return (
        <>
            {movie && (
                <MoviePlayer
                    videoTitle={decodeURIComponent(videoTitle) as string}
                    movieTitle={movie.name}
                    thumbnail={randomThumbnail || movie.image}
                    poster={movie.image}
                    contentRatings={formattedContentRating}
                    onClosePlayer={handleClose}
                />
            )}
        </>
    );
};

export default MoviePlayerPage;
