"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./Services.module.css";

type Service = {
  number: string;
  title: string;
  short: string;
  description: string;
  tags: string[];
  visual: string;
};

const services: Service[] = [
  {
    number: "01",
    title: "AI & AUTOMATION",
    short: "Systems that work smarter.",
    description:
      "AI agents, intelligent workflows, business process automation and connected integrations designed to reduce repetitive work.",
    tags: ["AI AGENTS", "N8N", "WORKFLOWS", "APIs"],
    visual: "/hotel-automation.mp4",
  },
  {
    number: "02",
    title: "SOFTWARE & DIGITAL PRODUCTS",
    short: "Ideas turned into products.",
    description:
      "Custom web applications, platforms, dashboards and digital products built around how your business actually operates.",
    tags: ["WEB APPS", "PLATFORMS", "PRODUCTS", "DASHBOARDS"],
    visual: "/digital-product.mp4",
  },
  {
    number: "03",
    title: "DATA & BUSINESS INTELLIGENCE",
    short: "Data turned into direction.",
    description:
      "Analytics, reporting and business intelligence systems that transform scattered information into something your team can understand and use.",
    tags: ["POWER BI", "SQL", "PYTHON", "ANALYTICS"],
    visual: "/hospital-dashboard.mp4",
  },
  {
    number: "04",
    title: "CYBER SECURITY",
    short: "Digital systems built with security in mind.",
    description:
      "Security-focused solutions for applications, digital environments, information and the systems connecting them.",
    tags: ["SECURITY", "RISK", "MONITORING", "PROTECTION"],
    visual: "/cyber-security.mp4",
  },
  {
    number: "05",
    title: "AI CREATIVE & GROWTH",
    short: "Creativity connected to growth.",
    description:
      "AI-powered content, lead generation and digital growth systems that connect creative output with meaningful business activity.",
    tags: ["AI CONTENT", "LEAD GEN", "SOCIAL", "GROWTH"],
    visual: "/ai-social-engine.mp4",
  },
];

const processSteps = [
  {
    number: "01",
    title: "UNDERSTAND",
    text: "We understand the idea, problem, workflow and outcome that matters.",
  },
  {
    number: "02",
    title: "DESIGN",
    text: "We shape the right system, product or digital experience before building.",
  },
  {
    number: "03",
    title: "BUILD",
    text: "We turn the direction into a working digital solution.",
  },
  {
    number: "04",
    title: "CONNECT",
    text: "We connect the tools, data, workflows and systems that need to work together.",
  },
  {
    number: "05",
    title: "LAUNCH",
    text: "We bring the system into the real world and prepare it for what is next.",
  },
];

