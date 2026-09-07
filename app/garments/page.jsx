"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GarmentsPage() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?type=garment", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setGarments(data.items || []))
      .catch(() => setGarments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        color: "#1c1e21",
        padding: "25px 0 50px",
      }}
    >
      <section style={{ maxWidth: 1250, margin: "auto", padding: "0 14px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px",
            marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,.15)",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#1877f2",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            ← Back to Home
          </Link>

          <h1 style={{ margin: "15px 0 5px", fontSize: 32 }}>
            🛍️ Latest Garments
          </h1>

          <p style={{ color: "#65676b", margin: 0 }}>
            Latest clothing products and special sale offers.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              background: "#fff",
              borderRadius: 14,
            }}
          >
            Loading products...
          </div>
        ) : garments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              background: "#fff",
              borderRadius: 14,
            }}
          >
            No garments available yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
            }}
          >
            {garments.map((item) => {
              const oldPrice = Number(item.buyPrice || 0);
              const salePrice = Number(item.salePrice || 0);

              const discount =
                oldPrice > 0 && salePrice > 0 && salePrice < oldPrice
                  ? Math.round(((oldPrice - salePrice) / oldPrice) * 100)
                  : 0;

              return (
                <article
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,.16)",
                    border: "1px solid #ddd",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: "#f5f0e6",
                    }}
                  >
                    {discount > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          left: 14,
                          zIndex: 2,
                          background: "#fff",
                          padding: "8px 14px",
                          fontWeight: 900,
                          fontSize: 18,
                          boxShadow: "0 1px 5px rgba(0,0,0,.15)",
                        }}
                      >
                        {discount}% OFF
                      </div>
                    )}

                    {!discount && (
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          left: 14,
                          zIndex: 2,
                          background: "#fff",
                          padding: "8px 14px",
                          fontWeight: 900,
                          fontSize: 18,
                        }}
                      >
                        Sale
                      </div>
                    )}

                    {(item.thumbnailUrl || item.downloadUrl) ? (
                      <img
                        src={item.thumbnailUrl || item.downloadUrl}
                        alt={item.title || "Garment"}
                        style={{
                          width: "100%",
                          height: 330,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 330,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 100,
                        }}
                      >
                        👕
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "16px 18px 18px" }}>
                    <h2
                      style={{
                        margin: "0 0 10px",
                        fontSize: 22,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title || "Untitled Product"}
                    </h2>

                    {item.description && (
                      <p
                        style={{
                          color: "#65676b",
                          margin: "0 0 14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    {salePrice > 0 && (
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#111",
                          marginBottom: 5,
                        }}
                      >
                        Rs. {salePrice.toLocaleString()}
                      </div>
                    )}

                    {oldPrice > 0 && (
                      <div
                        style={{
                          color: "#65676b",
                          textDecoration: salePrice > 0 ? "line-through" : "none",
                          marginBottom: 15,
                        }}
                      >
                        Rs. {oldPrice.toLocaleString()}
                      </div>
                    )}

                    <Link
                      href={`/content/${item.id}`}
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: "13px 15px",
                        borderRadius: 10,
                        background: "#e4e6eb",
                        color: "#050505",
                        textDecoration: "none",
                        fontWeight: 900,
                        fontSize: 17,
                      }}
                    >
                      Shop now
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
