import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { User } from '../../models/postgresql/user.model';
import { connection } from '../../utils/connection';

// Number of seed users to create
const NUM_SEED_USERS = 50;

/**
 * Function to seed the users table with sample data
 */
export async function seedUsers(): Promise<void> {
  try {
    // Connect to the PostgreSQL database
    await connection.connect();

    console.log('Seeding users table...');

    // Generate an array of sample user data
    const users = Array.from({ length: NUM_SEED_USERS }, () => ({
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      date_of_birth: faker.date.past({ years: 60, refDate: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000) }),
    }));

    // Hash passwords and insert users into the database
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        ...user,
        password: hashedPassword,
      });
    }

    console.log(`Successfully seeded ${NUM_SEED_USERS} users.`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    // Close the database connection
    await connection.close();
  }
}

// Run the seeder if this script is executed directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// Human tasks:
// 1. Review and adjust the number of seed users (NUM_SEED_USERS) based on testing requirements
// 2. Ensure that the User model and database connection utility are implemented correctly