import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

async function getChannels() {
  try {
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "data", "tv-channels.json"),
        "utf8"
      )
    );
  } catch {
    return [];
  }
}

export default async function AdminTV() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("admin_session")?.value !==
    "authenticated"
  ) {
    redirect("/admin");
  }

  const channels = await getChannels();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05030d",
        color: "white",
        padding: "35px",
        fontFamily: "Arial"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>

        <Link
          href="/admin/dashboard"
          style={{ color: "#a78bfa" }}
        >
          ← Dashboard
        </Link>

        <h1 style={{ fontSize: 40 }}>
          🌍 Live TV Manager
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Add and manage official broadcaster links.
        </p>

        <form
          action="/api/tv"
          method="POST"
          style={{
            background: "#111827",
            padding: 25,
            borderRadius: 18,
            marginTop: 25
          }}
        >
          <h2>Add TV Channel</h2>

          <input
            name="name"
            placeholder="Channel name"
            required
            style={input}
          />

          <input
            name="country"
            placeholder="Country"
            style={input}
          />

          <input
            name="region"
            placeholder="Region"
            style={input}
          />

          <input
            name="language"
            placeholder="Language"
            style={input}
          />

          <input
            name="logo"
            placeholder="Logo URL"
            style={input}
          />

          <input
            name="url"
            placeholder="Official live/watch URL"
            required
            style={input}
          />

          <button
            type="submit"
            style={button}
          >
            Add Channel
          </button>
        </form>

        <section style={{ marginTop: 30 }}>
          <h2>
            Channels ({channels.length})
          </h2>

          <div
            style={{
              display: "grid",
              gap: 12
            }}
          >
            {channels.map((channel) => (
              <div
                key={channel.id || channel.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 15,
                  background: "#111827",
                  border: "1px solid #1e293b",
                  padding: 18,
                  borderRadius: 14
                }}
              >
                <div>
                  <b>{channel.name}</b>

                  <div
                    style={{
                      color: "#94a3b8",
                      marginTop: 5
                    }}
                  >
                    {channel.country} ·{" "}
                    {channel.language}
                  </div>
                </div>

                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#a78bfa"
                  }}
                >
                  Open →
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

const input = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "13px",
  borderRadius: 9,
  border: "1px solid #334155",
  background: "#0b1220",
  color: "white"
};

const button = {
  marginTop: 10,
  padding: "13px 20px",
  border: 0,
  borderRadius: 9,
  background: "linear-gradient(100deg,#7c3aed,#ec4899)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
};
