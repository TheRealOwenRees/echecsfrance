/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-leaflet v4 creates maps in a render-phase ref callback, which breaks
  // under React dev StrictMode's double-mount ("Map container is already
  // initialized"). StrictMode only runs in dev, so production is unaffected.
  reactStrictMode: false,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = require("next-intl/plugin")("./src/i18n.ts");

// PWA service worker, generated with Serwist. It hooks into webpack, so it is
// only enabled for production builds (`next build --webpack`) and disabled for
// development, letting `next dev` keep running on Turbopack.
const withSerwist =
  process.env.NODE_ENV === "production"
    ? require("@serwist/next").default({
        swSrc: "src/app/sw.ts",
        swDest: "public/sw.js",
        disable: process.env.NODE_ENV !== "production",
      })
    : (config) => config;

module.exports = withBundleAnalyzer(withNextIntl(withSerwist(nextConfig)));
