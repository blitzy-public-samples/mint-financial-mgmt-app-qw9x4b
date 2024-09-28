import crypto from 'crypto';

// Environment variables should be properly set and accessed securely
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a given string using AES-256-CBC encryption
 * @param text The string to be encrypted
 * @returns Encrypted text as a base64 encoded string
 */
export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key is not set');
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create a cipher using the ALGORITHM, ENCRYPTION_KEY, and IV
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

  // Encrypt the input text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Concatenate the IV and encrypted text and return as base64
  return Buffer.concat([iv, encrypted]).toString('base64');
}

/**
 * Decrypts a given encrypted string using AES-256-CBC decryption
 * @param encryptedText The encrypted string to be decrypted
 * @returns Decrypted text
 */
export function decrypt(encryptedText: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key is not set');
  }

  // Decode the base64 encoded input
  const buffer = Buffer.from(encryptedText, 'base64');

  // Extract the IV from the first 16 bytes
  const iv = buffer.slice(0, IV_LENGTH);

  // Extract the encrypted text from the remaining bytes
  const encrypted = buffer.slice(IV_LENGTH);

  // Create a decipher using the ALGORITHM, ENCRYPTION_KEY, and IV
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

  // Decrypt the encrypted text
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Return the decrypted text
  return decrypted.toString();
}

/**
 * Hashes a password using a secure one-way hashing algorithm
 * @param password The password to be hashed
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Use crypto.pbkdf2Sync to hash the password with the salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Return the salt and hashed password as a combined string
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored hash
 * @param password The password to verify
 * @param storedHash The stored hash to compare against
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  // Extract the salt from the stored hash
  const [salt, hash] = storedHash.split(':');

  // Hash the input password using the extracted salt
  const inputHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Compare the resulting hash with the stored hash
  return inputHash === hash;
}

// List of human tasks (commented)
/*
Human tasks:
1. Ensure ENCRYPTION_KEY is securely stored and not hardcoded (Critical)
2. Implement key rotation mechanism for ENCRYPTION_KEY (Required)
3. Add unit tests for encryption and decryption functions (Required)
4. Review and validate the encryption implementation with a security expert (Required)
*/