import Layout from "@/components/Layout";

export interface TournamentType {
  _id: string;
  location: string;
  department: string;
  tournament: string;
  url: string;
  time_control: string;
  date: string;
  coordinates: [number, number];
}

async function getTournaments() {
  const res = await fetch("http://localhost:3000/api/tournaments", {
    next: { revalidate: 300 },
  });
  return await res.json();
}

export default async function Tournaments() {
  const data = await getTournaments();
  console.log(data);

  const tournaments = data.map((t: TournamentType) => (
    <tr key={t._id}>
      <td>{t.date}</td>
      <td>{t.location}</td>
      <td>{t.tournament}</td>
      <td>{t.time_control}</td>
    </tr>
  ));

  return (
    <Layout>
      <main className="w-full">
        <table className="table-auto">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ville</th>
              <th>Tournois</th>
              <th>Cadence</th>
            </tr>
          </thead>
          <tbody>{tournaments}</tbody>
        </table>
      </main>
    </Layout>
  );
}
