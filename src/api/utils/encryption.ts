import { encrypt, decrypt, generateEncryptionKey } from '../../shared/utils/encryption';
import crypto from 'crypto';

// TODO: Implement secure storage and retrieval of the API-specific encryption key
const getApiEncryptionKey = (): string => {
    // This is a placeholder. In a production environment, this should be securely stored and retrieved.
    return process.env.API_ENCRYPTION_KEY || 'default-api-key';
};

/**
 * Encrypts sensitive data using the shared encryption utility and API-specific encryption key
 * @param data The data to be encrypted
 * @returns Encrypted data as a base64 encoded string
 */
export const encryptSensitiveData = (data: string): string => {
    const apiKey = getApiEncryptionKey();
    return encrypt(data, apiKey);
};

/**
 * Decrypts sensitive data using the shared decryption utility and API-specific encryption key
 * @param encryptedData The encrypted data to be decrypted
 * @returns Decrypted data as a UTF-8 string
 */
export const decryptSensitiveData = (encryptedData: string): string => {
    const apiKey = getApiEncryptionKey();
    return decrypt(encryptedData, apiKey);
};

/**
 * Hashes a password using a secure hashing algorithm
 * @param password The password to be hashed
 * @returns Hashed password
 */
export const hashPassword = (password: string): string => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
};

/**
 * Verifies a password against its hashed version
 * @param password The password to be verified
 * @param hashedPassword The hashed password to compare against
 * @returns True if the password matches, false otherwise
 */
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
};

// List of human tasks
/**
 * TODO: Human tasks
 * 1. Implement secure storage and retrieval of the API-specific encryption key (Critical)
 * 2. Review and approve the password hashing method to ensure it meets current security standards (Critical)
 * 3. Create unit tests for all functions in this file (Required)
 * 4. Implement error handling for cases where decryption or password verification fails (Required)
 */