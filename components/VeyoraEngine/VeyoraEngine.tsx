"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./VeyoraEngine.module.css";

const stages = [
  {
    number: "01",
    label: "DISCOVER",
    title: "POSSIBILITY",
    line1: "Ideas start",
    line2: "as questions.",
    description: "An idea begins as a possibility waiting to move.",
  },
  {
    number: "02",
    label: "SIGNAL",
    title: "DIRECTION",
    line1: "Questions become",
    line2: "signals.",
    description: "Possibility gains a direction and starts moving.",
  },
  {
    number: "03",
    label: "SYSTEM",
    title: "CONNECTION",
    line1: "Signals become",
    line2: "systems.",
    description: "Technology, data and people begin to connect.",
  },
  {
    number: "04",
    label: "BUILD",
    title: "CREATION",
    line1: "Systems become",
    line2: "something real.",
    description: "The connected system takes shape and becomes useful.",
  },
  {
    number: "05",
    label: "IMPACT",
    title: "WHAT'S NEXT",
    line1: "Reality becomes",
    line2: "what's next.",
    description: "What was imagined is now ready to move forward.",
  },
];

export default function VeyoraEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let ticking = false;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const maxScroll = section.offsetHeight - window.innerHeight;

      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }

      const value = Math.max(
        0,
        Math.min((-rect.top) / maxScroll, 1)
      );

      setProgress(value);
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const stageIndex = Math.min(
    stages.length - 1,
    Math.floor(progress * stages.length)
  );

  const activeStage = stages[stageIndex];

  const stageStart = stageIndex / stages.length;
  const stageEnd = (stageIndex + 1) / stages.length;

  const stageProgress = Math.max(
    0,
    Math.min(
      (progress - stageStart) / (stageEnd - stageStart),
      1
    )
  );

  const engineStyle = {
    "--engine-progress": progress,
    "--stage-progress": stageProgress,
  } as CSSProperties;

  const getNodeProgress = (threshold: number) =>
    Math.max(
      0,
      Math.min((progress - threshold) / 0.12, 1)
    );

  const ideaProgress = getNodeProgress(0.03);
  const signalProgress = getNodeProgress(0.22);
  const buildProgress = getNodeProgress(0.43);
  const peopleProgress = getNodeProgress(0.63);

  return (
    <section
      ref={sectionRef}
      className={styles.engine}
      style={engineStyle}
    >
      <div className={styles.sticky}>
        <div className={styles.backgroundGrid} />

        <div className={styles.topBar}>
          <span>03 / THE VEYORA ENGINE</span>
          <span>HOW POSSIBILITY MOVES</span>
        </div>

        <div className={styles.mainLayout}>
          {/* LEFT */}
          <div className={styles.copy}>
            <div className={styles.kicker}>
              <span className={styles.liveDot} />
              VEYORA / ENGINE
            </div>

            <div className={styles.headlineStage}>
              <div
                key={`${stageIndex}-one`}
                className={styles.headlineLine}
              >
                {activeStage.line1}
              </div>

              <div
                key={`${stageIndex}-two`}
                className={`${styles.headlineLine} ${styles.headlineAccent}`}
              >
                {activeStage.line2}
              </div>
            </div>

            <p key={activeStage.number} className={styles.description}>
              {activeStage.description}
            </p>
          </div>

          {/* CENTER */}
          <div className={styles.engineVisual}>
            <div className={styles.visualHeader}>
              <span>PROCESS / 05</span>

              <span className={styles.status}>
                {activeStage.number} / {activeStage.label}
              </span>
            </div>

            {/* OUTER RINGS */}
            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={`${styles.orbit} ${styles.orbitThree}`} />

            {/* CONNECTION SYSTEM */}
            <svg
              className={styles.connections}
              viewBox="0 0 600 600"
              aria-hidden="true"
            >
              <line
                x1="300"
                y1="300"
                x2="150"
                y2="145"
                pathLength="1"
                className={styles.connection}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1 - ideaProgress,
                }}
              />

              <line
                x1="300"
                y1="300"
                x2="450"
                y2="145"
                pathLength="1"
                className={styles.connection}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1 - signalProgress,
                }}
              />

              <line
                x1="300"
                y1="300"
                x2="470"
                y2="410"
                pathLength="1"
                className={styles.connection}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1 - buildProgress,
                }}
              />

              <line
                x1="300"
                y1="300"
                x2="130"
                y2="410"
                pathLength="1"
                className={styles.connection}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1 - peopleProgress,
                }}
              />

              <circle
                cx="150"
                cy="145"
                r="4"
                className={`${styles.nodePoint} ${
                  ideaProgress > 0.1 ? styles.nodeActive : ""
                }`}
                style={{
                  transform: `scale(${0.7 + ideaProgress * 0.6})`,
                  transformOrigin: "150px 145px",
                }}
              />

              <circle
                cx="450"
                cy="145"
                r="4"
                className={`${styles.nodePoint} ${
                  signalProgress > 0.1 ? styles.nodeActive : ""
                }`}
                style={{
                  transform: `scale(${0.7 + signalProgress * 0.6})`,
                  transformOrigin: "450px 145px",
                }}
              />

              <circle
                cx="470"
                cy="410"
                r="4"
                className={`${styles.nodePoint} ${
                  buildProgress > 0.1 ? styles.nodeActive : ""
                }`}
                style={{
                  transform: `scale(${0.7 + buildProgress * 0.6})`,
                  transformOrigin: "470px 410px",
                }}
              />

              <circle
                cx="130"
                cy="410"
                r="4"
                className={`${styles.nodePoint} ${
                  peopleProgress > 0.1 ? styles.nodeActive : ""
                }`}
                style={{
                  transform: `scale(${0.7 + peopleProgress * 0.6})`,
                  transformOrigin: "130px 410px",
                }}
              />
            </svg>

            {/* CORE */}
            <div
              className={styles.core}
              style={{
                transform: `
                  translate(-50%, -50%)
                  scale(${0.78 + progress * 0.28})
                  rotate(${progress * 18}deg)
                `,
              }}
            >
              <div className={styles.coreInner}>
                <span>V</span>
              </div>
            </div>

            {/* NODE — IDEA */}
            <div
              className={`${styles.node} ${styles.nodeTopLeft} ${
                ideaProgress > 0.05 ? styles.nodeVisible : ""
              }`}
              style={{
                transform: `
                  translate(
                    ${-18 + ideaProgress * 18}px,
                    ${12 - ideaProgress * 12}px
                  )
                  scale(${0.88 + ideaProgress * 0.12})
                `,
              }}
            >
              <span>IDEA</span>
              <small>INPUT</small>
            </div>

            {/* NODE — SIGNAL */}
            <div
              className={`${styles.node} ${styles.nodeTopRight} ${
                signalProgress > 0.05
                  ? styles.nodeVisible
                  : ""
              }`}
              style={{
                transform: `
                  translate(
                    ${18 - signalProgress * 18}px,
                    ${12 - signalProgress * 12}px
                  )
                  scale(${0.88 + signalProgress * 0.12})
                `,
              }}
            >
              <span>SIGNAL</span>
              <small>DIRECTION</small>
            </div>

            {/* NODE — BUILD */}
            <div
              className={`${styles.node} ${styles.nodeBottomRight} ${
                buildProgress > 0.05 ? styles.nodeVisible : ""
              }`}
              style={{
                transform: `
                  translate(
                    ${18 - buildProgress * 18}px,
                    ${-12 + buildProgress * 12}px
                  )
                  scale(${0.88 + buildProgress * 0.12})
                `,
              }}
            >
              <span>BUILD</span>
              <small>CREATE</small>
            </div>

            {/* NODE — PEOPLE */}
            <div
              className={`${styles.node} ${styles.nodeBottomLeft} ${
                peopleProgress > 0.05
                  ? styles.nodeVisible
                  : ""
              }`}
              style={{
                transform: `
                  translate(
                    ${-18 + peopleProgress * 18}px,
                    ${-12 + peopleProgress * 12}px
                  )
                  scale(${0.88 + peopleProgress * 0.12})
                `,
              }}
            >
              <span>PEOPLE</span>
              <small>CONNECT</small>
            </div>

            {/* ENERGY */}
            <div
              className={styles.energy}
              style={{
                transform: `rotate(${progress * 540}deg)`,
                opacity: 0.2 + progress * 0.8,
              }}
            />

            {/* STAGE MESSAGE */}
            <div className={styles.centerMessage}>
              <span>{activeStage.number}</span>
              <strong>{activeStage.title}</strong>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.statusPanel}>
            <div className={styles.stageCounter}>
              <span>{activeStage.number}</span>
              <span>/ 05</span>
            </div>

            <div className={styles.stageLine} />

            <div className={styles.stageLabel}>
              {activeStage.label}
            </div>

            <div className={styles.stageTitle}>
              {activeStage.title}
            </div>

            <p>{activeStage.description}</p>

            <div className={styles.stageRail}>
              {stages.map((stage, index) => {
                const active = index === stageIndex;
                const completed = index < stageIndex;

                return (
                  <div
                    key={stage.number}
                    className={`${styles.railItem} ${
                      active ? styles.railActive : ""
                    } ${
                      completed
                        ? styles.railCompleted
                        : ""
                    }`}
                  >
                    <span>{stage.number}</span>
                    <i />
                    <small>{stage.label}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className={styles.bottomBar}>
          <span>INPUT / IDEA</span>
          <span>SYSTEM / VEYORA</span>
          <span>OUTPUT / IMPACT</span>
          <span>STATUS / BUILDING</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>

        <div className={styles.sectionNumber}>03</div>
      </div>
    </section>
  );
}