import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function SupportPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // ---------------------------------------------------------
  // GET SUPPORT REQUESTS
  // ---------------------------------------------------------
  const { data: requests, error } = await supabase
    .from("support_requests")
    .select(
      "id, subject, message, status, priority, admin_reply, replied_at, created_at, updated_at"
    )
    .eq("student_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      userId,
    };

    console.error(
      "SUPPORT QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vs-error-page">
          <div className="vs-error-box">
            <span className="vs-eyebrow">VEYORA ACADEMY</span>

            <h1>Support Error</h1>

            <p>
              Something went wrong while loading your support requests.
            </p>

            <div className="vs-error-details">
              <pre>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <style>{`
          .vs-error-page {
            min-height: 100vh;
            padding: 60px 24px;
            box-sizing: border-box;
            background: #0A0C10;
            color: #F3F1EA;
          }

          .vs-error-box {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            padding: 34px;
            box-sizing: border-box;
            border: 1px solid #3A2525;
            border-radius: 24px;
            background: #12151C;
          }

          .vs-eyebrow {
            color: #FF9B4D;
            font-size: 10px;
            letter-spacing: .18em;
          }

          .vs-error-box h1 {
            margin: 14px 0 8px;
            font-size: 36px;
            font-weight: 500;
          }

          .vs-error-box p {
            margin: 0 0 22px;
            color: #858B96;
            line-height: 1.7;
          }

          .vs-error-details {
            padding: 20px;
            overflow-x: auto;
            border: 1px solid #262B35;
            border-radius: 16px;
            background: #0A0C10;
          }

          .vs-error-details pre {
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
  // CREATE SUPPORT REQUEST
  // ---------------------------------------------------------
  async function createSupportRequest(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getClaims();

    if (!authData?.claims?.sub) {
      redirect("/login");
    }

    const studentId = authData.claims.sub;

    const subject = String(
      formData.get("subject") ?? ""
    ).trim();

    const message = String(
      formData.get("message") ?? ""
    ).trim();

    const priority = String(
      formData.get("priority") ?? "normal"
    ).trim();

    if (!subject || !message) {
      return;
    }

    const { error } = await supabase
      .from("support_requests")
      .insert({
        student_id: studentId,
        subject,
        message,
        priority:
          priority === "high" || priority === "low"
            ? priority
            : "normal",
        status: "open",
      });

    if (error) {
      console.error(
        "SUPPORT REQUEST ERROR:",
        JSON.stringify(error, null, 2)
      );

      return;
    }

    revalidatePath("/student/support");
  }

  // ---------------------------------------------------------
  // UPDATE SUPPORT REQUEST
  // ---------------------------------------------------------
  async function updateSupportRequest(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getClaims();

    if (!authData?.claims?.sub) {
      redirect("/login");
    }

    const studentId = authData.claims.sub;

    const requestId = Number(
      formData.get("request_id")
    );

    const message = String(
      formData.get("message") ?? ""
    ).trim();

    if (!requestId || !message) {
      return;
    }

    const { error } = await supabase
      .from("support_requests")
      .update({
        message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("student_id", studentId)
      .eq("status", "open");

    if (error) {
      console.error(
        "SUPPORT UPDATE ERROR:",
        JSON.stringify(error, null, 2)
      );

      return;
    }

    revalidatePath("/student/support");
  }

  const supportRequests = requests ?? [];

  const openCount = supportRequests.filter(
    (request) =>
      String(request.status).toLowerCase() === "open"
  ).length;

  const closedCount = supportRequests.filter(
    (request) =>
      String(request.status).toLowerCase() === "closed"
  ).length;

  const repliedCount = supportRequests.filter(
    (request) => Boolean(request.admin_reply)
  ).length;

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

  return (
    <>
      <main className="vs-page">
        <div className="vs-grid-bg" />

        <div className="vs-glow vs-glow-orange" />
        <div className="vs-glow vs-glow-blue" />

        <div className="vs-shell">

          {/* HEADER */}
          <header className="vs-header">
            <div>
              <span className="vs-eyebrow">
                VEYORA ACADEMY / STUDENT CARE
              </span>

              <h1>
                Student <span>Support.</span>
              </h1>

              <p>
                Need help? Send a request, follow the conversation,
                and stay connected with the Academy team.
              </p>
            </div>

            <div className="vs-orbit" aria-hidden="true">
              <div className="vs-orbit-ring vs-orbit-one" />
              <div className="vs-orbit-ring vs-orbit-two" />

              <div className="vs-orbit-core">
                V
              </div>
            </div>
          </header>

          {/* SUMMARY */}
          <section className="vs-stats">

            <div className="vs-stat-card">
              <div className="vs-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4 5h16v12H7l-3 3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
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
                <span>TOTAL REQUESTS</span>
                <strong>{supportRequests.length}</strong>
                <small>Support conversations</small>
              </div>
            </div>

            <div className="vs-stat-card">
              <div className="vs-stat-icon vs-blue">
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
                <span>OPEN</span>
                <strong>{openCount}</strong>
                <small>Requests in progress</small>
              </div>
            </div>

            <div className="vs-stat-card">
              <div className="vs-stat-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="m5 12 4 4L19 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <span>REPLIES</span>
                <strong>{repliedCount}</strong>
                <small>Requests with Academy replies</small>
              </div>
            </div>

            <div className="vs-stat-card vs-highlight">
              <div className="vs-stat-icon vs-blue">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 4h10v16H7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M10 8h4M10 12h4M10 16h2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <span>CLOSED</span>
                <strong>{closedCount}</strong>
                <small>Resolved conversations</small>
              </div>
            </div>
          </section>

          {/* NEW REQUEST */}
          <section className="vs-create-card">
            <div className="vs-card-glow" />

            <div className="vs-create-header">
              <div>
                <span className="vs-section-label">
                  GET HELP
                </span>

                <h2>
                  Tell us what you <em>need.</em>
                </h2>

                <p>
                  Submit a support request and the Academy team can
                  follow up through your portal.
                </p>
              </div>

              <div className="vs-help-mark">
                <div className="vs-help-circle">
                  ?
                </div>

                <span>SUPPORT</span>
              </div>
            </div>

            <form
              action={createSupportRequest}
              className="vs-create-form"
            >
              <div className="vs-form-grid">

                <div className="vs-field">
                  <label htmlFor="subject">
                    SUBJECT
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="e.g. Help with assignment"
                    required
                  />
                </div>

                <div className="vs-field">
                  <label htmlFor="priority">
                    PRIORITY
                  </label>

                  <select
                    id="priority"
                    name="priority"
                    defaultValue="normal"
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="normal">
                      Normal
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>
                </div>
              </div>

              <div className="vs-field">
                <label htmlFor="message">
                  MESSAGE
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Describe what you need help with..."
                  required
                />
              </div>

              <div className="vs-create-footer">
                <span>
                  Your request will be linked to your student account.
                </span>

                <button type="submit">
                  Send Request
                  <span>↗</span>
                </button>
              </div>
            </form>
          </section>

          {/* HISTORY HEADING */}
          <div className="vs-section-heading">
            <div>
              <span>YOUR REQUESTS</span>

              <h2>
                Support <em>history.</em>
              </h2>
            </div>

            <span className="vs-request-count">
              {supportRequests.length} REQUEST
              {supportRequests.length === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY */}
          {supportRequests.length === 0 ? (
            <section className="vs-empty">
              <div className="vs-empty-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4 5h16v12H7l-3 3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>YOUR SUPPORT SPACE</span>

              <h2>No support requests yet.</h2>

              <p>
                When you need help, create a request above and your
                support history will appear here.
              </p>
            </section>
          ) : (
            <section className="vs-request-list">
              {supportRequests.map(
                (request, index) => {
                  const status =
                    String(
                      request.status || "open"
                    ).toLowerCase();

                  const priority =
                    String(
                      request.priority || "normal"
                    ).toLowerCase();

                  const isOpen =
                    status === "open";

                  const isHigh =
                    priority === "high";

                  const hasReply =
                    Boolean(request.admin_reply);

                  return (
                    <article
                      className="vs-request-card"
                      key={request.id}
                    >
                      <div className="vs-request-glow" />

                      {/* REQUEST TOP */}
                      <div className="vs-request-top">
                        <div className="vs-request-number">
                          <span>REQUEST</span>

                          <strong>
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </strong>
                        </div>

                        <div className="vs-request-badges">
                          <span
                            className={`vs-status-badge ${
                              isOpen
                                ? "vs-status-open"
                                : "vs-status-closed"
                            }`}
                          >
                            <i />
                            {status.toUpperCase()}
                          </span>

                          <span
                            className={`vs-priority-badge ${
                              isHigh
                                ? "vs-priority-high"
                                : ""
                            }`}
                          >
                            {priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* REQUEST MAIN */}
                      <div className="vs-request-main">
                        <div className="vs-request-copy">
                          <span className="vs-request-label">
                            SUPPORT REQUEST #{request.id}
                          </span>

                          <h3>
                            {request.subject}
                          </h3>

                          <p>
                            {request.message}
                          </p>
                        </div>

                        <div className="vs-request-symbol">
                          <div>
                            <svg viewBox="0 0 24 24">
                              <path
                                d="M4 5h16v12H7l-3 3z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinejoin="round"
                              />

                              <path
                                d="M8 9h8M8 13h5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <small>SUPPORT</small>
                        </div>
                      </div>

                      {/* ADMIN REPLY */}
                      {hasReply && (
                        <div className="vs-admin-reply">
                          <div className="vs-reply-heading">
                            <div>
                              <span>
                                VEYORA ACADEMY
                              </span>

                              <strong>
                                Support Reply
                              </strong>
                            </div>

                            {request.replied_at && (
                              <small>
                                {formatDate(
                                  request.replied_at
                                )}
                              </small>
                            )}
                          </div>

                          <p>
                            {request.admin_reply}
                          </p>
                        </div>
                      )}

                      {/* UPDATE FORM FOR OPEN REQUEST */}
                      {isOpen && (
                        <div className="vs-update-box">
                          <div className="vs-update-header">
                            <div>
                              <span>
                                REQUEST UPDATE
                              </span>

                              <h4>
                                Add more information
                              </h4>
                            </div>

                            <small>
                              OPEN REQUEST
                            </small>
                          </div>

                          <form
                            action={
                              updateSupportRequest
                            }
                          >
                            <input
                              type="hidden"
                              name="request_id"
                              value={request.id}
                            />

                            <label
                              htmlFor={`message-${request.id}`}
                            >
                              MESSAGE
                            </label>

                            <textarea
                              id={`message-${request.id}`}
                              name="message"
                              defaultValue={
                                request.message
                              }
                              rows={5}
                              required
                            />

                            <div className="vs-update-footer">
                              <span>
                                You can update this request while it
                                remains open.
                              </span>

                              <button type="submit">
                                Update Request
                                <span>↗</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* FOOTER */}
                      <div className="vs-request-footer">
                        <div>
                          <span className="vs-footer-dot" />

                          <span>
                            {hasReply
                              ? "Academy response available."
                              : isOpen
                                ? "Your request is currently open."
                                : "This request has been closed."}
                          </span>
                        </div>

                        <span className="vs-created">
                          Created{" "}
                          {formatDate(
                            request.created_at
                          )}
                        </span>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          )}

          {/* BOTTOM */}
          <section className="vs-bottom-banner">
            <div className="vs-banner-orbit">
              <div />
              <div />
              <div />
            </div>

            <div className="vs-banner-content">
              <span>VEYORA ACADEMY / STUDENT CARE</span>

              <h2>
                Questions are part of
                <br />
                <em>the learning process.</em>
              </h2>

              <p>
                Ask when you need clarity. Good support keeps your
                learning journey moving forward.
              </p>
            </div>

            <a
              href="/student/classes"
              className="vs-classes-button"
            >
              View Classes
              <span>→</span>
            </a>
          </section>
        </div>
      </main>

      <style>{`
        .vs-page {
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

        .vs-shell {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .vs-grid-bg {
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

        .vs-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(125px);
          opacity: .09;
          pointer-events: none;
        }

        .vs-glow-orange {
          top: 350px;
          right: -250px;
          background: #FF9B4D;
        }

        .vs-glow-blue {
          bottom: 100px;
          left: -250px;
          background: #6E7CF6;
        }

        /* HEADER */

        .vs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 38px;
        }

        .vs-eyebrow {
          display: inline-block;
          color: #747B87;
          font-size: 10px;
          letter-spacing: .18em;
        }

        .vs-header h1 {
          margin: 14px 0 0;
          font-size: clamp(44px, 7vw, 68px);
          line-height: .98;
          font-weight: 500;
          letter-spacing: -.055em;
        }

        .vs-header h1 span {
          color: #FF9B4D;
        }

        .vs-header p {
          max-width: 700px;
          margin: 15px 0 0;
          color: #858B96;
          font-size: 14px;
          line-height: 1.7;
        }

        /* ORBIT */

        .vs-orbit {
          position: relative;
          width: 90px;
          height: 90px;
          flex: 0 0 auto;
        }

        .vs-orbit-ring {
          position: absolute;
          border: 1px solid rgba(255,155,77,.30);
          border-radius: 50%;
        }

        .vs-orbit-one {
          inset: 0;
          animation: vs-spin 10s linear infinite;
        }

        .vs-orbit-two {
          inset: 11px;
          border-color: rgba(110,124,246,.30);
          animation: vs-spin-reverse 8s linear infinite;
        }

        .vs-orbit-core {
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

        @keyframes vs-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vs-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* STATS */

        .vs-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .vs-stat-card {
          min-height: 135px;
          display: flex;
          align-items: center;
          gap: 16px;
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

        .vs-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.30);
        }

        .vs-stat-icon {
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

        .vs-stat-icon svg {
          width: 20px;
          height: 20px;
        }

        .vs-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        .vs-stat-card > div:last-child {
          min-width: 0;
        }

        .vs-stat-card span {
          display: block;
          color: #747B87;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vs-stat-card strong {
          display: block;
          margin-top: 7px;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -.03em;
        }

        .vs-stat-card small {
          display: block;
          margin-top: 3px;
          color: #717783;
          font-size: 10px;
          line-height: 1.45;
        }

        .vs-highlight {
          background:
            radial-gradient(
              circle at 92% 5%,
              rgba(255,155,77,.12),
              transparent 48%
            ),
            #11151C;
        }

        /* CREATE */

        .vs-create-card {
          position: relative;
          overflow: hidden;
          margin-top: 14px;
          padding: 30px;
          border: 1px solid #292E38;
          border-radius: 25px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              transparent 50%
            ),
            #11141B;
          box-shadow:
            0 20px 55px rgba(0,0,0,.20);
        }

        .vs-card-glow {
          position: absolute;
          top: -220px;
          right: 8%;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(125px);
          opacity: .08;
          pointer-events: none;
        }

        .vs-create-header {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .vs-section-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vs-create-header h2 {
          margin: 9px 0 0;
          font-size: clamp(27px, 4vw, 39px);
          line-height: 1.05;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vs-create-header h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vs-create-header p {
          max-width: 620px;
          margin: 12px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vs-help-mark {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 8px;
          flex: 0 0 auto;
        }

        .vs-help-circle {
          width: 63px;
          height: 63px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,155,77,.28);
          border-radius: 50%;
          color: #FF9B4D;
          background:
            radial-gradient(
              circle,
              rgba(255,155,77,.07),
              transparent 68%
            );
          font-family: Georgia, serif;
          font-size: 25px;
        }

        .vs-help-mark > span {
          color: #656B76;
          font-size: 7px;
          letter-spacing: .15em;
        }

        .vs-create-form {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 18px;
          margin-top: 28px;
        }

        .vs-form-grid {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 15px;
        }

        .vs-field {
          min-width: 0;
        }

        .vs-field label,
        .vs-update-box label {
          display: block;
          margin-bottom: 9px;
          color: #777D87;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .vs-field input,
        .vs-field select,
        .vs-field textarea,
        .vs-update-box textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #292E38;
          border-radius: 13px;
          outline: none;
          background: #090B0F;
          color: #F3F1EA;
          font-family: inherit;
          font-size: 13px;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .vs-field input,
        .vs-field select {
          height: 48px;
          padding: 0 15px;
        }

        .vs-field textarea {
          min-height: 150px;
          padding: 15px;
          line-height: 1.7;
          resize: vertical;
        }

        .vs-field input::placeholder,
        .vs-field textarea::placeholder {
          color: #555C66;
        }

        .vs-field input:focus,
        .vs-field select:focus,
        .vs-field textarea:focus,
        .vs-update-box textarea:focus {
          border-color: rgba(255,155,77,.45);
          box-shadow:
            0 0 0 3px rgba(255,155,77,.055);
        }

        .vs-create-footer,
        .vs-update-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .vs-create-footer > span,
        .vs-update-footer > span {
          color: #666D78;
          font-size: 9px;
          line-height: 1.6;
        }

        .vs-create-footer button,
        .vs-update-footer button {
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

        .vs-create-footer button:hover,
        .vs-update-footer button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 30px rgba(255,155,77,.20);
        }

        .vs-create-footer button span,
        .vs-update-footer button span {
          font-size: 15px;
        }

        /* SECTION */

        .vs-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin: 55px 0 23px;
        }

        .vs-section-heading > div > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vs-section-heading h2 {
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vs-section-heading h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vs-request-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* REQUEST LIST */

        .vs-request-list {
          display: grid;
          gap: 20px;
        }

        .vs-request-card {
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

        .vs-request-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.38);
          box-shadow:
            0 28px 72px rgba(0,0,0,.30),
            0 0 32px rgba(255,155,77,.04);
        }

        .vs-request-glow {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 310px;
          height: 310px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(120px);
          opacity: .08;
          pointer-events: none;
        }

        .vs-request-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vs-request-number {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vs-request-number span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vs-request-number strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .vs-request-badges {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .vs-status-badge,
        .vs-priority-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 8px;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .vs-status-badge {
          border: 1px solid #343946;
          color: #969BA5;
        }

        .vs-status-badge i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #747B87;
        }

        .vs-status-open {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .vs-status-open i {
          background: #FF9B4D;
          box-shadow:
            0 0 10px rgba(255,155,77,.58);
        }

        .vs-status-closed {
          color: #737A85;
        }

        .vs-priority-badge {
          border: 1px solid #343946;
          color: #777D87;
        }

        .vs-priority-high {
          color: #B7B9FF;
          border-color: rgba(110,124,246,.28);
        }

        /* REQUEST MAIN */

        .vs-request-main {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 130px;
          align-items: center;
          gap: 35px;
          padding: 30px 0;
        }

        .vs-request-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vs-request-copy h3 {
          max-width: 800px;
          margin: 12px 0 0;
          font-size: clamp(27px, 4vw, 40px);
          line-height: 1.12;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vs-request-copy p {
          max-width: 780px;
          margin: 14px 0 0;
          color: #D3D0C8;
          font-size: 13px;
          line-height: 1.85;
          white-space: pre-wrap;
        }

        .vs-request-symbol {
          justify-self: end;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 9px;
        }

        .vs-request-symbol > div {
          width: 91px;
          height: 91px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,155,77,.25);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,155,77,.07),
              transparent 68%
            );
        }

        .vs-request-symbol svg {
          width: 29px;
          height: 29px;
          color: #FF9B4D;
        }

        .vs-request-symbol small {
          color: #656C77;
          font-size: 8px;
          letter-spacing: .14em;
        }

        /* REPLY */

        .vs-admin-reply {
          position: relative;
          z-index: 2;
          padding: 19px;
          border: 1px solid rgba(110,124,246,.20);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(110,124,246,.07),
              transparent 45%
            ),
            #0D1016;
        }

        .vs-reply-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
        }

        .vs-reply-heading > div > span {
          display: block;
          color: #6E7CF6;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .vs-reply-heading strong {
          display: block;
          margin-top: 6px;
          color: #E2DED6;
          font-size: 13px;
          font-weight: 500;
        }

        .vs-reply-heading small {
          color: #676E79;
          font-size: 9px;
        }

        .vs-admin-reply p {
          margin: 11px 0 0;
          color: #D4D1C9;
          font-size: 12px;
          line-height: 1.75;
          white-space: pre-wrap;
        }

        /* UPDATE */

        .vs-update-box {
          position: relative;
          z-index: 2;
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #292E38;
          border-radius: 17px;
          background: #0D1016;
        }

        .vs-update-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 15px;
        }

        .vs-update-header span {
          color: #747B87;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .vs-update-header h4 {
          margin: 7px 0 0;
          color: #E2DED6;
          font-size: 15px;
          font-weight: 500;
        }

        .vs-update-header small {
          color: #FF9B4D;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .vs-update-box textarea {
          min-height: 130px;
          padding: 15px;
          line-height: 1.7;
          resize: vertical;
        }

        .vs-update-footer {
          margin-top: 12px;
        }

        .vs-update-footer button {
          padding: 11px 17px;
          border-color: #343946;
          background: transparent;
          color: #F3F1EA;
        }

        .vs-update-footer button:hover {
          border-color: #FF9B4D;
          box-shadow: none;
        }

        /* FOOTER */

        .vs-request-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
          margin-top: 20px;
          border-top: 1px solid #292E38;
        }

        .vs-request-footer > div {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #747B87;
          font-size: 9px;
        }

        .vs-footer-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow:
            0 0 9px rgba(255,155,77,.5);
        }

        .vs-created {
          color: #4D535E;
          font-size: 8px;
        }

        /* EMPTY */

        .vs-empty {
          padding: 72px 25px;
          text-align: center;
          border: 1px solid #292E38;
          border-radius: 24px;
          background: #11141B;
        }

        .vs-empty-icon {
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

        .vs-empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .vs-empty > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vs-empty h2 {
          margin: 13px 0 10px;
          font-size: 29px;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vs-empty p {
          max-width: 520px;
          margin: 0 auto;
          color: #858B96;
          font-size: 13px;
          line-height: 1.8;
        }

        /* BOTTOM */

        .vs-bottom-banner {
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

        .vs-banner-content {
          position: relative;
          z-index: 2;
        }

        .vs-banner-content > span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .16em;
        }

        .vs-banner-content h2 {
          margin: 12px 0 0;
          font-size: clamp(25px, 4vw, 38px);
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vs-banner-content h2 em {
          color: #FF9B4D;
          font-style: normal;
        }

        .vs-banner-content p {
          max-width: 630px;
          margin: 13px 0 0;
          color: #858B96;
          font-size: 12px;
          line-height: 1.8;
        }

        .vs-banner-orbit {
          position: absolute;
          left: -85px;
          top: -35px;
          width: 175px;
          height: 175px;
          border: 1px solid rgba(110,124,246,.20);
          border-radius: 50%;
        }

        .vs-banner-orbit div {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(255,155,77,.13);
          border-radius: 50%;
        }

        .vs-banner-orbit div:nth-child(2) {
          inset: 45px;
        }

        .vs-banner-orbit div:nth-child(3) {
          inset: 68px;
        }

        .vs-classes-button {
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

        .vs-classes-button:hover {
          border-color: #FF9B4D;
        }

        .vs-classes-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .vs-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 850px) {
          .vs-form-grid {
            grid-template-columns: 1fr;
          }

          .vs-request-main {
            grid-template-columns: 1fr;
          }

          .vs-request-symbol {
            justify-self: start;
          }
        }

        @media (max-width: 700px) {
          .vs-page {
            padding: 30px 15px 55px;
          }

          .vs-header {
            align-items: flex-start;
          }

          .vs-orbit {
            width: 64px;
            height: 64px;
          }

          .vs-orbit-core {
            inset: 18px;
            font-size: 17px;
          }

          .vs-stats {
            grid-template-columns: 1fr;
          }

          .vs-stat-card {
            min-height: 105px;
          }

          .vs-create-card {
            padding: 22px 20px;
          }

          .vs-create-header {
            align-items: flex-start;
          }

          .vs-help-mark {
            display: none;
          }

          .vs-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vs-request-card {
            padding: 22px 20px 20px;
          }

          .vs-request-top {
            align-items: flex-start;
          }

          .vs-request-badges {
            justify-content: flex-start;
          }

          .vs-request-main {
            padding: 25px 0;
          }

          .vs-create-footer,
          .vs-update-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .vs-create-footer button,
          .vs-update-footer button {
            width: 100%;
          }

          .vs-request-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .vs-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vs-classes-button {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vs-orbit-one,
          .vs-orbit-two {
            animation: none;
          }

          .vs-stat-card,
          .vs-request-card,
          .vs-create-footer button,
          .vs-update-footer button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}