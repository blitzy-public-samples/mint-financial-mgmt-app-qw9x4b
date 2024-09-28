const mongoose = require('mongoose');
const mongodbConfig = require('../../../config/mongodb.config');

module.exports = {
  async up() {
    try {
      // Connect to MongoDB using the mongodbConfig
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Define the schema for financial insights
      const financialInsightSchema = new mongoose.Schema({
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        type: {
          type: String,
          enum: ['spending', 'saving', 'investment', 'debt'],
          required: true
        },
        content: {
          type: String,
          required: true
        },
        category: {
          type: String,
          required: true
        },
        relevanceScore: {
          type: Number,
          min: 0,
          max: 1,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        expiresAt: {
          type: Date,
          required: true
        },
        isActionable: {
          type: Boolean,
          default: false
        },
        action: {
          type: String
        },
        status: {
          type: String,
          enum: ['new', 'viewed', 'actioned', 'dismissed'],
          default: 'new'
        }
      });

      // Create the financial_insights collection using the defined schema
      const FinancialInsight = mongoose.model('FinancialInsight', financialInsightSchema);

      // Create indexes for efficient querying
      await FinancialInsight.createIndexes([
        { userId: 1, createdAt: -1 },
        { type: 1 },
        { category: 1 },
        { relevanceScore: -1 }
      ]);

      console.log('Successfully created financial_insights collection and indexes');
    } catch (error) {
      console.error('Error creating financial_insights collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  },

  async down() {
    try {
      // Connect to MongoDB using the mongodbConfig
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Check if the financial_insights collection exists
      const collections = await mongoose.connection.db.listCollections({ name: 'financialinsights' }).toArray();
      
      if (collections.length > 0) {
        // If it exists, drop the collection
        await mongoose.connection.db.dropCollection('financialinsights');
        console.log('Successfully deleted financial_insights collection');
      } else {
        console.log('financial_insights collection does not exist, skipping deletion');
      }
    } catch (error) {
      console.error('Error dropping financial_insights collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  }
};

// Human tasks:
// 1. Review and adjust the financial insight schema based on specific business requirements
// 2. Implement data retention policy for financial insights
// 3. Set up appropriate access controls and data privacy measures for financial insights