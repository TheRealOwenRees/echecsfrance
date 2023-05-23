export interface Tournament {
  _id: string;
  location: string;
  department: string;
  tournament: string;
  url: string;
  time_control: string;
  date: string;
  coordinates: [number, number];
}

export interface TournamentTableProps {
  tournamentData: Tournament[];
}
