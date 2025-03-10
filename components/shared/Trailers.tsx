import React, { useState } from 'react';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

interface Trailer {
    id: number;
    name: string;
    url: string;
    language: string;
    runtime: number;
}

interface TrailersProps {
    trailers?: Trailer[];
}
const TrailersComp: React.FC<TrailersProps> = ({ trailers }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const regex = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
    if (!trailers || trailers.length === 0) {
        return <p data-oid="voiijfp">No trailers available.</p>;
    }

    const currentTrailer = trailers[currentIndex];
    const match = currentTrailer.url.match(regex);
    const videoId = match ? match[1] : null;
    if (!videoId) return <p data-oid="ckqmw6a">Invalid trailer URL.</p>;

    // Use URL parameters to remove many of YouTube’s UI elements.
    const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&autoplay=1&loop=1&mute=1&playlist=${videoId}&rel=0&modestbranding=1&iv_load_policy=3`;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + trailers.length) % trailers.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % trailers.length);
    };

    return (
        <div className="relative h-60 w-full rounded-md mb-4" data-oid="lq9yc_j">
            <iframe
                className="h-full"
                key={currentTrailer.id}
                width="100%"
                src={embedUrl}
                allow="autoplay"
                title={currentTrailer.name}
                data-oid="ctmiy:-"
            ></iframe>
            {trailers.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full"
                        data-oid="cn2rzbw"
                    >
                        <ArrowLeftCircleIcon
                            className="size-10 text-violet-400"
                            data-oid="1pe9qyf"
                        />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full"
                        data-oid="35v_4wg"
                    >
                        <ArrowRightCircleIcon
                            className="size-10 text-violet-400"
                            data-oid=".49ytyk"
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default TrailersComp;
