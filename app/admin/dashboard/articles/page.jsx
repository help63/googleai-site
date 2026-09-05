"use client";

import { useState } from "react";

export default function ArticleEditor() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Artificial Intelligence");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function publishArticle(e) {
    e.preventDefault();

    setMessage("");

    if (!title.trim() || !content.trim()) {
      setMessage("❌ Please enter article title and content.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/articles", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          category,
          content
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to publish article");
      }

      setMessage(`✅ Article published successfully!`);

      setTitle("");
      setContent("");

    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080d1a",
      color: "white",
      padding: "30px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "auto"
      }}>
        <a
          href="/admin/dashboard"
          style={{
            color: "#60a5fa",
            textDecoration: "none"
          }}
        >
          ← Back to Dashboard
        </a>

        <h1 style={{
          fontSize: 32,
          marginTop: 25
        }}>
          ✍️ Write New Article
        </h1>

        <p style={{
          color: "#94a3b8"
        }}>
          Write and publish a new article to your website.
        </p>

        <form
          onSubmit={publishArticle}
          style={{
            marginTop: 25,
            padding: 25,
            background: "#111827",
            borderRadius: 15,
            border: "1px solid #334155"
          }}
        >

          <label style={{ display: "block", marginBottom: 8 }}>
            Article Title *
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            style={{
              width: "100%",
              padding: 14,
              boxSizing: "border-box",
              borderRadius: 8,
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
              marginBottom: 20
            }}
          />

          <label style={{ display: "block", marginBottom: 8 }}>
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
              marginBottom: 20
            }}
          >
            <option>Artificial Intelligence</option>
            <option>Technology</option>
            <option>AI Tools</option>
            <option>AI Security</option>
            <option>Pakistan Politics</option>
            <option>News</option>
          </select>

          <label style={{ display: "block", marginBottom: 8 }}>
            Article Content *
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your complete article here..."
            rows={18}
            style={{
              width: "100%",
              padding: 14,
              boxSizing: "border-box",
              borderRadius: 8,
              border: "1px solid #475569",
              background: "#0f172a",
              color: "white",
              resize: "vertical",
              marginBottom: 20
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 16,
              border: "none",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg,#7c3aed,#2563eb)",
              color: "white",
              fontWeight: 800,
              fontSize: 16
            }}
          >
            {loading ? "Publishing..." : "🚀 Publish Article"}
          </button>

          {message && (
            <p style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 8,
              background: "#0f172a"
            }}>
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  );
}
