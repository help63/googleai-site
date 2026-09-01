import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getArticle(slug) {
  const file = path.join(process.cwd(), "data", "articles.json");
  const articles = JSON.parse(await fs.readFile(file, "utf8"));

  return articles.find(
    (article) => article.slug === slug && article.published
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | GoogleAI Site",
    };
  }

  return {
    title: `${article.title} | GoogleAI Site`,
    description: article.content.slice(0, 160),
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return <h1>Article Not Found</h1>;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://googleai-site.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": "https://googleai-site.vercel.app/articles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://googleai-site.vercel.app/articles/${article.slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Organization",
      "name": article.author
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt
  };

  return (
    <main className="portal">
      <section className="section">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />

        <span className="category">
          {article.category}
        </span>

        <h1>{article.title}</h1>

        <p>
          By{" "}
          <Link href="/author/googleai-team">
            {article.author}
          </Link>
        </p>

        <p>
          Published: {article.publishedAt}
        </p>

        <hr />

        {article.content.split("\n\n").map((text, i) => (
          <p key={i}>
            {text}
          </p>
        ))}

      </section>
    </main>
  );
}
