import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CertificatesPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // ---------------------------------------------------------
  // GET STUDENT CERTIFICATES
  // ---------------------------------------------------------
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select(
      "id, course_id, certificate_number, issue_date, certificate_url, status, created_at"
    )
    .eq("student_id", userId)
    .order("issue_date", { ascending: false });

  if (error) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId,
    };

    console.error(
      "CERTIFICATES QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vc-error-page">
          <div className="vc-error-box">
            <span className="vc-eyebrow">VEYORA ACADEMY</span>

            <h1>Certificates Error</h1>

            <p>
              Something went wrong while loading your certificates.
            </p>

            <div className="vc-error-details">
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            </div>
          </div>
        </main>

        <style>{`
          .vc-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vc-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vc-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vc-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vc-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vc-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vc-error-details pre {
            margin: 0;
            color: #FFB4B4;
            font-size: 13px;
            line-height: 1.7;
            white-space: pre-wrap;
            word-break: break-word;
          }
        `}</style>
      </>
    );
  }

  const courseIds = (certificates ?? []).map(
    (certificate) => certificate.course_id
  );

  // ---------------------------------------------------------
  // GET COURSE DETAILS
  // ---------------------------------------------------------
  const { data: courses, error: coursesError } =
    courseIds.length > 0
      ? await supabase
          .from("courses")
          .select("id, title, duration_months")
          .in("id", courseIds)
      : { data: [], error: null };

  if (coursesError) {
    const errorDetails = {
      message: coursesError.message,
      details: coursesError.details,
      hint: coursesError.hint,
      code: coursesError.code,
      userId,
    };

    console.error(
      "CERTIFICATE COURSE ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vc-error-page">
          <div className="vc-error-box">
            <span className="vc-eyebrow">VEYORA ACADEMY</span>

            <h1>Course Error</h1>

            <p>
              Certificate records were found, but course details could
              not be loaded.
            </p>

            <div className="vc-error-details">
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            </div>
          </div>
        </main>

        <style>{`
          .vc-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vc-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vc-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vc-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vc-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vc-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vc-error-details pre {
            margin: 0;
            color: #FFB4B4;
            font-size: 13px;
            line-height: 1.7;
            white-space: pre-wrap;
            word-break: break-word;
          }
        `}</style>
      </>
    );
  }

  const courseMap = new Map(
    (courses ?? []).map((course) => [course.id, course])
  );

  const certificateList = certificates ?? [];

  function formatDate(dateString: string | null) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const issuedCount = certificateList.filter(
    (certificate) =>
      String(certificate.status).toLowerCase() === "issued"
  ).length;

  const fileReadyCount = certificateList.filter(
    (certificate) => Boolean(certificate.certificate_url)
  ).length;

  return (
    <>
      <main className="vc-page">
        <div className="vc-grid-bg" />

        <div className="vc-glow vc-glow-orange" />
        <div className="vc-glow vc-glow-blue" />

        <div className="vc-shell">

          {/* HEADER */}
          <header className="vc-header">
            <div>
              <span className="vc-eyebrow">
                VEYORA ACADEMY / ACHIEVEMENTS
              </span>

              <h1>
                My <span>Certificates.</span>
              </h1>

              <p>
                Your issued course certificates and official achievement
                records.
              </p>
            </div>

            <div className="vc-orbit" aria-hidden="true">
              <div className="vc-orbit-ring vc-orbit-one" />
              <div className="vc-orbit-ring vc-orbit-two" />

              <div className="vc-orbit-core">
                V
              </div>
            </div>
          </header>

          {/* STATS */}
          <section className="vc-stats">
            <div className="vc-stat-card">
              <div className="vc-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 3h10v18H7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M10 7h4M10 11h4M10 15h2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>TOTAL CERTIFICATES</span>
                <strong>{certificateList.length}</strong>
                <small>Your achievement records</small>
              </div>
            </div>

            <div className="vc-stat-card">
              <div className="vc-stat-icon vc-blue">
                <svg viewBox="0 0 24 24">
                  <path
                    d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span>ISSUED</span>
                <strong>{issuedCount}</strong>
                <small>Officially issued records</small>
              </div>
            </div>

            <div className="vc-stat-card vc-highlight">
              <div className="vc-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 4h14v16H5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8 8h8M8 12h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="m8 16 2 2 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span>FILES READY</span>
                <strong>{fileReadyCount}</strong>
                <small>Certificates with viewing links</small>
              </div>
            </div>
          </section>

          {/* SECTION HEADING */}
          <div className="vc-section-heading">
            <div>
              <span>YOUR ACHIEVEMENTS</span>

              <h2>
                Earned through <em>learning.</em>
              </h2>
            </div>

            <span className="vc-count">
              {certificateList.length} RECORD
              {certificateList.length === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY STATE */}
          {certificateList.length === 0 ? (
            <section className="vc-empty">
              <div className="vc-empty-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 3h10v18H7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M10 7h4M10 11h4M10 15h2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>YOUR ACHIEVEMENTS</span>

              <h2>No certificates yet.</h2>

              <p>
                Your certificates will appear here after you successfully
                complete a course and a certificate is issued.
              </p>

              <a
                href="/student/progress"
                className="vc-primary-button"
              >
                View Progress
                <span>→</span>
              </a>
            </section>
          ) : (
            <section className="vc-certificate-list">
              {certificateList.map((certificate, index) => {
                const course = courseMap.get(
                  certificate.course_id
                );

                const status =
                  certificate.status || "issued";

                const isIssued =
                  String(status).toLowerCase() === "issued";

                const hasFile =
                  Boolean(certificate.certificate_url);

                return (
                  <article
                    className="vc-certificate-card"
                    key={certificate.id}
                  >
                    <div className="vc-card-glow" />

                    {/* TOP */}
                    <div className="vc-certificate-top">
                      <div className="vc-certificate-number">
                        <span>CERTIFICATE</span>

                        <strong>
                          {String(index + 1).padStart(2, "0")}
                        </strong>
                      </div>

                      <div
                        className={`vc-status ${
                          isIssued
                            ? "vc-status-issued"
                            : ""
                        }`}
                      >
                        <i />
                        {String(status).toUpperCase()}
                      </div>
                    </div>

                    {/* CERTIFICATE VISUAL */}
                    <div className="vc-certificate-body">

                      {/* LEFT DOCUMENT */}
                      <div className="vc-document">
                        <div className="vc-document-border">
                          <div className="vc-document-inner">

                            <div className="vc-document-top">
                              <span>
                                VEYORA
                              </span>

                              <span>
                                ACADEMY
                              </span>
                            </div>

                            <div className="vc-document-seal">
                              <span>V</span>
                            </div>

                            <small>
                              CERTIFICATE
                            </small>

                            <h3>
                              OF COMPLETION
                            </h3>

                            <div className="vc-document-line" />

                            <p>
                              This certificate recognizes
                              successful completion of the
                              following professional program.
                            </p>

                            <strong>
                              {course?.title ||
                                "Veyora Academy Course"}
                            </strong>

                            <div className="vc-document-footer">
                              <span>
                                VEYORA ACADEMY
                              </span>

                              <span>
                                {formatDate(
                                  certificate.issue_date
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT DETAILS */}
                      <div className="vc-certificate-copy">
                        <span className="vc-course-label">
                          VEYORA ACADEMY / OFFICIAL RECORD
                        </span>

                        <h3>
                          {course?.title ||
                            "Veyora Academy Course"}
                        </h3>

                        <p className="vc-program-duration">
                          {course?.duration_months
                            ? `${course.duration_months} Month Program`
                            : "Veyora Academy Program"}
                        </p>

                        <p className="vc-certificate-description">
                          Your achievement has been recorded as
                          part of your Veyora Academy learning journey.
                          This certificate contains your official
                          certificate identification and issue details.
                        </p>

                        <div className="vc-detail-grid">

                          <div>
                            <span>
                              CERTIFICATE NUMBER
                            </span>

                            <strong>
                              {certificate.certificate_number ||
                                "—"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              ISSUE DATE
                            </span>

                            <strong>
                              {formatDate(
                                certificate.issue_date
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              STATUS
                            </span>

                            <strong>
                              {String(status)
                                .charAt(0)
                                .toUpperCase() +
                                String(status).slice(1)}
                            </strong>
                          </div>
                        </div>

                        <div className="vc-certificate-action">
                          {hasFile ? (
                            <a
                              href={
                                certificate.certificate_url as string
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vc-view-button"
                            >
                              View Certificate
                              <span>↗</span>
                            </a>
                          ) : (
                            <div className="vc-file-pending">
                              <span className="vc-pending-dot" />
                              Certificate File Pending
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="vc-certificate-footer">
                      <div>
                        <span className="vc-footer-dot" />

                        <span>
                          {hasFile
                            ? "Certificate file available."
                            : "Certificate record is issued; file will appear when uploaded."}
                        </span>
                      </div>

                      <span className="vc-record-id">
                        VEYORA /{" "}
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          {/* BOTTOM */}
          <section className="vc-bottom-banner">
            <div className="vc-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="vc-banner-content">
              <span>THE VEYORA APPROACH</span>

              <h2>
                Learn it.
                <br />
                <em>Build it. Earn it.</em>
              </h2>

              <p>
                Every certificate represents a completed chapter
                in your learning journey and a foundation for what
                you build next.
              </p>
            </div>

            <a
              href="/student/progress"
              className="vc-progress-button"
            >
              View Progress
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .vc-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          box-sizing: border-box;
          padding: 46px 24px 80px;
          background:
            radial-gradient(
              circle at 8% 6%,
              rgba(110,124,246,.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 18%,
              rgba(255,155,77,.075),
              transparent 28%
            ),
            #0A0C10;
          color: #F3F1EA;
        }

        .vc-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .vc-grid-bg {
          position: absolute;
          inset: 0;
          opacity: .20;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255,255,255,.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.018) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 92%
          );
        }

        .vc-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .vc-glow-orange {
          top: 320px;
          right: -250px;
          background: #FF9B4D;
        }

        .vc-glow-blue {
          bottom: 80px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .vc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .vc-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .vc-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .vc-header h1 span {
          color: #FF9B4D;
        }

        .vc-header p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .vc-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .vc-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .vc-orbit-one {
          inset: 0;
          animation: vc-spin 10s linear infinite;
        }

        .vc-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: vc-spin-reverse 8s linear infinite;
        }

        .vc-orbit-core {
          position: absolute;
          inset: 25px;
          display: grid;
          place-items: center;
          border: 1px solid #353A46;
          border-radius: 50%;
          background: #131720;
          color: #FF9B4D;
          font-family: Georgia, serif;
          font-size: 22px;
          box-shadow: 0 0 25px rgba(255,155,77,.07);
        }

        @keyframes vc-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vc-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* STATS */

        .vc-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .vc-stat-card {
          min-height: 125px;
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 21px;
          box-sizing: border-box;
          border: 1px solid #262B35;
          border-radius: 19px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              rgba(255,255,255,.008)
            );
          transition:
            transform .25s ease,
            border-color .25s ease;
        }

        .vc-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.30);
        }

        .vc-stat-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(255,155,77,.23);
          border-radius: 13px;
          color: #FF9B4D;
          background: rgba(255,155,77,.035);
        }

        .vc-stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .vc-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .vc-stat-card > div:last-child {
          min-width: 0;
        }

        .vc-stat-card span {
          display: block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vc-stat-card strong {
          display: block;
          margin-top: 6px;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -.03em;
        }

        .vc-stat-card small {
          display: block;
          margin-top: 3px;
          color: #717783;
          font-size: 10px;
        }

        .vc-highlight {
          background:
            radial-gradient(
              circle at 92% 5%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        /* SECTION */

        .vc-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .vc-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vc-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vc-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vc-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* CERTIFICATE CARD */

        .vc-certificate-list {
          display: grid;
          gap: 22px;
        }

        .vc-certificate-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 22px;
          border: 1px solid #292E38;
          border-radius: 25px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              transparent 48%
            ),
            #11141B;
          box-shadow:
            0 20px 55px rgba(0,0,0,.20);
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .vc-certificate-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.40);
          box-shadow:
            0 28px 75px rgba(0,0,0,.30),
            0 0 34px rgba(255,155,77,.045);
        }

        .vc-card-glow {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(125px);
          opacity: .10;
          pointer-events: none;
        }

        .vc-certificate-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vc-certificate-number {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vc-certificate-number span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vc-certificate-number strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .vc-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #9297A1;
          font-size: 9px;
          letter-spacing: .12em;
        }

        .vc-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .vc-status-issued {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .vc-status-issued i {
          background: #FF9B4D;
          box-shadow:
            0 0 11px rgba(255,155,77,.60);
        }

        /* BODY */

        .vc-certificate-body {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          gap: 45px;
          align-items: center;
          padding: 32px 0;
        }

        /* DOCUMENT */

        .vc-document {
          width: 100%;
        }

        .vc-document-border {
          position: relative;
          padding: 9px;
          border: 1px solid rgba(255,155,77,.30);
          background:
            linear-gradient(
              135deg,
              rgba(255,155,77,.08),
              rgba(110,124,246,.035)
            );
          box-shadow:
            0 20px 45px rgba(0,0,0,.22);
          transform: rotate(-1.5deg);
        }

        .vc-document-inner {
          min-height: 345px;
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 23px;
          box-sizing: border-box;
          border: 1px solid #383C45;
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(255,155,77,.07),
              transparent 35%
            ),
            #151820;
        }

        .vc-document-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          color: #FF9B4D;
          font-size: 7px;
          letter-spacing: .18em;
        }

        .vc-document-seal {
          width: 57px;
          height: 57px;
          display: grid;
          place-items: center;
          margin-top: 19px;
          border: 1px solid rgba(255,155,77,.42);
          border-radius: 50%;
          color: #FF9B4D;
          box-shadow:
            0 0 25px rgba(255,155,77,.07);
        }

        .vc-document-seal span {
          font-family: Georgia, serif;
          font-size: 21px;
        }

        .vc-document-inner > small {
          margin-top: 16px;
          color: #7A808B;
          font-size: 7px;
          letter-spacing: .20em;
        }

        .vc-document-inner h3 {
          margin: 6px 0 0;
          color: #F0ECE3;
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: .02em;
        }

        .vc-document-line {
          width: 42px;
          height: 1px;
          margin-top: 15px;
          background: #FF9B4D;
        }

        .vc-document-inner p {
          max-width: 245px;
          margin: 13px 0 0;
          color: #777D87;
          text-align: center;
          font-size: 8px;
          line-height: 1.6;
        }

        .vc-document-inner > strong {
          max-width: 250px;
          margin-top: 12px;
          color: #E8E3DA;
          text-align: center;
          font-family: Georgia, serif;
          font-size: 14px;
          line-height: 1.4;
          font-weight: 400;
        }

        .vc-document-footer {
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: auto;
          padding-top: 17px;
          border-top: 1px solid #30343D;
          color: #626975;
          font-size: 7px;
          letter-spacing: .12em;
        }

        /* COPY */

        .vc-course-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vc-certificate-copy h3 {
          max-width: 700px;
          margin: 12px 0 0;
          font-size: clamp(28px, 4vw, 43px);
          line-height: 1.10;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vc-program-duration {
          margin: 11px 0 0;
          color: #FF9B4D;
          font-size: 11px;
        }

        .vc-certificate-description {
          max-width: 650px;
          margin: 15px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vc-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
          padding: 18px;
          border: 1px solid #292E38;
          border-radius: 16px;
          background: #0D1016;
        }

        .vc-detail-grid div {
          min-width: 0;
        }

        .vc-detail-grid span {
          display: block;
          color: #6F7580;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vc-detail-grid strong {
          display: block;
          margin-top: 7px;
          color: #E2DED5;
          font-size: 11px;
          line-height: 1.5;
          font-weight: 500;
          word-break: break-word;
        }

        .vc-certificate-action {
          margin-top: 23px;
        }

        .vc-view-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 13px 20px;
          border: 1px solid #FF9B4D;
          border-radius: 999px;
          background: #FF9B4D;
          color: #0A0C10;
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .vc-view-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 30px rgba(255,155,77,.20);
        }

        .vc-view-button span {
          font-size: 15px;
        }

        .vc-file-pending {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #8B909A;
          font-size: 10px;
        }

        .vc-pending-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6A707B;
        }

        /* FOOTER */

        .vc-certificate-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid #292E38;
        }

        .vc-certificate-footer > div {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #737984;
          font-size: 9px;
        }

        .vc-footer-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow:
            0 0 9px rgba(255,155,77,.5);
        }

        .vc-record-id {
          color: #484E59;
          font-size: 8px;
          letter-spacing: .13em;
        }

        /* EMPTY */

        .vc-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .vc-empty-icon {
          width: 63px;
          height: 63px;
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
          border: 1px solid rgba(255,155,77,.35);
          border-radius: 50%;
          color: #FF9B4D;
          background: rgba(255,155,77,.025);
        }

        .vc-empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .vc-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vc-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vc-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        .vc-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 25px;
          padding: 13px 20px;
          border: 1px solid #FF9B4D;
          border-radius: 999px;
          background: #FF9B4D;
          color: #0A0C10;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
        }

        /* BOTTOM */

        .vc-bottom-banner {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          margin-top: 24px;
          padding: 32px;
          overflow: hidden;
          border: 1px solid #292E38;
          border-radius: 23px;
          background:
            radial-gradient(
              circle at 12% 50%,
              rgba(110,124,246,.10),
              transparent 35%
            ),
            #11141B;
        }

        .vc-banner-content {
          position: relative;
          z-index: 2;
        }

        .vc-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .vc-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vc-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vc-banner-content p {
          max-width: 630px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vc-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.20);
          border-radius: 50%;
        }

        .vc-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .vc-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .vc-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .vc-progress-button {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex: 0 0 auto;
          padding: 12px 18px;
          border: 1px solid #353B47;
          border-radius: 999px;
          color: #E5E2D9;
          font-size: 11px;
          text-decoration: none;
          transition: border-color .2s ease;
        }

        .vc-progress-button:hover {
          border-color: #FF9B4D;
        }

        .vc-progress-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {
          .vc-certificate-body {
            grid-template-columns: 280px minmax(0, 1fr);
            gap: 32px;
          }
        }

        @media (max-width: 850px) {
          .vc-certificate-body {
            grid-template-columns: 1fr;
          }

          .vc-document {
            max-width: 360px;
          }

          .vc-document-border {
            transform: rotate(0);
          }

          .vc-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .vc-page {
            padding: 30px 15px 55px;
          }

          .vc-header {
            align-items: flex-start;
          }

          .vc-orbit {
            width: 64px;
            height: 64px;
          }

          .vc-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .vc-stats {
            grid-template-columns: 1fr;
          }

          .vc-stat-card {
            min-height: 105px;
          }

          .vc-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vc-certificate-card {
            padding: 22px 20px 20px;
          }

          .vc-certificate-top {
            align-items: flex-start;
          }

          .vc-certificate-body {
            padding: 25px 0;
          }

          .vc-document {
            max-width: 100%;
          }

          .vc-document-inner {
            min-height: 320px;
          }

          .vc-certificate-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .vc-record-id {
            display: none;
          }

          .vc-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vc-progress-button {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vc-orbit-one,
          .vc-orbit-two {
            animation: none;
          }

          .vc-stat-card,
          .vc-certificate-card,
          .vc-view-button,
          .vc-progress-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}