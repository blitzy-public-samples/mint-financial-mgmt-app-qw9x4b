import pytest
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow.keras.models import Model

from src.ml.src.models.credit_score_prediction import CreditScorePredictionModel, create_credit_score_prediction_model

# Sample data for testing
SAMPLE_DATA = pd.DataFrame({
    'income': [50000, 75000, 100000, 60000, 80000],
    'age': [25, 35, 45, 30, 40],
    'credit_utilization': [0.3, 0.5, 0.2, 0.4, 0.1],
    'payment_history': [0.9, 0.8, 1.0, 0.7, 0.95],
    'credit_score': [650, 700, 780, 680, 750]
})

@pytest.fixture
def credit_score_model():
    return create_credit_score_prediction_model()

def test_credit_score_prediction_model_initialization(credit_score_model):
    assert credit_score_model is not None
    assert isinstance(credit_score_model, CreditScorePredictionModel)
    assert hasattr(credit_score_model, 'model')
    assert hasattr(credit_score_model, 'scaler')

def test_model_build(credit_score_model):
    model = credit_score_model.build_model()
    assert isinstance(model, Model)
    assert len(model.layers) > 0
    assert model.output_shape == (None, 1)  # Assuming single output for credit score

def test_data_preprocessing(credit_score_model):
    # Prepare a sample DataFrame with various data types and missing values
    sample_data = pd.DataFrame({
        'income': [50000, 75000, np.nan, 60000, 80000],
        'age': [25, 35, 45, 30, 40],
        'credit_utilization': [0.3, 0.5, 0.2, np.nan, 0.1],
        'payment_history': [0.9, 0.8, 1.0, 0.7, 0.95],
    })
    
    preprocessed_data = credit_score_model.preprocess_data(sample_data)
    assert isinstance(preprocessed_data, np.ndarray)
    assert preprocessed_data.shape == (5, 4)  # Assuming 4 features after preprocessing
    assert not np.isnan(preprocessed_data).any()  # No missing values

def test_model_training(credit_score_model):
    X_train = SAMPLE_DATA.drop('credit_score', axis=1)
    y_train = SAMPLE_DATA['credit_score']
    
    history = credit_score_model.train(X_train, y_train, epochs=5, batch_size=2)
    assert history is not None
    assert 'loss' in history.history
    assert len(history.history['loss']) == 5  # 5 epochs

def test_model_prediction(credit_score_model):
    X_test = SAMPLE_DATA.drop('credit_score', axis=1)
    
    credit_score_model.train(X_test, SAMPLE_DATA['credit_score'], epochs=5, batch_size=2)
    predictions = credit_score_model.predict(X_test)
    
    assert isinstance(predictions, np.ndarray)
    assert predictions.shape == (5,)  # 5 samples in test data
    assert np.all((predictions >= 300) & (predictions <= 850))  # Credit score range

def test_model_evaluation(credit_score_model):
    X_test = SAMPLE_DATA.drop('credit_score', axis=1)
    y_test = SAMPLE_DATA['credit_score']
    
    credit_score_model.train(X_test, y_test, epochs=5, batch_size=2)
    metrics = credit_score_model.evaluate(X_test, y_test)
    
    assert isinstance(metrics, dict)
    assert 'mse' in metrics
    assert 'mae' in metrics
    assert 'r2' in metrics
    assert 0 <= metrics['r2'] <= 1  # R2 score should be between 0 and 1

def test_model_save_and_load(credit_score_model, tmp_path):
    X_train = SAMPLE_DATA.drop('credit_score', axis=1)
    y_train = SAMPLE_DATA['credit_score']
    
    credit_score_model.train(X_train, y_train, epochs=5, batch_size=2)
    
    # Save the model
    save_path = tmp_path / "test_model"
    credit_score_model.save_model(save_path)
    
    # Load the model
    loaded_model = create_credit_score_prediction_model()
    loaded_model.load_model(save_path)
    
    # Compare predictions
    original_predictions = credit_score_model.predict(X_train)
    loaded_predictions = loaded_model.predict(X_train)
    
    np.testing.assert_allclose(original_predictions, loaded_predictions, rtol=1e-5)

# Commented list of human tasks
"""
Human tasks:
1. Implement integration tests with real data from the Mint Replica database (Required)
2. Add more edge case tests for various input scenarios (Required)
3. Implement performance benchmarks for the credit score prediction model (Optional)
4. Review and update test cases as the model evolves (Required)
"""