"use client";

import { FeatureCollection } from "geojson";
import { useTranslations } from "next-intl";

import { ZoneForm } from "../components/ZoneForm";

type ZoneFormValues = {
  features: FeatureCollection;
};

const CreateZone = () => {
  const t = useTranslations("Zones");

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      console.log(data);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
      <ZoneForm />
    </div>
  );
};

export default CreateZone;
