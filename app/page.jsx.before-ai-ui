"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("chat");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);

  const modes = [
    ["chat", "💬", "AI Chat"],
    ["image", "🖼️", "AI Image"],
    ["video", "🎬", "AI Video"],
    ["text", "✍️", "Text Creator"],
  ];

  function generate() {
    if (!prompt.trim()) return;

    setHistory((items) => [
      {
        mode,
        prompt,
        time: new Date().toLocaleTimeString(),
      },
      ...items,
    ]);

    setPrompt("");
  }

  return (
    <main>
      <nav className="nav">
        <div className="brand">
          <span className="logo">G</span>
          <span>Google<span>Ai</span></span>
        </div>

        <div className="navlinks">
          <a href="#studio">Studio</a>
          <a href="#features">Features</a>
          <a href="#history">History</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="navbutton" href="#studio">
          Launch Studio →
        </a>
      </nav>

      <section className="hero">
        <div className="heroGlow" />

        <div className="heroCopy">
          <div className="pill">
            <span className="dot" />
            NEXT-GEN AI CREATIVE STUDIO
          </div>

          <h1>
            Imagine.
            <br />
            <em>Create.</em>
          </h1>

          <p>
            One powerful workspace for AI chat, images, videos and
            professional text creation.
          </p>

          <div className="heroActions">
            <a className="primary" href="#studio">Start Creating ✦</a>
            <a className="secondary" href="#features">Explore AI Tools</a>
          </div>

          <div className="stats">
            <div><b>4+</b><small>AI Tools</small></div>
            <div><b>24/7</b><small>Creative Studio</small></div>
            <div><b>∞</b><small>Ideas</small></div>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardTop">
            <span>GoogleAi Studio</span>
            <span className="live">● ONLINE</span>
          </div>

          <div className="heroPreview">
            <div className="bigSpark">✦</div>
            <h3>AI Creation</h3>
            <p>Turn your ideas into creative projects.</p>
          </div>

          <div className="miniTools">
            <span>💬 Chat</span>
            <span>🖼️ Image</span>
            <span>🎬 Video</span>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="sectionTitle">
          <span>POWERFUL AI WORKSPACE</span>
          <h2>Everything you need to <em>create.</em></h2>
        </div>

        <div className="featureGrid">
          <Feature icon="💬" title="AI Chat"
            text="Chat with an intelligent creative assistant and develop ideas."
            color="violet" />

          <Feature icon="🖼️" title="AI Image Studio"
            text="Describe an image and prepare a generation request."
            color="pink" />

          <Feature icon="🎬" title="AI Video Studio"
            text="Create cinematic video prompts with powerful generation settings."
            color="cyan" />

          <Feature icon="✍️" title="Text Creator"
            text="Create stories, scripts, captions, articles and creative writing."
            color="blue" />
        </div>
      </section>

      <section id="studio" className="studio">
        <div className="studioHead">
          <div>
            <span>AI CREATIVE WORKSPACE</span>
            <h2>Prompt → <em>Creation</em></h2>
          </div>

          <div className="status">
            <span className="dot" />
            Studio Ready
          </div>
        </div>

        <div className="modeBar">
          {modes.map(([value, icon, title]) => (
            <button
              key={value}
              className={mode === value ? "mode active" : "mode"}
              onClick={() => setMode(value)}
            >
              <span>{icon}</span>
              {title}
            </button>
          ))}
        </div>

        <div className="workspace">
          <div className="promptBox">
            <div className="boxHeader">
              <div>
                <small>CREATE WITH AI</small>
                <h3>
                  {mode === "chat" && "Talk to AI"}
                  {mode === "image" && "Generate Image"}
                  {mode === "video" && "Generate Video"}
                  {mode === "text" && "Create Text"}
                </h3>
              </div>

              <span className="modeIcon">
                {modes.find((m) => m[0] === mode)?.[1]}
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === "chat"
                  ? "Ask anything..."
                  : mode === "image"
                  ? "Describe the image you want to create..."
                  : mode === "video"
                  ? "Describe your cinematic video..."
                  : "Write a story, script, article or caption..."
              }
            />

            {mode === "video" && (
              <div className="settings">
                <label>
                  Duration
                  <select>
                    <option>4 seconds</option>
                    <option>6 seconds</option>
                    <option>8 seconds</option>
                  </select>
                </label>

                <label>
                  Aspect Ratio
                  <select>
                    <option>16:9</option>
                    <option>9:16</option>
                    <option>1:1</option>
                  </select>
                </label>

                <label>
                  Quality
                  <select>
                    <option>720p</option>
                    <option>1080p</option>
                  </select>
                </label>
              </div>
            )}

            {mode === "image" && (
              <label className="upload">
                📎 Add reference image
                <input type="file" accept="image/*" />
              </label>
            )}

            <div className="promptBottom">
              <span>
                {mode === "video"
                  ? "Veo-ready workspace"
                  : "Creative AI workspace"}
              </span>

              <button className="generate" onClick={generate}>
                Generate ✦
              </button>
            </div>
          </div>

          <div className="resultBox">
            <div className="resultHeader">
              <div>
                <small>AI OUTPUT</small>
                <h3>Creation Preview</h3>
              </div>
              <span className="ready">READY</span>
            </div>

            <div className="resultPreview">
              <div className="resultIcon">
                {mode === "chat" && "💬"}
                {mode === "image" && "🖼️"}
                {mode === "video" && "🎬"}
                {mode === "text" && "✍️"}
              </div>

              <h3>Your creation will appear here</h3>
              <p>
                Enter a prompt and press Generate to create your next
                project.
              </p>
            </div>

            <div className="outputActions">
              <button>↗ Preview</button>
              <button>⬇ Download</button>
              <button>♡ Save</button>
            </div>
          </div>
        </div>
      </section>

      <section id="history" className="history">
        <div className="sectionTitle left">
          <span>YOUR WORK</span>
          <h2>Generation <em>History.</em></h2>
        </div>

        {history.length === 0 ? (
          <div className="empty">
            <span>✦</span>
            <h3>No creations yet</h3>
            <p>Your generated projects will appear here.</p>
          </div>
        ) : (
          <div className="historyGrid">
            {history.map((item, index) => (
              <div className="historyItem" key={index}>
                <span>{modes.find((m) => m[0] === item.mode)?.[1]}</span>
                <div>
                  <b>{item.prompt}</b>
                  <small>{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="security">
        <div>
          <span>AUTHORIZED CYBERSECURITY</span>
          <h2>Learn. Test. <em>Defend.</em></h2>
          <p>
            Practice cybersecurity in authorized labs, CTF environments,
            defensive analysis and secure coding exercises.
          </p>
        </div>

        <div className="securityGrid">
          <div>🛡️<b>Defensive Security</b><small>Analyze and protect systems</small></div>
          <div>🏆<b>CTF Practice</b><small>Legal security challenges</small></div>
          <div>🔐<b>Secure Coding</b><small>Learn safer development</small></div>
          <div>🤖<b>Security AI</b><small>Research assistant</small></div>
        </div>
      </section>

      <footer id="contact">
        <div className="footerBrand">
          <span className="logo">G</span>
          <div>
            <b>GoogleAi</b>
            <p>Creative AI Studio</p>
          </div>
        </div>

        <div className="footerLinks">
          <a href="mailto:aliahmadoffcial63@gmail.com">Email</a>
          <a href="https://www.facebook.com/share/19MYBW49gw/" target="_blank">Facebook</a>
          <a href="https://whatsapp.com/channel/0029VbChz5W3LdQQ5lER872s" target="_blank">WhatsApp</a>
          <a href="tel:+923317867138">Contact</a>
        </div>

        <div className="copyright">
          © 2026 GoogleAi. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text, color }) {
  return (
    <article className={`feature ${color}`}>
      <div className="featureIcon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <a href="#studio">Open tool →</a>
    </article>
  );
}
