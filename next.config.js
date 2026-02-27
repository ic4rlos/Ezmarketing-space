/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["antd", "@ant-design/icons"],
  experimental: {
    esmExternals: "loose",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
