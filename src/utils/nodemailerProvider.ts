import { AuthError } from "next-auth";
import { EmailConfig } from "next-auth/providers/email";
import { getTranslations } from "next-intl/server";
import { createTransport } from "nodemailer";
import type { Transport, TransportOptions } from "nodemailer";
import * as JSONTransport from "nodemailer/lib/json-transport/index.js";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
import * as SESTransport from "nodemailer/lib/ses-transport/index.js";
import * as SMTPPool from "nodemailer/lib/smtp-pool/index.js";
import * as SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import * as StreamTransport from "nodemailer/lib/stream-transport/index.js";

type Awaitable<T> = T | PromiseLike<T>;

export function html(params: {
  url: string;
  host: string;
  t: Awaited<ReturnType<typeof getTranslations<"SignIn">>>;
}) {
  const { url, host, t } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#346df1";
  const buttonText = "#fff";

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  };

  return `
    <body style="background: ${color.background};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            ${t("email.subject", { host })}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                  <a href="${url}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                      ${t("email.button")}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            ${t("email.ignore")}
          </td>
        </tr>
      </table>
    </body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({
  url,
  host,
  t,
}: {
  url: string;
  host: string;
  t: Awaited<ReturnType<typeof getTranslations<"SignIn">>>;
}) {
  return t("email.textMessage", { host, url });
}

type AllTransportOptions =
  | string
  | SMTPTransport
  | SMTPTransport.Options
  | SMTPPool
  | SMTPPool.Options
  | SendmailTransport
  | SendmailTransport.Options
  | StreamTransport
  | StreamTransport.Options
  | JSONTransport
  | JSONTransport.Options
  | SESTransport
  | SESTransport.Options
  | Transport<any>
  | TransportOptions;

export interface NodemailerConfig extends EmailConfig {
  server?: AllTransportOptions;
  sendVerificationRequest: (params: {
    identifier: string;
    url: string;
    expires: Date;
    provider: NodemailerConfig;
    token: string;
    theme: any;
    request: Request;
  }) => Awaitable<void>;
  options: NodemailerUserConfig;
}

export type NodemailerUserConfig = Omit<
  Partial<NodemailerConfig>,
  "options" | "type"
>;

export default function Nodemailer(
  config: NodemailerUserConfig,
): NodemailerConfig {
  if (!config.server)
    throw new AuthError("Nodemailer requires a `server` configuration");

  return {
    id: "nodemailer",
    type: "email",
    name: "Nodemailer",
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "Echecs France <no-reply@echecsfrance.com>",
    maxAge: 24 * 60 * 60,

    async sendVerificationRequest(params) {
      const { identifier, url, provider } = params;

      let locale = "fr";
      const { searchParams } = new URL(url);
      if (searchParams.has("callbackUrl")) {
        const { pathname } = new URL(searchParams.get("callbackUrl")!);
        const maybeLocale = pathname.split("/")[1];
        if (["en", "fr"].includes(maybeLocale)) {
          locale = maybeLocale;
        }
      }

      const t = await getTranslations({ locale, namespace: "SignIn" });

      const { host } = new URL(url);
      const transport = createTransport(provider.server);
      const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: t("email.subject", { host }),
        text: text({ url, host, t }),
        html: html({ url, host, t }),
      });

      const failed = result.rejected.concat(result.pending).filter(Boolean);
      if (failed.length) {
        throw new Error(`Email (${failed.join(", ")}) could not be sent`);
      }
    },

    options: config,
  };
}
