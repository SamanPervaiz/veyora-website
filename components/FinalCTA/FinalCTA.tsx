import Link from "next/link";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.cta} id="contact">
      <div className={styles.field} />
      <div className={styles.grid} />
      <div className={styles.glow} />

      <div className={styles.inner}>

        <div className={styles.kicker}>
          <span />
          <p>09 — LET&apos;S BUILD</p>
        </div>

        <div className={styles.main}>
          <div className={styles.copy}>
            <span className={styles.overline}>
              FOR THE NEXT IDEA
            </span>

            <h2>
              Have something
              <br />
              worth <em>building?</em>
            </h2>

            <p>
              Whether it&apos;s a business system, digital product,
              AI solution, or a new idea — Veyora brings the
              technology, systems and people to move it forward.
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                <span>START A CONVERSATION</span>
                <b>↗</b>
              </Link>

              <Link
                href="#ecosystem"
                className={styles.secondary}
              >
                <span>EXPLORE VEYORA</span>
                <b>↗</b>
              </Link>
            </div>
          </div>

          <div className={styles.signal}>
            <div className={styles.signalOuter} />
            <div className={styles.signalMiddle} />
            <div className={styles.signalCore}>
              <span>V</span>
            </div>

            <div className={styles.signalLabel}>
              <span>VEYORA</span>
              <small>IDEA → SYSTEM → IMPACT</small>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            AI · SOFTWARE · DATA · SECURITY · CREATIVE
          </span>

          <span>
            ONE CONNECTED SYSTEM
          </span>
        </div>

      </div>
    </section>
  );
}