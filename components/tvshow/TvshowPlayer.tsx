'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { getEpisodeLinkByTitle } from '@/lib/lb';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentRating {
    country: string;
    name: string;
    description: string;
}

interface TvShowPlayerProps {
    videoTitle: string;
    season: string;
    episode: string;
    contentRatings?: ContentRating[];
    onClosePlayer?: () => void;
}

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

const PlayerSpinner: React.FC<{ loading: boolean }> = ({ loading }) => (
    <AnimatePresence>
        {loading && (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[500] flex items-center justify-center bg-gray-900/50"
            >
                <div className="relative flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="relative w-16 h-16"
                    >
                        <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-l-purple-500 rounded-full"></div>
                        <div className="absolute inset-0 w-full h-full animate-ping rounded-full bg-purple-500 opacity-30"></div>
                    </motion.div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const TvShowPlayer: React.FC<TvShowPlayerProps> = ({
    videoTitle,
    season,
    episode,
    contentRatings = [],
    onClosePlayer,
}) => {
    // Extract season and episode info using regex
    const episodeRegex = /.*S(\d+)E(\d+).*?-\s*(.*?)(?=\..*|$)/i;
    const episodeMatch = episode.match(episodeRegex);
    const seasonNumber = episodeMatch ? episodeMatch[1] : season;
    const episodeNumber = episodeMatch ? episodeMatch[2] : '';
    const episodeTitleClean = episodeMatch
        ? decodeURIComponent(episodeMatch[3])
        : decodeURIComponent(episode);

    // Use local spinner state inside the player
    const [localSpinnerLoading, setLocalSpinnerLoading] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const inactivityRef = useRef<NodeJS.Timeout | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Video URL & blob state
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoBlobUrl, setVideoBlobUrl] = useState<string>('');
    const [isVideoTs, setIsVideoTs] = useState<boolean>(false);

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

    // Progress bar hover preview state
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number | null>(null);

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
            const response = await getEpisodeLinkByTitle(videoTitle, season, episode);
            if (response.url) {
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
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoTitle]);

    // --- Player Control Helpers ---
    const resetInactivityTimer = () => {
        setShowControls(true);
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => setShowControls(false), 5000);
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

    // --- Video Source Handling (Blob or HLS) ---
    useEffect(() => {
        if (videoUrl) {
            const isTsVideo = videoUrl.toLowerCase().endsWith('.ts');
            setIsVideoTs(isTsVideo);

            if (isTsVideo) {
                if (Hls.isSupported()) {
                    setLocalSpinnerLoading(true);
                    const hls = new Hls();
                    hlsRef.current = hls;
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        console.error('HLS.js error:', event, data);
                        setLocalSpinnerLoading(false);
                    });
                    hls.loadSource(videoUrl);
                    hls.attachMedia(videoRef.current as HTMLVideoElement);
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
                    videoRef.current.src = videoUrl;
                    setLocalSpinnerLoading(false);
                } else {
                    console.error(
                        'HLS is not supported and not a Safari browser, cannot play .ts video.'
                    );
                    setLocalSpinnerLoading(false);
                }
                setVideoBlobUrl('');
            } else {
                setLocalSpinnerLoading(true);
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                    hlsRef.current = null;
                }
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
                        if (videoRef.current && isPlaying) {
                            videoRef.current.play();
                        }
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
        }
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
            isVideoTs ? 'HLS.js' : videoBlobUrl ? 'blob' : 'direct URL',
            videoUrl
        );
        return () => {
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
        };
    }, [videoUrl, isVideoTs]);

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

    const toggleEpisodesContainer = () => {
        console.log('Episodes container toggled');
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

    const playedPercent = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration ? (buffered / duration) * 100 : 0;

    // --- Progress Bar Hover Handlers ---
    const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const hoverPercentage = hoverX / rect.width;
        const hoverTimeCalc = duration * hoverPercentage;

        setHoverTime(hoverTimeCalc);
        setHoverPos(hoverX);
    };

    const handleProgressBarLeave = () => {
        setHoverTime(null);
        setHoverPos(null);
    };

    return (
        <div
            className="z-30 absolute flex w-full h-full"
            ref={containerRef}
            onMouseMove={resetInactivityTimer}
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
                    >
                        {!isVideoTs && (
                            <source type="video/webm" src={videoBlobUrl || videoUrl} />
                        )}
                    </video>

                    {showRatingOverlay && contentRatings.length > 0 && (
                        <div
                            className="absolute z-50 pointer-events-none"
                            style={{ top: '80px', left: '20px' }}
                        >
                            <div className="px-6 py-3 bg-black bg-opacity-70 rounded-lg border border-white text-white text-3xl font-bold animate-fade-out">
                                {contentRatings[0].country ? `[${contentRatings[0].country}] ` : ''}|
                                {contentRatings[0].name}
                                {contentRatings[0].description}
                            </div>
                        </div>
                    )}

                    <PlayerSpinner loading={localSpinnerLoading} />

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-[1000] ${
                            showControls
                                ? 'opacity-100 pointer-events-auto'
                                : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 to-transparent">
                            <div className="flex flex-col">
                                <h1 className="text-white text-3xl font-extrabold">
                                    {videoTitle || 'Video Player'}
                                </h1>
                                {episodeMatch && (
                                    <p className="text-white text-xl mt-2">
                                        Season {seasonNumber} - Episode {episodeNumber}:{' '}
                                        {episodeTitleClean.replace(/_/g, ' ')}
                                    </p>
                                )}
                                {contentRatings.length > 0 && (
                                    <div className="mt-2 inline-block bg-gray-700 text-white text-sm px-3 py-1 rounded-md">
                                        {contentRatings[0].country ? `[${contentRatings[0].country}] ` : ''}
                                        {contentRatings[0].name}
                                    </div>
                                )}
                            </div>
                            {onClosePlayer && (
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-red-400 transition-colors"
                                >
                                    <XCircleIcon className="size-14" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col p-6 bg-gradient-to-t from-black/90 to-transparent">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white text-sm">
                                    {formatTime(currentTime)}
                                </span>
                                {/* Custom Progress Bar */}
                                <div
                                    className="relative w-full mx-4"
                                    ref={progressBarRef}
                                    onMouseMove={handleProgressBarHover}
                                    onMouseLeave={handleProgressBarLeave}
                                >
                                    <div className="h-2 rounded bg-gray-700">
                                        <div
                                            className="h-2 rounded bg-purple-300"
                                            style={{
                                                width: `${bufferedPercent}%`,
                                                pointerEvents: 'none',
                                            }}
                                        ></div>
                                        <div
                                            className="h-2 rounded bg-purple-700 absolute top-0 left-0"
                                            style={{ width: `${playedPercent}%` }}
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
                                    />

                                    {/* Hover time tooltip */}
                                    {hoverTime !== null && hoverPos !== null && (
                                        <div
                                            className="absolute top-[-30px] bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded pointer-events-none"
                                            style={{
                                                left: `${hoverPos}px`,
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            {formatTime(hoverTime)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-white text-sm">
                                    {formatTime(duration)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-purple-300 transition-colors"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon className="w-10 h-10" />
                                        ) : (
                                            <PlayIcon className="w-10 h-10" />
                                        )}
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="text-white hover:text-purple-300 transition-colors"
                                    >
                                        {isMuted ? (
                                            <SpeakerXMarkIcon className="w-10 h-10" />
                                        ) : (
                                            <SpeakerWaveIcon className="w-10 h-10" />
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
                                    />
                                </div>
                                <div className="flex items-center space-x-6">
                                    <button
                                        onClick={toggleEpisodesContainer}
                                        className="text-white hover:text-purple-300 transition-colors"
                                    >
                                        <RectangleStackIcon className="w-10 h-10" />
                                    </button>
                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-purple-300 transition-colors"
                                    >
                                        {!isFullscreen ? (
                                            <ArrowsPointingOutIcon className="w-10 h-10" />
                                        ) : (
                                            <ArrowsPointingInIcon className="w-10 h-10" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Fetching Video Link</h2>
                    {progress ? (
                        <div className="space-y-2">
                            <p className="text-sm">Status: {progress.status}</p>
                            <p className="text-sm">Progress: {progress.progress.toFixed(2)}%</p>
                            <p className="text-sm">
                                Downloaded: {progress.downloaded} / {progress.total}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm">Initializing link fetching...</p>
                    )}
                </div>
            )}

            <style jsx>{`
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

export default TvShowPlayer;
