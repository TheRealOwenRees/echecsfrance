import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "as-needed",

  pathnames: {
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

    "/delete-account": {
      fr: "/supprimer-compte",
      en: "/delete-account",
    },

    "/privacy": {
      fr: "/politique-de-confidentialite",
      en: "/privacy",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation(routing);
