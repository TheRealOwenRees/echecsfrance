import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'en'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/tournois`)
  defaultLocale: 'fr'
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next|robots" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|sitemap.xml|robots|.*\\..*).*)']
}
