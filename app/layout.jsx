import "./globals.css";

export const metadata = {
  title: "GoogleAi — Creative AI Studio",
  description: "Creative AI and cybersecurity learning workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
