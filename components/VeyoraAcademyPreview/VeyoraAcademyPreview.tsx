"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useMemo, useState } from "react";
import styles from "./VeyoraAcademyPreview.module.css";

type CourseCategory =
  | "ALL"
  | "AI & TECH"
  | "BUSINESS"
  | "CAREER";

type Course = {
  number: string;
  title: string;
  category: Exclude<CourseCategory, "ALL">;
  short: string;
  skills: string[];
  accent: "orange" | "blue" | "paper";
};

const courses: Course[] = [
  {
    number: "01",
    title: "ADVANCED AI AUTOMATION",
    category: "AI & TECH",
    short:
      "Build intelligent workflows, agents and connected business systems.",
    skills: ["AI AGENTS", "N8N", "APIs"],
    accent: "orange",
  },
  {
    number: "02",
    title: "AI ENGINEERING",
    category: "AI & TECH",
    short:
      "Learn how AI systems are designed, connected and turned into useful products.",
    skills: ["PYTHON", "LLMs", "SYSTEMS"],
    accent: "blue",
  },
  {
    number: "03",
    title: "CYBER SECURITY",
    category: "AI & TECH",
    short:
      "Understand digital security, networks, threats and practical protection.",
    skills: ["NETWORKING", "SECURITY", "DEFENSE"],
    accent: "paper",
  },
  {
    number: "04",
    title: "DATA ANALYTICS & BI",
    category: "AI & TECH",
    short:
      "Turn business data into dashboards, insights and better decisions.",
    skills: ["POWER BI", "SQL", "PYTHON"],
    accent: "blue",
  },
  {
    number: "05",
    title: "FULL-STACK DEVELOPMENT",
    category: "AI & TECH",
    short:
      "Design and build modern websites, applications and digital products.",
    skills: ["REACT", "NODE.JS", "GIT"],
    accent: "orange",
  },
  {
    number: "06",
    title: "E-COMMERCE",
    category: "BUSINESS",
    short:
      "Build, manage and grow practical online commerce systems.",
    skills: ["SHOPIFY", "STORES", "GROWTH"],
    accent: "paper",
  },
  {
    number: "07",
    title: "AI-POWERED VIRTUAL ASSISTANT",
    category: "BUSINESS",
    short:
      "Use modern AI and digital tools to build efficient remote support services.",
    skills: ["AI TOOLS", "PRODUCTIVITY", "REMOTE"],
    accent: "orange",
  },
  {
    number: "08",
    title: "AI LEAD GENERATION",
    category: "BUSINESS",
    short:
      "Create practical systems for finding, organizing and nurturing leads.",
    skills: ["LEADS", "AUTOMATION", "CRM"],
    accent: "blue",
  },
  {
    number: "09",
    title: "FREELANCING",
    category: "CAREER",
    short:
      "Learn how to turn digital skills into services, proposals and client work.",
    skills: ["UPWORK", "FIVERR", "CLIENTS"],
    accent: "orange",
  },
  {
    number: "10",
    title: "PROJECT MANAGEMENT",
    category: "CAREER",
    short:
      "Plan, organize and deliver digital projects with clarity and structure.",
    skills: ["PLANNING", "AGILE", "DELIVERY"],
    accent: "paper",
  },
  {
    number: "11",
    title: "GRAPHIC DESIGN & AI CREATIVE DESIGN",
    category: "CAREER",
    short:
      "Combine visual design with modern AI tools to create digital creative work.",
    skills: ["DESIGN", "AI CREATIVE", "CONTENT"],
    accent: "blue",
  },
];

const categories: CourseCategory[] = [
  "ALL",
  "AI & TECH",
  "BUSINESS",
  "CAREER",
];

