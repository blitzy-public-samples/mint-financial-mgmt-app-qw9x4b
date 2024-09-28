const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const CreditScore = require('../../models/mongodb/creditScore.model');

const NUM_SAMPLES = 100;

/**
 * Generates a single credit score object with fake data
 * @returns {Object} A credit score object with sample data
 */
function generateCreditScoreData() {
  return {
    userId: mongoose.Types.ObjectId(),
    score: faker.datatype.number({ min: 300, max: 850 }),
    lastUpdated: faker.date.past(),
    factors: [
      {
        name: 'Payment History',
        impact: faker.random.arrayElement(['High', 'Medium', 'Low']),
      },
      {
        name: 'Credit Utilization',
        impact: faker.random.arrayElement(['High', 'Medium', 'Low']),
      },
      {
        name: 'Length of Credit History',
        impact: faker.random.arrayElement(['High', 'Medium', 'Low']),
      },
    ],
  };
}

/**
 * Generates and inserts sample credit score data into the MongoDB database
 * @returns {Promise<void>} Resolves when seeding is complete
 */
async function seedCreditScores() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Delete existing records in the credit_scores collection
    await CreditScore.deleteMany({});
    console.log('Cleared existing credit scores');

    // Generate an array of sample credit score objects
    const creditScores = Array.from({ length: NUM_SAMPLES }, generateCreditScoreData);

    // Insert the sample credit score objects into the database
    const insertedCreditScores = await CreditScore.insertMany(creditScores);
    console.log(`Inserted ${insertedCreditScores.length} credit scores`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding credit scores:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCreditScores();

// Export the functions for testing purposes
module.exports = {
  generateCreditScoreData,
  seedCreditScores,
};