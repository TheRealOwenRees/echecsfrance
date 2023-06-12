/**
 * Retrieves tournament data from /api/tournaments/:country
 * @remarks The result is cached for the revalidation period in seconds
 */
export default async function getTournaments(country: string) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tournaments/${country}`, {
    next: { revalidate: 300 },
  });
  return await res.json();
}
