const mongoose = require('mongoose');
const UserPreference = require('../../models/mongodb/userPreference.model');

async function seedUserPreferences() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB database');

    // Delete all existing documents in the user_preferences collection
    await UserPreference.deleteMany({});
    console.log('Cleared existing user preferences');

    // Define an array of sample user preferences
    const sampleUserPreferences = [
      {
        userId: mongoose.Types.ObjectId(),
        theme: 'light',
        language: 'en',
        currency: 'USD',
        notificationPreferences: {
          email: true,
          push: true,
          sms: false,
        },
        dashboardLayout: ['netWorth', 'recentTransactions', 'budgetOverview'],
      },
      {
        userId: mongoose.Types.ObjectId(),
        theme: 'dark',
        language: 'es',
        currency: 'EUR',
        notificationPreferences: {
          email: true,
          push: false,
          sms: true,
        },
        dashboardLayout: ['budgetOverview', 'goals', 'investments'],
      },
      {
        userId: mongoose.Types.ObjectId(),
        theme: 'auto',
        language: 'fr',
        currency: 'CAD',
        notificationPreferences: {
          email: false,
          push: true,
          sms: false,
        },
        dashboardLayout: ['netWorth', 'investments', 'creditScore'],
      },
    ];

    // Insert the sample user preferences into the collection
    const result = await UserPreference.insertMany(sampleUserPreferences);
    console.log(`${result.length} user preferences have been inserted`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding user preferences:', error);
    process.exit(1);
  }
}

// Run the seeder function
seedUserPreferences();

// Export the function for potential use in other scripts
module.exports = seedUserPreferences;

// Human tasks:
// 1. Review and adjust the sample user preferences data to match the application's requirements
// 2. Ensure that the userPreference model is properly defined and imported