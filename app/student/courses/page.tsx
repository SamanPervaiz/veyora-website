import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyCoursesPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // Get student's enrollments
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, course_id, enrollment_date, status, progress")
    .eq("student_id", userId)
    .order("enrollment_date", { ascending: false });

  if (enrollmentError) {
    return (
      <>
        <main className="mc-error-page">
          <div className="mc-error-box">
            <span className="mc-eyebrow">VEYORA ACADEMY</span>
            <h1>Unable to load courses</h1>
            <p>{enrollmentError.message}</p>
          </div>
        </main>

        <style>{`
          .mc-error-page {
            min-height: 100vh;
            background: #0A0C10;
            color: #F3F1EA;
            padding: 60px 24px;
          }

          .mc-error-box {
            max-width: 700px;
            margin: 0 auto;
            padding: 32px;
            border: 1px solid #262B35;
            border-radius: 24px;
            background: #12151C;
          }

          .mc-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .15em;
          }

          .mc-error-box h1 {
            margin: 12px 0;
            font-size: 34px;
            font-weight: 500;
          }

          .mc-error-box p {
            color: #8A909A;
            line-height: 1.7;
            overflow-wrap: anywhere;
          }
        `}</style>
      </>
    );
  }

  const courseIds = (enrollments ?? []).map(
    (enrollment) => enrollment.course_id
  );

  // Get course details
  const { data: courses, error: courseError } =
    courseIds.length > 0
      ? await supabase
          .from("courses")
          .select(
            "id, title, description, duration_months, monthly_fee, total_fee"
          )
          .in("id", courseIds)
      : { data: [], error: null };

  if (courseError) {
    return (
      <>
        <main className="mc-error-page">
          <div className="mc-error-box">
            <span className="mc-eyebrow">VEYORA ACADEMY</span>
            <h1>Unable to load course details</h1>
            <p>{courseError.message}</p>
          </div>
        </main>

        <style>{`
          .mc-error-page {
            min-height: 100vh;
            background: #0A0C10;
            color: #F3F1EA;
            padding: 60px 24px;
          }

          .mc-error-box {
            max-width: 700px;
            margin: 0 auto;
            padding: 32px;
            border: 1px solid #262B35;
            border-radius: 24px;
            background: #12151C;
          }

          .mc-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .15em;
          }

          .mc-error-box h1 {
            margin: 12px 0;
            font-size: 34px;
            font-weight: 500;
          }

          .mc-error-box p {
            color: #8A909A;
            line-height: 1.7;
            overflow-wrap: anywhere;
          }
        `}</style>
      </>
    );
  }

  const courseMap = new Map(
    (courses ?? []).map((course) => [course.id, course])
  );

  const enrolledCourses = (enrollments ?? [])
    .map((enrollment) => ({
      ...enrollment,
      course: courseMap.get(enrollment.course_id),
    }))
    .filter((item) => item.course);

  const activeCount = enrolledCourses.filter(
    (item) => String(item.status).toLowerCase() === "active"
  ).length;

  function formatDate(dateString: string | null) {
    if (!dateString) return "—";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(value: number | string | null) {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
      return "PKR 0";
    }

    return `PKR ${amount.toLocaleString("en-PK")}`;
  }

  return (
    <>
      <main className="mc-page">
        <div className="mc-grid-bg" />
        <div className="mc-glow mc-glow-orange" />
        <div className="mc-glow mc-glow-blue" />

        <div className="mc-shell">

          {/* HEADER */}
          <header className="mc-header">
            <div>
              <span className="mc-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1 className="mc-main-title">
                My <span>Courses.</span>
              </h1>

              <p className="mc-subtitle">
                Your learning journey, progress, and active programs.
              </p>
            </div>

            <div className="mc-brand-orbit" aria-hidden="true">
              <div className="mc-orbit-ring mc-orbit-ring-one" />
              <div className="mc-orbit-ring mc-orbit-ring-two" />
              <div className="mc-orbit-core">V</div>
            </div>
          </header>

          {/* OVERVIEW */}
          <section className="mc-overview">
            <div className="mc-overview-card">
              <span>ENROLLED PROGRAMS</span>
              <strong>
                {String(enrolledCourses.length).padStart(2, "0")}
              </strong>
              <small>Your learning portfolio</small>
            </div>

            <div className="mc-overview-card">
              <span>ACTIVE PROGRAMS</span>
              <strong>
                {String(activeCount).padStart(2, "0")}
              </strong>
              <small>Currently in progress</small>
            </div>

            <div className="mc-overview-card mc-overview-highlight">
              <span>VEYORA LEARNING SPACE</span>
              <strong>01</strong>
              <small>Learn · Practice · Build</small>
            </div>
          </section>

          {/* SECTION TITLE */}
          <div className="mc-section-heading">
            <div>
              <span className="mc-section-eyebrow">YOUR PROGRAMS</span>

              <h2>
                Learning in <span>motion.</span>
              </h2>
            </div>

            <span className="mc-course-count">
              {enrolledCourses.length} COURSE
              {enrolledCourses.length === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY STATE */}
          {enrolledCourses.length === 0 ? (
            <section className="mc-empty">
              <div className="mc-empty-icon">＋</div>

              <span className="mc-section-eyebrow">
                YOUR NEXT CHAPTER
              </span>

              <h2>Your learning journey starts here.</h2>

              <p>
                Once you enroll in a program, your course details and
                progress will appear here.
              </p>

              <a href="/academy" className="mc-primary-btn">
                Explore Academy
                <span>↗</span>
              </a>
            </section>
          ) : (
            <section className="mc-course-list">
              {enrolledCourses.map((enrollment, index) => {
                const course = enrollment.course;

                if (!course) {
                  return null;
                }

                const progress = Math.min(
                  100,
                  Math.max(0, Number(enrollment.progress ?? 0))
                );

                const radius = 44;
                const circumference = 2 * Math.PI * radius;

                const progressOffset =
                  circumference - (progress / 100) * circumference;

                const isActive =
                  String(enrollment.status).toLowerCase() === "active";

                return (
                  <article
                    className="mc-course-card"
                    key={enrollment.id}
                  >
                    <div className="mc-card-light" />

                    {/* TOP ROW */}
                    <div className="mc-course-top">
                      <div className="mc-program-number">
                        <span>PROGRAM</span>
                        <strong>
                          {String(index + 1).padStart(2, "0")}
                        </strong>
                      </div>

                      <div
                        className={`mc-status ${
                          isActive ? "mc-status-active" : ""
                        }`}
                      >
                        <i />
                        {enrollment.status || "Enrolled"}
                      </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="mc-course-main">

                      <div className="mc-course-copy">
                        <span className="mc-course-label">
                          VEYORA ACADEMY / PROFESSIONAL PROGRAM
                        </span>

                        <h3>{course.title}</h3>

                        <p>
                          {course.description ||
                            "Your professional learning journey starts here."}
                        </p>
                      </div>

                      {/* PROGRESS RING */}
                      <div className="mc-progress-ring">
                        <div className="mc-progress-glow" />

                        <svg viewBox="0 0 112 112">
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            fill="none"
                            stroke="#292E38"
                            strokeWidth="5"
                          />

                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            fill="none"
                            stroke="#FF9B4D"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressOffset}
                            transform="rotate(-90 56 56)"
                            className="mc-progress-arc"
                          />
                        </svg>

                        <div className="mc-progress-center">
                          <strong>{progress}%</strong>
                          <span>COMPLETE</span>
                        </div>
                      </div>
                    </div>

                    {/* COURSE META */}
                    <div className="mc-course-meta">
                      <div>
                        <span>PROGRAM LENGTH</span>
                        <strong>
                          {course.duration_months ?? "—"} Months
                        </strong>
                      </div>

                      <div>
                        <span>ENROLLMENT DATE</span>
                        <strong>
                          {formatDate(enrollment.enrollment_date)}
                        </strong>
                      </div>

                      <div>
                        <span>MONTHLY FEE</span>
                        <strong>
                          {formatCurrency(course.monthly_fee)}
                        </strong>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mc-progress-section">
                      <div className="mc-progress-labels">
                        <span>YOUR LEARNING PROGRESS</span>
                        <strong>{progress}%</strong>
                      </div>

                      <div className="mc-progress-track">
                        <div
                          className="mc-progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mc-course-footer">
                      <div className="mc-learning-status">
                        <span className="mc-status-dot" />

                        <span>
                          {isActive
                            ? "Ready to continue"
                            : "Enrollment status"}
                        </span>
                      </div>

                      <a
                        href="/student/classes"
                        className="mc-continue-btn"
                      >
                        Continue Learning
                        <span>↗</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          {/* BOTTOM MESSAGE */}
          <section className="mc-bottom-banner">
            <div className="mc-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="mc-banner-content">
              <span className="mc-section-eyebrow">
                THE VEYORA APPROACH
              </span>

              <h2>
                Learn with purpose.
                <br />
                <span>Build with confidence.</span>
              </h2>

              <p>
                Your journey is more than completing a course.
                It is about creating something meaningful with what
                you learn.
              </p>
            </div>

            <a
              href="/student/profile"
              className="mc-profile-btn"
            >
              Your Profile
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .mc-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 5%,
              rgba(110,124,246,.10),
              transparent 32%
            ),
            radial-gradient(
              circle at 90% 25%,
              rgba(255,155,77,.07),
              transparent 30%
            ),
            #0A0C10;
          color: #F3F1EA;
          padding: 46px 24px 80px;
        }

        .mc-shell {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .mc-grid-bg {
          position: absolute;
          inset: 0;
          opacity: .22;
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
            transparent 85%
          );
        }

        .mc-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: .10;
          pointer-events: none;
        }

        .mc-glow-orange {
          right: -220px;
          top: 340px;
          background: #FF9B4D;
        }

        .mc-glow-blue {
          left: -240px;
          bottom: 100px;
          background: #6E7CF6;
        }

        .mc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .mc-eyebrow,
        .mc-section-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          line-height: 1;
          letter-spacing: .18em;
        }

        .mc-main-title {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .mc-main-title span {
          color: #FF9B4D;
        }

        .mc-subtitle {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        .mc-brand-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .mc-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.32);
          border-radius: 50%;
        }

        .mc-orbit-ring-one {
          inset: 0;
          animation: mcSpin 10s linear infinite;
        }

        .mc-orbit-ring-two {
          inset: 11px;
          border-color: rgba(110,124,246,.28);
          animation: mcSpinReverse 8s linear infinite;
        }

        .mc-orbit-core {
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
        }

        @keyframes mcSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes mcSpinReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .mc-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .mc-overview-card {
          min-height: 145px;
          padding: 22px;
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

        .mc-overview-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.35);
        }

        .mc-overview-card > span {
          color: #777D89;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .mc-overview-card strong {
          display: block;
          margin-top: 12px;
          font-size: 35px;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .mc-overview-card small {
          display: block;
          margin-top: 4px;
          color: #777D89;
          font-size: 11px;
        }

        .mc-overview-highlight {
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(255,155,77,.12),
              transparent 50%
            ),
            #11151C;
        }

        .mc-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 54px 0 23px;
        }

        .mc-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 38px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .mc-section-heading h2 span {
          color: #FF9B4D;
        }

        .mc-course-count {
          color: #777D89;
          font-size: 10px;
          letter-spacing: .14em;
        }

        .mc-course-list {
          display: grid;
          gap: 20px;
        }

        .mc-course-card {
          position: relative;
          overflow: hidden;
          padding: 30px;
          border: 1px solid #292E39;
          border-radius: 25px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              transparent 48%
            ),
            #11141B;
          box-shadow: 0 20px 55px rgba(0,0,0,.20);
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .mc-course-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.42);
          box-shadow:
            0 25px 70px rgba(0,0,0,.30),
            0 0 30px rgba(255,155,77,.035);
        }

        .mc-card-light {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(120px);
          opacity: .11;
          pointer-events: none;
        }

        .mc-course-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .mc-program-number {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mc-program-number span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .mc-program-number strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .mc-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #969BA5;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .mc-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .mc-status-active {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .mc-status-active i {
          background: #FF9B4D;
          box-shadow: 0 0 12px rgba(255,155,77,.65);
        }

        .mc-course-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 150px;
          align-items: center;
          gap: 35px;
          padding: 32px 0;
        }

        .mc-course-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .mc-course-copy h3 {
          max-width: 760px;
          margin: 13px 0 0;
          font-size: clamp(28px, 4.5vw, 44px);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .mc-course-copy p {
          max-width: 700px;
          margin: 14px 0 0;
          color: #878D98;
          font-size: 13px;
          line-height: 1.85;
        }

        .mc-progress-ring {
          position: relative;
          width: 140px;
          height: 140px;
          justify-self: end;
          display: grid;
          place-items: center;
        }

        .mc-progress-ring svg {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
        }

        .mc-progress-glow {
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(38px);
          opacity: .13;
        }

        .mc-progress-arc {
          filter: drop-shadow(
            0 0 5px rgba(255,155,77,.45)
          );
          transition: stroke-dashoffset 1s ease;
        }

        .mc-progress-center {
          position: absolute;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mc-progress-center strong {
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.05em;
        }

        .mc-progress-center span {
          margin-top: 4px;
          color: #777D89;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .mc-course-meta {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 20px 0;
          border-top: 1px solid #292E38;
          border-bottom: 1px solid #292E38;
        }

        .mc-course-meta div {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .mc-course-meta span {
          color: #707681;
          font-size: 9px;
          letter-spacing: .12em;
        }

        .mc-course-meta strong {
          color: #E5E2D9;
          font-size: 13px;
          font-weight: 500;
        }

        .mc-progress-section {
          position: relative;
          z-index: 2;
          margin-top: 22px;
        }

        .mc-progress-labels {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 10px;
        }

        .mc-progress-labels span {
          color: #777D89;
          font-size: 9px;
          letter-spacing: .12em;
        }

        .mc-progress-labels strong {
          color: #FF9B4D;
          font-size: 10px;
          font-weight: 500;
        }

        .mc-progress-track {
          width: 100%;
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #292E38;
        }

        .mc-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #FF9B4D,
            #F7C18F
          );
          box-shadow: 0 0 12px rgba(255,155,77,.35);
          transition: width 1s ease;
        }

        .mc-course-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 25px;
        }

        .mc-learning-status {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #858B96;
          font-size: 11px;
        }

        .mc-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow: 0 0 12px rgba(255,155,77,.55);
        }

        .mc-continue-btn,
        .mc-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 13px 20px;
          border: 1px solid #FF9B4D;
          border-radius: 999px;
          background: #FF9B4D;
          color: #0A0C10;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .mc-continue-btn:hover,
        .mc-primary-btn:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 30px rgba(255,155,77,.20);
        }

        .mc-continue-btn span,
        .mc-primary-btn span {
          font-size: 16px;
        }

        .mc-empty {
          padding: 70px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .mc-empty-icon {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
          border: 1px solid rgba(255,155,77,.55);
          border-radius: 50%;
          color: #FF9B4D;
          font-size: 26px;
        }

        .mc-empty h2 {
          margin: 14px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.035em;
        }

        .mc-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        .mc-primary-btn {
          margin-top: 25px;
        }

        .mc-bottom-banner {
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

        .mc-banner-content {
          position: relative;
          z-index: 2;
        }

        .mc-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .mc-banner-content h2 span {
          color: #FF9B4D;
        }

        .mc-banner-content p {
          max-width: 590px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .mc-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.22);
          border-radius: 50%;
        }

        .mc-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .mc-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .mc-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .mc-profile-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 12px 18px;
          border: 1px solid #353B47;
          border-radius: 999px;
          color: #E5E2D9;
          font-size: 12px;
          text-decoration: none;
          transition: border-color .2s ease;
        }

        .mc-profile-btn:hover {
          border-color: #FF9B4D;
        }

        .mc-profile-btn span {
          color: #FF9B4D;
          font-size: 16px;
        }

        @media (max-width: 780px) {
          .mc-page {
            padding: 30px 15px 55px;
          }

          .mc-header {
            align-items: flex-start;
          }

          .mc-brand-orbit {
            width: 64px;
            height: 64px;
          }

          .mc-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .mc-overview {
            grid-template-columns: 1fr;
          }

          .mc-overview-card {
            min-height: 112px;
          }

          .mc-course-card {
            padding: 21px;
          }

          .mc-course-main {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .mc-progress-ring {
            width: 120px;
            height: 120px;
            justify-self: start;
          }

          .mc-course-meta {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .mc-course-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .mc-continue-btn {
            width: 100%;
          }

          .mc-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .mc-profile-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mc-orbit-ring-one,
          .mc-orbit-ring-two {
            animation: none;
          }

          .mc-course-card,
          .mc-overview-card,
          .mc-continue-btn,
          .mc-primary-btn {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}