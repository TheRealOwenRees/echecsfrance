/**
 * Retrieves tournament data from /api/tournaments/:country
 * @remarks The result is cached for the revalidation period in seconds
 */
export default async function getTournaments(country: string) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tournaments/${country}`, {
    next: { revalidate: 300 },
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch tournament data");
  }
  return await res.json();
}
