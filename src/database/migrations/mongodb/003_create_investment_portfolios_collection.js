const mongoose = require('mongoose');
const mongodbConfig = require('../../../config/mongodb.config');

module.exports = {
  async up() {
    try {
      // Connect to MongoDB
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Define the investment_portfolios collection schema
      const investmentPortfolioSchema = new mongoose.Schema({
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        portfolio_name: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        total_value: { type: Number, required: true },
        cash_balance: { type: Number, required: true },
        holdings: [
          {
            symbol: { type: String, required: true },
            quantity: { type: Number, required: true },
            purchase_price: { type: Number, required: true },
            current_price: { type: Number, required: true },
            current_value: { type: Number, required: true }
          }
        ],
        performance: {
          daily: { type: Number },
          weekly: { type: Number },
          monthly: { type: Number },
          yearly: { type: Number },
          all_time: { type: Number }
        }
      });

      // Create the investment_portfolios collection
      await mongoose.connection.createCollection('investment_portfolios');

      // Create indexes for efficient querying
      await mongoose.connection.collection('investment_portfolios').createIndex({ user_id: 1 });
      await mongoose.connection.collection('investment_portfolios').createIndex({ portfolio_name: 1 }, { unique: true });
      await mongoose.connection.collection('investment_portfolios').createIndex({ created_at: 1 });
      await mongoose.connection.collection('investment_portfolios').createIndex({ updated_at: 1 });

      console.log('Successfully created investment_portfolios collection and indexes');
    } catch (error) {
      console.error('Error creating investment_portfolios collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  },

  async down() {
    try {
      // Connect to MongoDB
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Drop the investment_portfolios collection
      await mongoose.connection.dropCollection('investment_portfolios');

      console.log('Successfully dropped investment_portfolios collection');
    } catch (error) {
      console.error('Error dropping investment_portfolios collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  }
};

// Human tasks:
// 1. Review and adjust the investment_portfolios schema based on specific business requirements
// 2. Implement data validation rules for investment portfolio entries
// 3. Set up appropriate access controls and security measures for investment data