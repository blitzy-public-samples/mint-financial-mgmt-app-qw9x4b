import { Knex } from 'knex';

// Constants for the SQL queries
const CREATE_GOALS_TABLE_QUERY = `
  CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    target_date DATE NOT NULL,
    category VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;

const DROP_GOALS_TABLE_QUERY = `DROP TABLE IF EXISTS goals`;

// Function to create the goals table
export async function up(knex: Knex): Promise<void> {
  try {
    // Create the goals table
    await knex.raw(CREATE_GOALS_TABLE_QUERY);

    // Add indexes for better query performance
    await knex.raw('CREATE INDEX idx_goals_user_id ON goals (user_id)');
    await knex.raw('CREATE INDEX idx_goals_target_date ON goals (target_date)');
    await knex.raw('CREATE INDEX idx_goals_status ON goals (status)');

    // Add a check constraint to ensure current_amount does not exceed target_amount
    await knex.raw('ALTER TABLE goals ADD CONSTRAINT check_current_amount CHECK (current_amount <= target_amount)');

    // Add a check constraint for valid status values
    await knex.raw(`ALTER TABLE goals ADD CONSTRAINT check_status CHECK (status IN ('active', 'completed', 'cancelled'))`);

    console.log('Goals table created successfully');
  } catch (error) {
    console.error('Error creating goals table:', error);
    throw error;
  }
}

// Function to drop the goals table
export async function down(knex: Knex): Promise<void> {
  try {
    await knex.raw(DROP_GOALS_TABLE_QUERY);
    console.log('Goals table dropped successfully');
  } catch (error) {
    console.error('Error dropping goals table:', error);
    throw error;
  }
}