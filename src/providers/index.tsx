"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { SessionProvider } from "next-auth/react";

import { useDynamicViewportUnits } from "@/hooks/useDynamicViewportUnits";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  useDynamicViewportUnits();

  return (
    <SessionProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
