import { z } from "zod";

import { PASSWORD_RULE } from "@/src/lib/auth/email-password";

const EMAIL_MAX_LENGTH = 254;

export const registerBodySchema = z
  .object({
    email: z.string().trim().email().max(EMAIL_MAX_LENGTH),
    password: z
      .string()
      .min(PASSWORD_RULE.minLength)
      .max(PASSWORD_RULE.maxLength),
  })
  .strict();

export const passwordLoginBodySchema = registerBodySchema;

export const verifyEmailBodySchema = z
  .object({
    email: z.string().trim().email().max(EMAIL_MAX_LENGTH),
    code: z.string().trim().regex(/^\d{6}$/),
  })
  .strict();

export const resendVerificationBodySchema = z
  .object({
    email: z.string().trim().email().max(EMAIL_MAX_LENGTH),
  })
  .strict();
