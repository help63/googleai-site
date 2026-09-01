"use client";

import AdManager from "../components/AdManager";

import Link from "next/link";

export default function VideosPage() {
  return (
    <>
      <AdManager provider="Google AdSense" slot="videos-top" />
    <main style={{
      minHeight: "100vh",
      padding: "40px 20px",
      background: "linear-gradient(135deg,#111827,#312e81,#581c87)",
      color: "white"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        <Link href="/" style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "700"
        }}>
          ← Home
        </Link>

        <h1 style={{
          fontSize: "clamp(36px,7vw,70px)",
          margin: "50px 0 10px"
        }}>
          🎬 Videos
        </h1>

        <p style={{
          opacity: .8,
          fontSize: "18px"
        }}>
          GoogleAi video portal
        </p>

        <div style={{
          marginTop: "35px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px"
        }}>
          {[
            ["🔥","Trending Videos"],
            ["📰","News Videos"],
            ["🤖","AI Videos"],
            ["🏏","Cricket Videos"],
            ["🌍","World Videos"],
            ["🎥","Featured Videos"]
          ].map(([icon,title]) => (
            <div key={title} style={{
              padding: "30px 20px",
              borderRadius: "24px",
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              boxShadow: "0 20px 50px rgba(0,0,0,.25)"
            }}>
              <div style={{fontSize:"42px"}}>{icon}</div>
              <h2>{title}</h2>
              <p style={{opacity:.7}}>Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}