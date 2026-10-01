import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  // ---------------------------------------------------------
  // GET STUDENT PAYMENTS
  // ---------------------------------------------------------
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select(
      `
        id,
        course_id,
        amount,
        payment_method,
        transaction_reference,
        payment_date,
        due_date,
        status,
        notes,
        created_at
      `
    )
    .eq("student_id", userId)
    .order("created_at", { ascending: false });

  if (paymentsError) {
    const errorDetails = {
      message: paymentsError.message,
      details: paymentsError.details,
      hint: paymentsError.hint,
      code: paymentsError.code,
      userId,
    };

    console.error(
      "PAYMENTS QUERY ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vp-error-page">
          <div className="vp-error-box">
            <span className="vp-eyebrow">VEYORA ACADEMY</span>

            <h1>Payments Error</h1>

            <p>
              Something went wrong while loading your payment records.
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

  const paymentsList = payments ?? [];

  const courseIds = paymentsList.map(
    (payment) => payment.course_id
  );

  // ---------------------------------------------------------
  // GET COURSE DETAILS
  // ---------------------------------------------------------
  const { data: courses, error: coursesError } =
    courseIds.length > 0
      ? await supabase
          .from("courses")
          .select("id, title, monthly_fee, total_fee")
          .in("id", [...new Set(courseIds)])
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
      "PAYMENT COURSE ERROR:",
      JSON.stringify(errorDetails, null, 2)
    );

    return (
      <>
        <main className="vp-error-page">
          <div className="vp-error-box">
            <span className="vp-eyebrow">VEYORA ACADEMY</span>

            <h1>Course Error</h1>

            <p>
              Your payment records were found, but course details could
              not be loaded.
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

  const courseMap = new Map(
    (courses ?? []).map((course) => [
      course.id,
      course,
    ])
  );

  // ---------------------------------------------------------
  // CALCULATIONS
  // ---------------------------------------------------------
  const totalPaid = paymentsList
    .filter(
      (payment) =>
        payment.status?.toLowerCase() === "paid"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

  const totalPending = paymentsList
    .filter(
      (payment) =>
        payment.status?.toLowerCase() === "pending"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

  const paymentCount = paymentsList.length;

  const paidCount = paymentsList.filter(
    (payment) =>
      payment.status?.toLowerCase() === "paid"
  ).length;

  const pendingCount = paymentsList.filter(
    (payment) =>
      payment.status?.toLowerCase() === "pending"
  ).length;

  function formatCurrency(value: number | string | null) {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
      return "PKR 0";
    }

    return `PKR ${amount.toLocaleString("en-PK")}`;
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
                VEYORA ACADEMY / ACCOUNT
              </span>

              <h1>
                My <span>Payments.</span>
              </h1>

              <p>
                Keep track of your fee records, payment history,
                and transaction details.
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

          {/* FINANCIAL OVERVIEW */}
          <section className="vp-summary-grid">

            {/* TOTAL PAYMENTS */}
            <div className="vp-summary-card">
              <div className="vp-summary-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M3 10h18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M7 15h3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>TOTAL PAYMENTS</span>

              <strong>{paymentCount}</strong>

              <small>
                Recorded transactions
              </small>
            </div>

            {/* TOTAL PAID */}
            <div className="vp-summary-card vp-paid-card">
              <div className="vp-summary-icon">
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

              <span>TOTAL PAID</span>

              <strong>
                {formatCurrency(totalPaid)}
              </strong>

              <small>
                {paidCount} paid transaction
                {paidCount === 1 ? "" : "s"}
              </small>
            </div>

            {/* PENDING */}
            <div className="vp-summary-card vp-pending-card">
              <div className="vp-summary-icon vp-blue">
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

              <span>PENDING</span>

              <strong>
                {formatCurrency(totalPending)}
              </strong>

              <small>
                {pendingCount} pending transaction
                {pendingCount === 1 ? "" : "s"}
              </small>
            </div>
          </section>

          {/* STATUS BAR */}
          <section className="vp-status-bar">
            <div>
              <span>ACCOUNT PAYMENT STATUS</span>

              <strong>
                {totalPending > 0
                  ? "Payment balance requires attention"
                  : paymentCount > 0
                    ? "Your recorded payments are up to date"
                    : "No payment records yet"}
              </strong>
            </div>

            <div className="vp-status-indicator">
              <i
                className={
                  totalPending > 0
                    ? "vp-indicator-pending"
                    : "vp-indicator-paid"
                }
              />

              {totalPending > 0
                ? "Pending balance"
                : "Account up to date"}
            </div>
          </section>

          {/* SECTION HEADER */}
          <div className="vp-section-heading">
            <div>
              <span>TRANSACTION HISTORY</span>

              <h2>
                Payment <em>records.</em>
              </h2>
            </div>

            <span className="vp-count">
              {paymentCount} RECORD
              {paymentCount === 1 ? "" : "S"}
            </span>
          </div>

          {/* EMPTY */}
          {paymentsList.length === 0 ? (
            <section className="vp-empty">
              <div className="vp-empty-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M3 10h18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M7 15h3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span>YOUR PAYMENT HISTORY</span>

              <h2>No payment records yet.</h2>

              <p>
                Your payment history will appear here once a payment
                record is added to your account.
              </p>
            </section>
          ) : (
            <section className="vp-payment-list">
              {paymentsList.map(
                (payment, index) => {
                  const course = courseMap.get(
                    payment.course_id
                  );

                  const normalizedStatus =
                    payment.status?.toLowerCase() ||
                    "pending";

                  const isPaid =
                    normalizedStatus === "paid";

                  const isPending =
                    normalizedStatus === "pending";

                  return (
                    <article
                      className="vp-payment-card"
                      key={payment.id}
                    >
                      <div className="vp-card-glow" />

                      {/* TOP */}
                      <div className="vp-payment-top">
                        <div className="vp-payment-number">
                          <span>TRANSACTION</span>

                          <strong>
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </strong>
                        </div>

                        <div
                          className={`vp-payment-status ${
                            isPaid
                              ? "vp-status-paid"
                              : isPending
                                ? "vp-status-pending"
                                : ""
                          }`}
                        >
                          <i />

                          {normalizedStatus.toUpperCase()}
                        </div>
                      </div>

                      {/* MAIN */}
                      <div className="vp-payment-main">
                        <div>
                          <span className="vp-course-label">
                            {course?.title ||
                              "VEYORA ACADEMY"}
                          </span>

                          <h3>
                            {formatCurrency(
                              payment.amount
                            )}
                          </h3>

                          <p>
                            {payment.payment_method
                              ? `Paid via ${payment.payment_method}`
                              : "Payment record"}
                          </p>
                        </div>

                        <div className="vp-payment-symbol">
                          <svg viewBox="0 0 24 24">
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="14"
                              rx="3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                            />

                            <path
                              d="M3 10h18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                            />

                            <path
                              d="M7 15h3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>

                          <small>PAYMENT</small>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="vp-payment-details">

                        <div className="vp-detail-item">
                          <span>
                            PAYMENT METHOD
                          </span>

                          <strong>
                            {payment.payment_method ||
                              "—"}
                          </strong>
                        </div>

                        <div className="vp-detail-item">
                          <span>
                            TRANSACTION REFERENCE
                          </span>

                          <strong>
                            {payment.transaction_reference ||
                              "—"}
                          </strong>
                        </div>

                        <div className="vp-detail-item">
                          <span>
                            PAYMENT DATE
                          </span>

                          <strong>
                            {formatDate(
                              payment.payment_date
                            )}
                          </strong>
                        </div>

                        <div className="vp-detail-item">
                          <span>
                            DUE DATE
                          </span>

                          <strong>
                            {formatDate(
                              payment.due_date
                            )}
                          </strong>
                        </div>
                      </div>

                      {/* NOTES */}
                      {payment.notes && (
                        <div className="vp-notes">
                          <div className="vp-notes-heading">
                            <span>NOTES</span>

                            <small>
                              RECORD DETAILS
                            </small>
                          </div>

                          <p>
                            {payment.notes}
                          </p>
                        </div>
                      )}

                      {/* FOOTER */}
                      <div className="vp-payment-footer">
                        <div>
                          <span className="vp-footer-dot" />

                          <span>
                            {isPaid
                              ? "Payment successfully recorded."
                              : isPending
                                ? "Payment is awaiting confirmation."
                                : "Payment status recorded."}
                          </span>
                        </div>

                        <span className="vp-record-id">
                          VEYORA /{" "}
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>
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
              <span>VEYORA ACADEMY / ACCOUNT</span>

              <h2>
                Keep it clear.
                <br />
                <em>Keep moving forward.</em>
              </h2>

              <p>
                Your payment records stay organized so you can
                focus on what matters — learning, building,
                and progressing.
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
          top: 320px;
          right: -250px;
          background: #FF9B4D;
        }

        .vp-glow-blue {
          bottom: 80px;
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

        /* SUMMARY */

        .vp-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .vp-summary-card {
          position: relative;
          min-height: 155px;
          padding: 22px;
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

        .vp-summary-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,77,.30);
        }

        .vp-summary-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,155,77,.23);
          border-radius: 13px;
          color: #FF9B4D;
          background: rgba(255,155,77,.035);
        }

        .vp-summary-icon svg {
          width: 20px;
          height: 20px;
        }

        .vp-summary-card > span {
          display: block;
          margin-top: 19px;
          color: #747B87;
          font-size: 9px;
          letter-spacing: .14em;
        }

        .vp-summary-card > strong {
          display: block;
          margin-top: 7px;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -.04em;
        }

        .vp-summary-card > small {
          display: block;
          margin-top: 5px;
          color: #717783;
          font-size: 10px;
        }

        .vp-paid-card {
          background:
            radial-gradient(
              circle at 90% 8%,
              rgba(255,155,77,.11),
              transparent 50%
            ),
            #11151C;
        }

        .vp-pending-card {
          background:
            radial-gradient(
              circle at 90% 8%,
              rgba(110,124,246,.08),
              transparent 50%
            ),
            #11151C;
        }

        .vp-blue {
          color: #6E7CF6;
          border-color: rgba(110,124,246,.24);
        }

        /* STATUS BAR */

        .vp-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          margin-top: 14px;
          padding: 17px 20px;
          border: 1px solid #262B35;
          border-radius: 17px;
          background: rgba(18,21,28,.65);
        }

        .vp-status-bar > div:first-child span {
          display: block;
          color: #676E79;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vp-status-bar > div:first-child strong {
          display: block;
          margin-top: 6px;
          color: #D9D5CC;
          font-size: 12px;
          font-weight: 500;
        }

        .vp-status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #858B96;
          font-size: 10px;
          white-space: nowrap;
        }

        .vp-status-indicator i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .vp-indicator-paid {
          background: #FF9B4D;
          box-shadow: 0 0 10px rgba(255,155,77,.55);
        }

        .vp-indicator-pending {
          background: #6E7CF6;
          box-shadow: 0 0 10px rgba(110,124,246,.5);
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

        .vp-count {
          color: #747B87;
          font-size: 10px;
          letter-spacing: .13em;
        }

        /* PAYMENTS */

        .vp-payment-list {
          display: grid;
          gap: 20px;
        }

        .vp-payment-card {
          position: relative;
          overflow: hidden;
          padding: 28px 30px 23px;
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

        .vp-payment-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,155,77,.38);
          box-shadow:
            0 28px 72px rgba(0,0,0,.30),
            0 0 32px rgba(255,155,77,.04);
        }

        .vp-card-glow {
          position: absolute;
          top: -210px;
          right: 8%;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: #FF9B4D;
          filter: blur(125px);
          opacity: .095;
          pointer-events: none;
        }

        .vp-payment-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .vp-payment-number {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vp-payment-number span {
          color: #747B87;
          font-size: 9px;
          letter-spacing: .15em;
        }

        .vp-payment-number strong {
          color: #FF9B4D;
          font-size: 13px;
          font-weight: 500;
        }

        .vp-payment-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #343946;
          border-radius: 999px;
          color: #9499A3;
          font-size: 9px;
          letter-spacing: .12em;
        }

        .vp-payment-status i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #747B87;
        }

        .vp-status-paid {
          color: #FFB27A;
          border-color: rgba(255,155,77,.28);
        }

        .vp-status-paid i {
          background: #FF9B4D;
          box-shadow:
            0 0 11px rgba(255,155,77,.60);
        }

        .vp-status-pending {
          color: #B7B9FF;
          border-color: rgba(110,124,246,.28);
        }

        .vp-status-pending i {
          background: #6E7CF6;
          box-shadow:
            0 0 11px rgba(110,124,246,.50);
        }

        /* MAIN */

        .vp-payment-main {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 30px 0 27px;
        }

        .vp-course-label {
          color: #6E7CF6;
          font-size: 9px;
          letter-spacing: .13em;
        }

        .vp-payment-main h3 {
          margin: 12px 0 0;
          font-size: clamp(29px, 4vw, 43px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .vp-payment-main p {
          margin: 11px 0 0;
          color: #858B96;
          font-size: 12px;
        }

        .vp-payment-symbol {
          width: 112px;
          height: 112px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          flex: 0 0 auto;
          border: 1px solid rgba(255,155,77,.25);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,155,77,.08),
              transparent 68%
            );
          box-shadow:
            0 0 35px rgba(255,155,77,.05);
        }

        .vp-payment-symbol svg {
          width: 29px;
          height: 29px;
          color: #FF9B4D;
        }

        .vp-payment-symbol small {
          margin-top: 7px;
          color: #6E7480;
          font-size: 7px;
          letter-spacing: .14em;
        }

        /* DETAILS */

        .vp-payment-details {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          padding: 20px 0;
          border-top: 1px solid #292E38;
          border-bottom: 1px solid #292E38;
        }

        .vp-detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .vp-detail-item span {
          color: #707681;
          font-size: 8px;
          letter-spacing: .13em;
        }

        .vp-detail-item strong {
          color: #E2DED6;
          font-size: 11px;
          line-height: 1.55;
          font-weight: 500;
          word-break: break-word;
        }

        /* NOTES */

        .vp-notes {
          position: relative;
          z-index: 2;
          margin-top: 19px;
          padding: 17px;
          border: 1px solid #292E38;
          border-radius: 14px;
          background: #0D1016;
        }

        .vp-notes-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .vp-notes-heading span {
          color: #747B87;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .vp-notes-heading small {
          color: #555C67;
          font-size: 8px;
          letter-spacing: .11em;
        }

        .vp-notes p {
          margin: 9px 0 0;
          color: #D2CEC5;
          font-size: 12px;
          line-height: 1.7;
        }

        /* FOOTER */

        .vp-payment-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding-top: 18px;
        }

        .vp-payment-footer > div {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #737984;
          font-size: 9px;
        }

        .vp-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF9B4D;
          box-shadow:
            0 0 9px rgba(255,155,77,.5);
        }

        .vp-record-id {
          color: #484E59;
          font-size: 8px;
          letter-spacing: .13em;
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
          background: rgba(255,155,77,.025);
        }

        .vp-empty-icon svg {
          width: 25px;
          height: 25px;
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
          border: 1px solid rgba(110,124,246,.20);
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

        .vp-courses-button:hover {
          border-color: #FF9B4D;
        }

        .vp-courses-button span {
          color: #FF9B4D;
          font-size: 15px;
        }

        /* RESPONSIVE */

        @media (max-width: 850px) {
          .vp-payment-details {
            grid-template-columns: repeat(2, 1fr);
          }

          .vp-payment-main {
            align-items: flex-start;
          }
        }

        @media (max-width: 760px) {
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

          .vp-status-bar {
            align-items: flex-start;
            flex-direction: column;
          }

          .vp-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .vp-payment-card {
            padding: 22px 20px 20px;
          }

          .vp-payment-top {
            align-items: flex-start;
          }

          .vp-payment-main {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px 0;
          }

          .vp-payment-symbol {
            width: 95px;
            height: 95px;
          }

          .vp-payment-details {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .vp-payment-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .vp-record-id {
            display: none;
          }

          .vp-bottom-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .vp-courses-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vp-orbit-one,
          .vp-orbit-two {
            animation: none;
          }

          .vp-summary-card,
          .vp-payment-card,
          .vp-courses-button {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}