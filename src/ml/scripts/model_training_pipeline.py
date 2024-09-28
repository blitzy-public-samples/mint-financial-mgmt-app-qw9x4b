import argparse
import logging
from typing import Dict, Any

import pandas as pd
from sklearn.model_selection import train_test_split

# Assuming these imports work correctly
from src.ml.src.config.model_config import (
    TRANSACTION_CATEGORIZATION_MODEL,
    SPENDING_PREDICTION_MODEL,
    INVESTMENT_RECOMMENDATION_MODEL,
    CREDIT_SCORE_PREDICTION_MODEL,
)
from src.ml.src.models.transaction_categorization import TransactionCategorizationModel
from src.ml.src.models.spending_prediction import SpendingPredictionModel
from src.ml.src.models.investment_recommendation import InvestmentRecommendationModel
from src.ml.src.models.credit_score_prediction import CreditScorePredictionModel
from src.ml.src.preprocessing.data_cleaning import clean_data
from src.ml.src.preprocessing.feature_engineering import engineer_features
from src.ml.src.evaluation.model_evaluation import (
    evaluate_transaction_categorization,
    evaluate_spending_prediction,
    evaluate_investment_recommendation,
    evaluate_credit_score_prediction,
)
from src.ml.src.utils.data_loader import load_and_prepare_data
from src.ml.src.utils.model_utils import save_model

logger = logging.getLogger(__name__)

def setup_logging():
    """Sets up logging for the model training pipeline"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("model_training.log"),
            logging.StreamHandler()
        ]
    )

def parse_arguments() -> argparse.Namespace:
    """Parses command-line arguments for the model training pipeline"""
    parser = argparse.ArgumentParser(description="Model Training Pipeline")
    parser.add_argument("--model-type", type=str, required=True, choices=["transaction", "spending", "investment", "credit"],
                        help="Type of model to train")
    parser.add_argument("--data-source", type=str, required=True, help="Path to the data source")
    parser.add_argument("--hyperparameters", type=str, help="JSON string of hyperparameters")
    return parser.parse_args()

def train_transaction_categorization_model(data: pd.DataFrame, hyperparameters: Dict[str, Any]) -> TransactionCategorizationModel:
    """Trains the transaction categorization model"""
    model = TransactionCategorizationModel(**hyperparameters)
    X = data.drop("category", axis=1)
    y = data["category"]
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model.train(X_train, y_train)
    return model

def train_spending_prediction_model(data: pd.DataFrame, hyperparameters: Dict[str, Any]) -> SpendingPredictionModel:
    """Trains the spending prediction model"""
    model = SpendingPredictionModel(**hyperparameters)
    X = data.drop("spending_amount", axis=1)
    y = data["spending_amount"]
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model.train(X_train, y_train)
    return model

def train_investment_recommendation_model(data: pd.DataFrame, hyperparameters: Dict[str, Any]) -> InvestmentRecommendationModel:
    """Trains the investment recommendation model"""
    model = InvestmentRecommendationModel(**hyperparameters)
    X = data.drop("recommended_investment", axis=1)
    y = data["recommended_investment"]
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model.train(X_train, y_train)
    return model

def train_credit_score_prediction_model(data: pd.DataFrame, hyperparameters: Dict[str, Any]) -> CreditScorePredictionModel:
    """Trains the credit score prediction model"""
    model = CreditScorePredictionModel(**hyperparameters)
    X = data.drop("credit_score", axis=1)
    y = data["credit_score"]
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model.train(X_train, y_train)
    return model

def main():
    """Main function to run the model training pipeline"""
    setup_logging()
    args = parse_arguments()

    logger.info(f"Starting model training pipeline for {args.model_type} model")

    # Load and prepare data
    data = load_and_prepare_data(args.data_source)
    
    # Clean the data
    data = clean_data(data)
    
    # Perform feature engineering
    data = engineer_features(data)

    # Parse hyperparameters
    hyperparameters = eval(args.hyperparameters) if args.hyperparameters else {}

    # Select the appropriate training function based on the model type
    if args.model_type == "transaction":
        model = train_transaction_categorization_model(data, hyperparameters)
        evaluation_func = evaluate_transaction_categorization
        model_config = TRANSACTION_CATEGORIZATION_MODEL
    elif args.model_type == "spending":
        model = train_spending_prediction_model(data, hyperparameters)
        evaluation_func = evaluate_spending_prediction
        model_config = SPENDING_PREDICTION_MODEL
    elif args.model_type == "investment":
        model = train_investment_recommendation_model(data, hyperparameters)
        evaluation_func = evaluate_investment_recommendation
        model_config = INVESTMENT_RECOMMENDATION_MODEL
    elif args.model_type == "credit":
        model = train_credit_score_prediction_model(data, hyperparameters)
        evaluation_func = evaluate_credit_score_prediction
        model_config = CREDIT_SCORE_PREDICTION_MODEL
    else:
        raise ValueError(f"Invalid model type: {args.model_type}")

    # Evaluate the model
    evaluation_results = evaluation_func(model, data)
    logger.info(f"Model evaluation results: {evaluation_results}")

    # Save the trained model
    model_path = save_model(model, model_config["save_path"])
    logger.info(f"Model saved to: {model_path}")

if __name__ == "__main__":
    main()

# Human tasks:
# - Review and optimize hyperparameters for each model type
# - Implement cross-validation for more robust model evaluation
# - Add support for distributed training for large datasets
# - Implement model versioning and experiment tracking
# - Create a configuration file for easily adjustable pipeline parameters
# - Implement error handling and recovery mechanisms for long-running training jobs