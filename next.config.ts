import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone 模式：构建产物自带运行时，服务器只需 Node.js 即可运行
  output: "standalone",
};

export default nextConfig;
