"use client";

import { useEffect, useState } from "react";

const TYPES = [
  { value: "game", label: "🎮 Games" },
  { value: "movie", label: "🎬 Movies" },
  { value: "apk", label: "📱 APK" },
  { value: "file", label: "📁 Files" },
];

export default function Toolbox() {
  const [type, setType] = useState("game");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadContent() {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.success) setItems(data.items || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  async function uploadContent(e) {
    e.preventDefault();

    if (!title.trim() || !file) {
      setMessage("⚠️ Title aur file dono required hain.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("✅ Upload successful!");
      setTitle("");
      setDescription("");
      setFile(null);

      document.getElementById("content-file").value = "";

      await loadContent();
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        maxWidth: 1100,
        margin: "auto",
      }}
    >
      <h1>🧰 Website Toolbox</h1>

      <p>
        Games, Movies, APKs aur Files upload karein.
        Uploaded content website API mein available hoga.
      </p>

      <form
        onSubmit={uploadContent}
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          marginTop: 20,
        }}
      >
        <h2>📤 Upload Content</h2>

        <label>Content Type</label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: 12,
            margin: "8px 0 16px",
          }}
        >
          {TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label>Title</label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: My Game"
          style={{
            display: "block",
            width: "100%",
            padding: 12,
            margin: "8px 0 16px",
          }}
        />

        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
          style={{
            display: "block",
            width: "100%",
            minHeight: 100,
            padding: 12,
            margin: "8px 0 16px",
          }}
        />

        <label>File</label>

        <input
          id="content-file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{
            display: "block",
            margin: "8px 0 16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 22px",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Uploading..." : "📤 Upload & Publish"}
        </button>

        {message && (
          <p style={{ marginTop: 15 }}>
            {message}
          </p>
        )}
      </form>

      <section style={{ marginTop: 30 }}>
        <h2>🌐 Published Content</h2>

        {items.length === 0 ? (
          <p>No content uploaded yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <small>
                  {item.type.toUpperCase()} •{" "}
                  {Math.round((item.size || 0) / 1024)} KB
                </small>

                <a
                  href={item.downloadUrl}
                  download
                  style={{
                    display: "block",
                    marginTop: 14,
                    padding: 10,
                    textAlign: "center",
                    borderRadius: 8,
                    textDecoration: "none",
                    border: "1px solid #999",
                  }}
                >
                  ⬇️ Download
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
