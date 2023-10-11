import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "@/../tailwind.config.js";

const config = resolveConfig(tailwindConfig);

const isSSR =
  typeof window === "undefined" ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);

const isBrowser = !isSSR;
const useIsomorphicEffect = isBrowser ? useLayoutEffect : useEffect;

export type CreatorReturnType = {
  useBreakpoint<B>(breakpoint: B, defaultValue?: boolean): boolean;
  useBreakpointEffect<B>(breakpoint: B, effect: (match: boolean) => void): void;
  useBreakpointValue<B, T, U>(breakpoint: B, valid: T, invalid: U): T | U;
};

function create(screens: object | undefined) {
  if (!screens) {
    throw new Error(
      "Failed to create breakpoint hooks, given `screens` value is invalid.",
    );
  }

  function useBreakpoint(breakpoint: string, defaultValue: boolean = false) {
    const [match, setMatch] = useState(() => defaultValue);
    const matchRef = useRef(defaultValue);

    useIsomorphicEffect(() => {
      if (!(isBrowser && "matchMedia" in window)) return undefined;

      function track() {
        // @ts-expect-error accessing index with uncertain `screens` type
        const value = (screens[breakpoint] as string) ?? "999999px";
        const query = window.matchMedia(`(min-width: ${value})`);
        matchRef.current = query.matches;
        if (matchRef.current != match) {
          setMatch(matchRef.current);
        }
      }

      window.addEventListener("resize", track);
      track();
      return () => window.removeEventListener("resize", track);
    });

    return match;
  }

  function useBreakpointEffect<Breakpoint extends string>(
    breakpoint: Breakpoint,
    effect: (match: boolean) => void,
  ) {
    const match = useBreakpoint(breakpoint);
    useEffect(() => effect(match));
    return null;
  }

  function useBreakpointValue<Breakpoint extends string, T, U>(
    breakpoint: Breakpoint,
    valid: T,
    invalid: U,
  ) {
    const match = useBreakpoint(breakpoint);
    const value = useMemo(
      () => (match ? valid : invalid),
      [invalid, match, valid],
    );
    return value;
  }

  return {
    useBreakpoint,
    useBreakpointEffect,
    useBreakpointValue,
  } as CreatorReturnType;
}

export const { useBreakpoint, useBreakpointEffect, useBreakpointValue } =
  create(config.theme!.screens);
