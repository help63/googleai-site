"use client";

import { useEffect, useState } from "react";

const menu = [
  ["🏠","Home"],
  ["🖼️","Logo"],
  ["🔗","Links"],
  ["🎬","Videos"],
  ["📦","Content Manager"],
  ["📰","News"],
  ["🤖","AI Tools"],
  ["🛒","Shopping"],
  ["📱","Mobiles"],
  ["💻","Electronics"],
  ["💼","Jobs"],
  ["👕","Garments"],
  ["🏏","Cricket"],
  ["📺","Live TV"],
  ["📡","IPTV"],
  ["📝","Articles"],
  ["🍳","Recipes"],
  ["✈️","Travel"],
  ["☪️","Islam"],
  ["⚙️","Settings"]
];

export default function ToolboxMenu() {
  const [active, setActive] = useState("Home");
  const [dragIndex, setDragIndex] = useState(null);
  const [menuItems, setMenuItems] = useState(menu);
  const [logo, setLogo] = useState({ url:"", title:"GoogleAi" });
  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");

  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setLogo(data.logo || { url:"", title:"GoogleAi" });
        setLinks(Array.isArray(data.links) ? data.links : []);
        setVideos(Array.isArray(data.videos) ? data.videos : []);
      })
      .catch(() => {});
  }, []);

  async function saveAll() {
    setMessage("Saving...");

    const res = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logo, links, videos })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Saved successfully");
    } else {
      setMessage("❌ " + (data.error || "Save failed"));
    }
  }

  function addLink() {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    setLinks([
      ...links,
      {
        id: Date.now(),
        title: linkTitle.trim(),
        url: linkUrl.trim()
      }
    ]);

    setLinkTitle("");
    setLinkUrl("");
  }

  function addVideo() {
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    setVideos([
      ...videos,
      {
        id: Date.now(),
        title: videoTitle.trim(),
        url: videoUrl.trim()
      }
    ]);

    setVideoTitle("");
    setVideoUrl("");
  }

  const inputStyle = {
    width:"100%",
    boxSizing:"border-box",
    padding:12,
    marginTop:8,
    marginBottom:10,
    borderRadius:10,
    border:"1px solid #475569",
    background:"#0f172a",
    color:"#fff"
  };

  const buttonStyle = {
    border:0,
    borderRadius:10,
    padding:"10px 15px",
    cursor:"pointer",
    fontWeight:700
  };

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"230px 1fr",
      gap:22,
      marginTop:30
    }}>

      <aside style={{
        background:"linear-gradient(180deg,#111827,#312e81)",
        borderRadius:22,
        padding:16,
        boxShadow:"0 20px 50px rgba(0,0,0,.3)",
        height:"fit-content"
      }}>
        <div style={{
          fontSize:22,
          fontWeight:900,
          padding:"12px 10px 18px",
          borderBottom:"1px solid rgba(255,255,255,.12)"
        }}>
          🧰 Admin Tools
        </div>

        <div style={{marginTop:12}}>
          {menuItems.map(([icon,name], index) => (
            <button
              key={name}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex === null || dragIndex === index) return;
                const next = [...menuItems];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(index, 0, moved);
                setMenuItems(next);
                setDragIndex(null);
              }}
              onClick={() => {
                if (name === "IPTV") {
                  window.location.href = "/admin/dashboard/iptv";
                  return;
                }
                setActive(name);
              }}
              style={{
                width:"100%",
                border:0,
                borderRadius:12,
                padding:"12px 10px",
                marginBottom:6,
                cursor:"pointer",
                color:"#fff",
                textAlign:"left",
                fontSize:15,
                fontWeight:active === name ? 800 : 500,
                background:active === name
                  ? "linear-gradient(90deg,#ec4899,#7c3aed)"
                  : "transparent"
              }}
            >
              <span style={{fontSize:20,marginRight:10}}>
                {icon}
              </span>
              {name}
            </button>
          ))}
        </div>
      </aside>

      <section style={{
        minHeight:450,
        borderRadius:22,
        padding:28,
        background:"linear-gradient(145deg,#111827,#1e293b)",
        border:"1px solid rgba(255,255,255,.12)",
        boxShadow:"0 20px 50px rgba(0,0,0,.25)"
      }}>

        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          gap:15,
          flexWrap:"wrap"
        }}>
          <div>
            <div style={{fontSize:32,fontWeight:900}}>
              {menu.find(x => x[1] === active)?.[0]} {active}
            </div>
            <p style={{color:"#94a3b8"}}>
              Admin-only editing panel
            </p>
          </div>

          <button
            onClick={saveAll}
            style={{
              ...buttonStyle,
              background:"linear-gradient(90deg,#22c55e,#16a34a)",
              color:"#fff",
              fontSize:16
            }}
          >
            💾 Save Changes
          </button>
        </div>

        {message && (
          <div style={{
            marginTop:15,
            padding:12,
            borderRadius:10,
            background:"rgba(255,255,255,.08)"
          }}>
            {message}
          </div>
        )}

        {active === "Logo" && (
          <div style={{marginTop:25}}>
            <h2>🖼️ Website Logo</h2>

            <label>Logo Image URL</label>
            <input
              value={logo.url}
              onChange={e => setLogo({...logo,url:e.target.value})}
              placeholder="https://example.com/logo.png"
              style={inputStyle}
            />

            <label>Logo Title</label>
            <input
              value={logo.title}
              onChange={e => setLogo({...logo,title:e.target.value})}
              placeholder="GoogleAi"
              style={inputStyle}
            />

            {logo.url && (
              <div style={{marginTop:15}}>
                <p>Preview:</p>
                <img
                  src={logo.url}
                  alt="Logo preview"
                  style={{
                    maxWidth:280,
                    maxHeight:120,
                    objectFit:"contain"
                  }}
                />
              </div>
            )}
          </div>
        )}

        {active === "Links" && (
          <div style={{marginTop:25}}>
            <h2>🔗 Website Links</h2>

            <input
              value={linkTitle}
              onChange={e => setLinkTitle(e.target.value)}
              placeholder="Link title"
              style={inputStyle}
            />

            <input
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              style={inputStyle}
            />

            <button
              onClick={addLink}
              style={{
                ...buttonStyle,
                background:"#7c3aed",
                color:"#fff"
              }}
            >
              ➕ Add Link
            </button>

            <div style={{marginTop:20}}>
              {links.map((item,index) => (
                <div key={item.id || index} style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  gap:10,
                  padding:12,
                  marginBottom:8,
                  borderRadius:10,
                  background:"rgba(255,255,255,.06)"
                }}>
                  <span>
                    <strong>{item.title}</strong><br/>
                    <small>{item.url}</small>
                  </span>

                  <button
                    onClick={() =>
                      setLinks(links.filter((_,i) => i !== index))
                    }
                    style={{
                      ...buttonStyle,
                      background:"#dc2626",
                      color:"#fff"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "Videos" && (
          <div style={{marginTop:25}}>
            <h2>🎬 Video Manager</h2>

            <input
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="Video title"
              style={inputStyle}
            />

            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="YouTube/video URL"
              style={inputStyle}
            />

            <button
              onClick={addVideo}
              style={{
                ...buttonStyle,
                background:"#ec4899",
                color:"#fff"
              }}
            >
              ➕ Add Video
            </button>

            <div style={{marginTop:20}}>
              {videos.map((item,index) => (
                <div key={item.id || index} style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  gap:10,
                  padding:12,
                  marginBottom:8,
                  borderRadius:10,
                  background:"rgba(255,255,255,.06)"
                }}>
                  <span>
                    <strong>🎬 {item.title}</strong><br/>
                    <small>{item.url}</small>
                  </span>

                  <button
                    onClick={() =>
                      setVideos(videos.filter((_,i) => i !== index))
                    }
                    style={{
                      ...buttonStyle,
                      background:"#dc2626",
                      color:"#fff"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!["Logo","Links","Videos"].includes(active) && (
          <div style={{
            marginTop:30,
            padding:25,
            borderRadius:18,
            background:"linear-gradient(135deg,#7c3aed,#ec4899)"
          }}>
            <h2>✨ {active} Manager</h2>
            <p>
              Select this section to manage its content.
              Changes are available only from the protected Admin Dashboard.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}
