import pandas as pd
import numpy as np
from typing import Dict, List

from src.ml.src.models.transaction_categorization import TransactionCategorizationModel, create_transaction_categorization_model

class TransactionCategorizationService:
    """
    A service class that provides methods for categorizing transactions and managing the underlying model.
    """

    def __init__(self):
        """
        Initializes the TransactionCategorizationService with a TransactionCategorizationModel.
        """
        self.model = create_transaction_categorization_model()

    def categorize_transactions(self, transactions: pd.DataFrame) -> pd.DataFrame:
        """
        Categorizes a list of transactions using the trained model.

        Args:
            transactions (pd.DataFrame): DataFrame containing transaction data.

        Returns:
            pd.DataFrame: Transactions with predicted categories.
        """
        # Validate input transactions DataFrame
        if not isinstance(transactions, pd.DataFrame) or transactions.empty:
            raise ValueError("Invalid input: transactions must be a non-empty pandas DataFrame")

        # Preprocess transactions if necessary
        # TODO: Implement preprocessing logic if required

        # Call model.predict() to get category predictions
        predictions = self.model.predict(transactions)

        # Add predicted categories to the input DataFrame
        transactions['predicted_category'] = predictions

        return transactions

    def train_model(self, training_data: pd.DataFrame) -> Dict:
        """
        Trains the transaction categorization model with new data.

        Args:
            training_data (pd.DataFrame): DataFrame containing training data.

        Returns:
            Dict: Training history and metrics.
        """
        # Validate input training_data DataFrame
        if not isinstance(training_data, pd.DataFrame) or training_data.empty:
            raise ValueError("Invalid input: training_data must be a non-empty pandas DataFrame")

        # Preprocess training data if necessary
        # TODO: Implement preprocessing logic if required

        # Call model.train() with the preprocessed data
        history = self.model.train(training_data)

        return history

    def save_model(self, file_path: str) -> bool:
        """
        Saves the current model to a specified file path.

        Args:
            file_path (str): The path where the model should be saved.

        Returns:
            bool: True if save was successful, False otherwise.
        """
        # Validate the file_path
        if not isinstance(file_path, str) or not file_path:
            raise ValueError("Invalid input: file_path must be a non-empty string")

        # Call model.save_model() with the provided file_path
        try:
            self.model.save_model(file_path)
            return True
        except Exception as e:
            print(f"Error saving model: {str(e)}")
            return False

    def load_model(self, file_path: str) -> bool:
        """
        Loads a saved model from a specified file path.

        Args:
            file_path (str): The path from where the model should be loaded.

        Returns:
            bool: True if load was successful, False otherwise.
        """
        # Validate the file_path
        if not isinstance(file_path, str) or not file_path:
            raise ValueError("Invalid input: file_path must be a non-empty string")

        # Call model.load_model() with the provided file_path
        try:
            self.model.load_model(file_path)
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

    def evaluate_model(self, test_data: pd.DataFrame) -> Dict:
        """
        Evaluates the model's performance on a test dataset.

        Args:
            test_data (pd.DataFrame): DataFrame containing test data.

        Returns:
            Dict: Evaluation metrics (e.g., accuracy, F1-score).
        """
        # Validate input test_data DataFrame
        if not isinstance(test_data, pd.DataFrame) or test_data.empty:
            raise ValueError("Invalid input: test_data must be a non-empty pandas DataFrame")

        # Preprocess test data if necessary
        # TODO: Implement preprocessing logic if required

        # Use model to predict categories for test data
        predictions = self.model.predict(test_data)

        # Compare predictions with actual categories
        actual_categories = test_data['category']  # Assuming 'category' is the column name for actual categories

        # Calculate and return evaluation metrics
        accuracy = np.mean(predictions == actual_categories)
        # TODO: Implement additional metrics (e.g., F1-score, precision, recall) as needed

        return {
            'accuracy': accuracy,
            # Add other metrics here
        }

def create_transaction_categorization_service() -> TransactionCategorizationService:
    """
    Factory function to create and return a TransactionCategorizationService instance.

    Returns:
        TransactionCategorizationService: An instance of the TransactionCategorizationService.
    """
    return TransactionCategorizationService()

# TODO: Implement error handling and logging for all service methods
# TODO: Add input validation for all public methods to ensure data integrity
# TODO: Implement a method for updating the model with incremental learning
# TODO: Add support for batch processing of large transaction datasets
# TODO: Implement a caching mechanism for frequently categorized transactions