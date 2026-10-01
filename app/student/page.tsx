import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // =========================================================
  // STUDENT
  // =========================================================
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select(
      "id, full_name, email, phone, course, enrollment_date, status, avatar_url"
    )
    .eq("id", userId)
    .single();

  if (studentError) {
    return <ErrorState title="Dashboard Error" error={studentError} />;
  }

  // =========================================================
  // ENROLLMENTS
  // =========================================================
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select(
      "id, course_id, enrollment_date, status, progress, created_at"
    )
    .eq("student_id", userId)
    .order("created_at", { ascending: false });

  if (enrollmentError) {
    return <ErrorState title="Enrollment Error" error={enrollmentError} />;
  }

  const courseIds = (enrollments ?? []).map(
    (enrollment) => enrollment.course_id
  );

  // =========================================================
  // COURSES
  // =========================================================
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
    return <ErrorState title="Course Error" error={coursesError} />;
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

  const activeEnrollment =
    enrolledCourses.find((item) => item.status === "active") ??
    enrolledCourses[0];

  const activeCourse = activeEnrollment?.course;

  const progress = Math.min(
    100,
    Math.max(0, activeEnrollment?.progress ?? 0)
  );

  // =========================================================
  // CLASSES
  // =========================================================
  const { data: classes } =
    courseIds.length > 0
      ? await supabase
          .from("classes")
          .select(
            "id, course_id, title, description, class_date, start_time, end_time, instructor, meeting_link, status"
          )
          .in("course_id", courseIds)
          .order("class_date", { ascending: true })
          .order("start_time", { ascending: true })
      : { data: [] };

  const allClasses = classes ?? [];

  const upcomingClasses = allClasses.filter(
    (item) => item.status?.toLowerCase() !== "completed"
  );

  const nextClass = upcomingClasses[0];

  // =========================================================
  // ATTENDANCE
  // =========================================================
  const { data: attendance } = await supabase
    .from("attendance")
    .select("id, class_id, attendance_date, status")
    .eq("student_id", userId);

  const attendanceRecords = attendance ?? [];

  const completedClasses = attendanceRecords.filter(
    (item) =>
      item.status?.toLowerCase() === "present" ||
      item.status?.toLowerCase() === "late"
  ).length;

  const attendancePercentage =
    attendanceRecords.length > 0
      ? Math.round(
          (completedClasses / attendanceRecords.length) * 100
        )
      : 0;

  // =========================================================
  // ASSIGNMENTS
  // =========================================================
  const { data: assignments } =
    courseIds.length > 0
      ? await supabase
          .from("assignments")
          .select("id, course_id, title, due_date, status")
          .in("course_id", courseIds)
          .order("due_date", { ascending: true })
      : { data: [] };

  const assignmentList = assignments ?? [];

  const assignmentIds = assignmentList.map(
    (assignment) => assignment.id
  );

  const { data: submissions } =
    assignmentIds.length > 0
      ? await supabase
          .from("assignment_submissions")
          .select("assignment_id, status, submitted_at")
          .in("assignment_id", assignmentIds)
          .eq("student_id", userId)
      : { data: [] };

  const submissionMap = new Map(
    (submissions ?? []).map((submission) => [
      submission.assignment_id,
      submission,
    ])
  );

  const pendingAssignments = assignmentList.filter(
    (assignment) => !submissionMap.has(assignment.id)
  ).length;

  const recentAssignments = assignmentList.slice(0, 3);

  // =========================================================
  // HELPERS
  // =========================================================
  function formatDate(dateString?: string | null) {
    if (!dateString) return "—";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(timeString?: string | null) {
    if (!timeString) return "—";

    const parts = timeString.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const firstName = student.full_name.split(" ")[0];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (progress / 100) * circumference;

  return (
    <>
      <main className="dashboard">
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />

        <div className="dashboardShell">

          {/* =================================================
              TOP BAR
          ================================================= */}
          <header className="topBar">
            <div>
              <p className="eyebrow">
                VEYORA ACADEMY / STUDENT SPACE
              </p>

              <h1 className="greeting">
                Good evening, <span>{firstName}.</span>
              </h1>

              <p className="subGreeting">
                Your learning journey is in motion.
              </p>
            </div>

            <div className="profileOrb">
              <div className="profileGlow" />

              <div className="profileInner">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.full_name}
                    className="dashboardAvatarImage"
                  />
                ) : (
                  firstName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </header>

          {/* =================================================
              HERO
          ================================================= */}
          <section className="heroGrid">

            {/* LEARNING ORBIT */}
            <div className="orbitCard glassCard">
              <div className="gridTexture" />

              <div className="cardTop">
                <div>
                  <p className="cardLabel">
                    YOUR LEARNING JOURNEY
                  </p>

                  <span className="liveStatus">
                    <span className="pulseDot" />
                    ACTIVE
                  </span>
                </div>

                <div className="miniNumber">
                  01
                </div>
              </div>

              <div className="orbitContent">

                <div className="progressOrbit">
                  <div className="orbitGlow" />

                  <svg
                    className="progressRing"
                    viewBox="0 0 160 160"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#262B35"
                      strokeWidth="7"
                    />

                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#FF9B4D"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      transform="rotate(-90 80 80)"
                      className="progressStroke"
                    />
                  </svg>

                  <div className="progressCenter">
                    <strong>{progress}%</strong>
                    <span>PROGRESS</span>
                  </div>
                </div>

                <div className="courseHeroText">
                  <p className="courseKicker">
                    CURRENT COURSE
                  </p>

                  <h2>
                    {activeCourse?.title ||
                      "No course assigned"}
                  </h2>

                  <p>
                    {activeCourse?.description ||
                      "Your enrolled course information will appear here."}
                  </p>

                  <div className="courseMeta">

                    <div>
                      <span>DURATION</span>
                      <strong>
                        {activeCourse?.duration_months || 6} Months
                      </strong>
                    </div>

                    <div>
                      <span>MONTHLY</span>
                      <strong>
                        PKR{" "}
                        {Number(
                          activeCourse?.monthly_fee || 0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>ENROLLED</span>
                      <strong>
                        {formatDate(
                          activeEnrollment?.enrollment_date
                        )}
                      </strong>
                    </div>

                  </div>

                  <a
                    href="/student/courses"
                    className="primaryButton"
                  >
                    <span>Enter Learning Space</span>
                    <span className="arrow">↗</span>
                  </a>
                </div>
              </div>

              <div className="orbitLines">
                <span />
                <span />
                <span />
              </div>
            </div>

            {/* NEXT CLASS */}
            <div className="nextClassCard glassCard">

              <div className="cardTop">
                <div>
                  <p className="cardLabel">
                    NEXT CLASS
                  </p>

                  <span className="liveStatus orange">
                    <span className="pulseDot" />
                    UPCOMING
                  </span>
                </div>

                <div className="miniNumber">
                  02
                </div>
              </div>

              {nextClass ? (
                <>
                  <div className="dateBlock">

                    <span className="dateMonth">
                      {new Date(
                        `${nextClass.class_date}T00:00:00`
                      ).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>

                    <strong className="dateDay">
                      {new Date(
                        `${nextClass.class_date}T00:00:00`
                      ).getDate()}
                    </strong>

                    <span className="dateYear">
                      {new Date(
                        `${nextClass.class_date}T00:00:00`
                      ).getFullYear()}
                    </span>

                  </div>

                  <div className="classInfo">
                    <h2>{nextClass.title}</h2>

                    <p className="classTime">
                      {formatTime(nextClass.start_time)}
                      <span>—</span>
                      {formatTime(nextClass.end_time)}
                    </p>

                    <p className="instructor">
                      With{" "}
                      {nextClass.instructor ||
                        "Veyora Academy"}
                    </p>
                  </div>

                  {nextClass.meeting_link ? (
                    <a
                      href={nextClass.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondaryButton"
                    >
                      <span>Join Class</span>
                      <span>→</span>
                    </a>
                  ) : (
                    <div className="pendingButton">
                      Meeting link will appear here
                    </div>
                  )}

                  <a
                    href="/student/classes"
                    className="textLink"
                  >
                    View all classes →
                  </a>
                </>
              ) : (
                <div className="emptyClass">
                  <div className="emptyIcon">＋</div>

                  <h2>
                    No class scheduled
                  </h2>

                  <p>
                    Your upcoming classes will appear here.
                  </p>
                </div>
              )}

              <div className="cornerGlow" />
            </div>

          </section>

          {/* =================================================
              STATS
          ================================================= */}
          <section className="statsGrid">

            <div className="statCard glassCard">
              <div className="statIcon">↗</div>

              <div>
                <span className="statLabel">
                  ATTENDANCE
                </span>

                <strong>
                  {attendancePercentage}%
                </strong>
              </div>

              <div className="statLine">
                <span
                  style={{
                    width: `${attendancePercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="statCard glassCard">
              <div className="statIcon">◎</div>

              <div>
                <span className="statLabel">
                  CLASSES ATTENDED
                </span>

                <strong>
                  {completedClasses}
                </strong>
              </div>

              <div className="statHint">
                Live participation
              </div>
            </div>

            <div className="statCard glassCard">
              <div className="statIcon">◇</div>

              <div>
                <span className="statLabel">
                  ASSIGNMENTS
                </span>

                <strong>
                  {pendingAssignments}
                </strong>
              </div>

              <div className="statHint">
                {pendingAssignments === 1
                  ? "1 pending"
                  : `${pendingAssignments} pending`}
              </div>
            </div>

            <div className="statCard glassCard">
              <div className="statIcon">✦</div>

              <div>
                <span className="statLabel">
                  COURSES
                </span>

                <strong>
                  {enrolledCourses.length}
                </strong>
              </div>

              <div className="statHint">
                Active learning
              </div>
            </div>

          </section>

          {/* =================================================
              ACTIVITY + QUICK ACCESS
          ================================================= */}
          <section className="lowerGrid">

            {/* ACTIVITY */}
            <div className="activityCard glassCard">

              <div className="sectionHeader">
                <div>
                  <p className="cardLabel">
                    RECENT ACTIVITY
                  </p>

                  <h2>
                    Your learning pulse
                  </h2>
                </div>

                <span className="activitySignal">
                  <span />
                  LIVE DATA
                </span>
              </div>

              <div className="activityList">

                {recentAssignments.length > 0 ? (
                  recentAssignments.map(
                    (assignment, index) => {
                      const submitted =
                        submissionMap.has(
                          assignment.id
                        );

                      return (
                        <div
                          className="activityItem"
                          key={assignment.id}
                        >
                          <div className="activityNumber">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="activityMain">
                            <h3>
                              {assignment.title}
                            </h3>

                            <p>
                              Due{" "}
                              {formatDate(
                                assignment.due_date
                              )}
                            </p>
                          </div>

                          <span
                            className={
                              submitted
                                ? "activityStatus submitted"
                                : "activityStatus pending"
                            }
                          >
                            {submitted
                              ? "SUBMITTED"
                              : "PENDING"}
                          </span>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="noActivity">

                    <div className="emptyIcon">
                      ＋
                    </div>

                    <h3>
                      No recent activity
                    </h3>

                    <p>
                      Your assignments and learning activity
                      will appear here.
                    </p>

                  </div>
                )}

              </div>

              <a
                href="/student/assignments"
                className="activityLink"
              >
                Open assignment space →
              </a>

            </div>

            {/* QUICK ACCESS */}
            <div className="quickCard glassCard">

              <div className="sectionHeader">
                <div>
                  <p className="cardLabel">
                    VEYORA SPACE
                  </p>

                  <h2>
                    Everything in one orbit
                  </h2>
                </div>
              </div>

              <div className="quickGrid">

                {[
                  ["/student/courses", "Courses", "01"],
                  ["/student/classes", "Classes", "02"],
                  ["/student/assignments", "Assignments", "03"],
                  ["/student/materials", "Materials", "04"],
                  ["/student/attendance", "Attendance", "05"],
                  ["/student/progress", "Progress", "06"],
                  ["/student/announcements", "Announcements", "07"],
                  ["/student/certificates", "Certificates", "08"],
                  ["/student/payments", "Payments", "09"],
                  ["/student/profile", "Profile", "10"],
                  ["/student/support", "Support", "11"],
                ].map(([href, label, number]) => (
                  <a
                    href={href}
                    key={href}
                    className="quickItem"
                  >
                    <span className="quickNumber">
                      {number}
                    </span>

                    <span className="quickLabel">
                      {label}
                    </span>

                    <span className="quickArrow">
                      ↗
                    </span>
                  </a>
                ))}

              </div>
            </div>

          </section>

          {/* =================================================
              CLOSING
          ================================================= */}
          <section className="closingPanel">

            <div className="closingOrb">
              <div />
            </div>

            <div>
              <p className="cardLabel">
                VEYORA / YOUR NEXT MOVE
              </p>

              <h2>
                Ideas become impact
                <span>.</span>
              </h2>
            </div>

            <a
              href="/student/profile"
              className="minimalButton"
            >
              <span>View Profile</span>
              <span>→</span>
            </a>

          </section>

        </div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(110,124,246,0.09),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 15%,
              rgba(255,155,77,0.08),
              transparent 30%
            ),
            #0A0C10;
          color: #F3F1EA;
          padding: 28px 24px 70px;
          position: relative;
          overflow: hidden;
        }

        .dashboard::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0,0,0,0.75),
            transparent 80%
          );
        }

        .ambient {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.14;
          animation: ambientFloat 10s ease-in-out infinite;
        }

        .ambientOne {
          top: 180px;
          right: -180px;
          background: #FF9B4D;
        }

        .ambientTwo {
          bottom: 80px;
          left: -220px;
          background: #6E7CF6;
          animation-delay: -4s;
        }

        @keyframes ambientFloat {
          0%, 100% {
            transform: translate3d(0,0,0);
          }

          50% {
            transform: translate3d(24px,-18px,0);
          }
        }

        .dashboardShell {
          width: min(1280px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .topBar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .eyebrow,
        .cardLabel,
        .statLabel {
          margin: 0;
          color: #6F737D;
          font-size: 10px;
          letter-spacing: 0.18em;
        }

        .greeting {
          margin: 10px 0 0;
          font-size: clamp(36px,5vw,64px);
          line-height: 0.98;
          font-weight: 500;
          letter-spacing: -0.045em;
        }

        .greeting span {
          color: #FF9B4D;
        }

        .subGreeting {
          margin: 14px 0 0;
          color: #8B8F98;
          font-size: 15px;
        }

        .profileOrb {
          position: relative;
          width: 64px;
          height: 64px;
          flex: 0 0 auto;
          border-radius: 50%;
          border: 1px solid #303540;
          display: grid;
          place-items: center;
          background: rgba(18,21,28,0.8);
        }

        .profileGlow {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent,
            #FF9B4D,
            transparent,
            #6E7CF6,
            transparent
          );
          filter: blur(10px);
          opacity: 0.48;
          animation: spinGlow 7s linear infinite;
        }

        @keyframes spinGlow {
          to {
            transform: rotate(360deg);
          }
        }

        .profileInner {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: #12151C;
          border: 1px solid #303540;
          color: #F3F1EA;
          font-size: 17px;
          position: relative;
          z-index: 2;
        }

        .dashboardAvatarImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .heroGrid {
          display: grid;
          grid-template-columns:
            minmax(0,1.65fr)
            minmax(330px,0.9fr);
          gap: 18px;
        }

        .glassCard {
          position: relative;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.035),
              rgba(255,255,255,0.012)
            ),
            #11141A;
          border: 1px solid #242934;
          border-radius: 28px;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.24),
            inset 0 1px rgba(255,255,255,0.025);
          overflow: hidden;
        }

        .glassCard::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              transparent 0%,
              transparent 42%,
              rgba(255,255,255,0.035) 50%,
              transparent 58%,
              transparent 100%
            );
          transform: translateX(-100%);
          transition: transform 0.8s ease;
        }

        .glassCard:hover::after {
          transform: translateX(100%);
        }

        .orbitCard {
          min-height: 470px;
          padding: 28px;
        }

        .gridTexture {
          position: absolute;
          inset: 0;
          opacity: 0.34;
          background-image:
            linear-gradient(
              rgba(110,124,246,0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(110,124,246,0.05) 1px,
              transparent 1px
            );
          background-size: 36px 36px;
          mask-image: radial-gradient(
            circle at 75% 50%,
            black,
            transparent 68%
          );
          pointer-events: none;
        }

        .cardTop,
        .sectionHeader {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .liveStatus {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 10px;
          color: #7F838C;
          font-size: 10px;
          letter-spacing: 0.13em;
        }

        .pulseDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FF9B4D;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255,155,77,0.55);
          }

          70% {
            box-shadow: 0 0 0 8px rgba(255,155,77,0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(255,155,77,0);
          }
        }

        .liveStatus.orange {
          color: #D8D6CE;
        }

        .miniNumber {
          color: #4D525C;
          font-size: 12px;
        }

        .orbitContent {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 250px minmax(0,1fr);
          align-items: center;
          gap: 26px;
          min-height: 365px;
        }

        .progressOrbit {
          position: relative;
          width: 230px;
          height: 230px;
          margin: 0 auto;
          display: grid;
          place-items: center;
        }

        .orbitGlow {
          position: absolute;
          inset: 24px;
          background: #FF9B4D;
          border-radius: 50%;
          filter: blur(58px);
          opacity: 0.13;
        }

        .progressRing {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        .progressStroke {
          filter: drop-shadow(
            0 0 6px rgba(255,155,77,0.6)
          );
          transition:
            stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1);
        }

        .progressCenter {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          text-align: center;
          z-index: 3;
        }

        .progressCenter strong {
          font-size: 52px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: -0.05em;
        }

        .progressCenter span {
          margin-top: 8px;
          color: #6F737D;
          font-size: 9px;
          letter-spacing: 0.18em;
        }

        .courseKicker {
          margin: 0;
          color: #6E7CF6;
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        .courseHeroText h2 {
          max-width: 570px;
          margin: 10px 0 0;
          font-size: clamp(30px,3.2vw,48px);
          line-height: 1.04;
          font-weight: 500;
          letter-spacing: -0.045em;
        }

        .courseHeroText > p:not(.courseKicker) {
          max-width: 600px;
          margin: 17px 0 0;
          color: #92969F;
          line-height: 1.7;
          font-size: 14px;
        }

        .courseMeta {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 15px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #252A33;
        }

        .courseMeta div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .courseMeta span {
          color: #5E636D;
          font-size: 9px;
          letter-spacing: 0.14em;
        }

        .courseMeta strong {
          color: #D8D6CE;
          font-size: 13px;
          font-weight: 500;
        }

        .primaryButton,
        .secondaryButton,
        .minimalButton {
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          text-decoration: none;
          color: #0A0C10;
          font-size: 13px;
          font-weight: 600;
          margin-top: 24px;
          padding: 14px 18px;
          border-radius: 999px;
          background: #FF9B4D;
          border: 1px solid #FF9B4D;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .minimalButton:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 26px rgba(255,155,77,0.15);
        }

        .arrow {
          font-size: 16px;
        }

        .orbitLines {
          position: absolute;
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: -130px;
          opacity: 0.18;
          pointer-events: none;
        }

        .orbitLines span {
          position: absolute;
          inset: 0;
          border: 1px solid #6E7CF6;
          border-radius: 50%;
        }

        .orbitLines span:nth-child(2) {
          inset: 30px;
          border-color: #FF9B4D;
        }

        .orbitLines span:nth-child(3) {
          inset: 60px;
        }

        .nextClassCard {
          min-height: 470px;
          padding: 28px;
        }

        .nextClassCard::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          top: 50px;
          right: -40px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(90px);
          opacity: 0.11;
        }

        .dateBlock {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: end;
          gap: 10px;
          margin-top: 58px;
        }

        .dateMonth,
        .dateYear {
          color: #666B74;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding-bottom: 7px;
        }

        .dateDay {
          font-size: 92px;
          font-weight: 500;
          line-height: 0.8;
          letter-spacing: -0.07em;
        }

        .classInfo {
          margin-top: 32px;
        }

        .classInfo h2 {
          margin: 0;
          max-width: 380px;
          font-size: 31px;
          line-height: 1.08;
          font-weight: 500;
          letter-spacing: -0.04em;
        }

        .classTime {
          margin: 17px 0 0;
          display: flex;
          gap: 10px;
          align-items: center;
          color: #FF9B4D;
          font-size: 15px;
        }

        .classTime span {
          color: #565B65;
        }

        .instructor {
          margin-top: 7px;
          color: #777C85;
          font-size: 13px;
        }

        .secondaryButton {
          width: 100%;
          color: #F3F1EA;
          background: transparent;
          border-color: #303540;
          margin-top: 26px;
        }

        .pendingButton {
          margin-top: 26px;
          width: 100%;
          padding: 13px 15px;
          border: 1px solid #2A2F39;
          border-radius: 999px;
          color: #777C85;
          font-size: 12px;
          text-align: center;
        }

        .textLink {
          position: relative;
          z-index: 3;
          display: inline-flex;
          margin-top: 18px;
          color: #92969F;
          font-size: 12px;
          text-decoration: none;
        }

        .textLink:hover,
        .activityLink:hover {
          color: #FF9B4D;
        }

        .cornerGlow {
          position: absolute;
          width: 150px;
          height: 150px;
          left: -80px;
          bottom: -80px;
          border-radius: 50%;
          background: #6E7CF6;
          filter: blur(70px);
          opacity: 0.08;
        }

        .emptyClass {
          margin-top: 95px;
          text-align: center;
          color: #777C85;
        }

        .emptyIcon {
          width: 45px;
          height: 45px;
          margin: 0 auto 15px;
          border: 1px solid #2E333D;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #FF9B4D;
          font-size: 20px;
        }

        .emptyClass h2,
        .noActivity h3 {
          color: #D8D6CE;
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }

        .emptyClass p,
        .noActivity p {
          margin-top: 8px;
          color: #70757F;
          font-size: 13px;
          line-height: 1.6;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .statCard {
          min-height: 142px;
          padding: 21px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 15px;
          align-items: start;
        }

        .statIcon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid #2B3039;
          display: grid;
          place-items: center;
          color: #FF9B4D;
        }

        .statCard strong {
          display: block;
          margin-top: 5px;
          font-size: 31px;
          font-weight: 500;
        }

        .statHint {
          grid-column: 2;
          margin-top: -6px;
          color: #696E78;
          font-size: 11px;
        }

        .statLine {
          grid-column: 1 / -1;
          height: 3px;
          margin-top: 3px;
          border-radius: 999px;
          background: #232832;
          overflow: hidden;
        }

        .statLine span {
          display: block;
          height: 100%;
          background: linear-gradient(
            90deg,
            #FF9B4D,
            #F5B176
          );
          border-radius: 999px;
        }

        .lowerGrid {
          display: grid;
          grid-template-columns:
            minmax(0,1fr)
            minmax(410px,0.95fr);
          gap: 18px;
          margin-top: 18px;
        }

        .activityCard,
        .quickCard {
          padding: 28px;
        }

        .sectionHeader h2 {
          margin: 8px 0 0;
          font-size: 24px;
          font-weight: 500;
        }

        .activitySignal {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #666B74;
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .activitySignal span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6E7CF6;
          box-shadow: 0 0 12px rgba(110,124,246,0.6);
        }

        .activityList {
          margin-top: 24px;
        }

        .activityItem {
          display: grid;
          grid-template-columns: 40px minmax(0,1fr) auto;
          gap: 15px;
          align-items: center;
          padding: 17px 0;
          border-top: 1px solid #242934;
        }

        .activityNumber {
          color: #545963;
          font-size: 10px;
        }

        .activityMain h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }

        .activityMain p {
          margin: 5px 0 0;
          color: #666B74;
          font-size: 11px;
        }

        .activityStatus {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid #292E37;
          font-size: 9px;
          letter-spacing: 0.09em;
        }

        .activityStatus.submitted {
          color: #FF9B4D;
        }

        .activityStatus.pending {
          color: #757A84;
        }

        .activityLink {
          display: inline-flex;
          margin-top: 9px;
          color: #90949D;
          font-size: 12px;
          text-decoration: none;
        }

        .noActivity {
          padding: 30px 10px;
          text-align: center;
        }

        .quickGrid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .quickItem {
          min-height: 68px;
          padding: 13px 14px;
          display: grid;
          grid-template-columns: 28px 1fr auto;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #D8D6CE;
          border: 1px solid #242934;
          border-radius: 15px;
          background: rgba(10,12,16,0.42);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .quickItem:hover {
          transform: translateY(-3px);
          border-color: rgba(255,155,77,0.45);
          background: rgba(255,155,77,0.035);
        }

        .quickNumber {
          color: #5F646E;
          font-size: 9px;
        }

        .quickLabel {
          font-size: 12px;
        }

        .quickArrow {
          color: #666B74;
          transition: transform 0.2s ease;
        }

        .quickItem:hover .quickArrow {
          transform: translate(2px,-2px);
          color: #FF9B4D;
        }

        .closingPanel {
          min-height: 150px;
          margin-top: 18px;
          padding: 26px 28px;
          border: 1px solid #242934;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 15% 50%,
              rgba(110,124,246,0.09),
              transparent 25%
            ),
            linear-gradient(
              120deg,
              rgba(255,255,255,0.025),
              rgba(255,255,255,0.01)
            ),
            #11141A;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .closingOrb {
          position: absolute;
          width: 180px;
          height: 180px;
          left: -65px;
          top: -15px;
          border: 1px solid rgba(110,124,246,0.18);
          border-radius: 50%;
        }

        .closingOrb::before,
        .closingOrb::after {
          content: "";
          position: absolute;
          inset: 25px;
          border: 1px solid rgba(255,155,77,0.11);
          border-radius: 50%;
        }

        .closingOrb::after {
          inset: 52px;
          border-color: rgba(110,124,246,0.16);
        }

        .closingPanel h2 {
          margin: 8px 0 0;
          font-size: clamp(25px,3vw,38px);
          font-weight: 500;
          letter-spacing: -0.045em;
        }

        .closingPanel h2 span {
          color: #FF9B4D;
        }

        .minimalButton {
          margin-top: 0;
          color: #D8D6CE;
          background: transparent;
          border-color: #303540;
          min-width: 150px;
        }

        @media (max-width:1080px) {
          .heroGrid,
          .lowerGrid {
            grid-template-columns: 1fr;
          }

          .statsGrid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .orbitContent {
            grid-template-columns: 220px minmax(0,1fr);
          }
        }

        @media (max-width:760px) {
          .dashboard {
            padding: 18px 14px 50px;
          }

          .topBar {
            align-items: flex-start;
          }

          .profileOrb {
            width: 54px;
            height: 54px;
          }

          .profileInner {
            width: 40px;
            height: 40px;
          }

          .orbitCard,
          .nextClassCard,
          .activityCard,
          .quickCard {
            padding: 21px;
          }

          .orbitCard,
          .nextClassCard {
            min-height: auto;
          }

          .orbitContent {
            grid-template-columns: 1fr;
            gap: 20px;
            padding-top: 22px;
          }

          .progressOrbit {
            width: 190px;
            height: 190px;
          }

          .courseMeta {
            grid-template-columns: 1fr;
          }

          .statsGrid {
            grid-template-columns: 1fr;
          }

          .quickGrid {
            grid-template-columns: 1fr;
          }

          .closingPanel {
            align-items: flex-start;
            flex-direction: column;
          }

          .minimalButton {
            margin-top: 4px;
          }
        }
      `}</style>
    </>
  );
}

function ErrorState({
  title,
  error,
}: {
  title: string;
  error: unknown;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0C10",
        color: "#F3F1EA",
        padding: "60px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#12151C",
          border: "1px solid #3A2727",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <p
          style={{
            color: "#FF9B4D",
            fontSize: "11px",
            letterSpacing: "0.16em",
          }}
        >
          VEYORA ACADEMY
        </p>

        <h1
          style={{
            marginTop: "10px",
            fontSize: "32px",
          }}
        >
          {title}
        </h1>

        <pre
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#0A0C10",
            border: "1px solid #292E37",
            borderRadius: "14px",
            color: "#FFB4B4",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    </main>
  );
}