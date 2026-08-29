export const metadata = {
  title: "Terms of Use",
  description: "GoogleAi Terms of Use.",
};

export default function TermsPage() {
  return (
    <main className="legalPage">
      <div className="legalCard">
        <a href="/">← Home</a>
        <h1>Terms of Use</h1>

        <p>
          By using GoogleAi, you agree to use the website lawfully and
          responsibly.
        </p>

        <h2>Content</h2>
        <p>
          News and other information is provided for general informational
          purposes. Users should independently verify important information.
        </p>

        <h2>AI Tools</h2>
        <p>
          AI-generated results may contain errors and should be reviewed
          before being relied upon or published.
        </p>

        <h2>Prohibited Use</h2>
        <p>
          You must not use the website for unlawful activity, abuse,
          unauthorized access, fraud or infringement of third-party rights.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms when necessary. Continued use of the
          website after changes means you accept the updated terms.
        </p>

        <p>Last updated: August 28, 2026</p>
      </div>
    </main>
  );
}
