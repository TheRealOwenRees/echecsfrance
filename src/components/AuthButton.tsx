"use client";

import { useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const AuthButton = () => {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { data: sessionData } = useSession();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  if (sessionData) {
    return (
      <button disabled={signingOut} onClick={handleSignOut}>
        {t("signOut")}
      </button>
    );
  }

  return <button onClick={() => signIn()}>{t("signIn")}</button>;
};

export default AuthButton;
