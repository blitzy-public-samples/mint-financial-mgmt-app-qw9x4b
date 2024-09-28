from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict

# Import services
from ..services import transaction_categorization_service
from ..services import spending_prediction_service
from ..services import investment_recommendation_service
from ..services import credit_score_prediction_service

# Create router instance
router = APIRouter()

@router.post('/categorize-transaction')
async def categorize_transaction(transaction_data: Dict):
    """
    Route to categorize a transaction using the ML model
    """
    try:
        # Validate input transaction data
        if not transaction_data or not isinstance(transaction_data, dict):
            raise HTTPException(status_code=400, detail="Invalid transaction data")

        # Call transaction_categorization_service to categorize the transaction
        categorized_transaction = await transaction_categorization_service.categorize_transaction(transaction_data)

        # Return the categorized transaction data as a JSONResponse
        return JSONResponse(content=categorized_transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/predict-spending')
async def predict_spending(user_data: Dict):
    """
    Route to predict future spending based on historical data
    """
    try:
        # Validate input user data
        if not user_data or not isinstance(user_data, dict):
            raise HTTPException(status_code=400, detail="Invalid user data")

        # Call spending_prediction_service to generate spending predictions
        spending_prediction = await spending_prediction_service.predict_spending(user_data)

        # Return the spending prediction data as a JSONResponse
        return JSONResponse(content=spending_prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/recommend-investments')
async def recommend_investments(user_profile: Dict):
    """
    Route to provide investment recommendations based on user profile and market data
    """
    try:
        # Validate input user profile data
        if not user_profile or not isinstance(user_profile, dict):
            raise HTTPException(status_code=400, detail="Invalid user profile data")

        # Call investment_recommendation_service to generate investment recommendations
        investment_recommendations = await investment_recommendation_service.recommend_investments(user_profile)

        # Return the investment recommendations as a JSONResponse
        return JSONResponse(content=investment_recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/predict-credit-score')
async def predict_credit_score(user_financial_data: Dict):
    """
    Route to predict a user's credit score based on their financial data
    """
    try:
        # Validate input user financial data
        if not user_financial_data or not isinstance(user_financial_data, dict):
            raise HTTPException(status_code=400, detail="Invalid user financial data")

        # Call credit_score_prediction_service to predict the credit score
        credit_score_prediction = await credit_score_prediction_service.predict_credit_score(user_financial_data)

        # Return the predicted credit score and contributing factors as a JSONResponse
        return JSONResponse(content=credit_score_prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Human tasks (commented out as requested in the file)
"""
Human tasks:
1. Implement input validation using Pydantic models for each route (Required)
2. Add error handling and proper error responses for each route (Required)
3. Implement authentication and authorization checks for each route (Critical)
4. Add request logging and monitoring for each route (Required)
5. Implement rate limiting for each route to prevent abuse (Required)
6. Add detailed API documentation using FastAPI's built-in features (Required)
"""