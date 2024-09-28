import mongoose, { Schema, Document } from 'mongoose';
import { mongodbConfig } from '../../config/mongodb.config';

// Interface defining the structure of a user preference document
export interface IUserPreference extends Document {
  userId: string;
  theme: string;
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout: object;
}

// Mongoose schema for user preferences
const UserPreferenceSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  language: {
    type: String,
    default: 'en'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  notifications: {
    type: Object,
    default: {
      email: true,
      push: true,
      sms: false
    }
  },
  dashboardLayout: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Create and export the Mongoose model for user preferences
export const UserPreference = mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema, 'user_preferences');

// Human tasks (commented)
/*
TODO: Review and adjust the default values for user preferences based on business requirements
TODO: Implement data validation for currency codes and language codes
TODO: Consider adding indexes for frequently queried fields
*/