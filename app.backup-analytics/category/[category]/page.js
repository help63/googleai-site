import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getNews() {
  try {
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "data", "news.json"),
        "utf8"
      )
    );
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const news = await getNews();

  const articles =
    category.toLowerCase() === "latest"
      ? news
      : news.filter(
          (item) =>
            item.category?.toLowerCase() === category.toLowerCase()
        );

  return (
    <main className="news-page">
      <div className="news-container">
        <Link href="/" className="back-link">← Home</Link>

        <h1 className="section-title">{category}</h1>

        <div className="news-grid">
          {articles.map((article) => (
            <Link
              href={`/news/${article.slug}`}
              className="news-card"
              key={article.id}
            >
              {article.image && (
                <img src={article.image} alt={article.title} />
              )}

              <div className="news-card-body">
                <span>{article.category}</span>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {!articles.length && (
          <p className="empty-news">No news published yet.</p>
        )}
      </div>
    </main>
  );
}
