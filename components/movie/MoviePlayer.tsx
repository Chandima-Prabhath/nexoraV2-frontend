import React, { useEffect, useRef, useState } from 'react';
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
} from '@heroicons/react/24/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { getMovieLinkByTitle } from '@/lib/lb';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentRating {
    country: string;
    name: string;
    description: string;
}

interface MoviePlayerProps {
    videoTitle: string;
    contentRatings?: ContentRating[];
    onClosePlayer?: () => void; // Optional close handler for page context
}

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

const PlayerSpinner: React.FC<{ loading: boolean }> = ({ loading }) => (
    <AnimatePresence data-oid="x:4bfwy">
        {loading && (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[500] flex items-center justify-center bg-gray-900/50"
                data-oid="8gs2vns"
            >
                <div className="relative flex flex-col items-center" data-oid="j01ywl8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="relative w-16 h-16"
                        data-oid="r9nnrps"
                    >
                        <div
                            className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-l-purple-500 rounded-full"
                            data-oid="eodd5-e"
                        ></div>
                        <div
                            className="absolute inset-0 w-full h-full animate-ping rounded-full bg-purple-500 opacity-30"
                            data-oid="pkrhyh-"
                        ></div>
                    </motion.div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const MoviePlayer: React.FC<MoviePlayerProps> = ({
    videoTitle,
    contentRatings = [],
    onClosePlayer,
}) => {
    // Use local spinner state inside the player
    const [localSpinnerLoading, setLocalSpinnerLoading] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const inactivityRef = useRef<NodeJS.Timeout | null>(null);

    // Video URL & blob state
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoBlobUrl, setVideoBlobUrl] = useState<string>('');

    // Player UI states
    const [showControls, setShowControls] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isMuted = volume === 0;
    const [buffered, setBuffered] = useState(0);

    // Link fetching states
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [videoFetched, setVideoFetched] = useState(false);
    const videoFetchedRef = useRef(videoFetched);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Keep ref in sync
    useEffect(() => {
        videoFetchedRef.current = videoFetched;
    }, [videoFetched]);

    // --- Link Fetching & Polling ---
    const fetchMovieLink = async () => {
        if (videoFetchedRef.current) return;
        try {
            const response = await getMovieLinkByTitle(videoTitle);
            if (response.url) {
                // Stop any polling if running
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
                setVideoUrl(response.url);
                setVideoFetched(true);
                console.log('Video URL fetched:', response.url);
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
            if (data.progress.progress >= 100) {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                }
                // If still no video URL, try again after 5 sec
                if (!videoFetchedRef.current) {
                    timeoutRef.current = setTimeout(fetchMovieLink, 5000);
                }
            }
        } catch (error) {
            console.error('Error polling progress:', error);
        }
    };

    const startPolling = (progressUrl: string) => {
        if (!pollingInterval) {
            const interval = setInterval(() => pollProgress(progressUrl), 2000);
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
    }, [videoTitle]);

    // --- Player Control Helpers ---
    const resetInactivityTimer = () => {
        setShowControls(true);
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const updateBuffered = () => {
        if (videoRef.current) {
            const bufferedTime =
                videoRef.current.buffered.length > 0
                    ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
                    : 0;
            setBuffered(bufferedTime);
        }
    };

    // Update buffered every second (even when paused)
    useEffect(() => {
        const interval = setInterval(updateBuffered, 1000);
        return () => clearInterval(interval);
    }, []);

    // --- Fullscreen Listener ---
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    // --- Blob Fetching ---
    useEffect(() => {
        if (videoUrl) {
            setLocalSpinnerLoading(true);
            const abortController = new AbortController();
            const fetchBlob = async () => {
                try {
                    const response = await fetch(videoUrl, {
                        signal: abortController.signal,
                        mode: 'cors',
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setVideoBlobUrl(blobUrl);
                    console.log('Blob URL created:', blobUrl);
                    setLocalSpinnerLoading(false);
                } catch (error: any) {
                    if (error.name === 'AbortError') {
                        console.log('Blob fetch aborted.');
                    } else {
                        console.error('Error fetching video blob:', error);
                        console.error('Falling back to direct video URL.');
                        setVideoBlobUrl('');
                        setLocalSpinnerLoading(false);
                    }
                }
            };
            fetchBlob();
            return () => {
                abortController.abort();
                if (videoBlobUrl) {
                    URL.revokeObjectURL(videoBlobUrl);
                    console.log('Blob URL revoked:', videoBlobUrl);
                }
                setVideoBlobUrl('');
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl]);

    // --- Reset Player on New URL ---
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setVolume(1);
        setIsFullscreen(false);
        resetInactivityTimer();
        console.log(
            'Video player loaded using',
            videoBlobUrl ? 'blob' : 'direct URL',
            videoBlobUrl,
        );
        return () => {
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl]);

    // --- Video Event Handlers ---
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && !isSeeking) {
            setCurrentTime(videoRef.current.currentTime);
            updateBuffered();
        }
    };

    const handleProgress = () => {
        updateBuffered();
    };

    // Show content rating overlay briefly when playing
    const [showRatingOverlay, setShowRatingOverlay] = useState(false);
    const triggerRatingOverlay = () => {
        if (contentRatings.length > 0) {
            setShowRatingOverlay(true);
            setTimeout(() => setShowRatingOverlay(false), 5000);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setLocalSpinnerLoading(false);
        triggerRatingOverlay();
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    };

    const handleSeekStart = () => setIsSeeking(true);
    const handleSeekEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if (videoRef.current) videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setIsSeeking(false);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) videoRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        if (volume > 0) {
            setVolume(0);
            videoRef.current.volume = 0;
        } else {
            setVolume(1);
            videoRef.current.volume = 1;
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        if (!isFullscreen) {
            await containerRef.current.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const handleClose = () => {
        onClosePlayer && onClosePlayer();
    };

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        return hours > 0 ? `${hours}:${minutesStr}:${secondsStr}` : `${minutesStr}:${secondsStr}`;
    };

    // --- Progress Bar Calculations ---
    const playedPercent = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration ? (buffered / duration) * 100 : 0;

    return (
        <div
            className="z-30 absolute flex w-full h-full"
            ref={containerRef}
            onMouseMove={resetInactivityTimer}
            data-oid="o:bd6f5"
        >
            {videoUrl ? (
                <>
                    <video
                        ref={videoRef}
                        crossOrigin="anonymous"
                        className="w-full h-auto bg-black object-contain"
                        style={{ pointerEvents: 'none' }}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onProgress={handleProgress}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onWaiting={() => setLocalSpinnerLoading(true)}
                        onCanPlay={() => setLocalSpinnerLoading(false)}
                        onPlaying={() => setLocalSpinnerLoading(false)}
                        autoPlay
                        data-oid="2pffk0h"
                    >
                        <source
                            src={videoBlobUrl || videoUrl}
                            type="video/webm"
                            data-oid="dw2i1qj"
                        />
                    </video>

                    {showRatingOverlay && contentRatings.length > 0 && (
                        <div
                            className="absolute z-50 pointer-events-none"
                            style={{ top: '80px', left: '20px' }}
                            data-oid="tvfs0h3"
                        >
                            <div
                                className="px-6 py-3 bg-black bg-opacity-70 rounded-lg border border-white text-white text-3xl font-bold animate-fade-out"
                                data-oid="4cu5lza"
                            >
                                {contentRatings[0].country ? `[${contentRatings[0].country}] ` : ''}
                                {contentRatings[0].name}
                            </div>
                        </div>
                    )}
                    <PlayerSpinner loading={localSpinnerLoading} data-oid="m.kb7bc" />

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-[1000] ${
                            showControls
                                ? 'opacity-100 pointer-events-auto'
                                : 'opacity-0 pointer-events-none'
                        }`}
                        data-oid="297_k.l"
                    >
                        <div
                            className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 to-transparent"
                            data-oid="4b2c.q3"
                        >
                            <div className="flex flex-col" data-oid="bw7vaz6">
                                <h1
                                    className="text-white text-3xl font-extrabold"
                                    data-oid="i-dc.p8"
                                >
                                    {videoTitle || 'Video Player'}
                                </h1>
                                {contentRatings.length > 0 && (
                                    <div
                                        className="mt-2 inline-block bg-gray-700 text-white text-sm px-3 py-1 rounded-md"
                                        data-oid="-ebtddv"
                                    >
                                        {contentRatings[0].country
                                            ? `[${contentRatings[0].country}] `
                                            : ''}
                                        {contentRatings[0].name}
                                    </div>
                                )}
                            </div>
                            {onClosePlayer && (
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-red-400 transition-colors"
                                    data-oid=":dj43an"
                                >
                                    <XCircleIcon className="size-12" data-oid="bjbbm-k" />
                                </button>
                            )}
                        </div>
                        <div
                            className="flex flex-col p-6 bg-gradient-to-t from-black/90 to-transparent"
                            data-oid="wdhi394"
                        >
                            <div
                                className="flex items-center justify-between mb-4"
                                data-oid="alm3o8i"
                            >
                                <span className="text-white text-sm" data-oid="onbte61">
                                    {formatTime(currentTime)}
                                </span>
                                {/* Custom Progress Bar */}
                                <div className="relative w-full mx-4" data-oid="s8-r3tx">
                                    <div className="h-2 rounded bg-gray-700" data-oid="32ihpw2">
                                        <div
                                            className="h-2 rounded bg-purple-300"
                                            style={{ width: `${bufferedPercent}%` }}
                                            data-oid="w18ajo2"
                                        ></div>
                                        <div
                                            className="h-2 rounded bg-purple-700 absolute top-0 left-0"
                                            style={{ width: `${playedPercent}%` }}
                                            data-oid="u.e3kd1"
                                        ></div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration}
                                        value={
                                            isSeeking
                                                ? currentTime
                                                : videoRef.current?.currentTime || 0
                                        }
                                        onMouseDown={handleSeekStart}
                                        onTouchStart={handleSeekStart}
                                        onChange={handleSeekEnd}
                                        className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                                        data-oid="zjhgzi5"
                                    />
                                </div>
                                <span className="text-white text-sm" data-oid="bxgcn5x">
                                    {formatTime(duration)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between" data-oid="gwp-d:p">
                                <div className="flex items-center space-x-6" data-oid="1zf.2n4">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-purple-300 transition-colors"
                                        data-oid="2quxymj"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon className="size-12" data-oid="xiqtgqp" />
                                        ) : (
                                            <PlayIcon className="size-12" data-oid="awnkmo_" />
                                        )}
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="text-white hover:text-purple-300 transition-colors"
                                        data-oid="mfb._qq"
                                    >
                                        {isMuted ? (
                                            <SpeakerXMarkIcon
                                                className="size-12"
                                                data-oid="g:24okc"
                                            />
                                        ) : (
                                            <SpeakerWaveIcon
                                                className="size-12"
                                                data-oid="963l.0k"
                                            />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-24 accent-purple-500"
                                        data-oid="iwr63g1"
                                    />
                                </div>
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white hover:text-purple-300 transition-colors"
                                    data-oid="r5i362d"
                                >
                                    {!isFullscreen ? (
                                        <ArrowsPointingOutIcon
                                            className="size-12"
                                            data-oid="7bh0u:j"
                                        />
                                    ) : (
                                        <ArrowsPointingInIcon
                                            className="size-12"
                                            data-oid="13faqb2"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Link Fetcher UI while waiting for video URL
                <div
                    className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-md"
                    data-oid="f0p.hcw"
                >
                    <h2 className="text-xl font-semibold mb-4" data-oid="q34.6pe">
                        Fetching Video Link
                    </h2>
                    {progress ? (
                        <div className="space-y-2" data-oid="1xqn6_u">
                            <p className="text-sm" data-oid="e2o1bt0">
                                Status: {progress.status}
                            </p>
                            <p className="text-sm" data-oid="-02oxgo">
                                Progress: {progress.progress.toFixed(2)}%
                            </p>
                            <p className="text-sm" data-oid="47ae4c.">
                                Downloaded: {progress.downloaded} / {progress.total}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm" data-oid="6goop-d">
                            Initializing link fetching...
                        </p>
                    )}
                </div>
            )}

            <style jsx data-oid="m_kg1ka">{`
                @keyframes fade-out {
                    0% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                    }
                }
                .animate-fade-out {
                    animation: fade-out 4s forwards;
                }
            `}</style>
        </div>
    );
};

export default MoviePlayer;
