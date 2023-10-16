import { addTournament } from "./procedures/addTournament";
import { contactUs } from "./procedures/contactUs";
import { fetchTournamentResults } from "./procedures/fetchTournamentResults";
import { getTournamentDetails } from "./procedures/getTournamentDetails";
import { searchTournaments } from "./procedures/searchTournaments";
import { router } from "./trpc";

export const appRouter = router({
  contactUs,
  addTournament,
  searchTournaments,
  getTournamentDetails,
  fetchTournamentResults,
});

export type AppRouter = typeof appRouter;
