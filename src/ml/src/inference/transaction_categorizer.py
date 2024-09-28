import numpy as np
import pandas as pd
from typing import List, Dict
from src.ml.src.models.transaction_categorization import TransactionCategorizationModel
from src.ml.src.config.model_config import TRANSACTION_CATEGORIZATION_MODEL

# Global variable to store the loaded model
model: TransactionCategorizationModel = None

def load_model(model_path: str) -> None:
    """
    Loads the trained transaction categorization model.

    Args:
        model_path (str): The path to the saved model file.

    Returns:
        None
    """
    global model
    try:
        model = TransactionCategorizationModel()
        model.load(model_path)
    except Exception as e:
        raise RuntimeError(f"Failed to load the model: {str(e)}")

def categorize_transaction(transaction: Dict) -> str:
    """
    Categorizes a single transaction using the loaded model.

    Args:
        transaction (Dict): A dictionary containing transaction details.

    Returns:
        str: Predicted category for the transaction.
    """
    if model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    try:
        # Convert the transaction dict to a pandas DataFrame
        df = pd.DataFrame([transaction])
        
        # Use the model's predict method to get the category
        prediction = model.predict(df)
        
        # Assuming the predict method returns a numpy array or list
        return prediction[0] if isinstance(prediction, (np.ndarray, list)) else prediction
    except Exception as e:
        raise RuntimeError(f"Error categorizing transaction: {str(e)}")

def categorize_transactions(transactions: List[Dict]) -> List[str]:
    """
    Categorizes a batch of transactions using the loaded model.

    Args:
        transactions (List[Dict]): A list of dictionaries containing transaction details.

    Returns:
        List[str]: List of predicted categories for the transactions.
    """
    if model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    try:
        # Convert the list of transaction dicts to a pandas DataFrame
        df = pd.DataFrame(transactions)
        
        # Use the model's predict method to get categories for all transactions
        predictions = model.predict(df)
        
        # Convert predictions to a list if it's a numpy array
        return predictions.tolist() if isinstance(predictions, np.ndarray) else list(predictions)
    except Exception as e:
        raise RuntimeError(f"Error categorizing transactions: {str(e)}")

def get_model_info() -> Dict:
    """
    Returns information about the loaded model.

    Returns:
        Dict: Model information including version and input features.
    """
    if model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    try:
        # Retrieve model information from TRANSACTION_CATEGORIZATION_MODEL config
        model_info = TRANSACTION_CATEGORIZATION_MODEL
        
        # Add any additional information from the loaded model if available
        model_info.update({
            "input_features": model.get_input_features() if hasattr(model, 'get_input_features') else [],
            "model_type": type(model).__name__
        })
        
        return model_info
    except Exception as e:
        raise RuntimeError(f"Error retrieving model information: {str(e)}")

# Error handling and logging
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Wrap the main functions with error handling and logging
def safe_load_model(model_path: str) -> None:
    try:
        load_model(model_path)
        logger.info(f"Model loaded successfully from {model_path}")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise

def safe_categorize_transaction(transaction: Dict) -> str:
    try:
        category = categorize_transaction(transaction)
        logger.info(f"Transaction categorized as: {category}")
        return category
    except Exception as e:
        logger.error(f"Failed to categorize transaction: {str(e)}")
        raise

def safe_categorize_transactions(transactions: List[Dict]) -> List[str]:
    try:
        categories = categorize_transactions(transactions)
        logger.info(f"Categorized {len(categories)} transactions")
        return categories
    except Exception as e:
        logger.error(f"Failed to categorize transactions: {str(e)}")
        raise

def safe_get_model_info() -> Dict:
    try:
        info = get_model_info()
        logger.info("Retrieved model information")
        return info
    except Exception as e:
        logger.error(f"Failed to get model information: {str(e)}")
        raise

# TODO: Implement a caching mechanism to improve performance for frequent categorization requests
# TODO: Optimize batch processing for large numbers of transactions
# TODO: Create unit tests for each function in this file