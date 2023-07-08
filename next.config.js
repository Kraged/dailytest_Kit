/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/:year/:county/:town",
//         destination: "/index",
//         // reactStrictMode: true,
//       },
//     ];
//   },
// };
