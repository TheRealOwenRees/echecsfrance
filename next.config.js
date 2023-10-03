/** @type {import('next').NextConfig} */
const nextConfig = {};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = require("next-intl/plugin")("./i18n.ts");

const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = nextConfig;
module.exports = withBundleAnalyzer(withNextIntl(withPWA({})));
