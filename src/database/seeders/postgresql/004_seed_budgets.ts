import { Seeder } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';
import { Budget } from '../../models/postgresql/budget.model';
import { User } from '../../models/postgresql/user.model';
import { Category } from '../../models/postgresql/category.model';

const NUM_SAMPLE_BUDGETS = 100;
const BUDGET_PERIODS = ['monthly', 'yearly', 'weekly'];

export class BudgetSeeder implements Seeder {
  public async run(): Promise<void> {
    // Fetch all users from the database
    const users = await User.findAll();
    
    // Fetch all categories from the database
    const categories = await Category.findAll();

    // Generate an array of sample budget objects
    const sampleBudgets = Array.from({ length: NUM_SAMPLE_BUDGETS }, () => ({
      userId: faker.helpers.arrayElement(users).id,
      categoryId: faker.helpers.arrayElement(categories).id,
      amount: faker.finance.amount(100, 10000, 2),
      period: faker.helpers.arrayElement(BUDGET_PERIODS),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
    }));

    // Insert the sample budget objects into the budgets table
    await Budget.bulkCreate(sampleBudgets);

    console.log(`${NUM_SAMPLE_BUDGETS} sample budgets have been seeded.`);
  }
}

export default BudgetSeeder;

// Human tasks:
// TODO: Review and adjust the number of sample budgets and budget periods as needed
// TODO: Ensure that the User and Category models are properly set up and seeded before running this seeder