import Link from "next/link";
import { Client } from "pg";

export const dynamic = "force-dynamic";

async function getArticles() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        id,
        title,
        slug,
        author,
        category,
        published_at AS "publishedAt",
        updated_at AS "updatedAt",
        content
      FROM articles
      WHERE published = TRUE
      ORDER BY published_at DESC, created_at DESC
    `);

    return result.rows;
  } finally {
    await client.end().catch(() => {});
  }
}

export const metadata = {
  title: "AI Articles | GoogleAI Site",
  description: "Latest artificial intelligence and technology articles."
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="portal">
      <section className="section">

        <h1>Latest AI Articles</h1>

        <p>
          Explore technology, artificial intelligence and digital resources.
        </p>

        <div className="articles-list">
          {articles.map((article) => {
            const preview = article.content
              .replace(/\s+/g, " ")
              .trim();

            const shortPreview =
              preview.length > 250
                ? preview.slice(0, 250) + "..."
                : preview;

            const publishedDate = new Intl.DateTimeFormat(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric"
              }
            ).format(new Date(article.publishedAt));

            return (
              <article
                key={article.id}
                className="article-card"
              >

                <span className="category">
                  {article.category}
                </span>

                <h2>
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="article-date">
                  Published: {publishedDate}
                </p>

                <p className="article-preview">
                  {shortPreview}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="read-more"
                >
                  Read Full Article →
                </Link>

              </article>
            );
          })}
        </div>

      </section>
    </main>
  );
}
