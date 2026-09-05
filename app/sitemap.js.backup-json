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

  let urls = routes.map((route) => ({
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

    urls.push(
      ...articles
        .filter((item) => item.published !== false)
        .map((item) => ({
          url: `${BASE}/articles/${item.slug}`,
          lastModified: new Date(
            item.updatedAt || item.publishedAt || Date.now()
          ),
        }))
    );
  } catch {}

  try {
    const file = path.join(
      process.cwd(),
      "data",
      "posts.json"
    );

    const posts = JSON.parse(
      await fs.readFile(file, "utf8")
    );

    urls.push(
      ...posts
        .filter((post) => post.published !== false && post.slug)
        .map((post) => ({
          url: `${BASE}/${post.type}/${post.slug}`,
          lastModified: new Date(),
        }))
    );
  } catch {}

  return urls;
}
