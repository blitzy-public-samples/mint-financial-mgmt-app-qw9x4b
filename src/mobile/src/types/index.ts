// This file serves as the main entry point for all type definitions used in the mobile application.
// It re-exports types from various domain-specific type files to provide a centralized access point for type imports throughout the application.

// TODO: Create and define types in auth.types.ts
export * from './auth.types';

// TODO: Create and define types in account.types.ts
export * from './account.types';

// TODO: Create and define types in transaction.types.ts
export * from './transaction.types';

// TODO: Create and define types in budget.types.ts
export * from './budget.types';

// TODO: Create and define types in goal.types.ts
export * from './goal.types';

// TODO: Create and define types in investment.types.ts
export * from './investment.types';

// TODO: Create and define types in creditScore.types.ts
export * from './creditScore.types';

// TODO: Create and define types in navigation.types.ts
export * from './navigation.types';

// NOTE: Ensure that all the above mentioned files are created and populated with the necessary type definitions.
// Once the type definitions are added to their respective files, they will be automatically exported from this index file.

// Example of how a type might be defined in one of the files:
// auth.types.ts
// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// }

// When the above types are properly defined in their files, they can be imported elsewhere in the application like this:
// import { User } from '../types';