import { TournamentFormProps } from "@/types";
import { useRef, useState } from "react";
import { LatLngLiteral } from "leaflet";
import { useAtomValue } from "jotai";
import { franceCenterAtom } from "@/app/atoms";

export const useTournamentForm = (): TournamentFormProps => {
  const center = useAtomValue(franceCenterAtom);

  const tournamentNameRef = useRef(null);
  const dateRef = useRef(null);
  const urlRef = useRef(null);
  const timeControlRef = useRef(null);
  const normRef = useRef(null);
  const addressRef = useRef(null);
  const townRef = useRef(null);
  const departmentRef = useRef(null);
  const countryRef = useRef(null);
  const yourNameRef = useRef(null);
  const yourEmailRef = useRef(null);
  const messageRef = useRef(null);
  const [position, setPosition] = useState<LatLngLiteral>(center);

  return {
    tournamentNameRef,
    dateRef,
    urlRef,
    timeControlRef,
    normRef,
    addressRef,
    townRef,
    departmentRef,
    countryRef,
    yourNameRef,
    yourEmailRef,
    messageRef,
    position,
    setPosition,
  };
};

export default useTournamentForm;
