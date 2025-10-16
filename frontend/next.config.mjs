/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended
  swcMinify: true,       // Faster build
  output: undefined,     // SSR ke liye static export disable
};

export default nextConfig;
