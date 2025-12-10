"use server";

import { matchSchema } from "@/schemas";
import { actionClient } from "@/server/safeAction";

export const generateFeuilleDeMatch = actionClient
  .schema(matchSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log("generateFeuilleDeMatch", parsedInput);

      // console.log("Generating PDF for:", parsedInput.competition);
      //
      // // 1. Render PDF to Node Stream
      // const stream = await renderToStream(FeuilleMatchPdf({ data: parsedInput }));
      //
      // // 2. Convert Stream to Buffer
      // const chunks: Buffer[] = [];
      // for await (const chunk of stream) {
      //   chunks.push(Buffer.from(chunk));
      // }
      // const pdfBuffer = Buffer.concat(chunks);
      //
      // // 3. Return Base64 String
      // return {
      //   pdfBase64: pdfBuffer.toString('base64'),
      //   filename: `match_${parsedInput.competition}_${parsedInput.ronde}.pdf`
      // };
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
