/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@ant-design/pro-components', '@lexical/react', '@heroicons/react','lexical','lodash'],
  },
};

export default nextConfig;
