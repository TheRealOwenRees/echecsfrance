"use client";

import { useEffect, useState } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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

import SortablePlayerRow from "./SortablePlayerRow";

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

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `${name}_players`, // e.g., "team1_players"
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

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

  const playerOptions = [
    {
      value: {
        nrFFE: "",
        name: "",
        elo: "",
      },
      label: "-- EMPTY PLAYER --",
    },
    ...(teamsPlayers[name]?.map((player) => ({
      value: {
        nrFFE: player.nrFFE,
        name: player.name,
        elo: player.elo,
      },
      label: `${player.name} (${player.elo})`,
    })) || []),
  ];

  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>

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
              remove();
            }}
            value={clubOptions.find((c) => c.value === field.value)}
            classNames={{
              control: () => "border-gray-300 rounded-md shadow-sm",
            }}
          />
        )}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over) return;
          if (active.id === over.id) return;

          const oldIndex = fields.findIndex((f) => f.id === active.id);
          const newIndex = fields.findIndex((f) => f.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return;
          move(oldIndex, newIndex);
        }}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {fields.map((field, index) => (
              <SortablePlayerRow
                key={field.id}
                field={field}
                index={index}
                renderField={(_field, i) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Controller
                        name={`${name}_players.${i}`}
                        control={control}
                        render={({ field: selectField }) => (
                          <Select
                            {...selectField}
                            instanceId={`${name}-player-${i}`}
                            options={playerOptions}
                            isSearchable
                            placeholder="Search for a player..."
                            onChange={(option) =>
                              selectField.onChange(option?.value)
                            }
                            value={playerOptions.find(
                              (op) => op.value === selectField.value,
                            )}
                            classNames={{
                              control: () =>
                                "border-gray-300 rounded-md shadow-sm",
                            }}
                          />
                        )}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Remove player"
                    >
                      <FaMinus />
                    </button>
                  </div>
                )}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading players...</p>
      ) : (
        teamsPlayers[name]?.length > 0 && (
          <button
            type="button"
            onClick={() => append({ nrFFE: "", name: "", elo: "" })}
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
