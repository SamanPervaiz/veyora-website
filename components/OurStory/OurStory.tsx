"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./OurStory.module.css";

export default function OurStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  /* ==========================================================
     SECTION VISIBILITY
  ========================================================== */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ==========================================================
     START VIDEO WHEN SECTION BECOMES VISIBLE
  ========================================================== */

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
        setVideoReady(true);
      } catch {
        /*
          Muted autoplay should normally be allowed.
          If the browser delays playback, the video remains
          available and can start once playback is permitted.
        */
      }
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      playVideo();
    };

    const handleLoadedData = () => {
      setVideoReady(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);

    /*
      The source is already present in the video element.
      Calling play() here starts playback as soon as enough
      data is available.
    */

    playVideo();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [visible]);

  /* ==========================================================
     SOUND CONTROL
  ========================================================== */

  const toggleSound = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);

      try {
        await video.play();
      } catch {
        // Browser may block playback.
      }
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.story} ${
        visible ? styles.visible : ""
      }`}
    >
      <div className={styles.storyInner}>
        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className={styles.storyContent}>
          <span className={styles.eyebrow}>
            THE STORY BEHIND VEYORA
          </span>

          <h2>
            We turn what if
            <br />
            into <em>what’s next.</em>
          </h2>

          <p>
            Veyora brings technology, creativity and
            possibility together to create meaningful
            digital experiences, intelligent systems and
            new opportunities.
          </p>

          <div className={styles.storyMeta}>
            <span>IDEAS</span>
            <i>•</i>
            <span>PEOPLE</span>
            <i>•</i>
            <span>TECHNOLOGY</span>
            <i>•</i>
            <span>IMPACT</span>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className={styles.storyMedia}>
          <div className={styles.storyFrame}>
            <div className={styles.storyFrameTop}>
              <span>VEYORA</span>
              <span>01 / VISION</span>
            </div>

            <div className={styles.videoContainer}>
              <video
                ref={videoRef}
                className={`${styles.video} ${
                  videoReady ? styles.videoVisible : ""
                }`}
                src="/our-story.mp4"
                poster="/veyora-story-vision.png"
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className={styles.videoOverlay} />

              <div className={styles.scanLine} />

              {/* =================================================
                  SOUND BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={toggleSound}
                aria-label={
                  isMuted
                    ? "Turn sound on"
                    : "Mute sound"
                }
                style={{
                  position: "absolute",
                  right: "18px",
                  bottom: "18px",
                  zIndex: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  height: "38px",
                  padding: "0 15px",
                  border:
                    "1px solid rgba(243, 241, 234, 0.32)",
                  borderRadius: "999px",
                  background:
                    "rgba(10, 12, 16, 0.78)",
                  color: "#f3f1ea",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.35)",
                }}
              >
                <span
                  style={{
                    color: "#ff9b4d",
                    fontSize: "9px",
                  }}
                >
                  {isMuted ? "◼" : "◼◼"}
                </span>

                <span>
                  {isMuted ? "SOUND" : "MUTE"}
                </span>
              </button>

              <div className={styles.cornerTopLeft} />
              <div className={styles.cornerTopRight} />
              <div className={styles.cornerBottomLeft} />
              <div className={styles.cornerBottomRight} />
            </div>

            <div className={styles.storyFrameBottom}>
              <span>POSSIBILITY / 01</span>
              <span>IDEAS • SYSTEMS • PEOPLE</span>
              <span>02</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}