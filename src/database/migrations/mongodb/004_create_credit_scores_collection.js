const mongoose = require('mongoose');
const mongodbConfig = require('../../../config/mongodb.config');

module.exports = {
  async up() {
    try {
      // Connect to MongoDB using the mongodbConfig
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Define the schema for credit_scores collection
      const creditScoreSchema = new mongoose.Schema({
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        score: {
          type: Number,
          required: true,
          min: 300,
          max: 850
        },
        provider: {
          type: String,
          required: true,
          enum: ["Equifax", "Experian", "TransUnion"]
        },
        date: {
          type: Date,
          required: true,
          default: Date.now
        },
        factors: [{
          name: {
            type: String,
            required: true
          },
          impact: {
            type: String,
            enum: ["Positive", "Negative", "Neutral"],
            required: true
          }
        }]
      });

      // Create the credit_scores collection with the defined schema
      const CreditScore = mongoose.model('CreditScore', creditScoreSchema);

      // Create indexes for efficient querying
      await CreditScore.createIndexes([
        { user_id: 1, date: -1 },
        { score: 1 }
      ]);

      console.log('Successfully created credit_scores collection and indexes');
    } catch (error) {
      console.error('Error creating credit_scores collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  },

  async down() {
    try {
      // Connect to MongoDB using the mongodbConfig
      await mongoose.connect(mongodbConfig.url, mongodbConfig.options);

      // Drop the credit_scores collection
      await mongoose.connection.db.dropCollection('credit_scores');

      console.log('Successfully dropped credit_scores collection');
    } catch (error) {
      console.error('Error dropping credit_scores collection:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  }
};

// Human tasks:
// 1. Review and adjust credit score range (300-850) if different scoring models are used
// 2. Confirm the list of credit score providers (Equifax, Experian, TransUnion) is complete and accurate
// 3. Implement data retention policy for credit score history