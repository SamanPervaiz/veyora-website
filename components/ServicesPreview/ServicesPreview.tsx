"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./ServicesPreview.module.css";

type Service = {
  number: string;
  title: string;
  short: string;
  description: string;
  tags: string[];
  visual: "automation" | "software" | "data" | "security" | "growth";
};

const services: Service[] = [
  {
    number: "01",
    title: "AI & AUTOMATION",
    short: "Systems that work smarter.",
    description:
      "AI agents, intelligent workflows, business process automation and connected integrations designed to reduce repetitive work.",
    tags: ["AI AGENTS", "N8N", "WORKFLOWS", "APIs"],
    visual: "automation",
  },
  {
    number: "02",
    title: "SOFTWARE & DIGITAL PRODUCTS",
    short: "Ideas turned into products.",
    description:
      "Custom web applications, platforms, dashboards and digital products built around how your business actually operates.",
    tags: ["WEB APPS", "PLATFORMS", "PRODUCTS", "DASHBOARDS"],
    visual: "software",
  },
  {
    number: "03",
    title: "DATA & BUSINESS INTELLIGENCE",
    short: "Data turned into direction.",
    description:
      "Analytics, reporting and business intelligence systems that transform scattered information into something your team can understand and use.",
    tags: ["POWER BI", "SQL", "PYTHON", "ANALYTICS"],
    visual: "data",
  },
  {
    number: "04",
    title: "CYBER SECURITY",
    short: "Digital systems built with security in mind.",
    description:
      "Security-focused solutions for applications, digital environments, information and the systems connecting them.",
    tags: ["SECURITY", "RISK", "MONITORING", "PROTECTION"],
    visual: "security",
  },
  {
    number: "05",
    title: "AI CREATIVE & GROWTH",
    short: "Creativity connected to growth.",
    description:
      "AI-powered content, lead generation and digital growth systems that connect creative output with meaningful business activity.",
    tags: ["AI CONTENT", "LEAD GEN", "SOCIAL", "GROWTH"],
    visual: "growth",
  },
];

function AutomationVisual() {
  return (
    <div className={styles.visualScene}>
      <div className={styles.visualEyebrow}>LIVE WORKFLOW</div>

      <div className={styles.workflow}>
        <div className={styles.workflowNode}>
          <small>01</small>
          <strong>TRIGGER</strong>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowNodeActive}>
          <small>02</small>
          <strong>AI AGENT</strong>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowNode}>
          <small>03</small>
          <strong>ACTION</strong>
        </div>

        <div className={styles.workflowResult}>
          <span>RESULT</span>
          <b>→</b>
        </div>
      </div>

      <div className={styles.visualCaption}>
        THINK <span>·</span> DECIDE <span>·</span> ACT
      </div>
    </div>
  );
}

function SoftwareVisual() {
  return (
    <div className={styles.visualScene}>
      <div className={styles.visualEyebrow}>DIGITAL PRODUCT</div>

      <div className={styles.browser}>
        <div className={styles.browserTop}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.browserBody}>
          <div className={styles.browserSidebar}>
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className={styles.browserContent}>
            <div className={styles.browserHeading}>
              <span />
              <span />
            </div>

            <div className={styles.browserCards}>
              <div />
              <div />
              <div />
            </div>

            <div className={styles.browserGraph}>
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.visualCaption}>
        DESIGN <span>·</span> BUILD <span>·</span> SCALE
      </div>
    </div>
  );
}

function DataVisual() {
  return (
    <div className={styles.visualScene}>
      <div className={styles.visualEyebrow}>BUSINESS SIGNAL</div>

      <div className={styles.dataStage}>
        <div className={styles.dataMetric}>
          <small>REVENUE SIGNAL</small>
          <strong>+28.4%</strong>
        </div>

        <svg
          className={styles.dataChart}
          viewBox="0 0 500 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 180 C55 165 70 138 120 145 S185 168 225 116 S285 95 325 110 S380 55 425 70 S470 35 500 20" />
        </svg>

        <div className={styles.dataLabels}>
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
          <span>W5</span>
        </div>
      </div>

      <div className={styles.visualCaption}>
        COLLECT <span>·</span> UNDERSTAND <span>·</span> ACT
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className={styles.visualScene}>
      <div className={styles.visualEyebrow}>PROTECTED ENVIRONMENT</div>

      <div className={styles.securityStage}>
        <div className={styles.securityRing} />
        <div className={styles.securityRing} />
        <div className={styles.securityRing} />

        <div className={styles.securityShield}>
          <span>V</span>
        </div>

        <div className={styles.securityPoints}>
          <i className={styles.securityPointOne} />
          <i className={styles.securityPointTwo} />
          <i className={styles.securityPointThree} />
          <i className={styles.securityPointFour} />
        </div>
      </div>

      <div className={styles.visualCaption}>
        DETECT <span>·</span> PROTECT <span>·</span> RESPOND
      </div>
    </div>
  );
}

