"use client";

import { useEffect, useState } from "react";

const categories = [
  "Latest",
  "Pakistan",
  "World",
  "Sports",
  "Entertainment",
  "Business",
  "Technology",
  "Health",
  "Science",
  "Videos"
];

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Latest",
    image: "",
    author: "GoogleAI News",
    breaking: false,
    featured: false
  });

  async function loadNews() {
    setLoading(true);

    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      setMessage("News load nahi ho saki.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  function update(field, value) {
    setForm((old) => ({ ...old, [field]: value }));
  }

  async function publish(e) {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Title required hai.");
      return;
    }

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Publish failed.");
      return;
    }

    setMessage("✓ News successfully published.");

    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "Latest",
      image: "",
      author: "GoogleAI News",
      breaking: false,
      featured: false
    });

    loadNews();
  }

  async function remove(id) {
    if (!confirm("Is article ko delete karna hai?")) return;

    const res = await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      setMessage("Article deleted.");
      loadNews();
    }
  }

  return (
    <section className="news-admin">
      <div className="admin-panel">
        <h2>📰 Publish News</h2>

        <form onSubmit={publish}>
          <input
            placeholder="News headline"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <input
            placeholder="Short excerpt"
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
          />

          <textarea
            placeholder="Full news content"
            rows={9}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
          />

          <div className="admin-form-grid">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              placeholder="Author"
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
            />
          </div>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={form.breaking}
                onChange={(e) => update("breaking", e.target.checked)}
              />
              Breaking News
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />
              Featured
            </label>
          </div>

          <button className="publish-btn" type="submit">
            Publish Article
          </button>

          {message && <p className="admin-message">{message}</p>}
        </form>
      </div>

      <div className="admin-panel">
        <h2>Published News ({news.length})</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !news.length ? (
          <p style={{ color: "#94a3b8" }}>Abhi koi article publish nahi hua.</p>
        ) : (
          <div className="admin-news-list">
            {news.map((item) => (
              <div className="admin-news-item" key={item.id}>
                <div>
                  <small>{item.category}</small>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
