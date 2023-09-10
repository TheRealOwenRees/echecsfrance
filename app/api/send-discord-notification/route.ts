import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  const { embeds } = await req.json();

  if (!webhookURL) {
    return NextResponse.json(
      { error: `Discord webhook URL not found` },
      { status: 404 },
    );
  }

  try {
    const webhookBody = {
      embeds: embeds,
    };

    const webhookInfo = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookBody),
    });

    return NextResponse.json(
      { success: `Message delivered to ${webhookInfo}` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: `Connection refused` }, { status: 404 });
  }
}
