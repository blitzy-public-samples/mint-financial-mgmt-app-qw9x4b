import numpy as np
import pandas as pd
from typing import Dict, Any

from ..models.investment_recommendation import InvestmentRecommendationModel
from ..utils.model_utils import save_model, load_model, preprocess_input, postprocess_output
from ..config.model_config import INVESTMENT_RECOMMENDATION_MODEL

class InvestmentRecommendationService:
    """
    A service class that manages the investment recommendation model and provides an interface for generating recommendations.
    """

    def __init__(self):
        """
        Initializes the InvestmentRecommendationService by loading or creating a new model.
        """
        try:
            self.model = load_model(INVESTMENT_RECOMMENDATION_MODEL)
        except FileNotFoundError:
            self.model = InvestmentRecommendationModel()

    def get_recommendation(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates an investment recommendation based on user data.

        Args:
            user_data (Dict[str, Any]): A dictionary containing user financial data and preferences.

        Returns:
            Dict[str, Any]: A dictionary containing the investment recommendation.
        """
        # Preprocess the user data
        preprocessed_data = preprocess_input(user_data)

        # Generate recommendation using the model
        raw_recommendation = self.model.predict(preprocessed_data)

        # Postprocess the model output
        recommendation = postprocess_output(raw_recommendation)

        # Format the recommendation
        formatted_recommendation = format_recommendation(recommendation)

        return formatted_recommendation

    def train_model(self, training_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Trains the investment recommendation model on new data.

        Args:
            training_data (pd.DataFrame): A DataFrame containing training data for the model.

        Returns:
            Dict[str, Any]: A dictionary containing training results, including metrics and model version.
        """
        # Train the model
        training_results = self.model.train(training_data)

        # Save the trained model
        save_model(self.model, INVESTMENT_RECOMMENDATION_MODEL)

        return training_results

    def update_model(self, new_model_path: str) -> bool:
        """
        Updates the current model with a newly trained version.

        Args:
            new_model_path (str): The file path of the new model.

        Returns:
            bool: True if the update was successful, False otherwise.
        """
        try:
            new_model = load_model(new_model_path)
            self.model = new_model
            save_model(self.model, INVESTMENT_RECOMMENDATION_MODEL)
            return True
        except Exception as e:
            print(f"Error updating model: {str(e)}")
            return False

def validate_user_input(user_data: Dict[str, Any]) -> bool:
    """
    Validates the user input data for investment recommendation.

    Args:
        user_data (Dict[str, Any]): A dictionary containing user financial data and preferences.

    Returns:
        bool: True if all validations pass, False otherwise.
    """
    required_fields = ['age', 'income', 'risk_tolerance', 'investment_horizon', 'current_investments']
    
    # Check if all required fields are present
    if not all(field in user_data for field in required_fields):
        return False
    
    # Validate data types and ranges
    try:
        assert isinstance(user_data['age'], int) and 18 <= user_data['age'] <= 100
        assert isinstance(user_data['income'], (int, float)) and user_data['income'] >= 0
        assert user_data['risk_tolerance'] in ['low', 'medium', 'high']
        assert isinstance(user_data['investment_horizon'], int) and user_data['investment_horizon'] > 0
        assert isinstance(user_data['current_investments'], dict)
    except AssertionError:
        return False
    
    return True

def format_recommendation(model_output: Dict[str, Any]) -> Dict[str, Any]:
    """
    Formats the raw model output into a user-friendly recommendation.

    Args:
        model_output (Dict[str, Any]): The raw output from the investment recommendation model.

    Returns:
        Dict[str, Any]: A formatted recommendation dictionary.
    """
    formatted_recommendation = {
        'asset_allocation': {},
        'explanation': [],
        'disclaimer': (
            "This investment recommendation is based on the information provided and should not be "
            "considered as financial advice. Please consult with a qualified financial advisor before "
            "making any investment decisions."
        )
    }

    # Convert numerical allocations to percentages and add explanations
    total_allocation = sum(model_output['allocation'].values())
    for asset, allocation in model_output['allocation'].items():
        percentage = (allocation / total_allocation) * 100
        formatted_recommendation['asset_allocation'][asset] = f"{percentage:.2f}%"
        
        explanation = f"We recommend allocating {percentage:.2f}% of your portfolio to {asset}. "
        if asset == 'stocks':
            explanation += "Stocks offer potential for high returns but come with higher risk."
        elif asset == 'bonds':
            explanation += "Bonds typically offer lower returns but provide more stability to your portfolio."
        elif asset == 'real_estate':
            explanation += "Real estate can provide steady income and act as a hedge against inflation."
        elif asset == 'cash':
            explanation += "Keeping a portion in cash ensures liquidity for short-term needs and opportunities."
        
        formatted_recommendation['explanation'].append(explanation)

    return formatted_recommendation

# Commented list of human tasks
"""
Human tasks:
1. Implement comprehensive input validation logic in validate_user_input function (Required)
2. Develop a strategy for regularly updating the model with new training data (Required)
3. Create a monitoring system to track model performance and trigger retraining when necessary (Required)
4. Implement error handling and logging throughout the service (Required)
5. Develop unit tests for all functions in the InvestmentRecommendationService (Required)
6. Review and refine the format_recommendation function to ensure clear and actionable advice (Optional)
"""