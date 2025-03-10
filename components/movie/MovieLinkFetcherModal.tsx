import React, { useEffect, useState, useRef } from 'react';
import { getMovieLinkByTitle } from '@/lib/lb';

interface VideoLinkFetcherModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onVideoLinkFetched: (url: string) => void;
}

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

const MovieLinkFetcherModal: React.FC<VideoLinkFetcherModalProps> = ({
    title,
    isOpen,
    onClose,
    onVideoLinkFetched,
}) => {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [videoFetched, setVideoFetched] = useState(false);
    const videoFetchedRef = useRef(videoFetched);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        videoFetchedRef.current = videoFetched;
    }, [videoFetched]);

    const fetchMovieLink = async () => {
        if (videoFetchedRef.current) return;
        try {
            const response = await getMovieLinkByTitle(title);
            if (response.url) {
                setVideoFetched(true);
                onVideoLinkFetched(response.url);
            } else if (response.progress_url) {
                startPolling(response.progress_url);
            }
        } catch (error) {
            console.error('Error fetching movie link:', error);
        }
    };

    const pollProgress = async (progressUrl: string) => {
        try {
            const res = await fetch(progressUrl);
            const data: { progress: ProgressData } = await res.json();
            setProgress(data.progress);
            if (data.progress && data.progress.progress >= 100) {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
                if (!videoFetchedRef.current) {
                    timeoutRef.current = setTimeout(() => {
                        fetchMovieLink();
                    }, 5000);
                }
            }
        } catch (error) {
            console.error('Error polling progress:', error);
        }
    };

    const startPolling = (progressUrl: string) => {
        if (!pollingInterval) {
            const interval = setInterval(() => {
                pollProgress(progressUrl);
            }, 2000);
            setPollingInterval(interval);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMovieLink();
        }
        return () => {
            if (pollingInterval) clearInterval(pollingInterval);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
            data-oid="kc:klsh"
        >
            <div
                className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative"
                data-oid="de9.spn"
            >
                <h2 className="text-xl font-semibold text-center mb-4" data-oid="qtg46yl">
                    Fetching Video Link
                </h2>

                {progress ? (
                    <div className="text-center space-y-2" data-oid="c0-h-x5">
                        <p className="text-sm" data-oid="ypk1mdw">
                            Status: {progress.status}
                        </p>
                        <p className="text-sm" data-oid="..mq35x">
                            Progress: {progress.progress.toFixed(2)}%
                        </p>
                        <p className="text-sm" data-oid="-rp2buq">
                            Downloaded: {progress.downloaded} / {progress.total}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-sm" data-oid="s7:squu">
                        Initializing...
                    </p>
                )}

                {!videoFetched && (
                    <div
                        className="mt-4 p-2 bg-gray-700 rounded text-center text-sm text-yellow-300"
                        data-oid="kz35k2p"
                    >
                        <p data-oid="-1712po">
                            Advertisement: Your video is caching, please wait...
                        </p>
                        <div className="mt-2 flex justify-center" data-oid="b09-z1r">
                            <img
                                src="https://www.adspeed.com/placeholder-300x250.gif"
                                alt="Ad"
                                className="h-24 rounded"
                                data-oid="wuze82:"
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white font-semibold transition-colors"
                    data-oid="tj82l48"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MovieLinkFetcherModal;
