import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Encrypts a given plaintext using AES-256 encryption
 * @param plaintext - The text to be encrypted
 * @param secretKey - The secret key used for encryption
 * @returns Encrypted text in base64 format
 */
export function encrypt(plaintext: string, secretKey: string): string {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a cipher using AES-256-CBC algorithm
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Combine IV and encrypted data
  const result = iv.toString('base64') + ':' + encrypted;

  // Return the result as a base64 encoded string
  return Buffer.from(result).toString('base64');
}

/**
 * Decrypts a given ciphertext that was encrypted using the encrypt function
 * @param ciphertext - The text to be decrypted (in base64 format)
 * @param secretKey - The secret key used for decryption
 * @returns Decrypted plaintext
 */
export function decrypt(ciphertext: string, secretKey: string): string {
  // Decode the base64 ciphertext
  const parts = Buffer.from(ciphertext, 'base64').toString().split(':');

  // Extract the IV from the decoded data
  const iv = Buffer.from(parts.shift()!, 'base64');
  const encryptedText = parts.join(':');

  // Create a decipher using AES-256-CBC algorithm
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  // Decrypt the ciphertext
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  // Return the decrypted plaintext
  return decrypted;
}

/**
 * Hashes a password using bcrypt
 * @param password - The password to be hashed
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt using bcrypt
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Return the hashed password
  return hashedPassword;
}

/**
 * Compares a plaintext password with a hashed password
 * @param plainTextPassword - The plaintext password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  // Use bcrypt to compare the plaintext password with the hashed password
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

  // Return the result of the comparison
  return isMatch;
}

// Human tasks:
// TODO: Ensure that the secret key used for encryption is securely stored and not hardcoded
// TODO: Implement key rotation mechanism for the encryption secret key
// TODO: Review and test the encryption and decryption functions to ensure they meet security standards