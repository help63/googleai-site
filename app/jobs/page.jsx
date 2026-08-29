import Link from "next/link";

export default function Page() {
  return (
    <main className="portal">
      <section className="section page-placeholder">
        <span className="category">GOOGLEAI</span>
        <h1>Jobs</h1>
        <p>
          Welcome to GoogleAi Jobs. This section is being prepared with
          colorful 3D cards, AI-powered features and fresh content.
        </p>

        <Link href="/" className="read-more">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
