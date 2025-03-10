import React, { useEffect, useRef, useState } from 'react';
import { useSpinnerLoading } from '@/components/loading/Spinner';
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
} from '@heroicons/react/24/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ContentRating {
    country: string;
    name: string;
    description: string;
}

interface MoviePlayerModalProps {
    videoUrl: string;
    videoTitle: string;
    isOpen: boolean;
    onClose: () => void;
    contentRatings?: ContentRating[];
}

const MoviePlayerModal: React.FC<MoviePlayerModalProps> = ({
    videoUrl,
    videoTitle,
    isOpen,
    onClose,
    contentRatings = [],
}) => {
    const { spinnerLoading, setSpinnerLoading } = useSpinnerLoading();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [videoBlobUrl, setVideoBlobUrl] = useState<string>('');
    const [showControls, setShowControls] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isMuted = volume === 0;
    const inactivityRef = useRef<NodeJS.Timeout | null>(null);

    const resetInactivityTimer = () => {
        setShowControls(true);
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    // State for rating overlay (now positioned at top left below the top overlay)
    const [showRatingOverlay, setShowRatingOverlay] = useState(false);

    // Fetch the video blob and create a blob URL when modal opens
    useEffect(() => {
        let abortController: AbortController;
        if (isOpen) {
            setSpinnerLoading(true);
            abortController = new AbortController();
            fetch(videoUrl, { signal: abortController.signal, mode: 'cors' })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then((blob) => {
                    const blobUrl = URL.createObjectURL(blob);
                    setVideoBlobUrl(blobUrl);
                    console.log('Blob URL created:', blobUrl); // Debug log - Blob URL creation success
                    setSpinnerLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching video blob:', error); // Enhanced error logging
                    console.error('Falling back to direct video URL.');
                    setVideoBlobUrl('');
                    setSpinnerLoading(false);
                });
        }
        return () => {
            if (abortController) {
                setTimeout(() => {
                    // Delayed abort
                    abortController.abort();
                    console.log('Blob fetch aborted (delayed)'); // Optional: Log delayed abort
                }, 100);
            }
            if (videoBlobUrl) {
                URL.revokeObjectURL(videoBlobUrl);
                console.log('Blob URL revoked:', videoBlobUrl); // Debug log - Blob URL revocation
            }
            setVideoBlobUrl('');
        };
    }, [isOpen, videoUrl]);

    // Show the content rating overlay when video starts playing
    useEffect(() => {
        if (contentRatings.length > 0 && isPlaying) {
            setShowRatingOverlay(true);
            const timer = setTimeout(() => {
                setShowRatingOverlay(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [contentRatings, isPlaying]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullScreenChange = () => {
            if (document.fullscreenElement === containerRef.current) {
                setIsFullscreen(true);
            } else {
                setIsFullscreen(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            setVolume(1);
            setIsFullscreen(false);
            resetInactivityTimer();
            console.log(
                'Modal opened, videoBlobUrl:',
                videoBlobUrl ? 'using blob' : 'using direct URL',
                videoBlobUrl,
            ); // Debug log - Modal opened, check blob usage
        } else {
            videoRef.current?.pause();
            console.log('Modal closed, pausing video'); // Debug log - Modal closed
        }
        return () => {
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
        };
    }, [isOpen, videoBlobUrl]); // Added videoBlobUrl to dependency array to log on blob URL change

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && !isSeeking) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setSpinnerLoading(false);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleSeekStart = () => {
        setIsSeeking(true);
    };

    const handleSeekEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
        setIsSeeking(false);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
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
            if (containerRef.current.requestFullscreen) {
                await containerRef.current.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const handleClose = () => {
        videoRef.current?.pause();
        onClose();
    };

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        if (hours > 0) {
            const hoursStr = hours.toString(); // No need to pad hours to 1 digit, can just use toString()
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onMouseMove={resetInactivityTimer}
            data-oid="q2a7-5g"
        >
            <div className="relative w-full h-full" ref={containerRef} data-oid="hd1k5_5">
                <video
                    ref={videoRef}
                    src={videoBlobUrl || videoUrl}
                    className="w-full h-full bg-black object-cover"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onWaiting={() => setSpinnerLoading(true)}
                    onCanPlay={() => setSpinnerLoading(false)}
                    onPlaying={() => setSpinnerLoading(false)}
                    autoPlay
                    data-oid="--qmdy."
                />

                {showRatingOverlay && contentRatings.length > 0 && (
                    <div
                        className="absolute z-30 pointer-events-none"
                        style={{ top: '80px', left: '20px' }}
                        data-oid="6bfkbdc"
                    >
                        <div
                            className="px-6 py-3 bg-black bg-opacity-70 rounded-lg border border-white text-white text-3xl font-bold animate-fade-out"
                            data-oid="wiob5xx"
                        >
                            {contentRatings[0].country ? `[${contentRatings[0].country}] ` : ''}
                            {contentRatings[0].name}
                        </div>
                    </div>
                )}
                <div
                    className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-40 ${
                        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    data-oid="6-zpf9w"
                >
                    <div
                        className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 to-transparent"
                        data-oid=":nqlk0_"
                    >
                        <div className="flex flex-col" data-oid="uvketwe">
                            <h1 className="text-white text-3xl font-extrabold" data-oid="-9hgboh">
                                {videoTitle}
                            </h1>
                            {contentRatings.length > 0 && (
                                <div
                                    className="mt-2 inline-block bg-gray-700 text-white text-sm px-3 py-1 rounded-md"
                                    data-oid="rj0qjk0"
                                >
                                    {contentRatings[0].country
                                        ? `[${contentRatings[0].country}] `
                                        : ''}
                                    {contentRatings[0].name}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-red-400 transition-colors"
                            data-oid="9yx0l9j"
                        >
                            <XCircleIcon className="w-10 h-10" data-oid="rbfglc-" />
                        </button>
                    </div>
                    <div
                        className="flex flex-col p-6 bg-gradient-to-t from-black/90 to-transparent"
                        data-oid="ib7dq:k"
                    >
                        <div className="flex items-center justify-between mb-4" data-oid="2g2in8x">
                            <span className="text-white text-sm" data-oid="1-e2lbk">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={duration}
                                value={isSeeking ? currentTime : videoRef.current?.currentTime || 0}
                                onMouseDown={handleSeekStart}
                                onTouchStart={handleSeekStart}
                                onChange={handleSeekEnd}
                                className="w-full mx-4 accent-purple-500 cursor-pointer"
                                data-oid="ts2-bpe"
                            />

                            <span className="text-white text-sm" data-oid="-7irceb">
                                {formatTime(duration)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between" data-oid=".::me9k">
                            <div className="flex items-center space-x-6" data-oid="xx1cdz7">
                                <button
                                    onClick={togglePlay}
                                    className="text-white hover:text-purple-300 transition-colors"
                                    data-oid="81ze73a"
                                >
                                    {isPlaying ? (
                                        <PauseIcon className="w-10 h-10" data-oid="ahyalyp" />
                                    ) : (
                                        <PlayIcon className="w-10 h-10" data-oid="n69cyap" />
                                    )}
                                </button>
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-purple-300 transition-colors"
                                    data-oid="0mwco-h"
                                >
                                    {isMuted ? (
                                        <SpeakerXMarkIcon
                                            className="w-10 h-10"
                                            data-oid="nbifvwe"
                                        />
                                    ) : (
                                        <SpeakerWaveIcon className="w-10 h-10" data-oid="uzc.:7o" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={handleVolume}
                                    className="w-24 accent-purple-500"
                                    data-oid="ddtr-41"
                                />
                            </div>
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-purple-300 transition-colors"
                                data-oid="8rzyx3e"
                            >
                                {!isFullscreen ? (
                                    <ArrowsPointingOutIcon
                                        className="w-10 h-10"
                                        data-oid="-gicm52"
                                    />
                                ) : (
                                    <ArrowsPointingInIcon
                                        className="w-10 h-10"
                                        data-oid="d71t-t3"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx data-oid="un1i2m5">{`
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

export default MoviePlayerModal;
