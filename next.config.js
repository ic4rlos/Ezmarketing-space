/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["antd", "@ant-design/icons"],
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
