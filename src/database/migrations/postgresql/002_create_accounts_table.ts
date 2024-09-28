import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.string('institution_name').notNullable();
    table.string('account_type').notNullable();
    table.string('account_name').notNullable();
    table.decimal('balance', 15, 2).notNullable();
    table.string('currency', 3).notNullable();
    table.timestamp('last_synced').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    table.index('user_id');
    table.index('institution_name');
    table.index('account_type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('accounts');
}

// Human tasks:
// TODO: Review and approve the accounts table schema
// TODO: Ensure that the account_type values are properly defined and documented
// TODO: Verify that the balance precision (15, 2) is sufficient for all supported currencies