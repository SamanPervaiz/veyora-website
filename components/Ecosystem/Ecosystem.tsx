"use client";

import { useLayoutEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Ecosystem.module.css";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    number: "01",
    title: "AI × AUTOMATION",
    description: "Smarter workflows for a lighter tomorrow.",
    label: "AUTOMATE / SIMPLIFY / SCALE",
    video: "/ai-automation.mp4",
  },
  {
    number: "02",
    title: "DIGITAL PRODUCTS",
    description: "Digital experiences that create real value.",
    label: "CREATE / BUILD / LAUNCH",
    video: "/digital-products.mp4",
  },
  {
    number: "03",
    title: "DATA × SYSTEMS",
    description: "Turn data into decisions.",
    label: "ANALYZE / ORGANIZE / GROW",
    video: "/data-systems.mp4",
  },
  {
    number: "04",
    title: "VEYORA ACADEMY",
    description: "Skills for a brighter, more independent future.",
    label: "LEARN / UPSKILL / THRIVE",
    video: "/academy.mp4",
  },
];

type DisciplineItem = (typeof items)[number];

export default function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orbCoreRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  const basePathsRef = useRef<(SVGPathElement | null)[]>([]);
  const energyPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const particlesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const orb = orbRef.current;
    const orbCore = orbCoreRef.current;
    const heading = headingRef.current;

    if (!section || !scene || !orb || !orbCore || !heading) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(
        (card): card is HTMLDivElement => card !== null
      );

      const videos = videosRef.current.filter(
        (video): video is HTMLVideoElement => video !== null
      );

      const basePaths = basePathsRef.current.filter(
        (path): path is SVGPathElement => path !== null
      );

      const energyPaths = energyPathsRef.current.filter(
        (path): path is SVGPathElement => path !== null
      );

      const particles = particlesRef.current.filter(
        (particle): particle is HTMLSpanElement => particle !== null
      );

      /* =========================
         INITIAL STATES
      ========================= */

      gsap.set(heading, {
        opacity: 0,
        y: 28,
      });

      gsap.set(cards, {
        opacity: 0,
        y: 38,
        scale: 0.95,
      });

      gsap.set(orb, {
        opacity: 0,
        scale: 0.65,
        transformOrigin: "center center",
      });

      gsap.set(orbCore, {
        scale: 0.7,
        transformOrigin: "center center",
      });

      gsap.set(particles, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      /* =========================
         SCROLL INTRO
      ========================= */

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2200",
          scrub: 1.05,
          pin: scene,
          anticipatePin: 1,
        },
      });

      intro.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      intro.to(
        orb,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3"
      );

      intro.to(
        orbCore,
        {
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.5)",
        },
        "-=0.5"
      );

      intro.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.35"
      );

      intro.to(
        particles,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(2)",
        },
        "-=0.4"
      );

      /* =========================
         ORB
      ========================= */

      gsap.to(orb, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      gsap.to(orbCore, {
        scale: 1.05,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* =========================
         PARTICLES
      ========================= */

      particles.forEach((particle, index) => {
        gsap.to(particle, {
          opacity: 0.5,
          scale: 1.25,
          duration: 1.8 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.25,
        });
      });

      /* =========================
         MOVING ENERGY
      ========================= */

      energyPaths.forEach((path, index) => {
        const length = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: `70 ${length}`,
          strokeDashoffset: index % 2 === 0 ? length : 0,
        });

        gsap.to(path, {
          strokeDashoffset:
            index % 2 === 0 ? -length : length,
          duration: 2.8 + index * 0.25,
          repeat: -1,
          ease: "none",
          delay: index * 0.3,
        });
      });

      /* =========================
         BASE LINE PULSE
      ========================= */

      basePaths.forEach((path, index) => {
        gsap.to(path, {
          opacity: 0.4,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.22,
        });
      });

      /* =========================
         SMART VIDEO LOADING
      ========================= */

      const videoTimers: ReturnType<typeof setTimeout>[] = [];

      const loadAndPlayVideo = (
        video: HTMLVideoElement,
        autoplay = true
      ) => {
        if (!video) return;

        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;

        const source = video.dataset.src;

        if (source && !video.src) {
          video.src = source;
          video.load();
        }

        if (!autoplay) return;

        const playVideo = () => {
          const promise = video.play();

          if (promise !== undefined) {
            promise.catch(() => {});
          }
        };

        if (video.readyState >= 2) {
          playVideo();
        } else {
          video.addEventListener("loadeddata", playVideo, {
            once: true,
          });

          video.addEventListener("canplay", playVideo, {
            once: true,
          });
        }
      };

      /*
        Only the first video is considered immediate.
        Remaining videos are loaded one by one after the
        initial page experience has had time to settle.

        This reduces the amount of media competing for
        the initial render without changing the visuals.
      */

      videos.forEach((video, index) => {
        if (index === 0) {
          const timer = setTimeout(() => {
            loadAndPlayVideo(video);
          }, 150);

          videoTimers.push(timer);
          return;
        }

        const delay = 3200 + (index - 1) * 1800;

        const timer = setTimeout(() => {
          loadAndPlayVideo(video);
        }, delay);

        videoTimers.push(timer);
      });

      /* =========================
         CARD HOVER
      ========================= */

      cards.forEach((card, index) => {
        const media = card.querySelector<HTMLElement>(
          "[data-media]"
        );

        const video = videos[index];

        const glow = card.querySelector<HTMLElement>(
          "[data-glow]"
        );

        const sweep = card.querySelector<HTMLElement>(
          "[data-sweep]"
        );

        const enter = () => {
          gsap.to(card, {
            y: -7,
            scale: 1.018,
            duration: 0.4,
            ease: "power3.out",
          });

          if (media) {
            gsap.to(media, {
              scale: 1.02,
              duration: 0.65,
              ease: "power3.out",
            });
          }

          if (video) {
            loadAndPlayVideo(video);

            gsap.to(video, {
              scale: 1.03,
              duration: 0.65,
              ease: "power3.out",
            });
          }

          if (glow) {
            gsap.to(glow, {
              opacity: 1,
              duration: 0.3,
            });
          }

          if (sweep) {
            gsap.fromTo(
              sweep,
              { xPercent: -130 },
              {
                xPercent: 130,
                duration: 0.85,
                ease: "power2.inOut",
              }
            );
          }
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
          });

          if (media) {
            gsap.to(media, {
              scale: 1,
              duration: 0.65,
              ease: "power3.out",
            });
          }

          if (video) {
            gsap.to(video, {
              scale: 1.01,
              duration: 0.65,
              ease: "power3.out",
            });
          }

          if (glow) {
            gsap.to(glow, {
              opacity: 0,
              duration: 0.3,
            });
          }
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
      });

      return () => {
        videoTimers.forEach((timer) => {
          clearTimeout(timer);
        });
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.ecosystem}
    >
      <div
        ref={sceneRef}
        className={styles.scene}
      >
        <div className={styles.backgroundGlow} />
        <div className={styles.noise} />

        <div
          ref={headingRef}
          className={styles.heading}
        >
          <span className={styles.eyebrow}>
            THE VEYORA ECOSYSTEM
          </span>

          <h2>
            From idea to <em>impact.</em>
          </h2>

          <p>
            Technology, systems, products and people —
            <br />
            connected to turn ideas into meaningful outcomes.
          </p>
        </div>

        <svg
          className={styles.connections}
          viewBox="0 0 1400 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={(element) => {
              basePathsRef.current[0] = element;
            }}
            d="M420 305 C525 320 620 360 700 400"
          />

          <path
            ref={(element) => {
              basePathsRef.current[1] = element;
            }}
            d="M980 305 C875 320 780 360 700 400"
          />

          <path
            ref={(element) => {
              basePathsRef.current[2] = element;
            }}
            d="M420 605 C530 555 625 460 700 400"
          />

          <path
            ref={(element) => {
              basePathsRef.current[3] = element;
            }}
            d="M980 605 C870 555 775 460 700 400"
          />

          <path
            ref={(element) => {
              energyPathsRef.current[0] = element;
            }}
            className={styles.energyPath}
            d="M420 305 C525 320 620 360 700 400"
          />

          <path
            ref={(element) => {
              energyPathsRef.current[1] = element;
            }}
            className={`${styles.energyPath} ${styles.energyBlue}`}
            d="M980 305 C875 320 780 360 700 400"
          />

          <path
            ref={(element) => {
              energyPathsRef.current[2] = element;
            }}
            className={`${styles.energyPath} ${styles.energyOrange}`}
            d="M420 605 C530 555 625 460 700 400"
          />

          <path
            ref={(element) => {
              energyPathsRef.current[3] = element;
            }}
            className={styles.energyPath}
            d="M980 605 C870 555 775 460 700 400"
          />
        </svg>

        <div
          ref={orbRef}
          className={styles.orb}
        >
          <div
            className={`${styles.orbit} ${styles.orbitOne}`}
          />

          <div
            className={`${styles.orbit} ${styles.orbitTwo}`}
          />

          <div className={styles.orbGlow} />

          <div
            ref={orbCoreRef}
            className={styles.orbCore}
          >
            <div className={styles.coreLight} />
            <span>VEYORA</span>
          </div>

          <span
            ref={(element) => {
              particlesRef.current[0] = element;
            }}
            className={`${styles.particle} ${styles.particleOne}`}
          />

          <span
            ref={(element) => {
              particlesRef.current[1] = element;
            }}
            className={`${styles.particle} ${styles.particleTwo}`}
          />

          <span
            ref={(element) => {
              particlesRef.current[2] = element;
            }}
            className={`${styles.particle} ${styles.particleThree}`}
          />

          <span
            ref={(element) => {
              particlesRef.current[3] = element;
            }}
            className={`${styles.particle} ${styles.particleFour}`}
          />
        </div>

        <div
          className={`${styles.card} ${styles.topLeft}`}
        >
          <DisciplineCard
            item={items[0]}
            index={0}
            cardsRef={cardsRef}
            videosRef={videosRef}
          />
        </div>

        <div
          className={`${styles.card} ${styles.topRight}`}
        >
          <DisciplineCard
            item={items[1]}
            index={1}
            cardsRef={cardsRef}
            videosRef={videosRef}
          />
        </div>

        <div
          className={`${styles.card} ${styles.bottomLeft}`}
        >
          <DisciplineCard
            item={items[2]}
            index={2}
            cardsRef={cardsRef}
            videosRef={videosRef}
          />
        </div>

        <div
          className={`${styles.card} ${styles.bottomRight}`}
        >
          <DisciplineCard
            item={items[3]}
            index={3}
            cardsRef={cardsRef}
            videosRef={videosRef}
          />
        </div>

        <div className={styles.footerMessage}>
          <span>4 DISCIPLINES</span>
          <i />
          <span>1 ECOSYSTEM</span>
          <i />
          <span>∞ POSSIBILITIES</span>
        </div>
      </div>
    </section>
  );
}

function DisciplineCard({
  item,
  index,
  cardsRef,
  videosRef,
}: {
  item: DisciplineItem;
  index: number;
  cardsRef: MutableRefObject<(HTMLDivElement | null)[]>;
  videosRef: MutableRefObject<(HTMLVideoElement | null)[]>;
}) {
  return (
    <div
      ref={(element) => {
        cardsRef.current[index] = element;
      }}
      className={styles.cardInner}
    >
      <div
        data-media
        className={styles.videoWrap}
      >
        <video
          ref={(element) => {
            videosRef.current[index] = element;
          }}
          data-src={item.video}
          muted
          loop
          playsInline
          preload="none"
          className={styles.video}
        />

        <div className={styles.videoShade} />

        <div
          data-glow
          className={styles.cardGlow}
        />

        <div
          data-sweep
          className={styles.sweep}
        />

        <div className={styles.cardNumber}>
          {item.number}
        </div>

        <div className={styles.liveMark}>
          <span />
          LIVE
        </div>
      </div>

      <div className={styles.cardMeta}>
        <h3>{item.title}</h3>

        <p>{item.description}</p>

        <div className={styles.cardLabel}>
          {item.label}
        </div>
      </div>
    </div>
  );
}