"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/admin/dashboard";
    } else {
      setError(data.error || "Invalid password");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#0b1020",
      color: "white",
      fontFamily: "Arial"
    }}>
      <form onSubmit={login} style={{
        width: 340,
        padding: 30,
        borderRadius: 16,
        background: "#151b2e"
      }}>
        <h1>Admin Login</h1>

        <input
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          style={{
            width: "100%",
            padding: 12,
            margin: "15px 0",
            boxSizing: "border-box"
          }}
        />

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            margin: "15px 0",
            boxSizing: "border-box"
          }}
        />

        <button type="submit" style={{
          width: "100%",
          padding: 12,
          cursor: "pointer"
        }}>
          Login
        </button>

        {error && <p style={{color: "#ff6b6b"}}>{error}</p>}
      </form>
    </main>
  );
}
