/** @type {import('next').NextConfig} */
const nextConfig = {};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = require("next-intl/plugin")("./i18n.ts");

module.exports = nextConfig;
module.exports = withBundleAnalyzer(
  withNextIntl({
    rewrites: async () => {
      return [
        {
          source: "/api/py/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:5000/api/py/:path*"
              : "/api/py/:path*",
        },
      ];
    },
  }),
);
