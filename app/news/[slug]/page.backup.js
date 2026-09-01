import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getNews() {
  const file = path.join(process.cwd(), "data", "news.json");

  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const news = await getNews();
  const article = news.find((item) => item.slug === slug);

  if (!article) notFound();

  return (
    <main className="news-page">
      <div className="news-container">
        <Link href="/" className="back-link">← Home</Link>

        <div className="article-category">{article.category}</div>

        <h1 className="article-title">{article.title}</h1>

        <div className="article-meta">
          By {article.author} ·{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </div>

        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="article-image"
          />
        )}

        {article.excerpt && (
          <p className="article-excerpt">{article.excerpt}</p>
        )}

        <article className="article-content">
          {article.content
            .split("\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </article>
      </div>
    </main>
  );
}
