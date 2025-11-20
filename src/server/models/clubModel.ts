export type ClubModel = {
  name: string;
  url?: string;
  address?: string;
  email?: string;
  website?: string;
  coordinates: [number, number];
  manual_entry?: boolean;
  pending?: boolean;
};
