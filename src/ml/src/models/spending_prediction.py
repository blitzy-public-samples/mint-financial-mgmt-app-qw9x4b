import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# Assuming SPENDING_PREDICTION_MODEL configuration
SPENDING_PREDICTION_MODEL = {
    'input_features': ['historical_spending', 'income', 'month'],
    'hidden_layers': [64, 32],
    'learning_rate': 0.001,
    'batch_size': 32,
    'epochs': 100,
    'validation_split': 0.2,
    'early_stopping_patience': 10
}

def preprocess_data(data: pd.DataFrame) -> tuple:
    """
    Preprocesses the input data for the spending prediction model.

    Args:
        data (pd.DataFrame): Input data containing relevant features.

    Returns:
        tuple: Preprocessed features (X) and target variable (y).
    """
    # Extract relevant features
    features = SPENDING_PREDICTION_MODEL['input_features']
    X = data[features].values
    y = data['target_spending'].values

    # Normalize numerical features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    return X, y

def build_model() -> Sequential:
    """
    Builds and compiles the spending prediction model.

    Returns:
        tensorflow.keras.Model: Compiled Keras model for spending prediction.
    """
    model = Sequential()
    
    # Add input layer
    model.add(Dense(SPENDING_PREDICTION_MODEL['hidden_layers'][0], activation='relu', input_shape=(len(SPENDING_PREDICTION_MODEL['input_features']),)))
    
    # Add hidden layers
    for units in SPENDING_PREDICTION_MODEL['hidden_layers'][1:]:
        model.add(Dense(units, activation='relu'))
    
    # Add output layer
    model.add(Dense(1))  # Single neuron for regression task
    
    # Compile the model
    model.compile(optimizer=Adam(learning_rate=SPENDING_PREDICTION_MODEL['learning_rate']),
                  loss='mean_squared_error')
    
    return model

def train_model(model: Sequential, X_train: np.ndarray, y_train: np.ndarray, X_val: np.ndarray, y_val: np.ndarray) -> Sequential:
    """
    Trains the spending prediction model on the provided data.

    Args:
        model (Sequential): Keras model to be trained.
        X_train (np.ndarray): Training features.
        y_train (np.ndarray): Training target values.
        X_val (np.ndarray): Validation features.
        y_val (np.ndarray): Validation target values.

    Returns:
        Sequential: Trained Keras model.
    """
    # Define callbacks
    early_stopping = EarlyStopping(patience=SPENDING_PREDICTION_MODEL['early_stopping_patience'], restore_best_weights=True)
    model_checkpoint = ModelCheckpoint('best_model.h5', save_best_only=True)

    # Train the model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=SPENDING_PREDICTION_MODEL['epochs'],
        batch_size=SPENDING_PREDICTION_MODEL['batch_size'],
        callbacks=[early_stopping, model_checkpoint],
        verbose=1
    )

    return model

def evaluate_model(model: Sequential, X_test: np.ndarray, y_test: np.ndarray) -> dict:
    """
    Evaluates the trained model on test data.

    Args:
        model (Sequential): Trained Keras model.
        X_test (np.ndarray): Test features.
        y_test (np.ndarray): Test target values.

    Returns:
        dict: Evaluation metrics (MSE, MAE, R-squared).
    """
    # Make predictions
    y_pred = model.predict(X_test)

    # Calculate metrics
    mse = np.mean((y_test - y_pred.flatten()) ** 2)
    mae = np.mean(np.abs(y_test - y_pred.flatten()))
    r_squared = 1 - (np.sum((y_test - y_pred.flatten()) ** 2) / np.sum((y_test - np.mean(y_test)) ** 2))

    return {
        'mse': mse,
        'mae': mae,
        'r_squared': r_squared
    }

def predict_spending(model: Sequential, input_data: np.ndarray) -> np.ndarray:
    """
    Makes spending predictions using the trained model.

    Args:
        model (Sequential): Trained Keras model.
        input_data (np.ndarray): Input data for prediction.

    Returns:
        np.ndarray: Predicted spending amounts.
    """
    return model.predict(input_data).flatten()

class SpendingPredictionModel:
    def __init__(self):
        self.model = None

    def train(self, training_data: pd.DataFrame):
        """
        Trains the spending prediction model.

        Args:
            training_data (pd.DataFrame): Training data containing features and target.
        """
        # Preprocess data
        X, y = preprocess_data(training_data)
        
        # Split data into train and validation sets
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=SPENDING_PREDICTION_MODEL['validation_split'], random_state=42)
        
        # Build model
        self.model = build_model()
        
        # Train model
        self.model = train_model(self.model, X_train, y_train, X_val, y_val)

    def predict(self, input_data: pd.DataFrame) -> np.ndarray:
        """
        Makes spending predictions using the trained model.

        Args:
            input_data (pd.DataFrame): Input data for prediction.

        Returns:
            np.ndarray: Predicted spending amounts.
        """
        if self.model is None:
            raise ValueError("Model has not been trained. Call train() first.")
        
        # Preprocess input data
        X, _ = preprocess_data(input_data)
        
        # Make predictions
        return predict_spending(self.model, X)

    def evaluate(self, test_data: pd.DataFrame) -> dict:
        """
        Evaluates the model on test data.

        Args:
            test_data (pd.DataFrame): Test data containing features and target.

        Returns:
            dict: Evaluation metrics.
        """
        if self.model is None:
            raise ValueError("Model has not been trained. Call train() first.")
        
        # Preprocess test data
        X_test, y_test = preprocess_data(test_data)
        
        # Evaluate model
        return evaluate_model(self.model, X_test, y_test)

    def save_model(self, file_path: str):
        """
        Saves the trained model to disk.

        Args:
            file_path (str): Path to save the model.
        """
        if self.model is None:
            raise ValueError("Model has not been trained. Call train() first.")
        
        self.model.save(file_path)

    def load_model(self, file_path: str):
        """
        Loads a trained model from disk.

        Args:
            file_path (str): Path to the saved model.
        """
        from tensorflow.keras.models import load_model
        self.model = load_model(file_path)

# Pending human tasks:
# TODO: Review and optimize model architecture for spending prediction
# TODO: Validate feature engineering steps and ensure all relevant features are included
# TODO: Implement proper error handling and logging throughout the module
# TODO: Conduct thorough testing of the SpendingPredictionModel class with various datasets
# TODO: Optimize hyperparameters for the spending prediction model
# TODO: Implement data versioning and model versioning
# TODO: Ensure proper handling of edge cases and outliers in the spending data