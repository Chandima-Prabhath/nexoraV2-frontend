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
            data-oid="e29ktg1"
        >
            <div
                className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative"
                data-oid="dz28z_s"
            >
                <h2 className="text-xl font-semibold text-center mb-4" data-oid=".o9mnk9">
                    Fetching Video Link
                </h2>

                {progress ? (
                    <div className="text-center space-y-2" data-oid="vf1hkdv">
                        <p className="text-sm" data-oid="ox5ons3">
                            Status: {progress.status}
                        </p>
                        <p className="text-sm" data-oid="fej9zav">
                            Progress: {progress.progress.toFixed(2)}%
                        </p>
                        <p className="text-sm" data-oid="hf6zae3">
                            Downloaded: {progress.downloaded} / {progress.total}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-sm" data-oid="7ay7lv5">
                        Initializing...
                    </p>
                )}

                {!videoFetched && (
                    <div
                        className="mt-4 p-2 bg-gray-700 rounded text-center text-sm text-yellow-300"
                        data-oid="9bx8sj2"
                    >
                        <p data-oid="-d8lgoz">
                            Advertisement: Your video is caching, please wait...
                        </p>
                        <div className="mt-2 flex justify-center" data-oid="jtg.wi6">
                            <img
                                src="https://www.adspeed.com/placeholder-300x250.gif"
                                alt="Ad"
                                className="h-24 rounded"
                                data-oid="3l01aaa"
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white font-semibold transition-colors"
                    data-oid="1xkm-3p"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MovieLinkFetcherModal;