function GrowthVisual() {
  return (
    <div className={styles.visualScene}>
      <div className={styles.visualEyebrow}>GROWTH SYSTEM</div>

      <div className={styles.growthStage}>
        <div className={styles.growthCard}>
          <small>CONTENT</small>
          <strong>01</strong>
        </div>

        <div className={styles.growthArrow}>→</div>

        <div className={styles.growthCard}>
          <small>ATTENTION</small>
          <strong>02</strong>
        </div>

        <div className={styles.growthArrow}>→</div>

        <div className={styles.growthCard}>
          <small>LEAD</small>
          <strong>03</strong>
        </div>

        <div className={styles.growthArrow}>→</div>

        <div className={styles.growthCardHighlight}>
          <small>GROWTH</small>
          <strong>04</strong>
        </div>
      </div>

      <div className={styles.visualCaption}>
        CREATE <span>·</span> CONNECT <span>·</span> GROW
      </div>
    </div>
  );
}

function ServiceVisual({
  type,
}: {
  type: Service["visual"];
}) {
  switch (type) {
    case "automation":
      return <AutomationVisual />;

    case "software":
      return <SoftwareVisual />;

    case "data":
      return <DataVisual />;

    case "security":
      return <SecurityVisual />;

    case "growth":
      return <GrowthVisual />;

    default:
      return null;
  }
}

export default function ServicesPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const active = services[activeIndex];

  return (
    <section
      className={styles.services}
      id="services-preview"
    >
      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className={styles.ambientGrid} />
      <div className={styles.ambientGlow} />
      <div className={styles.ambientNoise} />

      <div className={styles.inner}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.metaLine} />
            <span>06 — WHAT WE DO</span>
          </div>

          <div className={styles.headerCopy}>
            <h2>
              Not just services.
              <br />
              <em>Systems built around possibility.</em>
            </h2>

            <p>
              Veyora brings technology, intelligence and creativity
              together to solve real business problems.
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN EXPERIENCE
        ===================================================== */}

        <div className={styles.experience}>
          {/* SERVICE INDEX */}

          <div className={styles.serviceIndex}>
            {services.map((service, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={service.number}
                  type="button"
                  className={`${styles.serviceRow} ${
                    isActive ? styles.serviceRowActive : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                >
                  <span className={styles.rowNumber}>
                    {service.number}
                  </span>

                  <span className={styles.rowContent}>
                    <span className={styles.rowTitle}>
                      {service.title}
                    </span>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.span
                          className={styles.rowDescription}
                          initial={
                            reduceMotion
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  height: 0,
                                  y: -5,
                                }
                          }
                          animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0,
                          }}
                          exit={
                            reduceMotion
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  height: 0,
                                  y: -5,
                                }
                          }
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {service.short}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>

                  <span className={styles.rowArrow}>
                    ↗
                  </span>

                  <span className={styles.rowSignal}>
                    <i />
                  </span>
                </button>
              );
            })}
          </div>

          {/* ===================================================
              VISUAL PANEL
          =================================================== */}

          <div className={styles.visualPanel}>
            <div className={styles.visualTop}>
              <span>
                VEYORA / CAPABILITY {active.number}
              </span>

              <span>
                0{activeIndex + 1} / 05
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.visual}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.985,
                        y: 10,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.985,
                        y: -8,
                      }
                }
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={styles.visualContent}
              >
                <ServiceVisual type={active.visual} />
              </motion.div>
            </AnimatePresence>

            <div className={styles.visualCornerTop} />
            <div className={styles.visualCornerBottom} />
          </div>
        </div>

        {/* =====================================================
            ACTIVE SERVICE INFORMATION
        ===================================================== */}

        <div className={styles.detail}>
          <div className={styles.detailNumber}>
            {active.number}
          </div>

          <div className={styles.detailMain}>
            <div className={styles.detailTitle}>
              <span>ACTIVE CAPABILITY</span>
              <h3>{active.title}</h3>
            </div>

            <p>{active.description}</p>

            <div className={styles.tags}>
              {active.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <a
            href="/services"
            className={styles.detailAction}
          >
            <span>EXPLORE SERVICE</span>
            <b>↗</b>
          </a>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className={styles.footer}>
          <div className={styles.footerStatement}>
            <span>ONE COMPANY</span>
            <i>·</i>
            <span>MULTIPLE DISCIPLINES</span>
            <i>·</i>
            <span>ONE CONNECTED SYSTEM</span>
          </div>

          <div className={styles.footerStatus}>
            <span className={styles.statusDot} />
            SYSTEM READY
          </div>
        </div>
      </div>
    </section>
  );
}