/** @type {import('next').NextConfig} */
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
    "rc-notification",
    "@ant-design/pro-components",
    "@ant-design/pro-form",
    "@ant-design/pro-table"
  ],

  experimental: {
    esmExternals: "loose"
  }
};

export default nextConfig;
