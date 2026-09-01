export default function AdSlot({ title = "Advertisement" }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 120,
        border: "1px dashed #aaa",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px 0",
        background: "#fafafa",
        color: "#666",
      }}
      aria-label="Advertisement"
    >
      {title}
    </div>
  );
}
