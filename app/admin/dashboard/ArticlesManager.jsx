"use client";

import { useEffect, useState } from "react";

export default function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingArticle, setEditingArticle] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/articles", {
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load articles");
      }

      setArticles(data.articles || []);

    } catch (err) {
      setError(err.message || "Failed to load articles");

    } finally {
      setLoading(false);
    }
  }

  function startEdit(article) {
    setEditingArticle(article);
    setEditTitle(article.title || "");
    setEditCategory(article.category || "");
    setEditContent(article.content || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function cancelEdit() {
    setEditingArticle(null);
    setEditTitle("");
    setEditCategory("");
    setEditContent("");
  }

  async function saveArticle() {
    if (!editingArticle) return;

    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/articles", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: editingArticle.id,
          title: editTitle.trim(),
          category: editCategory.trim(),
          content: editContent.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update article");
      }

      setArticles((current) =>
        current.map((article) =>
          article.id === editingArticle.id
            ? {
                ...article,
                title: editTitle.trim(),
                category: editCategory.trim(),
                content: editContent.trim(),
                slug: data.article?.slug || article.slug,
                updatedAt: data.article?.updatedAt || article.updatedAt
              }
            : article
        )
      );

      cancelEdit();

      alert("Article updated successfully!");

    } catch (err) {
      alert(err.message || "Failed to update article");

    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id, title) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/articles", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete article");
      }

      setArticles((current) =>
        current.filter((article) => article.id !== id)
      );

      if (editingArticle?.id === id) {
        cancelEdit();
      }

    } catch (err) {
      alert(err.message || "Failed to delete article");
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <section style={{
      marginTop: 30,
      padding: 24,
      borderRadius: 14,
      background: "#111827",
      border: "1px solid #334155"
    }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        flexWrap: "wrap",
        marginBottom: 20
      }}>
        <div>
          <h2 style={{ margin: 0 }}>
            📝 Database Articles
          </h2>

          <p style={{ color: "#94a3b8", marginBottom: 0 }}>
            Articles stored in Neon PostgreSQL
          </p>
        </div>

        <button
          onClick={loadArticles}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: 700
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {editingArticle && (
        <div style={{
          marginBottom: 25,
          padding: 20,
          borderRadius: 12,
          background: "#0f172a",
          border: "1px solid #7c3aed"
        }}>
          <h2 style={{ marginTop: 0 }}>
            ✏️ Edit Article
          </h2>

          <p style={{
            color: "#94a3b8",
            fontSize: 13
          }}>
            Editing: {editingArticle.slug}
          </p>

          <label style={{ display: "block", marginBottom: 8 }}>
            Title
          </label>

          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 18,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              boxSizing: "border-box"
            }}
          />

          <label style={{ display: "block", marginBottom: 8 }}>
            Category
          </label>

          <input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 18,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              boxSizing: "border-box"
            }}
          />

          <label style={{ display: "block", marginBottom: 8 }}>
            Content
          </label>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={14}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 18,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              boxSizing: "border-box",
              resize: "vertical",
              lineHeight: 1.6
            }}
          />

          <div style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}>
            <button
              onClick={saveArticle}
              disabled={saving}
              style={{
                padding: "12px 18px",
                background: saving ? "#475569" : "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 700
              }}
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>

            <button
              onClick={cancelEdit}
              disabled={saving}
              style={{
                padding: "12px 18px",
                background: "#475569",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p style={{ color: "#94a3b8" }}>
          Loading articles...
        </p>
      )}

      {error && (
        <p style={{ color: "#ef4444" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && articles.length === 0 && (
        <p style={{ color: "#94a3b8" }}>
          No articles found.
        </p>
      )}

      {!loading && !error && articles.map((article) => (
        <div
          key={article.id}
          style={{
            padding: 18,
            marginBottom: 12,
            borderRadius: 10,
            background: "#0f172a",
            border: "1px solid #1e293b"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 15,
            flexWrap: "wrap"
          }}>
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                {article.title}
              </h3>

              <div style={{
                color: "#94a3b8",
                fontSize: 14
              }}>
                📂 {article.category}
                {" · "}
                📅 {new Date(article.publishedAt).toLocaleDateString()}
              </div>

              <div style={{
                marginTop: 8,
                color: "#64748b",
                fontSize: 13,
                wordBreak: "break-all"
              }}>
                /news/{article.slug}
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              height: "fit-content"
            }}>
              <a
                href={`/news/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 14px",
                  background: "#16a34a",
                  color: "white",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 700
                }}
              >
                👁 View
              </a>

              <button
                onClick={() => startEdit(article)}
                style={{
                  padding: "10px 14px",
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deleteArticle(article.id, article.title)}
                style={{
                  padding: "10px 14px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
