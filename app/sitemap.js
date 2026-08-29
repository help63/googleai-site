import fs from "fs/promises";
import path from "path";

export default async function sitemap() {
  let news = [];

  try {
    news = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "data", "news.json"),
        "utf8"
      )
    );
  } catch {}

  const base = "https://googleai-site.vercel.app";

  return [
    {
      url: base,
      lastModified: new Date(),
    },
    {
      url: `${base}/admin`,
      lastModified: new Date(),
    },
    ...news.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.createdAt
        ? new Date(article.createdAt)
        : new Date(),
    })),
  ];
}
