import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import Tokenizer
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout

class TransactionCategorizationModel:
    """
    A class that encapsulates the transaction categorization model, including
    data preprocessing, model training, and prediction functionality.
    """

    def __init__(self):
        """
        Initializes the TransactionCategorizationModel with configuration.
        """
        self.model = None
        self.tokenizer = Tokenizer()
        self.label_encoder = LabelEncoder()
        self.max_sequence_length = 100
        self.embedding_dim = 100
        self.lstm_units = 64
        self.num_classes = None

    def preprocess_data(self, data: pd.DataFrame):
        """
        Preprocesses the input data for training or prediction.

        Args:
            data (pd.DataFrame): Input data containing transaction information.

        Returns:
            tuple: Preprocessed features and labels (if available).
        """
        # Tokenize transaction descriptions
        self.tokenizer.fit_on_texts(data['description'])
        X_text = self.tokenizer.texts_to_sequences(data['description'])
        X_text = tf.keras.preprocessing.sequence.pad_sequences(X_text, maxlen=self.max_sequence_length)

        # Normalize transaction amounts
        X_amount = data['amount'].values.reshape(-1, 1)
        X_amount = (X_amount - X_amount.mean()) / X_amount.std()

        # Convert dates to numerical features
        X_date = pd.to_datetime(data['date']).astype(int) // 10**9
        X_date = X_date.values.reshape(-1, 1)
        X_date = (X_date - X_date.mean()) / X_date.std()

        # Combine features
        X = [X_text, X_amount, X_date]

        # Encode transaction categories if available
        y = None
        if 'category' in data.columns:
            y = self.label_encoder.fit_transform(data['category'])
            self.num_classes = len(self.label_encoder.classes_)

        return X, y

    def build_model(self):
        """
        Builds the neural network model architecture.

        Returns:
            tensorflow.keras.Model: Compiled Keras model.
        """
        text_input = tf.keras.Input(shape=(self.max_sequence_length,), name='text_input')
        amount_input = tf.keras.Input(shape=(1,), name='amount_input')
        date_input = tf.keras.Input(shape=(1,), name='date_input')

        # Text processing branch
        embedding = Embedding(input_dim=len(self.tokenizer.word_index) + 1,
                              output_dim=self.embedding_dim,
                              input_length=self.max_sequence_length)(text_input)
        lstm = LSTM(self.lstm_units)(embedding)

        # Concatenate all inputs
        concat = tf.keras.layers.concatenate([lstm, amount_input, date_input])

        # Dense layers
        dense1 = Dense(64, activation='relu')(concat)
        dropout1 = Dropout(0.3)(dense1)
        dense2 = Dense(32, activation='relu')(dropout1)
        dropout2 = Dropout(0.3)(dense2)
        output = Dense(self.num_classes, activation='softmax')(dropout2)

        model = tf.keras.Model(inputs=[text_input, amount_input, date_input], outputs=output)
        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

        self.model = model
        return model

    def train(self, training_data: pd.DataFrame):
        """
        Trains the transaction categorization model on the provided data.

        Args:
            training_data (pd.DataFrame): Training data containing transaction information.

        Returns:
            dict: Training history.
        """
        X, y = self.preprocess_data(training_data)
        if self.model is None:
            self.build_model()

        history = self.model.fit(
            X, y,
            epochs=10,
            batch_size=32,
            validation_split=0.2,
            verbose=1
        )
        return history.history

    def predict(self, transactions: pd.DataFrame):
        """
        Predicts categories for new transactions.

        Args:
            transactions (pd.DataFrame): New transactions to categorize.

        Returns:
            numpy.ndarray: Predicted categories.
        """
        X, _ = self.preprocess_data(transactions)
        predictions = self.model.predict(X)
        return self.label_encoder.inverse_transform(np.argmax(predictions, axis=1))

    def save_model(self, file_path: str):
        """
        Saves the trained model to disk.

        Args:
            file_path (str): Path to save the model.
        """
        self.model.save(file_path)
        np.save(f"{file_path}_tokenizer.npy", self.tokenizer.to_json())
        np.save(f"{file_path}_label_encoder.npy", self.label_encoder.classes_)

    def load_model(self, file_path: str):
        """
        Loads a trained model from disk.

        Args:
            file_path (str): Path to load the model from.
        """
        self.model = tf.keras.models.load_model(file_path)
        self.tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(np.load(f"{file_path}_tokenizer.npy", allow_pickle=True).item())
        self.label_encoder.classes_ = np.load(f"{file_path}_label_encoder.npy", allow_pickle=True)
        self.num_classes = len(self.label_encoder.classes_)

def create_transaction_categorization_model():
    """
    Factory function to create and return a TransactionCategorizationModel instance.

    Returns:
        TransactionCategorizationModel: An instance of the TransactionCategorizationModel.
    """
    return TransactionCategorizationModel()

# Human tasks:
# TODO: Review and optimize the model architecture for better performance
# TODO: Implement data augmentation techniques to improve model generalization
# TODO: Conduct thorough testing with various transaction datasets
# TODO: Implement model explainability techniques for better understanding of predictions
# TODO: Optimize model for production deployment, including potential quantization or pruning