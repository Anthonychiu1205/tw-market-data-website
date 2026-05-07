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

export const PASSWORD_RULE = {
  minLength: PASSWORD_MIN_LENGTH,
  maxLength: PASSWORD_MAX_LENGTH,
};
