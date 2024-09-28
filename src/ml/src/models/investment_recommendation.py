import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from typing import Dict, Tuple

# Assuming INVESTMENT_RECOMMENDATION_MODEL configuration
INVESTMENT_RECOMMENDATION_MODEL = {
    'input_features': ['age', 'income', 'risk_tolerance', 'investment_horizon'],
    'categorical_features': ['risk_tolerance'],
    'numerical_features': ['age', 'income', 'investment_horizon'],
    'output_classes': 5,  # Assuming 5 investment allocation categories
    'hidden_layers': [64, 32],
    'dropout_rate': 0.2,
    'learning_rate': 0.001,
    'batch_size': 32,
    'epochs': 100
}

class InvestmentRecommendationModel:
    """
    A class that encapsulates the investment recommendation model, including data preprocessing,
    model architecture, training, and prediction functions.
    """

    def __init__(self):
        """
        Initializes the InvestmentRecommendationModel with the configuration from INVESTMENT_RECOMMENDATION_MODEL.
        """
        self.model = self._create_model_architecture()
        self.scaler = StandardScaler()
        self.encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')

    def _create_model_architecture(self) -> tf.keras.Model:
        """
        Creates the neural network architecture for the investment recommendation model.

        Returns:
            tf.keras.Model: Compiled model
        """
        input_dim = len(INVESTMENT_RECOMMENDATION_MODEL['numerical_features']) + \
                    len(INVESTMENT_RECOMMENDATION_MODEL['categorical_features'])
        
        model = tf.keras.Sequential()
        model.add(tf.keras.layers.Input(shape=(input_dim,)))
        
        for units in INVESTMENT_RECOMMENDATION_MODEL['hidden_layers']:
            model.add(tf.keras.layers.Dense(units, activation='relu'))
            model.add(tf.keras.layers.Dropout(INVESTMENT_RECOMMENDATION_MODEL['dropout_rate']))
        
        model.add(tf.keras.layers.Dense(INVESTMENT_RECOMMENDATION_MODEL['output_classes'], activation='softmax'))
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=INVESTMENT_RECOMMENDATION_MODEL['learning_rate']),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model

    def preprocess_data(self, data: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocesses the input data for the model.

        Args:
            data (pd.DataFrame): Input data containing features and labels

        Returns:
            Tuple[np.ndarray, np.ndarray]: Preprocessed features and labels
        """
        # Separate features and labels
        features = data[INVESTMENT_RECOMMENDATION_MODEL['input_features']]
        labels = data['investment_allocation']  # Assuming this column exists in the data

        # Scale numerical features
        numerical_features = features[INVESTMENT_RECOMMENDATION_MODEL['numerical_features']]
        scaled_numerical = self.scaler.fit_transform(numerical_features)

        # Encode categorical features
        categorical_features = features[INVESTMENT_RECOMMENDATION_MODEL['categorical_features']]
        encoded_categorical = self.encoder.fit_transform(categorical_features)

        # Combine preprocessed features
        preprocessed_features = np.hstack((scaled_numerical, encoded_categorical))

        # One-hot encode labels
        encoded_labels = tf.keras.utils.to_categorical(labels, num_classes=INVESTMENT_RECOMMENDATION_MODEL['output_classes'])

        return preprocessed_features, encoded_labels

    def train(self, training_data: pd.DataFrame) -> tf.keras.callbacks.History:
        """
        Trains the investment recommendation model on the given data.

        Args:
            training_data (pd.DataFrame): Training data containing features and labels

        Returns:
            tf.keras.callbacks.History: Training history
        """
        # Preprocess the training data
        X_train, y_train = self.preprocess_data(training_data)

        # Train the model
        history = self.model.fit(
            X_train, y_train,
            batch_size=INVESTMENT_RECOMMENDATION_MODEL['batch_size'],
            epochs=INVESTMENT_RECOMMENDATION_MODEL['epochs'],
            validation_split=0.2,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
                tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
            ]
        )

        return history

    def predict(self, user_data: Dict) -> Dict:
        """
        Generates investment recommendations based on user input.

        Args:
            user_data (Dict): User input data

        Returns:
            Dict: Recommended investment allocation
        """
        # Preprocess user input
        user_df = pd.DataFrame([user_data])
        X_user, _ = self.preprocess_data(user_df)

        # Make prediction
        prediction = self.model.predict(X_user)

        # Post-process the model output
        allocation_categories = ['Conservative', 'Moderately Conservative', 'Balanced', 'Moderately Aggressive', 'Aggressive']
        recommended_allocation = dict(zip(allocation_categories, prediction[0]))

        return recommended_allocation

    def save_model(self, file_path: str) -> None:
        """
        Saves the trained model to disk.

        Args:
            file_path (str): Path to save the model
        """
        self.model.save(file_path)
        np.save(f"{file_path}_scaler.npy", self.scaler.get_params())
        np.save(f"{file_path}_encoder.npy", self.encoder.get_params())

    def load_model(self, file_path: str) -> None:
        """
        Loads a previously saved model from disk.

        Args:
            file_path (str): Path to load the model from
        """
        self.model = tf.keras.models.load_model(file_path)
        self.scaler = StandardScaler()
        self.scaler.set_params(**np.load(f"{file_path}_scaler.npy", allow_pickle=True).item())
        self.encoder = OneHotEncoder()
        self.encoder.set_params(**np.load(f"{file_path}_encoder.npy", allow_pickle=True).item())

# Pending human tasks:
# TODO: Review and validate the model architecture with the data science team
# TODO: Implement data validation and error handling for user inputs
# TODO: Develop a comprehensive test suite for the InvestmentRecommendationModel class
# TODO: Optimize model hyperparameters based on performance metrics
# TODO: Implement model explainability techniques for transparency in recommendations