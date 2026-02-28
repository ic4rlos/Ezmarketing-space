/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  reactStrictMode: true,

  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
    "rc-notification"
  ],

  experimental: {
    esmExternals: "loose"
  },

  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(".");
    return config;
  }
};

export default nextConfig;
