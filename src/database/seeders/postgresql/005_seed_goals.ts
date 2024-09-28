import { Seeder } from 'sequelize-typescript';
import { QueryInterface, Sequelize, DataTypes } from 'sequelize';
import { Goal } from '../../../models/postgresql/goal.model';
import { User } from '../../../models/postgresql/user.model';

export default class GoalSeeder implements Seeder {
  public async up(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    // Fetch existing users from the database
    const users = await User.findAll();

    if (users.length === 0) {
      console.warn('No users found in the database. Make sure to run the user seeder first.');
      return;
    }

    // Define an array of sample goals
    const sampleGoals = [
      {
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 2500,
        targetDate: new Date('2023-12-31'),
      },
      {
        name: 'Down Payment for House',
        targetAmount: 50000,
        currentAmount: 15000,
        targetDate: new Date('2025-06-30'),
      },
      {
        name: 'Vacation to Europe',
        targetAmount: 5000,
        currentAmount: 1000,
        targetDate: new Date('2024-07-01'),
      },
      {
        name: 'New Car',
        targetAmount: 25000,
        currentAmount: 5000,
        targetDate: new Date('2024-12-31'),
      },
      {
        name: 'Retirement Savings',
        targetAmount: 1000000,
        currentAmount: 100000,
        targetDate: new Date('2050-01-01'),
      },
    ];

    // Insert the sample goals into the database, associating them with random users
    const goals = sampleGoals.map(goal => ({
      ...goal,
      userId: users[Math.floor(Math.random() * users.length)].id,
    }));

    await Goal.bulkCreate(goals);

    console.log(`${goals.length} sample goals have been seeded.`);
  }

  public async down(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    // Remove all records from the goals table
    await Goal.destroy({ where: {}, truncate: true });

    console.log('All seeded goals have been removed.');
  }
}

// Human tasks:
// 1. Review and adjust sample goal data to ensure it aligns with the application's requirements and use cases
// 2. Ensure that the user IDs used in the seeder correspond to actual seeded users