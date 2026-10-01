import AvatarUploader from "./AvatarUploader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  const { data: student, error } = await supabase
    .from("students")
    .select(
      "id, full_name, email, phone, course, enrollment_date, status, avatar_url"
    )
    .eq("id", userId)
    .single();

  if (error) {
    return (
      <main className="profilePage">
        <div className="errorBox">
          <p>VEYORA ACADEMY</p>
          <h1>Profile Error</h1>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </main>
    );
  }

  async function updateProfile(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getClaims();

    if (!authData?.claims?.sub) {
      redirect("/login");
    }

    const currentUserId = authData.claims.sub;

    const fullName = String(
      formData.get("full_name") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    if (!fullName) {
      return;
    }

    const { error } = await supabase
      .from("students")
      .update({
        full_name: fullName,
        phone: phone || null,
      })
      .eq("id", currentUserId);

    if (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        JSON.stringify(error, null, 2)
      );
      return;
    }

    revalidatePath("/student/profile");
    revalidatePath("/student");
  }

  return (
    <main className="profilePage">
      <div className="profileShell">

        {/* HEADER */}
        <div className="pageHeader">
          <p className="eyebrow">VEYORA ACADEMY</p>

          <h1>My Profile</h1>

          <p className="subtitle">
            Manage your student information and personal learning identity.
          </p>
        </div>

        {/* PROFILE CARD */}
        <section className="profileCard">

          {/* TOP IDENTITY */}
          <div className="identity">
            <div className="identityAvatar">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                />
              ) : (
                student.full_name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h2>{student.full_name}</h2>
              <p>{student.email}</p>
            </div>
          </div>

          {/* PHOTO UPLOAD */}
          <div className="photoSection">
            <AvatarUploader
              userId={userId}
              currentAvatar={student.avatar_url}
            />
          </div>

          {/* PROFILE FORM */}
          <form action={updateProfile} className="profileForm">

            <div className="field">
              <label htmlFor="full_name">
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={student.full_name}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={student.email}
                readOnly
                className="readonly"
              />

              <small>
                Email is managed through your login account.
              </small>
            </div>

            <div className="field">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={student.phone ?? ""}
                placeholder="+92 3XX XXXXXXX"
              />
            </div>

            {/* ACCOUNT INFO */}
            <div className="accountInfo">

              <div>
                <span>ENROLLED COURSE</span>
                <strong>
                  {student.course || "Not assigned"}
                </strong>
              </div>

              <div>
                <span>ENROLLMENT DATE</span>
                <strong>
                  {student.enrollment_date || "—"}
                </strong>
              </div>

              <div>
                <span>ACCOUNT STATUS</span>
                <strong>
                  {student.status || "Active"}
                </strong>
              </div>

            </div>

            <div className="saveRow">
              <button type="submit">
                Save Changes
              </button>
            </div>

          </form>
        </section>
      </div>

      <style>{`
        .profilePage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(110,124,246,0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 15%,
              rgba(255,155,77,0.07),
              transparent 28%
            ),
            #0A0C10;
          color: #F3F1EA;
          padding: 55px 24px 90px;
        }

        .profileShell {
          width: min(940px, 100%);
          margin: 0 auto;
        }

        .pageHeader {
          margin-bottom: 35px;
        }

        .eyebrow {
          margin: 0;
          color: #FF9B4D;
          font-size: 11px;
          letter-spacing: 0.18em;
        }

        .pageHeader h1 {
          margin: 10px 0 0;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -0.045em;
        }

        .subtitle {
          margin: 14px 0 0;
          color: #8B909A;
          font-size: 15px;
        }

        .profileCard {
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.035),
              rgba(255,255,255,0.01)
            ),
            #11141A;
          border: 1px solid #272C36;
          border-radius: 26px;
          padding: 30px;
          box-shadow:
            0 25px 70px rgba(0,0,0,0.25),
            inset 0 1px rgba(255,255,255,0.025);
        }

        .identity {
          display: flex;
          align-items: center;
          gap: 18px;
          padding-bottom: 26px;
          border-bottom: 1px solid #272C36;
        }

        .identityAvatar {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          border-radius: 50%;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: #0A0C10;
          border: 1px solid #393F4A;
          color: #FF9B4D;
          font-size: 24px;
          font-weight: 600;
          box-shadow: 0 0 30px rgba(255,155,77,0.08);
        }

        .identityAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .identity h2 {
          margin: 0;
          font-size: 25px;
          font-weight: 500;
        }

        .identity p {
          margin: 7px 0 0;
          color: #8A8F98;
          font-size: 14px;
        }

        .photoSection {
          margin-top: 26px;
        }

        .profileForm {
          margin-top: 30px;
          display: grid;
          gap: 22px;
        }

        .field {
          display: grid;
          gap: 9px;
        }

        .field label {
          color: #D8D6CE;
          font-size: 14px;
        }

        .field input {
          width: 100%;
          box-sizing: border-box;
          padding: 15px 16px;
          border-radius: 13px;
          border: 1px solid #292F39;
          background: #0A0C10;
          color: #F3F1EA;
          font-size: 15px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .field input:focus {
          border-color: rgba(255,155,77,0.5);
          box-shadow: 0 0 0 3px rgba(255,155,77,0.06);
        }

        .field input.readonly {
          background: #151922;
          color: #737983;
          cursor: not-allowed;
        }

        .field small {
          color: #636872;
          font-size: 12px;
        }

        .accountInfo {
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid #272C36;
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .accountInfo div {
          display: grid;
          gap: 7px;
        }

        .accountInfo span {
          color: #676C76;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        .accountInfo strong {
          color: #D8D6CE;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
        }

        .saveRow {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }

        .saveRow button {
          border: 0;
          padding: 14px 24px;
          border-radius: 999px;
          background: #FF9B4D;
          color: #0A0C10;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .saveRow button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255,155,77,0.15);
        }

        .errorBox {
          width: min(900px, 100%);
          margin: 0 auto;
          background: #12151C;
          border: 1px solid #4A2727;
          border-radius: 20px;
          padding: 30px;
        }

        .errorBox p {
          color: #FF9B4D;
          letter-spacing: 0.16em;
          font-size: 11px;
        }

        .errorBox pre {
          margin-top: 20px;
          white-space: pre-wrap;
          color: #FFB4B4;
        }

        @media (max-width: 650px) {
          .profilePage {
            padding: 35px 14px 60px;
          }

          .profileCard {
            padding: 20px;
          }

          .accountInfo {
            grid-template-columns: 1fr;
          }

          .saveRow {
            justify-content: stretch;
          }

          .saveRow button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}