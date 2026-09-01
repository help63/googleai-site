"use client";

import { useEffect, useState } from "react";

const TYPES = [
  ["all", "📥 All"],
  ["game", "🎮 Games"],
  ["movie", "🎬 Movies"],
  ["apk", "📱 APKs"],
  ["file", "📁 Files"],
];

export default function DownloadsPage() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadContent(selectedType = type) {
    setLoading(true);

    try {
      const url =
        selectedType === "all"
          ? "/api/content"
          : `/api/content?type=${encodeURIComponent(selectedType)}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      setItems(data.success ? data.items || [] : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent(type);
  }, [type]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#0b1020",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "auto" }}>
        <h1>📥 Downloads</h1>

        <p style={{ color: "#94a3b8" }}>
          Games, Movies, APKs and other files uploaded by Admin.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            margin: "25px 0",
          }}
        >
          {TYPES.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setType(value)}
              style={{
                padding: "10px 16px",
                border: 0,
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 800,
                color: "#fff",
                background:
                  type === value
                    ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                    : "#1e293b",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p>⏳ Loading...</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>
            No content uploaded yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
            }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: "#111827",
                  border: "1px solid #29324d",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 9px",
                    borderRadius: 7,
                    background: "#312e81",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {item.type?.toUpperCase()}
                </div>

                <h2 style={{ marginBottom: 8 }}>
                  {item.title}
                </h2>

                {item.description && (
                  <p style={{ color: "#94a3b8" }}>
                    {item.description}
                  </p>
                )}

                <p
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    wordBreak: "break-word",
                  }}
                >
                  📄 {item.originalName || "Uploaded file"}
                </p>

                <a
                  href={item.downloadUrl}
                  download
                  style={{
                    display: "block",
                    marginTop: 15,
                    padding: 12,
                    textAlign: "center",
                    borderRadius: 10,
                    background:
                      "linear-gradient(90deg,#16a34a,#22c55e)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 900,
                  }}
                >
                  ⬇️ Download
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
