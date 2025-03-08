'use client';

import { useRouter } from 'next/navigation';
import MoviePlayer from '@/components/movie/MoviePlayer';
import { useParams } from 'next/navigation';
const MoviePlayerPage = () => {
    // Assuming you get the movie title from the route params
    const router = useRouter();
    const { title } = useParams();
    const videoTitle = Array.isArray(title) ? title[0] : title;

    const handleClose = () => {
        router.back();
    };

    if (!title) {
        return <div data-oid="w6._haz">Movie title is missing.</div>;
    }
    return (
        <MoviePlayer
            videoTitle={decodeURIComponent(videoTitle) as string}
            onClosePlayer={handleClose}
            data-oid="i9k-1k4"
        />
    );
};

export default MoviePlayerPage;
