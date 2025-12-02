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
