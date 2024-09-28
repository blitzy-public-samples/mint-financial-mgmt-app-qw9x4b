from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict

# Import services
# Note: These imports assume the services are implemented in their respective files
from ..services.transaction_categorization_service import categorize_transaction
from ..services.spending_prediction_service import predict_spending
from ..services.investment_recommendation_service import recommend_investments
from ..services.credit_score_prediction_service import predict_credit_score

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post('/categorize-transaction')
async def categorize_transaction_endpoint(transaction_data: Dict):
    """
    Endpoint to categorize a transaction using the ML model
    """
    try:
        # Validate input transaction data
        if not transaction_data:
            raise HTTPException(status_code=400, detail="Transaction data is required")
        
        # Call transaction_categorization_service to categorize the transaction
        categorized_transaction = categorize_transaction(transaction_data)
        
        # Return the categorized transaction data as a JSONResponse
        return JSONResponse(content=categorized_transaction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/predict-spending')
async def predict_spending_endpoint(user_data: Dict):
    """
    Endpoint to predict future spending based on historical data
    """
    try:
        # Validate input user data
        if not user_data:
            raise HTTPException(status_code=400, detail="User data is required")
        
        # Call spending_prediction_service to generate spending predictions
        spending_prediction = predict_spending(user_data)
        
        # Return the spending prediction data as a JSONResponse
        return JSONResponse(content=spending_prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/recommend-investments')
async def recommend_investments_endpoint(user_profile: Dict):
    """
    Endpoint to provide investment recommendations based on user profile and market data
    """
    try:
        # Validate input user profile data
        if not user_profile:
            raise HTTPException(status_code=400, detail="User profile data is required")
        
        # Call investment_recommendation_service to generate investment recommendations
        investment_recommendations = recommend_investments(user_profile)
        
        # Return the investment recommendations as a JSONResponse
        return JSONResponse(content=investment_recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/predict-credit-score')
async def predict_credit_score_endpoint(user_financial_data: Dict):
    """
    Endpoint to predict a user's credit score based on their financial data
    """
    try:
        # Validate input user financial data
        if not user_financial_data:
            raise HTTPException(status_code=400, detail="User financial data is required")
        
        # Call credit_score_prediction_service to predict the credit score
        credit_score_prediction = predict_credit_score(user_financial_data)
        
        # Return the predicted credit score and contributing factors as a JSONResponse
        return JSONResponse(content=credit_score_prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again later."}
        )

# Pending human tasks:
# TODO: Implement error handling and logging for each endpoint
# TODO: Add authentication middleware to secure the API endpoints
# TODO: Implement rate limiting to prevent abuse of the ML services
# TODO: Add detailed API documentation using FastAPI's built-in Swagger UI