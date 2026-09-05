import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getArticle(slug) {
  const file = path.join(process.cwd(), "data", "articles.json");

  const data = JSON.parse(await fs.readFile(file, "utf8"));

  return data.find(
    (article) =>
      article.slug === slug &&
      article.published !== false
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await getArticle(slug);

  return {
    title: article
      ? `${article.title} | GoogleAI Site`
      : "Article | GoogleAI Site",
    description: article?.content?.slice(0, 160) || "",
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return (
      <main className="portal">
        <section className="section">
          <h1>Article Not Found</h1>
        </section>
      </main>
    );
  }

  const articleUrl =
    `https://googleai-site.vercel.app/articles/${article.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url":
        "https://googleai-site.vercel.app/author/googleai-team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoogleAI Site"
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    }
  };

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
        "item": articleUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${article.category}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": article.content.slice(0, 200)
        }
      }
    ]
  };

  return (
    <main className="portal">
      <section className="section">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
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

        <p>
          Updated: {article.updatedAt}
        </p>

        <hr />

        <div>
          {article.content}
        </div>

        <h2>Related Articles</h2>

        <ul>
          <li>
            <Link href="/articles/future-of-artificial-intelligence-2026">
              Future of Artificial Intelligence 2026
            </Link>
          </li>
          <li>
            <Link href="/articles/best-ai-tools-guide-2026">
              Best AI Tools Guide 2026
            </Link>
          </li>
          <li>
            <Link href="/articles/machine-learning-explained">
              Machine Learning Explained
            </Link>
          </li>
        </ul>

      </section>
    </main>
  );
}
