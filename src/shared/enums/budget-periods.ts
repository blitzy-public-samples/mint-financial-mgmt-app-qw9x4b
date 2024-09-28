/**
 * Enum definition for budget periods used throughout the Mint Replica application
 */
export enum BudgetPeriod {
  /**
   * Daily budget period
   */
  DAILY = 'DAILY',

  /**
   * Weekly budget period
   */
  WEEKLY = 'WEEKLY',

  /**
   * Bi-weekly budget period
   */
  BIWEEKLY = 'BIWEEKLY',

  /**
   * Monthly budget period
   */
  MONTHLY = 'MONTHLY',

  /**
   * Quarterly budget period
   */
  QUARTERLY = 'QUARTERLY',

  /**
   * Yearly budget period
   */
  YEARLY = 'YEARLY'
}

/**
 * Helper function to get the display name of a budget period
 * @param period The BudgetPeriod enum value
 * @returns The display name of the budget period
 */
export function getBudgetPeriodDisplayName(period: BudgetPeriod): string {
  switch (period) {
    case BudgetPeriod.DAILY:
      return 'Daily';
    case BudgetPeriod.WEEKLY:
      return 'Weekly';
    case BudgetPeriod.BIWEEKLY:
      return 'Bi-weekly';
    case BudgetPeriod.MONTHLY:
      return 'Monthly';
    case BudgetPeriod.QUARTERLY:
      return 'Quarterly';
    case BudgetPeriod.YEARLY:
      return 'Yearly';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to get the number of days in a budget period
 * @param period The BudgetPeriod enum value
 * @returns The number of days in the budget period
 */
export function getBudgetPeriodDays(period: BudgetPeriod): number {
  switch (period) {
    case BudgetPeriod.DAILY:
      return 1;
    case BudgetPeriod.WEEKLY:
      return 7;
    case BudgetPeriod.BIWEEKLY:
      return 14;
    case BudgetPeriod.MONTHLY:
      return 30; // Approximation
    case BudgetPeriod.QUARTERLY:
      return 91; // Approximation
    case BudgetPeriod.YEARLY:
      return 365;
    default:
      return 0;
  }
}