import * as SecureStore from 'expo-secure-store';

/**
 * Securely saves a key-value pair to the device's secure storage.
 * @param key The key under which to store the value.
 * @param value The value to be stored.
 * @returns A promise that resolves when the item is saved successfully.
 */
export async function saveSecureItem(key: string, value: string): Promise<void> {
  try {
    if (!key || !value) {
      throw new Error('Key and value must be provided');
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error saving secure item:', error);
    throw error;
  }
}

/**
 * Retrieves a value from the device's secure storage using the provided key.
 * @param key The key of the item to retrieve.
 * @returns A promise that resolves with the stored value or null if not found.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (!key) {
      throw new Error('Key must be provided');
    }
    const result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error) {
    console.error('Error retrieving secure item:', error);
    throw error;
  }
}

/**
 * Deletes a key-value pair from the device's secure storage.
 * @param key The key of the item to delete.
 * @returns A promise that resolves when the item is deleted successfully.
 */
export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (!key) {
      throw new Error('Key must be provided');
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error deleting secure item:', error);
    throw error;
  }
}

// Human tasks:
// TODO: Implement error handling and logging mechanism for SecureStore operations
// TODO: Determine and implement a key naming convention for stored items
// TODO: Decide on encryption options for SecureStore (if any additional encryption is needed)