/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  distDir: ".next",
  assetPrefix: "/", // zaroori
};

export default nextConfig;
