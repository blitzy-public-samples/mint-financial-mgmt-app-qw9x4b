// This file serves as the main entry point for custom React hooks used across the Mint Replica application.
// It exports all available hooks for easy import in other parts of the application.

// Import hooks
import { useDebounce } from './use-debounce';
import { useLocalStorage } from './use-local-storage';

// Export hooks
export {
  useDebounce,
  useLocalStorage,
};

// TODO: Implement the following hooks:
// - useDebounce in src/shared/hooks/use-debounce.ts
// - useLocalStorage in src/shared/hooks/use-local-storage.ts

/**
 * @hook useDebounce
 * @description A custom hook for debouncing values or functions
 */

/**
 * @hook useLocalStorage
 * @description A custom hook for interacting with localStorage
 */