import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getAnalytics() {
  try {
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "data", "analytics.json"),
        "utf8"
      )
    );
  } catch {
    return {
      totalViews: 0,
      visitors: {},
      countries: {},
      pages: {},
      recent: []
    };
  }
}

export default async function AnalyticsPage() {
  const cookieStore = await cookies();

  if (
    cookieStore.get("admin_session")?.value !==
    "authenticated"
  ) {
    redirect("/admin");
  }

  const data = await getAnalytics();

  const countries = Object.entries(data.countries || {})
    .map(([country, views]) => ({ country, views }))
    .sort((a, b) => b.views - a.views);

  const pages = Object.entries(data.pages || {})
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views);

  const uniqueVisitors = Object.keys(
    data.visitors || {}
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05030d",
        color: "white",
        padding: "35px",
        fontFamily: "Arial"
      }}
    >
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

        <h1
          style={{
            fontSize: 42,
            marginBottom: 5
          }}
        >
          Worldwide Analytics 🌍
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Private visitor statistics — admin only
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
            marginTop: 30
          }}
        >
          <Stat
            title="Total Views"
            value={data.totalViews || 0}
            icon="👁️"
          />

          <Stat
            title="Unique Visitors"
            value={uniqueVisitors}
            icon="👤"
          />

          <Stat
            title="Countries"
            value={countries.length}
            icon="🌍"
          />

          <Stat
            title="Pages Tracked"
            value={pages.length}
            icon="📄"
          />
        </div>

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 25
          }}
        >
          <h2>Visitors by Country 🌎</h2>

          {countries.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No visitors recorded yet.
            </p>
          ) : (
            countries.map((item) => (
              <div
                key={item.country}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom:
                    "1px solid #ffffff0d"
                }}
              >
                <b>{countryName(item.country)}</b>
                <span
                  style={{
                    color: "#a78bfa"
                  }}
                >
                  {item.views} views
                </span>
              </div>
            ))
          )}
        </section>

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 25
          }}
        >
          <h2>Most Viewed Pages</h2>

          {pages.map((item) => (
            <div
              key={item.page}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "13px 0",
                borderBottom:
                  "1px solid #ffffff0d"
              }}
            >
              <span>{item.page}</span>
              <b>{item.views}</b>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 25
          }}
        >
          <h2>Recent Visitors</h2>

          {(data.recent || [])
            .slice(0, 20)
            .map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "12px 0",
                  borderBottom:
                    "1px solid #ffffff0d",
                  color: "#cbd5e1"
                }}
              >
                🌍 {countryName(item.country)}
                {" — "}
                {item.page}
              </div>
            ))}
        </section>

      </div>
    </main>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg,#111827,#0b1220)",
        border: "1px solid #1e293b",
        borderRadius: 18,
        padding: 24
      }}
    >
      <div style={{ fontSize: 30 }}>
        {icon}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginTop: 12
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#94a3b8",
          marginTop: 5
        }}
      >
        {title}
      </div>
    </div>
  );
}

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
    IT: "🇮🇹 Italy",
    ES: "🇪🇸 Spain",
    AU: "🇦🇺 Australia",
    IN: "🇮🇳 India",
    TR: "🇹🇷 Türkiye",
    QA: "🇶🇦 Qatar",
    OM: "🇴🇲 Oman",
    KW: "🇰🇼 Kuwait",
    MY: "🇲🇾 Malaysia",
    SG: "🇸🇬 Singapore"
  };

  return names[code] || `🌍 ${code}`;
}
