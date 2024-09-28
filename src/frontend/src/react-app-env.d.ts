/// <reference types="react-scripts" />

// Declare modules for file types that might be imported in the project
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: { [key: string]: any };
  export default content;
}

// Add any custom type definitions specific to the Mint Replica application
interface Window {
  // Add any global variables that might be used in the application
  // For example: analytics, third-party libraries, etc.
  plaid?: any;
  Stripe?: any;
}

// Define types for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_API_URL: string;
    REACT_APP_PLAID_PUBLIC_KEY: string;
    REACT_APP_STRIPE_PUBLIC_KEY: string;
  }
}

// Human tasks:
// - Review and update type definitions as new dependencies or assets are added to the project