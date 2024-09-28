const mongoose = require('mongoose');
const InvestmentPortfolio = require('../../models/mongodb/investmentPortfolio.model');

async function seedInvestmentPortfolios() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB database');

    // Define an array of sample investment portfolio data
    const sampleInvestmentPortfolios = [
      {
        userId: mongoose.Types.ObjectId(),
        portfolioName: 'Aggressive Growth',
        totalValue: 100000,
        lastUpdated: new Date(),
        assets: [
          { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, currentPrice: 150.25, value: 7512.50 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 10, currentPrice: 2750.00, value: 27500.00 },
          { symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 5, currentPrice: 3500.00, value: 17500.00 },
        ],
        cashBalance: 47487.50,
      },
      {
        userId: mongoose.Types.ObjectId(),
        portfolioName: 'Conservative Income',
        totalValue: 200000,
        lastUpdated: new Date(),
        assets: [
          { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', quantity: 500, currentPrice: 105.50, value: 52750.00 },
          { symbol: 'MUB', name: 'iShares National Muni Bond ETF', quantity: 400, currentPrice: 115.75, value: 46300.00 },
          { symbol: 'PFF', name: 'iShares Preferred & Income Securities ETF', quantity: 1000, currentPrice: 38.25, value: 38250.00 },
        ],
        cashBalance: 62700.00,
      },
    ];

    // Use the InvestmentPortfolio model to insert the sample data
    const result = await InvestmentPortfolio.insertMany(sampleInvestmentPortfolios);

    console.log(`${result.length} investment portfolios have been seeded successfully`);
  } catch (error) {
    console.error('Error seeding investment portfolios:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Execute the seeding function
seedInvestmentPortfolios();

module.exports = seedInvestmentPortfolios;