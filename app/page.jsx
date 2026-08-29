import Link from "next/link";

const nav = [
  ["Home", "/"],
  ["News", "/category/Latest"],
  ["Business", "/category/Business"],
  ["Mobiles", "/mobiles"],
  ["Cricket", "/cricket"],
  ["Videos", "/videos"],
  ["Live TV", "/tv"],
  ["AI Tools", "/#features"],
  ["AI Studio", "/#studio"],
  ["Islam", "/islam"],
  ["Articles", "/articles"],
  ["Names", "/names"],
  ["Dictionary", "/dictionary"],
  ["Recipes", "/recipes"],
  ["Travel", "/travel"],
];

const news = [
  "Pakistan اور کشمیر ایک دوسرے کے بغیر ادھورے ہیں، نومنتخب وزیراعظم آزاد کشمیر کا پہلا خطاب",
  "پمز آتشزدگی: پارلیمان میں حکومت اور اپوزیشن کے درمیان لفظی جنگ",
  "جنوبی وزیرستان اور باجوڑ میں بم دھماکے، ایک شخص جاں بحق",
  "ٹیکنالوجی اور AI کی دنیا سے تازہ ترین اہم خبریں",
];

export default function Home() {
  return (
    <main className="portal">
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <span>🌐 GoogleAi Global Portal</span>
            <span>Latest • Pakistan • World • Technology</span>
          </div>
        </div>

        <div className="container brand-row">
          <Link href="/" className="logo">
            Google<span>Ai</span>
          </Link>

          <div className="search">
            <input placeholder="Search GoogleAi..." />
            <button>Search</button>
          </div>
        </div>

        <nav className="nav">
          <div className="container nav-inner">
            {nav.map(([label, href]) => (
              <Link href={href} key={label}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div className="container">

        <div className="ad-box">ADVERTISEMENT</div>

        <section className="breaking">
          <strong>BREAKING</strong>
          <span>AI • News • Business • Sports • Technology</span>
        </section>

        <section className="hero-grid">
          <article className="lead-card">
            <div className="placeholder-image">📰</div>
            <span className="category">LATEST NEWS</span>
            <h1>{news[0]}</h1>
            <p>
              GoogleAi پر پاکستان اور دنیا بھر کی تازہ ترین خبریں،
              معلومات اور اہم اپڈیٹس پڑھیں۔
            </p>
            <Link href="/category/Latest" className="read-more">
              Read More →
            </Link>
          </article>

          <div className="side-news">
            {news.slice(1).map((item, index) => (
              <article className="news-card" key={item}>
                <div className="thumb">
                  {["🔥", "🌍", "🤖"][index]}
                </div>
                <div>
                  <small>Aug 2026</small>
                  <h2>{item}</h2>
                  <Link href="/category/Latest">Read →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="ad-box">ADVERTISEMENT</div>

        <section className="section">
          <div className="section-title">
            <h2>🌍 Global Live TV</h2>
            <Link href="/tv">View All →</Link>
          </div>

          <div className="feature-grid">
            <Link href="/tv?country=Pakistan">🇵🇰 Pakistan TV</Link>
            <Link href="/tv?country=United%20Kingdom">🇬🇧 UK TV</Link>
            <Link href="/tv?country=United%20States">🇺🇸 USA TV</Link>
            <Link href="/tv?region=Europe">🇪🇺 Europe TV</Link>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-title">
            <h2>🤖 AI Tools</h2>
            <Link href="/#studio">Explore All →</Link>
          </div>

          <div className="tool-grid">
            <Link href="/#studio">💬 AI Chat</Link>
            <Link href="/#studio">🎨 AI Image Generator</Link>
            <Link href="/#studio">✍️ AI Writer</Link>
            <Link href="/#studio">🔍 AI Assistant</Link>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <h2>📰 Latest News</h2>
            <Link href="/category/Latest">View More →</Link>
          </div>

          <div className="latest-list">
            {news.map((item, i) => (
              <article key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item}</h3>
                  <small>GoogleAi News • Latest Update</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="studio">
          <div className="studio">
            <span>GOOGLEAI STUDIO</span>
            <h2>Create with Artificial Intelligence</h2>
            <p>
              Chat, write, create images and explore AI tools from one
              professional workspace.
            </p>
            <Link href="/#features">Open AI Studio →</Link>
          </div>
        </section>

        <div className="ad-box">ADVERTISEMENT</div>

      </div>

      <footer>
        <div className="container footer-grid">
          <div>
            <h2>GoogleAi</h2>
            <p>News, AI, technology and global information portal.</p>
          </div>

          <div>
            <h3>Explore</h3>
            <Link href="/category/Latest">News</Link>
            <Link href="/tv">Live TV</Link>
            <Link href="/#features">AI Tools</Link>
          </div>

          <div>
            <h3>Information</h3>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>

        <div className="copyright">
          © 2026 GoogleAi. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
