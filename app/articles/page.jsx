import Link from "next/link";
import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "GoogleAI Technology Articles",
  description:
    "AI, technology and digital resource articles from GoogleAI Site.",
};

async function getArticles() {
  const file = path.join(process.cwd(), "data", "articles.json");

  const data = JSON.parse(
    await fs.readFile(file, "utf8")
  );

  return data.filter(
    (article) => article.published === true
  );
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="portal">
      <section className="section">

        <span className="category">
          GOOGLEAI
        </span>

        <h1>GoogleAI Technology Articles</h1>

        <p>
          Explore artificial intelligence, technology
          guides and digital resources.
        </p>

        <div>
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
                By {article.author}
              </p>

              <p>
                Published: {article.publishedAt}
              </p>

              <p>
                {article.content.slice(0, 180)}...
              </p>

              <hr />

            </article>
          ))}
        </div>

      </section>
    </main>
  );
}
