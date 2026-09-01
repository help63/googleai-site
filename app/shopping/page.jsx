import Link from "next/link";
import AdManager from "../components/AdManager";

export default function Page() {
  return (
    <>
      <AdManager provider="Google AdSense" slot="shopping-top" />
    <main className="portal">
      <section className="section page-placeholder">
        <span className="category">GOOGLEAI</span>
        <h1>Shopping</h1>
        <p>
          Welcome to GoogleAi Shopping. This section is being prepared with
          colorful 3D cards, AI-powered features and fresh content.
        </p>

        <Link href="/" className="read-more">
          ← Back to Home
        </Link>
      </section>
    </main>
    </>
  );
}