import { useTransition } from "react";

import { useAtom } from "jotai/index";
import { useTranslations } from "next-intl";
import { IoCloseOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { searchStringAtom } from "@/atoms";

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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
        </div>

        {searchString !== "" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-900 dark:text-white">
            <button onClick={() => setSearchString("")}>
              <IoCloseOutline className="h-5 w-5" />
            </button>
          </div>
        )}

        <input
          type="search"
          id="table-search"
          className={twMerge(
            "block rounded-lg border border-gray-300 bg-gray-50 p-2.5 px-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-primary-500",
            className,
          )}
          placeholder={t("searchPlaceholder")}
          value={searchString}
          onChange={(e) => updateSearchString(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
