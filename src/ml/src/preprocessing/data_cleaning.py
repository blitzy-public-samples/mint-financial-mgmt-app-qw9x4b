import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from typing import List, Dict, Any
from ..utils import data_loader  # Assuming this module exists and has a load_data function

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """
    Removes duplicate entries from the dataset.

    Args:
        df (pd.DataFrame): Input dataframe.

    Returns:
        pd.DataFrame: Dataframe with duplicates removed.
    """
    # Check for duplicate rows in the dataframe
    duplicates = df.duplicated()
    
    # Remove duplicate rows
    df_cleaned = df.drop_duplicates()
    
    # Reset the index of the dataframe
    df_cleaned = df_cleaned.reset_index(drop=True)
    
    print(f"Removed {sum(duplicates)} duplicate rows.")
    return df_cleaned

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handles missing values in the dataset using appropriate strategies.

    Args:
        df (pd.DataFrame): Input dataframe.

    Returns:
        pd.DataFrame: Dataframe with missing values handled.
    """
    # Identify columns with missing values
    columns_with_missing = df.columns[df.isnull().any()].tolist()
    
    # For numerical columns, impute missing values with median
    numerical_columns = df.select_dtypes(include=[np.number]).columns
    numerical_imputer = SimpleImputer(strategy='median')
    df[numerical_columns] = numerical_imputer.fit_transform(df[numerical_columns])
    
    # For categorical columns, impute missing values with mode
    categorical_columns = df.select_dtypes(include=['object', 'category']).columns
    categorical_imputer = SimpleImputer(strategy='most_frequent')
    df[categorical_columns] = categorical_imputer.fit_transform(df[categorical_columns])
    
    print(f"Handled missing values in {len(columns_with_missing)} columns.")
    return df

def normalize_data_formats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes data formats across different columns (e.g., dates, currency values).

    Args:
        df (pd.DataFrame): Input dataframe.

    Returns:
        pd.DataFrame: Dataframe with normalized data formats.
    """
    # Convert date columns to datetime format
    date_columns = df.select_dtypes(include=['datetime64']).columns
    for col in date_columns:
        df[col] = pd.to_datetime(df[col])
    
    # Normalize currency values to a standard format (assuming they are in string format)
    currency_columns = [col for col in df.columns if 'amount' in col.lower() or 'price' in col.lower()]
    for col in currency_columns:
        df[col] = df[col].replace('[\$,]', '', regex=True).astype(float)
    
    # Ensure consistent capitalization for categorical variables
    categorical_columns = df.select_dtypes(include=['object', 'category']).columns
    for col in categorical_columns:
        df[col] = df[col].str.title()
    
    print(f"Normalized data formats for {len(date_columns)} date columns, {len(currency_columns)} currency columns, and {len(categorical_columns)} categorical columns.")
    return df

def clean_data(data_path: str) -> pd.DataFrame:
    """
    Main function to clean and preprocess the raw financial data.

    Args:
        data_path (str): Path to the raw data file.

    Returns:
        pd.DataFrame: Cleaned and preprocessed dataframe.
    """
    # Load raw data using data_loader
    raw_data = data_loader.load_data(data_path)
    
    # Remove duplicates from the dataset
    df_no_duplicates = remove_duplicates(raw_data)
    
    # Handle missing values in the dataset
    df_no_missing = handle_missing_values(df_no_duplicates)
    
    # Normalize data formats across columns
    df_cleaned = normalize_data_formats(df_no_missing)
    
    print("Data cleaning completed successfully.")
    return df_cleaned

# List of human tasks
"""
Human tasks:
1. Define specific rules for handling missing values in financial data
2. Specify exact date formats and currency standards to be used
3. Determine any domain-specific data cleaning rules for financial transactions
"""