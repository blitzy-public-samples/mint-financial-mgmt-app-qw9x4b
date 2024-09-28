// This file serves as the main entry point for exporting all types used in the backend of the Mint Replica application.
// It aggregates and re-exports types from various domain-specific type files to provide a centralized location for importing types throughout the backend codebase.

// Auth types
export * from './auth.types';

// User types
export * from './user.types';

// Account types
export * from './account.types';

// Transaction types
export * from './transaction.types';

// Budget types
export * from './budget.types';

// Goal types
export * from './goal.types';

// Investment types
export * from './investment.types';

// Credit Score types
export * from './creditScore.types';

// Common types
export * from './common.types';

// TODO: Implement the following tasks:
// 1. Create and implement the individual type files (auth.types.ts, user.types.ts, etc.) with their respective type definitions
// 2. Review and ensure all necessary types for the backend are included and properly exported
// 3. Update this index file if any new type files are added to the backend in the future