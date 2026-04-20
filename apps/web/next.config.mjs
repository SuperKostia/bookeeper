/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bookeeper/ui-tokens', '@bookeeper/types'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
