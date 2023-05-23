interface TournamentType {
  _id: string;
  location: string;
  department: string;
  tournament: string;
  url: string;
  time_control: string;
  date: string;
  coordinates: [number, number];
}

export default function TournamentTable({ tournamentData }) {
  const tournaments = tournamentData.map((t: TournamentType) => (
    <tr
      className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
      key={t._id}
    >
      <td>{t.date}</td>
      <td>{t.location}</td>
      <a href={t.url} target="_blank">
        <td>{t.tournament}</td>
      </a>
      <td>{t.time_control}</td>
    </tr>
  ));

  return (
    <section id="tournament-table" className="">
      <table className="min-w-full text-center">
        <thead className="border-b">
          <tr>
            <th>Date</th>
            <th>Ville</th>
            <th>Tournois</th>
            <th>Cadence</th>
          </tr>
        </thead>
        <tbody>{tournaments}</tbody>
      </table>
    </section>
  );
}
