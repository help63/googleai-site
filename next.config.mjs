/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/googleai-site",
  assetPrefix: "/googleai-site/",
};

export default nextConfig;
