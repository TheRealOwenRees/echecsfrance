import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/server/appRouter";

export type APIRouterInput = inferRouterInputs<AppRouter>;
export type APIRouterOutput = inferRouterOutputs<AppRouter>;

export type TournamentResultsData = APIRouterOutput["fetchTournamentResults"];

export const trpc = createTRPCReact<AppRouter>();
