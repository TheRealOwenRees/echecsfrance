"use client";

import React, { useState } from "react";

import { useFormatter, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { IoAdd } from "react-icons/io5";

import { Button, buttonVariants } from "@/components/Button";
import InfoMessage, { clearMessage } from "@/components/InfoMessage";
import { Modal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { useZones } from "@/hooks/useZones";
import { deleteZone } from "@/server/deleteZone";
import { TimeControl } from "@/types";
import { Link, useRouter } from "@/utils/routing";

const ZoneThumbnail = dynamic(() => import("./components/ZoneThumbnail"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-[200px] bg-gray-200" />,
});

const Zones = () => {
  const t = useTranslations("Zones");
  const at = useTranslations("App");
  const router = useRouter();
  const format = useFormatter();

  const [deletingZoneId, setDeletingZoneId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const { zones, isFetching, refetch } = useZones();

  const onDelete = async () => {
    try {
      if (!deletingZoneId) return;

      await deleteZone({ id: deletingZoneId });
      await refetch();
      setDeletingZoneId(null);

      router.push("/zones");
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        isSuccessful: false,
        message: t("createFailure"),
      });

      clearMessage(setResponseMessage);
    }
  };

  return (
    <>
      <div>
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
                ...(zone.otherNotifications ? [TimeControl.Other] : []),
              ];

              const notificationsList = format.list(
                notifications.map((tc) => at("timeControlEnumInline", { tc })),
                { type: "conjunction" },
              );

              return (
                <div
                  className="flex flex-col gap-4 text-gray-900 dark:text-white md:flex-row"
                  key={zone.id}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white md:hidden">
                    {zone.name}
                  </h3>

                  <ZoneThumbnail features={zone.features} />

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <h3 className="hidden text-xl font-semibold text-gray-900 dark:text-white md:block">
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
                      <Link
                        href={{
                          pathname: "/zones/edit/[id]",
                          params: { id: zone.id },
                        }}
                        className={buttonVariants({ intent: "secondary" })}
                      >
                        {at("editButton")}
                      </Link>

                      <Button
                        intent="secondary"
                        type="button"
                        onClick={() => setDeletingZoneId(zone.id)}
                      >
                        {at("deleteButton")}
                      </Button>
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

      <Modal
        open={deletingZoneId !== null}
        onClose={() => setDeletingZoneId(null)}
        title={t("deleteZoneTitle")}
        subTitle={t("deleteZoneInfo")}
      >
        <InfoMessage responseMessage={responseMessage} />

        <div className="flex items-center justify-between space-x-4 text-sm font-bold">
          <Button
            intent="secondary"
            type="button"
            onClick={() => setDeletingZoneId(null)}
          >
            {at("cancelButton")}
          </Button>

          <Button onClick={() => onDelete()}>{at("deleteButton")}</Button>
        </div>
      </Modal>
    </>
  );
};

export default Zones;
