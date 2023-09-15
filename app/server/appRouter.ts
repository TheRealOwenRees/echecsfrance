import { addTournament } from "./procedures/addTournament";
import { fetchTournamentResults } from "./procedures/fetchTournamentResults";
import { router } from "./trpc";

export const appRouter = router({
  addTournament,
  fetchTournamentResults,
});

export type AppRouter = typeof appRouter;
