import { compare, hash } from "bcryptjs";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const BCRYPT_ROUNDS = 12;

export function isPasswordLengthValid(password: string) {
  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}

export async function hashPassword(password: string) {
  return await hash(password, BCRYPT_ROUNDS);
}

export async function verifyPasswordHash(password: string, passwordHash: string) {
  return await compare(password, passwordHash);
}

// A structurally valid bcrypt hash that no real password matches. Used to equalize
// login timing: when a user has no password (or does not exist), we still run one
// bcrypt compare against this constant so the response time does not reveal account
// existence. Generated with bcryptjs (rounds=12); it is not a real credential.
export const INVALID_PLACEHOLDER_HASH =
  "$2b$12$dI8K9GZ1csoSa7K6zI83QeVo8kYxPluMiYdEUX/ec6izWIC/lnMcG";

export const PASSWORD_RULE = {
  minLength: PASSWORD_MIN_LENGTH,
  maxLength: PASSWORD_MAX_LENGTH,
};
