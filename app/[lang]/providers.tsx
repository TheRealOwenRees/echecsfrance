"use client";

import { Provider } from "jotai";

import { useDynamicViewportUnits } from "@/hooks/useDynamicViewportUnits";

export default function Providers({ children }: { children: React.ReactNode }) {
  useDynamicViewportUnits();
  return <Provider>{children}</Provider>;
}
