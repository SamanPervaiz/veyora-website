"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import styles from "./Hero.module.css";

const Veyora3DScene = dynamic(
  () => import("../ThreeD/Veyora3DScene"),
  { ssr: false }
);

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      hero.style.setProperty("--mouse-x", `${x}`);
      hero.style.setProperty("--mouse-y", `${y}`);
    };

    const handleMouseLeave = () => {
      hero.style.setProperty("--mouse-x", "0");
      hero.style.setProperty("--mouse-y", "0");
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /*
   * ==========================================================
   * HOMEPAGE NAVIGATION
   * ==========================================================
   *
   * Homepage order:
   *
   * 0 — Hero
   * 1 — Ecosystem
   * 2 — Our Story
   * 3 — Veyora Engine
   * 4 — Selected Work
   * 5 — Services Preview
   * 6 — Academy Preview
   * 7 — Team
   * 8 — Final CTA
   *
   * Dedicated pages:
   *
   * Solutions → /services
   * Academy   → /academy
   * Contact   → /contact
   */

  const scrollToSection = (sectionIndex: number) => {
    const sections = document.querySelectorAll("main > section");
    const target = sections[sectionIndex];

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      id="home"
    >
      {/* =====================================================
          EXISTING HERO IMAGE
      ===================================================== */}

      <div className={styles.imageLayer}>
        <Image
          src="/veyora-hero.png"
          alt="Veyora team"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>

      {/* =====================================================
          CINEMATIC 3D LAYER
      ===================================================== */}

      <div className={styles.threeDLayer}>
        <Veyora3DScene />
      </div>

      {/* =====================================================
          EXISTING OVERLAY
      ===================================================== */}

      <div className={styles.overlay} />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className={styles.navbar}>
        <div className={styles.logo}>
          <span>VEYORA</span>

          <small>
            TECHNOLOGY FOR A BRIGHTER TOMORROW
          </small>
        </div>

        <nav>
          {/* HOME — stays on homepage */}
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(0);
            }}
          >
            Home
          </a>

          {/* WHAT IS VEYORA — homepage section */}
          <a
            href="#story"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(2);
            }}
          >
            What is Veyora
          </a>

          {/* SOLUTIONS — dedicated Services page */}
          <a href="/services">
            Solutions
          </a>

          {/* ACADEMY — dedicated Academy page */}
          <a href="/academy">
            Academy
          </a>

          {/* SUCCESS STORIES — homepage section */}
          <a
            href="#work"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(4);
            }}
          >
            Success Stories
          </a>

          {/* COMMUNITY — homepage Team section */}
          <a
            href="#community"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(7);
            }}
          >
            Community
          </a>

          {/* CONTACT — dedicated Contact page */}
          <a href="/contact">
            Contact
          </a>
        </nav>

        {/* LET'S BUILD — dedicated Contact page */}
        <a
          href="/contact"
          className={styles.buildButton}
        >
          Let&apos;s Build
          <span>→</span>
        </a>
      </header>

      {/* =====================================================
          MAIN HERO CONTENT
      ===================================================== */}

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          IDEAS × INTELLIGENCE × SYSTEMS
        </p>

        <h1>
          Build what&apos;s
          <br />
          <em>next.</em>
        </h1>

        <p className={styles.description}>
          We design and build intelligent technology,
          digital experiences, data systems and learning
          pathways for businesses and people building a
          brighter tomorrow.
        </p>

        <div className={styles.actions}>
          {/* EXPLORE VEYORA — homepage Ecosystem */}
          <a
            href="#ecosystem"
            className={styles.primaryButton}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(1);
            }}
          >
            Explore Veyora
            <span>→</span>
          </a>

          {/* SEE WHAT WE BUILD — homepage Selected Work */}
          <a
            href="#work"
            className={styles.secondaryButton}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(4);
            }}
          >
            See What We Build
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <div className={styles.bottomLeft}>
        AI × AUTOMATION
        &nbsp;&nbsp;·&nbsp;&nbsp;
        DIGITAL PRODUCTS
        &nbsp;&nbsp;·&nbsp;&nbsp;
        DATA × SYSTEMS
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div className={styles.scroll}>
        <span>
          SCROLL TO EXPLORE
        </span>

        <i />
      </div>
    </section>
  );
}