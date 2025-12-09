"use server";

import { addClubSchema } from "@/schemas";
import { collections, dbConnect } from "@/server/mongodb";
import { actionClient } from "@/server/safeAction";
import { errorLog } from "@/utils/logger";

export const addClub = actionClient
  .schema(addClubSchema)
  .action(async (input) => {
    try {
      const { name, email, message, club } = input.parsedInput;

      const clubData = {
        name: club.name ?? "",
        address: club.address ?? "",
        email: club.email ?? "",
        website: club.website ?? "",
        coordinates: club.coordinates as [number, number],
        manual_entry: true,
        pending: true,
      };

      await dbConnect();

      const result = await collections.clubs!.insertOne(clubData);

      if (result.insertedId) {
        await fetch(process.env.DISCORD_WEBHOOK_ADD_CLUB_URL as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "Club Submitted",
                fields: [
                  { name: "Name", value: club.name ?? "" },
                  { name: "Email", value: club.email ?? "" },
                  { name: "Address", value: club.address ?? "" },
                  { name: "Website", value: club.website ?? "" },
                  { name: "Sender", value: name ?? "" },
                  { name: "Sender Email", value: email ?? "" },
                  { name: "Message", value: message ?? "" },
                  { name: "ID", value: result.insertedId ?? "" },
                ],
              },
            ],
          }),
        });
      }
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
