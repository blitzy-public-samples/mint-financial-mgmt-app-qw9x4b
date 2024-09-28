import pytest
from fastapi.testclient import TestClient
import json
from src.ml.src.api.ml_api import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_categorize_transaction():
    # Prepare sample transaction data
    sample_transaction = {
        "description": "Grocery shopping at Walmart",
        "amount": 85.50,
        "date": "2023-05-15"
    }

    # Send a POST request to /categorize-transaction with the sample data
    response = client.post("/categorize-transaction", json=sample_transaction)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert that the response JSON contains the expected keys
    response_data = response.json()
    assert "category" in response_data
    assert "confidence" in response_data

    # Assert that the categorized transaction data is as expected
    assert isinstance(response_data["category"], str)
    assert isinstance(response_data["confidence"], float)
    assert 0 <= response_data["confidence"] <= 1

@pytest.mark.asyncio
async def test_predict_spending():
    # Prepare sample user data
    sample_user_data = {
        "user_id": "12345",
        "historical_transactions": [
            {"category": "Groceries", "amount": 100, "date": "2023-05-01"},
            {"category": "Utilities", "amount": 150, "date": "2023-05-05"},
            {"category": "Entertainment", "amount": 50, "date": "2023-05-10"}
        ],
        "prediction_period": "month"
    }

    # Send a POST request to /predict-spending with the sample data
    response = client.post("/predict-spending", json=sample_user_data)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert that the response JSON contains the expected keys
    response_data = response.json()
    assert "predicted_spending" in response_data
    assert "confidence_interval" in response_data

    # Assert that the spending prediction data is in the correct format
    assert isinstance(response_data["predicted_spending"], float)
    assert isinstance(response_data["confidence_interval"], list)
    assert len(response_data["confidence_interval"]) == 2

@pytest.mark.asyncio
async def test_recommend_investments():
    # Prepare sample user profile data
    sample_user_profile = {
        "user_id": "12345",
        "risk_tolerance": "moderate",
        "investment_horizon": "long-term",
        "current_portfolio": [
            {"asset_type": "stocks", "value": 10000},
            {"asset_type": "bonds", "value": 5000}
        ]
    }

    # Send a POST request to /recommend-investments with the sample data
    response = client.post("/recommend-investments", json=sample_user_profile)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert that the response JSON contains the expected keys
    response_data = response.json()
    assert "recommendations" in response_data

    # Assert that the investment recommendations are in the correct format
    assert isinstance(response_data["recommendations"], list)
    for recommendation in response_data["recommendations"]:
        assert "asset_type" in recommendation
        assert "allocation_percentage" in recommendation
        assert isinstance(recommendation["allocation_percentage"], float)
        assert 0 <= recommendation["allocation_percentage"] <= 100

@pytest.mark.asyncio
async def test_predict_credit_score():
    # Prepare sample user financial data
    sample_financial_data = {
        "user_id": "12345",
        "credit_history_length": 60,
        "payment_history": 0.95,
        "credit_utilization": 0.3,
        "recent_inquiries": 2,
        "total_accounts": 5
    }

    # Send a POST request to /predict-credit-score with the sample data
    response = client.post("/predict-credit-score", json=sample_financial_data)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Assert that the response JSON contains the expected keys
    response_data = response.json()
    assert "predicted_score" in response_data
    assert "score_factors" in response_data

    # Assert that the predicted credit score and factors are in the correct format
    assert isinstance(response_data["predicted_score"], int)
    assert 300 <= response_data["predicted_score"] <= 850
    assert isinstance(response_data["score_factors"], list)
    for factor in response_data["score_factors"]:
        assert "factor" in factor
        assert "impact" in factor

@pytest.mark.asyncio
async def test_invalid_input():
    # Prepare invalid input data for each endpoint
    invalid_data = {
        "categorize_transaction": {"invalid_key": "invalid_value"},
        "predict_spending": {"user_id": "12345"},
        "recommend_investments": {"user_id": "12345"},
        "predict_credit_score": {"user_id": "12345"}
    }

    # Test each endpoint with invalid data
    for endpoint, data in invalid_data.items():
        response = client.post(f"/{endpoint.replace('_', '-')}", json=data)
        
        # Assert that the response status codes are 400 or appropriate error codes
        assert response.status_code in [400, 422]
        
        # Assert that the response JSON contains error messages
        response_data = response.json()
        assert "detail" in response_data

@pytest.mark.asyncio
async def test_error_handling(mocker):
    # Mock the ML services to raise exceptions
    mocker.patch("src.ml.src.services.transaction_categorization_service.categorize_transaction", side_effect=Exception("Mocked error"))
    mocker.patch("src.ml.src.services.spending_prediction_service.predict_spending", side_effect=Exception("Mocked error"))
    mocker.patch("src.ml.src.services.investment_recommendation_service.recommend_investments", side_effect=Exception("Mocked error"))
    mocker.patch("src.ml.src.services.credit_score_prediction_service.predict_credit_score", side_effect=Exception("Mocked error"))

    # Test each endpoint
    endpoints = [
        "/categorize-transaction",
        "/predict-spending",
        "/recommend-investments",
        "/predict-credit-score"
    ]

    for endpoint in endpoints:
        response = client.post(endpoint, json={})
        
        # Assert that the response status codes are 500
        assert response.status_code == 500
        
        # Assert that the response JSON contains appropriate error messages
        response_data = response.json()
        assert "detail" in response_data
        assert "Internal server error" in response_data["detail"]

# Commented list of human tasks
"""
Human tasks:
1. Implement mock data and responses for ML services to avoid calling actual ML models during testing (Required)
2. Add more edge cases and boundary value tests for each endpoint (Required)
3. Implement integration tests that cover the entire ML pipeline (Optional)
4. Add performance tests to ensure the API endpoints meet response time requirements (Optional)
"""