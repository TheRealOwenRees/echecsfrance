/**
 * Retrieves tournament data from /api/tournaments/:country
 * @remarks The result is cached for the revalidation period in seconds
 */
export default async function getTournaments(country: string) {
  const res = await fetch(`http://localhost:3000/api/tournaments/${country}`, {
    next: { revalidate: 300 },
  });
  return await res.json();
}
