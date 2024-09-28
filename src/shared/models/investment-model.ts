/**
 * InvestmentModel interface
 * Represents the structure of an investment in the Mint Replica application
 */
export interface InvestmentModel {
  /** Unique identifier for the investment */
  id: string;

  /** User ID associated with this investment */
  userId: string;

  /** Account ID associated with this investment */
  accountId: string;

  /** Type of investment (e.g., stock, bond, mutual fund) */
  type: string;

  /** Name of the investment */
  name: string;

  /** Quantity of the investment held */
  quantity: number;

  /** Purchase price per unit of the investment */
  purchasePrice: number;

  /** Current price per unit of the investment */
  currentPrice: number;

  /** Total value of the investment (quantity * currentPrice) */
  value: number;

  /** Total gain or loss (value - (quantity * purchasePrice)) */
  gainLoss: number;

  /** Percentage gain or loss ((gainLoss / (quantity * purchasePrice)) * 100) */
  gainLossPercentage: number;

  /** Symbol or ticker of the investment (if applicable) */
  symbol: string;

  /** Date when the investment was purchased */
  purchaseDate: Date;

  /** Date when the investment data was last updated */
  lastUpdated: Date;
}

// TODO: Verify that all necessary properties for investments are included in the InvestmentModel interface
// TODO: Ensure that the property types align with the database schema and API requirements
// TODO: Consider adding JSDoc comments to provide more detailed descriptions for each property