import { LatLngLiteral } from "leaflet";
import { TournamentFormProps } from "@/types";
import formatDate from "@/utils/formatDate";

const tournamentFormToDB = async (formRefs: TournamentFormProps) => {
  const data = {
    address: formRefs.addressRef.current?.value,
    town: formRefs.townRef.current?.value.toUpperCase(),
    department: formRefs.departmentRef.current?.value,
    tournament: formRefs.tournamentNameRef.current?.value,
    url: formRefs.urlRef.current?.value,
    time_control: formRefs.timeControlRef.current?.value,
    date: formatDate(formRefs.dateRef.current?.value),
    coordinates: [formRefs.position.lat, formRefs.position.lng],
    country: formRefs.countryRef.current?.value,
    norm_tournament: formRefs.normRef.current?.value,
  };

  return await fetch("/api/add-tournament", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default tournamentFormToDB;
