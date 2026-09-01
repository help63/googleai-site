"use client";

import { useEffect, useState } from "react";

const TYPES = [
  ["game", "🎮 Game"],
  ["movie", "🎬 Movie"],
  ["apk", "📱 APK"],
  ["file", "📁 File"],
  ["article", "📝 Article"],
];

export default function ContentManager() {
  const [type, setType] = useState("game");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadContent() {
    try {
      const res = await fetch("/api/content", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setItems(data.items || []);
      }
    } catch {
      setMessage("❌ Content load failed");
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  async function upload(e) {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("❌ Title is required");
      return;
    }

    if (!file) {
      setMessage("❌ Please select a file");
      return;
    }

    setLoading(true);
    setMessage("Uploading...");

    const form = new FormData();

    form.append("type", type);
    form.append("title", title.trim());
    form.append("description", description.trim());
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("❌ " + (data.error || "Upload failed"));
        return;
      }

      setMessage("✅ Uploaded successfully");

      resetForm();
      loadContent();
    } catch {
      setMessage("❌ Upload request failed");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setFile(null);
    setEditing(null);

    const input = document.getElementById("content-file");

    if (input) {
      input.value = "";
    }
  }

  function startEdit(item) {
    setEditing(item.id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setType(item.type || "file");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveEdit() {
    if (!editing) return;

    if (!title.trim()) {
      setMessage("❌ Title is required");
      return;
    }

    setLoading(true);
    setMessage("Saving...");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing,
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("❌ " + (data.error || "Save failed"));
        return;
      }

      setMessage("✅ Changes saved");
      resetForm();
      loadContent();
    } catch {
      setMessage("❌ Save request failed");
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(item) {
    setMessage("Updating...");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          published: item.published === false,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("❌ " + (data.error || "Update failed"));
        return;
      }

      setMessage(
        data.item.published
          ? "✅ Published"
          : "✅ Unpublished"
      );

      loadContent();
    } catch {
      setMessage("❌ Update failed");
    }
  }

  async function deleteItem(item) {
    const ok = window.confirm(
      `Delete "${item.title}"?\n\nThis removes the content record.`
    );

    if (!ok) return;

    setMessage("Deleting...");

    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("❌ " + (data.error || "Delete failed"));
        return;
      }

      setMessage("✅ Content deleted");
      loadContent();
    } catch {
      setMessage("❌ Delete failed");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#0b1020",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1150,
          margin: "auto",
        }}
      >
        <h1>📦 Universal Content Manager</h1>

        <p style={{ color: "#94a3b8" }}>
          Admin-only Games, Movies, APKs and Files management.
        </p>

        <form
          onSubmit={editing ? (e) => {
            e.preventDefault();
            saveEdit();
          } : upload}
          style={{
            marginTop: 25,
            padding: 24,
            borderRadius: 16,
            background: "#11182b",
            border: "1px solid #29324d",
          }}
        >
          <h2>
            {editing
              ? "✏️ Edit Content"
              : "⬆️ Upload Content"}
          </h2>

          <label>Content Type</label>

          <select
            value={type}
            disabled={!!editing}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            {TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label>Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            style={inputStyle}
          />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter description"
            rows={4}
            style={inputStyle}
          />

          {!editing && (
            <>
              <label>File</label>

              <input
                id="content-file"
                type="file"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                style={{
                  display: "block",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              />
            </>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading
                ? "⏳ Please wait..."
                : editing
                ? "💾 Save Changes"
                : "⬆️ Upload"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  ...buttonStyle,
                  background: "#475569",
                }}
              >
                ✖ Cancel
              </button>
            )}
          </div>

          {message && (
            <p style={{ marginTop: 15 }}>
              {message}
            </p>
          )}
        </form>

        <section style={{ marginTop: 30 }}>
          <h2>📚 Content Library ({items.length})</h2>

          {items.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No content uploaded yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(270px,1fr))",
                gap: 15,
              }}
            >
              {items.map((item) => {
                const published =
                  item.published !== false;

                return (
                  <article
                    key={item.id}
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      background: "#11182b",
                      border: published
                        ? "1px solid #29324d"
                        : "1px solid #92400e",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: 10,
                      }}
                    >
                      <strong>
                        {item.type?.toUpperCase()}
                      </strong>

                      <span>
                        {published
                          ? "🟢 Published"
                          : "🟠 Hidden"}
                      </span>
                    </div>

                    <h3>{item.title}</h3>

                    {item.description && (
                      <p
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <small>
                      {item.originalName ||
                        "Uploaded file"}
                    </small>

                    <div
                      style={{
                        display: "grid",
                        gap: 8,
                        marginTop: 15,
                      }}
                    >
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={linkButton}
                      >
                        👁️ View / Download
                      </a>

                      <button
                        onClick={() =>
                          startEdit(item)
                        }
                        style={buttonStyle}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          togglePublished(item)
                        }
                        style={{
                          ...buttonStyle,
                          background: published
                            ? "#92400e"
                            : "#166534",
                        }}
                      >
                        {published
                          ? "🙈 Unpublish"
                          : "🌐 Publish"}
                      </button>

                      <button
                        onClick={() =>
                          deleteItem(item)
                        }
                        style={{
                          ...buttonStyle,
                          background: "#991b1b",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  marginTop: 8,
  marginBottom: 16,
  borderRadius: 9,
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff",
};

const buttonStyle = {
  padding: "11px 16px",
  border: 0,
  borderRadius: 9,
  cursor: "pointer",
  fontWeight: 800,
  background: "#7c3aed",
  color: "#fff",
};

const linkButton = {
  display: "block",
  padding: 11,
  textAlign: "center",
  borderRadius: 9,
  border: "1px solid #475569",
  color: "#fff",
  textDecoration: "none",
};
