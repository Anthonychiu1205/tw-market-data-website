import { Resend } from "resend";

import { siteConfig } from "@/src/config/site";

// §A3 — when a destination exhausts its retry budget the worker disables it and tells the account
// owner, so a silently-dead webhook does not go unnoticed. Injectable so the worker can be tested
// without sending real mail; the default uses the same Resend config as auth email.

export type DestinationDisabledEmail = (input: {
  to: string;
  destinationUrl: string;
  reason: string;
}) => Promise<{ ok: boolean }>;

function emailDeliveryConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim(),
    from: process.env.EMAIL_FROM?.trim(),
  };
}

export const sendDestinationDisabledEmail: DestinationDisabledEmail = async ({ to, destinationUrl, reason }) => {
  const config = emailDeliveryConfig();
  if (!config.apiKey || !config.from || !to) {
    // No mail configured (or no owner email) — never throw; the disable itself already happened.
    return { ok: false };
  }

  const resend = new Resend(config.apiKey);
  const manageUrl = `${siteConfig.url}/dashboard/webhooks`;

  try {
    await resend.emails.send({
      from: config.from,
      to,
      subject: "你的 Webhook 端點已自動停用",
      text: [
        "我們連續嘗試投遞事件到你的 Webhook 端點但都失敗,已將它自動停用以避免持續重試。",
        "",
        `端點:${destinationUrl}`,
        `原因:${reason}`,
        "",
        "請確認端點可正常接收後,到後台重新啟用:",
        manageUrl,
        "",
        "TW Market Data",
      ].join("\n"),
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
