import Image from "next/image";

export const metadata = {
  title: "GoogleAI Editorial Team - Author Profile",
  description:
    "Meet the GoogleAI Site editorial team. Learn about our technology research, content review process and publishing standards.",
};

export default function AuthorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoogleAI Site Editorial Team",
    "url": "https://googleai-site.vercel.app",
    "logo": "https://googleai-site.vercel.app/images/author-placeholder.jpg",
    "description":
      "Editorial team publishing AI, technology and digital resource content.",
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

        <span className="category">AUTHOR</span>

        <h1>GoogleAI Editorial Team</h1>

        <Image
          src="/images/author-placeholder.jpg"
          width={160}
          height={160}
          alt="GoogleAI Editorial Team"
        />

        <h2>About Our Team</h2>

        <p>
          GoogleAI Site Editorial Team creates technology-focused content
          covering artificial intelligence, digital tools, online platforms
          and emerging technology trends.
        </p>

        <h2>Experience & Expertise</h2>

        <ul>
          <li>Artificial Intelligence research and tools</li>
          <li>Technology guides and explanations</li>
          <li>Digital product analysis</li>
          <li>Online resource reviews</li>
        </ul>

        <h2>Editorial Process</h2>

        <p>
          Our team researches topics, reviews available information and aims
          to provide useful, clear and updated content for readers.
        </p>

        <h2>Content Standards</h2>

        <p>
          Articles are created with a focus on accuracy, usefulness,
          transparency and regular updates.
        </p>

        <h2>Contact</h2>

        <p>
          For content questions and feedback:
          contact@googleai-site.vercel.app
        </p>

      </section>
    </main>
  );
}

