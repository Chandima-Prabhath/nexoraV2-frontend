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
        return <div data-oid="66yr.1u">Movie title is missing.</div>;
    }
    return (
        <MoviePlayer
            videoTitle={decodeURIComponent(videoTitle) as string}
            onClosePlayer={handleClose}
            data-oid="q7t6z0j"
        />
    );
};

export default MoviePlayerPage;
