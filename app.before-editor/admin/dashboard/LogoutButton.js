"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <button
      onClick={logout}
      style={{
        padding: "12px 20px",
        background: "#ef4444",
        color: "white",
        border: 0,
        borderRadius: 8,
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
}
