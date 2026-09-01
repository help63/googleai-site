"use client";

import AdManager from "./components/AdManager";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdSlot from "../components/AdSlot";

const sections = [
  ["🤖", "AI Tools", "/"],
  ["🛒", "Shopping", "/shopping"],
  ["📱", "Mobiles", "/mobiles"],
  ["💻", "Electronics", "/electronics"],
  ["💼", "Jobs", "/jobs"],
  ["👕", "Garments", "/garments"],
  ["🏏", "Cricket", "/articles"],
  ["📺", "Live TV", "/tv"],
  ["📡", "IPTV", "/iptv"],
  ["📝", "Articles", "/articles"],
  ["🍳", "Recipes", "/recipes"],
  ["✈️", "Travel", "/travel"],
  ["☪️", "Islam", "/articles"],
  ["🎬", "Videos", "/videos"],
  ["📦", "Content Manager", "/downloads"],
  ["📁", "Files", "/downloads"],
  ["📰", "News", "/articles"],
];

export default function HomePage() {
  const [content, setContent] = useState([]);
  const [tvChannels, setTvChannels] = useState([]);
  const [logo, setLogo] = useState(null);
  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetch("/api/content", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),

      fetch("/api/tv", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),

      fetch("/api/site-settings", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([contentData, tvData, settings]) => {
      if (!alive) return;

      if (contentData?.success) {
        setContent(contentData.items || []);
      }

      if (tvData?.success) {
        setTvChannels(tvData.channels || tvData.items || []);
      }

      if (settings) {
        setLogo(settings.logo || null);
        setLinks(Array.isArray(settings.links) ? settings.links : []);
        setVideos(Array.isArray(settings.videos) ? settings.videos : []);
      }

      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = content.filter((item) => {
    const type = String(item.type || "").toLowerCase();
    const q = search.toLowerCase().trim();

    const categoryOK =
      category === "all" || type === category;

    const searchOK =
      !q ||
      String(item.title || "").toLowerCase().includes(q) ||
      String(item.description || "").toLowerCase().includes(q) ||
      type.includes(q);

    return categoryOK && searchOK;
  });

  const iconFor = (type) => {
    if (type === "game") return "🎮";
    if (type === "movie") return "🎬";
    if (type === "apk") return "📱";
    if (type === "file") return "📁";
    return "📦";
  };

  return (
    <>
    <AdManager provider="Google AdSense" slot="home-top" />

    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#312e81 0,#0f172a 35%,#020617 100%)",
        color: "#fff",
      }}
    >
      <AdSlot title="Advertisement Top" />

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(2,6,23,.94)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <div
          style={{
            maxWidth: 1250,
            margin: "auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: 23,
              fontWeight: 950,
            }}
          >
            {logo?.url ? (
              <img
                src={logo.url}
                alt={logo.title || "Logo"}
                style={{
                  maxWidth: 190,
                  maxHeight: 55,
                  objectFit: "contain",
                  verticalAlign: "middle",
                }}
              />
            ) : (
              "🚀 GoogleAI Site"
            )}
          </Link>

          <nav
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="navBtn">🏠 Home</Link>
            <Link href="/tv" className="navBtn">📺 Live TV</Link>
            <Link href="/iptv" className="navBtn">📡 IPTV</Link>
            <Link href="/downloads" className="navBtn">📥 Downloads</Link>
            <Link href="/about" className="navBtn">ℹ️ About</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 1250,
          margin: "auto",
          padding: "70px 18px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 15px",
            borderRadius: 30,
            background: "rgba(124,58,237,.2)",
            border: "1px solid #7c3aed",
            color: "#c4b5fd",
            fontWeight: 900,
          }}
        >
          ✨ Welcome to GoogleAI Site
        </div>

        <h1
          style={{
            fontSize: "clamp(40px,7vw,76px)",
            lineHeight: 1.02,
            margin: "20px 0",
            fontWeight: 950,
          }}
        >
          Your All-in-One
          <br />
          <span style={{ color: "#a78bfa" }}>
            Digital Portal
          </span>
        </h1>

        <p
          style={{
            maxWidth: 760,
            margin: "0 auto",
            color: "#cbd5e1",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          AI Tools, Games, Movies, APKs, Files, News,
          Shopping, Live TV, IPTV and much more.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Search website content..."
          style={{
            width: "min(700px,100%)",
            boxSizing: "border-box",
            marginTop: 30,
            padding: 16,
            borderRadius: 14,
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff",
            fontSize: 16,
            outline: "none",
          }}
        />
      </section>

      {/* ALL WEBSITE SECTIONS */}
      <section
        style={{
          maxWidth: 1250,
          margin: "auto",
          padding: "10px 18px 45px",
        }}
      >
        <h2 style={{ fontSize: 28 }}>
          🌐 Explore Website
        </h2>

        <p style={{ color: "#94a3b8" }}>
          All website sections are available for visitors.
          Management controls remain private to the administrator.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginTop: 20,
          }}
        >
          {sections.map(([icon, name, href]) => (
            <Link
              key={name}
              href={href}
              style={{
                padding: 20,
                borderRadius: 17,
                textDecoration: "none",
                color: "#fff",
                background:
                  "linear-gradient(145deg,#111827,#1e293b)",
                border: "1px solid #29324d",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,.18)",
                transition: "transform .2s",
              }}
            >
              <div style={{ fontSize: 34 }}>
                {icon}
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 16,
                }}
              >
                {name}
              </strong>

              <small
                style={{
                  display: "block",
                  marginTop: 6,
                  color: "#94a3b8",
                }}
              >
                Open →
              </small>
            </Link>
          ))}
        </div>
      </section>

      {/* DOWNLOAD CONTENT */}
      <section
        style={{
          maxWidth: 1250,
          margin: "auto",
          padding: "20px 18px 55px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 15,
          }}
        >
          <div>
            <h2>📥 Latest Content</h2>
            <p style={{ color: "#94a3b8" }}>
              Games, Movies, APKs and Files
            </p>
          </div>

          <Link
            href="/downloads"
            style={{
              padding: "11px 17px",
              borderRadius: 10,
              background: "#7c3aed",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            View All →
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            margin: "18px 0",
          }}
        >
          {[
            ["all", "📦 All"],
            ["game", "🎮 Games"],
            ["movie", "🎬 Movies"],
            ["apk", "📱 APKs"],
            ["file", "📁 Files"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              style={{
                padding: "9px 15px",
                borderRadius: 20,
                border: "1px solid #475569",
                background:
                  category === value
                    ? "#7c3aed"
                    : "#0f172a",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="emptyBox">
            Loading content...
          </div>
        ) : filtered.length === 0 ? (
          <div className="emptyBox">
            No content available yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
            }}
          >
            {filtered.slice(0, 12).map((item) => (
              <article
                key={item.id}
                style={{
                  overflow: "hidden",
                  borderRadius: 16,
                  background: "#111827",
                  border: "1px solid #29324d",
                }}
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title || "Content"}
                    style={{
                      width: "100%",
                      height: 145,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 145,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 52,
                      background:
                        "linear-gradient(135deg,#312e81,#111827)",
                    }}
                  >
                    {iconFor(item.type)}
                  </div>
                )}

                <div style={{ padding: 15 }}>
                  <small
                    style={{
                      color: "#a78bfa",
                      fontWeight: 900,
                    }}
                  >
                    {String(item.type || "content").toUpperCase()}
                  </small>

                  <h3 style={{ margin: "7px 0" }}>
                    {item.title || "Untitled"}
                  </h3>

                  {item.description && (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: 14,
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      download
                      style={{
                        display: "block",
                        marginTop: 12,
                        padding: 11,
                        textAlign: "center",
                        borderRadius: 9,
                        background: "#16a34a",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 900,
                      }}
                    >
                      ⬇️ Download
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* LIVE TV */}
      <section
        style={{
          maxWidth: 1250,
          margin: "auto",
          padding: "0 18px 55px",
        }}
      >
        <div
          style={{
            padding: 25,
            borderRadius: 20,
            background:
              "linear-gradient(135deg,#111827,#1e1b4b)",
            border: "1px solid #334155",
          }}
        >
          <h2>📺 Live TV / IPTV</h2>

          <p style={{ color: "#94a3b8" }}>
            Public channel viewing.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            {tvChannels
              .filter((c) => c.enabled !== false)
              .slice(0, 8)
              .map((channel) => (
                <Link
                  key={channel.id}
                  href="/tv"
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#0f172a",
                    color: "#fff",
                    textDecoration: "none",
                    border: "1px solid #29324d",
                  }}
                >
                  📺 {channel.name}
                </Link>
              ))}
          </div>

          <Link
            href="/tv"
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "11px 18px",
              borderRadius: 10,
              background: "#dc2626",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            ▶ Open Live TV
          </Link>
        </div>
      </section>

      {/* CUSTOM LINKS */}
      {links.length > 0 && (
        <section
          style={{
            maxWidth: 1250,
            margin: "auto",
            padding: "0 18px 55px",
          }}
        >
          <h2>🔗 Useful Links</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
            }}
          >
            {links.map((item) => (
              <a
                key={item.id || item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  border: "1px solid #29324d",
                }}
              >
                🔗 {item.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section
          style={{
            maxWidth: 1250,
            margin: "auto",
            padding: "0 18px 55px",
          }}
        >
          <h2>🎬 Latest Videos</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 15,
            }}
          >
            {videos.slice(0, 8).map((video) => (
              <a
                key={video.id || video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 20,
                  borderRadius: 15,
                  background: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  border: "1px solid #29324d",
                }}
              >
                🎬 {video.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ADMIN NOTICE */}
      <section
        style={{
          maxWidth: 1250,
          margin: "0 auto 50px",
          padding: "0 18px",
        }}
      >
        <div
          style={{
            padding: 22,
            borderRadius: 18,
            background:
              "linear-gradient(135deg,#172554,#312e81)",
            border: "1px solid #4338ca",
            textAlign: "center",
          }}
        >
          <strong>🔐 Website Management</strong>
          <p
            style={{
              color: "#cbd5e1",
              marginBottom: 0,
            }}
          >
            Public visitors can view and use the website.
            Adding, editing, deleting, uploading and saving
            website content is restricted to the Admin Dashboard.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,.1)",
          padding: "30px 18px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        <p>
          © {new Date().getFullYear()} GoogleAI Site
        </p>
        <p style={{ fontSize: 13 }}>
          Public Website • Private Admin Controls
        </p>
      </footer>

      <style jsx>{`
        .navBtn {
          color: #cbd5e1;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 8px;
        }

        .navBtn:hover {
          background: rgba(124,58,237,.2);
          color: white;
        }

        .emptyBox {
          padding: 40px;
          text-align: center;
          border-radius: 16px;
          background: #111827;
          color: #94a3b8;
        }
      `}</style>
    </main>
    </>
  );
}
