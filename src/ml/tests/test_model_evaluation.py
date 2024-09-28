import pytest
import numpy as np
from sklearn.datasets import make_classification, make_regression
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier, DummyRegressor
import matplotlib.pyplot as plt

from src.ml.src.evaluation.model_evaluation import (
    evaluate_transaction_categorization,
    evaluate_spending_prediction,
    evaluate_investment_recommendation,
    evaluate_credit_score_prediction,
    plot_confusion_matrix,
    plot_regression_results
)
from src.ml.src.config.model_config import (
    TRANSACTION_CATEGORIZATION_MODEL,
    SPENDING_PREDICTION_MODEL,
    INVESTMENT_RECOMMENDATION_MODEL,
    CREDIT_SCORE_PREDICTION_MODEL
)

@pytest.fixture
def classification_data():
    X, y = make_classification(n_samples=1000, n_classes=5, n_features=20, random_state=42)
    return train_test_split(X, y, test_size=0.2, random_state=42)

@pytest.fixture
def regression_data():
    X, y = make_regression(n_samples=1000, n_features=20, random_state=42)
    return train_test_split(X, y, test_size=0.2, random_state=42)

def test_evaluate_transaction_categorization(classification_data):
    X_train, X_test, y_train, y_test = classification_data
    dummy_classifier = DummyClassifier(strategy="stratified").fit(X_train, y_train)
    
    metrics = evaluate_transaction_categorization(dummy_classifier, X_test, y_test)
    
    assert isinstance(metrics, dict)
    assert set(metrics.keys()) == {"accuracy", "precision", "recall", "f1_score"}
    assert all(0 <= value <= 1 for value in metrics.values())

