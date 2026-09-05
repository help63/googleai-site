import Link from "next/link";
import { Client } from "pg";

export const dynamic = "force-dynamic";

async function getArticle(slug) {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000
  });

  try {
    await client.connect();

    const result = await client.query(
      `
      SELECT
        id,
        title,
        slug,
        author,
        category,
        published_at AS "publishedAt",
        updated_at AS "updatedAt",
        published,
        content
      FROM articles
      WHERE slug = $1
        AND published = TRUE
      LIMIT 1
      `,
      [slug]
    );

    return result.rows[0] || null;

  } finally {
    await client.end().catch(() => {});
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | GoogleAI Site"
    };
  }

  return {
    title: `${article.title} | GoogleAI Site`,
    description: article.content
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160)
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

          <p>
            This article does not exist or is not published.
          </p>

          <Link href="/articles">
            ← Back to Articles
          </Link>
        </section>
      </main>
    );
  }

  const publishedDate = new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ).format(new Date(article.publishedAt));

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

        <p className="article-date">
          Published: {publishedDate}
        </p>

        <hr />

        <div className="article-content">
          {article.content
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((text, i) => (
              <p key={i}>
                {text}
              </p>
            ))}
        </div>

        <hr />

        <Link
          href="/articles"
          className="read-more"
        >
          ← Back to All Articles
        </Link>

      </section>
    </main>
  );
}
