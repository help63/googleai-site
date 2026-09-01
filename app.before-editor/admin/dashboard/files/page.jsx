"use client";

import { useEffect, useState } from "react";

export default function AdminFilesPage() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Loading...");

  async function loadFiles() {
    try {
      const res = await fetch("/api/admin/files", { cache: "no-store" });
      const data = await res.json();
      setFiles(data.files || []);
      setStatus(data.message || "Ready");
    } catch {
      setStatus("Unable to load File Manager.");
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#0b1020",
        color: "#fff",
      }}
    >
      <h1>Admin File Manager</h1>
      <p>Admin-only storage management</p>

      <section
        style={{
          marginTop: 24,
          padding: 24,
          border: "1px solid #29324d",
          borderRadius: 16,
          background: "#11182b",
        }}
      >
        <h2>Upload Files</h2>

        <input
          type="file"
          multiple
          disabled
          style={{ marginTop: 12 }}
        />

        <p style={{ color: "#fbbf24", marginTop: 16 }}>
          {status}
        </p>

        <small>
          Storage must be connected before uploads are enabled.
        </small>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Website Files</h2>

        {files.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No files uploaded yet.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.key}>
                {file.name || file.key}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
