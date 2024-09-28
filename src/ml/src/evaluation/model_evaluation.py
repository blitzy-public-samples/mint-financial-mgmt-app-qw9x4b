import numpy as np
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Assuming these models are imported from the config file
from ..config.model_config import (
    TRANSACTION_CATEGORIZATION_MODEL,
    SPENDING_PREDICTION_MODEL,
    INVESTMENT_RECOMMENDATION_MODEL,
    CREDIT_SCORE_PREDICTION_MODEL
)

def evaluate_transaction_categorization(model, X_test, y_test):
    """
    Evaluates the performance of the transaction categorization model.

    Args:
    model (object): The trained transaction categorization model
    X_test (numpy.ndarray): The feature set for testing
    y_test (numpy.ndarray): The true labels for testing

    Returns:
    dict: A dictionary containing accuracy, precision, recall, and F1-score
    """
    # Make predictions using the model on X_test
    y_pred = model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Calculate precision, recall, and F1-score
    classification_rep = classification_report(y_test, y_pred, output_dict=True)

    # Return the metrics in a dictionary
    return {
        'accuracy': accuracy,
        'precision': classification_rep['weighted avg']['precision'],
        'recall': classification_rep['weighted avg']['recall'],
        'f1_score': classification_rep['weighted avg']['f1-score']
    }

def evaluate_spending_prediction(model, X_test, y_test):
    """
    Evaluates the performance of the spending prediction model.

    Args:
    model (object): The trained spending prediction model
    X_test (numpy.ndarray): The feature set for testing
    y_test (numpy.ndarray): The true values for testing

    Returns:
    dict: A dictionary containing MSE, RMSE, and R-squared score
    """
    # Make predictions using the model on X_test
    y_pred = model.predict(X_test)

    # Calculate Mean Squared Error (MSE)
    mse = mean_squared_error(y_test, y_pred)

    # Calculate Root Mean Squared Error (RMSE)
    rmse = np.sqrt(mse)

    # Calculate R-squared score
    r2 = r2_score(y_test, y_pred)

    # Return the metrics in a dictionary
    return {
        'mse': mse,
        'rmse': rmse,
        'r2_score': r2
    }

def evaluate_investment_recommendation(model, X_test, y_test):
    """
    Evaluates the performance of the investment recommendation model.

    Args:
    model (object): The trained investment recommendation model
    X_test (numpy.ndarray): The feature set for testing
    y_test (numpy.ndarray): The true values for testing

    Returns:
    dict: A dictionary containing MSE, RMSE, and custom investment performance metric
    """
    # Make predictions using the model on X_test
    y_pred = model.predict(X_test)

    # Calculate Mean Squared Error (MSE)
    mse = mean_squared_error(y_test, y_pred)

    # Calculate Root Mean Squared Error (RMSE)
    rmse = np.sqrt(mse)

    # Calculate a custom investment performance metric (e.g., risk-adjusted return)
    # This is a placeholder and should be replaced with an actual implementation
    custom_metric = calculate_risk_adjusted_return(y_test, y_pred)

    # Return the metrics in a dictionary
    return {
        'mse': mse,
        'rmse': rmse,
        'risk_adjusted_return': custom_metric
    }

def evaluate_credit_score_prediction(model, X_test, y_test):
    """
    Evaluates the performance of the credit score prediction model.

    Args:
    model (object): The trained credit score prediction model
    X_test (numpy.ndarray): The feature set for testing
    y_test (numpy.ndarray): The true values for testing

    Returns:
    dict: A dictionary containing MSE, RMSE, and R-squared score
    """
    # Make predictions using the model on X_test
    y_pred = model.predict(X_test)

    # Calculate Mean Squared Error (MSE)
    mse = mean_squared_error(y_test, y_pred)

    # Calculate Root Mean Squared Error (RMSE)
    rmse = np.sqrt(mse)

    # Calculate R-squared score
    r2 = r2_score(y_test, y_pred)

    # Return the metrics in a dictionary
    return {
        'mse': mse,
        'rmse': rmse,
        'r2_score': r2
    }

def plot_confusion_matrix(y_true, y_pred, classes, model_name):
    """
    Plots a confusion matrix for classification models.

    Args:
    y_true (numpy.ndarray): True labels
    y_pred (numpy.ndarray): Predicted labels
    classes (list): List of class names
    model_name (str): Name of the model for the plot title

    Returns:
    None: Displays the confusion matrix plot
    """
    from sklearn.metrics import confusion_matrix
    import seaborn as sns

    # Compute confusion matrix
    cm = confusion_matrix(y_true, y_pred)

    # Create a heatmap of the confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)

    plt.title(f'Confusion Matrix - {model_name}')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.show()

def plot_regression_results(y_true, y_pred, model_name):
    """
    Plots actual vs predicted values for regression models.

    Args:
    y_true (numpy.ndarray): True values
    y_pred (numpy.ndarray): Predicted values
    model_name (str): Name of the model for the plot title

    Returns:
    None: Displays the regression results plot
    """
    plt.figure(figsize=(10, 8))
    plt.scatter(y_true, y_pred, alpha=0.5)
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', lw=2)

    plt.title(f'Actual vs Predicted - {model_name}')
    plt.xlabel('Actual')
    plt.ylabel('Predicted')
    plt.show()

def calculate_risk_adjusted_return(y_true, y_pred):
    """
    Calculates a custom risk-adjusted return metric.
    This is a placeholder function and should be implemented based on specific requirements.

    Args:
    y_true (numpy.ndarray): True values
    y_pred (numpy.ndarray): Predicted values

    Returns:
    float: The calculated risk-adjusted return
    """
    # Placeholder implementation
    return np.mean(y_pred) / np.std(y_pred)

# Commented list of human tasks
"""
Human tasks:
1. Implement additional evaluation metrics specific to each model type (Required)
2. Create visualization functions for model-specific performance metrics (Required)
3. Develop a comprehensive evaluation report generator for all models (Optional)
4. Implement cross-validation functionality for more robust model evaluation (Required)
"""