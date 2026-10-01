import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // ---------------------------------------------------------
  // GET STUDENT ENROLLMENTS
  // ---------------------------------------------------------
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", userId);

  if (enrollmentError) {
    const errorDetails = {
      message: enrollmentError.message,
      details: enrollmentError.details,
      hint: enrollmentError.hint,
      code: enrollmentError.code,
      userId,
    };

    console.error(
      "ANNOUNCEMENT ENROLLMENT ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="van-error-page">
          <div className="van-error-box">
            <span className="van-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Announcements Error</h1>

            <p>
              Something went wrong while loading your announcements.
            </p>

            <div className="van-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .van-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .van-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .van-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .van-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .van-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .van-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .van-error-details pre {
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

  const courseIds = (enrollments ?? []).map(
    (enrollment) => enrollment.course_id
  );

  // ---------------------------------------------------------
  // GET PUBLISHED ANNOUNCEMENTS
  // ---------------------------------------------------------
  const {
    data: announcements,
    error: announcementsError,
  } = await supabase
    .from("announcements")
    .select(
      "id, course_id, title, message, announcement_type, published, created_at"
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (announcementsError) {
    const errorDetails = {
      message: announcementsError.message,
      details: announcementsError.details,
      hint: announcementsError.hint,
      code: announcementsError.code,
      userId,
    };

    console.error(
      "ANNOUNCEMENTS QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="van-error-page">
          <div className="van-error-box">
            <span className="van-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Announcements Error</h1>

            <p>
              The Academy announcements could not be loaded.
            </p>

            <div className="van-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .van-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .van-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .van-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .van-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .van-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .van-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .van-error-details pre {
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

  // ---------------------------------------------------------
  // ONLY SHOW:
  // 1. Academy-wide announcements
  // 2. Announcements for student's enrolled courses
  // ---------------------------------------------------------
  const visibleAnnouncements = (announcements ?? []).filter(
    (announcement) =>
      announcement.course_id === null ||
      courseIds.includes(announcement.course_id)
  );

  // ---------------------------------------------------------
  // GET COURSE NAMES
  // ---------------------------------------------------------
  const courseIdsForNames = visibleAnnouncements
    .map((announcement) => announcement.course_id)
    .filter((id): id is number => id !== null);

  const uniqueCourseIds = [
    ...new Set(courseIdsForNames),
  ];

  const { data: courses } =
    uniqueCourseIds.length > 0
      ? await supabase
          .from("courses")
          .select("id, title")
          .in("id", uniqueCourseIds)
      : { data: [] };

  const courseMap = new Map(
    (courses ?? []).map((course) => [
      course.id,
      course.title,
    ])
  );

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------
  function formatDate(dateString: string | null) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const totalAnnouncements =
    visibleAnnouncements.length;

  const generalAnnouncements =
    visibleAnnouncements.filter(
      (announcement) =>
        announcement.course_id === null
    ).length;

  const courseAnnouncements =
    visibleAnnouncements.filter(
      (announcement) =>
        announcement.course_id !== null
    ).length;

  return (
    <>
      <main className="van-page">
        <div className="van-grid-bg" />

        <div className="van-glow van-glow-orange" />
        <div className="van-glow van-glow-blue" />

        <div className="van-shell">

          {/* HEADER */}
          <header className="van-header">
            <div>
              <span className="van-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1>
                Academy <span>Updates.</span>
              </h1>

              <p>
                Stay informed with important Academy news,
                class updates, and learning announcements.
              </p>
            </div>

            <div
              className="van-orbit"
              aria-hidden="true"
            >
              <div className="van-orbit-ring van-orbit-one" />
              <div className="van-orbit-ring van-orbit-two" />

              <div className="van-orbit-core">
                V
              </div>
            </div>
          </header>

          {/* STATS */}
          <section className="van-stats">
            <div className="van-stat-card">
              <div className="van-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M5 4.5v17M8 6h8M8 10h8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>TOTAL UPDATES</span>
                <strong>{totalAnnouncements}</strong>
                <small>Published announcements</small>
              </div>
            </div>

            <div className="van-stat-card">
              <div className="van-stat-icon van-blue">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4 5h16v13H4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m7 9 5 4 5-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span>ACADEMY WIDE</span>
                <strong>{generalAnnouncements}</strong>
                <small>General Academy updates</small>
              </div>
            </div>

            <div className="van-stat-card van-highlight">
              <div className="van-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M6 4h12v16H6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 8h6M9 12h6M9 16h3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>COURSE UPDATES</span>
                <strong>{courseAnnouncements}</strong>
                <small>Updates for your courses</small>
              </div>
            </div>
          </section>

          {/* SECTION HEADER */}
          <div className="van-section-heading">
            <div>
              <span>WHAT'S HAPPENING</span>

              <h2>
                Latest <em>announcements.</em>
              </h2>
            </div>

            <span className="van-count">
              {totalAnnouncements} UPDATE
              {totalAnnouncements === 1
                ? ""
                : "S"}
            </span>
          </div>

          {/* EMPTY */}
          {visibleAnnouncements.length === 0 ? (
            <section className="van-empty">
              <div className="van-empty-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M10 21h4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>ACADEMY UPDATES</span>

              <h2>No announcements yet.</h2>

              <p>
                New Academy announcements and important learning
                updates will appear here.
              </p>
            </section>
          ) : (
            <section className="van-announcement-list">
              {visibleAnnouncements.map(
                (announcement, index) => {
                  const isGeneral =
                    announcement.course_id === null;

                  const announcementType =
                    (
                      announcement.announcement_type ||
                      "GENERAL"
                    ).toUpperCase();

                  return (
                    <article
                      className="van-announcement-card"
                      key={announcement.id}
                    >
                      <div className="van-card-glow" />

                      {/* TOP */}
                      <div className="van-announcement-top">
                        <div className="van-announcement-index">
                          <span>UPDATE</span>

                          <strong>
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </strong>
                        </div>

                        <div className="van-announcement-badges">
                          <span className="van-type-badge">
                            <i />

                            {announcementType}
                          </span>

                          <span className="van-scope-badge">
                            {isGeneral
                              ? "ACADEMY"
                              : "COURSE"}
                          </span>
                        </div>
                      </div>

                      {/* MAIN */}
                      <div className="van-announcement-main">
                        <div className="van-announcement-copy">
                          <span className="van-course-label">
                            {isGeneral
                              ? "VEYORA ACADEMY / ALL STUDENTS"
                              : courseMap.get(
                                  announcement.course_id
                                ) ??
                                "COURSE ANNOUNCEMENT"}
                          </span>

                          <h3>
                            {announcement.title}
                          </h3>

                          <p>
                            {announcement.message}
                          </p>
                        </div>

                        <div
                          className="van-notification-mark"
                          aria-hidden="true"
                        >
                          <div className="van-notification-circle">
                            <svg viewBox="0 0 24 24">
                              <path
                                d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinejoin="round"
                              />

                              <path
                                d="M10 21h4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <small>UPDATE</small>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="van-announcement-footer">
                        <div className="van-published">
                          <span>PUBLISHED</span>

                          <strong>
                            {formatDate(
                              announcement.created_at
                            )}
                          </strong>
                        </div>

                        <div className="van-read-state">
                          <span className="van-read-dot" />

                          <span>
                            Academy announcement
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          )}

          {/* BOTTOM BANNER */}
          <section className="van-bottom-banner">
            <div className="van-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="van-banner-content">
              <span>THE VEYORA APPROACH</span>

              <h2>
                Stay informed.
                <br />
                <em>Stay in motion.</em>
              </h2>

              <p>
                Important updates help you stay aligned with
                your classes, coursework, and learning journey.
              </p>
            </div>

            <a
              href="/student/classes"
              className="van-classes-button"
            >
              View Classes
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .van-page {
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

        .van-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .van-grid-bg {
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

        .van-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .van-glow-orange {
          top: 330px;
          right: -250px;
          background: #FF9B4D;
        }

        .van-glow-blue {
          bottom: 80px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .van-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .van-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .van-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .van-header h1 span {
          color: #FF9B4D;
        }

        .van-header p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .van-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .van-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .van-orbit-one {
          inset: 0;
          animation: van-spin 10s linear infinite;
        }

        .van-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: van-spin-reverse 8s linear infinite;
        }

        .van-orbit-core {
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
          box-shadow:
            0 0 25px rgba(255,155,77,.07);
        }

        @keyframes van-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes van-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* STATS */

        .van-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .van-stat-card {
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

        .van-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.30);
        }

        .van-stat-icon {
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

        .van-stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .van-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .van-stat-card > div:last-child {
          min-width: 0;
        }

        .van-stat-card span {
          display: block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .van-stat-card strong {
          display: block;
          margin-top: 6px;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -.03em;
        }

        .van-stat-card small {
          display: block;
          margin-top: 3px;
          color: #717783;
          font-size: 10px;
        }

        .van-highlight {
          background:
            radial-gradient(
              circle at 92% 5%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        /* SECTION */

        .van-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .van-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .van-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .van-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .van-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* LIST */

        .van-announcement-list {
          display: grid;
          gap: 20px;
        }

        .van-announcement-card {
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

        .van-announcement-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.38);
          box-shadow:
            0 27px 70px rgba(0,0,0,.30),
            0 0 32px rgba(255,155,77,.04);
        }

        .van-card-glow {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 310px;
          height: 310px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(120px);
          opacity: .095;
          pointer-events: none;
        }

        .van-announcement-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .van-announcement-index {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .van-announcement-index span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .van-announcement-index strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .van-announcement-badges {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .van-type-badge,
        .van-scope-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 8px;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .van-type-badge {
          border: 1px solid rgba(255,155,77,.28);
          color: #FFB27A;
        }

        .van-type-badge i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow:
            0 0 9px rgba(255,155,77,.55);
        }

        .van-scope-badge {
          border: 1px solid #343946;
          color: #777D89;
        }

        /* MAIN */

        .van-announcement-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 145px;
          align-items: center;
          gap: 35px;
          padding: 30px 0 26px;
        }

        .van-course-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .van-announcement-copy h3 {
          max-width: 820px;
          margin: 12px 0 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.10;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .van-announcement-copy p {
          max-width: 820px;
          margin: 14px 0 0;
          color: #D0CDC5;
          font-size: 13px;
          line-height: 1.85;
        }

        /* NOTIFICATION VISUAL */

        .van-notification-mark {
          justify-self: end;
          width: 125px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
        }

        .van-notification-circle {
          position: relative;
          width: 91px;
          height: 91px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,155,77,.28);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,155,77,.08),
              transparent 68%
            );
          box-shadow:
            0 0 35px rgba(255,155,77,.055);
        }

        .van-notification-circle::before {
          content: "";
          position: absolute;
          inset: 9px;
          border: 1px solid rgba(110,124,246,.18);
          border-radius: 50%;
        }

        .van-notification-circle svg {
          position: relative;
          z-index: 2;
          width: 30px;
          height: 30px;
          color: #FF9B4D;
        }

        .van-notification-mark small {
          color: #676E79;
          font-size: 8px;
          letter-spacing: .14em;
        }

        /* FOOTER */

        .van-announcement-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid #292E38;
        }

        .van-published {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .van-published span {
          color: #6F7580;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .van-published strong {
          color: #E3E0D8;
          font-size: 11px;
          font-weight: 500;
        }

        .van-read-state {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6F7580;
          font-size: 9px;
        }

        .van-read-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6E7CF6;
          box-shadow:
            0 0 9px rgba(110,124,246,.5);
        }

        /* EMPTY */

        .van-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .van-empty-icon {
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

        .van-empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .van-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .van-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .van-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        /* BOTTOM */

        .van-bottom-banner {
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

        .van-banner-content {
          position: relative;
          z-index: 2;
        }

        .van-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .van-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .van-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .van-banner-content p {
          max-width: 630px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .van-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.20);
          border-radius: 50%;
        }

        .van-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .van-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .van-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .van-classes-button {
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

        .van-classes-button:hover {
          border-color: #FF9B4D;
        }

        .van-classes-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* MOBILE */

        @media (max-width: 850px) {
          .van-announcement-main {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .van-notification-mark {
            justify-self: start;
          }
        }

        @media (max-width: 760px) {
          .van-page {
            padding: 30px 15px 55px;
          }

          .van-header {
            align-items: flex-start;
          }

          .van-orbit {
            width: 64px;
            height: 64px;
          }

          .van-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .van-stats {
            grid-template-columns: 1fr;
          }

          .van-stat-card {
            min-height: 105px;
          }

          .van-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .van-announcement-card {
            padding: 22px 20px 20px;
          }

          .van-announcement-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .van-announcement-badges {
            justify-content: flex-start;
          }

          .van-announcement-main {
            padding: 25px 0;
          }

          .van-notification-mark {
            width: auto;
          }

          .van-announcement-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .van-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .van-classes-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .van-orbit-one,
          .van-orbit-two {
            animation: none;
          }

          .van-stat-card,
          .van-announcement-card,
          .van-classes-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}