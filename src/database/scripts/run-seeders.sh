#!/bin/bash

# Source the environment variables
source .env

# Function to run PostgreSQL seeders
run_postgresql_seeders() {
  echo "Running PostgreSQL seeders..."
  npx ts-node ../seeders/postgresql/001_seed_users.ts
  npx ts-node ../seeders/postgresql/002_seed_accounts.ts
  npx ts-node ../seeders/postgresql/003_seed_transactions.ts
  npx ts-node ../seeders/postgresql/004_seed_budgets.ts
  npx ts-node ../seeders/postgresql/005_seed_goals.ts
  echo "PostgreSQL seeding completed."
}

# Function to run MongoDB seeders
run_mongodb_seeders() {
  echo "Running MongoDB seeders..."
  node ../seeders/mongodb/001_seed_user_preferences.js
  node ../seeders/mongodb/002_seed_financial_insights.js
  node ../seeders/mongodb/003_seed_investment_portfolios.js
  node ../seeders/mongodb/004_seed_credit_scores.js
  echo "MongoDB seeding completed."
}

# Main execution
echo "Starting database seeding process..."

# Run PostgreSQL seeders
if [ "$RUN_POSTGRESQL_SEEDERS" = "true" ]; then
  run_postgresql_seeders
else
  echo "Skipping PostgreSQL seeders."
fi

# Run MongoDB seeders
if [ "$RUN_MONGODB_SEEDERS" = "true" ]; then
  run_mongodb_seeders
else
  echo "Skipping MongoDB seeders."
fi

echo "Database seeding process completed."

# Human tasks:
# TODO: Ensure that all seeder files are implemented and placed in the correct directories
# TODO: Verify that the environment variables RUN_POSTGRESQL_SEEDERS and RUN_MONGODB_SEEDERS are properly set in the .env file
# TODO: Implement error handling and logging for each seeder execution
# TODO: Consider adding a command-line argument to selectively run specific seeders
# TODO: Ensure that the script has the necessary permissions to execute (chmod +x)
```

This shell script is designed to run all the seeder scripts for both PostgreSQL and MongoDB databases in the Mint Replica application. It ensures that the development and testing environments have consistent initial data. The script follows the structure and requirements specified in the JSON representation.

Key features of the script:

1. It sources environment variables from a .env file.
2. It defines separate functions for running PostgreSQL and MongoDB seeders.
3. It uses conditional statements to determine whether to run PostgreSQL and/or MongoDB seeders based on environment variables.
4. It includes echo statements to provide feedback on the seeding process.
5. It lists human tasks as comments at the end of the file, as specified in the JSON representation.

The script uses `npx ts-node` to run TypeScript seeders for PostgreSQL and `node` to run JavaScript seeders for MongoDB, as specified in the JSON representation.

To make this script executable, you should run the following command:
```
chmod +x src/database/scripts/run-seeders.sh