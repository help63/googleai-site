import Link from "next/link";
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

  // This environment connects reliably when Neon is resolved to IPv4.
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

async function getNews() {
  const client = await getDatabaseClient();

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        id,
        title,
        slug,
        author,
        category,
        content,
        published_at,
        updated_at
      FROM articles
      WHERE published = true
      ORDER BY published_at DESC, updated_at DESC
    `);

    return result.rows;
  } finally {
    await client.end().catch(() => {});
  }
}

export default async function Page() {
  let posts = [];

  try {
    posts = await getNews();
  } catch (error) {
    console.error("NEWS FETCH ERROR:", error);
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>📰 Latest News</h1>

      {posts.length === 0 ? (
        <p>No news available.</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            style={{
              marginBottom: 20,
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 12
            }}
          >
            <div style={{ marginBottom: 8 }}>
              {post.category}
            </div>

            <h2>{post.title}</h2>

            <p>
              {post.content.length > 250
                ? `${post.content.slice(0, 250)}...`
                : post.content}
            </p>

            <Link href={`/news/${post.slug}`}>
              Read Full Article →
            </Link>
          </article>
        ))
      )}
    </main>
  );
}
