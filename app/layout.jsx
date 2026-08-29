import "./globals.css";
import Script from "next/script";
import AnalyticsTracker from "./components/AnalyticsTracker";

export const metadata = {
  title: "GoogleAi — News & AI Studio",
  description:
    "Latest Pakistan, World, Sports, Technology news and AI tools."
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
