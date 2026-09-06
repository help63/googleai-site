import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

async function getItem(id) {
  try {
    const file = path.join(process.cwd(), "data", "content.json");
    const items = JSON.parse(await fs.readFile(file, "utf8"));

    return items.find(
      (item) =>
        item.id === id &&
        item.published !== false
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return {
      title: "Content Not Found",
    };
  }

  return {
    title: `${item.title} | GoogleAI Site`,
    description:
      item.description ||
      `Download ${item.title} from GoogleAI Site.`,
    alternates: {
      canonical: `https://googleai-site.vercel.app/content/${item.id}`,
    },
  };
}

export default async function ContentPage({ params }) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) notFound();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#fff",
        padding: "50px 20px",
      }}
    >
      <article
        style={{
          maxWidth: 850,
          margin: "auto",
          padding: 30,
          borderRadius: 20,
          background: "#111827",
          border: "1px solid #29324d",
        }}
      >
        <div
          style={{
            color: "#a78bfa",
            fontWeight: 800,
          }}
        >
          {String(item.type || "content").toUpperCase()}
        </div>

        <h1>{item.title}</h1>

        {item.description && (
          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            {item.description}
          </p>
        )}

        {(item.thumbnailUrl || item.downloadUrl) && (
          <img
            src={item.thumbnailUrl || item.downloadUrl}
            alt={item.title}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              borderRadius: 14,
              margin: "20px 0",
            }}
          />
        )}

        {item.type === "garment" && (
          <div
            style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 14,
              background: "#0f172a",
              border: "1px solid #334155",
            }}
          >
            {item.buyPrice !== null &&
              item.buyPrice !== undefined &&
              item.buyPrice !== "" && (
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 16,
                  }}
                >
                  💰 Buy Price: Rs. {item.buyPrice}
                </div>
              )}

            {item.salePrice !== null &&
              item.salePrice !== undefined &&
              item.salePrice !== "" && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#86efac",
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  🏷️ Sale Price: Rs. {item.salePrice}
                </div>
              )}

            {item.buyPrice !== null &&
              item.buyPrice !== undefined &&
              item.buyPrice !== "" &&
              item.salePrice !== null &&
              item.salePrice !== undefined &&
              item.salePrice !== "" && (
                <div
                  style={{
                    marginTop: 8,
                    fontWeight: 900,
                  }}
                >
                  📈 Profit: Rs.{" "}
                  {Number(item.salePrice) - Number(item.buyPrice)}
                </div>
              )}
          </div>
        )}

        {item.downloadUrl && (
          <a
            href={item.downloadUrl}
            download
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "14px 22px",
              borderRadius: 10,
              background: "#16a34a",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            ⬇️ Download
          </a>
        )}
      </article>
    </main>
  );
}

