import Link from "next/link";

export const metadata = {
  title: "GoogleAI Site Team - Author Profile",
  description:
    "Meet the GoogleAI Site content team creating AI, technology and digital guides.",
};

export default function Page() {
  return (
    <main className="portal">
      <section className="section">
        <span className="category">AUTHOR</span>

        <h1>GoogleAI Site Team</h1>

        <img
          src="/images/author-placeholder.jpg"
          alt="GoogleAI Site Team"
          width="160"
          height="160"
        />

        <h2>Content Editor & Technology Research Team</h2>

        <p>
          GoogleAI Site Team publishes technology, artificial intelligence,
          digital tools and online resources for users.
        </p>

        <p>
          Our content focuses on research, explanations, guides and updates
          related to AI, technology and digital platforms.
        </p>

        <h3>Expertise</h3>
        <ul>
          <li>Artificial Intelligence Tools</li>
          <li>Technology News</li>
          <li>Digital Products</li>
          <li>Online Resources</li>
        </ul>

        <Link href="/articles">
          View Articles
        </Link>
      </section>
    </main>
  );
}
