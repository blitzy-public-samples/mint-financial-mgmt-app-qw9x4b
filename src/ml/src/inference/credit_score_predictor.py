import numpy as np
import pandas as pd
from typing import Dict, List

from src.ml.src.models.credit_score_prediction import CreditScorePredictionModel
from src.ml.src.config.model_config import CREDIT_SCORE_PREDICTION_MODEL

# Define the path to the saved model
MODEL_PATH = 'path/to/saved/credit_score_model'

class CreditScorePredictor:
    """
    A class that loads the trained credit score prediction model and provides methods for making predictions.
    """

    def __init__(self):
        """
        Initializes the CreditScorePredictor by loading the trained model.
        """
        self.model = CreditScorePredictionModel()
        self.model.load(MODEL_PATH)

    def predict_credit_score(self, input_data: pd.DataFrame) -> float:
        """
        Predicts the credit score for a given set of input features.

        Args:
            input_data (pd.DataFrame): A DataFrame containing the input features for prediction.

        Returns:
            float: Predicted credit score.

        Raises:
            ValueError: If input_data is missing required features.
        """
        # Validate input_data
        self._validate_input(input_data)

        # Preprocess the input_data
        preprocessed_data = self.model.preprocess_data(input_data)

        # Make prediction
        prediction = self.model.predict(preprocessed_data)

        return float(prediction[0])

    def batch_predict_credit_scores(self, batch_data: pd.DataFrame) -> np.ndarray:
        """
        Predicts credit scores for a batch of input data.

        Args:
            batch_data (pd.DataFrame): A DataFrame containing multiple rows of input features.

        Returns:
            np.ndarray: Array of predicted credit scores.

        Raises:
            ValueError: If batch_data is missing required features.
        """
        # Validate batch_data
        self._validate_input(batch_data)

        # Preprocess the batch_data
        preprocessed_data = self.model.preprocess_data(batch_data)

        # Make predictions
        predictions = self.model.predict(preprocessed_data)

        return predictions

    def get_model_info(self) -> Dict[str, any]:
        """
        Returns information about the loaded credit score prediction model.

        Returns:
            dict: Model information including version and input features.
        """
        return {
            "model_name": CREDIT_SCORE_PREDICTION_MODEL["name"],
            "model_version": CREDIT_SCORE_PREDICTION_MODEL["version"],
            "input_features": CREDIT_SCORE_PREDICTION_MODEL["input_features"]
        }

    def _validate_input(self, input_data: pd.DataFrame) -> None:
        """
        Validates that the input data contains all required features.

        Args:
            input_data (pd.DataFrame): Input data to be validated.

        Raises:
            ValueError: If any required features are missing.
        """
        required_features = set(CREDIT_SCORE_PREDICTION_MODEL["input_features"])
        input_features = set(input_data.columns)

        if not required_features.issubset(input_features):
            missing_features = required_features - input_features
            raise ValueError(f"Missing required features: {', '.join(missing_features)}")

def load_credit_score_predictor() -> CreditScorePredictor:
    """
    Factory function to create and return a CreditScorePredictor instance.

    Returns:
        CreditScorePredictor: An instance of the CreditScorePredictor.
    """
    return CreditScorePredictor()

# TODO: Implement proper error handling for invalid input data
# TODO: Add logging for model predictions and any issues encountered
# TODO: Implement caching mechanism for frequent predictions to improve performance
# TODO: Conduct thorough testing with various input scenarios
# TODO: Implement model versioning and compatibility checks
# TODO: Add input data validation to ensure all required features are present