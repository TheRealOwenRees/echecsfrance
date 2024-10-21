import { useQuery } from "@tanstack/react-query";

import { myZones } from "@/server/myZones";

export const useZones = () => {
  const query = useQuery({
    queryKey: ["zones"],
    queryFn: async () => myZones(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  return {
    ...query,
    zones: query.data?.data ?? [],
  };
};
