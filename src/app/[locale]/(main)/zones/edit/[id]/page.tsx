"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import InfoMessage, { InfoMessageType } from "@/components/InfoMessage";
import { useZones } from "@/hooks/useZones";
import { editZone } from "@/server/editZone";
import { useRouter } from "@/utils/routing";

import { ZoneForm, ZoneFormValues } from "../../components/ZoneForm";

const EditZone = () => {
  const t = useTranslations("Zones");
  const router = useRouter();
  const params = useParams();

  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const { zones, isFetching, refetch } = useZones();

  const zone = zones.find((zone) => zone.id === params.id);

  if (isFetching) {
    return null;
  }

  if (!isFetching && !zone) {
    router.push("/zones");
  }

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      const updatedZone = await editZone({
        id: params.id as string,
        zone: data,
      });

      if (updatedZone?.validationErrors) {
        throw new Error("ERR_VALIDATION");
      } else if (updatedZone?.serverError) {
        throw new Error(updatedZone.serverError);
      }

      await refetch();
      router.push("/zones");
    } catch (error) {
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
        {t("editTitle")}
      </h2>

      <ZoneForm
        onSubmit={onSubmit}
        onCancel={() => router.push("/zones")}
        zone={zone}
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

export default EditZone;
