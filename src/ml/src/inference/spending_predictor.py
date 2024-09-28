import numpy as np
import pandas as pd
from typing import Dict, List
from ..models.spending_prediction import SpendingPredictionModel
from ..config.model_config import SPENDING_PREDICTION_MODEL
from ..utils.model_utils import load_model

# Global constant for the model path
MODEL_PATH = '/path/to/saved/spending_prediction_model.h5'

def load_spending_prediction_model() -> SpendingPredictionModel:
    """
    Loads the trained spending prediction model from disk.

    Returns:
        SpendingPredictionModel: Loaded spending prediction model
    """
    model = SpendingPredictionModel()
    model = load_model(MODEL_PATH)
    return model

def preprocess_input_data(user_data: Dict) -> pd.DataFrame:
    """
    Preprocesses the input data for spending prediction.

    Args:
        user_data (Dict): User data containing relevant features

    Returns:
        pd.DataFrame: Preprocessed input data
    """
    # Extract relevant features
    historical_spending = user_data.get('historical_spending', [])
    income = user_data.get('income', 0)
    month = user_data.get('month', 1)

    # Create a pandas DataFrame with the extracted features
    df = pd.DataFrame({
        'historical_spending': [historical_spending],
        'income': [income],
        'month': [month]
    })

    # Normalize numerical features if required
    # For this example, we'll assume normalization is not needed
    # but you might want to add normalization logic here based on your model's requirements

    # Encode categorical features if any
    # For this example, we'll assume no categorical features need encoding
    # but you might want to add encoding logic here if needed

    return df

def predict_spending(user_data: Dict) -> float:
    """
    Predicts future spending based on user data.

    Args:
        user_data (Dict): User data containing relevant features

    Returns:
        float: Predicted spending amount
    """
    # Load the spending prediction model
    model = load_spending_prediction_model()

    # Preprocess the user data
    preprocessed_data = preprocess_input_data(user_data)

    # Use the model to make a prediction
    prediction = model.predict(preprocessed_data)

    # Post-process the prediction if necessary (e.g., denormalize)
    # For this example, we'll assume no post-processing is needed
    # but you might want to add post-processing logic here based on your model's output

    return float(prediction[0])

class SpendingPredictor:
    """
    Class for making spending predictions using the trained model.
    """

    def __init__(self):
        """
        Initializes the SpendingPredictor class.
        """
        self.model = load_spending_prediction_model()

    def predict(self, user_data: Dict) -> float:
        """
        Makes a spending prediction for the given user data.

        Args:
            user_data (Dict): User data containing relevant features

        Returns:
            float: Predicted spending amount
        """
        preprocessed_data = preprocess_input_data(user_data)
        prediction = self.model.predict(preprocessed_data)
        return float(prediction[0])

    def batch_predict(self, user_data_list: List[Dict]) -> List[float]:
        """
        Makes spending predictions for multiple users.

        Args:
            user_data_list (List[Dict]): List of user data dictionaries

        Returns:
            List[float]: List of predicted spending amounts
        """
        predictions = []
        for user_data in user_data_list:
            prediction = self.predict(user_data)
            predictions.append(prediction)
        return predictions

# List of human tasks
"""
Human tasks:
1. Implement proper error handling for invalid input data (Required)
2. Add logging for prediction requests and results (Required)
3. Optimize batch prediction for large-scale processing (Optional)
4. Implement caching mechanism for frequently requested predictions (Optional)
5. Add unit tests for SpendingPredictor class and its methods (Required)
6. Implement versioning for the spending predictor to handle model updates (Required)
7. Review and optimize preprocessing steps for efficiency (Required)
"""