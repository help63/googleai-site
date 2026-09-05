import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const title = slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} | GoogleAI Site`,
    description:
      "Technology, AI and digital resources article from GoogleAI Site.",
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  const title = slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const publishedDate = "2026-09-01";
  const updatedDate = "2026-09-01";

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
        "name": title,
        "item": `https://googleai-site.vercel.app/articles/${params.slug}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Artificial Intelligence?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Artificial Intelligence is technology that enables computer systems to perform tasks that normally require human intelligence."
        }
      },
      {
        "@type": "Question",
        "name": "How is AI changing technology?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI is improving automation, productivity, research and digital experiences across many industries."
        }
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Organization",
      "name": "GoogleAI Editorial Team",
      "url": "https://googleai-site.vercel.app/author/googleai-team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoogleAI Site",
      "logo": {
        "@type": "ImageObject",
        "url": "https://googleai-site.vercel.app/images/author-placeholder.jpg"
      }
    },
    "datePublished": publishedDate,
    "dateModified": updatedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://googleai-site.vercel.app/articles/${slug}`
    }
  };

  return (
    <main className="portal">
      <section className="section">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <span className="category">
          ARTICLE
        </span>

        <h1>{title}</h1>

        <p>
          By{" "}
          <Link href="/author/googleai-team">
            GoogleAI Editorial Team
          </Link>
        </p>

        <p>
          Published: {publishedDate}
        </p>

        <p>
          Updated: {updatedDate}
        </p>

        <hr />

        <p>
          Welcome to GoogleAI Site. This article provides useful
          information, explanations and research about artificial
          intelligence, technology and digital platforms.
        </p>

        <h2>Overview</h2>

        <p>
          Technology is continuously changing. Our editorial team
          researches topics and creates helpful guides for readers.
        </p>

        <h2>Key Information</h2>

        <ul>
          <li>AI and technology insights</li>
          <li>Digital tools and resources</li>
          <li>Latest technology trends</li>
          <li>Practical explanations</li>
        </ul>

        <h2>Conclusion</h2>

        <p>
          GoogleAI Site aims to provide accurate, useful and
          regularly updated technology content.
        </p>

      </section>
    </main>
  );
}

