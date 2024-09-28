import pytest
import pandas as pd
import numpy as np
from src.preprocessing.data_cleaning import remove_duplicates, handle_missing_values, normalize_data_formats
from src.preprocessing.feature_engineering import create_time_based_features, encode_categorical_variables, create_transaction_features, normalize_numerical_features
from src.utils.data_loader import load_data_from_csv

TEST_DATA_PATH = '../../data/test_data.csv'

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_remove_duplicates():
    # Create a sample dataframe with duplicates
    input_data = pd.DataFrame({
        'id': [1, 2, 3, 3, 4],
        'value': [10, 20, 30, 30, 40]
    })
    expected_output = pd.DataFrame({
        'id': [1, 2, 3, 4],
        'value': [10, 20, 30, 40]
    })
    
    # Call remove_duplicates function
    result = remove_duplicates(input_data)
    
    # Assert that the output matches the expected result
    pd.testing.assert_frame_equal(result, expected_output)
    
    # Check that the number of rows has decreased
    assert len(result) < len(input_data)

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_handle_missing_values():
    # Create a sample dataframe with missing values
    input_data = pd.DataFrame({
        'numeric': [1, 2, np.nan, 4],
        'categorical': ['A', 'B', np.nan, 'D']
    })
    
    # Call handle_missing_values function
    result = handle_missing_values(input_data)
    
    # Assert that there are no missing values in the output
    assert result.isnull().sum().sum() == 0
    
    # Check that the imputed values are correct for numerical and categorical columns
    assert result['numeric'].mean() == pytest.approx(input_data['numeric'].mean())
    assert set(result['categorical']) == set(['A', 'B', 'D'])

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_normalize_data_formats():
    # Create a sample dataframe with various data formats
    input_data = pd.DataFrame({
        'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
        'amount': ['$100', '$200', '$300'],
        'category': ['Food', 'food', 'FOOD']
    })
    
    # Call normalize_data_formats function
    result = normalize_data_formats(input_data)
    
    # Assert that date columns are in datetime format
    assert pd.api.types.is_datetime64_any_dtype(result['date'])
    
    # Check that currency values are normalized
    assert all(result['amount'].str.startswith('$'))
    assert all(result['amount'].str.replace('$', '').str.isnumeric())
    
    # Verify consistent capitalization for categorical variables
    assert all(result['category'] == result['category'].str.capitalize())

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_create_time_based_features():
    # Create a sample dataframe with transaction dates
    input_data = pd.DataFrame({
        'date': pd.date_range(start='2023-01-01', periods=5)
    })
    
    # Call create_time_based_features function
    result = create_time_based_features(input_data)
    
    # Assert that new time-based features are created
    assert 'day_of_week' in result.columns
    assert 'month' in result.columns
    assert 'is_weekend' in result.columns
    assert 'is_holiday' in result.columns
    
    # Check the correctness of day of week, month, is_weekend, and is_holiday features
    assert all(result['day_of_week'].between(0, 6))
    assert all(result['month'].between(1, 12))
    assert all(result['is_weekend'].isin([True, False]))
    assert all(result['is_holiday'].isin([True, False]))

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_encode_categorical_variables():
    # Create a sample dataframe with categorical variables
    input_data = pd.DataFrame({
        'category': ['A', 'B', 'C', 'A', 'B'],
        'ordinal': ['Low', 'Medium', 'High', 'Low', 'High']
    })
    
    # Call encode_categorical_variables function
    result = encode_categorical_variables(input_data)
    
    # Assert that categorical variables are properly encoded
    assert 'category_A' in result.columns
    assert 'category_B' in result.columns
    assert 'category_C' in result.columns
    assert 'ordinal' in result.columns
    
    # Check for correct one-hot encoding and ordinal encoding
    assert all(result[['category_A', 'category_B', 'category_C']].isin([0, 1]))
    assert all(result['ordinal'].isin([0, 1, 2]))

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_create_transaction_features():
    # Create a sample dataframe with transaction data
    input_data = pd.DataFrame({
        'user_id': [1, 1, 2, 2, 2],
        'amount': [100, 200, 150, 300, 250],
        'date': pd.date_range(start='2023-01-01', periods=5)
    })
    
    # Call create_transaction_features function
    result = create_transaction_features(input_data)
    
    # Assert that new transaction-based features are created
    assert 'avg_transaction_amount' in result.columns
    assert 'transaction_frequency' in result.columns
    assert 'cumulative_amount' in result.columns
    
    # Check for correct calculation of average amount, frequency, and cumulative sum
    assert result.groupby('user_id')['avg_transaction_amount'].nunique() == result['user_id'].nunique()
    assert all(result['transaction_frequency'] > 0)
    assert all(result.groupby('user_id')['cumulative_amount'].diff().dropna() >= 0)

@pytest.mark.parametrize('input_data, expected_output', [
    # Add test cases here
])
def test_normalize_numerical_features():
    # Create a sample dataframe with numerical features
    input_data = pd.DataFrame({
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [10, 20, 30, 40, 50]
    })
    
    # Call normalize_numerical_features function
    result = normalize_numerical_features(input_data)
    
    # Assert that numerical features are normalized
    assert result.shape == input_data.shape
    
    # Check that the mean is close to 0 and standard deviation is close to 1 for normalized features
    assert pytest.approx(result['feature1'].mean(), abs=1e-6) == 0
    assert pytest.approx(result['feature1'].std(), abs=1e-6) == 1
    assert pytest.approx(result['feature2'].mean(), abs=1e-6) == 0
    assert pytest.approx(result['feature2'].std(), abs=1e-6) == 1

def test_data_loader_integration():
    # Load test data using data_loader.load_data_from_csv
    data = load_data_from_csv(TEST_DATA_PATH)
    
    # Apply data cleaning functions
    data = remove_duplicates(data)
    data = handle_missing_values(data)
    data = normalize_data_formats(data)
    
    # Apply feature engineering functions
    data = create_time_based_features(data)
    data = encode_categorical_variables(data)
    data = create_transaction_features(data)
    data = normalize_numerical_features(data)
    
    # Assert that the final preprocessed data has the expected shape and features
    assert isinstance(data, pd.DataFrame)
    assert len(data) > 0
    assert all(col in data.columns for col in ['day_of_week', 'month', 'is_weekend', 'is_holiday', 'avg_transaction_amount', 'transaction_frequency', 'cumulative_amount'])

# Commented list of human tasks
"""
Human tasks:
1. Create comprehensive test datasets covering various edge cases in financial data (Required)
2. Define expected outputs for each test case based on domain knowledge of financial data (Required)
3. Implement additional tests for any custom preprocessing steps specific to the Mint Replica project (Optional)
"""