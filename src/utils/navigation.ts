import {
  Pathnames,
  createLocalizedPathnamesNavigation,
} from "next-intl/navigation";

export const locales = ["fr", "en"] as const;

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  "/": "/",
  "/clubs": "/clubs",
  "/elo": "/elo",

  "/tournaments": {
    fr: "/tournois",
    en: "/tournaments",
  },

  "/zones": {
    fr: "/regions",
    en: "/zones",
  },

  "/zones/create": {
    fr: "/regions/creer",
    en: "/zones/create",
  },

  "/zones/edit/[id]": {
    fr: "/regions/modifier/[id]",
    en: "/zones/edit/[id]",
  },

  "/add-tournament": {
    fr: "/ajouter-un-tournoi",
    en: "/add-tournament",
  },

  "/contact-us": {
    fr: "/contactez-nous",
    en: "/contact-us",
  },

  "[...rest]": "[...rest]",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
