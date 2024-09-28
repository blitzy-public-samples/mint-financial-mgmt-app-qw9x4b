// Import shared budget types
import { Budget, BudgetPeriod, CreateBudgetDTO, UpdateBudgetDTO, BudgetSummary } from '../../../shared/types/budget';

/**
 * Extends the shared Budget type with mobile-specific properties
 */
export interface MobileBudget extends Budget {
  isNotificationEnabled: boolean;
  notificationThreshold: number;
}

/**
 * Extends the shared CreateBudgetDTO with mobile-specific properties
 */
export interface MobileCreateBudgetDTO extends CreateBudgetDTO {
  isNotificationEnabled: boolean;
  notificationThreshold: number;
}

/**
 * Extends the shared UpdateBudgetDTO with mobile-specific properties
 */
export interface MobileUpdateBudgetDTO extends UpdateBudgetDTO {
  isNotificationEnabled?: boolean;
  notificationThreshold?: number;
}

/**
 * Extends the shared BudgetSummary with mobile-specific properties
 */
export interface MobileBudgetSummary extends BudgetSummary {
  isNotificationEnabled: boolean;
  notificationThreshold: number;
  percentageUsed: number;
}

/**
 * Represents a budget notification for the mobile app
 */
export interface BudgetNotification {
  budgetId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// Re-export shared types for convenience
export { BudgetPeriod };

// Human tasks:
// TODO: Review and validate the mobile-specific budget types to ensure they meet all requirements for the mobile application
// TODO: Consider adding more mobile-specific types or properties if needed for advanced mobile budget features
// TODO: Ensure that the notification-related properties align with the mobile app's notification system design