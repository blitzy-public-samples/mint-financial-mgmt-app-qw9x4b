const mongoose = require('mongoose');
const mongodbConfig = require('../../../config/mongodb.config');

const up = async () => {
  try {
    await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);

    const userPreferencesSchema = new mongoose.Schema({
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
      },
      notification_settings: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        }
      },
      default_currency: {
        type: String,
        default: 'USD'
      },
      language: {
        type: String,
        default: 'en'
      },
      dashboard_widgets: {
        type: [String],
        default: ['net_worth', 'recent_transactions', 'spending_by_category', 'financial_insights']
      },
      created_at: {
        type: Date,
        default: Date.now
      },
      updated_at: {
        type: Date,
        default: Date.now
      }
    });

    const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

    await UserPreferences.createCollection();

    await UserPreferences.createIndexes([
      { user_id: 1 },
      { unique: true }
    ]);

    console.log('Successfully created user_preferences collection');
  } catch (error) {
    console.error('Error creating user_preferences collection:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

const down = async () => {
  try {
    await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);

    await mongoose.connection.dropCollection('user_preferences');

    console.log('Successfully dropped user_preferences collection');
  } catch (error) {
    console.error('Error dropping user_preferences collection:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

module.exports = { up, down };

// TODO: Review and adjust the user_preferences schema based on specific application requirements
// TODO: Implement data validation for user preference fields
// TODO: Set up proper error handling and logging for the migration process