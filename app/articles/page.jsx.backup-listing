import Link from "next/link";
import AdManager from "../components/AdManager";
import AdSlot from "../../components/AdSlot";

export const metadata = {
  title: "GoogleAI Articles - AI & Technology Guides",
  description:
    "Read GoogleAI Site articles about artificial intelligence, technology and digital trends.",
};

export default function Page() {
  const article = {
    title: "GoogleAI Technology Articles",
    author: "GoogleAI Editorial Team",
    published: "2026-09-01",
    updated: "2026-09-01",
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": "https://googleai-site.vercel.app/author/googleai-team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoogleAI Site",
      "url": "https://googleai-site.vercel.app"
    },
    "datePublished": article.published,
    "dateModified": article.updated,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://googleai-site.vercel.app/articles"
    }
  };

  return (
    <>
      <AdManager 
        provider="Google AdSense" 
        slot="articles-top" 
      />

      <AdSlot title="Advertisement Top" />

      <main className="portal">
        <section className="section">

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />

          <span className="category">
            GOOGLEAI
          </span>

          <h1>
            {article.title}
          </h1>

          <p>
            By{" "}
            <Link href="/author/googleai-team">
              {article.author}
            </Link>
          </p>

          <p>
            Published: {article.published}
          </p>

          <p>
            Updated: {article.updated}
          </p>

          <p>
            GoogleAI Site provides technology articles,
            artificial intelligence guides, digital tool
            reviews and useful online resources.
          </p>

          <p>
            Our editorial team researches technology topics
            and creates helpful content for readers.
          </p>

          <Link href="/" className="read-more">
            ← Back to Home
          </Link>

        </section>
      </main>

      <AdSlot title="Advertisement Bottom" />
    </>
  );
}

