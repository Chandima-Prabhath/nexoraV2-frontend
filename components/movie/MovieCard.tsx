'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getMovieCard } from '@/lib/lb';
import {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import TrailersComp from '@/components/shared/Trailers';

interface Artwork {
    id: number;
    image: string;
    thumbnail: string;
    language: string | null;
    type: number;
    score: number;
    width: number;
    height: number;
    includesText: boolean;
    thumbnailWidth: number;
    thumbnailHeight: number;
    updatedAt: number;
    status: { id: number; name: string | null };
    tagOptions: any;
}

interface Trailer {
    id: number;
    name: string;
    url: string;
    language: string;
    runtime: number;
}

interface Card {
    title: string;
    year: string;
    image: string;
    portrait: Artwork[];
    banner: Artwork[];
    overview: string;
    trailers: Trailer[]; // Now trailers is an array of Trailer objects
}

interface MovieCardProps {
    title: string;
}

// BannerImage component: remounts on src change to trigger fade-in.
const BannerImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(false);
        const timer = setTimeout(() => {
            setVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [src]);

    return (
        <img
            src={src}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            data-oid="__d7c2v"
        />
    );
};

export const MovieCard: React.FC<MovieCardProps> = ({ title }) => {
    const [card, setCard] = useState<Card | null>(null);
    const [cardImage, setCardImage] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [bannerIndex, setBannerIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [modalStyle, setModalStyle] = useState<React.CSSProperties | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const slideshowTimer = useRef<NodeJS.Timeout | null>(null);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function fetchMovieCard() {
            try {
                const cardData = await getMovieCard(title);
                setCard(cardData);
            } catch (error) {
                console.error('Error fetching movie card:', error);
            }
        }
        fetchMovieCard();
    }, [title]);

    // Set a random card image once card loads.
    useEffect(() => {
        if (card) {
            if (card.portrait && card.portrait.length > 0) {
                setCardImage(
                    card.portrait[Math.floor(Math.random() * card.portrait.length)].thumbnail,
                );
            } else {
                setCardImage(card.image);
            }
        }
    }, [card]);

    // Compute the final (expanded) modal style dynamically.
    const computeFinalModalStyle = (): React.CSSProperties => {
        if (!cardRef.current) return {};
        const rect = cardRef.current.getBoundingClientRect();
        const margin = 20;
        const modalWidth = Math.min(600, window.innerWidth * 0.9);
        const modalHeight = Math.min(500, window.innerHeight * 0.7);
        let modalLeft = rect.left + rect.width / 2 - modalWidth / 2;
        if (modalLeft < margin) modalLeft = margin;
        if (modalLeft + modalWidth > window.innerWidth - margin) {
            modalLeft = window.innerWidth - modalWidth - margin;
        }
        let modalTop = rect.bottom - modalHeight;
        if (modalTop < margin) modalTop = margin;
        if (modalTop + modalHeight > window.innerHeight - margin) {
            modalTop = window.innerHeight - modalHeight - margin;
        }
        return {
            position: 'fixed',
            left: modalLeft,
            top: modalTop,
            width: modalWidth,
            height: modalHeight,
            zIndex: 1000,
        };
    };

    // Animate modal opening/closing.
    useEffect(() => {
        let animationFrame: number;
        let timer: NodeJS.Timeout;
        const duration = 400;
        if (showModal && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const initialStyle: React.CSSProperties = {
                position: 'fixed',
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                opacity: 0,
                zIndex: 1000,
                transition: `all ${duration}ms ease-in-out`,
            };
            setModalStyle(initialStyle);
            animationFrame = requestAnimationFrame(() => {
                const finalStyle = computeFinalModalStyle();
                setModalStyle({
                    ...finalStyle,
                    opacity: 1,
                    transition: `all ${duration}ms ease-in-out`,
                });
            });
        } else if (!showModal && modalStyle && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const closingStyle: React.CSSProperties = {
                position: 'fixed',
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                opacity: 0,
                zIndex: 1000,
                transition: `all ${duration}ms ease-in-out`,
            };
            setModalStyle(closingStyle);
            timer = setTimeout(() => {
                setModalStyle(null);
            }, duration);
        }
        return () => {
            cancelAnimationFrame(animationFrame);
            if (timer) clearTimeout(timer);
        };
    }, [showModal]);

    // Banner slideshow: update bannerIndex every 1.5 seconds.
    useEffect(() => {
        if (showModal && card?.banner && card.banner.length > 0) {
            slideshowTimer.current = setInterval(() => {
                setBannerIndex((prev) => (prev + 1) % card.banner.length);
            }, 1500);
        }
        return () => {
            if (slideshowTimer.current) clearInterval(slideshowTimer.current);
        };
    }, [showModal, card]);

    const resetSlideshowTimer = () => {
        if (slideshowTimer.current) {
            clearInterval(slideshowTimer.current);
        }
        if (showModal && card?.banner && card.banner.length > 0) {
            slideshowTimer.current = setInterval(() => {
                setBannerIndex((prev) => (prev + 1) % card.banner.length);
            }, 1500);
        }
    };

    const handlePrev = () => {
        if (card?.banner && card.banner.length > 0) {
            setBannerIndex((prev) => (prev - 1 + card.banner.length) % card.banner.length);
            resetSlideshowTimer();
        }
    };

    const handleNext = () => {
        if (card?.banner && card.banner.length > 0) {
            setBannerIndex((prev) => (prev + 1) % card.banner.length);
            resetSlideshowTimer();
        }
    };

    useEffect(() => {
        setShowModal(isHovering);
    }, [isHovering]);

    const handleCardMouseEnter = () => {
        hoverTimer.current = setTimeout(() => {
            setIsHovering(true);
        }, 300);
    };

    const handleCardMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setIsHovering(false);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowModal((prev) => !prev);
    };

    useEffect(() => {
        return () => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
            if (touchTimer.current) clearTimeout(touchTimer.current);
        };
    }, []);

    useEffect(() => {
        const pageElements = document.getElementsByClassName('page');
        for (let i = 0; i < pageElements.length; i++) {
            (pageElements[i] as HTMLElement).style.filter = showModal
                ? 'brightness(0.6)'
                : 'brightness(1)';
        }
    }, [showModal]);

    const handleTouchStart = () => {
        touchTimer.current = setTimeout(() => {
            setShowModal(true);
        }, 300);
    };

    const handleTouchEnd = () => {
        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }
    };

    const handleTouchCancel = () => {
        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    // Render modal via portal.
    const modal =
        card && cardRef.current && modalStyle
            ? createPortal(
                  <div
                      style={modalStyle}
                      className="bg-gray-800/60 backdrop-blur-md rounded-lg p-2.5 border border-gray-400/50 transition-all flex flex-col justify-between pt-0"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      data-oid="6-tg91n"
                  >
                      <button
                          onClick={() => setShowModal(false)}
                          className="absolute top-0 right-0 text-white bg-gray-800 hover:bg-gradient-to-r hover:from-violet-500/80 hover:to-purple-400/80 px-3 py-2 rounded-md z-10 border border-gray-400/50"
                          data-oid="b9bjkqg"
                      >
                          <XMarkIcon className="size-6" data-oid="2xz:g8h" />
                      </button>
                      <div className="flex flex-col w-full" data-oid="xbx07tm">
                          <h3
                              className="pb-2 pl-2 pt-2 bg-gray-700/40 backdrop-blur-md text-md sm:text-lg md:text-xl font-semibold text-white text-clip line-clamp-1"
                              data-oid=":70-x_3"
                          >
                              {card?.title || 'Loading...'}
                          </h3>
                          <div
                              className="flex pb-2 items-center space-x-2 mt-1 text-sm sm:text-md"
                              data-oid="5231e_."
                          >
                              <span
                                  className="text-yellow-400 flex gap-1 items-center"
                                  data-oid="sk5-rur"
                              >
                                  <StarIcon className="size-3" data-oid="r8.zqaf" /> 0
                              </span>
                              <span className="text-gray-300" data-oid="evsv:gp">
                                  • {card?.year || '----'}
                              </span>
                              <span className="text-purple-300 text-sm" data-oid="_zpb:oh">
                                  •
                              </span>
                              <span
                                  className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm"
                                  data-oid="w-fq56w"
                              >
                                  Movie
                              </span>
                          </div>
                      </div>
                      {/* Conditionally render TrailersComp if trailers exist, otherwise show banner slideshow */}
                      {card?.trailers && card.trailers.length > 0 ? (
                          <TrailersComp trailers={card.trailers} data-oid="b2k1fsm" />
                      ) : (
                          card.banner && (
                              <div
                                  className="relative w-full h-56 overflow-hidden rounded-md mb-4"
                                  data-oid="q3hmmy."
                              >
                                  <BannerImage
                                      key={bannerIndex}
                                      src={
                                          card.banner[bannerIndex]?.thumbnail ||
                                          `https://placehold.co/640x360?text=Preview+Not+Available`
                                      }
                                      alt="Banner Preview"
                                      data-oid=".0neb0o"
                                  />

                                  {card.banner.length > 1 && (
                                      <>
                                          <button
                                              onClick={handlePrev}
                                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full"
                                              data-oid="5rtf3_1"
                                          >
                                              <ArrowLeftCircleIcon
                                                  className="size-10 text-violet-400"
                                                  data-oid="5.2yvg0"
                                              />
                                          </button>
                                          <button
                                              onClick={handleNext}
                                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full"
                                              data-oid=":zxuj0k"
                                          >
                                              <ArrowRightCircleIcon
                                                  className="size-10 text-violet-400"
                                                  data-oid="oy2xm--"
                                              />
                                          </button>
                                      </>
                                  )}
                              </div>
                          )
                      )}
                      <div data-oid="wf6_2--">
                          <div
                              className="text-gray-300 text-base sm:text-lg overflow-hidden line-clamp-4 transition-all duration-300 mb-4"
                              data-oid="smlx9:e"
                          >
                              {card.overview || 'No overview available.'}
                          </div>
                          <div className="flex flex-row items-center" data-oid="9jgrk16">
                              <Link href={`/details/movie/${title}`} data-oid="61h8e.k">
                                  <button
                                      className="text-white bg-gradient-to-r from-violet-600 to-purple-500 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-400 px-4 py-2 rounded-3xl flex items-center text-sm md:text-base transition-all duration-750 ease-in-out gap-0.5"
                                      data-oid="e3bnl0s"
                                  >
                                      View Details{' '}
                                      <ChevronRightIcon className="size-4" data-oid="a3bcs3x" />
                                  </button>
                              </Link>
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            <div
                ref={cardRef}
                className="relative block w-[fit-content] cursor-pointer"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                onClick={handleCardClick}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                data-oid="s:fxdiz"
            >
                <div
                    className="rounded-lg border border-gray-400/50 overflow-hidden relative transition-transform duration-300 w-[140px] sm:w-[150px] md:w-[180px] lg:w-[180px] xl:w-[200px] h-[210px] sm:h-[220px] md:h-[250px] lg:h-[280px] xl:h-[300px]"
                    data-oid="-.qady5"
                >
                    {!imageLoaded && (
                        <div
                            className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg"
                            data-oid="17mhjux"
                        />
                    )}
                    {cardImage && (
                        <img
                            src={cardImage}
                            alt={card?.title || title}
                            className={`w-full h-full object-cover transition-opacity ease-in-out duration-300 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            data-oid="0utx-75"
                        />
                    )}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                        data-oid="mubz1ot"
                    >
                        <div className="absolute bottom-0 p-4 w-full" data-oid="c:c504z">
                            <h3
                                className="text-sm sm:text-base md:text-lg font-semibold text-white"
                                data-oid="e0:k0ia"
                            >
                                {card?.title || 'Loading...'}
                            </h3>
                            <div
                                className="flex items-center space-x-2 mt-1 text-xs sm:text-sm"
                                data-oid="mf-nexa"
                            >
                                <span
                                    className="text-yellow-400 flex gap-1 items-center"
                                    data-oid="gigx0u2"
                                >
                                    <StarIcon className="size-3" data-oid="j77k4x_" /> 0
                                </span>
                                <span className="text-gray-300" data-oid="47-60il">
                                    • {card?.year || '----'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal}
        </>
    );
};
