export interface Tournament {
  _id: string;
  town: string;
  department: string;
  tournament: string;
  url: string;
  time_control: string;
  date: string;
  coordinates: [number, number];
}

export interface TournamentDataProps {
  tournamentData: Tournament[];
}

export type ScrollableElement = Window | HTMLElement;
