"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductPage({ params }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const res = await fetch(`/api/content/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setItem(data.item);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#020617",
          color: "#fff",
        }}
      >
        Loading product...
      </main>
    );
  }

  if (!item) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#020617",
          color: "#fff",
        }}
      >
        Product not found.
      </main>
    );
  }

  const image =
    item.thumbnailUrl ||
    item.downloadUrl ||
    "";

  const originalPrice = Number(item.buyPrice || 0);
  const salePrice = Number(item.salePrice || 0);

  const discount =
    originalPrice > 0 &&
    salePrice > 0 &&
    salePrice < originalPrice
      ? Math.round(
          ((originalPrice - salePrice) / originalPrice) * 100
        )
      : 0;

  const productUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://googleai-site.vercel.app/content/${item.id}`;

  const shareText = encodeURIComponent(
    `${item.title} - Check out this special offer!`
  );

  const encodedUrl = encodeURIComponent(productUrl);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(productUrl);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#4a044e 0,#0f172a 45%,#020617 100%)",
        color: "#fff",
        padding: "35px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <Link
          href="/garments"
          style={{
            color: "#f9a8d4",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          ← Back to Garments
        </Link>

        <article
          style={{
            marginTop: 25,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: 30,
            padding: 25,
            borderRadius: 24,
            background: "#111827",
            border: "1px solid rgba(236,72,153,.35)",
          }}
        >
          <div style={{ position: "relative" }}>
            {discount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 15,
                  left: 15,
                  zIndex: 2,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "#ec4899",
                  color: "#fff",
                  fontWeight: 900,
                }}
              >
                SALE • {discount}% OFF
              </div>
            )}

            {image ? (
              <img
                src={image}
                alt={item.title}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 18,
                  background: "#0f172a",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 18,
                  fontSize: 120,
                  background: "#0f172a",
                }}
              >
                👕
              </div>
            )}
          </div>

          <div>
            <div
              style={{
                color: "#f9a8d4",
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              GARMENT SALE
            </div>

            <h1
              style={{
                fontSize: "clamp(32px,5vw,52px)",
                lineHeight: 1.1,
                margin: "12px 0 18px",
              }}
            >
              {item.title}
            </h1>

            {item.description && (
              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                  fontSize: 17,
                }}
              >
                {item.description}
              </p>
            )}

            <div
              style={{
                marginTop: 22,
                padding: 20,
                borderRadius: 16,
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              {originalPrice > 0 && (
                <div
                  style={{
                    color: "#94a3b8",
                    textDecoration:
                      discount > 0 ? "line-through" : "none",
                    fontSize: 18,
                  }}
                >
                  Regular Price: Rs. {originalPrice.toLocaleString()}
                </div>
              )}

              {salePrice > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#86efac",
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  Sale Price: Rs. {salePrice.toLocaleString()}
                </div>
              )}

              {discount > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#fbbf24",
                    fontWeight: 900,
                  }}
                >
                  🔥 You save {discount}%
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: 20,
                padding: 16,
                textAlign: "center",
                borderRadius: 12,
                background: "#16a34a",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              🛍️ SHOP / ORDER ON WHATSAPP
            </a>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(150px,1fr))",
                gap: 10,
                marginTop: 15,
              }}
            >
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={shareButton}
              >
                Facebook
              </a>

              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={shareButton}
              >
                Telegram
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={shareButton}
              >
                X
              </a>

              <button
                onClick={copyLink}
                style={{
                  ...shareButton,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

const shareButton = {
  display: "block",
  padding: "12px",
  textAlign: "center",
  borderRadius: 10,
  background: "#1e293b",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 800,
};
