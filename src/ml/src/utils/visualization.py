import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from typing import List, Dict, Any

# Commented list of human tasks
"""
Human tasks:
1. Define color schemes and styling guidelines for consistent visualization across the application (Required)
2. Implement responsive design for visualizations to ensure proper rendering on different devices and screen sizes (Required)
3. Optimize performance for large datasets, potentially implementing data sampling or aggregation techniques (Optional)
4. Implement accessibility features for visualizations, such as color-blind friendly palettes and screen reader compatibility (Required)
5. Create unit tests for visualization functions to ensure correct rendering and data representation (Required)
"""

def plot_spending_trends(df: pd.DataFrame, date_column: str, amount_column: str) -> plt.Figure:
    """
    Creates a line plot of spending trends over time.

    Args:
        df (pd.DataFrame): DataFrame containing the spending data.
        date_column (str): Name of the column containing date information.
        amount_column (str): Name of the column containing amount information.

    Returns:
        plt.Figure: Figure object containing the plot.
    """
    # Group the data by date and sum the amounts
    grouped_data = df.groupby(date_column)[amount_column].sum().reset_index()

    # Create a line plot using matplotlib
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(grouped_data[date_column], grouped_data[amount_column])

    # Add labels and title to the plot
    ax.set_xlabel('Date')
    ax.set_ylabel('Amount')
    ax.set_title('Spending Trends Over Time')

    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45)

    # Add grid lines for better visual reference
    ax.grid(True, linestyle='--', alpha=0.7)

    return fig

def plot_category_distribution(df: pd.DataFrame, category_column: str, amount_column: str) -> plt.Figure:
    """
    Creates a pie chart of spending distribution by category.

    Args:
        df (pd.DataFrame): DataFrame containing the spending data.
        category_column (str): Name of the column containing category information.
        amount_column (str): Name of the column containing amount information.

    Returns:
        plt.Figure: Figure object containing the plot.
    """
    # Group the data by category and sum the amounts
    grouped_data = df.groupby(category_column)[amount_column].sum()

    # Create a pie chart using matplotlib
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.pie(grouped_data.values, labels=grouped_data.index, autopct='%1.1f%%', startangle=90)

    # Add title to the plot
    ax.set_title('Spending Distribution by Category')

    return fig

def plot_budget_vs_actual(df: pd.DataFrame, category_column: str, budget_column: str, actual_column: str) -> plt.Figure:
    """
    Creates a bar chart comparing budgeted amounts to actual spending.

    Args:
        df (pd.DataFrame): DataFrame containing the budget and actual spending data.
        category_column (str): Name of the column containing category information.
        budget_column (str): Name of the column containing budgeted amount information.
        actual_column (str): Name of the column containing actual spending amount information.

    Returns:
        plt.Figure: Figure object containing the plot.
    """
    # Create a grouped bar chart using matplotlib
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(df[category_column]))
    width = 0.35

    ax.bar(x - width/2, df[budget_column], width, label='Budget')
    ax.bar(x + width/2, df[actual_column], width, label='Actual')

    # Add labels and title to the plot
    ax.set_xlabel('Category')
    ax.set_ylabel('Amount')
    ax.set_title('Budget vs Actual Spending by Category')
    ax.set_xticks(x)
    ax.set_xticklabels(df[category_column], rotation=45, ha='right')

    # Add a legend to distinguish budget from actual spending
    ax.legend()

    # Add grid lines for better visual reference
    ax.grid(True, linestyle='--', alpha=0.7)

    plt.tight_layout()
    return fig

def plot_investment_performance(df: pd.DataFrame, date_column: str, value_column: str) -> go.Figure:
    """
    Creates a line plot of investment performance over time.

    Args:
        df (pd.DataFrame): DataFrame containing the investment performance data.
        date_column (str): Name of the column containing date information.
        value_column (str): Name of the column containing investment value information.

    Returns:
        plotly.graph_objects.Figure: Plotly figure object containing the plot.
    """
    # Create a line plot using Plotly
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df[date_column], y=df[value_column], mode='lines+markers'))

    # Add interactive features like hover tooltips
    fig.update_traces(hovertemplate='Date: %{x}<br>Value: $%{y:.2f}')

    # Customize the layout with labels and title
    fig.update_layout(
        title='Investment Performance Over Time',
        xaxis_title='Date',
        yaxis_title='Investment Value',
        hovermode='x'
    )

    return fig

def plot_credit_score_history(df: pd.DataFrame, date_column: str, score_column: str) -> plt.Figure:
    """
    Creates a line plot of credit score history.

    Args:
        df (pd.DataFrame): DataFrame containing the credit score history data.
        date_column (str): Name of the column containing date information.
        score_column (str): Name of the column containing credit score information.

    Returns:
        plt.Figure: Figure object containing the plot.
    """
    # Create a line plot using matplotlib
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(df[date_column], df[score_column])

    # Add horizontal lines for credit score ranges
    ax.axhline(y=300, color='r', linestyle='--', alpha=0.5)
    ax.axhline(y=670, color='y', linestyle='--', alpha=0.5)
    ax.axhline(y=740, color='g', linestyle='--', alpha=0.5)
    ax.axhline(y=800, color='b', linestyle='--', alpha=0.5)

    # Add labels and title to the plot
    ax.set_xlabel('Date')
    ax.set_ylabel('Credit Score')
    ax.set_title('Credit Score History')

    # Set y-axis range
    ax.set_ylim(300, 850)

    # Add text labels for credit score ranges
    ax.text(df[date_column].iloc[0], 310, 'Poor', verticalalignment='bottom')
    ax.text(df[date_column].iloc[0], 680, 'Fair', verticalalignment='bottom')
    ax.text(df[date_column].iloc[0], 750, 'Good', verticalalignment='bottom')
    ax.text(df[date_column].iloc[0], 810, 'Excellent', verticalalignment='bottom')

    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45)

    # Add grid lines for better visual reference
    ax.grid(True, linestyle='--', alpha=0.7)

    return fig

