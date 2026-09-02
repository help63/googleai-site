import fs from "fs/promises";
import path from "path";

const BASE = "https://googleai-site.vercel.app";

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
  ];

  const urls = routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
  }));

  try {
    const file = path.join(
      process.cwd(),
      "data",
      "articles.json"
    );

    const articles = JSON.parse(
      await fs.readFile(file, "utf8")
    );

    for (const article of articles) {
      if (article.slug && article.published !== false) {
        urls.push({
          url: `${BASE}/articles/${article.slug}`,
          lastModified: new Date(
            article.updatedAt || article.publishedAt || Date.now()
          ),
        });
      }
    }
  } catch (e) {
    console.error("Sitemap article error:", e);
  }

  return urls;
}
