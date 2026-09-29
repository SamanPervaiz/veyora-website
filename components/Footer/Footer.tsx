import Link from "next/link";
import styles from "./Footer.module.css";

const navigation = [
  {
    label: "HOME",
    href: "#top",
  },
  {
    label: "ECOSYSTEM",
    href: "#ecosystem",
  },
  {
    label: "ACADEMY",
    href: "#academy-preview",
  },
  {
    label: "PEOPLE",
    href: "#team",
  },
  {
    label: "CONTACT",
    href: "#contact",
  },
];

const disciplines = [
  "AI & AUTOMATION",
  "DIGITAL PRODUCTS",
  "DATA & SYSTEMS",
  "CYBER SECURITY",
  "AI CREATIVE & GROWTH",
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.background} />
      <div className={styles.grid} />
      <div className={styles.glow} />

      <div className={styles.inner}>
        {/* =====================================================
            TOP BRAND AREA
        ===================================================== */}

        <div className={styles.brandArea}>
          <div className={styles.brandCopy}>
            <div className={styles.kicker}>
              <span />
              <p>10 — VEYORA</p>
            </div>

            <h2>
              Technology <span>×</span>{" "}
              Education <span>×</span>{" "}
              Possibility
            </h2>

            <p className={styles.intro}>
              A technology and education company building
              practical systems, digital products and modern
              learning opportunities.
            </p>
          </div>

          <div className={styles.mark}>
            <div className={styles.markOuter} />
            <div className={styles.markMiddle} />

            <div className={styles.markCore}>
              V
            </div>

            <small>VEYORA</small>
          </div>
        </div>

        {/* =====================================================
            MAIN FOOTER CONTENT
        ===================================================== */}

        <div className={styles.content}>
          {/* DISCIPLINES */}

          <div className={styles.disciplines}>
            <div className={styles.label}>
              WHAT WE BUILD
            </div>

            <div className={styles.disciplineList}>
              {disciplines.map((item, index) => (
                <div
                  key={item}
                  className={styles.discipline}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className={styles.navigation}>
            <div className={styles.label}>
              NAVIGATION
            </div>

            <div className={styles.navList}>
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.navLink}
                >
                  <span>{item.label}</span>
                  <b>↗</b>
                </Link>
              ))}
            </div>
          </nav>

          {/* FINAL STATEMENT */}

          <div className={styles.statement}>
            <div className={styles.label}>
              THE VEYORA PRINCIPLE
            </div>

            <p>
              Ideas are only the beginning.
            </p>

            <strong>
              Build what&apos;s next.
            </strong>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span>
              © 2026 VEYORA
            </span>

            <i>·</i>

            <span>
              ALL RIGHTS RESERVED
            </span>
          </div>

          <div className={styles.bottomCenter}>
            <span className={styles.statusDot} />
            <span>
              SYSTEM ONLINE
            </span>
          </div>

          <div className={styles.bottomRight}>
            <span>
              BUILD / LEARN / CREATE
            </span>

            <span className={styles.arrow}>
              ↑
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}