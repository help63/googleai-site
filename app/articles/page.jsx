import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import AdManager from "../components/AdManager";
import AdSlot from "../../components/AdSlot";

export const metadata = {
  title: "GoogleAI Technology Articles",
  description:
    "Read AI, technology and digital resource articles from GoogleAI Editorial Team.",
};

async function getArticles() {
  try {
    const file = path.join(
      process.cwd(),
      "data",
      "articles.json"
    );

    const data = await fs.readFile(file, "utf8");

    return JSON.parse(data).filter(
      (item) => item.published !== false
    );
  } catch {
    return [];
  }
}

export default async function Page() {
  const articles = await getArticles();

  return (
    <>
      <AdManager provider="Google AdSense" slot="articles-top" />

      <AdSlot title="Advertisement Top" />

      <main className="portal">
        <section className="section">

          <span className="category">
            GOOGLEAI ARTICLES
          </span>

          <h1>
            GoogleAI Technology Articles
          </h1>

          <p>
            AI, technology and digital guides
            published by GoogleAI Editorial Team.
          </p>

          {articles.length === 0 && (
            <p>No articles available.</p>
          )}

          {articles.map((article) => (
            <article key={article.id}>

              <h2>
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              <p>
                By{" "}
                <Link href="/author/googleai-team">
                  {article.author}
                </Link>
              </p>

              <p>
                Published: {article.publishedAt}
                {" | "}
                Updated: {article.updatedAt}
              </p>

              <p>
                {article.content}
              </p>

              <hr />

            </article>
          ))}

        </section>
      </main>

      <AdSlot title="Advertisement Bottom" />
    </>
  );
}

