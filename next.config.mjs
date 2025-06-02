/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  devOptions: {
    enabled: true, // <— turn on SW in dev
    type: "module",
  },
  manifest: {
    name: "TMA Learning Platform",
    short_name: "TMA",
    description: "The Masters Academy Learning Platform",
    lang: "en",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3367D6",
    icons: [
      {
        src: "/icons/tma-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/tma-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/tma-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/tma-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/tma-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/tma-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/tma-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/tma-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/tma-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
});

const nextConfig = {
  transpilePackages: ["mui-one-time-password-input"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tma-dev-resource.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Any other configurations you need
};

export default withPWA(nextConfig);