export default function VeyoraAcademyPreview() {
  const [activeCategory, setActiveCategory] =
    useState<CourseCategory>("ALL");

  const [activeCourse, setActiveCourse] = useState(0);

  const reduceMotion = useReducedMotion();

  const filteredCourses = useMemo(() => {
    if (activeCategory === "ALL") {
      return courses;
    }

    return courses.filter(
      (course) => course.category === activeCategory
    );
  }, [activeCategory]);

  const selectedCourse = courses[activeCourse];

  const handleCategoryChange = (category: CourseCategory) => {
    setActiveCategory(category);

    const firstMatch =
      category === "ALL"
        ? 0
        : courses.findIndex(
            (course) => course.category === category
          );

    setActiveCourse(firstMatch >= 0 ? firstMatch : 0);
  };

  return (
    <section
      className={styles.academy}
      id="academy-preview"
    >
      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div className={styles.paperField} />
      <div className={styles.gridField} />
      <div className={styles.softGlow} />
      <div className={styles.grain} />

      <div className={styles.inner}>
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className={styles.header}>
          <div className={styles.kicker}>
            <span className={styles.kickerLine} />
            <span>07 — VEYORA ACADEMY</span>
          </div>

          <div className={styles.headerMain}>
            <div>
              <h2>
                Technology should
                <br />
                create <em>capability.</em>
              </h2>

              <p>
                Practical technology education designed to help
                people learn modern skills, build real projects
                and create new opportunities.
              </p>
            </div>

            <div className={styles.headerMark}>
              <span>V</span>
              <small>ACADEMY</small>
            </div>
          </div>
        </header>

        {/* ===================================================
            MAIN ACADEMY EXPERIENCE
        =================================================== */}

        <div className={styles.experience}>
          {/* ================================================
              LEFT — COURSE INDEX
          ================================================ */}

          <div className={styles.coursePanel}>
            <div className={styles.coursePanelTop}>
              <span>PROGRAM INDEX</span>

              <span>11 COURSES</span>
            </div>

            {/* Category filters */}

            <div className={styles.filters}>
              {categories.map((category) => {
                const isActive =
                  activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    className={`${styles.filter} ${
                      isActive ? styles.filterActive : ""
                    }`}
                    onClick={() =>
                      handleCategoryChange(category)
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Course list */}

            <div className={styles.courseList}>
              {filteredCourses.map((course) => {
                const globalIndex = courses.findIndex(
                  (item) => item.number === course.number
                );

                const isActive =
                  globalIndex === activeCourse;

                return (
                  <motion.button
                    key={course.number}
                    type="button"
                    className={`${styles.courseRow} ${
                      isActive
                        ? styles.courseRowActive
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveCourse(globalIndex)
                    }
                    onFocus={() =>
                      setActiveCourse(globalIndex)
                    }
                    onClick={() =>
                      setActiveCourse(globalIndex)
                    }
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            x: 4,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                    }}
                  >
                    <span className={styles.courseNumber}>
                      {course.number}
                    </span>

                    <span className={styles.courseName}>
                      {course.title}
                    </span>

                    <span className={styles.courseCategory}>
                      {course.category}
                    </span>

                    <span className={styles.courseArrow}>
                      ↗
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="academyActiveLine"
                        className={styles.activeLine}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ================================================
              RIGHT — LEARNING STUDIO
          ================================================ */}

          <div className={styles.studio}>
            <div className={styles.studioTop}>
              <span>VEYORA / LEARNING STUDIO</span>

              <span>
                0{activeCourse + 1} / 11
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCourse.number}
                className={styles.studioContent}
                initial={
                  reduceMotion
                    ? {
                        opacity: 0,
                      }
                    : {
                        opacity: 0,
                        y: 14,
                        scale: 0.985,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={
                  reduceMotion
                    ? {
                        opacity: 0,
                      }
                    : {
                        opacity: 0,
                        y: -10,
                        scale: 0.985,
                      }
                }
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Floating learning cards */}

                <div
                  className={`${styles.floatCard} ${styles.floatOne}`}
                >
                  <small>LEARN</small>
                  <strong>01</strong>
                  <span>FOUNDATION</span>
                </div>

                <div
                  className={`${styles.floatCard} ${styles.floatTwo}`}
                >
                  <small>BUILD</small>
                  <strong>02</strong>
                  <span>PROJECT</span>
                </div>

                <div
                  className={`${styles.floatCard} ${styles.floatThree}`}
                >
                  <small>APPLY</small>
                  <strong>03</strong>
                  <span>SKILL</span>
                </div>

                {/* Central studio */}

                <div className={styles.learningCore}>
                  <div className={styles.coreHalo} />

                  <div className={styles.corePaper}>
                    <div className={styles.coreTop}>
                      <span>
                        COURSE {selectedCourse.number}
                      </span>

                      <span>
                        {selectedCourse.category}
                      </span>
                    </div>

                    <div className={styles.coreV}>
                      V
                    </div>

                    <div className={styles.coreTitle}>
                      <span>VEYORA</span>

                      <strong>
                        {selectedCourse.title}
                      </strong>
                    </div>

                    <div className={styles.coreRule} />

                    <p>
                      {selectedCourse.short}
                    </p>

                    <div className={styles.skillTags}>
                      {selectedCourse.skills.map(
                        (skill) => (
                          <span key={skill}>
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress rail */}

                <div className={styles.learningRail}>
                  <div className={styles.railLabel}>
                    <span>
                      PRACTICAL LEARNING PATH
                    </span>

                    <span>01 → 04</span>
                  </div>

                  <div className={styles.rail}>
                    <span className={styles.railActive} />
                  </div>

                  <div className={styles.railSteps}>
                    <span>LEARN</span>
                    <span>BUILD</span>
                    <span>PRACTICE</span>
                    <span>CREATE</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Visual corners */}

            <div className={styles.cornerTopLeft} />
            <div className={styles.cornerTopRight} />
            <div className={styles.cornerBottomLeft} />
            <div className={styles.cornerBottomRight} />
          </div>
        </div>

        {/* ===================================================
            ACADEMY HIGHLIGHT
        =================================================== */}

        <div className={styles.academyStrip}>
          <div className={styles.initiative}>
            <div className={styles.initiativeBadge}>
              100%
            </div>

            <div className={styles.initiativeCopy}>
              <span>VEYORA INITIATIVE</span>

              <strong>
                Education that creates opportunity.
              </strong>

              <p>
                A free education initiative supporting
                widows and divorced women.
              </p>
            </div>
          </div>

          <a
            href="/academy"
            className={styles.academyAction}
          >
            <span>
              EXPLORE THE ACADEMY
            </span>

            <b>↗</b>
          </a>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span>11 PRACTICAL COURSES</span>
            <i>·</i>
            <span>REAL PROJECTS</span>
            <i>·</i>
            <span>MODERN SKILLS</span>
          </div>

          <div className={styles.footerRight}>
            <span className={styles.statusDot} />
            LEARN / BUILD / GROW
          </div>
        </div>
      </div>
    </section>
  );
}