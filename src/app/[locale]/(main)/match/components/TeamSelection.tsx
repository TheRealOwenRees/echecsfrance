"use client";

import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa";
import Select from "react-select";

import { clubPlayersAtom } from "@/atoms";
import { fetchClubPlayers } from "@/server/fetchClubPlayers";

interface IProps {
  name: string;
  label: string;
  className?: string;
  clubOptions: {
    value: string;
    label: string;
    url: string | undefined;
  }[];
}

const TeamSelection = ({ name, label, clubOptions, className }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control } = useFormContext();
  const [teamsPlayers, setTeamsPlayers] = useAtom(clubPlayersAtom);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}_players`, // e.g., "team1_players"
  });

  const selectedDbId = useWatch({
    control,
    name: name,
  });

  const selectedOption = clubOptions.find((c) => c.value === selectedDbId);
  const selectedId = selectedOption?.url?.split("=").pop();

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!selectedId) return;

      setIsLoading(true);

      try {
        const response = await fetchClubPlayers({ clubId: selectedId });
        const data = response?.data;

        if (data) {
          setTeamsPlayers((prev) => ({
            ...prev,
            [name]: data,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedId, name, setTeamsPlayers]);

  const playerOptions =
    teamsPlayers[name]?.map((player) => ({
      value: {
        nrFFE: player.nrFFE,
        name: player.name,
        elo: player.elo,
      },
      label: `${player.name} (${player.elo})`,
    })) || [];

  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>

      {/* Team/Club Select */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            instanceId={`${name}-select`}
            options={clubOptions}
            isSearchable
            placeholder="Select a club..."
            onChange={(option) => {
              field.onChange(option?.value);
              // Optional: Clear players if club changes, e.g. remove(0, fields.length)
            }}
            value={clubOptions.find((c) => c.value === field.value)}
            classNames={{
              control: () => "border-gray-300 rounded-md shadow-sm",
            }}
          />
        )}
      />

      {/* Dynamic Player List */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <Controller
                name={`${name}_players.${index}.playerId`} // Saves as { playerId: "nrFFE_123" }
                control={control}
                render={({ field: selectField }) => (
                  <Select
                    {...selectField}
                    instanceId={`${name}-player-${index}`}
                    options={playerOptions}
                    isSearchable
                    placeholder="Search player..."
                    onChange={(option) => selectField.onChange(option?.value)}
                    // Compare values using strict equality since value is now a string (nrFFE)
                    value={playerOptions.find(
                      (op) => op.value === selectField.value,
                    )}
                    classNames={{
                      control: () => "border-gray-300 rounded-md shadow-sm",
                    }}
                  />
                )}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-500 hover:text-red-700"
              title="Remove player"
            >
              <FaMinus />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading players...</p>
      ) : (
        teamsPlayers[name]?.length > 0 && (
          <button
            type="button" // Important to prevent form submission
            onClick={() => append({ playerId: "" })} // Add new empty row to field array
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FaPlus />
            Add Player
          </button>
        )
      )}
    </div>
  );
};

export default TeamSelection;
