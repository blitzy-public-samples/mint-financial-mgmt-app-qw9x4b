import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from src.ml.src.config.model_config import CREDIT_SCORE_PREDICTION_MODEL
from src.ml.src.preprocessing.data_cleaning import clean_data
from src.ml.src.preprocessing.feature_engineering import engineer_features
from src.ml.src.models.credit_score_prediction import CreditScorePredictionModel
from src.ml.src.utils.data_loader import data_loader
from src.ml.src.evaluation.model_evaluation import model_evaluation

# Set random seed for reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
tf.random.set_seed(RANDOM_SEED)

# Define the path to save the trained model
MODEL_SAVE_PATH = 'models/credit_score_prediction_model.h5'

def load_and_preprocess_data(data_path):
    """
    Loads and preprocesses the credit score data
    
    Args:
    data_path (str): Path to the raw data file
    
    Returns:
    tuple: (X: pandas.DataFrame, y: pandas.Series)
    """
    # Load raw data
    raw_data = data_loader(data_path)
    
    # Clean the data
    cleaned_data = clean_data(raw_data)
    
    # Engineer features
    featured_data = engineer_features(cleaned_data)
    
    # Split the data into features (X) and target (y)
    X = featured_data.drop('credit_score', axis=1)
    y = featured_data['credit_score']
    
    return X, y

def split_data(X, y):
    """
    Splits the data into training and testing sets
    
    Args:
    X (pandas.DataFrame): Features
    y (pandas.Series): Target variable
    
    Returns:
    tuple: (X_train, X_test, y_train, y_test)
    """
    return train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED)

def train_model(X_train, y_train):
    """
    Trains the credit score prediction model
    
    Args:
    X_train (pandas.DataFrame): Training features
    y_train (pandas.Series): Training target variable
    
    Returns:
    CreditScorePredictionModel: Trained model
    """
    model = CreditScorePredictionModel(**CREDIT_SCORE_PREDICTION_MODEL)
    model.train(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluates the trained model's performance
    
    Args:
    model (CreditScorePredictionModel): Trained model
    X_test (pandas.DataFrame): Testing features
    y_test (pandas.Series): Testing target variable
    
    Returns:
    dict: Evaluation metrics
    """
    # Use the model's evaluate method
    model_metrics = model.evaluate(X_test, y_test)
    
    # Use additional evaluation from model_evaluation module
    additional_metrics = model_evaluation(model, X_test, y_test)
    
    # Combine all metrics
    all_metrics = {**model_metrics, **additional_metrics}
    
    return all_metrics

def save_trained_model(model, file_path):
    """
    Saves the trained model to a file
    
    Args:
    model (CreditScorePredictionModel): Trained model
    file_path (str): Path to save the model
    """
    model.save_model(file_path)
    print(f"Model saved to {file_path}")

def main():
    """
    Main function to orchestrate the training process
    """
    print("Starting credit score prediction model training...")
    
    # Load and preprocess data
    data_path = 'data/credit_score_data.csv'  # Update this path as needed
    X, y = load_and_preprocess_data(data_path)
    
    # Split data
    X_train, X_test, y_train, y_test = split_data(X, y)
    
    # Train model
    model = train_model(X_train, y_train)
    
    # Evaluate model
    metrics = evaluate_model(model, X_test, y_test)
    
    # Print evaluation metrics
    print("Model Evaluation Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value}")
    
    # Save the trained model
    save_trained_model(model, MODEL_SAVE_PATH)
    
    print("Credit score prediction model training completed.")

if __name__ == "__main__":
    main()

# Human Tasks:
# TODO: Review and validate the data preprocessing steps for credit score prediction
# TODO: Determine the optimal train-test split ratio for credit score data
# TODO: Implement cross-validation for more robust model evaluation
# TODO: Set up a logging mechanism for tracking training progress and results
# TODO: Implement error handling for data loading and model training processes
# TODO: Optimize model hyperparameters using techniques like grid search or random search
# TODO: Implement a mechanism for model versioning and experiment tracking