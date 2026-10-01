import { login } from "./actions";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0C10",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#12151C",
          border: "1px solid #262B35",
          borderRadius: "20px",
          padding: "40px",
          color: "#F3F1EA",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            color: "#FF9B4D",
            marginBottom: "12px",
          }}
        >
          VEYORA ACADEMY
        </p>

        <h1
          style={{
            fontSize: "36px",
            margin: "0 0 10px",
          }}
        >
          Student Portal
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            marginBottom: "30px",
          }}
        >
          Sign in to access your courses, classes and progress.
        </p>

        <form>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid #262B35",
              background: "#0A0C10",
              color: "#F3F1EA",
            }}
          />

          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "24px",
              borderRadius: "10px",
              border: "1px solid #262B35",
              background: "#0A0C10",
              color: "#F3F1EA",
            }}
          />

          <button
            formAction={login}
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#FF9B4D",
              color: "#0A0C10",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            fontSize: "13px",
            color: "#737984",
            textAlign: "center",
          }}
        >
          Veyora Academy · Student Access
        </p>
      </div>
    </main>
  );
}