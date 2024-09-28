import { Pool, QueryResult } from 'pg';

// Define the SQL queries as constants
const CREATE_BUDGETS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE INDEX idx_budgets_user_id ON budgets(user_id);
  CREATE INDEX idx_budgets_category_id ON budgets(category_id);
`;

const DROP_BUDGETS_TABLE_QUERY = `
  DROP TABLE IF EXISTS budgets;
`;

// Function to create the budgets table
export async function up(pool: Pool): Promise<void> {
  try {
    await pool.query(CREATE_BUDGETS_TABLE_QUERY);
    console.log('Budgets table created successfully');
  } catch (error) {
    console.error('Error creating budgets table:', error);
    throw error;
  }
}

// Function to drop the budgets table
export async function down(pool: Pool): Promise<void> {
  try {
    await pool.query(DROP_BUDGETS_TABLE_QUERY);
    console.log('Budgets table dropped successfully');
  } catch (error) {
    console.error('Error dropping budgets table:', error);
    throw error;
  }
}

// Commented list of human tasks
/*
Human tasks:
1. Review the table schema to ensure all required fields for budgets are included
2. Verify that appropriate indexes are created for optimal query performance
3. Ensure that foreign key constraints are properly set up if the budgets table references other tables
*/