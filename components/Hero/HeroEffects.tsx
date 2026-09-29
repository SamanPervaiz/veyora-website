"use client";

import { useEffect, useRef } from "react";

export default function HeroEffects() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#home");
    const glow = glowRef.current;
    const displacement = filterRef.current;

    if (!hero || !glow || !displacement) return;

    let raf = 0;

    let currentX = 0;
    let currentY = 0;

    let targetX = 0;
    let targetY = 0;

    const handleMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();

      targetX =
        (event.clientX - rect.left) / rect.width - 0.5;

      targetY =
        (event.clientY - rect.top) / rect.height - 0.5;
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      const x = currentX * 100;
      const y = currentY * 70;

      glow.style.transform =
        `translate3d(${x}px, ${y}px, 0)`;

      /*
       * Very subtle image distortion.
       * It becomes stronger only when the cursor
       * moves away from the center.
       */
      const distance =
        Math.sqrt(
          currentX * currentX +
          currentY * currentY
        );

      const distortion =
        Math.min(distance * 10, 5);

      displacement.setAttribute(
        "scale",
        distortion.toFixed(2)
      );

      hero.style.setProperty(
        "--hero-mouse-x",
        currentX.toFixed(4)
      );

      hero.style.setProperty(
        "--hero-mouse-y",
        currentY.toFixed(4)
      );

      raf = requestAnimationFrame(animate);
    };

    hero.addEventListener(
      "mousemove",
      handleMove
    );

    hero.addEventListener(
      "mouseleave",
      handleLeave
    );

    raf = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener(
        "mousemove",
        handleMove
      );

      hero.removeEventListener(
        "mouseleave",
        handleLeave
      );

      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* SVG image-distortion filter */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{
          position: "absolute",
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter
            id="veyora-image-distortion"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="8"
              result="noise"
            />

            <feDisplacementMap
              ref={filterRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* Cinematic light */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "520px",
          height: "520px",
          left: "50%",
          top: "48%",
          transform:
            "translate3d(0, 0, 0)",
          marginLeft: "-260px",
          marginTop: "-260px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 2,
          background:
            "radial-gradient(circle, rgba(110,124,246,0.13) 0%, rgba(110,124,246,0.045) 28%, rgba(255,155,77,0.025) 44%, transparent 70%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
          opacity: 0.8,
          willChange: "transform",
        }}
      />
    </>
  );
}