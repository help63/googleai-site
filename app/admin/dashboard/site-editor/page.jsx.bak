"use client";

import { useRef, useState } from "react";

export default function SiteEditor() {
  const fileInputRef = useRef(null);

  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const menuItems = [
    ["🏠", "Home"],
    ["🤖", "AI Tools"],
    ["🎨", "AI Images"],
    ["🎥", "AI Videos"],
    ["📁", "Files"],
    ["📝", "Text"],
    ["⚙️", "Settings"],
  ];

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "unknown",
      size: file.size,
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const sendContent = async () => {
    try {
      if (!text.trim() && files.length === 0) {
        alert("Pehle text ya file add karein.");
        return;
      }

      if (files.length > 0) {
        const formData = new FormData();

        formData.append("menu", selectedMenu);

        files.forEach((item) => {
          formData.append("files", item.file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Upload failed");
        }

        console.log("UPLOADED:", result);
      }

      console.log("CONTENT:", {
        menu: selectedMenu,
        text,
      });

      alert(`Successfully sent to ${selectedMenu}`);

      setText("");
      setFiles([]);
    } catch (error) {
      console.error(error);
      alert(error.message || "Upload failed");
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 20 }}>
      <h1>Site Editor</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <aside>
          <h3>Menu</h3>

          {menuItems.map(([icon, name]) => (
            <button
              key={name}
              onClick={() => setSelectedMenu(name)}
              style={{
                display: "block",
                width: "100%",
                padding: 12,
                marginBottom: 8,
                textAlign: "left",
                borderRadius: 8,
                border: "1px solid #ddd",
                background:
                  selectedMenu === name ? "#e8e8e8" : "transparent",
                cursor: "pointer",
              }}
            >
              {icon} {name}
            </button>
          ))}
        </aside>

        <section>
          <h2>Edit: {selectedMenu}</h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Yahan ${selectedMenu} ke liye text likhein ya copy/paste karein...`}
            style={{
              width: "100%",
              minHeight: 180,
              padding: 15,
              borderRadius: 10,
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />

          <div
            style={{
              marginTop: 15,
              padding: 20,
              border: "2px dashed #aaa",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              📤 Upload Picture / Video / File
            </button>

            <p>Image, video, document ya koi bhi file select karein.</p>
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3>Selected Files</h3>

              {files.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    marginBottom: 8,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                  }}
                >
                  <span>
                    📎 {item.name}
                    <small style={{ marginLeft: 8 }}>
                      ({Math.round(item.size / 1024)} KB)
                    </small>
                  </span>

                  <button onClick={() => removeFile(item.id)}>
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              onClick={sendContent}
              style={{
                padding: "13px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📤 Send / Save {selectedMenu}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
