import { Transaction } from '../../../models/postgresql/transaction.model';
import { Account } from '../../../models/postgresql/account.model';
import { sequelize } from '../../../config/postgresql.config';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize';

// Constants
const NUM_TRANSACTIONS_TO_SEED = 1000;
const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Housing',
  'Transportation',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Personal',
  'Education',
  'Travel'
];

// Helper function to generate a single transaction data object
const generateTransactionData = (accountIds: string[]): any => {
  const randomAccountId = accountIds[Math.floor(Math.random() * accountIds.length)];
  const amount = parseFloat(faker.finance.amount(1, 1000, 2));
  const date = faker.date.past(1); // Transaction within the last year
  const description = faker.finance.transactionDescription();
  const category = TRANSACTION_CATEGORIES[Math.floor(Math.random() * TRANSACTION_CATEGORIES.length)];

  return {
    accountId: randomAccountId,
    amount,
    date,
    description,
    category
  };
};

// Main function to seed the transactions table with sample data
export const seedTransactions = async (): Promise<void> => {
  try {
    // Connect to the PostgreSQL database using Sequelize
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Fetch all existing account IDs from the accounts table
    const accounts = await Account.findAll({ attributes: ['id'] });
    const accountIds = accounts.map(account => account.id);

    if (accountIds.length === 0) {
      console.log('No accounts found. Please seed accounts first.');
      return;
    }

    // Generate an array of sample transaction data using faker
    const transactionData = Array.from({ length: NUM_TRANSACTIONS_TO_SEED }, () =>
      generateTransactionData(accountIds)
    );

    // Insert the generated transaction data into the transactions table
    await Transaction.bulkCreate(transactionData);

    console.log(`${NUM_TRANSACTIONS_TO_SEED} transactions seeded successfully.`);
  } catch (error) {
    console.error('Error seeding transactions:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Execute the seeder if this script is run directly
if (require.main === module) {
  seedTransactions().then(() => {
    console.log('Transaction seeding completed.');
    process.exit(0);
  });
}
```

This code implements the transaction seeder as specified in the JSON representation. Here are some notes about the implementation:

1. We've imported the necessary dependencies, including the Transaction and Account models, sequelize configuration, and external libraries.

2. The constants `NUM_TRANSACTIONS_TO_SEED` and `TRANSACTION_CATEGORIES` are defined as specified.

3. The `generateTransactionData` helper function creates a single transaction data object with random values using faker.

4. The main `seedTransactions` function connects to the database, fetches existing account IDs, generates transaction data, and inserts it into the database.

5. Error handling and logging are implemented throughout the script.

6. The script can be run directly to execute the seeder.

Please note that this implementation assumes that the Transaction and Account models, as well as the sequelize configuration, are correctly set up in the specified file paths. You may need to adjust the imports if the actual file structure differs.

Human Tasks:
```
# Human Tasks

- Review and adjust the number of transactions to seed (NUM_TRANSACTIONS_TO_SEED) based on specific testing or development needs
- Verify that the TRANSACTION_CATEGORIES array matches the categories defined in the application's business logic
- Ensure that the date range for generated transactions aligns with the project's requirements (currently set to last year)