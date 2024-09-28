import pytest
import numpy as np
import pandas as pd
from src.ml.src.models.transaction_categorization import TransactionCategorizationModel, create_transaction_categorization_model
from tensorflow.keras.models import Sequential

# Sample transaction data for testing
SAMPLE_TRANSACTIONS = pd.DataFrame({
    'amount': [100.0, 50.0, 200.0, 75.0, 300.0],
    'description': ['Grocery store', 'Gas station', 'Restaurant', 'Online shopping', 'Utility bill'],
    'category': ['Groceries', 'Transportation', 'Dining', 'Shopping', 'Bills']
})

@pytest.fixture
def model():
    return TransactionCategorizationModel()

def test_transaction_categorization_model_initialization(model):
    assert isinstance(model, TransactionCategorizationModel)
    assert model.model is None
    assert model.tokenizer is None
    assert model.label_encoder is None

def test_preprocess_data(model):
    X, y = model.preprocess_data(SAMPLE_TRANSACTIONS)
    
    assert isinstance(X, np.ndarray)
    assert isinstance(y, np.ndarray)
    assert X.shape[0] == len(SAMPLE_TRANSACTIONS)
    assert y.shape[0] == len(SAMPLE_TRANSACTIONS)

def test_build_model(model):
    model.build_model(input_dim=100, num_categories=5)
    
    assert isinstance(model.model, Sequential)
    assert len(model.model.layers) > 0

def test_train_model(model):
    X, y = model.preprocess_data(SAMPLE_TRANSACTIONS)
    history = model.train(SAMPLE_TRANSACTIONS, epochs=5, batch_size=2)
    
    assert isinstance(history, dict)
    assert 'accuracy' in history
    assert 'loss' in history

def test_predict(model):
    # Train the model first
    model.train(SAMPLE_TRANSACTIONS, epochs=5, batch_size=2)
    
    # Predict on a subset of the data
    predictions = model.predict(SAMPLE_TRANSACTIONS.iloc[:2])
    
    assert isinstance(predictions, np.ndarray)
    assert predictions.shape[0] == 2

def test_save_and_load_model(model, tmp_path):
    # Train the model
    model.train(SAMPLE_TRANSACTIONS, epochs=5, batch_size=2)
    
    # Save the model
    save_path = tmp_path / "test_model"
    model.save_model(save_path)
    
    # Load the model
    loaded_model = TransactionCategorizationModel()
    loaded_model.load_model(save_path)
    
    # Compare predictions
    original_predictions = model.predict(SAMPLE_TRANSACTIONS)
    loaded_predictions = loaded_model.predict(SAMPLE_TRANSACTIONS)
    
    np.testing.assert_array_almost_equal(original_predictions, loaded_predictions)

def test_create_transaction_categorization_model():
    model = create_transaction_categorization_model()
    assert isinstance(model, TransactionCategorizationModel)

# Additional test cases for edge cases and error handling

def test_empty_dataframe():
    model = TransactionCategorizationModel()
    with pytest.raises(ValueError):
        model.train(pd.DataFrame())

def test_invalid_column_names():
    model = TransactionCategorizationModel()
    invalid_df = pd.DataFrame({
        'invalid_column': [1, 2, 3],
        'category': ['A', 'B', 'C']
    })
    with pytest.raises(KeyError):
        model.train(invalid_df)

def test_non_string_descriptions():
    model = TransactionCategorizationModel()
    invalid_df = pd.DataFrame({
        'amount': [100, 200, 300],
        'description': [1, 2, 3],  # Non-string descriptions
        'category': ['A', 'B', 'C']
    })
    with pytest.raises(ValueError):
        model.train(invalid_df)

# Integration test with actual transaction data
def test_integration_with_actual_data(model):
    # This test should be implemented when actual transaction data is available
    # It should test the model's performance on a larger, more diverse dataset
    pass

# Performance benchmark
def test_prediction_performance(model, benchmark):
    # Train the model with sample data
    model.train(SAMPLE_TRANSACTIONS, epochs=5, batch_size=2)
    
    # Benchmark the prediction function
    def predict_transactions():
        model.predict(SAMPLE_TRANSACTIONS)
    
    benchmark(predict_transactions)

# TODO: Implement tests for model explainability features once implemented