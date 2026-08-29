"use client";

import { useEffect, useState } from "react";

export default function AdminFilesPage() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadFiles() {
    const r = await fetch("/api/admin/files", { cache: "no-store" });
    const data = await r.json();
    setFiles(data.files || []);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function upload(e) {
    const selected = [...e.target.files];
    if (!selected.length) return;

    setLoading(true);
    setMessage("");

    try {
      for (const file of selected) {
        const fd = new FormData();
        fd.append("file", file);

        const r = await fetch("/api/admin/files", {
          method: "POST",
          body: fd,
        });

        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }
      }

      setMessage("Files uploaded successfully.");
      await loadFiles();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  async function saveText() {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const r = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await r.json();

      if (!r.ok) throw new Error(data.error || "Text save failed");

      setText("");
      setMessage("Text message saved.");
      await loadFiles();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeFile(id) {
    if (!confirm("Delete this file?")) return;

    const r = await fetch("/api/admin/files?id=" + encodeURIComponent(id), {
      method: "DELETE",
    });

    const data = await r.json();

    if (!r.ok) {
      setMessage(data.error || "Delete failed");
      return;
    }

    await loadFiles();
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1>📁 Admin File Manager</h1>
      <p>Only authenticated administrators can upload or delete files.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Upload from device / SD card</h2>

        <input
          type="file"
          multiple
          accept="image/*,video/*,.txt,.csv,.json,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={upload}
          disabled={loading}
        />

        <p>
          Images, videos, documents and text files are supported. On mobile,
          the browser file picker can select files from supported SD-card/device
          storage.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>📝 Admin Text Message</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write any text/message..."
          rows={7}
          style={{ width: "100%", padding: 12 }}
        />

        <button onClick={saveText} disabled={loading || !text.trim()}>
          Save Text
        </button>
      </section>

      {message && (
        <p style={{ marginTop: 20, fontWeight: 700 }}>{message}</p>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>📂 Website Files</h2>

        {!files.length && <p>No uploaded files yet.</p>}

        <div style={{ display: "grid", gap: 12 }}>
          {files.map((file) => (
            <article
              key={file.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <strong>{file.name}</strong>
              <div>{file.type}</div>

              {file.url && (
                <div style={{ marginTop: 8 }}>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
              )}

              {file.text && (
                <pre style={{ whiteSpace: "pre-wrap" }}>{file.text}</pre>
              )}

              <button
                onClick={() => removeFile(file.id)}
                style={{ marginTop: 8 }}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
