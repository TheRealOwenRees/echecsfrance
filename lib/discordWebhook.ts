import { TournamentFormProps } from "@/types";
import formatDate from "@/utils/formatDate";

const discordWebhook = async ({
  tournamentNameRef,
  countryRef,
  dateRef,
  timeControlRef,
  yourNameRef,
  yourEmailRef,
  messageRef,
}: TournamentFormProps) => {
  const webhookURL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK;

  if (!webhookURL) {
    throw new Error("Discord webhook URL is not defined");
  }

  const webhookBody = {
    embeds: [
      {
        title: "Tournament Submitted",
        fields: [
          { name: "Tournament", value: tournamentNameRef.current?.value },
          { name: "Country", value: countryRef.current?.value },
          { name: "Date", value: formatDate(dateRef.current?.value) },
          {
            name: "Time Control",
            value: timeControlRef.current?.value,
          },
          { name: "Sender", value: yourNameRef.current?.value },
          { name: "Sender Email", value: yourEmailRef.current?.value },
          { name: "Message", value: messageRef.current?.value },
        ],
      },
    ],
  };

  return await fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhookBody),
  });
};

export default discordWebhook;