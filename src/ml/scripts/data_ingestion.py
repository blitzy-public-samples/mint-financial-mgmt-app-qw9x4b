import argparse
import logging
import pandas as pd
from typing import Dict, Any

# Assuming these modules exist in the project structure
from src.utils.data_loader import load_and_prepare_data
from src.config.index import get_config

# Set up logging
logger = logging.getLogger(__name__)

def setup_logging() -> None:
    """
    Configures the logging for the script.
    """
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('data_ingestion.log')
        ]
    )

def parse_arguments() -> argparse.Namespace:
    """
    Parses command-line arguments for the script.

    Returns:
        argparse.Namespace: Parsed arguments
    """
    parser = argparse.ArgumentParser(description="Ingest financial data for Mint Replica ML models")
    parser.add_argument("--data-source", type=str, required=True, help="Path or URL to the data source")
    parser.add_argument("--output-path", type=str, required=True, help="Path to save the processed data")
    parser.add_argument("--config", type=str, default="default", help="Configuration to use")
    return parser.parse_args()

def ingest_data(data_source: str, output_path: str, config: Dict[str, Any]) -> None:
    """
    Main function to ingest and process the financial data.

    Args:
        data_source (str): Path or URL to the data source
        output_path (str): Path to save the processed data
        config (Dict[str, Any]): Configuration dictionary
    """
    logger.info(f"Starting data ingestion process from {data_source}")

    try:
        # Load and prepare data using the utility function
        df = load_and_prepare_data(data_source, config)

        # Perform additional data transformations specific to the Mint Replica project
        df = transform_data_for_mint_replica(df, config)

        # Save the processed data
        df.to_csv(output_path, index=False)
        logger.info(f"Processed data saved to {output_path}")

    except Exception as e:
        logger.error(f"Error during data ingestion: {str(e)}")
        raise

def transform_data_for_mint_replica(df: pd.DataFrame, config: Dict[str, Any]) -> pd.DataFrame:
    """
    Perform additional data transformations specific to the Mint Replica project.

    Args:
        df (pd.DataFrame): Input DataFrame
        config (Dict[str, Any]): Configuration dictionary

    Returns:
        pd.DataFrame: Transformed DataFrame
    """
    # TODO: Implement specific data transformation steps for Mint Replica
    # This may include:
    # - Handling missing values
    # - Feature engineering
    # - Data normalization or scaling
    # - Encoding categorical variables
    # - Creating derived features

    logger.info("Performing Mint Replica specific data transformations")
    
    # Example transformation (replace with actual transformations):
    if 'amount' in df.columns:
        df['amount'] = df['amount'].fillna(0)
        df['amount_log'] = np.log1p(df['amount'])

    return df

def main() -> None:
    """
    Entry point of the script.
    """
    setup_logging()
    args = parse_arguments()

    try:
        config = get_config(args.config)
        ingest_data(args.data_source, args.output_path, config)
        logger.info("Data ingestion completed successfully")
    except Exception as e:
        logger.error(f"Data ingestion failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()