import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getArticles() {
  const file = path.join(process.cwd(), "data", "articles.json");
  const articles = JSON.parse(await fs.readFile(file, "utf8"));

  return articles.filter(article => article.published);
}

export const metadata = {
  title: "AI Articles | GoogleAI Site",
  description:
    "Explore artificial intelligence, technology and digital guides from GoogleAI Site."
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

        {articles.map((article) => (
          <article key={article.id}>

            <h2>
              <Link href={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h2>

            <p>
              Category: {article.category}
            </p>

            <p>
              Published: {article.publishedAt}
            </p>

            <p>
              {article.content.slice(0,180)}...
            </p>

            <hr />

          </article>
        ))}

      </section>
    </main>
  );
}
