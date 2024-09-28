import pytest
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch

from src.models.investment_recommendation import InvestmentRecommendationModel
from src.services.investment_recommendation_service import InvestmentRecommendationService
from src.config.model_config import INVESTMENT_RECOMMENDATION_MODEL
from src.utils.model_utils import preprocess_input, postprocess_output

@pytest.fixture
def sample_model():
    return InvestmentRecommendationModel()

@pytest.fixture
def sample_service():
    with patch('src.services.investment_recommendation_service.load_model') as mock_load_model:
        mock_load_model.return_value = InvestmentRecommendationModel()
        return InvestmentRecommendationService()

def test_investment_recommendation_model_initialization(sample_model):
    assert sample_model.model is not None
    assert sample_model.scaler is not None
    assert sample_model.encoder is not None

def test_investment_recommendation_model_preprocess_data(sample_model):
    sample_data = pd.DataFrame({
        'age': [30, 40, 50],
        'income': [50000, 75000, 100000],
        'risk_tolerance': ['low', 'medium', 'high'],
        'investment_horizon': [5, 10, 15]
    })
    
    features, labels = sample_model.preprocess_data(sample_data)
    
    assert isinstance(features, np.ndarray)
    assert isinstance(labels, np.ndarray)
    assert features.shape[1] == 4  # Assuming 4 features after preprocessing
    assert labels.shape[1] == 1  # Assuming single label column

def test_investment_recommendation_model_train(sample_model):
    sample_data = pd.DataFrame({
        'age': [30, 40, 50],
        'income': [50000, 75000, 100000],
        'risk_tolerance': ['low', 'medium', 'high'],
        'investment_horizon': [5, 10, 15],
        'recommended_portfolio': ['conservative', 'balanced', 'aggressive']
    })
    
    history = sample_model.train(sample_data)
    
    assert 'loss' in history.history
    assert 'accuracy' in history.history

def test_investment_recommendation_model_predict(sample_model):
    sample_user_data = {
        'age': 35,
        'income': 60000,
        'risk_tolerance': 'medium',
        'investment_horizon': 8
    }
    
    with patch.object(sample_model.model, 'predict') as mock_predict:
        mock_predict.return_value = np.array([[0.2, 0.5, 0.3]])
        recommendation = sample_model.predict(sample_user_data)
    
    assert isinstance(recommendation, dict)
    assert 'recommended_portfolio' in recommendation
    assert 'confidence_scores' in recommendation

def test_investment_recommendation_model_save_load(sample_model, tmp_path):
    temp_file = tmp_path / "test_model.h5"
    sample_model.save(temp_file)
    
    loaded_model = InvestmentRecommendationModel()
    loaded_model.load(temp_file)
    
    assert loaded_model.model is not None
    assert loaded_model.scaler is not None
    assert loaded_model.encoder is not None

def test_investment_recommendation_service_initialization(sample_service):
    assert isinstance(sample_service.model, InvestmentRecommendationModel)

def test_investment_recommendation_service_get_recommendation(sample_service):
    sample_user_data = {
        'age': 35,
        'income': 60000,
        'risk_tolerance': 'medium',
        'investment_horizon': 8
    }
    
    with patch.object(sample_service.model, 'predict') as mock_predict:
        mock_predict.return_value = {
            'recommended_portfolio': 'balanced',
            'confidence_scores': {'conservative': 0.2, 'balanced': 0.5, 'aggressive': 0.3}
        }
        recommendation = sample_service.get_recommendation(sample_user_data)
    
    assert isinstance(recommendation, dict)
    assert 'recommended_portfolio' in recommendation
    assert 'confidence_scores' in recommendation

def test_investment_recommendation_service_train_model(sample_service):
    sample_training_data = pd.DataFrame({
        'age': [30, 40, 50],
        'income': [50000, 75000, 100000],
        'risk_tolerance': ['low', 'medium', 'high'],
        'investment_horizon': [5, 10, 15],
        'recommended_portfolio': ['conservative', 'balanced', 'aggressive']
    })
    
    with patch.object(sample_service.model, 'train') as mock_train:
        mock_train.return_value = Mock(history={'loss': [0.5, 0.3], 'accuracy': [0.7, 0.8]})
        training_results = sample_service.train_model(sample_training_data)
    
    assert 'metrics' in training_results
    assert 'model_version' in training_results

def test_investment_recommendation_service_update_model(sample_service):
    with patch('src.services.investment_recommendation_service.load_model') as mock_load_model:
        mock_load_model.return_value = InvestmentRecommendationModel()
        result = sample_service.update_model('path/to/new/model.h5')
    
    assert result is True
    assert isinstance(sample_service.model, InvestmentRecommendationModel)

# TODO: Implement additional test cases to cover edge cases and error handling
# TODO: Add integration tests to verify the interaction between the model and service classes
# TODO: Create test fixtures for common test data and model configurations
# TODO: Implement performance tests to ensure the model meets latency requirements
# TODO: Add tests for input validation and error handling in the InvestmentRecommendationService