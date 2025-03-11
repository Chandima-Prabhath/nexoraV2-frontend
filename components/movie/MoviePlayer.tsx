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

// Time preview component for the progress bar
const TimePreview: React.FC<{
    duration: number;
    progressBarRef: React.RefObject<HTMLDivElement>;
}> = ({ duration, progressBarRef }) => {
    const [previewTime, setPreviewTime] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [previewPosition, setPreviewPosition] = useState(0);

    // Listen for mousemove events on the document
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!progressBarRef.current || !duration) return;

            const rect = progressBarRef.current.getBoundingClientRect();

            // Check if mouse is over the progress bar
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top - 30 &&
                e.clientY <= rect.bottom + 30
            ) {
                // Calculate position percentage
                const position = (e.clientX - rect.left) / rect.width;
                const time = position * duration;

                setPreviewTime(time);
                setPreviewPosition(position * 100);
                setShowPreview(true);
            } else {
                setShowPreview(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [duration, progressBarRef]);

    // Format the preview time
    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        return hours > 0 ? `${hours}:${minutesStr}:${secondsStr}` : `${minutesStr}:${secondsStr}`;
    };

    return (
        <AnimatePresence data-oid="7r_.w2c">
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded pointer-events-none z-50"
                    style={{
                        left: `${previewPosition}%`,
                        transform: 'translateX(-50%)',
                    }}
                    data-oid="eu383-:"
                >
                    {formatTime(previewTime)}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

// Integrated loading spinner with play button
const IntegratedPlayerControls: React.FC<{
    isPlaying: boolean;
    loading: boolean;
    togglePlay: () => void;
}> = ({ isPlaying, loading, togglePlay }) => (
    <AnimatePresence mode="wait" data-oid="8xh7_xj">
        {!isPlaying && (
            <motion.button
                key="play-button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={togglePlay}
                className="text-white bg-black/30 backdrop-blur-sm p-6 rounded-full hover:bg-purple-500/20 transition-all pointer-events-auto relative"
                data-oid="k_v2ltf"
            >
                {loading ? (
                    // Loading spinner integrated with play button
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        data-oid="7cm4gvh"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                            className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-l-purple-600 rounded-full"
                            data-oid="c0yj1gv"
                        />

                        <PlayIcon className="size-20 opacity-70" data-oid="9ija-p8" />
                    </motion.div>
                ) : (
                    <PlayIcon className="size-20" data-oid="::vr3-o" />
                )}
            </motion.button>
        )}
        {isPlaying && loading && (
            <motion.div
                key="loading-only"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-full"
                data-oid=":o-wsje"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="w-20 h-20 border-4 border-transparent border-t-purple-600 border-l-purple-600 rounded-full"
                    data-oid="9o2g.8-"
                />
            </motion.div>
        )}
    </AnimatePresence>
);

// Ad component to show while fetching link with real progress
const AdPlaceholder: React.FC<{ title: string; progress: ProgressData | null }> = ({
    title,
    progress,
}) => {
    // Calculate progress percentage safely
    const progressPercent = progress ? Math.min(100, Math.max(0, progress.progress)) : 0;

    return (
        <div
            className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center overflow-hidden"
            data-oid=":wx:3lk"
        >
            {/* Background animation */}
            <div className="absolute inset-0 opacity-10" data-oid="vss6kr-">
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
                    data-oid=".0er.xe"
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
                    data-oid="-emyfog"
                />
            </div>

            {/* Content */}
            <div className="z-10 text-center max-w-2xl px-6 py-10" data-oid="czuvn--">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex justify-center"
                    data-oid="n:k.r-:"
                >
                    <FilmIcon className="h-20 w-20 text-purple-500" data-oid="fd20phu" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    data-oid="v-d.d8g"
                >
                    Preparing "{title}"
                </motion.h2>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    data-oid="19v1:s2"
                >
                    <p className="text-gray-300 text-lg mb-8" data-oid="s_kvso_">
                        {progressPercent < 5
                            ? 'Initializing your stream...'
                            : progressPercent < 100
                              ? 'Your movie is being prepared for streaming.'
                              : 'Almost ready! Starting playback soon...'}
                    </p>

                    <div
                        className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden"
                        data-oid="zj8dtsu"
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${progressPercent}%` }}
                            data-oid="sj_zodi"
                        />

                        {/* Animated glow effect at the edge of the progress */}
                        <div
                            className="absolute top-0 h-full w-8 bg-white/20 blur-sm transform -skew-x-12"
                            style={{
                                left: `calc(${progressPercent}% - 8px)`,
                                opacity: progressPercent > 0 && progressPercent < 100 ? 1 : 0,
                            }}
                            data-oid="rhtqs36"
                        />
                    </div>

                    <div
                        className="flex justify-between mt-2 text-sm text-gray-400"
                        data-oid="2h0bq4f"
                    >
                        <span data-oid="ya5xzfl">{progressPercent.toFixed(0)}% complete</span>
                        {progress && progress.downloaded && progress.total && (
                            <span className="text-gray-500" data-oid="7w.1_wa">
                                {(progress.downloaded / (1024 * 1024)).toFixed(1)} MB /{' '}
                                {(progress.total / (1024 * 1024)).toFixed(1)} MB
                            </span>
                        )}
                    </div>

                    <p className="mt-6 text-purple-400 font-medium" data-oid="tre8u-1">
                        Premium members enjoy faster streaming preparation
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const MoviePlayer: React.FC<MoviePlayerProps> = ({
    videoTitle,
    contentRatings = [
        {
            country: 'US',
            name: 'TV-MA',
            description: 'Mature Audience Only',
        },
    ],

    onClosePlayer,
}) => {
    // Use local spinner state inside the player
    const [localSpinnerLoading, setLocalSpinnerLoading] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
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

    // Enhanced content rating overlay with Netflix-like animation
    const [showRatingOverlay, setShowRatingOverlay] = useState(false);
    const triggerRatingOverlay = () => {
        if (contentRatings.length > 0) {
            // Slight delay before showing the rating (like Netflix)
            setTimeout(() => {
                setShowRatingOverlay(true);
                // Auto-hide after display duration
                setTimeout(() => setShowRatingOverlay(false), 5000);
            }, 800);
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

    // Handle hover over the progress bar for time preview
    const handleSeekHover = (e: React.MouseEvent<HTMLInputElement>) => {
        // This is just to ensure the event handler exists
        // The actual preview is handled by the TimePreview component
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
            data-oid="vamtvqd"
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
                        data-oid="top13o:"
                    >
                        <source
                            src={videoBlobUrl || videoUrl}
                            type="video/webm"
                            data-oid="hg6pj9."
                        />
                    </video>

                    {/* Netflix-style Content Rating Overlay */}
                    <AnimatePresence data-oid="rcrafiw">
                        {showRatingOverlay && contentRatings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.8, delay: 3 },
                                }}
                                className="absolute z-50 pointer-events-none inset-0 flex items-center justify-center bg-black/40"
                                data-oid="tyoo2i4"
                            >
                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    data-oid="p4nsm87"
                                >
                                    <div
                                        className="px-8 py-4 bg-black/80 backdrop-blur-md rounded-lg text-white text-4xl font-bold shadow-xl flex items-center"
                                        data-oid="gl5fh85"
                                    >
                                        <div
                                            className="w-3 h-10 bg-purple-500 rounded-sm mr-4"
                                            data-oid="0uibbr4"
                                        ></div>
                                        <span data-oid="4mz5_ag">
                                            {contentRatings[0].country
                                                ? `${contentRatings[0].country} • `
                                                : ''}
                                            {contentRatings[0].name}
                                        </span>
                                    </div>
                                    {contentRatings[0].description && (
                                        <motion.p
                                            className="mt-3 text-white/90 text-sm max-w-md text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            data-oid="lsj55fq"
                                        >
                                            {contentRatings[0].description}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-[1000] ${
                            showControls
                                ? 'opacity-100 pointer-events-auto'
                                : 'opacity-0 pointer-events-none'
                        }`}
                        data-oid="k.l-d6w"
                    >
                        {/* Top Controls */}
                        <div
                            className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent"
                            data-oid="y4bqua."
                        >
                            <div className="flex flex-col" data-oid="b:_9g:m">
                                <h1
                                    className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                                    data-oid="mxtn39m"
                                >
                                    {videoTitle || 'Video Player'}
                                </h1>
                                {contentRatings.length > 0 && (
                                    <div
                                        className="mt-2 inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md border border-gray-700/50"
                                        data-oid="8s04rux"
                                    >
                                        <span
                                            className="w-2 h-4 bg-purple-500 rounded-sm mr-2"
                                            data-oid="ln..0t2"
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
                                    data-oid="rf.w1yw"
                                >
                                    <XCircleIcon className="size-10" data-oid="ictg2ip" />
                                </button>
                            )}
                        </div>

                        {/* Center Play/Pause Button with integrated loading spinner */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            data-oid="mn0vz0u"
                        >
                            <IntegratedPlayerControls
                                isPlaying={isPlaying}
                                loading={localSpinnerLoading}
                                togglePlay={togglePlay}
                                data-oid="h-bmltq"
                            />
                        </div>

                        {/* Bottom Controls */}
                        <div
                            className="flex flex-col p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                            data-oid="s71b4lx"
                        >
                            {/* Progress Bar */}
                            <div
                                className="flex items-center justify-between mb-4"
                                data-oid="qs8wi07"
                            >
                                <span className="text-white text-sm font-medium" data-oid="527-yoc">
                                    {formatTime(currentTime)}
                                </span>
                                {/* Enhanced Progress Bar with time preview */}
                                <div className="relative w-full mx-4 group" data-oid="y2kblye">
                                    {/* Time preview tooltip */}
                                    <TimePreview
                                        duration={duration}
                                        progressBarRef={progressBarRef}
                                        data-oid="2:i.wpo"
                                    />

                                    {/* Progress bar */}
                                    <div
                                        ref={progressBarRef}
                                        className="h-1.5 rounded-full bg-gray-700/70 group-hover:h-2.5 transition-all"
                                        data-oid="us9e22k"
                                    >
                                        {/* Buffered progress */}
                                        <div
                                            className="h-full rounded-full bg-gray-400/50"
                                            style={{ width: `${bufferedPercent}%` }}
                                            data-oid=".ffol4y"
                                        ></div>

                                        {/* Played progress */}
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 absolute top-0 left-0 group-hover:shadow-glow"
                                            style={{ width: `${playedPercent}%` }}
                                            data-oid="d4z_m2_"
                                        >
                                            {/* Thumb indicator */}
                                            <div
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"
                                                data-oid="cx2g6h7"
                                            ></div>
                                        </div>

                                        {/* Chapter markers could be added here */}
                                    </div>

                                    {/* Invisible range input for seeking */}
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
                                        onMouseMove={handleSeekHover}
                                        className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer"
                                        data-oid=":bl2dur"
                                    />
                                </div>
                                <span className="text-white text-sm font-medium" data-oid="952mepz">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between" data-oid="_kexfwm">
                                <div className="flex items-center space-x-6" data-oid="7v9bewl">
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
                                        data-oid="n9f7nu_"
                                    >
                                        <BackwardIcon className="size-6" data-oid="a2jmn73" />
                                    </button>

                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                        data-oid="qn_q1w-"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon className="size-8" data-oid="jzziftj" />
                                        ) : (
                                            <PlayIcon className="size-8" data-oid="z2vujb-" />
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
                                        data-oid="e3a.q0x"
                                    >
                                        <ForwardIcon className="size-6" data-oid="a97c9fo" />
                                    </button>

                                    {/* Volume */}
                                    <div
                                        className="flex items-center space-x-2 group"
                                        data-oid="hh5w.16"
                                    >
                                        <button
                                            onClick={toggleMute}
                                            className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                            data-oid="o30oa51"
                                        >
                                            {isMuted ? (
                                                <SpeakerXMarkIcon
                                                    className="size-6"
                                                    data-oid="sb3k2ly"
                                                />
                                            ) : (
                                                <SpeakerWaveIcon
                                                    className="size-6"
                                                    data-oid="xdbr9lu"
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
                                            data-oid="8.e0rk4"
                                        />
                                    </div>
                                </div>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                    data-oid="p1ouugh"
                                >
                                    {!isFullscreen ? (
                                        <ArrowsPointingOutIcon
                                            className="size-6"
                                            data-oid="c0l.v4s"
                                        />
                                    ) : (
                                        <ArrowsPointingInIcon
                                            className="size-6"
                                            data-oid="_aipka6"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Link Fetcher UI with Ad Placeholder and real progress
                <AdPlaceholder title={videoTitle} progress={progress} data-oid="0oes1yq" />
            )}

            <style jsx data-oid="j.10r:9">{`
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
