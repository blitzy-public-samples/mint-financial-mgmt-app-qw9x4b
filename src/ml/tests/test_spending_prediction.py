import pytest
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

# Import the required functions and classes
# Note: These imports might need to be adjusted based on the actual implementation
from src.models.spending_prediction import SpendingPredictionModel
from src.preprocessing.data_cleaning import clean_data
from src.preprocessing.feature_engineering import engineer_features
from src.utils.data_loader import load_and_prepare_data
from src.utils.model_utils import evaluate_model

# Define the path for test data
TEST_DATA_PATH = '../data/test_spending_data.csv'

@pytest.mark.preprocessing
def test_data_cleaning():
    # Load test data
    data = load_and_prepare_data(TEST_DATA_PATH)
    
    # Apply data cleaning
    cleaned_data = clean_data(data)
    
    # Assert that there are no missing values in the cleaned data
    assert cleaned_data.isnull().sum().sum() == 0
    
    # Assert that there are no duplicate rows in the cleaned data
    assert cleaned_data.duplicated().sum() == 0
    
    # Assert that date columns are in the correct datetime format
    date_columns = [col for col in cleaned_data.columns if 'date' in col.lower()]
    for col in date_columns:
        assert pd.api.types.is_datetime64_any_dtype(cleaned_data[col])
    
    # Assert that numerical columns have the correct data type
    numerical_columns = cleaned_data.select_dtypes(include=[np.number]).columns
    for col in numerical_columns:
        assert pd.api.types.is_numeric_dtype(cleaned_data[col])

@pytest.mark.preprocessing
def test_feature_engineering():
    # Load and clean test data
    data = load_and_prepare_data(TEST_DATA_PATH)
    cleaned_data = clean_data(data)
    
    # Apply feature engineering
    engineered_data = engineer_features(cleaned_data)
    
    # Assert that new time-based features are created
    assert 'day_of_week' in engineered_data.columns
    assert 'is_weekend' in engineered_data.columns
    
    # Assert that categorical variables are properly encoded
    categorical_columns = engineered_data.select_dtypes(include=['object']).columns
    for col in categorical_columns:
        assert pd.api.types.is_categorical_dtype(engineered_data[col])
    
    # Assert that numerical features are normalized
    numerical_columns = engineered_data.select_dtypes(include=[np.number]).columns
    for col in numerical_columns:
        assert engineered_data[col].min() >= 0 and engineered_data[col].max() <= 1
    
    # Assert that transaction-based features are created
    assert 'transaction_frequency' in engineered_data.columns
    assert 'average_transaction_amount' in engineered_data.columns
    
    # Assert that interaction features are present
    assert any('_x_' in col for col in engineered_data.columns)

@pytest.mark.model
def test_model_building():
    model = SpendingPredictionModel()
    model.build_model()
    
    # Assert that the model is an instance of tensorflow.keras.Model
    assert isinstance(model.model, tf.keras.Model)
    
    # Assert that the model has the correct number of layers
    assert len(model.model.layers) > 0
    
    # Assert that the model input shape matches the expected feature dimensions
    assert model.model.input_shape[1:] == (model.input_dim,)
    
    # Assert that the model output shape is correct for spending prediction (single value)
    assert model.model.output_shape == (None, 1)

@pytest.mark.model
def test_model_training():
    # Load, clean, and engineer features for test data
    data = load_and_prepare_data(TEST_DATA_PATH)
    cleaned_data = clean_data(data)
    engineered_data = engineer_features(cleaned_data)
    
    # Split data into features and target
    X = engineered_data.drop('target_spending', axis=1)
    y = engineered_data['target_spending']
    
    # Split data into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create an instance of SpendingPredictionModel
    model = SpendingPredictionModel()
    model.build_model()
    
    # Train the model
    history = model.train(X_train, y_train, X_val, y_val)
    
    # Assert that the model's weights have been updated
    assert all(np.any(w != 0) for w in model.model.get_weights())
    
    # Assert that the training history contains expected metrics
    assert 'loss' in history.history
    assert 'val_loss' in history.history

