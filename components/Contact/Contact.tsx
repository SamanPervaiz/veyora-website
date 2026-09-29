"use client";

import { FormEvent, useState } from "react";

import styles from "./Contact.module.css";

const services = [
  "AI & Automation",
  "Software & Digital Products",
  "Data & Business Intelligence",
  "Cyber Security",
  "AI Creative & Growth",
  "Not sure yet",
];

const budgets = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Let's discuss",
];

const socialLinks = [
  {
    name: "Instagram",
    handle: "@veyoraacademy",
    href: "https://www.instagram.com/veyoraacademy/",
  },
  {
    name: "Facebook",
    handle: "Veyora Academy",
    href: "https://www.facebook.com/veyoraacademy",
  },
  {
    name: "TikTok",
    handle: "@veyora.academy",
    href: "https://www.tiktok.com/@veyora.academy",
  },
];

const paymentMethods = [
  {
    number: "01",
    name: "JazzCash",
    detail: "03206938290",
    note: "Academy payments",
  },
  {
    number: "02",
    name: "EasyPaisa",
    detail: "03206938290",
    note: "Academy payments",
  },
  {
    number: "03",
    name: "Meezan Bank",
    detail: "00300115054518",
    note: "Account title: Saman Pervez",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);

      window.setTimeout(() => {
        setCopied(null);
      }, 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <main className={styles.page}>
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className={styles.hero}>
        <div className={styles.grid} />

        <div className={styles.heroInner}>
          <div className={styles.topBar}>
            <a href="/" className={styles.brand}>
              <span>VEYORA</span>
              <small>TECHNOLOGY FOR A BRIGHTER TOMORROW</small>
            </a>

            <a href="/" className={styles.backLink}>
              BACK TO VEYORA <span>↗</span>
            </a>
          </div>

          <div className={styles.heroMeta}>
            <span>01 — CONTACT VEYORA</span>
            <span>START WITH THE RIGHT PATH</span>
          </div>

          <div className={styles.heroContent}>
            <div>
              <span className={styles.eyebrow}>
                TECHNOLOGY · SYSTEMS · POSSIBILITY
              </span>

              <h1>
                Let&apos;s build
                <br />
                <em>what&apos;s next.</em>
              </h1>
            </div>

            <div className={styles.heroIntro}>
              <p>
                One place to start a project, join Veyora Academy, reach us
                directly, or find the right channel for your next conversation.
              </p>

              <div className={styles.heroActions}>
                <a href="#project" className={styles.primaryButton}>
                  <span>START A PROJECT</span>
                  <b>↓</b>
                </a>

                <a href="#academy" className={styles.secondaryButton}>
                  <span>ACADEMY ADMISSIONS</span>
                  <b>↓</b>
                </a>
              </div>
            </div>
          </div>

          <div className={styles.contactRail}>
            <a
              href="https://wa.me/923206938290"
              target="_blank"
              rel="noreferrer"
              className={styles.contactCard}
            >
              <span>WHATSAPP</span>
              <strong>0320 6938290</strong>
              <small>DIRECT CHAT ↗</small>
            </a>

            <a
              href="mailto:veyoraacademy@gmail.com"
              className={styles.contactCard}
            >
              <span>EMAIL</span>
              <strong>veyoraacademy@gmail.com</strong>
              <small>SEND AN EMAIL ↗</small>
            </a>

            <div className={styles.contactCard}>
              <span>BASED IN</span>
              <strong>Pakistan</strong>
              <small>WORKING GLOBALLY</small>
            </div>

            <div className={styles.contactCard}>
              <span>ACADEMY</span>
              <strong>11 PROGRAMS</strong>
              <small>6-MONTH PATHWAYS</small>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DIRECT CONTACT / SOCIALS
      ===================================================== */}
      <section className={styles.channels}>
        <div className={styles.sectionHead}>
          <span>02 — DIRECT CONTACT</span>
          <p>No form required. Use whichever channel feels easiest.</p>
        </div>

        <div className={styles.channelsGrid}>
          <div className={styles.channelsCopy}>
            <span className={styles.smallLabel}>TALK TO VEYORA</span>

            <h2>
              Start with a
              <br />
              <em>conversation.</em>
            </h2>

            <p>
              For a quick question, project discussion, collaboration or
              Academy enquiry, you can reach Veyora directly.
            </p>

            <div className={styles.directLinks}>
              <a
                href="https://wa.me/923206938290"
                target="_blank"
                rel="noreferrer"
              >
                <span>WHATSAPP</span>
                <strong>0320 6938290</strong>
                <b>↗</b>
              </a>

              <a href="mailto:veyoraacademy@gmail.com">
                <span>EMAIL</span>
                <strong>veyoraacademy@gmail.com</strong>
                <b>↗</b>
              </a>
            </div>
          </div>

          <div className={styles.socialPanel}>
            <div className={styles.socialPanelTop}>
              <span>VEYORA ACADEMY / SOCIAL</span>
              <span>FOLLOW / EXPLORE</span>
            </div>

            <div className={styles.socialList}>
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialItem}
                >
                  <span>0{index + 1}</span>

                  <div>
                    <strong>{social.name}</strong>
                    <small>{social.handle}</small>
                  </div>

                  <b>↗</b>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT INQUIRY
      ===================================================== */}
      <section className={styles.project} id="project">
        <div className={styles.sectionHead}>
          <span>03 — START A PROJECT</span>
          <p>For businesses, brands, teams and people building something.</p>
        </div>

        <div className={styles.projectGrid}>
          <div className={styles.projectCopy}>
            <span className={styles.smallLabel}>BUSINESS INQUIRY</span>

            <h2>
              Tell us what
              <br />
              you&apos;re <em>building.</em>
            </h2>

            <p>
              Share the problem, idea or system you want to create. The form
              below is specifically for Veyora services and project enquiries.
            </p>

            <div className={styles.projectNotes}>
              <div>
                <span>SERVICES</span>
                <strong>AI · SOFTWARE · DATA · SECURITY · GROWTH</strong>
              </div>

              <div>
                <span>DIRECT OPTION</span>
                <strong>WHATSAPP / EMAIL</strong>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.success}>
                <span>MESSAGE RECEIVED</span>
                <h3>
                  Thank you.
                  <br />
                  <em>We&apos;ll be in touch.</em>
                </h3>

                <p>
                  Your project enquiry has been recorded on this page. You
                  can also reach Veyora directly through WhatsApp or email.
                </p>

                <div className={styles.successActions}>
                  <a
                    href="https://wa.me/923206938290"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WHATSAPP ↗
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                  >
                    SEND ANOTHER
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formTitle}>
                  <span>PROJECT BRIEF</span>
                  <small>01 — 06</small>
                </div>

                <div className={styles.formRow}>
                  <label>
                    <span>01 — NAME</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label>
                    <span>02 — EMAIL</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label>
                    <span>03 — COMPANY / BUSINESS</span>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company or business name"
                    />
                  </label>

                  <label>
                    <span>04 — SERVICE</span>
                    <select name="service" defaultValue="" required>
                      <option value="" disabled>
                        Select a service
                      </option>

                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  <span>05 — PROJECT DETAILS</span>
                  <textarea
                    name="message"
                    placeholder="What are you trying to build, improve or automate?"
                    rows={6}
                    required
                  />
                </label>

                <label>
                  <span>06 — PROJECT RANGE</span>
                  <select name="budget" defaultValue="">
                    <option value="" disabled>
                      Select a range
                    </option>

                    {budgets.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </label>

                <div className={styles.formBottom}>
                  <p>
                    Prefer a direct conversation? Use WhatsApp instead.
                  </p>

                  <button type="submit" className={styles.submitButton}>
                    <span>SEND INQUIRY</span>
                    <b>↗</b>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ACADEMY
      ===================================================== */}
      <section className={styles.academy} id="academy">
        <div className={styles.academyGlow} />

        <div className={styles.sectionHead}>
          <span>04 — VEYORA ACADEMY</span>
          <p>Learning, admissions and payment information.</p>
        </div>

        <div className={styles.academyGrid}>
          <div className={styles.academyCopy}>
            <span className={styles.smallLabel}>LEARN · BUILD · GROW</span>

            <h2>
              Choose your
              <br />
              <em>next skill.</em>
            </h2>

            <p>
              Veyora Academy offers practical technology programs designed
              around modern skills, projects and portfolio evidence.
            </p>

            <div className={styles.academyStats}>
              <div>
                <strong>11</strong>
                <span>PROGRAMS</span>
              </div>

              <div>
                <strong>6</strong>
                <span>MONTHS</span>
              </div>

              <div>
                <strong>5K–10K</strong>
                <span>PKR / MONTH</span>
              </div>
            </div>

            <a href="/academy" className={styles.academyButton}>
              <span>VIEW ALL PROGRAMS</span>
              <b>↗</b>
            </a>
          </div>

          <div className={styles.paymentWrap}>
            <div className={styles.paymentHeader}>
              <div>
                <span>ACADEMY PAYMENT</span>
                <strong>Choose your method.</strong>
              </div>

              <small>FOR ACADEMY ADMISSIONS</small>
            </div>

            <div className={styles.paymentList}>
              {paymentMethods.map((method) => (
                <div key={method.number} className={styles.paymentItem}>
                  <span className={styles.paymentNumber}>
                    {method.number}
                  </span>

                  <div className={styles.paymentInfo}>
                    <span>{method.name}</span>
                    <strong>{method.detail}</strong>
                    <small>{method.note}</small>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyValue(method.detail, method.number)
                    }
                    className={styles.copyButton}
                  >
                    {copied === method.number ? "COPIED" : "COPY"}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.accountTitle}>
              <span>MEEZAN BANK ACCOUNT TITLE</span>
              <strong>Saman Pervez</strong>
            </div>

            <div className={styles.paymentFooter}>
              <p>
                For Academy program details, visit the Academy page before
                choosing a course.
              </p>

              <a href="/academy">
                SEE PROGRAMS <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SOCIAL / CONNECT
      ===================================================== */}
      <section className={styles.connect}>
        <div className={styles.connectTop}>
          <span>05 — STAY CONNECTED</span>
          <span>VEYORA ACADEMY / SOCIAL</span>
        </div>

        <div className={styles.connectGrid}>
          <div>
            <span className={styles.smallLabel}>FOLLOW VEYORA ACADEMY</span>

            <h2>
              Keep the
              <br />
              <em>conversation going.</em>
            </h2>
          </div>

          <div className={styles.connectSocials}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{social.name}</span>
                <strong>{social.handle}</strong>
                <b>↗</b>
              </a>
            ))}

            <a
              href="https://wa.me/923206938290"
              target="_blank"
              rel="noreferrer"
            >
              <span>WHATSAPP</span>
              <strong>0320 6938290</strong>
              <b>↗</b>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className={styles.finalCta}>
        <div className={styles.finalGrid} />

        <div className={styles.finalInner}>
          <span>06 — VEYORA / NEXT</span>

          <h2>
            Have something
            <br />
            <em>worth building?</em>
          </h2>

          <p>
            Start with a project, a question, or your next learning path.
          </p>

          <div className={styles.finalActions}>
            <a href="#project" className={styles.finalPrimary}>
              START A PROJECT <span>↗</span>
            </a>

            <a href="#academy" className={styles.finalSecondary}>
              ACADEMY <span>↗</span>
            </a>

            <a href="/" className={styles.finalSecondary}>
              BACK TO VEYORA <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
