"use client";

import { useEffect, useState } from "react";

const defaultSidebar = [
  ["🏠", "Home", "/"],
  ["🤖", "AI Tools", "/#features"],
  ["🎨", "AI Images", "/#studio"],
  ["✍️", "AI Writer", "/#studio"],
  ["💬", "AI Chat", "/#studio"],
  ["📰", "Latest News", "/category/Latest"],
  ["🏢", "Business", "/category/Business"],
  ["🏏", "Cricket", "/cricket"],
  ["🛒", "Shopping", "/shopping"],
  ["📱", "Mobiles", "/mobiles"],
  ["💻", "Electronics", "/electronics"],
  ["💼", "Jobs", "/jobs"],
  ["📺", "Live TV", "/tv"],
  ["🎬", "Videos", "/videos"],
  ["📝", "Articles", "/articles"],
  ["🍳", "Recipes", "/recipes"],
  ["✈️", "Travel", "/travel"],
  ["☪️", "Islam", "/islam"],
];

export default function SiteEditor() {
  const [logo, setLogo] = useState({
    url: "",
    title: "GoogleAi"
  });

  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [sidebar, setSidebar] = useState(defaultSidebar);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then(async (r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data) => {
        if (data.logo) setLogo(data.logo);
        if (Array.isArray(data.links)) setLinks(data.links);
        if (Array.isArray(data.videos)) setVideos(data.videos);
        if (Array.isArray(data.sidebar) && data.sidebar.length) {
          setSidebar(data.sidebar);
        }
      })
      .catch(() => setMessage("❌ Admin login required"));
  }, []);

  function addLink() {
    setLinks([
      ...links,
      {
        id: Date.now(),
        title: "New Link",
        url: "https://"
      }
    ]);
  }

  function addVideo() {
    setVideos([
      ...videos,
      {
        id: Date.now(),
        title: "New Video",
        url: "https://"
      }
    ]);
  }

  function updateItem(setter, items, index, key, value) {
    const copy = [...items];
    copy[index] = { ...copy[index], [key]: value };
    setter(copy);
  }

  async function save() {
    setMessage("💾 Saving...");

    const res = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        logo,
        links,
        videos,
        sidebar
      })
    });

    const data = await res.json();

    setMessage(
      data.ok
        ? "✅ Saved successfully"
        : `❌ ${data.error || "Save failed"}`
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg,#070b18,#172554,#312e81)",
      color: "#fff",
      padding: 25,
      fontFamily: "Arial,sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "auto" }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 15,
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <div>
            <h1 style={{ fontSize: 40, margin: 0 }}>
              🛠️ WordPress Style Editor
            </h1>
            <p style={{ color: "#cbd5e1" }}>
              Admin-only website control panel
            </p>
          </div>

          <button
            onClick={save}
            style={{
              padding: "14px 24px",
              border: 0,
              borderRadius: 14,
              cursor: "pointer",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              background:
                "linear-gradient(90deg,#ec4899,#8b5cf6,#06b6d4)"
            }}
          >
            💾 SAVE WEBSITE
          </button>
        </div>

        <div style={{
          margin: "20px 0",
          padding: 14,
          borderRadius: 14,
          background: "rgba(255,255,255,.1)"
        }}>
          {message || "🔐 Admin editor ready"}
        </div>

        <section style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 18
        }}>

          <EditorCard title="🖼️ Website Logo">
            <input
              value={logo.url}
              onChange={(e) =>
                setLogo({ ...logo, url: e.target.value })
              }
              placeholder="Logo image URL"
              style={input}
            />

            <input
              value={logo.title}
              onChange={(e) =>
                setLogo({ ...logo, title: e.target.value })
              }
              placeholder="Logo title"
              style={input}
            />
          </EditorCard>

          <EditorCard title="🔗 Links">
            {links.map((item, i) => (
              <div key={item.id || i} style={itemBox}>
                <input
                  value={item.title}
                  onChange={(e) =>
                    updateItem(
                      setLinks,
                      links,
                      i,
                      "title",
                      e.target.value
                    )
                  }
                  style={input}
                />

                <input
                  value={item.url}
                  onChange={(e) =>
                    updateItem(
                      setLinks,
                      links,
                      i,
                      "url",
                      e.target.value
                    )
                  }
                  style={input}
                />

                <button
                  onClick={() =>
                    setLinks(links.filter((_, x) => x !== i))
                  }
                  style={deleteButton}
                >
                  🗑️ Remove
                </button>
              </div>
            ))}

            <button onClick={addLink} style={addButton}>
              ➕ Add Link
            </button>
          </EditorCard>

          <EditorCard title="🎬 Videos">
            {videos.map((item, i) => (
              <div key={item.id || i} style={itemBox}>
                <input
                  value={item.title}
                  onChange={(e) =>
                    updateItem(
                      setVideos,
                      videos,
                      i,
                      "title",
                      e.target.value
                    )
                  }
                  style={input}
                />

                <input
                  value={item.url}
                  onChange={(e) =>
                    updateItem(
                      setVideos,
                      videos,
                      i,
                      "url",
                      e.target.value
                    )
                  }
                  style={input}
                />

                <button
                  onClick={() =>
                    setVideos(videos.filter((_, x) => x !== i))
                  }
                  style={deleteButton}
                >
                  🗑️ Remove
                </button>
              </div>
            ))}

            <button onClick={addVideo} style={addButton}>
              ➕ Add Video
            </button>
          </EditorCard>

          <EditorCard title="🎨 Sidebar Menu">
            {sidebar.map(([icon, name, url], i) => (
              <div
                key={`${name}-${i}`}
                draggable
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("index")
                  );

                  if (Number.isNaN(from) || from === i) return;

                  const copy = [...sidebar];
                  const [item] = copy.splice(from, 1);
                  copy.splice(i, 0, item);
                  setSidebar(copy);
                }}
                onDragStart={(e) =>
                  e.dataTransfer.setData("index", String(i))
                }
                style={{
                  display: "grid",
                  gridTemplateColumns: "45px 1fr",
                  gap: 8,
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.08)",
                  cursor: "grab"
                }}
              >
                <span style={{ fontSize: 25 }}>{icon}</span>
                <div>
                  <strong>{name}</strong>
                  <div style={{
                    fontSize: 12,
                    color: "#94a3b8"
                  }}>
                    {url}
                  </div>
                </div>
              </div>
            ))}

            <small style={{ color: "#94a3b8" }}>
              ↕ Drag menu items to reorder
            </small>
          </EditorCard>

        </section>

        <div style={{ marginTop: 25 }}>
          <a
            href="/admin/dashboard"
            style={{ color: "#93c5fd" }}
          >
            ← Admin Dashboard
          </a>
          {" • "}
          <a href="/" style={{ color: "#93c5fd" }}>
            Open Website →
          </a>
        </div>
      </div>
    </main>
  );
}

function EditorCard({ title, children }) {
  return (
    <section style={{
      padding: 20,
      borderRadius: 22,
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.15)",
      boxShadow: "0 18px 50px rgba(0,0,0,.25)"
    }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: 11,
  marginBottom: 9,
  borderRadius: 10,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff"
};

const itemBox = {
  padding: 12,
  marginBottom: 10,
  borderRadius: 12,
  background: "rgba(0,0,0,.2)"
};

const addButton = {
  padding: "10px 15px",
  border: 0,
  borderRadius: 10,
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700
};

const deleteButton = {
  padding: "7px 10px",
  border: 0,
  borderRadius: 8,
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};
