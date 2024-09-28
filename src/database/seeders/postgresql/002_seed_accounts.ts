import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Account } from '../../models/postgresql/account.model';
import { User } from '../../models/postgresql/user.model';

export default class CreateAccounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Retrieve existing users from the database
    const users = await connection.getRepository(User).find();

    if (users.length === 0) {
      console.warn('No users found in the database. Please run the user seeder first.');
      return;
    }

    // Create an array of account data with various types and balances
    const accountData = [
      { type: 'Checking', balance: 5000 },
      { type: 'Savings', balance: 10000 },
      { type: 'Credit Card', balance: -1500 },
      { type: 'Investment', balance: 25000 },
      { type: 'Loan', balance: -50000 },
    ];

    // Iterate through the account data and create account records
    for (const data of accountData) {
      // Associate each account with a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await factory(Account)().create({
        type: data.type,
        balance: data.balance,
        user: randomUser,
      });
    }

    console.log('Accounts seeded successfully');
  }
}

// Human tasks:
// TODO: Review and adjust the seeded account data to match specific testing requirements
// TODO: Ensure that the seeded data complies with any data protection regulations