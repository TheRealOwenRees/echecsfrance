"use client";

import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import InfoMessage, { clearMessage } from "@/components/InfoMessage";
import { editZone } from "@/server/editZone";
import { myZones } from "@/server/myZones";
import { useRouter } from "@/utils/navigation";

import { ZoneForm, ZoneFormValues } from "../../components/ZoneForm";

const EditZone = () => {
  const t = useTranslations("Zones");
  const router = useRouter();
  const params = useParams();

  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => myZones(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const editZoneMutation = useMutation({
    mutationFn: async (data: ZoneFormValues) => {
      const updatedZone = await editZone({
        id: params.id as string,
        zone: data,
      });

      if (updatedZone.serverError) {
        throw new Error(updatedZone.serverError);
      }

      return updatedZone;
    },
    onError: (error) => {
      setResponseMessage({
        isSuccessful: false,
        message: t("createFailure"),
      });

      clearMessage(setResponseMessage);
    },
    onSuccess: async () => {
      await refetch();
      router.push("/zones");
    },
  });

  const zone = (data?.data ?? []).find((zone) => zone.id === params.id);

  if (isFetching) {
    return null;
  }

  if (!isFetching && !zone) {
    router.push("/zones");
  }

  const onSubmit = async (data: ZoneFormValues) => {
    await editZoneMutation.mutateAsync(data);
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
      <InfoMessage responseMessage={responseMessage} />
    </div>
  );
};

export default EditZone;