def test_evaluate_spending_prediction(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    dummy_regressor = DummyRegressor(strategy="mean").fit(X_train, y_train)
    
    metrics = evaluate_spending_prediction(dummy_regressor, X_test, y_test)
    
    assert isinstance(metrics, dict)
    assert set(metrics.keys()) == {"mse", "mae", "r2_score"}
    assert all(isinstance(value, (int, float)) for value in metrics.values())
    assert metrics["mse"] >= 0
    assert metrics["mae"] >= 0
    assert metrics["r2_score"] <= 1

def test_evaluate_investment_recommendation(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    dummy_regressor = DummyRegressor(strategy="mean").fit(X_train, y_train)
    
    metrics = evaluate_investment_recommendation(dummy_regressor, X_test, y_test)
    
    assert isinstance(metrics, dict)
    assert set(metrics.keys()) == {"mse", "mae", "r2_score"}
    assert all(isinstance(value, (int, float)) for value in metrics.values())
    assert metrics["mse"] >= 0
    assert metrics["mae"] >= 0
    assert metrics["r2_score"] <= 1

def test_evaluate_credit_score_prediction(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    dummy_regressor = DummyRegressor(strategy="mean").fit(X_train, y_train)
    
    metrics = evaluate_credit_score_prediction(dummy_regressor, X_test, y_test)
    
    assert isinstance(metrics, dict)
    assert set(metrics.keys()) == {"mse", "mae", "r2_score"}
    assert all(isinstance(value, (int, float)) for value in metrics.values())
    assert metrics["mse"] >= 0
    assert metrics["mae"] >= 0
    assert metrics["r2_score"] <= 1

def test_plot_confusion_matrix():
    y_true = np.array([0, 1, 2, 0, 1, 2])
    y_pred = np.array([0, 2, 1, 0, 1, 1])
    class_names = ["Class 0", "Class 1", "Class 2"]
    
    fig = plot_confusion_matrix(y_true, y_pred, class_names)
    
    assert isinstance(fig, plt.Figure)
    assert len(fig.axes) == 1
    assert fig.axes[0].get_title() == "Confusion Matrix"
    assert fig.axes[0].get_xlabel() == "Predicted label"
    assert fig.axes[0].get_ylabel() == "True label"

def test_plot_regression_results():
    y_true = np.array([1, 2, 3, 4, 5])
    y_pred = np.array([1.1, 2.2, 2.9, 3.8, 5.2])
    
    fig = plot_regression_results(y_true, y_pred)
    
    assert isinstance(fig, plt.Figure)
    assert len(fig.axes) == 1
    assert fig.axes[0].get_title() == "True vs Predicted Values"
    assert fig.axes[0].get_xlabel() == "True Values"
    assert fig.axes[0].get_ylabel() == "Predicted Values"

# Additional tests for edge cases and error handling

def test_evaluate_transaction_categorization_invalid_input():
    with pytest.raises(ValueError):
        evaluate_transaction_categorization(None, None, None)

def test_evaluate_spending_prediction_invalid_input():
    with pytest.raises(ValueError):
        evaluate_spending_prediction(None, None, None)

def test_evaluate_investment_recommendation_invalid_input():
    with pytest.raises(ValueError):
        evaluate_investment_recommendation(None, None, None)

def test_evaluate_credit_score_prediction_invalid_input():
    with pytest.raises(ValueError):
        evaluate_credit_score_prediction(None, None, None)

def test_plot_confusion_matrix_invalid_input():
    with pytest.raises(ValueError):
        plot_confusion_matrix(None, None, None)

def test_plot_regression_results_invalid_input():
    with pytest.raises(ValueError):
        plot_regression_results(None, None)

# Integration tests with actual ML models (optional)

@pytest.mark.integration
def test_integration_transaction_categorization(classification_data):
    X_train, X_test, y_train, y_test = classification_data
    model = TRANSACTION_CATEGORIZATION_MODEL()
    model.fit(X_train, y_train)
    metrics = evaluate_transaction_categorization(model, X_test, y_test)
    assert metrics["accuracy"] > 0.5  # Assuming the model performs better than random guessing

@pytest.mark.integration
def test_integration_spending_prediction(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    model = SPENDING_PREDICTION_MODEL()
    model.fit(X_train, y_train)
    metrics = evaluate_spending_prediction(model, X_test, y_test)
    assert metrics["r2_score"] > 0  # Assuming the model performs better than a constant prediction

@pytest.mark.integration
def test_integration_investment_recommendation(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    model = INVESTMENT_RECOMMENDATION_MODEL()
    model.fit(X_train, y_train)
    metrics = evaluate_investment_recommendation(model, X_test, y_test)
    assert metrics["r2_score"] > 0  # Assuming the model performs better than a constant prediction

@pytest.mark.integration
def test_integration_credit_score_prediction(regression_data):
    X_train, X_test, y_train, y_test = regression_data
    model = CREDIT_SCORE_PREDICTION_MODEL()
    model.fit(X_train, y_train)
    metrics = evaluate_credit_score_prediction(model, X_test, y_test)
    assert metrics["r2_score"] > 0  # Assuming the model performs better than a constant prediction

# Performance benchmarks (optional)

@pytest.mark.benchmark
def test_benchmark_transaction_categorization(classification_data, benchmark):
    X_train, X_test, y_train, y_test = classification_data
    model = TRANSACTION_CATEGORIZATION_MODEL()
    model.fit(X_train, y_train)
    benchmark(evaluate_transaction_categorization, model, X_test, y_test)

@pytest.mark.benchmark
def test_benchmark_spending_prediction(regression_data, benchmark):
    X_train, X_test, y_train, y_test = regression_data
    model = SPENDING_PREDICTION_MODEL()
    model.fit(X_train, y_train)
    benchmark(evaluate_spending_prediction, model, X_test, y_test)

@pytest.mark.benchmark
def test_benchmark_investment_recommendation(regression_data, benchmark):
    X_train, X_test, y_train, y_test = regression_data
    model = INVESTMENT_RECOMMENDATION_MODEL()
    model.fit(X_train, y_train)
    benchmark(evaluate_investment_recommendation, model, X_test, y_test)

@pytest.mark.benchmark
def test_benchmark_credit_score_prediction(regression_data, benchmark):
    X_train, X_test, y_train, y_test = regression_data
    model = CREDIT_SCORE_PREDICTION_MODEL()
    model.fit(X_train, y_train)
    benchmark(evaluate_credit_score_prediction, model, X_test, y_test)