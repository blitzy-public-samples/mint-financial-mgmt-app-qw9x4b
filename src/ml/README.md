# Mint Replica - Machine Learning Module

This module contains the machine learning components of the Mint Replica application, including models for transaction categorization, spending prediction, investment recommendation, and credit score prediction.

## Setup

### Requirements

- Python 3.8+
- Node.js 14.0+

### Installation

1. Clone the repository
2. Navigate to the src/ml directory
3. Run `npm install` to install Node.js dependencies
4. Run `pip install -r requirements.txt` to install Python dependencies

## Project Structure

- src/config: Configuration files for ML models
- src/models: Implementation of ML models
- src/preprocessing: Data cleaning and feature engineering scripts
- src/training: Model training scripts
- src/evaluation: Model evaluation scripts
- src/inference: Inference scripts for trained models
- src/utils: Utility functions and helpers
- src/api: FastAPI-based ML API
- tests: Unit and integration tests
- notebooks: Jupyter notebooks for exploratory data analysis and model prototyping
- scripts: Utility scripts for data ingestion, model training pipeline, and deployment

## Usage

### Training Models

- Run `npm run train:transaction` to train the transaction categorization model
- Run `npm run train:spending` to train the spending prediction model
- Run `npm run train:investment` to train the investment recommendation model
- Run `npm run train:credit` to train the credit score prediction model

### Evaluating Models

- Run `npm run evaluate` to evaluate all trained models

### Running API

- Run `npm start` to start the FastAPI-based ML API

## Testing

- Run `npm test` to execute all unit and integration tests
- Run `npm run lint` to check code quality with flake8

## Contributing

Please follow these guidelines when contributing to the project:

- Follow PEP 8 style guide for Python code
- Use type hints for better code readability
- Write unit tests for new features or bug fixes
- Update documentation when making changes to the API or model architectures

## License

This project is licensed under the MIT License.

## TODO

The following tasks are pending and need to be addressed:

- [ ] Add specific instructions for setting up development environment
- [ ] Provide examples of API usage and expected inputs/outputs
- [ ] Include information about data sources and any necessary preprocessing steps
- [ ] Add troubleshooting section for common issues (optional)