export default function Services() {
  const reducedMotion = useReducedMotion();
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-service-section]")
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );

        const current = visibleEntries[0];

        if (!current) return;

        const index = sections.indexOf(current.target as HTMLElement);

        if (index >= 0) {
          setActiveService(index);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToService = (index: number) => {
    const target = document.querySelector<HTMLElement>(
      `[data-service-section="${index}"]`
    );

    if (!target) return;

    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main className={styles.page}>
      {/* =========================
          HERO
      ========================== */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />

        <div className={styles.heroInner}>
          <div className={styles.heroMeta}>
            <span>01 — VEYORA SERVICES</span>
            <span>SYSTEMS / CAPABILITIES / POSSIBILITY</span>
          </div>

          <div className={styles.heroMain}>
            <div className={styles.heroContent}>
              <div className={styles.heroEyebrow}>
                <span className={styles.signalDot} />
                TECHNOLOGY · SYSTEMS · POSSIBILITY
              </div>

              <h1>
                Systems for
                <br />
                <em>what&apos;s next.</em>
              </h1>

              <p className={styles.heroLead}>
                We build practical digital systems across AI, software, data,
                security and creative technology — designed around the way
                people and businesses actually work.
              </p>

              <div className={styles.heroSignalRow}>
                <span>VEYORA / CAPABILITY INDEX</span>
                <i />
                <strong>05 DISCIPLINES</strong>
              </div>
            </div>

            <div className={styles.heroStudio}>
              <div className={styles.heroStudioTop}>
                <span>CAPABILITY INDEX</span>
                <span>01 — 05</span>
              </div>

              <div className={styles.heroStudioBody}>
                <nav
                  className={styles.heroNav}
                  aria-label="Services navigation"
                >
                  {services.map((service, index) => (
                    <button
                      key={service.number}
                      type="button"
                      className={
                        index === activeService
                          ? styles.active
                          : undefined
                      }
                      onMouseEnter={() => setActiveService(index)}
                      onFocus={() => setActiveService(index)}
                      onClick={() => scrollToService(index)}
                    >
                      <span>{service.number}</span>
                      <strong>{service.title}</strong>
                      <i>↗</i>
                    </button>
                  ))}
                </nav>

                <div className={styles.heroActive}>
                  <div className={styles.heroActiveTop}>
                    <span>ACTIVE CAPABILITY</span>
                    <span>{services[activeService].number} / 05</span>
                  </div>

                  <div className={styles.heroActiveVisual}>
                    <div className={styles.heroActiveOrb}>
                      <span>{services[activeService].number}</span>
                    </div>
                    <div className={styles.heroActiveLines} />
                  </div>

                  <div className={styles.heroActiveCopy}>
                    <h2>{services[activeService].title}</h2>
                    <p>{services[activeService].short}</p>

                    <div className={styles.heroActiveTags}>
                      {services[activeService].tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.heroStudioBottom}>
                <span>SYSTEMS / PEOPLE / IMPACT</span>
                <span>VEYORA / NEXT</span>
              </div>
            </div>
          </div>

          <div className={styles.heroFooter}>
            <div className={styles.heroFooterStatement}>
              <span>AI</span>
              <i>·</i>
              <span>SOFTWARE</span>
              <i>·</i>
              <span>DATA</span>
              <i>·</i>
              <span>SECURITY</span>
              <i>·</i>
              <span>GROWTH</span>
            </div>

            <div className={styles.heroFooterScroll}>
              <span>EXPLORE CAPABILITIES</span>
              <i />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CAPABILITIES INTRO
      ========================== */}
      <section className={styles.servicesArea}>
        <div className={styles.servicesIntro}>
          <span>02 — CAPABILITIES</span>

          <p>
            Five disciplines. One connected approach to building what comes
            next.
          </p>
        </div>

        {/* =========================
            SERVICE SECTIONS
        ========================== */}
        {services.map((service, index) => {
          const sectionId = service.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          return (
            <section
              key={service.number}
              className={styles.serviceSection}
              data-service-section={index}
              id={sectionId}
            >
              <div className={styles.serviceTopline}>
                <span>{service.number}</span>
                <span>{service.title}</span>
              </div>

              <div className={styles.serviceLayout}>
                {/* VISUAL */}
                <div className={styles.serviceVisual}>
                  <div className={styles.visualFrame}>
                    <video
                      src={service.visual}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className={styles.video}
                      aria-label={`${service.title} visual`}
                    />

                    <div className={styles.visualOverlay} />

                    <div className={styles.visualCorner}>
                      <span>VEYORA</span>
                      <span>
                        {service.number}/05
                      </span>
                    </div>

                    <div className={styles.visualStatus}>
                      <span className={styles.statusDot} />
                      SYSTEM ACTIVE
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className={styles.serviceCopy}>
                  <div className={styles.serviceIndex}>
                    <span>{service.number}</span>
                    <span>CAPABILITY</span>
                  </div>

                  <h2>{service.title}</h2>

                  <p className={styles.serviceShort}>{service.short}</p>

                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>

                  <div className={styles.serviceTags}>
                    {service.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.serviceActionRow}>
                    <a href="/contact" className={styles.serviceAction}>
                      <span>START A PROJECT</span>
                      <b>↗</b>
                    </a>

                    <button
                      type="button"
                      className={styles.nextService}
                      onClick={() =>
                        scrollToService(
                          index === services.length - 1 ? 0 : index + 1
                        )
                      }
                    >
                      <span>
                        {index === services.length - 1
                          ? "BACK TO 01"
                          : `NEXT — ${services[index + 1].number}`}
                      </span>

                      <i aria-hidden="true">
                        {index === services.length - 1 ? "↑" : "↓"}
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </section>

      {/* =========================
          PROCESS
      ========================== */}
      <section className={styles.process}>
        <div className={styles.processHeader}>
          <div>
            <span>03 — HOW WE BUILD</span>

            <h2>
              From understanding
              <br />
              <em>to impact.</em>
            </h2>
          </div>

          <p>
            Every engagement follows a clear path — from the first question to
            a connected system that can move forward.
          </p>
        </div>

        <div className={styles.processRail}>
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className={styles.processStep}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 30,
                    }
              }
              whileInView={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.6,
                delay: reducedMotion ? 0 : index * 0.06,
              }}
            >
              <div className={styles.processNumber}>{step.number}</div>

              <div className={styles.processLine}>
                <span />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className={styles.finalCta}>
        <div className={styles.ctaGrid} />

        <div className={styles.ctaInner}>
          <div className={styles.ctaMeta}>
            <span>04 — LET&apos;S BUILD</span>
            <span>VEYORA / NEXT</span>
          </div>

          <div className={styles.ctaSignal} aria-hidden="true">
            <span className={styles.ctaSignalCore} />
            <span className={styles.ctaSignalRingOne} />
            <span className={styles.ctaSignalRingTwo} />
          </div>

          <div className={styles.ctaContent}>
            <span className={styles.ctaEyebrow}>FOR THE NEXT IDEA</span>

            <h2>
              Have something
              <br />
              <em>worth building?</em>
            </h2>

            <p>
              Tell us what you&apos;re trying to create, improve or automate.
              We&apos;ll help shape the system around it.
            </p>

            <div className={styles.ctaActions}>
              <a href="/contact" className={styles.primaryCta}>
                <span>START A CONVERSATION</span>
                <b>↗</b>
              </a>

              <a href="/#top" className={styles.secondaryCta}>
                EXPLORE VEYORA
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}