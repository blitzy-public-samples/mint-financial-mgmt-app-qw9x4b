import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the users table
  await knex.schema.createTable('users', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    // User information
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.date('date_of_birth').notNullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('email');
    table.index('created_at');
  });

  // Enable UUID extension if not already enabled
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

export async function down(knex: Knex): Promise<void> {
  // Drop the users table
  await knex.schema.dropTableIfExists('users');
}

// Human tasks (commented)
/*
Human tasks:
1. Review and approve the users table schema
2. Ensure compliance with data protection regulations (e.g., GDPR) for storing user information
*/