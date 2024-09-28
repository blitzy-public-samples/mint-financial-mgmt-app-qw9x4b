import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam

# Assuming CREDIT_SCORE_PREDICTION_MODEL is imported from a config file
# If it's not available, we'll use default values
try:
    from src.ml.src.config.model_config import CREDIT_SCORE_PREDICTION_MODEL
except ImportError:
    CREDIT_SCORE_PREDICTION_MODEL = {
        'input_dim': 10,
        'hidden_layers': [64, 32],
        'learning_rate': 0.001
    }

class CreditScorePredictionModel:
    """
    A class that encapsulates the credit score prediction model
    """

    def __init__(self):
        """
        Initializes the CreditScorePredictionModel
        """
        self.model = self.build_model()
        self.scaler = StandardScaler()

    def build_model(self):
        """
        Builds the neural network model for credit score prediction
        """
        model = Sequential()
        
        # Add input layer
        model.add(Dense(CREDIT_SCORE_PREDICTION_MODEL['hidden_layers'][0], 
                        input_dim=CREDIT_SCORE_PREDICTION_MODEL['input_dim'], 
                        activation='relu'))
        
        # Add hidden layers
        for units in CREDIT_SCORE_PREDICTION_MODEL['hidden_layers'][1:]:
            model.add(Dense(units, activation='relu'))
        
        # Add output layer
        model.add(Dense(1))
        
        # Compile the model
        model.compile(optimizer=Adam(learning_rate=CREDIT_SCORE_PREDICTION_MODEL['learning_rate']),
                      loss='mean_squared_error')
        
        return model

    def preprocess_data(self, data: pd.DataFrame) -> np.ndarray:
        """
        Preprocesses the input data for the model
        """
        # Handle missing values
        data = data.fillna(data.mean())
        
        # Encode categorical variables if present
        # This is a placeholder - adjust based on your actual data
        data = pd.get_dummies(data)
        
        # Scale numerical features
        return self.scaler.fit_transform(data)

    def train(self, X_train: pd.DataFrame, y_train: pd.Series):
        """
        Trains the credit score prediction model
        """
        # Preprocess the training data
        X_train_preprocessed = self.preprocess_data(X_train)
        
        # Train the model
        history = self.model.fit(X_train_preprocessed, y_train, 
                                 epochs=100, batch_size=32, 
                                 validation_split=0.2, verbose=1)
        
        return history

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predicts credit scores using the trained model
        """
        # Preprocess the input data
        X_preprocessed = self.preprocess_data(X)
        
        # Make predictions
        return self.model.predict(X_preprocessed).flatten()

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> dict:
        """
        Evaluates the model's performance on a test set
        """
        # Preprocess the test data
        X_test_preprocessed = self.preprocess_data(X_test)
        
        # Evaluate the model
        mse = self.model.evaluate(X_test_preprocessed, y_test, verbose=0)
        y_pred = self.predict(X_test)
        
        # Calculate additional metrics
        mae = np.mean(np.abs(y_test - y_pred))
        r_squared = 1 - (np.sum((y_test - y_pred)**2) / np.sum((y_test - np.mean(y_test))**2))
        
        return {
            'mse': mse,
            'mae': mae,
            'r_squared': r_squared
        }

    def save_model(self, file_path: str):
        """
        Saves the trained model to a file
        """
        self.model.save(file_path)
        np.save(f"{file_path}_scaler.npy", self.scaler.get_params())

    def load_model(self, file_path: str):
        """
        Loads a trained model from a file
        """
        self.model = tf.keras.models.load_model(file_path)
        scaler_params = np.load(f"{file_path}_scaler.npy", allow_pickle=True).item()
        self.scaler.set_params(**scaler_params)

def create_credit_score_prediction_model() -> CreditScorePredictionModel:
    """
    Factory function to create and return a CreditScorePredictionModel instance
    """
    return CreditScorePredictionModel()

# Human tasks:
# TODO: Review and validate the model architecture with the data science team
# TODO: Ensure the preprocessing steps are appropriate for the credit score prediction task
# TODO: Implement proper error handling and logging throughout the module
# TODO: Conduct thorough testing of the model with real-world data
# TODO: Optimize model hyperparameters for better performance
# TODO: Implement model versioning and tracking