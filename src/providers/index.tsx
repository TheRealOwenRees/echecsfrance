"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "jotai";

import { useDynamicViewportUnits } from "@/hooks/useDynamicViewportUnits";

import { TrpcProvider } from "./TrpcProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  useDynamicViewportUnits();
  return (
    <SessionProvider>
      <Provider>
        <TrpcProvider>{children}</TrpcProvider>
      </Provider>
    </SessionProvider>
  );
}
