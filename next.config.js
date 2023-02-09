/** @type {import('next').NextConfig} */
// const path = require('path');
const nextConfig = {
  experimental: { appDir: true, },
  reactStrictMode: true,
  swcMinify: true,
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     $: 'jquery',
  //     jQuery: 'jquery',
  //   })
  // ]
  // sassOptions: {
  //   includePaths: [path.join(__dirname, `styles`)]
  // }
}

module.exports = nextConfig
