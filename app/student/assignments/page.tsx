import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AssignmentsPage() {
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
      "ENROLLMENT QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="va-error-page">
          <div className="va-error-box">
            <span className="va-eyebrow">VEYORA ACADEMY</span>

            <h1>Assignments Error</h1>

            <p>
              Something went wrong while loading your learning data.
            </p>

            <div className="va-error-details">
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            </div>
          </div>
        </main>

        <style>{`
          .va-error-page {
            min-height: 100vh;
            box-sizing: border-box;
            padding: 60px 24px;
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
            white-space: pre-wrap;
            word-break: break-word;
            color: #FFB4B4;
            font-size: 13px;
            line-height: 1.7;
          }
        `}</style>
      </>
    );
  }

  const courseIds = (enrollments ?? []).map(
    (enrollment) => enrollment.course_id
  );

  // ---------------------------------------------------------
  // NO ENROLLED COURSE
  // ---------------------------------------------------------
  if (courseIds.length === 0) {
    return (
      <>
        <main className="va-page">
          <div className="va-grid" />
          <div className="va-glow va-glow-orange" />
          <div className="va-glow va-glow-blue" />

          <div className="va-shell">
            <header className="va-header">
              <div>
                <span className="va-eyebrow">
                  VEYORA ACADEMY / LEARNING SPACE
                </span>

                <h1>
                  <span>Assignments.</span>
                </h1>

                <p>
                  Your practical work and instructor feedback will
                  appear here.
                </p>
              </div>
            </header>

            <section className="va-empty">
              <div className="va-empty-icon">+</div>

              <span>YOUR LEARNING JOURNEY</span>

              <h2>No enrolled courses yet.</h2>

              <p>
                Your assignments will appear here after you are enrolled
                in a Veyora Academy course.
              </p>

              <a href="/academy" className="va-primary-button">
                Explore Academy
                <span>↗</span>
              </a>
            </section>
          </div>
        </main>

        <style>{`
          .va-page {
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            padding: 46px 24px 80px;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .va-shell {
            position: relative;
            z-index: 3;
            max-width: 1180px;
            margin: 0 auto;
          }

          .va-grid {
            position: absolute;
            inset: 0;
            opacity: .2;
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
          }

          .va-glow {
            position: absolute;
            width: 380px;
            height: 380px;
            border-radius: 50%;
            filter: blur(125px);
            opacity: .09;
            pointer-events: none;
          }

          .va-glow-orange {
            top: 320px;
            right: -240px;
            background: #FF9B4D;
          }

          .va-glow-blue {
            bottom: 100px;
            left: -250px;
            background: #6E7CF6;
          }

          .va-header h1 {
            margin: 14px 0 0;
            font-size: clamp(45px, 7vw, 68px);
            line-height: .98;
            font-weight: 500;
            letter-spacing: -.055em;
          }

          .va-header h1 span {
            color: #FF9B4D;
          }

          .va-eyebrow {
            display: inline-block;
            color: #747B87;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .va-header p {
            margin: 15px 0 0;
            color: #858B96;
            font-size: 14px;
            line-height: 1.7;
          }

          .va-empty {
            margin-top: 42px;
            padding: 75px 25px;
            text-align: center;
            border: 1px solid #292E38;
            border-radius: 25px;
            background: #11141B;
          }

          .va-empty-icon {
            width: 62px;
            height: 62px;
            display: grid;
            place-items: center;
            margin: 0 auto 22px;
            border: 1px solid rgba(255,155,77,.35);
            border-radius: 50%;
            color: #FF9B4D;
            font-size: 27px;
          }

          .va-empty > span {
            color: #747B87;
            font-size: 9px;
            letter-spacing: .15em;
          }

          .va-empty h2 {
            margin: 13px 0 10px;
            font-size: 30px;
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

          .va-primary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            margin-top: 26px;
            padding: 13px 20px;
            border-radius: 999px;
            border: 1px solid #FF9B4D;
            background: #FF9B4D;
            color: #0A0C10;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
          }

          @media (max-width: 760px) {
            .va-page {
              padding: 30px 15px 55px;
            }
          }
        `}</style>
      </>
    );
  }

  // ---------------------------------------------------------
  // GET ASSIGNMENTS
  // ---------------------------------------------------------
  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select(
      "id, course_id, title, description, due_date, total_marks, status, created_at"
    )
    .in("course_id", courseIds)
    .order("due_date", { ascending: true });

  // ---------------------------------------------------------
  // GET COURSE NAMES
  // ---------------------------------------------------------
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .in("id", courseIds);

  // ---------------------------------------------------------
  // GET STUDENT SUBMISSIONS
  // ---------------------------------------------------------
  const assignmentIds = (assignments ?? []).map(
    (assignment) => assignment.id
  );

  const { data: submissions } =
    assignmentIds.length > 0
      ? await supabase
          .from("assignment_submissions")
          .select(
            "id, assignment_id, submission_text, submitted_at, status, marks, feedback"
          )
          .in("assignment_id", assignmentIds)
          .eq("student_id", userId)
      : { data: [] };

  const courseMap = new Map(
    (courses ?? []).map((course) => [course.id, course.title])
  );

  const submissionMap = new Map(
    (submissions ?? []).map((submission) => [
      submission.assignment_id,
      submission,
    ])
  );

  // ---------------------------------------------------------
  // SUBMIT / UPDATE ASSIGNMENT
  // ---------------------------------------------------------
  async function submitAssignment(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getClaims();

    if (!authData?.claims?.sub) {
      redirect("/login");
    }

    const studentId = authData.claims.sub;

    const assignmentId = Number(
      formData.get("assignment_id")
    );

    const submissionText = String(
      formData.get("submission_text") ?? ""
    ).trim();

    if (!assignmentId || !submissionText) {
      return;
    }

    const { error } = await supabase
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: assignmentId,
          student_id: studentId,
          submission_text: submissionText,
          submitted_at: new Date().toISOString(),
          status: "submitted",
        },
        {
          onConflict: "assignment_id,student_id",
        }
      );

    if (error) {
      console.error(
        "ASSIGNMENT SUBMISSION ERROR:",
        JSON.stringify(error, null, 2)
      );

      return;
    }

    revalidatePath("/student/assignments");
  }

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------
  function formatDate(dateString: string | null) {
    if (!dateString) return "No deadline";

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

  function formatSubmittedDate(dateString: string | null) {
    if (!dateString) return null;

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const totalAssignments = assignments?.length ?? 0;

  const submittedCount =
    assignments?.filter((assignment) =>
      submissionMap.has(assignment.id)
    ).length ?? 0;

  const pendingCount = totalAssignments - submittedCount;

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------
  return (
    <>
      <main className="va-page">
        <div className="va-grid" />

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
                My <span>Assignments.</span>
              </h1>

              <p>
                Complete your practical work, submit your ideas,
                and track instructor feedback.
              </p>
            </div>

            <div className="va-orbit" aria-hidden="true">
              <div className="va-orbit-ring va-orbit-ring-one" />
              <div className="va-orbit-ring va-orbit-ring-two" />
              <div className="va-orbit-core">V</div>
            </div>
          </header>

          {/* STATS */}
          <section className="va-stats">
            <div className="va-stat-card">
              <span>TOTAL ASSIGNMENTS</span>
              <strong>{totalAssignments}</strong>
              <small>Your published coursework</small>
            </div>

            <div className="va-stat-card">
              <span>SUBMITTED</span>
              <strong>{submittedCount}</strong>
              <small>Work sent for review</small>
            </div>

            <div className="va-stat-card va-stat-highlight">
              <span>PENDING</span>
              <strong>{pendingCount}</strong>
              <small>Assignments still to submit</small>
            </div>
          </section>

          {/* ERROR */}
          {assignmentsError && (
            <section className="va-inline-error">
              <div>
                <span>DATA ERROR</span>
                <strong>
                  Assignments could not be loaded.
                </strong>
              </div>

              <pre>
                {JSON.stringify(assignmentsError, null, 2)}
              </pre>
            </section>
          )}

          {/* SECTION HEADER */}
          <div className="va-section-heading">
            <div>
              <span>YOUR COURSEWORK</span>

              <h2>
                Build. Submit. <em>Improve.</em>
              </h2>
            </div>

            <span className="va-count-label">
              {totalAssignments} ASSIGNMENT
              {totalAssignments === 1 ? "" : "S"}
            </span>
          </div>

          {/* NO ASSIGNMENTS */}
          {!assignmentsError &&
            (!assignments || assignments.length === 0) && (
              <section className="va-empty">
                <div className="va-empty-icon">
                  ✓
                </div>

                <span>YOUR COURSEWORK</span>

                <h2>No assignments yet.</h2>

                <p>
                  Your instructor has not published any assignments
                  for your enrolled course yet.
                </p>
              </section>
            )}

          {/* ASSIGNMENTS */}
          {!assignmentsError && (
            <div className="va-assignment-list">
              {(assignments ?? []).map((assignment, index) => {
                const submission = submissionMap.get(
                  assignment.id
                );

                const submitted = Boolean(submission);

                const marksAvailable =
                  submission?.marks !== null &&
                  submission?.marks !== undefined;

                const submittedDate =
                  formatSubmittedDate(
                    submission?.submitted_at ?? null
                  );

                return (
                  <article
                    className="va-assignment-card"
                    key={assignment.id}
                  >
                    <div className="va-card-glow" />

                    {/* TOP */}
                    <div className="va-assignment-top">
                      <div className="va-assignment-index">
                        <span>
                          ASSIGNMENT
                        </span>

                        <strong>
                          {String(index + 1).padStart(2, "0")}
                        </strong>
                      </div>

                      <div
                        className={`va-status ${
                          submitted
                            ? "va-status-submitted"
                            : "va-status-pending"
                        }`}
                      >
                        <i />
                        {submitted
                          ? "Submitted"
                          : "Pending"}
                      </div>
                    </div>

                    {/* MAIN */}
                    <div className="va-assignment-main">
                      <div className="va-assignment-copy">
                        <span className="va-course-label">
                          {courseMap.get(
                            assignment.course_id
                          ) ?? "Veyora Academy"}
                        </span>

                        <h3>
                          {assignment.title}
                        </h3>

                        {assignment.description && (
                          <p>
                            {assignment.description}
                          </p>
                        )}
                      </div>

                      <div className="va-assignment-mark">
                        <span>TOTAL MARKS</span>

                        <strong>
                          {assignment.total_marks ?? 100}
                        </strong>

                        <small>POINTS</small>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="va-info-grid">
                      <div className="va-info-item">
                        <span>DUE DATE</span>

                        <strong>
                          {formatDate(
                            assignment.due_date
                          )}
                        </strong>
                      </div>

                      <div className="va-info-item">
                        <span>SUBMISSION STATUS</span>

                        <strong>
                          {marksAvailable
                            ? `${submission?.marks} Marks`
                            : submitted
                              ? "Awaiting review"
                              : "Not submitted"}
                        </strong>
                      </div>

                      <div className="va-info-item">
                        <span>COURSE</span>

                        <strong>
                          {courseMap.get(
                            assignment.course_id
                          ) ?? "Veyora Academy"}
                        </strong>
                      </div>
                    </div>

                    {/* FEEDBACK */}
                    {submission?.feedback && (
                      <div className="va-feedback">
                        <div className="va-feedback-title">
                          <span>INSTRUCTOR FEEDBACK</span>
                          <small>REVIEW</small>
                        </div>

                        <p>
                          {submission.feedback}
                        </p>
                      </div>
                    )}

                    {/* SUBMISSION */}
                    <div className="va-submission">
                      <div className="va-submission-header">
                        <div>
                          <span>YOUR WORK</span>

                          <h4>
                            {submitted
                              ? "Update your submission"
                              : "Submit your assignment"}
                          </h4>
                        </div>

                        {submittedDate && (
                          <span className="va-submitted-date">
                            Submitted {submittedDate}
                          </span>
                        )}
                      </div>

                      <form action={submitAssignment}>
                        <input
                          type="hidden"
                          name="assignment_id"
                          value={assignment.id}
                        />

                        <label
                          htmlFor={`submission-${assignment.id}`}
                        >
                          Assignment Response
                        </label>

                        <textarea
                          id={`submission-${assignment.id}`}
                          name="submission_text"
                          defaultValue={
                            submission?.submission_text ??
                            ""
                          }
                          placeholder="Write your assignment response, workflow explanation, project details, or paste your work here..."
                          rows={7}
                          required
                        />

                        <div className="va-submit-row">
                          <p>
                            {submitted
                              ? "You can update your submission while review is pending."
                              : "Submit your completed work before the due date."}
                          </p>

                          <button type="submit">
                            {submitted
                              ? "Update Submission"
                              : "Submit Assignment"}

                            <span>↗</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
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
                Don't just complete the task.
                <br />
                <em>Build something meaningful.</em>
              </h2>

              <p>
                Every assignment is a chance to turn what you
                learn into practical work, stronger thinking,
                and real-world experience.
              </p>
            </div>

            <a
              href="/student/courses"
              className="va-courses-button"
            >
              My Courses
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

        .va-grid {
          position: absolute;
          inset: 0;
          opacity: .2;
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
            transparent 90%
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
          top: 330px;
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
          border: 1px solid rgba(255,155,77,.3);
          border-radius: 50%;
        }

        .va-orbit-ring-one {
          inset: 0;
          animation: va-spin 10s linear infinite;
        }

        .va-orbit-ring-two {
          inset: 11px;
          border-color: rgba(110,124,246,.3);
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

        /* STATS */

        .va-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .va-stat-card {
          min-height: 125px;
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

        .va-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.3);
        }

        .va-stat-card > span {
          display: block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .va-stat-card strong {
          display: block;
          margin-top: 12px;
          font-size: 34px;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .va-stat-card small {
          display: block;
          margin-top: 5px;
          color: #747B87;
          font-size: 10px;
        }

        .va-stat-highlight {
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(255,155,77,.12),
              transparent 50%
            ),
            #11151C;
        }

        /* ERROR */

        .va-inline-error {
          margin-top: 24px;
          padding: 22px;
          border: 1px solid #4A2727;
          border-radius: 18px;
          background: #12151C;
        }

        .va-inline-error > div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }

        .va-inline-error span {
          color: #FF9B4D;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .va-inline-error strong {
          color: #F0ECE3;
          font-size: 13px;
          font-weight: 500;
        }

        .va-inline-error pre {
          margin: 17px 0 0;
          padding: 15px;
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #262B35;
          background: #0A0C10;
          color: #FFB4B4;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-word;
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

        .va-count-label {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* ASSIGNMENTS */

        .va-assignment-list {
          display: grid;
          gap: 21px;
        }

        .va-assignment-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 27px;
          border: 1px solid #292E39;
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

        .va-assignment-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.38);
          box-shadow:
            0 27px 70px rgba(0,0,0,.3),
            0 0 30px rgba(255,155,77,.04);
        }

        .va-card-glow {
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

        .va-assignment-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .va-assignment-index {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .va-assignment-index span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .va-assignment-index strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .va-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 999px;
          border: 1px solid #343946;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .va-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .va-status-pending {
          color: #A0A4AC;
        }

        .va-status-submitted {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .va-status-submitted i {
          background: #FF9B4D;
          box-shadow: 0 0 12px rgba(255,155,77,.6);
        }

        /* MAIN ASSIGNMENT */

        .va-assignment-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 145px;
          align-items: center;
          gap: 30px;
          padding: 30px 0;
        }

        .va-course-label {
          color: #6E7CF6;
          font-size: 10px;
          letter-spacing: .13em;
        }

        .va-assignment-copy h3 {
          max-width: 800px;
          margin: 12px 0 0;
          font-size: clamp(27px, 4vw, 42px);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .va-assignment-copy p {
          max-width: 760px;
          margin: 14px 0 0;
          color: #878D98;
          font-size: 13px;
          line-height: 1.85;
        }

        .va-assignment-mark {
          position: relative;
          width: 125px;
          height: 125px;
          justify-self: end;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border-radius: 50%;
          border: 1px solid rgba(255,155,77,.24);
          background:
            radial-gradient(
              circle,
              rgba(255,155,77,.08),
              rgba(255,155,77,.01) 70%
            );
          box-shadow:
            inset 0 0 25px rgba(255,155,77,.035);
        }

        .va-assignment-mark::before {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(110,124,246,.18);
          border-radius: 50%;
        }

        .va-assignment-mark span {
          position: relative;
          color: #747B87;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .va-assignment-mark strong {
          position: relative;
          margin-top: 6px;
          color: #F3F1EA;
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .va-assignment-mark small {
          position: relative;
          margin-top: 2px;
          color: #777D89;
          font-size: 8px;
          letter-spacing: .12em;
        }

        /* INFO */

        .va-info-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 20px 0;
          border-top: 1px solid #292E38;
          border-bottom: 1px solid #292E38;
        }

        .va-info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .va-info-item span {
          color: #707681;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .va-info-item strong {
          color: #E4E1D9;
          font-size: 12px;
          line-height: 1.5;
          font-weight: 500;
        }

        /* FEEDBACK */

        .va-feedback {
          position: relative;
          z-index: 2;
          margin-top: 20px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid #292E38;
          background:
            linear-gradient(
              135deg,
              rgba(110,124,246,.045),
              transparent 60%
            ),
            #0D1016;
        }

        .va-feedback-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .va-feedback-title span {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .va-feedback-title small {
          color: #707681;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .va-feedback p {
          margin: 10px 0 0;
          color: #D8D6CE;
          font-size: 13px;
          line-height: 1.7;
        }

        /* SUBMISSION */

        .va-submission {
          position: relative;
          z-index: 2;
          margin-top: 24px;
          padding: 22px;
          border: 1px solid #292E38;
          border-radius: 18px;
          background: #0D1016;
        }

        .va-submission-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 16px;
        }

        .va-submission-header > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .va-submission-header h4 {
          margin: 7px 0 0;
          color: #E8E4DB;
          font-size: 16px;
          font-weight: 500;
        }

        .va-submitted-date {
          color: #6E7CF6;
          font-size: 10px;
        }

        .va-submission label {
          display: block;
          margin-bottom: 9px;
          color: #B9B5AD;
          font-size: 11px;
        }

        .va-submission textarea {
          display: block;
          width: 100%;
          min-height: 150px;
          box-sizing: border-box;
          resize: vertical;
          border: 1px solid #292E38;
          border-radius: 14px;
          outline: none;
          background: #080A0E;
          color: #F3F1EA;
          padding: 16px;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.7;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .va-submission textarea::placeholder {
          color: #555B66;
        }

        .va-submission textarea:focus {
          border-color: rgba(255,155,77,.45);
          box-shadow:
            0 0 0 3px rgba(255,155,77,.055);
        }

        .va-submit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-top: 15px;
        }

        .va-submit-row p {
          margin: 0;
          color: #686F7A;
          font-size: 10px;
          line-height: 1.6;
        }

        .va-submit-row button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 13px 20px;
          border: 1px solid #FF9B4D;
          border-radius: 999px;
          background: #FF9B4D;
          color: #0A0C10;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .va-submit-row button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 30px rgba(255,155,77,.20);
        }

        .va-submit-row button span {
          font-size: 15px;
        }

        /* BOTTOM */

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

        .va-courses-button {
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

        .va-courses-button:hover {
          border-color: #FF9B4D;
        }

        .va-courses-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* MOBILE */

        @media (max-width: 820px) {
          .va-assignment-main {
            grid-template-columns: 1fr;
          }

          .va-assignment-mark {
            justify-self: start;
          }
        }

        @media (max-width: 760px) {
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
          }

          .va-orbit-core {
            font-size: 17px;
          }

          .va-stats {
            grid-template-columns: 1fr;
          }

          .va-stat-card {
            min-height: 105px;
          }

          .va-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .va-assignment-card {
            padding: 22px 20px 20px;
          }

          .va-assignment-top {
            align-items: flex-start;
          }

          .va-assignment-main {
            padding: 25px 0;
          }

          .va-info-grid {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .va-submission {
            padding: 18px;
          }

          .va-submission-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .va-submit-row {
            align-items: stretch;
            flex-direction: column;
          }

          .va-submit-row button {
            width: 100%;
          }

          .va-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .va-courses-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .va-orbit-ring-one,
          .va-orbit-ring-two {
            animation: none;
          }

          .va-stat-card,
          .va-assignment-card,
          .va-submit-row button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}