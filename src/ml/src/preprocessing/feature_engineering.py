import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from typing import List

def create_time_based_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Creates time-based features from transaction dates.

    Args:
        df (pd.DataFrame): Input dataframe with transaction data.

    Returns:
        pd.DataFrame: Dataframe with additional time-based features.
    """
    # Extract day of week from transaction date
    df['day_of_week'] = pd.to_datetime(df['transaction_date']).dt.dayofweek

    # Extract month from transaction date
    df['month'] = pd.to_datetime(df['transaction_date']).dt.month

    # Create is_weekend feature
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

    # Create is_holiday feature (requires holiday calendar)
    # TODO: Implement holiday calendar logic
    df['is_holiday'] = 0  # Placeholder, replace with actual holiday logic

    return df

def encode_categorical_variables(df: pd.DataFrame) -> pd.DataFrame:
    """
    Encodes categorical variables using appropriate encoding techniques.

    Args:
        df (pd.DataFrame): Input dataframe with categorical variables.

    Returns:
        pd.DataFrame: Dataframe with encoded categorical variables.
    """
    # Identify categorical columns
    categorical_columns = df.select_dtypes(include=['object', 'category']).columns

    # Apply one-hot encoding for nominal categorical variables
    nominal_columns = ['category', 'merchant']  # Add more nominal columns as needed
    onehot_encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
    onehot_encoded = onehot_encoder.fit_transform(df[nominal_columns])
    onehot_columns = [f"{col}_{val}" for col, vals in zip(nominal_columns, onehot_encoder.categories_) for val in vals]
    df_onehot = pd.DataFrame(onehot_encoded, columns=onehot_columns, index=df.index)

    # Apply ordinal encoding for ordinal categorical variables
    ordinal_columns = ['transaction_type']  # Add more ordinal columns as needed
    ordinal_encoder = OrdinalEncoder()
    df[ordinal_columns] = ordinal_encoder.fit_transform(df[ordinal_columns])

    # Combine encoded features with original dataframe
    df = pd.concat([df.drop(columns=nominal_columns), df_onehot], axis=1)

    return df

def create_transaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Creates features based on transaction data.

    Args:
        df (pd.DataFrame): Input dataframe with transaction data.

    Returns:
        pd.DataFrame: Dataframe with additional transaction-based features.
    """
    # Calculate average transaction amount per category
    df['avg_amount_per_category'] = df.groupby('category')['amount'].transform('mean')

    # Calculate transaction frequency per category
    df['transaction_frequency'] = df.groupby('category')['transaction_id'].transform('count')

    # Create binary flags for high-value transactions
    # TODO: Determine the threshold for high-value transactions
    high_value_threshold = df['amount'].quantile(0.95)  # Placeholder, adjust as needed
    df['is_high_value'] = (df['amount'] > high_value_threshold).astype(int)

    # Calculate cumulative sum of transactions
    df['cumulative_sum'] = df.groupby('account_id')['amount'].cumsum()

    return df

def normalize_numerical_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes numerical features to a standard scale.

    Args:
        df (pd.DataFrame): Input dataframe with numerical features.

    Returns:
        pd.DataFrame: Dataframe with normalized numerical features.
    """
    # Identify numerical columns
    numerical_columns = df.select_dtypes(include=['int64', 'float64']).columns

    # Apply StandardScaler to numerical features
    scaler = StandardScaler()
    df[numerical_columns] = scaler.fit_transform(df[numerical_columns])

    return df

def create_interaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Creates interaction features between relevant variables.

    Args:
        df (pd.DataFrame): Input dataframe with relevant features.

    Returns:
        pd.DataFrame: Dataframe with additional interaction features.
    """
    # Identify relevant features for interactions
    # TODO: Define specific interaction features that are relevant for financial analysis
    relevant_features = ['amount', 'transaction_frequency', 'avg_amount_per_category']

    # Create pairwise interaction features
    for i, feat1 in enumerate(relevant_features):
        for feat2 in relevant_features[i+1:]:
            df[f'{feat1}_{feat2}_interaction'] = df[feat1] * df[feat2]

    return df

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Main function to perform feature engineering on the cleaned financial data.

    Args:
        df (pd.DataFrame): Input dataframe with cleaned financial data.

    Returns:
        pd.DataFrame: Dataframe with engineered features.
    """
    # Create time-based features
    df = create_time_based_features(df)

    # Encode categorical variables
    df = encode_categorical_variables(df)

    # Create transaction-based features
    df = create_transaction_features(df)

    # Normalize numerical features
    df = normalize_numerical_features(df)

    # Create interaction features
    df = create_interaction_features(df)

    return df

# List of human tasks
"""
Human tasks:
1. Define specific interaction features that are relevant for financial analysis (Required)
2. Determine the threshold for high-value transactions (Required)
3. Provide a holiday calendar for accurate is_holiday feature creation (Required)
4. Specify any domain-specific feature engineering techniques for financial data (Optional)
"""