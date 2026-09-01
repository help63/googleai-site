 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <main style={{
        minHeight:"100vh", background:"#05030d", color:"white",
        padding:"35px", fontFamily:"Arial"
      }}>
        <h1>Loading Analytics...</h1>
      </main>
    );
  }

  const chartData =
    period === "daily" ? data.daily || [] :
    period === "weekly" ? data.weekly || [] :
    data.monthly || [];

  const max = Math.max(...chartData.map(x => x.views), 1);

  return (
    <main style={{
      minHeight:"100vh",
      background:"#05030d",
      color:"white",
      padding:"35px",
      fontFamily:"Arial"
    }}>
      <div style={{maxWidth:1100, margin:"auto"}}>

        <Link href="/admin/dashboard"
          style={{color:"#a78bfa", textDecoration:"none"}}>
          ← Admin Dashboard
        </Link>

        <h1 style={{fontSize:42, marginBottom:5}}>
          Worldwide Analytics 🌍
        </h1>

        <p style={{color:"#94a3b8"}}>
          Daily, weekly and monthly visitor statistics
        </p>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
          gap:18,
          marginTop:30
        }}>
          <Stat title="Total Views" value={data.totalViews || 0} icon="👁️"/>
          <Stat title="Unique Visitors" value={data.uniqueVisitors || 0} icon="👤"/>
          <Stat title="Countries" value={(data.countries || []).length} icon="🌍"/>
          <Stat title="Pages Tracked" value={(data.pages || []).length} icon="📄"/>
        </div>

        <section style={box}>
          <h2>Traffic Statistics 📊</h2>

          <div style={{
            display:"flex",
            gap:10,
            margin:"20px 0",
            flexWrap:"wrap"
          }}>
            {["daily","weekly","monthly"].map(x => (
              <button
                key={x}
                onClick={() => setPeriod(x)}
                style={{
                  padding:"10px 18px",
                  borderRadius:10,
                  border:"1px solid #334155",
                  background:period === x ? "#7c3aed" : "#111827",
                  color:"white",
                  cursor:"pointer"
                }}
              >
                {x[0].toUpperCase() + x.slice(1)}
              </button>
            ))}
          </div>

          <div style={{
            display:"flex",
            alignItems:"end",
            gap:8,
            height:280,
            overflowX:"auto",
            padding:"20px 5px"
          }}>
            {chartData.length === 0 ? (
              <p style={{color:"#64748b"}}>No data yet.</p>
            ) : chartData.map((item, i) => {
              const value = item.views || 0;
              const height = Math.max((value / max) * 220, 4);
              const label = item.date || item.week || item.month;

              return (
                <div key={i} style={{
                  minWidth:period === "daily" ? 28 : 55,
                  height:250,
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"end",
                  alignItems:"center",
                  gap:6
                }}>
                  <b style={{fontSize:12}}>{value}</b>

                  <div style={{
                    width:period === "daily" ? 22 : 42,
                    height,
                    background:"linear-gradient(180deg,#a78bfa,#6d28d9)",
                    borderRadius:"6px 6px 2px 2px"
                  }}/>

                  <span style={{
                    fontSize:9,
                    color:"#94a3b8",
                    writingMode:period === "daily" ? "vertical-rl" : "horizontal-tb"
                  }}>
                    {String(label).slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={box}>
          <h2>Visitors by Country 🌎</h2>

          {(data.countries || []).length === 0 ? (
            <p style={{color:"#64748b"}}>No visitors recorded yet.</p>
          ) : data.countries.map(item => (
            <div key={item.country} style={row}>
              <b>{countryName(item.country)}</b>
              <span style={{color:"#a78bfa"}}>{item.views} views</span>
            </div>
          ))}
        </section>

        <section style={box}>
          <h2>Most Viewed Pages</h2>

          {(data.pages || []).map(item => (
            <div key={item.page} style={row}>
              <span>{item.page}</span>
              <b>{item.views}</b>
            </div>
          ))}
        </section>

        <section style={box}>
          <h2>Recent Visitors</h2>

          {(data.recent || []).slice(0,20).map((item,index) => (
            <div key={index} style={{
              padding:"12px 0",
              borderBottom:"1px solid #ffffff0d",
              color:"#cbd5e1"
            }}>
              🌍 {countryName(item.country)} — {item.page}
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}

function Stat({title,value,icon}) {
  return (
    <div style={{
      background:"linear-gradient(145deg,#111827,#0b1220)",
      border:"1px solid #1e293b",
      borderRadius:18,
      padding:24
    }}>
      <div style={{fontSize:30}}>{icon}</div>
      <div style={{
        fontSize:32,
        fontWeight:800,
        marginTop:12
      }}>
        {value}
      </div>
      <div style={{color:"#94a3b8",marginTop:5}}>
        {title}
      </div>
    </div>
  );
}

const box = {
  marginTop:25,
  background:"#111827",
  border:"1px solid #1e293b",
  borderRadius:18,
  padding:25
};

const row = {
  display:"flex",
  justifyContent:"space-between",
  padding:"14px 0",
  borderBottom:"1px solid #ffffff0d"
};

function countryName(code) {
  const names = {
    PK:"🇵🇰 Pakistan",
    US:"🇺🇸 United States",
    GB:"🇬🇧 United Kingdom",
    CA:"🇨🇦 Canada",
    AE:"🇦🇪 UAE",
    SA:"🇸🇦 Saudi Arabia",
    DE:"🇩🇪 Germany",
    FR:"🇫🇷 France",
    IT:"🇮🇹 Italy",
    ES:"🇪🇸 Spain",
    AU:"🇦🇺 Australia",
    IN:"🇮🇳 India",
    TR:"🇹🇷 Türkiye",
    QA:"🇶🇦 Qatar",
    OM:"🇴🇲 Oman",
    KW:"🇰🇼 Kuwait",
    MY:"🇲🇾 Malaysia",
    SG:"🇸🇬 Singapore"
  };

  return names[code] || `🌍 ${code}`;
}
