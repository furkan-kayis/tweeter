/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["fastly.picsum.photos", "firebasestorage.googleapis.com"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }],
    },
  ],
};

module.exports = nextConfig;
