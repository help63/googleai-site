"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GarmentsPage() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?type=garment", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setGarments(data.items || []);
      })
      .catch(() => {
        setGarments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 18px",
        background:
          "radial-gradient(circle at top,#4a044e 0,#0f172a 45%,#020617 100%)",
        color: "#fff",
      }}
    >
      <section
        style={{
          maxWidth: 1250,
          margin: "auto",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#f9a8d4",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          ← Back to Home
        </Link>

        <div
          style={{
            marginTop: 25,
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px,6vw,60px)",
              marginBottom: 10,
            }}
          >
            👕 Garments
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: 17 }}>
            Explore our latest clothing and fashion products.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#cbd5e1" }}>
            Loading garments...
          </div>
        ) : garments.length === 0 ? (
          <div
            style={{
              padding: 30,
              borderRadius: 16,
              background: "#111827",
              border: "1px solid #29324d",
              color: "#94a3b8",
            }}
          >
            No garments available yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {garments.map((item) => (
              <article
                key={item.id}
                style={{
                  overflow: "hidden",
                  borderRadius: 18,
                  background: "#111827",
                  border: "1px solid rgba(236,72,153,.35)",
                }}
              >
                {(item.thumbnailUrl || item.downloadUrl) ? (
                  <img
                    src={item.thumbnailUrl || item.downloadUrl}
                    alt={item.title || "Garment"}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 280,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 90,
                      background:
                        "linear-gradient(135deg,#831843,#111827)",
                    }}
                  >
                    👕
                  </div>
                )}

                <div style={{ padding: 18 }}>
                  <small
                    style={{
                      color: "#f9a8d4",
                      fontWeight: 900,
                    }}
                  >
                    GARMENT
                  </small>

                  <h2 style={{ margin: "8px 0 10px" }}>
                    {item.title || "Untitled Garment"}
                  </h2>

                  {item.description && (
                    <p
                      style={{
                        color: "#94a3b8",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  {(item.buyPrice !== null && item.buyPrice !== undefined && item.buyPrice !== "") && (
                    <p style={{ color: "#94a3b8", margin: "10px 0 0" }}>
                      💰 Buy Price: Rs. {item.buyPrice}
                    </p>
                  )}

                  {(item.salePrice !== null && item.salePrice !== undefined && item.salePrice !== "") && (
                    <p style={{ color: "#86efac", fontWeight: 900, fontSize: 19, margin: "6px 0 0" }}>
                      🏷️ Sale Price: Rs. {item.salePrice}
                    </p>
                  )}

                  {item.buyPrice !== null &&
                    item.buyPrice !== undefined &&
                    item.buyPrice !== "" &&
                    item.salePrice !== null &&
                    item.salePrice !== "" &&
                    item.salePrice !== undefined && (
                      <p style={{ fontWeight: 900, margin: "6px 0 0" }}>
                        📈 Profit: Rs. {Number(item.salePrice) - Number(item.buyPrice)}
                      </p>
                  )}

                  <Link
                    href={`/content/${item.id}`}
                    style={{
                      display: "block",
                      marginTop: 16,
                      padding: 12,
                      textAlign: "center",
                      borderRadius: 10,
                      background: "#ec4899",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 900,
                    }}
                  >
                    👁️ View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
