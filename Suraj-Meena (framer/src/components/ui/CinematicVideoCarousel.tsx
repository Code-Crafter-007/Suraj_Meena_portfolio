'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
} from 'lucide-react';
import { CmsMedia } from '@/types/cms';
import { resolveMediaUrl } from '@/lib/mediaResolver';
import styles from './CinematicVideoCarousel.module.css';

interface CinematicVideoCarouselProps {
  items: CmsMedia[];
  projectTitle?: string;
  category?: string;
}

export const CinematicVideoCarousel: React.FC<CinematicVideoCarouselProps> = ({
  items,
  projectTitle,
  category = 'Visual Cut',
}) => {
  // Filter for playable items
  const validItems = items.filter((item) => Boolean(item.fileUrl));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Auto-fade controls overlay after 2.5s of inactivity while playing
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDraggingRef = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Track responsive screen size
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = validItems.length;

  // Inactivity auto-fade timer on user interaction
  const resetHideTimer = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    const revealTimer = setTimeout(() => {
      setIsControlsVisible(true);
    }, 0);

    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2500);
    }

    return () => {
      clearTimeout(revealTimer);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [activeIndex, isPlaying]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Manage video playback across active vs inactive cards
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;

      if (idx === activeIndex) {
        vid.muted = isMuted;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Autoplay policy fallback: mute and retry
              vid.muted = true;
              setIsMuted(true);
              vid.play().catch(() => {});
            });
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [activeIndex, isMuted]);

  // Toggle Play / Pause for active card
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVid = videoRefs.current[activeIndex];
    if (!activeVid) return;

    if (activeVid.paused) {
      activeVid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      activeVid.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Sound / Unmute
  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVid = videoRefs.current[activeIndex];
    if (!activeVid) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    activeVid.muted = newMuted;
    if (activeVid.paused) {
      activeVid.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Request Fullscreen for active video with exact native aspect ratio
  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVid = videoRefs.current[activeIndex];
    if (activeVid) {
      if (activeVid.requestFullscreen) {
        activeVid.requestFullscreen().catch(() => {});
      } else if ((activeVid as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
        (activeVid as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      } else if ((activeVid as unknown as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
        (activeVid as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
      }
    }
  };

  // Select card on click
  const handleCardClick = (idx: number) => {
    if (isDraggingRef.current) return;
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  };

  if (total === 0) {
    return (
      <section className={styles.carouselSection}>
        <div className={styles.emptyNotice}>
          <Film size={28} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>Additional video cuts and visual studies coming soon.</p>
        </div>
      </section>
    );
  }

  // Graceful handling for single card
  if (total === 1) {
    const single = validItems[0];
    const singleResolved = resolveMediaUrl(single.fileUrl);

    return (
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Selected Cut</span>
          <h2 className={styles.title}>Project Film Exploration</h2>
          <p className={styles.subtitle}>
            Motion study, visual cadence and directorial cut.
          </p>
        </div>

        <div className={styles.singleCardContainer}>
          <div
            className={`${styles.deviceCard} ${styles.active}`}
            onMouseMove={resetHideTimer}
            onMouseEnter={resetHideTimer}
            onTouchStart={resetHideTimer}
            onClick={() => {
              if (!isControlsVisible) resetHideTimer();
            }}
          >
            <div className={styles.notch} />
            <div className={`${styles.gradientTop} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`} />
            <div className={`${styles.gradientBottom} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`} />

            <div className={`${styles.cardHeader} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`}>
              <div className={styles.cardCategory}>{category}</div>
              <h3 className={styles.cardTitle}>{single.title || projectTitle}</h3>
              {single.caption && <p className={styles.cardCaption}>{single.caption}</p>}
            </div>

            <div className={styles.videoLayer}>
              {singleResolved.provider === 'youtube' || singleResolved.provider === 'vimeo' ? (
                <iframe
                  src={singleResolved.embedUrl}
                  title={single.title || 'Video Player'}
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[0] = el;
                  }}
                  src={single.fileUrl}
                  poster={single.posterUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className={styles.videoElement}
                />
              )}
            </div>

            {singleResolved.provider !== 'youtube' && singleResolved.provider !== 'vimeo' && (
              <>
                <div className={`${styles.centerControl} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`}>
                  <button
                    type="button"
                    className={styles.playCircle}
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: 3 }} />}
                  </button>
                </div>

                <div className={`${styles.cardFooter} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`}>
                  <button
                    type="button"
                    className={styles.actionPill}
                    onClick={handleToggleSound}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX size={14} />
                        <span>Muted (Tap for Sound)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} />
                        <span>Sound Active</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  className={`${styles.cornerButton} ${styles.overlayElement} ${isControlsVisible ? styles.overlayVisible : styles.overlayHidden}`}
                  onClick={handleFullscreen}
                  title="Fullscreen"
                >
                  <Maximize2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  const isNarrowMobile = windowWidth < 390;
  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 1024;

  return (
    <section id="video-showcase" className={styles.carouselSection} aria-label="3D Video Carousel">
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Project Video Showcase</h2>
        <p className={styles.subtitle}>
          Swipe or drag to explore cut variations, behind the scenes and motion rhythms.
        </p>
      </div>

      {/* 3D Perspective Stage */}
      <div className={styles.stageContainer}>
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className={`${styles.navArrow} ${styles.navArrowLeft}`}
          aria-label="Previous video card"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`${styles.navArrow} ${styles.navArrowRight}`}
          aria-label="Next video card"
        >
          <ChevronRight size={22} />
        </button>

        {/* Swipe / Drag Stage */}
        <motion.div
          className={styles.carouselTrack}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={(_e, info) => {
            const swipeThreshold = 45;
            const velocityThreshold = 280;

            if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
              handlePrev();
            } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
              handleNext();
            }

            setTimeout(() => {
              isDraggingRef.current = false;
            }, 60);
          }}
        >
          {validItems.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const itemResolved = resolveMediaUrl(item.fileUrl);
            const isExternal = itemResolved.provider === 'youtube' || itemResolved.provider === 'vimeo';

            // Compute 3D Coverflow positioning
            let xOffset = 0;
            let scaleVal = 1;
            let rotateYVal = 0;
            let zVal = 0;
            let opacityVal = 1;
            let zIndexVal = 10;

            if (isMobile) {
              // Mobile curve layout (< 600px)
              if (offset === 0) {
                xOffset = 0;
                scaleVal = 1;
                rotateYVal = 0;
                zVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else if (offset === -1 || offset === 1) {
                if (isNarrowMobile) {
                  // Under 390px: hide adjacent cards to prevent clipping and cramped viewport
                  xOffset = offset > 0 ? 140 : -140;
                  scaleVal = 0.72;
                  rotateYVal = offset > 0 ? -10 : 10;
                  zVal = -60;
                  opacityVal = 0;
                  zIndexVal = 0;
                } else {
                  // 390px to 599px: subtle peek with reduced perspective/rotation
                  xOffset = offset > 0 ? 135 : -135;
                  scaleVal = 0.74;
                  rotateYVal = offset > 0 ? -12 : 12;
                  zVal = -50;
                  opacityVal = 0.35;
                  zIndexVal = 5;
                }
              } else {
                xOffset = offset > 0 ? 240 : -240;
                scaleVal = 0.5;
                rotateYVal = offset > 0 ? -20 : 20;
                zVal = -100;
                opacityVal = 0;
                zIndexVal = 0;
              }
            } else if (isTablet) {
              // Tablet curve layout
              if (offset === 0) {
                xOffset = 0;
                scaleVal = 1;
                rotateYVal = 0;
                zVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else if (offset === -1) {
                xOffset = -220;
                scaleVal = 0.8;
                rotateYVal = 28;
                zVal = -80;
                opacityVal = 0.82;
                zIndexVal = 5;
              } else if (offset === 1) {
                xOffset = 220;
                scaleVal = 0.8;
                rotateYVal = -28;
                zVal = -80;
                opacityVal = 0.82;
                zIndexVal = 5;
              } else {
                xOffset = offset > 0 ? 380 : -380;
                scaleVal = 0.62;
                rotateYVal = offset > 0 ? -40 : 40;
                zVal = -160;
                opacityVal = 0;
                zIndexVal = 0;
              }
            } else {
              // Desktop 3D Coverflow
              if (offset === 0) {
                xOffset = 0;
                scaleVal = 1;
                rotateYVal = 0;
                zVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else if (offset === -1) {
                xOffset = -285;
                scaleVal = 0.82;
                rotateYVal = 34;
                zVal = -80;
                opacityVal = 0.88;
                zIndexVal = 5;
              } else if (offset === 1) {
                xOffset = 285;
                scaleVal = 0.82;
                rotateYVal = -34;
                zVal = -80;
                opacityVal = 0.88;
                zIndexVal = 5;
              } else if (offset === -2) {
                xOffset = -475;
                scaleVal = 0.68;
                rotateYVal = 44;
                zVal = -170;
                opacityVal = 0.38;
                zIndexVal = 2;
              } else if (offset === 2) {
                xOffset = 475;
                scaleVal = 0.68;
                rotateYVal = -44;
                zVal = -170;
                opacityVal = 0.38;
                zIndexVal = 2;
              } else {
                xOffset = offset > 0 ? 620 : -620;
                scaleVal = 0.5;
                rotateYVal = offset > 0 ? -50 : 50;
                zVal = -260;
                opacityVal = 0;
                zIndexVal = 0;
              }
            }

            return (
              <motion.div
                key={item.id}
                className={styles.cardMotionWrapper}
                onClick={() => handleCardClick(index)}
                initial={false}
                animate={{
                  x: `calc(-50% + ${xOffset}px)`,
                  y: '-50%',
                  scale: scaleVal,
                  rotateY: rotateYVal,
                  z: zVal,
                  opacity: opacityVal,
                  zIndex: zIndexVal,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 270,
                  damping: 27,
                  mass: 0.85,
                }}
                style={{
                  pointerEvents: opacityVal === 0 ? 'none' : 'auto',
                }}
              >
                <div
                  className={`${styles.deviceCard} ${isActive ? styles.active : ''}`}
                  onMouseMove={isActive ? resetHideTimer : undefined}
                  onMouseEnter={isActive ? resetHideTimer : undefined}
                  onTouchStart={isActive ? resetHideTimer : undefined}
                >
                  {/* Top Notch */}
                  <div className={styles.notch} />

                  {/* Soft Vignettes */}
                  <div
                    className={`${styles.gradientTop} ${
                      isActive
                        ? `${styles.overlayElement} ${
                            isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                          }`
                        : ''
                    }`}
                  />
                  <div
                    className={`${styles.gradientBottom} ${
                      isActive
                        ? `${styles.overlayElement} ${
                            isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                          }`
                        : ''
                    }`}
                  />

                  {/* Header Meta */}
                  <div
                    className={`${styles.cardHeader} ${
                      isActive
                        ? `${styles.overlayElement} ${
                            isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                          }`
                        : ''
                    }`}
                  >
                    <div className={styles.cardCategory}>{category}</div>
                    <h3 className={styles.cardTitle}>
                      {item.title || item.fileName}
                    </h3>
                    {item.caption && (
                      <p className={styles.cardCaption}>{item.caption}</p>
                    )}
                  </div>

                  {/* Video Surface */}
                  <div className={styles.videoLayer}>
                    {isExternal ? (
                      isActive ? (
                        <iframe
                          src={itemResolved.embedUrl}
                          title={item.title || item.fileName || 'Video Player'}
                          className={styles.videoElement}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.posterUrl || itemResolved.posterFallbackUrl || '/assets/images/default-project.jpg'}
                          alt={item.title || item.fileName || 'Video preview'}
                          className={styles.videoElement}
                          style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                        />
                      )
                    ) : (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={item.fileUrl}
                        poster={item.posterUrl}
                        playsInline
                        loop
                        preload={Math.abs(offset) <= 1 ? 'auto' : 'none'}
                        className={styles.videoElement}
                      />
                    )}
                  </div>

                  {/* Active Card Controls (only for native HTML5 video; external providers have native chrome) */}
                  {isActive && !isExternal && (
                    <>
                      <div
                        className={`${styles.centerControl} ${styles.overlayElement} ${
                          isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                        }`}
                      >
                        <button
                          type="button"
                          className={styles.playCircle}
                          onClick={handleTogglePlay}
                          aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        >
                          {isPlaying ? (
                            <Pause size={24} />
                          ) : (
                            <Play size={24} style={{ marginLeft: 3 }} />
                          )}
                        </button>
                      </div>

                      <div
                        className={`${styles.cardFooter} ${styles.overlayElement} ${
                          isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                        }`}
                      >
                        <button
                          type="button"
                          className={styles.actionPill}
                          onClick={handleToggleSound}
                        >
                          {isMuted ? (
                            <>
                              <VolumeX size={14} />
                              <span>Muted (Click for Sound)</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={14} />
                              <span>Sound Playing</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        className={`${styles.cornerButton} ${styles.overlayElement} ${
                          isControlsVisible ? styles.overlayVisible : styles.overlayHidden
                        }`}
                        onClick={handleFullscreen}
                        title="Fullscreen (Exact Aspect Ratio)"
                      >
                        <Maximize2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination & Counter */}
      <div className={styles.paginationRow}>
        <span className={styles.counterLabel}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        <div className={styles.dotsContainer}>
          {validItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`${styles.dot} ${
                i === activeIndex ? styles.dotActive : styles.dotInactive
              }`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
