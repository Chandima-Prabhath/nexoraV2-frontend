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
    movieTitle?: string;
    contentRatings?: ContentRating[];
    thumbnail?: string;
    poster?: string;
    onClosePlayer?: () => void; // Optional close handler for page context
}

interface ProgressData {
    status: string;
    progress: number;
    downloaded: number;
    total: number;
}

// Keyboard shortcuts help component
const KeyboardShortcutsHelp: React.FC = () => {
    const [showHelp, setShowHelp] = useState(false);
    const shortcuts = [
        { key: 'Space / K', action: 'Play/Pause' },
        { key: 'F', action: 'Toggle Fullscreen' },
        { key: 'M', action: 'Mute/Unmute' },
        { key: '←', action: 'Rewind 10s' },
        { key: '→', action: 'Forward 10s' },
        { key: '↑', action: 'Volume Up' },
        { key: '↓', action: 'Volume Down' },
        { key: '0-9', action: 'Seek to 0-90%' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30 text-xs"
                title="Keyboard Shortcuts"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 p-3 bg-black/90 backdrop-blur-sm rounded-lg text-white text-xs w-64 shadow-lg z-50"
                    >
                        <h4 className="font-bold mb-2 text-purple-400">Keyboard Shortcuts</h4>
                        <div className="grid grid-cols-2 gap-y-1.5">
                            {shortcuts.map((shortcut, index) => (
                                <React.Fragment key={index}>
                                    <div className="font-medium">{shortcut.key}</div>
                                    <div className="text-gray-300">{shortcut.action}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
        <AnimatePresence>
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded pointer-events-none z-50"
                    style={{ left: `${previewPosition}%`, transform: 'translateX(-50%)' }}
                >
                    {formatTime(previewTime)}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const IntegratedPlayerControls: React.FC<{
    isPlaying: boolean;
    loading: boolean;
    togglePlay: () => void;
}> = ({ isPlaying, loading, togglePlay }) => (
    <AnimatePresence mode="wait">
        <motion.button
            key="play-pause-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={togglePlay}
            className="text-white bg-black/30 backdrop-blur-sm p-4 rounded-full hover:bg-purple-500/20 transition-all pointer-events-auto relative w-20 h-20 flex items-center justify-center"
        >
            {loading && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ zIndex: 1 }} // Ensure spinner stays behind the button
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-l-purple-600 rounded-full"
                    />
                </motion.div>
            )}

            {/* Play/Pause Icon always visible */}
            {isPlaying ? (
                <PauseIcon className="w-20 h-20 z-10" />
            ) : (
                <PlayIcon className="w-20 h-20 z-10" />
            )}
        </motion.button>
    </AnimatePresence>
);

// Ad component to show while fetching link with real progress
const AdPlaceholder: React.FC<{
    title: string;
    progress: ProgressData | null;
    poster: string | undefined;
}> = ({ title, progress, poster }) => {
    const progressPercent = progress ? Math.min(100, Math.max(0, progress.progress)) : 0;
    return (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-purple-500 filter blur-3xl"
                    animate={{ x: ['-20%', '120%'], y: ['30%', '60%'] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 15,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute w-[300px] h-[300px] rounded-full bg-blue-500 filter blur-3xl"
                    animate={{ x: ['120%', '-20%'], y: ['60%', '20%'] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 18,
                        ease: 'easeInOut',
                    }}
                />
            </div>
            <div className="z-10 text-center max-w-2xl px-6 py-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex justify-center"
                >
                    {!poster ? (
                        <FilmIcon className="h-20 w-20 text-purple-500" />
                    ) : (
                        <img src={poster} alt={title} className="h-auto w-20 rounded-lg" />
                    )}
                </motion.div>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Preparing "{title}"
                </motion.h2>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <p className="text-gray-300 text-lg mb-8">
                        {progressPercent < 5
                            ? 'Initializing your stream...'
                            : progressPercent < 100
                              ? 'Your movie is being prepared for streaming.'
                              : 'Almost ready! Starting playback soon...'}
                    </p>
                    <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />

                        <div
                            className="absolute top-0 h-full w-8 bg-white/20 blur-sm transform -skew-x-12"
                            style={{
                                left: `calc(${progressPercent}% - 8px)`,
                                opacity: progressPercent > 0 && progressPercent < 100 ? 1 : 0,
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                        <span>{progressPercent.toFixed(0)}% complete</span>
                        {progress && progress.downloaded && progress.total && (
                            <span className="text-gray-500">
                                {(progress.downloaded / (1024 * 1024)).toFixed(1)} MB /{' '}
                                {(progress.total / (1024 * 1024)).toFixed(1)} MB
                            </span>
                        )}
                    </div>
                    <p className="mt-6 text-purple-400 font-medium">
                        {' '}
                        Premium members enjoy faster streaming preparation{' '}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const MoviePlayer: React.FC<MoviePlayerProps> = ({
    videoTitle,
    movieTitle = videoTitle,
    contentRatings = [],
    thumbnail,
    poster,
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
    }, [videoTitle]);

    // --- Player Control Helpers ---
    const resetInactivityTimer = () => {
        setShowControls(true);
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        if (!localSpinnerLoading && isPlaying) {
            inactivityRef.current = setTimeout(() => setShowControls(false), 3000);
        }
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

    // Enhanced content rating overlay with Netflix-like animation - only shown once at start
    const [showRatingOverlay, setShowRatingOverlay] = useState(false);
    const [ratingShown, setRatingShown] = useState(false);

    const triggerRatingOverlay = () => {
        if (contentRatings.length > 0 && !ratingShown) {
            setRatingShown(true);
            setTimeout(() => {
                setShowRatingOverlay(true);
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

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;
            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    break;
                case 'arrowup':
                    e.preventDefault();
                    const newVolUp = Math.min(1, volume + 0.1);
                    setVolume(newVolUp);
                    videoRef.current.volume = newVolUp;
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    const newVolDown = Math.max(0, volume - 0.1);
                    setVolume(newVolDown);
                    videoRef.current.volume = newVolDown;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    const percent = parseInt(e.key) * 10;
                    videoRef.current.currentTime = (percent / 100) * duration;
                    break;
            }
        };

        if (videoUrl) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [videoUrl, togglePlay, toggleFullscreen, toggleMute, duration, currentTime, volume]);

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
                        poster={thumbnail}
                    >
                        <source src={videoBlobUrl || videoUrl} type="video/webm" />
                    </video>

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-[1000] ${showControls || localSpinnerLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    >
                        {/* Top Controls */}
                        <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
                            <div className="flex flex-col">
                                <h1 className="text-white text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                    {movieTitle || 'Video Player'}
                                </h1>
                                <AnimatePresence>
                                    {showRatingOverlay && contentRatings.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                            className="mt-2 inline-flex flex-col items-start bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md border border-gray-700/50"
                                        >
                                            {/* Rating Name */}
                                            <motion.div className="flex items-center text-xl">
                                                <span>{contentRatings[0].name}</span>
                                                {contentRatings[0].country && (
                                                    <span className="w-1 h-6 bg-purple-500 rounded-sm ml-2 mr-2"></span>
                                                )}
                                                {/* Description */}
                                                {contentRatings[0].description && (
                                                    <motion.p
                                                        className="text-white/90 text-xs text-center max-w-md"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3, duration: 0.5 }}
                                                    >
                                                        {contentRatings[0].description}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {onClosePlayer && (
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-red-400 transition-colors p-2 rounded-full hover:bg-black/30"
                                >
                                    <XCircleIcon className="size-10" />
                                </button>
                            )}
                        </div>
                        {/* Center Play/Pause Button with integrated loading spinner and fast-forward/rewind controls */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                                className="z-10 relative pointer-events-auto text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30 mx-4"
                            >
                                <BackwardIcon className="w-10 h-10" />
                            </button>

                            <IntegratedPlayerControls
                                isPlaying={isPlaying}
                                loading={localSpinnerLoading}
                                togglePlay={togglePlay}
                            />

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
                                className="z-10 relative pointer-events-auto text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30 mx-4"
                            >
                                <ForwardIcon className="w-10 h-10" />
                            </button>
                        </div>
                        {/* Bottom Controls */}
                        <div className="flex flex-col p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            {/* Progress Bar */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white text-sm font-medium">
                                    {formatTime(currentTime)}
                                </span>
                                {/* Enhanced Progress Bar with time preview */}
                                <div className="relative w-full mx-4 group">
                                    {/* Time preview tooltip */}
                                    <TimePreview
                                        duration={duration}
                                        progressBarRef={progressBarRef}
                                    />

                                    {/* Progress bar */}
                                    <div
                                        ref={progressBarRef}
                                        className="h-1.5 rounded-full bg-gray-700/70 group-hover:h-2.5 transition-all"
                                    >
                                        {/* Buffered progress */}
                                        <div
                                            className="h-full rounded-full bg-gray-400/50"
                                            style={{ width: `${bufferedPercent}%` }}
                                        ></div>
                                        {/* Played progress */}
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 absolute top-0 left-0 group-hover:shadow-glow"
                                            style={{ width: `${playedPercent}%` }}
                                        >
                                            {/* Thumb indicator */}
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                                        </div>
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
                                    />
                                </div>
                                <span className="text-white text-sm font-medium">
                                    {formatTime(duration)}
                                </span>
                            </div>
                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    {/* Keyboard shortcuts help button */}
                                    <KeyboardShortcutsHelp />

                                    {/* Volume */}
                                    <div className="flex items-center space-x-2 group">
                                        <button
                                            onClick={toggleMute}
                                            className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                        >
                                            {isMuted ? (
                                                <SpeakerXMarkIcon className="size-6" />
                                            ) : (
                                                <SpeakerWaveIcon className="size-6" />
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
                                        />
                                    </div>
                                </div>
                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-white hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-black/30"
                                >
                                    {!isFullscreen ? (
                                        <ArrowsPointingOutIcon className="size-6" />
                                    ) : (
                                        <ArrowsPointingInIcon className="size-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Link Fetcher UI with Ad Placeholder and real progress
                <AdPlaceholder title={movieTitle} progress={progress} poster={poster} />
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
                .shadow-glow {
                    box-shadow: 0 0 8px 2px rgba(168, 85, 247, 0.4);
                }
            `}</style>
        </div>
    );
};

export default MoviePlayer;
