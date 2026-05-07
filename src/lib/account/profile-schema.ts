import { z } from "zod";

export const USER_ROLE_OPTIONS = [
  "developer",
  "quant_researcher",
  "data_team",
  "founder",
  "other",
] as const;

export const USE_CASE_OPTIONS = [
  "ai_agent",
  "quantitative_research",
  "internal_data_tool",
  "trading_workflow",
  "product_integration",
  "other",
] as const;

const userRoleEnum = z.enum(USER_ROLE_OPTIONS);
const useCaseEnum = z.enum(USE_CASE_OPTIONS);

function normalizeNullableText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.slice(0, maxLength);
}

function normalizeNullableEnum(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export const accountProfilePatchSchema = z
  .object({
    displayName: z.preprocess((value) => normalizeNullableText(value, 80), z.string().max(80).nullable()).optional(),
    companyName: z.preprocess((value) => normalizeNullableText(value, 120), z.string().max(120).nullable()).optional(),
    userRole: z.preprocess((value) => normalizeNullableEnum(value), userRoleEnum.nullable()).optional(),
    useCase: z.preprocess((value) => normalizeNullableEnum(value), useCaseEnum.nullable()).optional(),
  })
  .strict();

export type AccountProfilePatchInput = z.infer<typeof accountProfilePatchSchema>;

export type AccountProfileResponse = {
  email: string;
  displayName: string | null;
  companyName: string | null;
  userRole: (typeof USER_ROLE_OPTIONS)[number] | null;
  useCase: (typeof USE_CASE_OPTIONS)[number] | null;
  onboardingCompleted: boolean;
};
