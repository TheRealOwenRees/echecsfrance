"use client";

import { Provider } from "jotai";

import { useDynamicViewportUnits } from "@/hooks/useDynamicViewportUnits";

import { TrpcProvider } from "./TrpcProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  useDynamicViewportUnits();
  return (
    <Provider>
      <TrpcProvider>{children}</TrpcProvider>
    </Provider>
  );
}
