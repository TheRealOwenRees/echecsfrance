import { addTournament } from "./procedures/addTournament";
import { router } from "./trpc";

export const appRouter = router({
  addTournament,
});

export type AppRouter = typeof appRouter;
