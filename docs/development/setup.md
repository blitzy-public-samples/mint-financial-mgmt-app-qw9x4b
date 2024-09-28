# Mint Replica Development Setup Guide

## Introduction

This document provides step-by-step instructions for setting up the development environment for the Mint Replica project. It covers all components of the application, including backend, frontend, mobile, and databases.

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

- Git
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)
- PostgreSQL
- MongoDB
- Redis
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## Repository Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/mint-replica.git
   ```
2. Navigate to the project root:
   ```
   cd mint-replica
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd src/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy .env.example to .env:
   ```
   cp .env.example .env
   ```
4. Update .env with your local configuration
5. Run database migrations:
   ```
   npm run migrate
   ```
6. Seed the database:
   ```
   npm run seed
   ```
7. Start the development server:
   ```
   npm run dev
   ```

For more detailed information on backend setup and available scripts, refer to `src/backend/README.md`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd src/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy .env.example to .env:
   ```
   cp .env.example .env
   ```
4. Update .env with your local configuration
5. Start the development server:
   ```
   npm start
   ```

For more information on frontend development and available scripts, refer to `src/frontend/README.md`.

## Mobile Setup

1. Navigate to the mobile directory:
   ```
   cd src/mobile
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. For iOS:
   - Navigate to the iOS directory:
     ```
     cd ios
     ```
   - Install CocoaPods dependencies:
     ```
     pod install
     ```
   - Return to the mobile directory:
     ```
     cd ..
     ```
4. For Android:
   - Ensure you have set up Android Studio and necessary SDKs
5. To run on iOS simulator:
   ```
   npx react-native run-ios
   ```
6. To run on Android emulator:
   ```
   npx react-native run-android
   ```

For more detailed instructions on mobile app setup and development, refer to `src/mobile/README.md`.

## Database Setup

### PostgreSQL

1. Install PostgreSQL on your local machine
2. Create a new database for the project
3. Update the PostgreSQL connection details in the backend .env file

### MongoDB

1. Install MongoDB on your local machine
2. Create a new database for the project
3. Update the MongoDB connection details in the backend .env file

### Redis

1. Install Redis on your local machine
2. Update the Redis connection details in the backend .env file

## External Services Setup

### Plaid

1. Sign up for a Plaid account and obtain API keys
2. Add Plaid API keys to the backend .env file

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Write code and tests
3. Run linters and formatters
4. Commit changes with descriptive commit messages
5. Push changes and create a pull request
6. Undergo code review
7. Merge changes after approval

## Testing

- Run backend tests:
  ```
  cd src/backend && npm test
  ```
- Run frontend tests:
  ```
  cd src/frontend && npm test
  ```
- Run mobile tests:
  ```
  cd src/mobile && npm test
  ```

## Troubleshooting

Common issues and their solutions:

1. Database connection errors
   - Ensure all required services (PostgreSQL, MongoDB, Redis) are running
2. Node.js version conflicts
   - Use nvm to manage Node.js versions
3. Mobile build issues
   - Refer to the mobile README for platform-specific troubleshooting

For more detailed troubleshooting steps, consult the respective README files for each component.

## Additional Resources

- [Coding Standards](./coding_standards.md)
- [Git Workflow](./git_workflow.md)
- [Backend README](../src/backend/README.md)
- [Frontend README](../src/frontend/README.md)
- [Mobile README](../src/mobile/README.md)