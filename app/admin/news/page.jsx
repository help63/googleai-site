"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsAdmin() {
  const router = useRouter();

  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("AI");
  const [image, setImage] = useState("");
  const [editSlug, setEditSlug] = useState(null);
  const [message, setMessage] = useState("");

  async function loadNews() {
    const res = await fetch("/api/news");

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json();
    setNews(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadNews();
  }, []);

  function resetForm() {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("AI");
    setImage("");
    setEditSlug(null);
  }

  async function saveNews() {
    if (!title.trim()) {
      setMessage("Title required");
      return;
    }

    const slug =
      editSlug ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const body = {
      slug,
      title,
      excerpt,
      content: content || excerpt,
      category,
      author: "GoogleAi Team",
      createdAt: new Date().toISOString(),
      image
    };

    const res = await fetch("/api/news", {
      method: editSlug ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setMessage(editSlug ? "News updated" : "News added");
      resetForm();
      loadNews();
    } else {
      setMessage("Operation failed");
    }
  }

  function editNews(item) {
    setEditSlug(item.slug);
    setTitle(item.title || "");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setCategory(item.category || "AI");
    setImage(item.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function deleteNews(slug) {
    if (!confirm("Delete this news?")) return;

    const res = await fetch("/api/news", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slug })
    });

    if (res.ok) {
      setMessage("News deleted");
      loadNews();
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    router.push("/admin/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 30,
        maxWidth: 1000,
        margin: "auto"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          flexWrap: "wrap"
        }}
      >
        <h1>📰 News Admin</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      {message && (
        <p
          style={{
            padding: 12,
            background: "#172554",
            borderRadius: 8
          }}
        >
          {message}
        </p>
      )}

      <section
        style={{
          padding: 20,
          border: "1px solid #334155",
          borderRadius: 15,
          marginTop: 20
        }}
      >
        <h2>
          {editSlug ? "Edit News" : "Add News"}
        </h2>

        <input
          placeholder="News title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12
          }}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12
          }}
        />

        <input
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12
          }}
        />

        <textarea
          placeholder="Short description"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12
          }}
        />

        <textarea
          placeholder="Full news content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12
          }}
        />

        <button onClick={saveNews}>
          {editSlug ? "Update News" : "Add News"}
        </button>

        {editSlug && (
          <button
            onClick={resetForm}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Published News</h2>

        {news.length === 0 && (
          <p>No news available.</p>
        )}

        {news.map((item) => (
          <article
            key={item.slug}
            style={{
              marginTop: 15,
              padding: 18,
              border: "1px solid #334155",
              borderRadius: 12
            }}
          >
            <h3>{item.title}</h3>

            <p>{item.excerpt}</p>

            <small>
              {item.category} · {item.author}
            </small>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => editNews(item)}>
                Edit
              </button>

              <button
                onClick={() => deleteNews(item.slug)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
