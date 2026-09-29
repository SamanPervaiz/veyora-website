"use client";

import { motion } from "motion/react";
import Image from "next/image";
import styles from "./Team.module.css";

export default function Team() {
  return (
    <section className={styles.team} id="team">
      <div className={styles.background} />
      <div className={styles.grid} />
      <div className={styles.glow} />

      <div className={styles.inner}>

        <div className={styles.header}>
          <div className={styles.kicker}>
            <span />
            <p>08 — PEOPLE BEHIND VEYORA</p>
          </div>

          <div className={styles.headingWrap}>
            <h2>
              The people
              <br />
              behind <em>what&apos;s next.</em>
            </h2>

            <p>
              Veyora is built by people who believe technology
              should move ideas forward and create meaningful
              possibilities.
            </p>
          </div>
        </div>

        <div className={styles.founder}>

          <motion.div
            className={styles.imageFrame}
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.imageMeta}>
              <span>FOUNDER / 01</span>
              <span>VEYORA</span>
            </div>

            <div className={styles.imageWrap}>
              <Image
                src="/noor-ul-ain-founder.png"
                alt="Noor ul Ain — Founder & CEO of Veyora"
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                className={styles.image}
                priority={false}
              />
            </div>

            <div className={styles.cornerTopLeft} />
            <div className={styles.cornerTopRight} />
            <div className={styles.cornerBottomLeft} />
            <div className={styles.cornerBottomRight} />
          </motion.div>

          <motion.div
            className={styles.founderInfo}
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.role}>
              <span>01</span>
              <p>FOUNDER &amp; CEO</p>
            </div>

            <h3>Noor ul Ain</h3>

            <div className={styles.rule} />

            <p className={styles.bio}>
              Noor ul Ain is the Founder &amp; CEO of Veyora,
              a technology and education company focused on
              turning ideas into practical digital solutions
              and modern learning opportunities.
            </p>

            <p className={styles.bio}>
              Through Veyora, she brings together AI &
              automation, software and digital products, data
              and business intelligence, cyber security, and
              AI-powered creative solutions.
            </p>

            <p className={styles.bio}>
              Alongside Veyora&apos;s technology work, she is
              building Veyora Academy to help people develop
              practical digital skills, work on real projects,
              and create new opportunities through modern
              technology education.
            </p>

            <div className={styles.expertise}>
              <span>AI &amp; AUTOMATION</span>
              <span>DIGITAL PRODUCTS</span>
              <span>TECHNOLOGY + EDUCATION</span>
            </div>

            <div className={styles.signature}>
              <span>VISION</span>
              <strong>
                Build what&apos;s next.
              </strong>
            </div>
          </motion.div>

        </div>

        <div className={styles.futureTeam}>
          <span>THE TEAM CONTINUES</span>
          <p>
            More of the people building Veyora will be introduced here.
          </p>

          <div className={styles.futureLine}>
            <span>02</span>
            <span>03</span>
            <span>04</span>
            <span>05</span>
            <span>06</span>
            <span>07</span>
            <span>08</span>
            <span>09</span>
          </div>
        </div>

        <div className={styles.footer}>
          <span>PEOPLE · EXPERTISE · PURPOSE</span>

          <span>
            VEYORA / 2026
          </span>
        </div>

      </div>
    </section>
  );
}