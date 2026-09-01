"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const countries = [
  "All",
  "Pakistan",
  "UK",
  "USA",
  "Europe",
  "Asia",
  "Middle East",
  "Australia",
  "Canada"
];

export default function TVClient({ channels = [] }) {
  const [country, setCountry] = useState("All");
  const [search, setSearch] = useState("");

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const countryMatch =
        country === "All" ||
        channel.country?.toLowerCase() === country.toLowerCase() ||
        channel.region?.toLowerCase() === country.toLowerCase();

      const q = search.toLowerCase().trim();

      const searchMatch =
        !q ||
        channel.name?.toLowerCase().includes(q) ||
        channel.country?.toLowerCase().includes(q) ||
        channel.language?.toLowerCase().includes(q);

      return countryMatch && searchMatch && channel.enabled !== false;
    });
  }, [channels, country, search]);

  return (
    <main className="tv-page">
      <div className="tv-container">

        <Link href="/" className="tv-back">
          ← Back to GoogleAi
        </Link>

        <div className="tv-hero">
          <span>GLOBAL TELEVISION</span>
          <h1>🌍 Live TV Channels</h1>
          <p>
            Official broadcaster streams from around the world.
          </p>
        </div>

        <div className="tv-controls">
          <input
            className="tv-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Search channel..."
          />

          <div className="tv-filters">
            {countries.map((item) => (
              <button
                key={item}
                type="button"
                className={country === item ? "active" : ""}
                onClick={() => setCountry(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="tv-result-count">
          Showing <b>{filteredChannels.length}</b> channels
          {country !== "All" ? ` from ${country}` : ""}
        </div>

        <div className="tv-grid">
          {filteredChannels.map((channel) => (
            <article
              className="tv-card"
              key={channel.id || channel.name}
            >
              <div className="tv-logo">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    loading="lazy"
                  />
                ) : (
                  <span>📺</span>
                )}
              </div>

              <div className="tv-info">
                <div className="tv-live">● OFFICIAL</div>

                <h2>{channel.name}</h2>

                <p>
                  🌍 {channel.country || "International"} ·{" "}
                  {channel.language || "English"}
                </p>

                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-tv"
                >
                  Watch Official Stream →
                </a>
              </div>
            </article>
          ))}
        </div>

        {!filteredChannels.length && (
          <div className="tv-empty">
            <div>📺</div>
            <h2>No channels found</h2>
            <p>
              No channel is currently available for this selection.
            </p>

            <button
              onClick={() => {
                setCountry("All");
                setSearch("");
              }}
            >
              Show All Channels
            </button>
          </div>
        )}

        <div className="tv-note">
          <b>ⓘ Official sources only</b>
          <p>
            Availability can vary by country and broadcaster.
          </p>
        </div>

      </div>
    </main>
  );
}
