/**
 * AccountTypes Enum
 * 
 * This enum represents various types of financial accounts supported by the Mint Replica application.
 * It provides a standardized set of account types that can be used across the application for
 * consistency in categorizing and handling various financial accounts.
 */
export enum AccountTypes {
  /**
   * Represents a standard checking account
   */
  CHECKING = 'CHECKING',

  /**
   * Represents a savings account
   */
  SAVINGS = 'SAVINGS',

  /**
   * Represents a credit card account
   */
  CREDIT_CARD = 'CREDIT_CARD',

  /**
   * Represents a general investment account
   */
  INVESTMENT = 'INVESTMENT',

  /**
   * Represents a loan account (e.g., personal loan, student loan)
   */
  LOAN = 'LOAN',

  /**
   * Represents a mortgage account
   */
  MORTGAGE = 'MORTGAGE',

  /**
   * Represents a retirement account (e.g., 401(k), IRA)
   */
  RETIREMENT = 'RETIREMENT',

  /**
   * Represents a brokerage account
   */
  BROKERAGE = 'BROKERAGE',

  /**
   * Represents a cash account or physical cash holdings
   */
  CASH = 'CASH',

  /**
   * Represents real estate holdings
   */
  REAL_ESTATE = 'REAL_ESTATE',

  /**
   * Represents vehicle-related accounts or assets
   */
  VEHICLE = 'VEHICLE',

  /**
   * Represents any other type of account not covered by the above categories
   */
  OTHER = 'OTHER'
}

// Human tasks:
// TODO: Review and confirm the list of account types to ensure it covers all necessary categories for the Mint Replica application
// TODO (Optional): Consider adding descriptions or comments for each account type to improve code readability and maintainability