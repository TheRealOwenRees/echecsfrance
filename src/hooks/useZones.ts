import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { myZones } from "@/server/myZones";

export const useZones = () => {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["zones"],
    queryFn: async () => myZones(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: status === "authenticated",
  });

  return {
    ...query,
    zones: query.data?.data ?? [],
  };
};
