import NodeMailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, subject, message } = await req.json();

  try {
    const mailContent = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: subject,
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

    const info = await transporter.sendMail(mailContent);
    console.log(info);

    return NextResponse.json(
      { success: `Message delivered to ${info.accepted}` },
      { status: 250 }
    );
  } catch (error) {
    return NextResponse.json({ error: `Connection refused` }, { status: 404 });
  }
}
