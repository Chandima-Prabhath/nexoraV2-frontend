import React, { useEffect, useState, useRef } from 'react';
import { getMovieLinkByTitle } from '@/lib/lb';

interface MovieLinkFetcherProps {
    title: string;
    onCancel?: () => void;
    onVideoLinkFetched: (url: string) => void;
}

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

const MovieLinkFetcher: React.FC<MovieLinkFetcherProps> = ({
    title,
    onCancel,
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
        fetchMovieLink();
        return () => {
            if (pollingInterval) clearInterval(pollingInterval);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    return (
        <div className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-md" data-oid="vvphqe1">
            <h2 className="text-xl font-semibold mb-4" data-oid="0tsia7.">
                Fetching Video Link
            </h2>
            {progress ? (
                <div className="space-y-2" data-oid="xxr2e-g">
                    <p className="text-sm" data-oid="vbpgm.d">
                        Status: {progress.status}
                    </p>
                    <p className="text-sm" data-oid="dw1pv31">
                        Progress: {progress.progress.toFixed(2)}%
                    </p>
                    <p className="text-sm" data-oid="lna-q-l">
                        Downloaded: {progress.downloaded} / {progress.total}
                    </p>
                </div>
            ) : (
                <p className="text-sm" data-oid=":dwyu_n">
                    Initializing...
                </p>
            )}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white font-semibold transition-colors"
                    data-oid="zgczbvu"
                >
                    Cancel
                </button>
            )}
        </div>
    );
};

export default MovieLinkFetcher;
