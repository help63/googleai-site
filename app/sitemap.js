import { Client } from "pg";
import fs from "fs/promises";
import path from "path";

const BASE = "https://googleai-site.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/tv",
    "/shopping",
    "/mobiles",
    "/jobs",
    "/electronics",
    "/garments",
    "/articles",
    "/news",
    "/videos",
    "/guest-posts",
    "/social",
    "/recipes",
    "/travel",
    "/downloads",
  ];

  const urls = routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
  }));

  // Add all published uploaded content
  try {
    const contentFile = path.join(
      process.cwd(),
      "data",
      "content.json"
    );

    const content = JSON.parse(
      await fs.readFile(contentFile, "utf8")
    );

    urls.push(
      ...content
        .filter((item) => item.published !== false)
        .map((item) => ({
          url: `${BASE}/content/${item.id}`,
          lastModified: new Date(
            item.updatedAt ||
            item.createdAt ||
            Date.now()
          ),
        }))
    );
  } catch (error) {
    console.error("SITEMAP CONTENT ERROR:", error);
  }

  // Add published articles from database
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 30000,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT slug, updated_at, published_at
      FROM articles
      WHERE published = TRUE
      ORDER BY published_at DESC
    `);

    urls.push(
      ...result.rows.map((article) => ({
        url: `${BASE}/articles/${article.slug}`,
        lastModified: new Date(
          article.updated_at ||
          article.published_at ||
          Date.now()
        ),
      }))
    );
  } catch (error) {
    console.error("SITEMAP ARTICLES ERROR:", error);
  } finally {
    await client.end().catch(() => {});
  }

  return urls;
}
