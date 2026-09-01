"use client";

import { useEffect, useState } from "react";

const sections = [
  { type: "game", title: "🎮 Games" },
  { type: "movie", title: "🎬 Movies" },
  { type: "apk", title: "📱 APK Apps" },
];

function size(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DownloadContent() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setItems(data.items || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ marginTop: 35 }}>
      {sections.map((section) => {
        const list = items.filter(
          (item) => item.type === section.type
        );

        if (!list.length) return null;

        return (
          <section key={section.type} style={{ marginBottom: 35 }}>
            <h2>{section.title}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(230px,1fr))",
                gap: 16,
              }}
            >
              {list.map((item) => (
                <article
                  key={item.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <h3>{item.title}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <small>
                    {size(item.size)}
                  </small>

                  <a
                    href={item.downloadUrl}
                    download
                    style={{
                      display: "block",
                      marginTop: 12,
                      padding: 11,
                      textAlign: "center",
                      borderRadius: 8,
                      border: "1px solid #999",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    ⬇️ Download
                  </a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
