"use client";

import { useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@/components/DropdownMenu";

export const useAuthMenuOptions = () => {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { data: sessionData, status } = useSession();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  if (status === "loading") {
    return [];
  }

  if (!sessionData) {
    return [
      {
        title: t("signIn"),
        onClick: () => signIn(),
      },
    ];
  }

  const items: DropdownMenuItem[] = [
    {
      title: t("myZones"),
      onClick: () => router.push("/zones"),
      disabled: signingOut,
    },
    // {
    //   title: t("deleteAccount"),
    //   onClick: handleSignOut,
    //   disabled: signingOut,
    // },
    {
      title: t("signOut"),
      onClick: handleSignOut,
      disabled: signingOut,
    },
  ];

  return items;
};
