import NodeMailer from "nodemailer";

import { contactUsSchema } from "@/schemas";
import { errorLog, infoLog } from "@/utils/logger";

import { publicProcedure } from "../trpc";

export const contactUs = publicProcedure
  .input(contactUsSchema)
  .mutation(async ({ input }) => {
    try {
      const { email, subject, message } = input;

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

      return true;
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
