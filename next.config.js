/** @type {import('next').NextConfig} */
const nextConfig = {};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = require("next-intl/plugin")("./i18n.ts");

module.exports = nextConfig;
module.exports = withBundleAnalyzer(withNextIntl({}));
