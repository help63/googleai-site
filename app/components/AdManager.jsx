"use client";

export default function AdManager({ provider = "Google AdSense", slot = "default" }) {
  return (
    <div
      className="ad-slot"
      data-provider={provider}
      data-slot={slot}
      style={{
        minHeight: 120,
        margin: "20px 0",
        padding: 20,
        border: "1px dashed #999",
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <p>Advertisement</p>
      <small>{provider} - {slot}</small>
    </div>
  );
}
