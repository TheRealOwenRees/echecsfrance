"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { IoAdd } from "react-icons/io5";

import { Spinner } from "@/components/Spinner";
import { myZones } from "@/server/myZones";
import { TimeControl } from "@/types";
import { Link } from "@/utils/navigation";

const ZoneThumbnail = dynamic(() => import("./components/ZoneThumbnail"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-[200px] bg-gray-200" />,
});

const Zones = () => {
  const t = useTranslations("Zones");
  const at = useTranslations("App");
  const format = useFormatter();

  const { data, isFetching, error } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => myZones(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const zones = data?.data ?? [];

  return (
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
      <h2
        className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        data-test="header2"
      >
        {t("title")}
      </h2>
      <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
        {t("info")}
      </p>

      {isFetching ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {zones?.map((zone) => {
            const notifications = [
              ...(zone.classicNotifications ? [TimeControl.Classic] : []),
              ...(zone.rapidNotifications ? [TimeControl.Rapid] : []),
              ...(zone.blitzNotifications ? [TimeControl.Blitz] : []),
            ];
            console.log(notifications);
            const notificationsList = format.list(
              notifications.map((tc) => at("timeControlEnumInline", { tc })),
              { type: "conjunction" },
            );

            return (
              <div
                className="flex gap-4 text-gray-900 dark:text-white"
                key={zone.id}
              >
                <ZoneThumbnail features={zone.features} size={200} />
                <div className="flex flex-1 flex-col justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {zone.name}
                  </h3>

                  <div>
                    {notifications.length === 0
                      ? t("noNotifications")
                      : t.rich("withNotifications", {
                          list: notificationsList,
                          b: (str) => <b>{str}</b>,
                        })}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="rounded-lg border border-primary px-3 py-2 text-center text-xs text-primary  hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
                    >
                      {t("editButton")}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-primary px-3 py-2 text-center text-xs text-primary  hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
                    >
                      {t("deleteButton")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 flex justify-center gap-4">
        <Link
          href={`/zones/create`}
          className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          <IoAdd className="mr-2 inline-block h-5 w-5" />
          {t("addZoneButton")}
        </Link>
      </div>
    </div>
  );
};

export default Zones;
