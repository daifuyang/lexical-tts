/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@ant-design/pro-components',
      '@lexical/react',
       '@lexical/utils',
       '@lexical/selection',
       '@radix-ui/react-dialog',
       '@radix-ui/react-icons',
       '@heroicons/react',
       '@radix-ui/react-slot',
       'lexical',
       'lodash'
      ],
  },
};

export default nextConfig;
