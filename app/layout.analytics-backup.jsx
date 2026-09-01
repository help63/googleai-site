import "./globals.css";

export const metadata = {
  title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
  description:
    "GoogleAi is a global portal for AI tools, AI image generation, AI writing, news, shopping, jobs, technology and live TV.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
