'use client';

import { useRouter } from 'next/navigation';
import TvShowPlayer from '@/components/tvshow/TvshowPlayer';
import { useParams } from 'next/navigation';
const TvShowPlayerPage = () => {
    // Assuming you get the movie title from the route params
    const router = useRouter();
    const { title, season, episode } = useParams();
    const videoTitle = Array.isArray(title) ? title[0] : title;

    const handleClose = () => {
        router.back();
    };

    if (!title || !season || !episode) {
        return <div data-oid="3rggan.">tvshow title, season or episode is missing.</div>;
    }
    return (
        <TvShowPlayer
            videoTitle={decodeURIComponent(videoTitle) as string}
            season={season as string}
            episode={episode as string}
            onClosePlayer={handleClose}
            data-oid="-mwxdvi"
        />
    );
};

export default TvShowPlayerPage;
