import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "GoogleAi — Global AI, News, Shopping & Live TV Portal",
  description:
    "GoogleAi is a global portal for AI tools, AI images, news, shopping and more.",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

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



