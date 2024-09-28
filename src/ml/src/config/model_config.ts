// Configuration file for machine learning models in the Mint Replica application.
// This file defines parameters and settings for various ML models used in the application.

// Transaction Categorization Model Configuration
export const TRANSACTION_CATEGORIZATION_MODEL = {
  modelName: 'transaction_categorization',
  version: '1.0.0',
  inputFeatures: ['description', 'amount', 'date'],
  outputClasses: ['food', 'transportation', 'utilities', 'entertainment', 'other'],
  trainingParams: {
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001
  }
};

// Spending Prediction Model Configuration
export const SPENDING_PREDICTION_MODEL = {
  modelName: 'spending_prediction',
  version: '1.0.0',
  inputFeatures: ['historical_spending', 'income', 'month'],
  outputFeature: 'predicted_spending',
  trainingParams: {
    epochs: 50,
    batchSize: 64,
    learningRate: 0.0005
  }
};

// Investment Recommendation Model Configuration
export const INVESTMENT_RECOMMENDATION_MODEL = {
  modelName: 'investment_recommendation',
  version: '1.0.0',
  inputFeatures: ['risk_tolerance', 'investment_horizon', 'current_portfolio'],
  outputFeature: 'recommended_allocation',
  trainingParams: {
    epochs: 75,
    batchSize: 32,
    learningRate: 0.001
  }
};

// Credit Score Prediction Model Configuration
export const CREDIT_SCORE_PREDICTION_MODEL = {
  modelName: 'credit_score_prediction',
  version: '1.0.0',
  inputFeatures: ['payment_history', 'credit_utilization', 'credit_history_length', 'credit_mix'],
  outputFeature: 'predicted_credit_score',
  trainingParams: {
    epochs: 100,
    batchSize: 64,
    learningRate: 0.0001
  }
};

// Export all model configurations
export {
  TRANSACTION_CATEGORIZATION_MODEL,
  SPENDING_PREDICTION_MODEL,
  INVESTMENT_RECOMMENDATION_MODEL,
  CREDIT_SCORE_PREDICTION_MODEL
};

// Human Tasks:
// TODO: Review and validate model configurations with data science team
// TODO: Ensure model versions are up-to-date and match the latest trained models
// TODO: Confirm that input features and output classes/features are correct for each model
// TODO: Optimize training parameters based on model performance metrics