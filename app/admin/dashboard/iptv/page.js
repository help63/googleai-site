"use client";

import { useEffect, useMemo, useState } from "react";

export default function IPTVManager() {
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  async function load() {
    const res = await fetch("/api/admin/iptv");
    const data = await res.json();

    if (res.ok && data.success) {
      setChannels(data.channels || []);
      setMessage("");
    } else {
      setMessage("❌ Admin login required");
    }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setName("");
    setLogo("");
    setStreamUrl("");
    setCategory("General");
    setEditing(null);
  }

  function startEdit(channel) {
    setEditing(channel.id);
    setName(channel.name || "");
    setLogo(channel.logo || "");
    setStreamUrl(channel.streamUrl || "");
    setCategory(channel.category || "General");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  async function uploadLogo() {
    if (!logoFile) {
      setMessage("❌ Select logo first");
      return;
    }

    const form = new FormData();
    form.append("file", logoFile);

    const res = await fetch("/api/admin/iptv-logo", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.success) {
      setLogo(data.url);
      setMessage("✅ Logo uploaded");
    } else {
      setMessage("❌ " + (data.error || "Upload failed"));
    }
  }

  async function saveChannel(e) {
    e.preventDefault();
    setMessage("");

    const method = editing ? "PUT" : "POST";

    const body = {
      name,
      logo,
      streamUrl,
      category,
    };

    if (editing) body.id = editing;

    const res = await fetch("/api/admin/iptv", {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage("❌ " + (data.error || "Save failed"));
      return;
    }

    setChannels(data.channels || []);
    setMessage(editing ? "✅ Channel updated" : "✅ Channel added");
    resetForm();
  }

  async function toggleChannel(channel) {
    const res = await fetch("/api/admin/iptv", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: channel.id,
        enabled: channel.enabled === false,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setChannels(data.channels || []);
    }
  }

  async function deleteChannel(id) {
    if (!confirm("Delete this channel?")) return;

    const res = await fetch("/api/admin/iptv", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      setChannels(data.channels || []);
      setMessage("✅ Channel deleted");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return channels.filter(
      (channel) =>
        !q ||
        channel.name?.toLowerCase().includes(q)
    );
  }, [channels, search]);

  return (
    <main
      style={{
        maxWidth: 1050,
        margin: "auto",
        padding: 24,
      }}
    >
      <h1>📡 IPTV Channel Manager</h1>

      <p>Admin-only channel management.</p>

      <form
        onSubmit={saveChannel}
        style={{
          padding: 20,
          borderRadius: 14,
          border: "1px solid #ddd",
          marginTop: 20,
        }}
      >
        <h2>{editing ? "✏️ Edit Channel" : "➕ Add Channel"}</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Channel name"
          required
          style={inputStyle}
        />

        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="Logo URL (optional)"
          style={inputStyle}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
          style={inputStyle}
        />

        <button
          type="button"
          onClick={uploadLogo}
          style={buttonStyle}
        >
          📤 Upload Logo
        </button>

        <input
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          placeholder="Authorized stream URL"
          required
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="General">General</option>
          <option value="News">News</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Kids">Kids</option>
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
        </select>

        <button style={buttonStyle} type="submit">
          {editing ? "💾 Update Channel" : "📺 Add Channel"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              ...buttonStyle,
              marginLeft: 10,
            }}
          >
            Cancel
          </button>
        )}

        {message && <p>{message}</p>}
      </form>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔎 Search channels..."
        style={inputStyle}
      />

      <section style={{ marginTop: 25 }}>
        <h2>Channels ({filtered.length})</h2>

        {filtered.map((channel) => (
          <div
            key={channel.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 15,
              flexWrap: "wrap",
              padding: 15,
              marginBottom: 10,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          >
            <div>
              <strong>
                {channel.enabled === false ? "⚫" : "🟢"}{" "}
                {channel.name}
              </strong>
              <br />
              <small>
                {channel.enabled === false
                  ? "Disabled"
                  : "Enabled"}{" • "}
                {channel.category || "General"}
              </small>
            </div>

            <div>
              <button
                onClick={() => toggleChannel(channel)}
                style={buttonStyle}
              >
                {channel.enabled === false
                  ? "▶️ Enable"
                  : "⏸️ Disable"}
              </button>

              <button
                onClick={() => startEdit(channel)}
                style={{
                  ...buttonStyle,
                  marginLeft: 8,
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteChannel(channel.id)}
                style={{
                  ...buttonStyle,
                  marginLeft: 8,
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 9,
  border: "1px solid #bbb",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #999",
  cursor: "pointer",
  fontWeight: "bold",
};
}
