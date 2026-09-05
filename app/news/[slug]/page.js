import AdManager from "../../components/AdManager";
import AdSlot from "../../../components/AdSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Client } from "pg";
import { promises as dns } from "dns";

async function getDatabaseClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  const url = new URL(connectionString);

  const addresses = await dns.resolve4(url.hostname);

  if (!addresses.length) {
    throw new Error("No IPv4 database address found");
  }

  return new Client({
    host: addresses[0],
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: {
      rejectUnauthorized: false,
      servername: url.hostname
    },
    connectionTimeoutMillis: 30000
  });
}

async function getArticle(slug) {
  const client = await getDatabaseClient();

  try {
    await client.connect();

    const result = await client.query(
      `
      SELECT
        id,
        title,
        slug,
        author,
        category,
        content,
        published,
        published_at,
        updated_at
      FROM articles
      WHERE slug = $1
        AND published = true
      LIMIT 1
      `,
      [slug]
    );

    return result.rows[0] || null;
  } finally {
    await client.end().catch(() => {});
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  let article;

  try {
    article = await getArticle(slug);
  } catch (error) {
    console.error("ARTICLE FETCH ERROR:", error);
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <AdManager provider="Google AdSense" slot="news-top" />
      <AdSlot title="Advertisement Top" />

      <main className="news-page">
        <div className="news-container">

          <Link href="/" className="back-link">
            ← Home
          </Link>

          <div className="article-category">
            {article.category}
          </div>

          <h1 className="article-title">
            {article.title}
          </h1>

          <div className="article-meta">
            By {article.author} ·{" "}
            {new Date(article.published_at).toLocaleDateString()}
          </div>

          <article className="article-content">
            {(article.content || "")
              .split("\n")
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </article>

        </div>
      </main>

      <AdSlot title="Advertisement Bottom" />
    </>
  );
}
