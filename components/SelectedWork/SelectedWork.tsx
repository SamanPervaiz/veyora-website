"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SelectedWork.module.css";

const projects = [
  {
    number: "01",
    title: "HOTEL OPERATIONS",
    title2: "AUTOMATION",
    description:
      "From WhatsApp orders to seamless hotel operations — connected, automated, and intelligent.",
    flow: ["WHATSAPP", "AUTOMATION", "KITCHEN", "DELIVERY"],
    video: "/hotel-automation.mp4",
  },
  {
    number: "02",
    title: "HOSPITAL EMERGENCY",
    title2: "DASHBOARD",
    description:
      "Real-time data visibility designed to support faster decisions and smoother emergency operations.",
    flow: ["TRIAGE", "ASSESSMENT", "TREATMENT", "MONITORING"],
    video: "/hospital-dashboard.mp4",
  },
  {
    number: "03",
    title: "AI SOCIAL",
    title2: "CONTENT ENGINE",
    description:
      "AI-powered content generation, video creation, publishing, and performance tracking in one connected system.",
    flow: ["CONTENT", "AI VIDEO", "PUBLISH", "ANALYTICS"],
    video: "/ai-social-engine.mp4",
  },
  {
    number: "04",
    title: "DIGITAL PRODUCT",
    title2: "EXPERIENCE",
    description:
      "From idea and strategy to design, development, launch, and measurable digital impact.",
    flow: ["IDEA", "DESIGN", "BUILD", "LAUNCH"],
    video: "/digital-product.mp4",
  },
];

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const rawProgress = -rect.top / scrollableDistance;

      const nextProgress = Math.max(
        0,
        Math.min(1, rawProgress)
      );

      setProgress(nextProgress);

      const nextIndex = Math.min(
        projects.length - 1,
        Math.floor(nextProgress * projects.length)
      );

      setActiveIndex(nextIndex);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.muted = true;

        const playVideo = async () => {
          try {
            await video.play();
          } catch {
            // Browser may block autoplay.
          }
        };

        playVideo();
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className={styles.work}
    >
      <div className={styles.sticky}>
        <div className={styles.grid} />

        {/* TOP BAR */}
        <div className={styles.topBar}>
          <span>SELECTED WORK</span>
          <span>VEYORA / SYSTEMS IN ACTION</span>
        </div>

        {/* PROGRESS */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.stage}>
          {/* LEFT CONTENT */}
          <div className={styles.copy}>
            <div className={styles.projectCount}>
              <span>
                {projects[activeIndex].number}
              </span>

              <span>/ 04</span>
            </div>

            <p className={styles.eyebrow}>
              CASE STUDY
            </p>

            <h2>
              {projects[activeIndex].title}
              <br />
              {projects[activeIndex].title2}
            </h2>

            <p className={styles.description}>
              {projects[activeIndex].description}
            </p>

            <div className={styles.flow}>
              {projects[activeIndex].flow.map(
                (item, index) => (
                  <div
                    className={styles.flowItem}
                    key={item}
                  >
                    <span className={styles.flowNumber}>
                      0{index + 1}
                    </span>

                    <span>{item}</span>

                    {index <
                      projects[activeIndex].flow.length - 1 && (
                      <span className={styles.flowArrow}>
                        →
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            <div className={styles.bottomMeta}>
              <span>VEYORA</span>
              <span>BUILT FOR IMPACT</span>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className={styles.visualWrap}>
            {projects.map((project, index) => {
              const distance =
                index - activeIndex;

              const isActive =
                index === activeIndex;

              return (
                <div
                  key={project.number}
                  className={styles.visual}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `
                      translate3d(
                        0,
                        ${distance * 28}px,
                        0
                      )
                      scale(${isActive ? 1 : 0.96})
                    `,
                    zIndex: isActive ? 5 : 1,
                    pointerEvents: isActive
                      ? "auto"
                      : "none",
                  }}
                >
                  <div className={styles.frame}>
                    {/* FRAME HEADER */}
                    <div className={styles.frameTop}>
                      <span>
                        {project.number} /{" "}
                        {project.title}
                      </span>

                      <span
                        className={styles.liveDot}
                      >
                        LIVE
                      </span>
                    </div>

                    {/* VIDEO */}
                    <video
                      ref={(element) => {
                        videoRefs.current[index] =
                          element;
                      }}
                      className={styles.video}
                      src={project.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />

                    {/* EFFECTS */}
                    <div className={styles.scanLine} />

                    <div
                      className={`${styles.corner} ${styles.topLeft}`}
                    />

                    <div
                      className={`${styles.corner} ${styles.topRight}`}
                    />

                    <div
                      className={`${styles.corner} ${styles.bottomLeft}`}
                    />

                    <div
                      className={`${styles.corner} ${styles.bottomRight}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PROJECT RAIL */}
        <div className={styles.sideRail}>
          {projects.map((project, index) => (
            <div
              key={project.number}
              className={`${styles.railItem} ${
                index === activeIndex
                  ? styles.railActive
                  : ""
              }`}
            >
              <span>{project.number}</span>

              <span>{project.title}</span>
            </div>
          ))}
        </div>

        {/* SCROLL HINT */}
        <div className={styles.scrollHint}>
          <span>SCROLL TO EXPLORE</span>

          <span className={styles.scrollArrow}>
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}