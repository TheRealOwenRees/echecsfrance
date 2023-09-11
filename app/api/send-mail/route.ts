import { NextResponse } from "next/server";
import NodeMailer from "nodemailer";

import { errorLog, infoLog } from "@/utils/logger";

export async function POST(req: Request) {
  const { email, subject, message } = await req.json();

  try {
    const mailContent = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: `${subject} from ${email}`,
      text: message,
      html: `<p>${message}</p>`,
    };

    const transporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailInfo = await transporter.sendMail(mailContent);
    infoLog(mailInfo);

    return NextResponse.json(
      { success: `Message delivered to ${mailInfo.accepted}` },
      { status: 250 },
    );
  } catch (error) {
    errorLog(error);
    return NextResponse.json({ error: `Connection refused` }, { status: 404 });
  }
}
