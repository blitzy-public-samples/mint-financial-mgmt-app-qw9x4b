import crypto from 'crypto';

// Global constants for encryption
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypts a given string using AES-256-CBC encryption
 * @param data - The string to be encrypted
 * @param encryptionKey - The key used for encryption
 * @returns Encrypted data as a base64 encoded string
 */
export function encrypt(data: string, encryptionKey: string): string {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create a cipher using the encryption algorithm, key, and IV
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(encryptionKey, 'base64'), iv);

  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Concatenate the IV and encrypted data
  const result = iv.toString('base64') + ':' + encrypted;

  // Return the result as a base64 encoded string
  return Buffer.from(result).toString('base64');
}

/**
 * Decrypts a given encrypted string using AES-256-CBC decryption
 * @param encryptedData - The encrypted string to be decrypted
 * @param encryptionKey - The key used for decryption
 * @returns Decrypted data as a UTF-8 string
 */
export function decrypt(encryptedData: string, encryptionKey: string): string {
  // Decode the base64 encoded encrypted data
  const parts = Buffer.from(encryptedData, 'base64').toString().split(':');

  // Extract the IV from the first 16 bytes
  const iv = Buffer.from(parts.shift() || '', 'base64');

  // Extract the actual encrypted data after the IV
  const encryptedText = Buffer.from(parts.join(':'), 'base64');

  // Create a decipher using the encryption algorithm, key, and IV
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(encryptionKey, 'base64'), iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Return the decrypted data as a UTF-8 string
  return decrypted.toString('utf8');
}

/**
 * Generates a secure random encryption key
 * @returns A base64 encoded 32-byte encryption key
 */
export function generateEncryptionKey(): string {
  // Generate 32 random bytes using crypto.randomBytes
  const key = crypto.randomBytes(32);

  // Encode the random bytes as a base64 string
  return key.toString('base64');
}

// List of human tasks (commented)
/*
Human tasks:
1. Review and approve the encryption methods to ensure they meet security standards
2. Implement secure key management practices for storing and retrieving encryption keys
3. Create unit tests for the encryption and decryption functions
*/