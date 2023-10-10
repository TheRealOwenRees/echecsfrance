import { addTournament } from "./procedures/addTournament";
import { contactUs } from "./procedures/contactUs";
import { fetchTournamentResults } from "./procedures/fetchTournamentResults";
import { router } from "./trpc";

export const appRouter = router({
  contactUs,
  addTournament,
  fetchTournamentResults,
});

export type AppRouter = typeof appRouter;
