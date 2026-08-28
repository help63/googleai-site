"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    "Welcome to GoogleAi ✦",
    "Describe an image, video or creative idea."
  ]);

  function generate() {
    if (!prompt.trim()) return;

    setMessages((m) => [
      ...m,
      "You: " + prompt,
      "GoogleAi: Your request has been received. Connect an AI provider to generate the actual media."
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
          <a href="#features">Features</a>
          <a href="#studio">Studio</a>
          <a href="#security">Cyber Lab</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="navbutton" href="#studio">
          Launch Studio →
        </a>
      </nav>

      <section className="hero">
        <div className="orb orb1" />
        <div className="orb orb2" />

        <div className="heroCopy">
          <div className="pill">
            <span className="dot" />
            NEXT-GEN AI CREATIVE STUDIO
          </div>

          <h1>
            Create without
            <br />
            <em>limits.</em>
          </h1>

          <p>
            One beautiful workspace for AI chat, image creation,
            video workflows and authorized cybersecurity research.
          </p>

          <div className="heroActions">
            <a className="primary" href="#studio">
              Start Creating ✦
            </a>
            <a className="secondary" href="#features">
              Explore Features
            </a>
          </div>

          <div className="stats">
            <div><b>AI</b><small>Creative Studio</small></div>
            <div><b>24/7</b><small>Workspace</small></div>
            <div><b>∞</b><small>Ideas</small></div>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardTop">
            <span>GoogleAi Studio</span>
            <span className="live">● LIVE</span>
          </div>

          <div className="preview">
            <div className="spark">✦</div>
            <h3>Imagine.</h3>
            <p>Create something extraordinary.</p>
          </div>

          <div className="miniPrompt">
            <span>Describe your idea...</span>
            <button>↑</button>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="sectionTitle">
          <span>POWERFUL WORKSPACE</span>
          <h2>Everything you need to <em>create.</em></h2>
        </div>

        <div className="featureGrid">
          <Feature icon="✦" title="AI Image Studio"
            text="Create beautiful images from natural-language prompts."
            color="violet" />

          <Feature icon="▶" title="AI Video Studio"
            text="Build video-generation workflows using connected providers."
            color="pink" />

          <Feature icon="⌘" title="Cyber Lab"
            text="CTF practice, defensive security and authorized research."
            color="cyan" />

          <Feature icon="◉" title="AI Chat"
            text="A modern conversational workspace for AI workflows."
            color="blue" />
        </div>
      </section>

      <section id="studio" className="studio">
        <div className="studioHead">
          <div>
            <span>AI WORKSPACE</span>
            <h2>Prompt → <em>Creation</em></h2>
          </div>
          <div className="provider">● Backend-ready</div>
        </div>

        <div className="workspace">
          <div className="promptBox">
            <label>Your prompt</label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe an image, video concept, or creative idea..."
            />

            <div className="promptBottom">
              <span>Creative mode</span>
              <button onClick={generate}>
                Generate ✦
              </button>
            </div>
          </div>

          <div className="chatBox">
            <div className="chatHead">
              <span className="avatar">G</span>
              <div>
                <b>GoogleAi</b>
                <small>Creative Assistant</small>
              </div>
            </div>

            <div className="messages">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={message.startsWith("You:")
                    ? "msg user"
                    : "msg"}
                >
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="security">
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
          <a href="https://www.facebook.com/share/19MYBW49gw/" target="_blank">
            Facebook
          </a>
          <a href="https://whatsapp.com/channel/0029VbChz5W3LdQQ5lER872s" target="_blank">
            WhatsApp
          </a>
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
