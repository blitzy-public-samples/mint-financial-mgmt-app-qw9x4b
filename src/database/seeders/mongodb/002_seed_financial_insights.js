const mongoose = require('mongoose');
const { mongodbConfig } = require('../../config/mongodb.config');

// Define the financial insight schema
const financialInsightSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  content: String,
  category: String,
  timestamp: Date,
  relevanceScore: Number
});

// Create a model for the financial insights collection
const FinancialInsight = mongoose.model('FinancialInsight', financialInsightSchema);

// Sample financial insights for seeding
const sampleFinancialInsights = [
  {
    userId: new mongoose.Types.ObjectId(),
    type: 'Spending Alert',
    content: 'Your dining out expenses are 20% higher than last month.',
    category: 'Budgeting',
    timestamp: new Date(),
    relevanceScore: 0.8
  },
  {
    userId: new mongoose.Types.ObjectId(),
    type: 'Savings Opportunity',
    content: 'You could save $50 per month by reducing your subscription services.',
    category: 'Savings',
    timestamp: new Date(),
    relevanceScore: 0.9
  },
  {
    userId: new mongoose.Types.ObjectId(),
    type: 'Investment Tip',
    content: 'Consider diversifying your portfolio with index funds for long-term growth.',
    category: 'Investing',
    timestamp: new Date(),
    relevanceScore: 0.7
  }
];

async function seedFinancialInsights() {
  try {
    // Connect to MongoDB using the mongodbConfig
    await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);
    console.log('Connected to MongoDB');

    // Clear existing data
    await FinancialInsight.deleteMany({});
    console.log('Cleared existing financial insights');

    // Insert sample financial insights
    const result = await FinancialInsight.insertMany(sampleFinancialInsights);
    console.log(`Inserted ${result.length} financial insights`);

    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding financial insights:', error);
    // Ensure the connection is closed even if an error occurs
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to error');
    }
  }
}

// Run the seeder
seedFinancialInsights();

// Export the function for potential use in a larger seeding script
module.exports = seedFinancialInsights;

// Human tasks (commented):
// TODO: Review and update sample financial insights with more realistic and diverse data
// TODO: Implement error handling and logging mechanism for the seeding process
// TODO: Create a script to run all MongoDB seeders in the correct order
```

This implementation creates a seeder script for populating the financial insights collection in MongoDB. Here's a breakdown of what the script does:

1. It imports the necessary dependencies, including Mongoose and the MongoDB configuration.
2. Defines the schema for financial insights based on the provided specification.
3. Creates a Mongoose model for the financial insights collection.
4. Defines an array of sample financial insights for seeding.
5. Implements the `seedFinancialInsights` function, which:
   - Connects to MongoDB using the configuration.
   - Clears existing data in the collection.
   - Inserts the sample financial insights.
   - Logs the number of inserted documents.
   - Handles errors during the seeding process.
   - Closes the MongoDB connection.
6. Runs the seeder function.
7. Exports the function for potential use in a larger seeding script.
8. Includes commented human tasks as specified in the JSON representation.

Note that this implementation makes some assumptions:
- The MongoDB configuration file exists and exports a `mongodbConfig` object with a `uri` and `options` properties.
- The exact structure of the MongoDB configuration is assumed, as we couldn't fetch its actual implementation.

To use this seeder, you would typically run it with Node.js:

```
node src/database/seeders/mongodb/002_seed_financial_insights.js