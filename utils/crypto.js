import crypto from "crypto";
import { CRYPTO_SECRET } from "../config/env.js";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = Buffer.from(CRYPTO_SECRET, "hex");
const IV_LENGTH = 16;
if (SECRET_KEY.length !== 32) {
  throw new Error("CRYPTO_SECRET must be a 32-byte hex string (64 hex chars)");
}

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
