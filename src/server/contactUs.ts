"use server";

import { z } from "zod";

import { contactUsSchema } from "@/schemas";
import { errorLog } from "@/utils/logger";

import { actionClient } from "./safeAction";

export const contactUs = actionClient
  .schema(contactUsSchema)
  .action(async (input) => {
    try {
      const { email, subject, message } = input.parsedInput;
      await fetch(process.env.DISCORD_WEBHOOK_CONTACT_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "Contact",
              fields: [
                { name: "Email", value: email },
                { name: "Subject", value: subject },
                { name: "Message", value: message },
              ],
            },
          ],
        }),
      });
      return true;
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
