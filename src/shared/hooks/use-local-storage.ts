import { useState, useEffect } from 'react';

/**
 * A custom hook that provides a way to store and retrieve data from localStorage with a React-friendly interface.
 * 
 * @param key - The key under which the value will be stored in localStorage
 * @param initialValue - The initial value to use if no value is found in localStorage
 * @returns A tuple containing the current value and a function to update it
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Check if the code is running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Initialize state with the value from localStorage or the provided initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Define a function to update both the state and localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Use useEffect to update localStorage when the key changes
  useEffect(() => {
    if (isBrowser) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error updating localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, isBrowser]);

  return [storedValue, setValue];
}

export default useLocalStorage;