import os
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
import tensorflow as tf
import joblib
import pandas as pd

# Assuming these imports will be available when the dependent files are created
from ..config import model_config
from . import data_loader

def save_model(model, model_name, version):
    """
    Saves a trained model to disk.

    Args:
        model (object): The trained model to be saved.
        model_name (str): Name of the model.
        version (str): Version of the model.

    Returns:
        str: Path to the saved model.
    """
    # Create a directory for the model if it doesn't exist
    model_dir = os.path.join('models', model_name, version)
    os.makedirs(model_dir, exist_ok=True)

    # Generate a filename based on the model name and version
    filename = f"{model_name}_v{version}.joblib"
    file_path = os.path.join(model_dir, filename)

    # Save the model using the appropriate method
    if isinstance(model, tf.keras.Model):
        model.save(file_path)
    else:
        joblib.dump(model, file_path)

    return file_path

def load_model(model_name, version):
    """
    Loads a trained model from disk.

    Args:
        model_name (str): Name of the model to load.
        version (str): Version of the model to load.

    Returns:
        object: Loaded model.
    """
    # Construct the path to the model file
    model_dir = os.path.join('models', model_name, version)
    filename = f"{model_name}_v{version}.joblib"
    file_path = os.path.join(model_dir, filename)

    # Load the model using the appropriate method
    if file_path.endswith('.h5'):
        model = tf.keras.models.load_model(file_path)
    else:
        model = joblib.load(file_path)

    return model

def evaluate_model(model, X_test, y_test, model_type):
    """
    Evaluates a model's performance on a given dataset.

    Args:
        model (object): The model to evaluate.
        X_test (numpy.ndarray): Test features.
        y_test (numpy.ndarray): True labels or values.
        model_type (str): Type of the model (e.g., 'classification', 'regression').

    Returns:
        dict: Dictionary containing evaluation metrics.
    """
    # Make predictions using the model on X_test
    y_pred = model.predict(X_test)

    # Calculate appropriate metrics based on the model_type
    metrics = {}
    if model_type == 'classification':
        metrics['accuracy'] = accuracy_score(y_test, y_pred)
        metrics['f1_score'] = f1_score(y_test, y_pred, average='weighted')
    elif model_type == 'regression':
        metrics['mse'] = mean_squared_error(y_test, y_pred)
        metrics['rmse'] = np.sqrt(metrics['mse'])

    return metrics

def preprocess_input(input_data, model_name):
    """
    Preprocesses input data for a specific model.

    Args:
        input_data (pandas.DataFrame): Input data to preprocess.
        model_name (str): Name of the model for which to preprocess the data.

    Returns:
        numpy.ndarray: Preprocessed input data.
    """
    # Load the model configuration based on the model_name
    model_config_data = model_config.get_model_config(model_name)

    # Extract required features from input_data based on the model's input_features
    required_features = model_config_data['input_features']
    preprocessed_data = input_data[required_features]

    # Perform any necessary scaling or encoding
    # This is a placeholder and should be replaced with actual preprocessing steps
    # based on the specific requirements of each model
    preprocessed_data = (preprocessed_data - preprocessed_data.mean()) / preprocessed_data.std()

    return preprocessed_data.values

def postprocess_output(model_output, model_name):
    """
    Postprocesses model output to a user-friendly format.

    Args:
        model_output (numpy.ndarray): Raw output from the model.
        model_name (str): Name of the model that produced the output.

    Returns:
        dict: Postprocessed output in a user-friendly format.
    """
    # Load the model configuration based on the model_name
    model_config_data = model_config.get_model_config(model_name)

    # Convert model output to appropriate format
    if model_config_data['type'] == 'classification':
        # For classification, convert to class labels
        class_labels = model_config_data['class_labels']
        output = [class_labels[i] for i in model_output.argmax(axis=1)]
    else:
        # For regression, keep numeric values
        output = model_output.flatten()

    # Create a dictionary with meaningful keys for the output
    result = {
        'model_name': model_name,
        'prediction': output,
        'confidence': np.max(model_output, axis=1).tolist() if model_config_data['type'] == 'classification' else None
    }

    return result

def get_model_config(model_name):
    """
    Retrieves the configuration for a specific model.

    Args:
        model_name (str): Name of the model.

    Returns:
        dict: Model configuration.
    """
    # Import the model configurations from model_config
    return model_config.get_model_config(model_name)

# Commented list of human tasks
"""
Human Tasks:
1. Implement model-specific preprocessing steps for each model type (Required)
2. Define appropriate evaluation metrics for each model type (Required)
3. Implement error handling for cases where model files are not found or corrupted (Required)
4. Optimize model saving and loading for large models (Optional)
5. Implement versioning system for model artifacts (Required)
"""