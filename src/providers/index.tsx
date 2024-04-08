"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";

import { useDynamicViewportUnits } from "@/hooks/useDynamicViewportUnits";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  useDynamicViewportUnits();
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
