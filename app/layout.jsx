import "./globals.css";
import Script from "next/script";
import AnalyticsTracker from "./components/AnalyticsTracker";

export const metadata = {
  metadataBase: new URL("https://googleai-site.vercel.app"),
  title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
  description:
    "GoogleAi is a global portal for AI tools, AI image generation, AI writing, AI assistant, news, shopping, jobs, technology and live TV.",
  keywords: [
    "GoogleAi",
    "AI tools",
    "AI image generator",
    "AI writer",
    "AI assistant",
    "Pakistan news",
    "global news",
    "live TV",
    "shopping",
    "jobs",
    "technology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
    description:
      "AI tools, news, shopping, jobs, technology and live TV in one global portal.",
    url: "https://googleai-site.vercel.app/",
    siteName: "GoogleAi",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
    description:
      "AI tools, news, shopping, jobs, technology and live TV in one global portal.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />

        {children}

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
