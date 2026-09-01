"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  country: "",
  region: "",
  language: "",
  logo: "",
  url: "",
  enabled: true,
};

export default function IPTVManager() {
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadChannels() {
    try {
      const res = await fetch("/api/tv", { cache: "no-store" });
      const data = await res.json();
      setChannels(Array.isArray(data) ? data : []);
    } catch {
      setMessage("❌ Channels load nahi ho sake.");
    }
  }

  useEffect(() => {
    loadChannels();
  }, []);

  function change(key, value) {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  }

  async function addChannel(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.url.trim()) {
      setMessage("❌ Channel name aur stream URL required hain.");
      return;
    }

    setLoading(true);
    setMessage("Adding channel...");

    try {
      const res = await fetch("/api/tv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (data.error || "Channel add failed"));
        return;
      }

      setMessage("✅ Channel added successfully.");
      setForm(emptyForm);
      await loadChannels();
    } catch {
      setMessage("❌ Request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteChannel(id) {
    if (!confirm("Delete this channel?")) return;

    try {
      const res = await fetch("/api/tv", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage("❌ " + (data.error || "Delete failed"));
        return;
      }

      setMessage("✅ Channel deleted.");
      await loadChannels();
    } catch {
      setMessage("❌ Delete request failed.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 25,
        background: "#0b1020",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <h1>📺 IPTV Manager</h1>

        <p style={{ color: "#94a3b8" }}>
          Admin-only Live TV channel management
        </p>

        {message && (
          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              border: "1px solid #334155",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={addChannel}
          style={{
            marginTop: 25,
            padding: 22,
            borderRadius: 18,
            background: "#111827",
            border: "1px solid #29324d",
          }}
        >
          <h2>➕ Add IPTV Channel</h2>

          <Field
            label="Channel Name *"
            value={form.name}
            onChange={(v) => change("name", v)}
            placeholder="Example: My TV"
          />

          <Field
            label="Stream URL *"
            value={form.url}
            onChange={(v) => change("url", v)}
            placeholder="https://example.com/stream.m3u8"
          />

          <Field
            label="Logo URL"
            value={form.logo}
            onChange={(v) => change("logo", v)}
            placeholder="https://example.com/logo.png"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
            }}
          >
            <Field
              label="Country"
              value={form.country}
              onChange={(v) => change("country", v)}
              placeholder="Pakistan"
            />

            <Field
              label="Region"
              value={form.region}
              onChange={(v) => change("region", v)}
              placeholder="Asia"
            />

            <Field
              label="Language"
              value={form.language}
              onChange={(v) => change("language", v)}
              placeholder="Urdu"
            />
          </div>

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              margin: "15px 0",
            }}
          >
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) =>
                change("enabled", e.target.checked)
              }
            />
            Channel enabled on public TV page
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              border: 0,
              borderRadius: 10,
              cursor: loading ? "wait" : "pointer",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {loading ? "⏳ Adding..." : "➕ Add Channel"}
          </button>
        </form>

        <section style={{ marginTop: 30 }}>
          <h2>📡 Existing Channels</h2>

          {channels.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No channels added yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: 15,
              }}
            >
              {channels.map((channel) => (
                <article
                  key={channel.id}
                  style={{
                    padding: 18,
                    borderRadius: 15,
                    background: "#111827",
                    border: "1px solid #29324d",
                  }}
                >
                  {channel.logo && (
                    <img
                      src={channel.logo}
                      alt=""
                      style={{
                        width: 80,
                        height: 55,
                        objectFit: "contain",
                        marginBottom: 10,
                      }}
                    />
                  )}

                  <h3>{channel.name}</h3>

                  <p style={{ color: "#94a3b8" }}>
                    🌍 {channel.country || "International"}
                    <br />
                    🗣️ {channel.language || "English"}
                    <br />
                    {channel.enabled === false
                      ? "🔴 Disabled"
                      : "🟢 Enabled"}
                  </p>

                  <button
                    onClick={() =>
                      deleteChannel(channel.id)
                    }
                    style={{
                      padding: "9px 13px",
                      border: 0,
                      borderRadius: 8,
                      background: "#dc2626",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    🗑️ Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 15,
      }}
    >
      <span>{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          padding: 12,
          marginTop: 7,
          borderRadius: 9,
          border: "1px solid #475569",
          background: "#0f172a",
          color: "#fff",
        }}
      />
    </label>
  );
}
