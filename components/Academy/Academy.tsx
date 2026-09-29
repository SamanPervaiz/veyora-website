"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./Academy.module.css";

type Course = {
  number: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  fee: string;
  total: string;
  accent: keyof typeof styles;
  pdf: string;
};

const courses: Course[] = [
  {
    number: "01",
    title: "Advanced AI Automation & AI Agents",
    category: "AI · AUTOMATION",
    description:
      "Build AI-powered workflows, intelligent automation systems, agents, integrations and practical business solutions.",
    duration: "6 MONTHS",
    fee: "PKR 9,000 / MONTH",
    total: "PKR 54,000",
    accent: "orange",
    pdf: "/academy/advanced-ai-automation.pdf",
  },
  {
    number: "02",
    title: "AI Engineering",
    category: "AI · ENGINEERING",
    description:
      "A practical pathway from Python and machine learning through deep learning, LLMs, RAG, AI agents and production AI.",
    duration: "6 MONTHS",
    fee: "PKR 10,000 / MONTH",
    total: "PKR 60,000",
    accent: "violet",
    pdf: "/academy/ai-engineering.pdf",
  },
  {
    number: "03",
    title: "Cyber Security & Ethical Hacking",
    category: "SECURITY · DEFENCE",
    description:
      "Learn digital defence, ethical hacking, web and API security, threat detection and security practices through controlled learning environments.",
    duration: "6 MONTHS",
    fee: "PKR 8,000 / MONTH",
    total: "PKR 48,000",
    accent: "blue",
    pdf: "/academy/cyber-security.pdf",
  },
  {
    number: "04",
    title: "Data Analytics & Business Intelligence",
    category: "DATA · BI",
    description:
      "Turn business data into useful decisions through Excel, SQL, Power BI, Python, analytics and dashboard development.",
    duration: "6 MONTHS",
    fee: "PKR 8,000 / MONTH",
    total: "PKR 48,000",
    accent: "teal",
    pdf: "/academy/data-analytics-bi.pdf",
  },
  {
    number: "05",
    title: "Full-Stack Web & App Development",
    category: "WEB · APPLICATIONS",
    description:
      "Build modern websites and applications across frontend, backend, databases, APIs, authentication, Git and deployment.",
    duration: "6 MONTHS",
    fee: "PKR 8,000 / MONTH",
    total: "PKR 48,000",
    accent: "purple",
    pdf: "/academy/full-stack-web-app-development.pdf",
  },
  {
    number: "06",
    title: "E-Commerce & Shopify Development",
    category: "E-COMMERCE · SHOPIFY",
    description:
      "Build, customize, operate and launch professional Shopify stores with practical e-commerce workflows, analytics and optimization.",
    duration: "6 MONTHS",
    fee: "PKR 7,000 / MONTH",
    total: "PKR 42,000",
    accent: "green",
    pdf: "/academy/ecommerce-shopify.pdf",
  },
  {
    number: "07",
    title: "AI-Powered Virtual Assistant & Remote Operations",
    category: "AI · REMOTE OPERATIONS",
    description:
      "Develop professional VA skills, client operations, CRM workflows, AI-assisted work and business automation.",
    duration: "6 MONTHS",
    fee: "PKR 6,000 / MONTH",
    total: "PKR 36,000",
    accent: "cyan",
    pdf: "/academy/ai-virtual-assistant.pdf",
  },
  {
    number: "08",
    title: "AI Lead Generation & Sales Research",
    category: "AI · LEAD GENERATION",
    description:
      "Learn prospect research, ICP development, lead qualification, CRM workflows, AI enrichment and automated lead systems.",
    duration: "6 MONTHS",
    fee: "PKR 6,000 / MONTH",
    total: "PKR 36,000",
    accent: "yellow",
    pdf: "/academy/ai-lead-generation.pdf",
  },
  {
    number: "09",
    title: "Freelancing & Remote Work",
    category: "FREELANCING · REMOTE",
    description:
      "Build a freelance career through positioning, portfolio development, client acquisition, delivery systems, AI-assisted workflows and retention.",
    duration: "6 MONTHS",
    fee: "PKR 5,000 / MONTH",
    total: "PKR 30,000",
    accent: "coral",
    pdf: "/academy/freelancing-remote-work.pdf",
  },
  {
    number: "10",
    title: "Project Management & Digital Operations",
    category: "PROJECTS · OPERATIONS",
    description:
      "Learn to plan projects, coordinate teams, document processes, manage risks, report progress and build efficient digital operations.",
    duration: "6 MONTHS",
    fee: "PKR 7,000 / MONTH",
    total: "PKR 42,000",
    accent: "indigo",
    pdf: "/academy/project-management-digital-operations.pdf",
  },
  {
    number: "11",
    title: "Graphic Design & AI Creative Design",
    category: "DESIGN · AI CREATIVE",
    description:
      "Develop visual design, branding, typography, social media design, image editing, AI-assisted creative workflows and portfolio skills.",
    duration: "6 MONTHS",
    fee: "PKR 7,000 / MONTH",
    total: "PKR 42,000",
    accent: "pink",
    pdf: "/academy/graphic-design-ai-creative.pdf",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "LEARN",
    text: "Understand the principle, tool or system.",
  },
  {
    number: "02",
    title: "PRACTICE",
    text: "Apply the skill through guided practical work.",
  },
  {
    number: "03",
    title: "BUILD",
    text: "Create something real instead of only taking notes.",
  },
  {
    number: "04",
    title: "PORTFOLIO",
    text: "Turn practical work into professional evidence.",
  },
  {
    number: "05",
    title: "OPPORTUNITY",
    text: "Use your skills for work, clients and professional growth.",
  },
];

