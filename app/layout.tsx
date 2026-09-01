import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GoogleAI Site - All in One Digital Portal",
  description:
    "Explore AI tools, news, videos, shopping, jobs, mobiles and more on GoogleAI Site.",
  alternates: {
    canonical: "https://googleai-site.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
