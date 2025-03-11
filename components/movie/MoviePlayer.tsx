import React, { useEffect, useRef, useState } from 'react';
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    ForwardIcon,
    BackwardIcon,
} from '@heroicons/react/24/solid';
import { XCircleIcon, FilmIcon } from '@heroicons/react/24/outline';
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
    <AnimatePresence data-oid="3rg.kut">
        {loading && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                data-oid="w-7kdty"
            >
                <div className="relative flex flex-col items-center" data-oid="63yyc1p">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="relative w-20 h-20"
                        data-oid="g3z1hzn"
                    >
                        <div
                            className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-l-purple-600 rounded-full"
                            data-oid="puyv7b8"
                        ></div>
                        <div
                            className="absolute inset-0 w-full h-full animate-pulse rounded-full bg-purple-500 opacity-20"
                            data-oid="s4sogwn"
                        ></div>
                    </motion.div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

// Ad component to show while fetching link
const AdPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div
        className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center overflow-hidden"
        data-oid="nvrgwjk"
    >
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10" data-oid="n..w62y">
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-purple-500 filter blur-3xl"
                animate={{
                    x: ['-20%', '120%'],
                    y: ['30%', '60%'],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 15,
                    ease: 'easeInOut',
                }}
                data-oid=":v:qajd"
            />

            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full bg-blue-500 filter blur-3xl"
                animate={{
                    x: ['120%', '-20%'],
                    y: ['60%', '20%'],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 18,
                    ease: 'easeInOut',
                }}
                data-oid="e_9h33o"
            />
        </div>

        {/* Content */}
        <div className="z-10 text-center max-w-2xl px-6 py-10" data-oid="p5wjmxi">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex justify-center"
                data-oid="m-f6agn"
            >
                <FilmIcon className="h-20 w-20 text-purple-500" data-oid="-jvln6-" />
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                data-oid="6_.-gk."
            >
                Preparing "{title}"
            </motion.h2>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                data-oid="chwysrm"
            >
                <p className="text-gray-300 text-lg mb-8" data-oid="s0qizf:">
                    Your movie is being prepared for streaming. This may take a moment.
                </p>

                <div
                    className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden"
                    data-oid="da482yx"
                >
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                            duration: 15,
                            ease: 'linear',
                        }}
                        data-oid="8.wk_a4"
                    />
                </div>

                <p className="mt-4 text-purple-400 font-medium" data-oid="wlbw8t3">
                    Premium members enjoy faster streaming preparation
                </p>
            </motion.div>
        </div>
    </div>
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
            data-oid="h:6r:j-"
        >
            {videoUrl ? (
                <>
                    <video
                        ref={videoRef}
                        crossOrigin="anonymous"
                        className="w-full h-full bg-black object-contain"
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
                        data-oid="5twdzq9"
                    >
                        <source
                            src={videoBlobUrl || videoUrl}
                            type="video/webm"
                            data-oid="-5-prwd"
                        />
                    </video>

                    {/* Content Rating Overlay */}
                    <AnimatePresence data-oid="p1nw850">
                        {showRatingOverlay && contentRatings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute z-50 pointer-events-none top-24 left-8"
                                data-oid="jvm62cf"
                            >
                                <div
                                    className="px-6 py-3 bg-black/80 backdrop-blur-sm rounded-lg border border-purple-500/30 text-white text-2xl font-bold shadow-lg shadow-purple-500/20 animate-fade-out flex items-center"
                                    data-oid="vhi4dao"
                                >
                                    <div
                                        className="w-3 h-8 bg-purple-500 rounded-sm mr-3"
                                        data-oid="b1f6kwg"
                                    ></div>
                                    {contentRatings[0].country
                                        ? `${contentRatings[0].country} • `
                                        : ''}
                                    {contentRatings[0].name}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <PlayerSpinner loading={localSpinnerLoading} data-oid="n:z-8ax" />

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-[1000] ${
                            showControls
                                ? 'opacity-100 pointer-events-auto'
                                : 'opacity-0 pointer-events-none'
                        }`}
                        data-oid="e2monn7"
                    >
                        {/* Top Controls */}
                        <div
                            className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent"
                            data-oid="3kbq6e6"
                        >
                            <div className="flex flex-col" data-oid="6v.v7z-">
                                <h1
                                    className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                                    data-oid=":33ql9e"
                                >
                                    {videoTitle || 'Video Player'}
                                </h1>
                                {contentRatings.length > 0 && (
                                    <div
                                        className="mt-2 inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md border border-gray-700/50"
                                        data-oid="s91xhxt"
                                    >
                                        <span
                                            className="w-2 h-4 bg-purple-500 rounded-sm mr-2"
                                            data-oid="tguw9sm"
                                        ></span>
                                        {contentRatings[0].country
                                            ? `${contentRatings[0].country} • `
                                            : ''}
                                        {contentRatings[0].name}
                                    </div>
                                )}
                            </div>
                            {onClosePlayer && (
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-red-400 transition-colors p-2 rounded-full hover:bg-black/30"
                                    data-oid="c.1tmu3"
                                >
                                    <XCircleIcon className="size-10" data-oid="puet9cc" />
                                </button>
                            )}
                        </div>

                        {/* Center Play/Pause Button (large) */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            data-oid="0.-ltql"
                        >
                            <AnimatePresence data-oid="1s:mmvo">
                                {!isPlaying && (
                                    <motion.button
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 1.2, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={togglePlay}
                                        className="text-white bg-black/30 backdrop-blur-sm p-6 rounded-full hover:bg-purple-500/20 transition-all pointer-events-auto"
                                        data-oid="c4qsa5f"
                                    >
                                        <PlayIcon className="size-20" data-oid="o7_nsgr" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom Controls */}
                        <div
                            className="flex flex-col p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                            data-oid="y.nwbi-"
                        >
                            {/* Progress Bar */}
                            <div
                                className="flex items-center justify-between mb-4"
                                data-oid="n80cuhy"
                            >
                                <span className="text-white text-sm font-medium" data-oid="803pdk.">
                                    {formatTime(currentTime)}
                                </span>
                                {/* Custom Progress Bar */}
                                <div className="relative w-full mx-4 group" data-oid="izosy1v">
                                    <div
                                        className="h-1.5 rounded-full bg-gray-700/70 group-hover:h-2.5 transition-all"
                                        data-oid="muldvwh"
                                    >
                                        <div
                                            className="h-full rounded-full bg-gray-400/50"
                                            style={{ width: `${bufferedPercent}%` }}
                                            data-oid="l11eo6k"
                                        ></div>
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 absolute top-0 left-0 group-hover:shadow-glow"
                                            style={{ width: `${playedPercent}%` }}
                                            data-oid="l2_uott"
                                        >
                                            <div
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"
                                                data-oid="56n4ss5"
                                            ></div>
                                        </div>
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
                                        className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer"
                                        data-oid="wcmqs.s"
                                    />
                                </div>
                                <span className="text-white text-sm font-medium" data-oid="krk:ogg">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between" data-oid="mytl7az">
                                <div className="flex items-center space-x-6" data-oid="a4459_b">
                                    {/* Skip backward 10s */}
                                    <button
                                        onClick={() => {
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = Math.max(
                                                    0,
                                                    currentTime - 10,
                                                );
                                            }
                                        }}
                                        className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                        data-oid="kpa1hcv"
                                    >
                                        <BackwardIcon className="size-6" data-oid="3hu4d2s" />
                                    </button>

                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                        data-oid="5o9daoz"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon className="size-8" data-oid="lq9-wdf" />
                                        ) : (
                                            <PlayIcon className="size-8" data-oid="0nh32w1" />
                                        )}
                                    </button>

                                    {/* Skip forward 10s */}
                                    <button
                                        onClick={() => {
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = Math.min(
                                                    duration,
                                                    currentTime + 10,
                                                );
                                            }
                                        }}
                                        className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                        data-oid="nxz_b23"
                                    >
                                        <ForwardIcon className="size-6" data-oid=".t8k84m" />
                                    </button>

                                    {/* Volume */}
                                    <div
                                        className="flex items-center space-x-2 group"
                                        data-oid="::xuk03"
                                    >
                                        <button
                                            onClick={toggleMute}
                                            className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                            data-oid="ue-s7r9"
                                        >
                                            {isMuted ? (
                                                <SpeakerXMarkIcon
                                                    className="size-6"
                                                    data-oid="l3sm1nw"
                                                />
                                            ) : (
                                                <SpeakerWaveIcon
                                                    className="size-6"
                                                    data-oid="r3ljwzm"
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
                                            className="w-0 md:w-24 opacity-0 md:opacity-100 group-hover:w-24 group-hover:opacity-100 transition-all duration-300 accent-purple-500"
                                            data-oid="f0m0vb1"
                                        />
                                    </div>
                                </div>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                    data-oid="fwk827_"
                                >
                                    {!isFullscreen ? (
                                        <ArrowsPointingOutIcon
                                            className="size-6"
                                            data-oid="td0ps0v"
                                        />
                                    ) : (
                                        <ArrowsPointingInIcon
                                            className="size-6"
                                            data-oid="1oqlmp9"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Link Fetcher UI with Ad Placeholder
                <AdPlaceholder title={videoTitle} data-oid="g3417lm" />
            )}

            <style jsx data-oid="1_vgqdk">{`
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

                .shadow-glow {
                    box-shadow: 0 0 8px 2px rgba(168, 85, 247, 0.4);
                }
            `}</style>
        </div>
    );
};

export default MoviePlayer;
