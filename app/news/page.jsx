import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import AdManager from "../components/AdManager";

async function getNews() {
  const file = path.join(process.cwd(), "data", "news.json");

  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <AdManager provider="Google AdSense" slot="news-list-top" />

      <main
        style={{
          minHeight: "100vh",
          padding: "30px",
          background: "radial-gradient(circle at top,#312e81,#020617)",
          color: "white",
        }}
      >
        <h1>📰 Latest News</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {news.map((item) => (
            <article
              key={item.slug}
              style={{
                padding: "20px",
                borderRadius: "20px",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>

              <Link
                href={`/news/${item.slug}`}
                style={{ color: "#38bdf8" }}
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
