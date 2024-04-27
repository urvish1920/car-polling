/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["static.vecteezy.com", "firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
