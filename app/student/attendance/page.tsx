import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AttendancePage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // ---------------------------------------------------------
  // GET ATTENDANCE RECORDS
  // ---------------------------------------------------------
  const { data: attendance, error } = await supabase
    .from("attendance")
    .select(
      "id, class_id, attendance_date, status, notes, created_at"
    )
    .eq("student_id", userId)
    .order("attendance_date", { ascending: false });

  if (error) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId,
    };

    console.error(
      "ATTENDANCE QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="va-error-page">
          <div className="va-error-box">
            <span className="va-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Attendance Error</h1>

            <p>
              Something went wrong while loading your attendance
              records.
            </p>

            <div className="va-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .va-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .va-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .va-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .va-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .va-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .va-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .va-error-details pre {
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
  // GET CLASS DETAILS
  // ---------------------------------------------------------
  const classIds = (attendance ?? []).map(
    (item) => item.class_id
  );

  const { data: classes, error: classesError } =
    classIds.length > 0
      ? await supabase
          .from("classes")
          .select("id, title, course_id")
          .in("id", classIds)
      : { data: [], error: null };

  if (classesError) {
    const errorDetails = {
      message: classesError.message,
      details: classesError.details,
      hint: classesError.hint,
      code: classesError.code,
      userId,
    };

    console.error(
      "ATTENDANCE CLASS QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="va-error-page">
          <div className="va-error-box">
            <span className="va-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Classes Error</h1>

            <p>
              Attendance was found, but the related class details
              could not be loaded.
            </p>

            <div className="va-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .va-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .va-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .va-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .va-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .va-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .va-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .va-error-details pre {
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
  // MAPS + COUNTS
  // ---------------------------------------------------------
  const classMap = new Map(
    (classes ?? []).map((item) => [
      item.id,
      item.title,
    ])
  );

  const records = attendance ?? [];

  const presentCount = records.filter(
    (item) =>
      item.status?.toLowerCase() === "present"
  ).length;

  const absentCount = records.filter(
    (item) =>
      item.status?.toLowerCase() === "absent"
  ).length;

  const lateCount = records.filter(
    (item) =>
      item.status?.toLowerCase() === "late"
  ).length;

  const attendancePercentage =
    records.length > 0
      ? Math.round(
          (
            records.filter(
              (item) =>
                item.status?.toLowerCase() === "present" ||
                item.status?.toLowerCase() === "late"
            ).length / records.length
          ) * 100
        )
      : 0;

  const totalRecords = records.length;

  const participationCount =
    presentCount + lateCount;

  function formatDate(dateString: string | null) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <main className="va-page">
        <div className="va-grid-bg" />

        <div className="va-glow va-glow-orange" />
        <div className="va-glow va-glow-blue" />

        <div className="va-shell">

          {/* HEADER */}
          <header className="va-header">
            <div>
              <span className="va-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1>
                My <span>Attendance.</span>
              </h1>

              <p>
                Track your participation across every learning
                session.
              </p>
            </div>

            <div
              className="va-orbit"
              aria-hidden="true"
            >
              <div className="va-orbit-ring va-orbit-one" />
              <div className="va-orbit-ring va-orbit-two" />

              <div className="va-orbit-core">
                V
              </div>
            </div>
          </header>

          {/* TOP SUMMARY */}
          <section className="va-summary-grid">

            {/* ATTENDANCE */}
            <div className="va-summary-card va-summary-main">
              <div className="va-summary-copy">
                <span>OVERALL ATTENDANCE</span>

                <strong>
                  {attendancePercentage}%
                </strong>

                <small>
                  Present + late participation
                </small>
              </div>

              <div className="va-attendance-ring">
                <svg viewBox="0 0 112 112">
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    fill="none"
                    stroke="#292E38"
                    strokeWidth="5"
                  />

                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    fill="none"
                    stroke="#FF9B4D"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      45 *
                      (1 -
                        attendancePercentage / 100)
                    }
                    transform="rotate(-90 56 56)"
                    className="va-attendance-arc"
                  />
                </svg>

                <div>
                  <strong>
                    {attendancePercentage}%
                  </strong>

                  <span>
                    ATTENDANCE
                  </span>
                </div>
              </div>
            </div>

            {/* PRESENT */}
            <div className="va-summary-card">
              <div className="va-summary-icon va-orange">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12.5 9.2 17 19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>PRESENT</span>

              <strong>
                {presentCount}
              </strong>

              <small>
                Sessions attended
              </small>
            </div>

            {/* ABSENT */}
            <div className="va-summary-card">
              <div className="va-summary-icon va-blue">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 7 17 17M17 7 7 17"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>ABSENT</span>

              <strong>
                {absentCount}
              </strong>

              <small>
                Missed sessions
              </small>
            </div>

            {/* LATE */}
            <div className="va-summary-card">
              <div className="va-summary-icon va-orange">
                <svg viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M12 8v4l2.5 1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>LATE</span>

              <strong>
                {lateCount}
              </strong>

              <small>
                Late arrivals
              </small>
            </div>
          </section>

          {/* SECONDARY STATS */}
          <section className="va-mini-stats">
            <div>
              <span>TOTAL SESSIONS</span>

              <strong>
                {totalRecords}
              </strong>
            </div>

            <div>
              <span>PARTICIPATED</span>

              <strong>
                {participationCount}
              </strong>
            </div>

            <div>
              <span>PARTICIPATION RATE</span>

              <strong>
                {attendancePercentage}%
              </strong>
            </div>
          </section>

          {/* HISTORY HEADER */}
          <div className="va-section-heading">
            <div>
              <span>SESSION RECORD</span>

              <h2>
                Attendance <em>history.</em>
              </h2>
            </div>

            <span className="va-history-count">
              {totalRecords} RECORD
              {totalRecords === 1 ? "" : "S"}
            </span>
          </div>

          {/* NO RECORDS */}
          {records.length === 0 ? (
            <section className="va-empty">
              <div className="va-empty-icon">
                <svg viewBox="0 0 24 24">
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

              <span>YOUR ATTENDANCE</span>

              <h2>
                No attendance records yet.
              </h2>

              <p>
                Your attendance history will appear here after
                your first recorded class session.
              </p>
            </section>
          ) : (
            <section className="va-history-card">

              {/* TABLE HEADER */}
              <div className="va-history-head">
                <span>CLASS SESSION</span>
                <span>DATE</span>
                <span>STATUS</span>
              </div>

              {/* RECORDS */}
              <div className="va-record-list">
                {records.map((item, index) => {
                  const normalizedStatus =
                    item.status?.toLowerCase() ||
                    "present";

                  const isPresent =
                    normalizedStatus === "present";

                  const isLate =
                    normalizedStatus === "late";

                  const statusLabel =
                    normalizedStatus.toUpperCase();

                  return (
                    <article
                      className="va-record"
                      key={item.id}
                    >
                      <div className="va-record-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="va-record-class">
                        <div className="va-record-icon">
                          <svg viewBox="0 0 24 24">
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
                          <h3>
                            {classMap.get(
                              item.class_id
                            ) || "Class Session"}
                          </h3>

                          {item.notes && (
                            <p>
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="va-record-date">
                        <span>DATE</span>

                        <strong>
                          {formatDate(
                            item.attendance_date
                          )}
                        </strong>
                      </div>

                      <div
                        className={`va-record-status ${
                          isPresent
                            ? "va-record-present"
                            : isLate
                              ? "va-record-late"
                              : "va-record-absent"
                        }`}
                      >
                        <i />

                        {statusLabel}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* BOTTOM BANNER */}
          <section className="va-bottom-banner">
            <div className="va-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="va-banner-content">
              <span>THE VEYORA APPROACH</span>

              <h2>
                Show up.
                <br />
                <em>Keep building.</em>
              </h2>

              <p>
                Consistent participation creates momentum.
                Every session is another opportunity to learn,
                practice, and move forward.
              </p>
            </div>

            <a
              href="/student/classes"
              className="va-classes-button"
            >
              View Classes
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .va-page {
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

        .va-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .va-grid-bg {
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

        .va-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .va-glow-orange {
          top: 310px;
          right: -250px;
          background: #FF9B4D;
        }

        .va-glow-blue {
          bottom: 80px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .va-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .va-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .va-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .va-header h1 span {
          color: #FF9B4D;
        }

        .va-header p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .va-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .va-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .va-orbit-one {
          inset: 0;
          animation: va-spin 10s linear infinite;
        }

        .va-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: va-spin-reverse 8s linear infinite;
        }

        .va-orbit-core {
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

        @keyframes va-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes va-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* SUMMARY */

        .va-summary-grid {
          display: grid;
          grid-template-columns:
            1.45fr
            repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .va-summary-card {
          position: relative;
          min-height: 160px;
          padding: 23px;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid #262B35;
          border-radius: 20px;
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

        .va-summary-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.30);
        }

        .va-summary-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(255,155,77,.09),
              transparent 40%
            ),
            #12151C;
        }

        .va-summary-copy > span,
        .va-summary-card > span {
          display: block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .va-summary-copy strong {
          display: block;
          margin-top: 11px;
          color: #F3F1EA;
          font-size: 39px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .va-summary-copy small {
          display: block;
          margin-top: 8px;
          color: #747B87;
          font-size: 10px;
        }

        .va-attendance-ring {
          position: relative;
          width: 112px;
          height: 112px;
          flex: 0 0 auto;
        }

        .va-attendance-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(0deg);
        }

        .va-attendance-arc {
          filter:
            drop-shadow(
              0 0 5px rgba(255,155,77,.42)
            );
          transition: stroke-dashoffset 1s ease;
        }

        .va-attendance-ring > div {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .va-attendance-ring strong {
          font-size: 21px;
          font-weight: 500;
        }

        .va-attendance-ring span {
          margin-top: 3px;
          color: #747B87;
          font-size: 7px;
          letter-spacing: .10em;
        }

        .va-summary-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          border: 1px solid rgba(255,155,77,.23);
          border-radius: 12px;
          color: #FF9B4D;
          background: rgba(255,155,77,.035);
        }

        .va-summary-icon svg {
          width: 19px;
          height: 19px;
        }

        .va-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .va-summary-card > strong {
          display: block;
          margin-top: 11px;
          font-size: 31px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .va-summary-card > small {
          display: block;
          margin-top: 5px;
          color: #717783;
          font-size: 10px;
        }

        /* MINI STATS */

        .va-mini-stats {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 14px;
        }

        .va-mini-stats > div {
          padding: 16px 20px;
          border: 1px solid #262B35;
          border-radius: 15px;
          background: rgba(18,21,28,.62);
        }

        .va-mini-stats span {
          color: #6F7580;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .va-mini-stats strong {
          margin-left: 12px;
          color: #E3E0D8;
          font-size: 14px;
          font-weight: 500;
        }

        /* SECTION */

        .va-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .va-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .va-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .va-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .va-history-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* HISTORY */

        .va-history-card {
          overflow: hidden;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
          box-shadow:
            0 20px 55px rgba(0,0,0,.19);
        }

        .va-history-head {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            180px
            130px;
          gap: 20px;
          padding: 18px 26px;
          border-bottom: 1px solid #292E38;
          color: #606772;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .va-history-head span:last-child {
          text-align: right;
        }

        .va-record {
          position: relative;
          display: grid;
          grid-template-columns:
            42px
            minmax(0, 1fr)
            180px
            130px;
          align-items: center;
          gap: 15px;
          padding: 23px 26px;
          border-bottom: 1px solid #292E38;
          transition:
            background .25s ease;
        }

        .va-record:last-child {
          border-bottom: none;
        }

        .va-record:hover {
          background: rgba(255,255,255,.018);
        }

        .va-record-number {
          color: #FF9B4D;
          font-size: 10px;
          letter-spacing: .08em;
        }

        .va-record-class {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .va-record-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid #303641;
          border-radius: 11px;
          color: #6E7CF6;
          background: #0E1117;
        }

        .va-record-icon svg {
          width: 18px;
          height: 18px;
        }

        .va-record-class h3 {
          margin: 0;
          color: #E6E2DA;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 500;
        }

        .va-record-class p {
          margin: 4px 0 0;
          color: #6F7580;
          font-size: 10px;
          line-height: 1.5;
        }

        .va-record-date span {
          display: block;
          color: #656B76;
          font-size: 8px;
          letter-spacing: .12em;
          margin-bottom: 5px;
        }

        .va-record-date strong {
          color: #DAD7D0;
          font-size: 11px;
          font-weight: 500;
        }

        .va-record-status {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          font-size: 9px;
          letter-spacing: .11em;
        }

        .va-record-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .va-record-present {
          color: #FFB27A;
          border-color: rgba(255,155,77,.27);
        }

        .va-record-present i {
          background: #FF9B4D;
          box-shadow:
            0 0 11px rgba(255,155,77,.6);
        }

        .va-record-late {
          color: #B7B9FF;
          border-color: rgba(110,124,246,.28);
        }

        .va-record-late i {
          background: #6E7CF6;
          box-shadow:
            0 0 11px rgba(110,124,246,.55);
        }

        .va-record-absent {
          color: #9A9DA5;
        }

        /* EMPTY */

        .va-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .va-empty-icon {
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

        .va-empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .va-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .va-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .va-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        /* BOTTOM BANNER */

        .va-bottom-banner {
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

        .va-banner-content {
          position: relative;
          z-index: 2;
        }

        .va-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .va-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .va-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .va-banner-content p {
          max-width: 620px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .va-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.2);
          border-radius: 50%;
        }

        .va-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .va-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .va-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .va-classes-button {
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

        .va-classes-button:hover {
          border-color: #FF9B4D;
        }

        .va-classes-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .va-summary-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .va-summary-main {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 820px) {
          .va-history-head {
            display: none;
          }

          .va-record {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 13px;
          }

          .va-record-date {
            grid-column: 2;
          }

          .va-record-status {
            grid-column: 2;
            justify-self: start;
          }
        }

        @media (max-width: 700px) {
          .va-page {
            padding: 30px 15px 55px;
          }

          .va-header {
            align-items: flex-start;
          }

          .va-orbit {
            width: 64px;
            height: 64px;
          }

          .va-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .va-summary-grid {
            grid-template-columns: 1fr;
          }

          .va-summary-main {
            grid-column: auto;
          }

          .va-summary-card {
            min-height: 135px;
          }

          .va-mini-stats {
            grid-template-columns: 1fr;
          }

          .va-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .va-history-card {
            border-radius: 20px;
          }

          .va-record {
            padding: 20px;
          }

          .va-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .va-classes-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .va-summary-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .va-attendance-ring {
            width: 100px;
            height: 100px;
          }

          .va-record-class h3 {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .va-orbit-one,
          .va-orbit-two {
            animation: none;
          }

          .va-summary-card,
          .va-record,
          .va-classes-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}