def plot_model_feature_importance(model: Any, feature_names: List[str]) -> plt.Figure:
    """
    Creates a bar chart of feature importance for a machine learning model.

    Args:
        model (Any): Trained machine learning model with feature_importances_ attribute.
        feature_names (List[str]): List of feature names corresponding to the model's features.

    Returns:
        plt.Figure: Figure object containing the plot.
    """
    # Extract feature importance from the model
    importances = model.feature_importances_
    
    # Sort features by importance
    indices = np.argsort(importances)[::-1]
    
    # Create a horizontal bar chart using matplotlib
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.barh(range(len(importances)), importances[indices])
    
    # Add labels and title to the plot
    ax.set_yticks(range(len(importances)))
    ax.set_yticklabels([feature_names[i] for i in indices])
    ax.set_xlabel('Feature Importance')
    ax.set_title('Model Feature Importance')
    
    # Add value labels to the end of each bar
    for i, v in enumerate(importances[indices]):
        ax.text(v, i, f' {v:.3f}', va='center')
    
    return fig

def create_interactive_dashboard(transactions_df: pd.DataFrame, budget_df: pd.DataFrame, 
                                 investments_df: pd.DataFrame, credit_score_df: pd.DataFrame) -> go.Figure:
    """
    Creates an interactive dashboard with multiple financial visualizations.

    Args:
        transactions_df (pd.DataFrame): DataFrame containing transaction data.
        budget_df (pd.DataFrame): DataFrame containing budget data.
        investments_df (pd.DataFrame): DataFrame containing investment data.
        credit_score_df (pd.DataFrame): DataFrame containing credit score data.

    Returns:
        plotly.graph_objects.Figure: Plotly figure object containing the dashboard.
    """
    # Create subplots for different visualizations
    fig = go.Figure()

    # Add spending trends plot
    spending_trends = go.Scatter(
        x=transactions_df['date'],
        y=transactions_df.groupby('date')['amount'].sum(),
        name='Spending Trends'
    )
    fig.add_trace(spending_trends)

    # Add category distribution plot
    category_distribution = go.Pie(
        labels=transactions_df.groupby('category')['amount'].sum().index,
        values=transactions_df.groupby('category')['amount'].sum().values,
        name='Category Distribution',
        domain={'x': [0, 0.5], 'y': [0.5, 1]}
    )
    fig.add_trace(category_distribution)

    # Add budget vs actual plot
    budget_vs_actual = go.Bar(
        x=budget_df['category'],
        y=budget_df['budget_amount'],
        name='Budget',
        marker_color='blue'
    )
    fig.add_trace(budget_vs_actual)
    
    actual_spending = go.Bar(
        x=budget_df['category'],
        y=budget_df['actual_amount'],
        name='Actual',
        marker_color='red'
    )
    fig.add_trace(actual_spending)

    # Add investment performance plot
    investment_performance = go.Scatter(
        x=investments_df['date'],
        y=investments_df['value'],
        name='Investment Performance',
        yaxis='y2'
    )
    fig.add_trace(investment_performance)

    # Add credit score history plot
    credit_score_history = go.Scatter(
        x=credit_score_df['date'],
        y=credit_score_df['score'],
        name='Credit Score',
        yaxis='y3'
    )
    fig.add_trace(credit_score_history)

    # Customize layout and add interactivity
    fig.update_layout(
        title='Financial Dashboard',
        xaxis=dict(domain=[0, 0.5]),
        yaxis=dict(title='Amount'),
        yaxis2=dict(title='Investment Value', overlaying='y', side='right'),
        yaxis3=dict(title='Credit Score', overlaying='y', side='right'),
        barmode='group',
        hovermode='closest'
    )

    # Add buttons to toggle visibility of different plots
    fig.update_layout(
        updatemenus=[
            dict(
                type="buttons",
                direction="right",
                x=0.7,
                y=1.2,
                showactive=True,
                buttons=list([
                    dict(label="All",
                         method="update",
                         args=[{"visible": [True] * len(fig.data)}]),
                    dict(label="Spending Trends",
                         method="update",
                         args=[{"visible": [True] + [False] * (len(fig.data) - 1)}]),
                    dict(label="Category Distribution",
                         method="update",
                         args=[{"visible": [False, True] + [False] * (len(fig.data) - 2)}]),
                    dict(label="Budget vs Actual",
                         method="update",
                         args=[{"visible": [False, False, True, True] + [False] * (len(fig.data) - 4)}]),
                    dict(label="Investments",
                         method="update",
                         args=[{"visible": [False] * 4 + [True] + [False] * (len(fig.data) - 5)}]),
                    dict(label="Credit Score",
                         method="update",
                         args=[{"visible": [False] * 5 + [True]}]),
                ]),
            )
        ]
    )

    return fig