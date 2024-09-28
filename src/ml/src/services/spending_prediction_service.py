import pandas as pd
import numpy as np
from typing import Dict, Any
from ..models.spending_prediction import SpendingPredictionModel
from ...config.model_config import SPENDING_PREDICTION_MODEL

class SpendingPredictionService:
    """
    Service class for handling spending predictions
    """

    def __init__(self):
        """
        Initializes the SpendingPredictionService
        """
        self.model = SpendingPredictionModel()
        self._load_model()

    def _load_model(self):
        """
        Loads the pre-trained model if available, otherwise sets model to None
        """
        try:
            self.model.load(SPENDING_PREDICTION_MODEL)
        except FileNotFoundError:
            self.model = None

    def prepare_data(self, user_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Prepares input data for spending prediction

        Args:
            user_data (Dict[str, Any]): User data containing relevant features

        Returns:
            pd.DataFrame: Prepared data for prediction
        """
        # Extract relevant features from user_data
        features = [
            'income',
            'age',
            'num_dependents',
            'avg_monthly_expenses',
            'credit_score',
            'employment_status',
            'savings_balance',
            'debt_to_income_ratio'
        ]
        
        prepared_data = {feature: user_data.get(feature) for feature in features}
        
        # Create a pandas DataFrame with the extracted features
        df = pd.DataFrame([prepared_data])
        
        # Perform any necessary data transformations or feature engineering
        df['employment_status'] = df['employment_status'].map({'employed': 1, 'unemployed': 0})
        df['debt_to_income_ratio'] = df['debt_to_income_ratio'].clip(upper=1)  # Cap at 100%
        
        return df

    def predict_spending(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predicts future spending based on user data

        Args:
            user_data (Dict[str, Any]): User data containing relevant features

        Returns:
            Dict[str, Any]: Predicted spending amounts and related information
        """
        # Prepare input data
        prepared_data = self.prepare_data(user_data)
        
        # Check if the model is loaded, if not, load or train the model
        if self.model is None:
            raise ValueError("Model is not loaded. Please train or load a model first.")
        
        # Make predictions using the model's predict() method
        raw_predictions = self.model.predict(prepared_data)
        
        # Format the predictions into a user-friendly dictionary
        formatted_predictions = format_prediction_result(raw_predictions, user_data)
        
        return formatted_predictions

    def train_model(self, training_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Trains or retrains the spending prediction model

        Args:
            training_data (pd.DataFrame): Training data for the model

        Returns:
            Dict[str, Any]: Training results and model performance metrics
        """
        # Validate the input training_data
        if not isinstance(training_data, pd.DataFrame) or training_data.empty:
            raise ValueError("Invalid training data. Please provide a non-empty pandas DataFrame.")

        # Split the data into features and target
        X = training_data.drop('target_spending', axis=1)
        y = training_data['target_spending']

        # Train the model using the SpendingPredictionModel's train() method
        train_results = self.model.train(X, y)

        # Evaluate the model using a holdout test set
        test_size = 0.2
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        evaluation_metrics = self.model.evaluate(X_test, y_test)

        # Save the trained model
        self.model.save(SPENDING_PREDICTION_MODEL)

        # Return training results and evaluation metrics
        return {
            "train_results": train_results,
            "evaluation_metrics": evaluation_metrics
        }

    def evaluate_model(self, test_data: pd.DataFrame) -> Dict[str, float]:
        """
        Evaluates the current model on a given test dataset

        Args:
            test_data (pd.DataFrame): Test data for model evaluation

        Returns:
            Dict[str, float]: Evaluation metrics
        """
        # Validate the input test_data
        if not isinstance(test_data, pd.DataFrame) or test_data.empty:
            raise ValueError("Invalid test data. Please provide a non-empty pandas DataFrame.")

        # Split the data into features and target
        X_test = test_data.drop('target_spending', axis=1)
        y_test = test_data['target_spending']

        # Use the model's evaluate() method to get performance metrics
        evaluation_metrics = self.model.evaluate(X_test, y_test)

        return evaluation_metrics

    def update_model(self, new_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Updates the model with new data

        Args:
            new_data (pd.DataFrame): New data for updating the model

        Returns:
            Dict[str, Any]: Update results and new model performance metrics
        """
        # Validate the input new_data
        if not isinstance(new_data, pd.DataFrame) or new_data.empty:
            raise ValueError("Invalid new data. Please provide a non-empty pandas DataFrame.")

        # Combine new_data with existing training data
        existing_data = self.model.get_training_data()
        combined_data = pd.concat([existing_data, new_data], ignore_index=True)

        # Retrain the model using the combined dataset
        update_results = self.train_model(combined_data)

        # Evaluate the updated model
        evaluation_metrics = self.evaluate_model(new_data)

        # Save the updated model
        self.model.save(SPENDING_PREDICTION_MODEL)

        return {
            "update_results": update_results,
            "new_evaluation_metrics": evaluation_metrics
        }

def format_prediction_result(raw_predictions: np.ndarray, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Formats the raw prediction output into a user-friendly format

    Args:
        raw_predictions (np.ndarray): Raw predictions from the model
        user_data (Dict[str, Any]): Original user data

    Returns:
        Dict[str, Any]: Formatted prediction results
    """
    # Convert raw predictions to a list
    predictions_list = raw_predictions.tolist()

    # Add relevant context from user_data
    formatted_result = {
        "predicted_spending": predictions_list[0],
        "prediction_date": pd.Timestamp.now().strftime("%Y-%m-%d"),
        "user_income": user_data.get("income"),
        "user_age": user_data.get("age"),
    }

    # Format currency values
    formatted_result["predicted_spending"] = f"${formatted_result['predicted_spending']:.2f}"
    formatted_result["user_income"] = f"${formatted_result['user_income']:.2f}"

    return formatted_result

# Human tasks (to be implemented):
# 1. Implement robust error handling and logging throughout the service (Critical)
# 2. Develop a strategy for handling model versioning and updates (Required)
# 3. Create a comprehensive test suite for the SpendingPredictionService (Critical)
# 4. Implement data validation and sanitation for user inputs (Required)
# 5. Optimize the prepare_data method for efficiency with large datasets (Required)
# 6. Implement a caching mechanism for frequent predictions to improve performance (Optional)
# 7. Develop a monitoring system for model performance in production (Required)