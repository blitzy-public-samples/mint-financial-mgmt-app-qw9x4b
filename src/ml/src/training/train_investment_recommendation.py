import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import tensorflow as tf

from src.ml.src.config.model_config import INVESTMENT_RECOMMENDATION_MODEL
from src.ml.src.models.investment_recommendation import InvestmentRecommendationModel
from src.ml.src.preprocessing.data_cleaning import clean_data
from src.ml.src.preprocessing.feature_engineering import engineer_features
from src.ml.src.utils.data_loader import load_investment_data
from src.ml.src.utils.model_utils import save_model

# Set random seed for reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
tf.random.set_seed(RANDOM_SEED)

# Set the path for saving the trained model
MODEL_SAVE_PATH = '../../models/investment_recommendation_model'

def load_and_preprocess_data():
    """
    Loads and preprocesses the investment data for model training.
    
    Returns:
        pandas.DataFrame: Preprocessed investment data
    """
    # Load raw investment data
    raw_data = load_investment_data()
    
    # Clean the data
    cleaned_data = clean_data(raw_data)
    
    # Perform feature engineering
    preprocessed_data = engineer_features(cleaned_data)
    
    return preprocessed_data

def split_data(df):
    """
    Splits the preprocessed data into training and testing sets.
    
    Args:
        df (pandas.DataFrame): Preprocessed investment data
    
    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    # Separate features (X) and target variable (y)
    X = df.drop(INVESTMENT_RECOMMENDATION_MODEL['target_column'], axis=1)
    y = df[INVESTMENT_RECOMMENDATION_MODEL['target_column']]
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=INVESTMENT_RECOMMENDATION_MODEL['test_size'],
        random_state=RANDOM_SEED
    )
    
    return X_train, X_test, y_train, y_test

def train_model(X_train, y_train):
    """
    Trains the investment recommendation model.
    
    Args:
        X_train (numpy.ndarray): Training features
        y_train (numpy.ndarray): Training target variable
    
    Returns:
        InvestmentRecommendationModel: Trained model
    """
    # Initialize InvestmentRecommendationModel
    model = InvestmentRecommendationModel(
        input_dim=X_train.shape[1],
        **INVESTMENT_RECOMMENDATION_MODEL['model_params']
    )
    
    # Train the model
    model.fit(
        X_train, y_train,
        epochs=INVESTMENT_RECOMMENDATION_MODEL['epochs'],
        batch_size=INVESTMENT_RECOMMENDATION_MODEL['batch_size'],
        validation_split=INVESTMENT_RECOMMENDATION_MODEL['validation_split']
    )
    
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluates the trained model on the test set.
    
    Args:
        model (InvestmentRecommendationModel): Trained model
        X_test (numpy.ndarray): Test features
        y_test (numpy.ndarray): Test target variable
    
    Returns:
        dict: Evaluation metrics
    """
    # Generate predictions using the trained model
    y_pred = model.predict(X_test)
    
    # Calculate relevant evaluation metrics
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    return {
        'mean_squared_error': mse,
        'mean_absolute_error': mae,
        'r_squared': r2
    }

def main():
    """
    Main function to orchestrate the training process.
    """
    print("Starting investment recommendation model training...")
    
    # Load and preprocess data
    data = load_and_preprocess_data()
    print("Data loaded and preprocessed.")
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = split_data(data)
    print("Data split into training and testing sets.")
    
    # Train the investment recommendation model
    model = train_model(X_train, y_train)
    print("Model training completed.")
    
    # Evaluate the model
    evaluation_metrics = evaluate_model(model, X_test, y_test)
    print("Model evaluation completed.")
    
    # Save the trained model
    save_model(model, MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")
    
    # Print evaluation metrics
    print("Evaluation Metrics:")
    for metric, value in evaluation_metrics.items():
        print(f"{metric}: {value}")

if __name__ == "__main__":
    main()

# Human Tasks:
# TODO: Review and validate the feature engineering process for investment recommendation
# TODO: Determine appropriate evaluation metrics for the investment recommendation model
# TODO: Set up a process for regular model retraining and performance monitoring
# TODO: Implement cross-validation for more robust model evaluation
# TODO: Develop a strategy for handling class imbalance in investment data, if present