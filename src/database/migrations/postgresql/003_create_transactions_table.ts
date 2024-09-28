import { QueryResult } from 'pg';
import { postgresqlConfig } from '../../config/postgresql.config';

const CREATE_TRANSACTIONS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    category_id UUID,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_pending BOOLEAN DEFAULT false,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE INDEX idx_transactions_account_id ON transactions(account_id);
  CREATE INDEX idx_transactions_category_id ON transactions(category_id);
  CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
`;

const DROP_TRANSACTIONS_TABLE_QUERY = `
  DROP TABLE IF EXISTS transactions;
`;

export async function up(): Promise<void> {
  try {
    const client = await postgresqlConfig.getClient();
    await client.query(CREATE_TRANSACTIONS_TABLE_QUERY);
    console.log('Transactions table created successfully');
    client.release();
  } catch (error) {
    console.error('Error creating transactions table:', error);
    throw error;
  }
}

export async function down(): Promise<void> {
  try {
    const client = await postgresqlConfig.getClient();
    await client.query(DROP_TRANSACTIONS_TABLE_QUERY);
    console.log('Transactions table dropped successfully');
    client.release();
  } catch (error) {
    console.error('Error dropping transactions table:', error);
    throw error;
  }
}

// Human tasks:
// 1. Review the table schema to ensure all required fields for transactions are included
// 2. Verify that appropriate indexes are created for optimal query performance
// 3. Ensure that foreign key constraints are properly set up (e.g., linking to accounts table)
// 4. Implement proper error handling and logging for migration failures