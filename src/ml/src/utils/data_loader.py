import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from typing import Tuple

# Assuming the config file will be created later
from ..config import DATABASE_URL

def load_data_from_csv(file_path: str) -> pd.DataFrame:
    """
    Loads financial data from a CSV file.

    Args:
        file_path (str): The path to the CSV file.

    Returns:
        pd.DataFrame: Dataframe containing the loaded financial data.
    """
    try:
        df = pd.read_csv(file_path)
        
        # Perform basic data validation checks
        if df.empty:
            raise ValueError("The CSV file is empty.")
        
        # Check for required columns (this list should be updated based on specific requirements)
        required_columns = ['date', 'amount', 'category']
        missing_columns = set(required_columns) - set(df.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Additional data validation can be added here
        
        return df
    except Exception as e:
        raise IOError(f"Error loading data from CSV: {str(e)}")

def load_data_from_database(query: str) -> pd.DataFrame:
    """
    Loads financial data from the configured database.

    Args:
        query (str): SQL query to fetch the data.

    Returns:
        pd.DataFrame: Dataframe containing the queried financial data.
    """
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            df = pd.read_sql(query, connection)
        
        if df.empty:
            raise ValueError("The query returned no data.")
        
        return df
    except Exception as e:
        raise IOError(f"Error loading data from database: {str(e)}")

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Performs initial preprocessing on the loaded financial data.

    Args:
        df (pd.DataFrame): The input dataframe.

    Returns:
        pd.DataFrame: Preprocessed dataframe.
    """
    # Convert date columns to datetime format
    date_columns = df.select_dtypes(include=['object']).columns[df.select_dtypes(include=['object']).apply(lambda x: pd.to_datetime(x, errors='coerce').notnull().all())]
    for col in date_columns:
        df[col] = pd.to_datetime(df[col])
    
    # Handle missing values (this strategy should be adjusted based on specific requirements)
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
    
    categorical_columns = df.select_dtypes(include=['object']).columns
    df[categorical_columns] = df[categorical_columns].fillna(df[categorical_columns].mode().iloc[0])
    
    # Perform basic data type conversions if necessary
    # Add any specific type conversions here
    
    return df

def split_data(df: pd.DataFrame, target_column: str, test_size: float = 0.2) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Splits the data into training and testing sets.

    Args:
        df (pd.DataFrame): The input dataframe.
        target_column (str): The name of the target variable column.
        test_size (float): The proportion of the dataset to include in the test split.

    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    from sklearn.model_selection import train_test_split
    
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
    
    return X_train, X_test, y_train, y_test

def load_and_prepare_data(data_source: str, target_column: str) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Main function to load, preprocess, and prepare data for model training.

    Args:
        data_source (str): Path to CSV file or SQL query for database.
        target_column (str): The name of the target variable column.

    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    # Determine the data source (CSV or database)
    if data_source.endswith('.csv'):
        df = load_data_from_csv(data_source)
    else:
        df = load_data_from_database(data_source)
    
    # Preprocess the loaded data
    df = preprocess_data(df)
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = split_data(df, target_column)
    
    return X_train, X_test, y_train, y_test

# Pending human tasks:
# TODO: Define specific data validation checks for financial data integrity
# TODO: Specify the exact structure and column names expected in the input data
# TODO: Determine the appropriate test_size for data splitting based on the available data volume
# TODO: Implement proper error handling and logging for data loading and preprocessing steps