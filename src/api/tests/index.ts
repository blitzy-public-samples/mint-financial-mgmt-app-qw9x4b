// Main entry point for API tests, organizing and exporting all test suites

// Import unit test modules
import * as authTests from './unit/auth.test';
import * as userTests from './unit/user.test';
import * as accountTests from './unit/account.test';
import * as transactionTests from './unit/transaction.test';
import * as budgetTests from './unit/budget.test';
import * as goalTests from './unit/goal.test';
import * as investmentTests from './unit/investment.test';
import * as creditScoreTests from './unit/credit-score.test';
import * as insightTests from './unit/insight.test';

// Import integration test modules
import * as authIntegrationTests from './integration/auth.test';
import * as userIntegrationTests from './integration/user.test';
import * as accountIntegrationTests from './integration/account.test';
import * as transactionIntegrationTests from './integration/transaction.test';
import * as budgetIntegrationTests from './integration/budget.test';
import * as goalIntegrationTests from './integration/goal.test';
import * as investmentIntegrationTests from './integration/investment.test';
import * as creditScoreIntegrationTests from './integration/credit-score.test';
import * as insightIntegrationTests from './integration/insight.test';

// Export all test modules
export {
  authTests,
  userTests,
  accountTests,
  transactionTests,
  budgetTests,
  goalTests,
  investmentTests,
  creditScoreTests,
  insightTests,
  authIntegrationTests,
  userIntegrationTests,
  accountIntegrationTests,
  transactionIntegrationTests,
  budgetIntegrationTests,
  goalIntegrationTests,
  investmentIntegrationTests,
  creditScoreIntegrationTests,
  insightIntegrationTests,
};

/**
 * Executes all unit and integration tests
 */
export const runAllTests = async (): Promise<void> => {
  console.log('Starting all tests...');

  // Run unit tests
  console.log('Running unit tests...');
  await Promise.all([
    authTests.runTests(),
    userTests.runTests(),
    accountTests.runTests(),
    transactionTests.runTests(),
    budgetTests.runTests(),
    goalTests.runTests(),
    investmentTests.runTests(),
    creditScoreTests.runTests(),
    insightTests.runTests(),
  ]);

  // Run integration tests
  console.log('Running integration tests...');
  await Promise.all([
    authIntegrationTests.runTests(),
    userIntegrationTests.runTests(),
    accountIntegrationTests.runTests(),
    transactionIntegrationTests.runTests(),
    budgetIntegrationTests.runTests(),
    goalIntegrationTests.runTests(),
    investmentIntegrationTests.runTests(),
    creditScoreIntegrationTests.runTests(),
    insightIntegrationTests.runTests(),
  ]);

  console.log('All tests completed.');
};

// List of pending human tasks
/**
 * TODO: Implement individual test files for each module (unit and integration tests)
 * TODO: Set up test environment and configuration
 * TODO: Integrate with CI/CD pipeline for automated testing
 */