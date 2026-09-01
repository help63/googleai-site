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

      <main className="portal">
        <section className="section">
          <span className="category">GOOGLEAI</span>
          <h1>Latest News</h1>

          <div>
            {news.length === 0 ? (
              <p>No news available.</p>
            ) : (
              news.map((item) => (
                <article key={item.slug}>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>

                  <Link href={`/news/${item.slug}`}>
                    Read More →
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
