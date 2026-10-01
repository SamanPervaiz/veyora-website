import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MaterialsPage() {
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
      "MATERIALS ENROLLMENT ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vm-error-page">
          <div className="vm-error-box">
            <span className="vm-eyebrow">VEYORA ACADEMY</span>

            <h1>Materials Error</h1>

            <p>
              Something went wrong while loading your course materials.
            </p>

            <div className="vm-error-details">
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            </div>
          </div>
        </main>

        <style>{`
          .vm-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vm-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vm-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vm-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vm-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vm-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vm-error-details pre {
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
  // NO ENROLLED COURSES
  // ---------------------------------------------------------
  if (courseIds.length === 0) {
    return (
      <>
        <main className="vm-page">
          <div className="vm-grid-bg" />
          <div className="vm-glow vm-glow-orange" />
          <div className="vm-glow vm-glow-blue" />

          <div className="vm-shell">
            <header className="vm-header">
              <div>
                <span className="vm-eyebrow">
                  VEYORA ACADEMY / LEARNING SPACE
                </span>

                <h1>
                  Course <span>Materials.</span>
                </h1>

                <p>
                  Your guides, notes, PDFs and learning resources in
                  one place.
                </p>
              </div>
            </header>

            <section className="vm-empty">
              <div className="vm-empty-icon">+</div>

              <span>YOUR LEARNING SPACE</span>

              <h2>No enrolled courses yet.</h2>

              <p>
                Your course materials will appear here after you
                enroll in a Veyora Academy program.
              </p>

              <a href="/academy" className="vm-primary-button">
                Explore Academy
                <span>↗</span>
              </a>
            </section>
          </div>
        </main>

        <style>{`
          .vm-page {
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

          .vm-shell {
            position: relative;
            z-index: 3;
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }

          .vm-grid-bg {
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

          .vm-glow {
            position: absolute;
            width: 380px;
            height: 380px;
            border-radius: 50%;
            filter: blur(125px);
            opacity: .09;
            pointer-events: none;
          }

          .vm-glow-orange {
            top: 320px;
            right: -240px;
            background: #FF9B4D;
          }

          .vm-glow-blue {
            bottom: 100px;
            left: -250px;
            background: #6E7CF6;
          }

          .vm-header h1 {
            margin: 14px 0 0;
            font-size: clamp(44px, 7vw, 68px);
            line-height: .98;
            font-weight: 500;
            letter-spacing: -.055em;
          }

          .vm-header h1 span {
            color: #FF9B4D;
          }

          .vm-eyebrow {
            display: inline-block;
            color: #747B87;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vm-header p {
            margin: 15px 0 0;
            color: #858B96;
            font-size: 14px;
            line-height: 1.7;
          }

          .vm-empty {
            margin-top: 42px;
            padding: 72px 25px;
            text-align: center;
            border: 1px solid #292E38;
            border-radius: 25px;
            background: #11141B;
          }

          .vm-empty-icon {
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

          .vm-empty > span {
            color: #747B87;
            font-size: 9px;
            letter-spacing: .15em;
          }

          .vm-empty h2 {
            margin: 13px 0 10px;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: -.04em;
          }

          .vm-empty p {
            max-width: 520px;
            margin: 0 auto;
            color: #858B96;
            font-size: 13px;
            line-height: 1.8;
          }

          .vm-primary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            margin-top: 26px;
            padding: 13px 20px;
            border: 1px solid #FF9B4D;
            border-radius: 999px;
            background: #FF9B4D;
            color: #0A0C10;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
          }

          @media (max-width: 760px) {
            .vm-page {
              padding: 30px 15px 55px;
            }
          }
        `}</style>
      </>
    );
  }

  // ---------------------------------------------------------
  // GET PUBLISHED MATERIALS
  // ---------------------------------------------------------
  const { data: materials, error: materialsError } = await supabase
    .from("materials")
    .select(
      "id, course_id, title, description, material_type, file_url, published, created_at"
    )
    .in("course_id", courseIds)
    .eq("published", true)
    .order("created_at", { ascending: false });

  // ---------------------------------------------------------
  // GET COURSE NAMES
  // ---------------------------------------------------------
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .in("id", courseIds);

  const courseMap = new Map(
    (courses ?? []).map((course) => [course.id, course.title])
  );

  const totalMaterials = materials?.length ?? 0;

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------
  return (
    <>
      <main className="vm-page">
        <div className="vm-grid-bg" />

        <div className="vm-glow vm-glow-orange" />
        <div className="vm-glow vm-glow-blue" />

        <div className="vm-shell">

          {/* HEADER */}
          <header className="vm-header">
            <div>
              <span className="vm-eyebrow">
                VEYORA ACADEMY / LEARNING SPACE
              </span>

              <h1>
                Course <span>Materials.</span>
              </h1>

              <p>
                Access your guides, notes, PDFs and learning resources.
              </p>
            </div>

            <div className="vm-orbit" aria-hidden="true">
              <div className="vm-orbit-ring vm-orbit-one" />
              <div className="vm-orbit-ring vm-orbit-two" />
              <div className="vm-orbit-core">V</div>
            </div>
          </header>

          {/* STATS */}
          <section className="vm-stats">
            <div className="vm-stat-card">
              <div className="vm-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
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
                <span>TOTAL MATERIALS</span>
                <strong>{totalMaterials}</strong>
                <small>Published resources</small>
              </div>
            </div>

            <div className="vm-stat-card">
              <div className="vm-stat-icon vm-blue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 5h16v14H4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 9h8M8 13h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>RESOURCE TYPE</span>
                <strong>PDF</strong>
                <small>Guides & learning files</small>
              </div>
            </div>

            <div className="vm-stat-card vm-highlight">
              <div className="vm-stat-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
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
                <span>YOUR LIBRARY</span>
                <strong>01</strong>
                <small>Learn · Read · Apply</small>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {materialsError && (
            <section className="vm-inline-error">
              <div className="vm-error-heading">
                <span>DATA ERROR</span>
                <strong>
                  Materials could not be loaded.
                </strong>
              </div>

              <pre>
                {JSON.stringify(materialsError, null, 2)}
              </pre>
            </section>
          )}

          {/* SECTION */}
          <div className="vm-section-heading">
            <div>
              <span>YOUR RESOURCES</span>

              <h2>
                Learn from the <em>source.</em>
              </h2>
            </div>

            <span className="vm-count">
              {totalMaterials} MATERIAL
              {totalMaterials === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY */}
          {!materialsError &&
            (!materials || materials.length === 0) && (
              <section className="vm-empty">
                <div className="vm-empty-icon">
                  ✓
                </div>

                <span>YOUR RESOURCE LIBRARY</span>

                <h2>No materials yet.</h2>

                <p>
                  Your instructor has not published any learning
                  materials for your enrolled course yet.
                </p>
              </section>
            )}

          {/* MATERIAL CARDS */}
          {!materialsError && (
            <section className="vm-material-list">
              {(materials ?? []).map((material, index) => (
                <article
                  className="vm-material-card"
                  key={material.id}
                >
                  <div className="vm-card-glow" />

                  {/* TOP */}
                  <div className="vm-material-top">
                    <div className="vm-material-index">
                      <span>MATERIAL</span>

                      <strong>
                        {String(index + 1).padStart(2, "0")}
                      </strong>
                    </div>

                    <div className="vm-type-badge">
                      <span className="vm-type-dot" />
                      {material.material_type || "Learning Material"}
                    </div>
                  </div>

                  {/* MAIN */}
                  <div className="vm-material-main">
                    <div className="vm-material-copy">
                      <span className="vm-course-label">
                        {courseMap.get(material.course_id) ??
                          "VEYORA ACADEMY"}
                      </span>

                      <h3>{material.title}</h3>

                      {material.description && (
                        <p>{material.description}</p>
                      )}
                    </div>

                    <div className="vm-document-icon">
                      <div className="vm-document-paper">
                        <span />
                        <span />
                        <span />
                      </div>

                      <small>RESOURCE</small>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="vm-material-footer">
                    <div className="vm-material-info">
                      <div>
                        <span>FORMAT</span>
                        <strong>
                          {material.material_type || "PDF"}
                        </strong>
                      </div>

                      <div>
                        <span>ACCESS</span>
                        <strong>Published</strong>
                      </div>
                    </div>

                    {material.file_url ? (
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vm-open-button"
                      >
                        Open Material
                        <span>↗</span>
                      </a>
                    ) : (
                      <span className="vm-file-pending">
                        File Pending
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* BOTTOM BANNER */}
          <section className="vm-bottom-banner">
            <div className="vm-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="vm-banner-content">
              <span>THE VEYORA APPROACH</span>

              <h2>
                Don't just read.
                <br />
                <em>Turn knowledge into action.</em>
              </h2>

              <p>
                Use your course resources to understand concepts,
                practice your skills, and build real projects.
              </p>
            </div>

            <a
              href="/student/courses"
              className="vm-courses-button"
            >
              My Courses
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .vm-page {
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

        .vm-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .vm-grid-bg {
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

        .vm-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .vm-glow-orange {
          top: 330px;
          right: -250px;
          background: #FF9B4D;
        }

        .vm-glow-blue {
          bottom: 80px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .vm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .vm-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .vm-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .vm-header h1 span {
          color: #FF9B4D;
        }

        .vm-header p {
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .vm-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .vm-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .vm-orbit-one {
          inset: 0;
          animation: vm-spin 10s linear infinite;
        }

        .vm-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: vm-spin-reverse 8s linear infinite;
        }

        .vm-orbit-core {
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

        @keyframes vm-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vm-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* STATS */

        .vm-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .vm-stat-card {
          min-height: 125px;
          display: flex;
          align-items: center;
          gap: 17px;
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

        .vm-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.3);
        }

        .vm-stat-icon {
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

        .vm-stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .vm-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .vm-stat-card > div:last-child {
          min-width: 0;
        }

        .vm-stat-card span {
          display: block;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vm-stat-card strong {
          display: block;
          margin-top: 6px;
          font-size: 23px;
          font-weight: 500;
          letter-spacing: -.03em;
        }

        .vm-stat-card small {
          display: block;
          margin-top: 3px;
          color: #717783;
          font-size: 10px;
        }

        .vm-highlight {
          background:
            radial-gradient(
              circle at 92% 5%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        /* ERROR */

        .vm-inline-error {
          margin-top: 24px;
          padding: 22px;
          border: 1px solid #4A2727;
          border-radius: 18px;
          background: #12151C;
        }

        .vm-error-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .vm-error-heading span {
          color: #FF9B4D;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .vm-error-heading strong {
          font-size: 13px;
          font-weight: 500;
        }

        .vm-inline-error pre {
          margin: 17px 0 0;
          padding: 15px;
          overflow-x: auto;
          border: 1px solid #262B35;
          border-radius: 12px;
          background: #0A0C10;
          color: #FFB4B4;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* SECTION */

        .vm-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .vm-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vm-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vm-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vm-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* MATERIALS */

        .vm-material-list {
          display: grid;
          gap: 20px;
        }

        .vm-material-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 23px;
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

        .vm-material-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.38);
          box-shadow:
            0 27px 70px rgba(0,0,0,.3),
            0 0 32px rgba(255,155,77,.04);
        }

        .vm-card-glow {
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

        .vm-material-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vm-material-index {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vm-material-index span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vm-material-index strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .vm-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #969BA5;
          font-size: 9px;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .vm-type-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6E7CF6;
          box-shadow: 0 0 9px rgba(110,124,246,.5);
        }

        .vm-material-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 130px;
          align-items: center;
          gap: 35px;
          padding: 30px 0;
        }

        .vm-course-label {
          color: #6E7CF6;
          font-size: 10px;
          letter-spacing: .13em;
        }

        .vm-material-copy h3 {
          max-width: 800px;
          margin: 12px 0 0;
          font-size: clamp(27px, 4vw, 42px);
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vm-material-copy p {
          max-width: 760px;
          margin: 14px 0 0;
          color: #878D98;
          font-size: 13px;
          line-height: 1.85;
        }

        /* DOCUMENT VISUAL */

        .vm-document-icon {
          position: relative;
          width: 115px;
          height: 135px;
          justify-self: end;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
        }

        .vm-document-paper {
          position: relative;
          width: 67px;
          height: 82px;
          border: 1px solid rgba(255,155,77,.38);
          border-radius: 7px;
          background:
            linear-gradient(
              145deg,
              rgba(255,155,77,.09),
              rgba(110,124,246,.04)
            ),
            #0D1016;
          box-shadow:
            0 0 30px rgba(255,155,77,.07);
          transform: rotate(-5deg);
        }

        .vm-document-paper::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          border-left: 1px solid rgba(255,155,77,.30);
          border-bottom: 1px solid rgba(255,155,77,.30);
          background: #141821;
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }

        .vm-document-paper span {
          position: absolute;
          left: 13px;
          height: 2px;
          border-radius: 99px;
          background: #454B57;
        }

        .vm-document-paper span:nth-child(1) {
          top: 31px;
          width: 38px;
        }

        .vm-document-paper span:nth-child(2) {
          top: 41px;
          width: 43px;
        }

        .vm-document-paper span:nth-child(3) {
          top: 51px;
          width: 30px;
        }

        .vm-document-icon small {
          color: #676E79;
          font-size: 8px;
          letter-spacing: .15em;
        }

        /* FOOTER */

        .vm-material-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid #292E38;
        }

        .vm-material-info {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .vm-material-info div {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .vm-material-info span {
          color: #707681;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vm-material-info strong {
          color: #E3E0D8;
          font-size: 12px;
          font-weight: 500;
        }

        .vm-open-button,
        .vm-courses-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 13px 20px;
          border-radius: 999px;
          text-decoration: none;
        }

        .vm-open-button {
          border: 1px solid #FF9B4D;
          background: #FF9B4D;
          color: #0A0C10;
          font-size: 11px;
          font-weight: 600;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .vm-open-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 30px rgba(255,155,77,.20);
        }

        .vm-open-button span {
          font-size: 15px;
        }

        .vm-file-pending {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 17px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #8B909A;
          font-size: 10px;
        }

        /* EMPTY */

        .vm-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .vm-empty-icon {
          width: 63px;
          height: 63px;
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
          border: 1px solid rgba(255,155,77,.35);
          border-radius: 50%;
          color: #FF9B4D;
          font-size: 25px;
        }

        .vm-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vm-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vm-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        /* BOTTOM */

        .vm-bottom-banner {
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

        .vm-banner-content {
          position: relative;
          z-index: 2;
        }

        .vm-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .vm-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vm-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vm-banner-content p {
          max-width: 620px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vm-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.20);
          border-radius: 50%;
        }

        .vm-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .vm-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .vm-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .vm-courses-button {
          position: relative;
          z-index: 2;
          flex: 0 0 auto;
          border: 1px solid #353B47;
          color: #E5E2D9;
          font-size: 11px;
          transition: border-color .2s ease;
        }

        .vm-courses-button:hover {
          border-color: #FF9B4D;
        }

        .vm-courses-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {
          .vm-material-main {
            grid-template-columns: 1fr;
          }

          .vm-document-icon {
            justify-self: start;
          }
        }

        @media (max-width: 760px) {
          .vm-page {
            padding: 30px 15px 55px;
          }

          .vm-header {
            align-items: flex-start;
          }

          .vm-orbit {
            width: 64px;
            height: 64px;
          }

          .vm-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .vm-stats {
            grid-template-columns: 1fr;
          }

          .vm-stat-card {
            min-height: 105px;
          }

          .vm-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vm-material-card {
            padding: 22px 20px 20px;
          }

          .vm-material-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .vm-material-main {
            padding: 25px 0;
          }

          .vm-material-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .vm-material-info {
            gap: 20px;
          }

          .vm-open-button,
          .vm-file-pending {
            width: 100%;
            box-sizing: border-box;
          }

          .vm-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vm-courses-button {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vm-orbit-one,
          .vm-orbit-two {
            animation: none;
          }

          .vm-stat-card,
          .vm-material-card,
          .vm-open-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}