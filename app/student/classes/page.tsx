import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClassesPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  const { data: classes, error } = await supabase
    .from("classes")
    .select(
      `
        id,
        course_id,
        title,
        description,
        class_date,
        start_time,
        end_time,
        instructor,
        meeting_link,
        status
      `
    )
    .order("class_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId,
    };

    console.error(
      "CLASSES QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="classes-error-page">
          <div className="classes-error-box">
            <span className="classes-eyebrow">VEYORA ACADEMY</span>

            <h1>Classes Error</h1>

            <p>
              Something went wrong while loading your scheduled classes.
            </p>

            <div className="classes-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .classes-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .classes-error-box {
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .classes-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .classes-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .classes-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .classes-error-details {
            padding: 20px;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
            overflow-x: auto;
          }

          .classes-error-details pre {
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

  const upcomingClasses = classes ?? [];

  function formatDate(dateString: string | null) {
    if (!dateString) return "—";

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

  function formatTime(timeString: string | null) {
    if (!timeString) return "—";

    const parts = timeString.split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return timeString;
    }

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <>
      <main className="vc-page">
        <div className="vc-grid" />

        <div className="vc-glow vc-glow-orange" />
        <div className="vc-glow vc-glow-blue" />

        <div className="vc-shell">

          {/* HEADER */}
          <header className="vc-header">
            <div>
              <span className="vc-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1>
                My <span>Classes.</span>
              </h1>

              <p>
                Stay connected with your upcoming and scheduled
                learning sessions.
              </p>
            </div>

            <div className="vc-orbit" aria-hidden="true">
              <div className="vc-orbit-line vc-orbit-one" />
              <div className="vc-orbit-line vc-orbit-two" />
              <div className="vc-orbit-core">
                <span>V</span>
              </div>
            </div>
          </header>

          {/* TOP STATS */}
          <section className="vc-stats">
            <div className="vc-stat-card">
              <div className="vc-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 2v4M16 2v4M3 9h18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>ALL SCHEDULED</span>
                <strong>{upcomingClasses.length}</strong>
                <small>Learning sessions</small>
              </div>
            </div>

            <div className="vc-stat-card">
              <div className="vc-stat-icon vc-stat-blue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3a9 9 0 1 0 9 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7v5l3 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3h5v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span>CLASS MODE</span>
                <strong>LIVE</strong>
                <small>Instructor-led sessions</small>
              </div>
            </div>

            <div className="vc-stat-card vc-stat-highlight">
              <div className="vc-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 3h10v18H7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    rx="2"
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
                <span>LEARNING SPACE</span>
                <strong>01</strong>
                <small>Show up · Learn · Build</small>
              </div>
            </div>
          </section>

          {/* SECTION HEADING */}
          <div className="vc-section-heading">
            <div>
              <span>YOUR SCHEDULE</span>

              <h2>
                Upcoming <em>sessions.</em>
              </h2>
            </div>

            <div className="vc-session-count">
              {upcomingClasses.length} SESSION
              {upcomingClasses.length === 1 ? "" : "S"}
            </div>
          </div>

          {/* EMPTY STATE */}
          {upcomingClasses.length === 0 ? (
            <section className="vc-empty">
              <div className="vc-empty-symbol">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M8 2v4M16 2v4M3 9h18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 13h2M14 13h2M8 17h2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>YOUR SCHEDULE</span>

              <h2>No classes scheduled yet.</h2>

              <p>
                Your upcoming Veyora Academy learning sessions will
                appear here once they are scheduled.
              </p>
            </section>
          ) : (
            <section className="vc-class-list">
              {upcomingClasses.map((item, index) => {
                const isActive =
                  item.status?.toLowerCase() === "active" ||
                  item.status?.toLowerCase() === "live";

                const hasMeetingLink = Boolean(item.meeting_link);

                return (
                  <article className="vc-class-card" key={item.id}>
                    <div className="vc-card-glow" />

                    {/* CARD HEADER */}
                    <div className="vc-class-top">
                      <div className="vc-class-meta-top">
                        <span className="vc-program-tag">
                          SESSION {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`vc-status ${
                            isActive ? "vc-status-live" : ""
                          }`}
                        >
                          <i />
                          {item.status?.toUpperCase() || "UPCOMING"}
                        </span>
                      </div>

                      <div className="vc-class-calendar">
                        <span>DATE</span>
                        <strong>
                          {formatDate(item.class_date)}
                        </strong>
                      </div>
                    </div>

                    {/* MAIN CLASS AREA */}
                    <div className="vc-class-main">
                      <div className="vc-class-copy">
                        <span className="vc-session-label">
                          VEYORA ACADEMY / LIVE LEARNING SESSION
                        </span>

                        <h3>{item.title}</h3>

                        {item.description && (
                          <p>{item.description}</p>
                        )}

                        <div className="vc-class-details">
                          <div className="vc-detail">
                            <div className="vc-detail-icon">
                              <svg viewBox="0 0 24 24">
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="8"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M12 7v5l3 2"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>

                            <div>
                              <span>TIME</span>
                              <strong>
                                {formatTime(item.start_time)}
                                {" — "}
                                {formatTime(item.end_time)}
                              </strong>
                            </div>
                          </div>

                          <div className="vc-detail">
                            <div className="vc-detail-icon vc-detail-blue">
                              <svg viewBox="0 0 24 24">
                                <path
                                  d="M4 20v-1.5A3.5 3.5 0 0 1 7.5 15h9a3.5 3.5 0 0 1 3.5 3.5V20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />

                                <circle
                                  cx="12"
                                  cy="8"
                                  r="3"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </div>

                            <div>
                              <span>INSTRUCTOR</span>
                              <strong>
                                {item.instructor ||
                                  "Veyora Academy"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* JOIN AREA */}
                      <div className="vc-join-area">
                        <div className="vc-live-orb">
                          <span />
                          <span />
                          <span />
                        </div>

                        {hasMeetingLink ? (
                          <>
                            <span className="vc-ready-label">
                              SESSION READY
                            </span>

                            <a
                              href={item.meeting_link as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vc-join-button"
                            >
                              Join Class
                              <span>↗</span>
                            </a>
                          </>
                        ) : (
                          <>
                            <span className="vc-ready-label">
                              ACCESS STATUS
                            </span>

                            <div className="vc-pending-button">
                              <span className="vc-pending-dot" />
                              Meeting Link Pending
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="vc-class-footer">
                      <div className="vc-footer-left">
                        <span className="vc-footer-dot" />
                        <span>
                          {hasMeetingLink
                            ? "Your class access is ready."
                            : "Meeting details will appear here when available."}
                        </span>
                      </div>

                      <span className="vc-footer-id">
                        VEYORA / {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          {/* BOTTOM BANNER */}
          <section className="vc-bottom-banner">
            <div className="vc-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="vc-banner-content">
              <span>THE VEYORA APPROACH</span>

              <h2>
                Show up.
                <br />
                <em>Build something real.</em>
              </h2>

              <p>
                Every live session is a chance to ask better questions,
                solve real problems, and turn knowledge into practical
                skills.
              </p>
            </div>

            <a
              href="/student/materials"
              className="vc-materials-button"
            >
              Course Materials
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
          padding: 46px 24px 80px;
          box-sizing: border-box;
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

        .vc-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .2;
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
          background-size: 54px 54px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 90%
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
          top: 360px;
          right: -250px;
          background: #FF9B4D;
        }

        .vc-glow-blue {
          bottom: 80px;
          left: -250px;
          background: #6E7CF6;
        }

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

        .vc-header > div:first-child p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        .vc-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .vc-orbit-line {
          position: absolute;
          border: 1px solid rgba(255,155,77,.32);
          border-radius: 50%;
        }

        .vc-orbit-one {
          inset: 0;
          animation: vc-spin 10s linear infinite;
        }

        .vc-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.3);
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
          box-shadow: 0 0 25px rgba(255,155,77,.07);
        }

        .vc-orbit-core span {
          color: #FF9B4D;
          font-family: Georgia, serif;
          font-size: 22px;
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

        .vc-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .vc-stat-card {
          display: flex;
          align-items: center;
          gap: 17px;
          min-height: 105px;
          padding: 20px;
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
          border-color: rgba(255,155,77,.3);
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

        .vc-stat-blue {
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
          font-size: 23px;
          font-weight: 500;
          letter-spacing: -.03em;
        }

        .vc-stat-card small {
          display: block;
          margin-top: 3px;
          color: #717783;
          font-size: 10px;
        }

        .vc-stat-highlight {
          background:
            radial-gradient(
              circle at 92% 5%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        .vc-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .vc-section-heading > div:first-child > span {
          display: inline-block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
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

        .vc-session-count {
          color: #777D89;
          font-size: 10px;
          letter-spacing: .13em;
        }

        .vc-class-list {
          display: grid;
          gap: 20px;
        }

        .vc-class-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 22px;
          border: 1px solid #292E39;
          border-radius: 25px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              transparent 48%
            ),
            #11141B;
          box-shadow: 0 20px 55px rgba(0,0,0,.2);
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .vc-class-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.40);
          box-shadow:
            0 26px 70px rgba(0,0,0,.3),
            0 0 32px rgba(255,155,77,.04);
        }

        .vc-card-glow {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 310px;
          height: 310px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(120px);
          opacity: .10;
          pointer-events: none;
        }

        .vc-class-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vc-class-meta-top {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .vc-program-tag {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .vc-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #969BA5;
          font-size: 9px;
          letter-spacing: .12em;
        }

        .vc-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .vc-status-live {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .vc-status-live i {
          background: #FF9B4D;
          box-shadow: 0 0 12px rgba(255,155,77,.65);
        }

        .vc-class-calendar {
          text-align: right;
        }

        .vc-class-calendar span {
          display: block;
          color: #747B87;
          font-size: 8px;
          letter-spacing: .13em;
          margin-bottom: 5px;
        }

        .vc-class-calendar strong {
          color: #E5E2D9;
          font-size: 12px;
          font-weight: 500;
        }

        .vc-class-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 230px;
          gap: 40px;
          align-items: center;
          padding: 30px 0 27px;
        }

        .vc-session-label {
          color: #FF9B4D;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vc-class-copy h3 {
          max-width: 800px;
          margin: 12px 0 0;
          font-size: clamp(27px, 4vw, 41px);
          line-height: 1.12;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vc-class-copy > p {
          max-width: 720px;
          margin: 14px 0 0;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        .vc-class-details {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 25px;
        }

        .vc-detail {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .vc-detail-icon {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(255,155,77,.18);
          border-radius: 11px;
          color: #FF9B4D;
          background: rgba(255,155,77,.025);
        }

        .vc-detail-icon svg {
          width: 18px;
          height: 18px;
        }

        .vc-detail-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.2);
        }

        .vc-detail span {
          display: block;
          color: #707681;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vc-detail strong {
          display: block;
          margin-top: 5px;
          color: #E3E0D8;
          font-size: 12px;
          font-weight: 500;
        }

        .vc-join-area {
          position: relative;
          min-height: 155px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 20px;
          box-sizing: border-box;
          border: 1px solid #292E38;
          border-radius: 19px;
          background:
            radial-gradient(
              circle at center,
              rgba(255,155,77,.06),
              transparent 68%
            ),
            #0E1117;
        }

        .vc-live-orb {
          position: relative;
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
        }

        .vc-live-orb > span {
          position: absolute;
          border: 1px solid rgba(255,155,77,.22);
          border-radius: 50%;
          animation: vc-pulse 3s ease-in-out infinite;
        }

        .vc-live-orb > span:nth-child(1) {
          inset: 0;
        }

        .vc-live-orb > span:nth-child(2) {
          inset: 9px;
          border-color: rgba(110,124,246,.28);
          animation-delay: -.9s;
        }

        .vc-live-orb > span:nth-child(3) {
          inset: 18px;
          border-color: rgba(255,155,77,.42);
          animation-delay: -1.6s;
        }

        @keyframes vc-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: .7;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .vc-ready-label {
          color: #6F7681;
          font-size: 8px;
          letter-spacing: .15em;
          margin-bottom: 10px;
        }

        .vc-join-button,
        .vc-pending-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          min-width: 160px;
          padding: 12px 18px;
          box-sizing: border-box;
          border-radius: 999px;
          font-size: 11px;
          text-decoration: none;
        }

        .vc-join-button {
          border: 1px solid #FF9B4D;
          background: #FF9B4D;
          color: #0A0C10;
          font-weight: 600;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .vc-join-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255,155,77,.20);
        }

        .vc-join-button span {
          font-size: 15px;
        }

        .vc-pending-button {
          color: #8B909A;
          border: 1px solid #343946;
          background: #13161D;
        }

        .vc-pending-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6D727C;
        }

        .vc-class-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid #292E38;
        }

        .vc-footer-left {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #767C87;
          font-size: 10px;
        }

        .vc-footer-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow: 0 0 9px rgba(255,155,77,.5);
        }

        .vc-footer-id {
          color: #484E59;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vc-empty {
          padding: 72px 24px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .vc-empty-symbol {
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

        .vc-empty-symbol svg {
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
          max-width: 510px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

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
              circle at 13% 55%,
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
          line-height: 1.14;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vc-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vc-banner-content p {
          max-width: 620px;
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

        .vc-materials-button {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          flex: 0 0 auto;
          padding: 12px 17px;
          border: 1px solid #353B47;
          border-radius: 999px;
          color: #E5E2D9;
          font-size: 11px;
          text-decoration: none;
          transition: border-color .2s ease;
        }

        .vc-materials-button:hover {
          border-color: #FF9B4D;
        }

        .vc-materials-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        @media (max-width: 850px) {
          .vc-class-main {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .vc-join-area {
            min-height: 130px;
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
          }

          .vc-orbit-core span {
            font-size: 17px;
          }

          .vc-stats {
            grid-template-columns: 1fr;
          }

          .vc-stat-card {
            min-height: 100px;
          }

          .vc-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vc-class-card {
            padding: 22px 20px 20px;
          }

          .vc-class-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .vc-class-calendar {
            text-align: left;
          }

          .vc-class-main {
            padding: 26px 0 24px;
          }

          .vc-class-details {
            flex-direction: column;
            gap: 18px;
          }

          .vc-class-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .vc-footer-id {
            display: none;
          }

          .vc-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vc-materials-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vc-orbit-one,
          .vc-orbit-two,
          .vc-live-orb > span {
            animation: none;
          }

          .vc-stat-card,
          .vc-class-card,
          .vc-join-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}