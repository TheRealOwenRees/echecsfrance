import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { IoChevronForward } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

type KFactorProps = {
  className?: string;
};

export const KFactor = ({ className }: KFactorProps) => {
  const t = useTranslations("Elo");

  return (
    <Disclosure>
      <Disclosure.Button
        className={twMerge(
          "flex items-center text-sm text-gray-500 dark:text-neutral-400",
          className,
        )}
      >
        <IoChevronForward className="mr-2 h-4 w-4 transition-transform ui-open:rotate-90 ui-open:transform" />
        {t("kFactorTitle")}
      </Disclosure.Button>

      <Disclosure.Panel className="mt-4">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          {t("kFactorInfo1")}
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">
          {t("kFactorInfo2")}
        </p>

        <ul className="mb-8 ml-4 mt-3 list-outside list-disc">
          {(
            [
              "kFactorInfo3",
              "kFactorInfo4",
              "kFactorInfo5",
              "kFactorInfo6",
              "kFactorInfo7",
            ] as const
          ).map((key) => (
            <li
              key={key}
              className="mt-2 text-sm text-gray-500 dark:text-neutral-400"
            >
              {t.rich(key, { b: (str) => <b>{str}</b> })}
            </li>
          ))}
        </ul>
      </Disclosure.Panel>
    </Disclosure>
  );
};
