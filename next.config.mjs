/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  transpilePackages: ["mui-one-time-password-input"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tma-dev-resource.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Any other configurations you need
};

export default withPWA(nextConfig);
