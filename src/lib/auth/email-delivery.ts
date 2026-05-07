import { Resend } from "resend";

import { normalizeEmail } from "@/src/lib/auth/email-verification";

type SendVerificationCodeEmailInput = {
  email: string;
  code: string;
};

type SendVerificationCodeEmailResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function emailDeliveryConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  return {
    apiKey,
    from,
    isProduction: process.env.NODE_ENV === "production",
  };
}

export async function sendVerificationCodeEmail({
  email,
  code,
}: SendVerificationCodeEmailInput): Promise<SendVerificationCodeEmailResult> {
  const config = emailDeliveryConfig();

  if (!config.apiKey || !config.from) {
    if (config.isProduction) {
      return {
        ok: false,
        status: 503,
        error: "email_delivery_unavailable",
      };
    }

    return { ok: true };
  }

  const resend = new Resend(config.apiKey);
  const to = normalizeEmail(email);

  try {
    await resend.emails.send({
      from: config.from,
      to,
      subject: "TW Market Data 驗證碼",
      text: [
        "請輸入以下 6 位數驗證碼完成註冊：",
        code,
        "",
        "驗證碼 10 分鐘內有效。",
        "若不是你本人操作，請忽略此信件。",
      ].join("\n"),
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 502,
      error: "email_delivery_failed",
    };
  }
}