@pytest.mark.model
def test_model_evaluation():
    # Load, clean, and engineer features for test data
    data = load_and_prepare_data(TEST_DATA_PATH)
    cleaned_data = clean_data(data)
    engineered_data = engineer_features(cleaned_data)
    
    # Split data into features and target
    X = engineered_data.drop('target_spending', axis=1)
    y = engineered_data['target_spending']
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create and train an instance of SpendingPredictionModel
    model = SpendingPredictionModel()
    model.build_model()
    model.train(X_train, y_train)
    
    # Evaluate the model
    mse, mae, r_squared = evaluate_model(model, X_test, y_test)
    
    # Assert that the evaluation metrics are within acceptable ranges
    assert 0 <= mse <= 1000000  # Adjust based on your data's scale
    assert 0 <= mae <= 1000  # Adjust based on your data's scale
    assert 0 <= r_squared <= 1
    
    # Compare model performance against a baseline (mean prediction)
    baseline_mse = np.mean((y_test - y_test.mean())**2)
    assert mse < baseline_mse

@pytest.mark.prediction
def test_spending_prediction():
    # Load, clean, and engineer features for test data
    data = load_and_prepare_data(TEST_DATA_PATH)
    cleaned_data = clean_data(data)
    engineered_data = engineer_features(cleaned_data)
    
    # Split data into features and target
    X = engineered_data.drop('target_spending', axis=1)
    y = engineered_data['target_spending']
    
    # Create, train, and evaluate an instance of SpendingPredictionModel
    model = SpendingPredictionModel()
    model.build_model()
    model.train(X, y)
    
    # Prepare a sample input for prediction
    sample_input = X.iloc[0:1]
    
    # Make a prediction
    prediction = model.predict(sample_input)
    
    # Assert that the prediction output has the correct shape
    assert prediction.shape == (1, 1)
    
    # Assert that the predicted values are within a reasonable range for spending
    assert 0 <= prediction[0, 0] <= 10000  # Adjust based on your data's scale
    
    # Test prediction with various input scenarios
    high_income_input = sample_input.copy()
    high_income_input['income'] = high_income_input['income'].max()
    high_income_prediction = model.predict(high_income_input)
    
    low_income_input = sample_input.copy()
    low_income_input['income'] = low_income_input['income'].min()
    low_income_prediction = model.predict(low_income_input)
    
    # Assert that higher income leads to higher predicted spending
    assert high_income_prediction[0, 0] > low_income_prediction[0, 0]

@pytest.mark.model
def test_model_persistence():
    # Create and train a SpendingPredictionModel instance
    model = SpendingPredictionModel()
    model.build_model()
    
    # Dummy data for training
    X = np.random.rand(100, model.input_dim)
    y = np.random.rand(100, 1)
    model.train(X, y)
    
    # Save the model
    save_path = 'test_model.h5'
    model.save_model(save_path)
    
    # Assert that the model file is created
    assert os.path.exists(save_path)
    
    # Load the model
    loaded_model = SpendingPredictionModel()
    loaded_model.load_model(save_path)
    
    # Assert that the loaded model has the same architecture as the original
    assert len(model.model.layers) == len(loaded_model.model.layers)
    
    # Make predictions with both original and loaded models
    original_predictions = model.predict(X)
    loaded_predictions = loaded_model.predict(X)
    
    # Assert that the predictions are identical
    np.testing.assert_array_almost_equal(original_predictions, loaded_predictions)
    
    # Clean up
    os.remove(save_path)

# Commented list of human tasks
"""
Human tasks:
1. Create a comprehensive test dataset that covers various spending scenarios (Critical)
2. Define acceptable ranges for evaluation metrics (MSE, MAE, R-squared) for the spending prediction model (Required)
3. Implement integration tests that cover the entire spending prediction pipeline (Required)
4. Create test cases for edge cases and potential outliers in spending data (Required)
5. Develop performance benchmarks for the spending prediction model (Optional)
"""