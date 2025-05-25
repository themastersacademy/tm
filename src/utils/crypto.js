"server only";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Compares a plain text password with a stored hash.
 * The stored hash is expected to be generated using bcrypt.
 *
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} - True if the password matches, otherwise false.
 */
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(password) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
  return bcrypt.hash(password, saltRounds);
}

/**
 * Generates a random OTP (One-Time Password).
 * The OTP is a 4-digit number.
 *
 * @returns {string} - The generated OTP.
 */
export function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Generates a token with has payload.
 *
 * @param {string} payload - The payload to be encoded in the token.
 * @returns {string} - The generated token.
 */
export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
}

/**
 * Verifies a token and returns the payload.
 *
 * @param {string} token - The token to be verified.
 * @returns {string} - The payload of the token.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { email: null, id: null };
  }
}
