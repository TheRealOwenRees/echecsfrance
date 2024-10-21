"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import InfoMessage, { InfoMessageType } from "@/components/InfoMessage";
import { useZones } from "@/hooks/useZones";
import { createZone } from "@/server/createZone";
import { useRouter } from "@/utils/routing";

import { ZoneForm, ZoneFormValues } from "../components/ZoneForm";

const CreateZone = () => {
  const t = useTranslations("Zones");
  const router = useRouter();

  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const { refetch } = useZones();

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      await createZone(data);
      await refetch();

      router.push("/zones");
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        type: "error",
        message: t("createFailure"),
      });
    }
  };

  return (
    <div>
      <h2
        className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        data-test="header2"
      >
        {t("createTitle")}
      </h2>

      <ZoneForm
        withInfo
        onSubmit={onSubmit}
        onCancel={() => router.push("/zones")}
      />

      {responseMessage && (
        <InfoMessage
          message={responseMessage.message}
          type={responseMessage.type}
          onDismiss={() => setResponseMessage(null)}
        />
      )}
    </div>
  );
};

export default CreateZone;
