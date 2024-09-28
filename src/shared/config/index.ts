import dotenv from 'dotenv';
import { appConfig } from './app-config';

// Define the NODE_ENV global variable
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// Set NODE_ENV with a default value of 'development'
export const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Loads environment variables from a .env file
 */
export function loadEnv(): void {
  dotenv.config();
  console.log('Environment variables loaded');
}

/**
 * Returns the appropriate configuration based on the current environment
 * @returns Configuration object for the current environment
 */
export function getConfig() {
  switch (NODE_ENV) {
    case 'production':
      return appConfig.production;
    case 'test':
      return appConfig.test;
    case 'development':
    default:
      return appConfig.development;
  }
}

// Export all configuration-related constants and functions
export { appConfig };
```

This implementation includes the following:

1. Import statements for the required dependencies.
2. Declaration of the global NODE_ENV variable type.
3. Export of the NODE_ENV constant.
4. Implementation of the `loadEnv` function to load environment variables.
5. Implementation of the `getConfig` function to return the appropriate configuration based on the current environment.
6. Export of the `appConfig` object from the `./app-config` file.

Note that this implementation assumes that the `app-config.ts` file exports an object named `appConfig` with properties for different environments (development, production, and test). If the actual structure of `app-config.ts` is different, you may need to adjust this file accordingly.

Lastly, here's a list of human tasks that need to be addressed:

```
Human tasks:
- Review and update environment-specific configurations in app-config.ts
- Ensure all necessary environment variables are documented and included in .env.example