"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EarningsPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    fetch("/api/admin/earnings")
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <main style={main}>
        <h1>Loading Earnings...</h1>
      </main>
    );
  }

  const totals = data.totals || {};
  const chartData =
    period === "daily"
      ? data.daily || []
      : period === "weekly"
      ? data.weekly || []
      : data.monthly || [];

  const max = Math.max(
    ...chartData.map(x => Number(x.revenue) || 0),
    1
  );

  return (
    <main style={main}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>

        <Link
          href="/admin/dashboard"
          style={{
            color: "#a78bfa",
            textDecoration: "none"
          }}
        >
          ← Admin Dashboard
        </Link>

        <h1 style={{ fontSize: 42, marginBottom: 5 }}>
          Website Earnings 💰
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Revenue, impressions and clicks
        </p>

        <div style={grid}>

          <Stat
            title="Total Revenue"
            value={`$${Number(totals.revenue || 0).toFixed(2)}`}
            icon="💰"
          />

          <Stat
            title="Impressions"
            value={Number(totals.impressions || 0).toLocaleString()}
            icon="👁️"
          />

          <Stat
            title="Clicks"
            value={Number(totals.clicks || 0).toLocaleString()}
            icon="🖱️"
          />

          <Stat
            title="CTR"
            value={
              totals.impressions
                ? `${(
                    (Number(totals.clicks || 0) /
                      Number(totals.impressions)) *
                    100
                  ).toFixed(2)}%`
                : "0%"
            }
            icon="📈"
          />

        </div>

        <section style={box}>
          <h2>Revenue Statistics 📊</h2>

          <div style={buttons}>
            {["daily", "weekly", "monthly"].map(x => (
              <button
                key={x}
                onClick={() => setPeriod(x)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "1px solid #334155",
                  background:
                    period === x ? "#7c3aed" : "#111827",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {x[0].toUpperCase() + x.slice(1)}
              </button>
            ))}
          </div>

          <div style={{
            display: "flex",
            alignItems: "end",
            gap: 10,
            height: 280,
            overflowX: "auto",
            padding: "20px 5px"
          }}>
            {chartData.length === 0 ? (
              <p style={{ color: "#64748b" }}>
                No earnings data yet.
              </p>
            ) : (
              chartData.map((item, i) => {
                const revenue = Number(item.revenue) || 0;
                const height = Math.max(
                  (revenue / max) * 220,
                  4
                );

                const label =
                  item.date ||
                  item.week ||
                  item.month;

                return (
                  <div
                    key={i}
                    style={{
                      minWidth:
                        period === "daily" ? 32 : 65,
                      height: 250,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "end",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <b style={{ fontSize: 11 }}>
                      ${revenue.toFixed(2)}
                    </b>

                    <div style={{
                      width:
                        period === "daily" ? 24 : 44,
                      height,
                      background:
                        "linear-gradient(180deg,#a78bfa,#6d28d9)",
                      borderRadius:
                        "6px 6px 2px 2px"
                    }} />

                    <span style={{
                      fontSize: 9,
                      color: "#94a3b8"
                    }}>
                      {String(label).slice(5)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section style={box}>
          <h2>Revenue by Source 📡</h2>

          {(data.sources || []).length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No revenue recorded yet.
            </p>
          ) : (
            data.sources.map(item => (
              <div key={item.source} style={row}>
                <b>{item.source}</b>
                <span style={{ color: "#a78bfa" }}>
                  ${Number(item.revenue || 0).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </section>

        <section style={box}>
          <h2>Revenue by Country 🌍</h2>

          {(data.countries || []).map(item => (
            <div key={item.country} style={row}>
              <b>{countryName(item.country)}</b>
              <span style={{ color: "#a78bfa" }}>
                ${Number(item.revenue || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </section>

        <section style={{
          ...box,
          borderColor: "#7c3aed"
        }}>
          <h2>⚠️ Revenue Data</h2>
          <p style={{
            color: "#94a3b8",
            lineHeight: 1.6
          }}>
            Revenue shown here comes from the earnings database.
            Connect your actual advertising or affiliate provider
            before treating these figures as real income.
          </p>
        </section>

      </div>
    </main>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div style={{
      background:
        "linear-gradient(145deg,#111827,#0b1220)",
      border: "1px solid #1e293b",
      borderRadius: 18,
      padding: 24
    }}>
      <div style={{ fontSize: 30 }}>{icon}</div>

      <div style={{
        fontSize: 30,
        fontWeight: 800,
        marginTop: 12
      }}>
        {value}
      </div>

      <div style={{
        color: "#94a3b8",
        marginTop: 5
      }}>
        {title}
      </div>
    </div>
  );
}

const main = {
  minHeight: "100vh",
  background: "#05030d",
  color: "white",
  padding: "35px",
  fontFamily: "Arial"
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
  marginTop: 30
};

const box = {
  marginTop: 25,
  background: "#111827",
  border: "1px solid #1e293b",
  borderRadius: 18,
  padding: 25
};

const buttons = {
  display: "flex",
  gap: 10,
  margin: "20px 0",
  flexWrap: "wrap"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid #ffffff0d"
};

function countryName(code) {
  const names = {
    PK: "🇵🇰 Pakistan",
    US: "🇺🇸 United States",
    GB: "🇬🇧 United Kingdom",
    CA: "🇨🇦 Canada",
    AE: "🇦🇪 UAE",
    SA: "🇸🇦 Saudi Arabia",
    DE: "🇩🇪 Germany",
    FR: "🇫🇷 France",
    IN: "🇮🇳 India",
    AU: "🇦🇺 Australia"
  };

  return names[code] || `🌍 ${code}`;
}
