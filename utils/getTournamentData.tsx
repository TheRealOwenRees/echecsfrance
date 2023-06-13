/**
 * Retrieves tournament data from /api/tournaments/:country
 * @remarks The result is cached for the revalidation period in seconds
 */
export default async function getTournaments(country: string) {
  const server = process.env.SERVER;
  const res = await fetch(`${server}/api/tournaments/${country}`, {
    next: { revalidate: 300 },
  });

  if (res.status !== 200) {
    throw new Error("Failed to fetch tournament data");
  }
  return await res.json();
}
