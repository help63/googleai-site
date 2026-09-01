import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
  description:
    "GoogleAi is a global portal for AI tools, AI images, news, shopping and more.",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

async function getMenu() {
  try {
    const file = path.join(process.cwd(), "data", "content-types.json");
    const menu = JSON.parse(await fs.readFile(file, "utf8"));
    return menu.filter(item => item.enabled);
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }) {
  const menu = await getMenu();
  return (
    <html lang="en">
      <body>

        <nav>
          {menu.map((item) => (
            <Link key={item.url} href={item.url}>
              {item.name}
            </Link>
          ))}
        </nav>

        <Script
  async
  strategy="lazyOnload"
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
  crossOrigin="anonymous"
/>

        {children}

        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />

            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag("js", new Date());
                gtag("config", "${gaId}");
              `}
            </Script>
          </>
        )}

      </body>
    </html>
  );
}



