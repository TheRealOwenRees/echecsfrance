"use client";

import { MenuButton } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { RxAvatar } from "react-icons/rx";

import { useAuthMenuOptions } from "@/hooks/useAuthMenuOptions";

import { DropdownMenu } from "./DropdownMenu";

const AuthButton = () => {
  const t = useTranslations("Nav");
  const { data: sessionData, status } = useSession();
  const menuItems = useAuthMenuOptions();

  if (status === "loading") {
    return null;
  }

  if (sessionData) {
    return (
      <DropdownMenu
        items={menuItems}
        containerClassName="flex items-center justify-center"
        buttonComponent={
          <MenuButton>
            <RxAvatar className="h-6 w-6" />
          </MenuButton>
        }
      />
    );
  }

  return <button onClick={() => signIn()}>{t("signIn")}</button>;
};

export default AuthButton;