export default function Academy() {
  const reducedMotion = useReducedMotion();
  const [activeCourse, setActiveCourse] = useState(0);

  const scrollToCourses = () => {
    document.getElementById("academy-programs")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroOrb} />
        <div className={styles.heroOrbSmall} />

        <div className={styles.heroInner}>
          <div className={styles.topMeta}>
            <span>01 — VEYORA ACADEMY</span>
            <span>LEARN / BUILD / GROW</span>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span />
              PRACTICAL TECHNOLOGY EDUCATION
            </div>

            <h1>
              Learn.
              <br />
              <em>Build.</em>
              <br />
              Become what&apos;s next.
            </h1>

            <p>
              Professional, project-based learning paths designed to turn
              knowledge into practical skills, real work and portfolio
              evidence.
            </p>

            <button
              type="button"
              className={styles.heroButton}
              onClick={scrollToCourses}
            >
              <span>EXPLORE PROGRAMS</span>
              <b>↓</b>
            </button>
          </div>

          <div className={styles.heroStats}>
            <div>
              <strong>11</strong>
              <span>
                PROFESSIONAL
                <br />
                PROGRAMS
              </span>
            </div>

            <div>
              <strong>6</strong>
              <span>
                MONTH
                <br />
                PATHWAYS
              </span>
            </div>

            <div>
              <strong>24</strong>
              <span>
                WEEKS OF
                <br />
                PRACTICE
              </span>
            </div>

            <div>
              <strong>01</strong>
              <span>
                CONNECTED
                <br />
                MISSION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className={styles.philosophy}>
        <div className={styles.sectionMeta}>
          <span>02 — THE ACADEMY</span>
          <span>FROM KNOWLEDGE TO CAPABILITY</span>
        </div>

        <div className={styles.philosophyGrid}>
          <div>
            <span className={styles.smallLabel}>WHY VEYORA ACADEMY</span>

            <h2>
              Skills become
              <br />
              <em>valuable</em> when
              <br />
              you can use them.
            </h2>
          </div>

          <div className={styles.philosophyCopy}>
            <p>
              Veyora Academy is built around practical learning. Students
              progress through structured learning paths, hands-on work,
              projects and portfolio evidence.
            </p>

            <p>
              The goal is not simply to complete lessons. It is to develop the
              ability to understand a problem, use the right tools, build a
              solution and explain the work professionally.
            </p>

            <div className={styles.principles}>
              <span>01 / PRACTICAL</span>
              <span>02 / PROJECT-BASED</span>
              <span>03 / PORTFOLIO-FOCUSED</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className={styles.programs} id="academy-programs">
        <div className={styles.programHeader}>
          <div>
            <span className={styles.sectionNumber}>03 — PROGRAMS</span>

            <h2>
              Choose your
              <br />
              <em>direction.</em>
            </h2>
          </div>

          <p>
            Eleven professional programs covering AI, software, data,
            cybersecurity, business operations, freelancing and creative
            technology.
          </p>
        </div>

        <div className={styles.programLayout}>
          <div className={styles.programList}>
            {courses.map((course, index) => (
              <button
                key={course.number}
                type="button"
                className={`${styles.programItem} ${
                  activeCourse === index ? styles.programActive : ""
                }`}
                onMouseEnter={() => setActiveCourse(index)}
                onFocus={() => setActiveCourse(index)}
                onClick={() => setActiveCourse(index)}
              >
                <span className={styles.programNumber}>
                  {course.number}
                </span>

                <span className={styles.programTitle}>
                  {course.title}
                </span>

                <span className={styles.programArrow}>↗</span>
              </button>
            ))}
          </div>

          <motion.div
            key={courses[activeCourse].number}
            className={`${styles.programDetail} ${
              styles[courses[activeCourse].accent]
            }`}
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className={styles.detailTop}>
              <span>{courses[activeCourse].number} / 11</span>
              <span>{courses[activeCourse].category}</span>
            </div>

            <div className={styles.detailCore}>
              <span className={styles.detailLabel}>PROGRAM</span>

              <h3>{courses[activeCourse].title}</h3>

              <p>{courses[activeCourse].description}</p>
            </div>

            <div className={styles.detailFacts}>
              <div>
                <span>DURATION</span>
                <strong>{courses[activeCourse].duration}</strong>
              </div>

              <div>
                <span>MONTHLY</span>
                <strong>{courses[activeCourse].fee}</strong>
              </div>

              <div>
                <span>6-MONTH TOTAL</span>
                <strong>{courses[activeCourse].total}</strong>
              </div>
            </div>

            <div className={styles.detailActions}>
              <a
                href={courses[activeCourse].pdf}
                target="_blank"
                rel="noreferrer"
              >
                VIEW COURSE PDF <span>↗</span>
              </a>

              <a href="/contact">
                APPLY / ASK ABOUT THIS PROGRAM <span>↗</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING MODEL */}
      <section className={styles.learning}>
        <div className={styles.sectionMeta}>
          <span>04 — LEARNING MODEL</span>
          <span>THE VEYORA METHOD</span>
        </div>

        <div className={styles.learningHeader}>
          <h2>
            Learn it.
            <br />
            <em>Then build it.</em>
          </h2>

          <p>
            Every program is designed to move students from understanding to
            practical evidence through structured work and projects.
          </p>
        </div>

        <div className={styles.learningRail}>
          {learningSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className={styles.learningStep}
              initial={reducedMotion ? false : { opacity: 0, y: 25 }}
              whileInView={
                reducedMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
              }}
            >
              <span>{step.number}</span>

              <div className={styles.learningLine}>
                <i />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className={styles.outcomes}>
        <div className={styles.outcomesVisual}>
          <div className={styles.outcomesGrid} />

          <div className={styles.outcomesCore}>
            <span>VEYORA</span>
            <strong>BUILD</strong>
            <small>REAL PROJECTS</small>
          </div>

          <div className={`${styles.outcomeNode} ${styles.nodeOne}`}>
            01
          </div>

          <div className={`${styles.outcomeNode} ${styles.nodeTwo}`}>
            02
          </div>

          <div className={`${styles.outcomeNode} ${styles.nodeThree}`}>
            03
          </div>
        </div>

        <div className={styles.outcomesCopy}>
          <span className={styles.smallLabel}>05 — WHAT YOU BUILD</span>

          <h2>
            Not just
            <br />
            certificates.
            <br />
            <em>Evidence.</em>
          </h2>

          <p>
            Across the Academy programs, students work toward practical
            outputs, projects, portfolio pieces and final capstones.
          </p>

          <div className={styles.outcomeList}>
            <div>
              <span>01</span>
              <strong>PROJECTS</strong>
              <p>Build practical work while learning.</p>
            </div>

            <div>
              <span>02</span>
              <strong>PORTFOLIO</strong>
              <p>Turn selected work into professional evidence.</p>
            </div>

            <div>
              <span>03</span>
              <strong>CAPSTONE</strong>
              <p>Complete a final end-to-end project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WOMEN INITIATIVE */}
      <section className={styles.initiative}>
        <div className={styles.initiativeGrid} />

        <div className={styles.initiativeInner}>
          <div className={styles.initiativeMeta}>
            <span>06 — ACADEMY INITIATIVE</span>
            <span>ACCESS · OPPORTUNITY · SKILLS</span>
          </div>

          <div className={styles.initiativeContent}>
            <span className={styles.initiativeLabel}>
              VEYORA ACADEMY / FOR WOMEN
            </span>

            <h2>
              Technology
              <br />
              should create
              <br />
              <em>opportunity.</em>
            </h2>

            <p>
              Veyora Academy is committed to making technology education more
              accessible through its dedicated free-learning initiative for
              widows and divorced women.
            </p>

            <div className={styles.initiativeBadge}>
              <strong>100%</strong>
              <span>
                FREE
                <br />
                LEARNING INITIATIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className={styles.fees}>
        <div className={styles.sectionMeta}>
          <span>07 — INVEST IN YOUR SKILL</span>
          <span>2026 PROGRAM FEES</span>
        </div>

        <div className={styles.feeHeader}>
          <h2>
            One path.
            <br />
            <em>Six months.</em>
          </h2>

          <p>
            The current Academy structure uses a fixed monthly fee for each
            six-month program.
          </p>
        </div>

        <div className={styles.feeRange}>
          <div>
            <span>MONTHLY PROGRAM RANGE</span>
            <strong>PKR 5K — 10K</strong>
          </div>

          <div>
            <span>PROGRAM LENGTH</span>
            <strong>6 MONTHS</strong>
          </div>

          <div>
            <span>LEARNING MODEL</span>
            <strong>PRACTICAL</strong>
          </div>
        </div>

        <a href="/contact" className={styles.admissionButton}>
          <span>START YOUR LEARNING JOURNEY</span>
          <b>↗</b>
        </a>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalGlow} />

        <div className={styles.finalInner}>
          <span>08 — VEYORA ACADEMY / NEXT</span>

          <h2>
            Your next
            <br />
            skill could
            <br />
            <em>change what&apos;s possible.</em>
          </h2>

          <div className={styles.finalActions}>
            <a href="/contact">APPLY / ASK A QUESTION ↗</a>
            <a href="/">BACK TO VEYORA ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}