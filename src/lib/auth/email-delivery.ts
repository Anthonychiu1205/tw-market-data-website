import { Resend } from "resend";

import { siteConfig } from "@/src/config/site";
import { normalizeEmail } from "@/src/lib/auth/email-verification";

type SendVerificationCodeEmailInput = {
  email: string;
  code: string;
};

type SendVerificationCodeEmailResult =
  | { ok: true }
  | { ok: false; status: number; code: "email_service_not_configured" | "email_delivery_failed" };

type SendPasswordResetEmailInput = {
  email: string;
  token: string;
};

type SendPasswordResetEmailResult = SendVerificationCodeEmailResult;

function emailDeliveryConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  return {
    apiKey,
    from,
  };
}

export async function sendVerificationCodeEmail({
  email,
  code,
}: SendVerificationCodeEmailInput): Promise<SendVerificationCodeEmailResult> {
  const config = emailDeliveryConfig();

  if (!config.apiKey || !config.from) {
    return {
      ok: false,
      status: 503,
      code: "email_service_not_configured",
    };
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
      status: 503,
      code: "email_delivery_failed",
    };
  }
}

export async function sendPasswordResetEmail({
  email,
  token,
}: SendPasswordResetEmailInput): Promise<SendPasswordResetEmailResult> {
  const config = emailDeliveryConfig();

  if (!config.apiKey || !config.from) {
    return {
      ok: false,
      status: 503,
      code: "email_service_not_configured",
    };
  }

  const resend = new Resend(config.apiKey);
  const to = normalizeEmail(email);
  const resetUrl = `${siteConfig.url}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await resend.emails.send({
      from: config.from,
      to,
      subject: "Reset your TW Market Data password",
      html: [
        "<p>We received a request to reset your TW Market Data password.</p>",
        `<p><a href=\"${resetUrl}\" style=\"display:inline-block;padding:10px 14px;background:#0f172a;color:#ffffff;border-radius:8px;text-decoration:none;\">Reset password</a></p>`,
        "<p>如果你沒有要求重設密碼，可以忽略此信。</p>",
      ].join(""),
      text: [
        "We received a request to reset your TW Market Data password.",
        `Reset password: ${resetUrl}`,
        "",
        "如果你沒有要求重設密碼，可以忽略此信。",
      ].join("\n"),
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      code: "email_delivery_failed",
    };
  }
}
