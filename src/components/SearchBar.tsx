import { useTransition } from "react";

import { useAtom } from "jotai/index";
import { useTranslations } from "next-intl";
import { IoCloseOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { searchStringAtom } from "@/atoms";

import { Button } from "./Button";
import { Input } from "./form/Input";

type SearchBarProps = {
  className?: string;
};

const SearchBar = ({ className }: SearchBarProps) => {
  const t = useTranslations("Tournaments");
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  const [isPending, startTransition] = useTransition();

  const updateSearchString = (str: string) => {
    startTransition(() => {
      setSearchString(str);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <label htmlFor="table-search" className="sr-only">
        {t("searchLabel")}
      </label>

      <div className="relative">
        <Input
          type="search"
          id="table-search"
          placeholder={t("searchPlaceholder")}
          size="small"
          startIcon={
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          }
          endIcon={
            searchString !== "" && (
              <Button
                intent="tertiary"
                size="compacted"
                onClick={() => setSearchString("")}
              >
                <IoCloseOutline className="h-5 w-5" />
              </Button>
            )
          }
          value={searchString}
          onChange={(e) => updateSearchString(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
