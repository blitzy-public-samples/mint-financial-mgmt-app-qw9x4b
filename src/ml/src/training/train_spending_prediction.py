import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf

# Assuming these imports are correct based on the provided specification
from ...config.model_config import SPENDING_PREDICTION_MODEL
from ..preprocessing.data_cleaning import clean_data
from ..preprocessing.feature_engineering import engineer_features
from ..models.spending_prediction import SpendingPredictionModel
from ..utils.data_loader import data_loader

# Global constants
RANDOM_SEED = 42
MODEL_SAVE_PATH = '../../models/spending_prediction_model.h5'

def load_and_preprocess_data(data_path: str) -> pd.DataFrame:
    """
    Loads and preprocesses the data for spending prediction.

    Args:
        data_path (str): Path to the raw data file.

    Returns:
        pd.DataFrame: Preprocessed data ready for model training.
    """
    # Load raw data
    raw_data = data_loader(data_path)
    
    # Clean data
    cleaned_data = clean_data(raw_data)
    
    # Engineer features
    preprocessed_data = engineer_features(cleaned_data)
    
    return preprocessed_data

def split_data(df: pd.DataFrame) -> tuple:
    """
    Splits the data into training, validation, and test sets.

    Args:
        df (pd.DataFrame): Preprocessed data.

    Returns:
        tuple: X_train, X_val, X_test, y_train, y_val, y_test
    """
    # Extract features and target variable
    X = df.drop('target_column', axis=1)  # Assuming 'target_column' is the name of the target variable
    y = df['target_column']
    
    # Perform train-test split
    X_train_val, X_test, y_train_val, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED)
    
    # Perform train-validation split on the training data
    X_train, X_val, y_train, y_val = train_test_split(X_train_val, y_train_val, test_size=0.2, random_state=RANDOM_SEED)
    
    return X_train, X_val, X_test, y_train, y_val, y_test

def train_spending_prediction_model(df: pd.DataFrame) -> SpendingPredictionModel:
    """
    Trains the spending prediction model.

    Args:
        df (pd.DataFrame): Preprocessed data for training.

    Returns:
        SpendingPredictionModel: Trained spending prediction model.
    """
    # Split data into train, validation, and test sets
    X_train, X_val, X_test, y_train, y_val, y_test = split_data(df)
    
    # Initialize SpendingPredictionModel
    model = SpendingPredictionModel(**SPENDING_PREDICTION_MODEL)
    
    # Train the model
    model.train(X_train, y_train, X_val, y_val)
    
    # Evaluate the model on test data
    test_loss, test_metrics = model.evaluate(X_test, y_test)
    print(f"Test Loss: {test_loss}")
    print(f"Test Metrics: {test_metrics}")
    
    # Save the trained model
    model.save(MODEL_SAVE_PATH)
    
    return model

def main():
    """
    Main function to run the spending prediction model training pipeline.
    """
    # Set random seeds for reproducibility
    np.random.seed(RANDOM_SEED)
    tf.random.set_seed(RANDOM_SEED)
    
    # Load and preprocess data
    data_path = "path/to/raw/data.csv"  # Replace with actual data path
    preprocessed_data = load_and_preprocess_data(data_path)
    
    # Train spending prediction model
    trained_model = train_spending_prediction_model(preprocessed_data)
    
    print("Model training completed and saved successfully.")

if __name__ == "__main__":
    main()

# Human Tasks:
# TODO: Review and validate the data preprocessing steps for spending prediction
# TODO: Determine the optimal train-validation-test split ratios
# TODO: Implement cross-validation for more robust model evaluation
# TODO: Set up a logging mechanism to track training progress and results
# TODO: Implement error handling and graceful failure mechanisms
# TODO: Optimize hyperparameters for the spending prediction model
# TODO: Implement model versioning and experiment tracking
# TODO: Set up a mechanism for periodic model retraining