import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import NewsManager from "./NewsManager";
import ToolboxMenu from "./ToolboxMenu";

export default async function Dashboard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const geminiConfigured = !!process.env.GEMINI_API_KEY;

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080d1a",
      color: "#fff",
      padding: "30px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap"
        }}>
          <div>
            <h1 style={{ fontSize: 36, marginBottom: 8 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "#94a3b8" }}>
              GoogleAI News administration panel
            </p>
          </div>
          <LogoutButton />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginTop: 30
        }}>
          <div className="admin-stat">
            <h3>Admin</h3>
            <strong style={{ color: "#22c55e" }}>● Logged in</strong>
          </div>

          <div className="admin-stat">
            <h3>Gemini API</h3>
            <strong style={{
              color: geminiConfigured ? "#22c55e" : "#ef4444"
            }}>
              {geminiConfigured ? "● Configured" : "● Not configured"}
            </strong>
          </div>

          <div className="admin-stat">
            <h3>Website</h3>
            <strong style={{ color: "#22c55e" }}>● Online</strong>
          </div>
        </div>


          <div style={{ marginTop: 25, marginBottom: 20 }}>
            <a
              href="/admin/dashboard/tools"
              style={{
                display: "inline-block",
                padding: "14px 22px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#ec4899,#7c3aed,#2563eb)",
                color: "white",
                textDecoration: "none",
                fontWeight: 800,
                boxShadow: "0 10px 30px rgba(124,58,237,.35)"
              }}
            >
              🧰 Open Full Website Toolbox
            </a>
          </div>

<div style={{ marginTop: 30 }}>
          <NewsManager />
        </div>


          <div style={{ marginTop: 25 }}>
            <a
              href="/admin/dashboard/site-editor"
              style={{
                display: "inline-block",
                padding: "13px 20px",
                background: "linear-gradient(135deg,#ec4899,#7c3aed,#06b6d4)",
                color: "white",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(0,0,0,.25)"
              }}
            >
              🎨 Full Website Editor
            </a>
          </div>

<div style={{ marginTop: 25 }}>
          <a
            href="/admin/dashboard/tv"
            style={{
              display: "inline-block",
              marginRight: 12,
              marginBottom: 10,
              padding: "12px 18px",
              background: "#7c3aed",
              color: "white",
              borderRadius: 8,
              textDecoration: "none"
            }}
          >
            🌍 Manage Live TV
          </a>

          <a
            href="/"
            style={{
              color: "#60a5fa",
              textDecoration: "none"
            }}
          >
            ← Open Website
          </a>
        </div>
      </div>
    </main>
  );
}
