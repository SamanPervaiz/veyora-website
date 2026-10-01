import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
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
    .select(
      "id, course_id, enrollment_date, status, progress, created_at"
    )
    .eq("student_id", userId)
    .order("created_at", { ascending: false });

  if (enrollmentError) {
    const errorDetails = {
      message: enrollmentError.message,
      details: enrollmentError.details,
      hint: enrollmentError.hint,
      code: enrollmentError.code,
      userId,
    };

    console.error(
      "PROGRESS ENROLLMENT ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vp-error-page">
          <div className="vp-error-box">
            <span className="vp-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Progress Error</h1>

            <p>
              Something went wrong while loading your learning progress.
            </p>

            <div className="vp-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .vp-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vp-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vp-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vp-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vp-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vp-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vp-error-details pre {
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
  // GET COURSE DETAILS
  // ---------------------------------------------------------
  const { data: courses, error: coursesError } =
    courseIds.length > 0
      ? await supabase
          .from("courses")
          .select(
            "id, title, description, duration_months, monthly_fee, total_fee"
          )
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
      "PROGRESS COURSE ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vp-error-page">
          <div className="vp-error-box">
            <span className="vp-eyebrow">
              VEYORA ACADEMY
            </span>

            <h1>Course Error</h1>

            <p>
              Your enrollment was found, but course details could not
              be loaded.
            </p>

            <div className="vp-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .vp-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vp-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vp-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vp-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vp-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vp-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vp-error-details pre {
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
  // MAP ENROLLED COURSES
  // ---------------------------------------------------------
  const courseMap = new Map(
    (courses ?? []).map((course) => [
      course.id,
      course,
    ])
  );

  const enrolledCourses = (enrollments ?? [])
    .map((enrollment) => ({
      ...enrollment,
      course: courseMap.get(enrollment.course_id),
    }))
    .filter((item) => item.course);

  // ---------------------------------------------------------
  // CALCULATIONS
  // ---------------------------------------------------------
  const totalCourses = enrolledCourses.length;

  const totalProgress =
    totalCourses > 0
      ? Math.round(
          enrolledCourses.reduce(
            (sum, item) =>
              sum + Number(item.progress ?? 0),
            0
          ) / totalCourses
        )
      : 0;

  const completedCourses =
    enrolledCourses.filter(
      (item) =>
        Number(item.progress ?? 0) >= 100
    ).length;

  const activeCourses =
    enrolledCourses.filter(
      (item) =>
        String(item.status).toLowerCase() === "active"
    ).length;

  const remainingProgress = Math.max(
    0,
    100 - totalProgress
  );

  function safeProgress(value: number | string | null) {
    const numericValue = Number(value ?? 0);

    if (Number.isNaN(numericValue)) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, numericValue)
    );
  }

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
      <main className="vp-page">
        <div className="vp-grid-bg" />

        <div className="vp-glow vp-glow-orange" />
        <div className="vp-glow vp-glow-blue" />

        <div className="vp-shell">

          {/* HEADER */}
          <header className="vp-header">
            <div>
              <span className="vp-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1>
                My <span>Progress.</span>
              </h1>

              <p>
                See how far you've come — and what comes next.
              </p>
            </div>

            <div
              className="vp-orbit"
              aria-hidden="true"
            >
              <div className="vp-orbit-ring vp-orbit-one" />
              <div className="vp-orbit-ring vp-orbit-two" />
              <div className="vp-orbit-core">
                V
              </div>
            </div>
          </header>

          {/* OVERALL PROGRESS HERO */}
          <section className="vp-progress-hero">
            <div className="vp-progress-copy">
              <span className="vp-small-label">
                OVERALL LEARNING PROGRESS
              </span>

              <h2>
                Keep moving
                <br />
                <em>forward.</em>
              </h2>

              <p>
                Your overall progress reflects the average progress
                across your enrolled programs.
              </p>

              <div className="vp-progress-line">
                <div className="vp-progress-line-top">
                  <span>COURSE COMPLETION</span>
                  <strong>{totalProgress}%</strong>
                </div>

                <div className="vp-progress-track">
                  <div
                    className="vp-progress-fill"
                    style={{
                      width: `${totalProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="vp-big-ring">
              <div className="vp-ring-glow" />

              <svg viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="#292E38"
                  strokeWidth="7"
                />

                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="#FF9B4D"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    72 *
                    (1 - totalProgress / 100)
                  }
                  transform="rotate(-90 90 90)"
                  className="vp-ring-arc"
                />
              </svg>

              <div className="vp-big-ring-center">
                <strong>{totalProgress}%</strong>
                <span>OVERALL</span>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="vp-summary-grid">

            <div className="vp-summary-card">
              <div className="vp-summary-icon">
                <span>01</span>
              </div>

              <span>ACTIVE COURSES</span>

              <strong>{activeCourses}</strong>

              <small>
                Programs currently in progress
              </small>
            </div>

            <div className="vp-summary-card">
              <div className="vp-summary-icon vp-blue">
                <span>02</span>
              </div>

              <span>COMPLETED</span>

              <strong>{completedCourses}</strong>

              <small>
                Programs at 100% completion
              </small>
            </div>

            <div className="vp-summary-card">
              <div className="vp-summary-icon">
                <span>03</span>
              </div>

              <span>ENROLLED COURSES</span>

              <strong>{totalCourses}</strong>

              <small>
                Your current learning portfolio
              </small>
            </div>

            <div className="vp-summary-card vp-summary-highlight">
              <div className="vp-summary-icon vp-blue">
                <span>04</span>
              </div>

              <span>REMAINING</span>

              <strong>{remainingProgress}%</strong>

              <small>
                Progress still to complete
              </small>
            </div>
          </section>

          {/* COURSE SECTION */}
          <div className="vp-section-heading">
            <div>
              <span>PROGRAM PROGRESS</span>

              <h2>
                Your learning <em>journey.</em>
              </h2>
            </div>

            <span className="vp-course-count">
              {totalCourses} PROGRAM
              {totalCourses === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY */}
          {enrolledCourses.length === 0 ? (
            <section className="vp-empty">
              <div className="vp-empty-icon">
                +
              </div>

              <span>YOUR LEARNING JOURNEY</span>

              <h2>
                No progress available yet.
              </h2>

              <p>
                Your course progress will appear here after
                enrollment.
              </p>

              <a
                href="/academy"
                className="vp-primary-button"
              >
                Explore Academy
                <span>↗</span>
              </a>
            </section>
          ) : (
            <section className="vp-course-list">
              {enrolledCourses.map(
                (item, index) => {
                  const progress = safeProgress(
                    item.progress
                  );

                  const remaining =
                    Math.max(
                      0,
                      100 - progress
                    );

                  const isCompleted =
                    progress >= 100;

                  const isActive =
                    String(
                      item.status
                    ).toLowerCase() ===
                    "active";

                  return (
                    <article
                      className="vp-course-card"
                      key={item.id}
                    >
                      <div className="vp-card-glow" />

                      {/* TOP */}
                      <div className="vp-course-top">
                        <div className="vp-program-number">
                          <span>PROGRAM</span>

                          <strong>
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </strong>
                        </div>

                        <div
                          className={`vp-status ${
                            isCompleted
                              ? "vp-status-complete"
                              : isActive
                                ? "vp-status-active"
                                : ""
                          }`}
                        >
                          <i />

                          {isCompleted
                            ? "Completed"
                            : item.status ||
                              "Enrolled"}
                        </div>
                      </div>

                      {/* MAIN */}
                      <div className="vp-course-main">
                        <div className="vp-course-copy">
                          <span className="vp-course-label">
                            VEYORA ACADEMY / PROFESSIONAL PROGRAM
                          </span>

                          <h3>
                            {item.course?.title ||
                              "Course"}
                          </h3>

                          {item.course?.description && (
                            <p>
                              {item.course.description}
                            </p>
                          )}
                        </div>

                        {/* RING */}
                        <div className="vp-course-ring">
                          <div className="vp-course-ring-glow" />

                          <svg viewBox="0 0 132 132">
                            <circle
                              cx="66"
                              cy="66"
                              r="52"
                              fill="none"
                              stroke="#292E38"
                              strokeWidth="6"
                            />

                            <circle
                              cx="66"
                              cy="66"
                              r="52"
                              fill="none"
                              stroke="#FF9B4D"
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={
                                2 *
                                Math.PI *
                                52
                              }
                              strokeDashoffset={
                                2 *
                                Math.PI *
                                52 *
                                (1 -
                                  progress /
                                    100)
                              }
                              transform="rotate(-90 66 66)"
                              className="vp-course-ring-arc"
                            />
                          </svg>

                          <div className="vp-course-ring-center">
                            <strong>
                              {progress}%
                            </strong>

                            <span>
                              COMPLETE
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PROGRESS */}
                      <div className="vp-course-progress">
                        <div className="vp-course-progress-head">
                          <span>
                            LEARNING PROGRESS
                          </span>

                          <strong>
                            {progress}%
                          </strong>
                        </div>

                        <div className="vp-course-progress-track">
                          <div
                            className="vp-course-progress-fill"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* META */}
                      <div className="vp-course-meta">
                        <div>
                          <span>
                            DURATION
                          </span>

                          <strong>
                            {item.course
                              ?.duration_months ??
                              "—"}{" "}
                            Months
                          </strong>
                        </div>

                        <div>
                          <span>
                            ENROLLED
                          </span>

                          <strong>
                            {formatDate(
                              item.enrollment_date
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            REMAINING
                          </span>

                          <strong>
                            {remaining}%
                          </strong>
                        </div>
                      </div>

                      {/* MESSAGE */}
                      <div className="vp-course-message">
                        <div className="vp-message-dot" />

                        <div>
                          <span>
                            {isCompleted
                              ? "PROGRAM COMPLETE"
                              : isActive
                                ? "CURRENT STATUS"
                                : "PROGRAM STATUS"}
                          </span>

                          <p>
                            {isCompleted
                              ? "Course completed. Your certificate will be available when issued."
                              : progress === 0
                                ? "Your learning journey is ready to begin."
                                : `You have completed ${progress}% of this course.`}
                          </p>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="vp-course-footer">
                        <span>
                          VEYORA /{" "}
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <a
                          href="/student/courses"
                          className="vp-course-button"
                        >
                          View Course
                          <span>↗</span>
                        </a>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          )}

          {/* BOTTOM BANNER */}
          <section className="vp-bottom-banner">
            <div className="vp-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="vp-banner-content">
              <span>
                THE VEYORA APPROACH
              </span>

              <h2>
                Progress is not just a number.
                <br />
                <em>It's momentum.</em>
              </h2>

              <p>
                Every module you complete, every project you build,
                and every class you attend moves you closer to
                real-world capability.
              </p>
            </div>

            <a
              href="/student/courses"
              className="vp-courses-button"
            >
              My Courses
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .vp-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          box-sizing: border-box;
          padding: 46px 24px 80px;
          background:
            radial-gradient(
              circle at 8% 5%,
              rgba(110,124,246,.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(255,155,77,.075),
              transparent 28%
            ),
            #0A0C10;
          color: #F3F1EA;
        }

        .vp-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .vp-grid-bg {
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

        .vp-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .vp-glow-orange {
          top: 300px;
          right: -250px;
          background: #FF9B4D;
        }

        .vp-glow-blue {
          bottom: 100px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .vp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .vp-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .vp-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .vp-header h1 span {
          color: #FF9B4D;
        }

        .vp-header p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .vp-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .vp-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .vp-orbit-one {
          inset: 0;
          animation: vp-spin 10s linear infinite;
        }

        .vp-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: vp-spin-reverse 8s linear infinite;
        }

        .vp-orbit-core {
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

        @keyframes vp-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vp-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* HERO */

        .vp-progress-hero {
          position: relative;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            240px;
          align-items: center;
          gap: 50px;
          min-height: 280px;
          padding: 35px;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid #292E38;
          border-radius: 26px;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(255,155,77,.085),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              transparent 55%
            ),
            #11141B;
          box-shadow:
            0 20px 60px rgba(0,0,0,.22);
        }

        .vp-progress-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,.025);
          border-radius: 26px;
        }

        .vp-progress-copy {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .vp-small-label {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vp-progress-copy h2 {
          margin: 13px 0 0;
          font-size: clamp(32px, 5vw, 50px);
          line-height: 1.05;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .vp-progress-copy h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vp-progress-copy > p {
          max-width: 570px;
          margin: 15px 0 0;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        .vp-progress-line {
          max-width: 620px;
          margin-top: 25px;
        }

        .vp-progress-line-top,
        .vp-course-progress-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 9px;
        }

        .vp-progress-line-top span,
        .vp-course-progress-head span {
          color: #717783;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .vp-progress-line-top strong,
        .vp-course-progress-head strong {
          color: #FF9B4D;
          font-size: 10px;
          font-weight: 500;
        }

        .vp-progress-track,
        .vp-course-progress-track {
          width: 100%;
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: #292E38;
        }

        .vp-progress-fill,
        .vp-course-progress-fill {
          height: 100%;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              #FF9B4D,
              #F7C18F
            );
          box-shadow:
            0 0 14px rgba(255,155,77,.35);
          transition: width 1s ease;
        }

        /* BIG RING */

        .vp-big-ring {
          position: relative;
          width: 210px;
          height: 210px;
          justify-self: center;
        }

        .vp-big-ring svg {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        .vp-ring-glow {
          position: absolute;
          inset: 50px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(45px);
          opacity: .14;
        }

        .vp-ring-arc {
          filter:
            drop-shadow(
              0 0 7px rgba(255,155,77,.45)
            );
          transition: stroke-dashoffset 1.1s ease;
        }

        .vp-big-ring-center {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .vp-big-ring-center strong {
          font-size: 37px;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .vp-big-ring-center span {
          margin-top: 5px;
          color: #747B87;
          font-size: 8px;
          letter-spacing: .14em;
        }

        /* SUMMARY */

        .vp-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 14px;
        }

        .vp-summary-card {
          min-height: 150px;
          padding: 22px;
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

        .vp-summary-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.3);
        }

        .vp-summary-card > span {
          display: block;
          margin-top: 21px;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vp-summary-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,155,77,.23);
          border-radius: 11px;
          color: #FF9B4D;
          background: rgba(255,155,77,.035);
        }

        .vp-summary-icon span {
          font-size: 9px;
          letter-spacing: .04em;
        }

        .vp-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .vp-summary-card strong {
          display: block;
          margin-top: 7px;
          font-size: 31px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vp-summary-card small {
          display: block;
          margin-top: 4px;
          color: #717783;
          font-size: 10px;
          line-height: 1.5;
        }

        .vp-summary-highlight {
          background:
            radial-gradient(
              circle at 90% 8%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        /* SECTION */

        .vp-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .vp-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vp-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vp-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vp-course-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* COURSE */

        .vp-course-list {
          display: grid;
          gap: 20px;
        }

        .vp-course-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 24px;
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
            0 20px 55px rgba(0,0,0,.2);
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .vp-course-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.39);
          box-shadow:
            0 27px 70px rgba(0,0,0,.3),
            0 0 32px rgba(255,155,77,.04);
        }

        .vp-card-glow {
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

        .vp-course-top,
        .vp-course-main,
        .vp-course-progress,
        .vp-course-meta,
        .vp-course-message,
        .vp-course-footer {
          position: relative;
          z-index: 2;
        }

        .vp-course-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vp-program-number {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vp-program-number span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vp-program-number strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .vp-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #9398A2;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .vp-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .vp-status-active {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .vp-status-active i {
          background: #FF9B4D;
          box-shadow:
            0 0 11px rgba(255,155,77,.6);
        }

        .vp-status-complete {
          color: #B7B9FF;
          border-color: rgba(110,124,246,.28);
        }

        .vp-status-complete i {
          background: #6E7CF6;
          box-shadow:
            0 0 11px rgba(110,124,246,.5);
        }

        /* COURSE MAIN */

        .vp-course-main {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            160px;
          align-items: center;
          gap: 35px;
          padding: 30px 0;
        }

        .vp-course-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vp-course-copy h3 {
          max-width: 780px;
          margin: 12px 0 0;
          font-size: clamp(28px, 4.5vw, 43px);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vp-course-copy p {
          max-width: 720px;
          margin: 14px 0 0;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        /* COURSE RING */

        .vp-course-ring {
          position: relative;
          width: 145px;
          height: 145px;
          justify-self: end;
        }

        .vp-course-ring svg {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
        }

        .vp-course-ring-glow {
          position: absolute;
          inset: 30px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(35px);
          opacity: .13;
        }

        .vp-course-ring-arc {
          filter:
            drop-shadow(
              0 0 5px rgba(255,155,77,.45)
            );
          transition:
            stroke-dashoffset 1s ease;
        }

        .vp-course-ring-center {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .vp-course-ring-center strong {
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .vp-course-ring-center span {
          margin-top: 4px;
          color: #747B87;
          font-size: 7px;
          letter-spacing: .12em;
        }

        /* PROGRESS */

        .vp-course-progress {
          padding: 20px 0;
          border-top: 1px solid #292E38;
        }

        .vp-course-progress-track {
          height: 5px;
        }

        /* META */

        .vp-course-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 20px 0;
          border-top: 1px solid #292E38;
          border-bottom: 1px solid #292E38;
        }

        .vp-course-meta div {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vp-course-meta span {
          color: #707681;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vp-course-meta strong {
          color: #E3E0D8;
          font-size: 12px;
          line-height: 1.5;
          font-weight: 500;
        }

        /* MESSAGE */

        .vp-course-message {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-top: 20px;
          padding: 16px 17px;
          border: 1px solid #292E38;
          border-radius: 14px;
          background: #0D1016;
        }

        .vp-message-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          margin-top: 5px;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow:
            0 0 10px rgba(255,155,77,.55);
        }

        .vp-course-message span {
          display: block;
          color: #707681;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vp-course-message p {
          margin: 6px 0 0;
          color: #A0A4AC;
          font-size: 11px;
          line-height: 1.6;
        }

        /* FOOTER */

        .vp-course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 22px;
        }

        .vp-course-footer > span {
          color: #484E59;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vp-course-button,
        .vp-primary-button,
        .vp-courses-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 12px 18px;
          border-radius: 999px;
          text-decoration: none;
        }

        .vp-course-button {
          border: 1px solid #353B47;
          color: #E5E2D9;
          font-size: 11px;
          transition: border-color .2s ease;
        }

        .vp-course-button:hover {
          border-color: #FF9B4D;
        }

        .vp-course-button span,
        .vp-courses-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* EMPTY */

        .vp-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .vp-empty-icon {
          width: 63px;
          height: 63px;
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
          border: 1px solid rgba(255,155,77,.35);
          border-radius: 50%;
          color: #FF9B4D;
          font-size: 26px;
        }

        .vp-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vp-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vp-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        .vp-primary-button {
          margin-top: 25px;
          border: 1px solid #FF9B4D;
          background: #FF9B4D;
          color: #0A0C10;
          font-size: 12px;
          font-weight: 600;
        }

        /* BOTTOM */

        .vp-bottom-banner {
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

        .vp-banner-content {
          position: relative;
          z-index: 2;
        }

        .vp-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .vp-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vp-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vp-banner-content p {
          max-width: 630px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vp-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.2);
          border-radius: 50%;
        }

        .vp-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .vp-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .vp-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .vp-courses-button {
          position: relative;
          z-index: 2;
          flex: 0 0 auto;
          border: 1px solid #353B47;
          color: #E5E2D9;
          font-size: 11px;
          transition: border-color .2s ease;
        }

        .vp-courses-button:hover {
          border-color: #FF9B4D;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .vp-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 850px) {
          .vp-progress-hero {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .vp-big-ring {
            justify-self: start;
            width: 180px;
            height: 180px;
          }

          .vp-course-main {
            grid-template-columns: 1fr;
          }

          .vp-course-ring {
            justify-self: start;
          }
        }

        @media (max-width: 700px) {
          .vp-page {
            padding: 30px 15px 55px;
          }

          .vp-header {
            align-items: flex-start;
          }

          .vp-orbit {
            width: 64px;
            height: 64px;
          }

          .vp-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .vp-summary-grid {
            grid-template-columns: 1fr;
          }

          .vp-summary-card {
            min-height: 125px;
          }

          .vp-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vp-progress-hero {
            padding: 24px;
            min-height: auto;
          }

          .vp-progress-copy h2 {
            font-size: 34px;
          }

          .vp-big-ring {
            width: 155px;
            height: 155px;
          }

          .vp-course-card {
            padding: 22px 20px 20px;
          }

          .vp-course-top {
            align-items: flex-start;
          }

          .vp-course-main {
            padding: 25px 0;
          }

          .vp-course-meta {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .vp-course-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .vp-course-button {
            width: 100%;
            box-sizing: border-box;
          }

          .vp-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vp-courses-button {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vp-orbit-one,
          .vp-orbit-two {
            animation: none;
          }

          .vp-summary-card,
          .vp-course-card,
          .vp-course-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}