// Import shared goal types
import { Goal, GoalType, GoalStatus, CreateGoalDTO, UpdateGoalDTO, GoalProgress } from '../../../shared/types/goal';

// Enum representing the frequency of goal notifications for mobile users
export enum GoalNotificationFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY'
}

// Interface extending the shared Goal type with mobile-specific properties
export interface MobileGoal extends Goal {
  isNotificationEnabled: boolean;
  notificationFrequency: GoalNotificationFrequency;
}

// Data Transfer Object for creating a new goal in the mobile app
export interface MobileCreateGoalDTO extends Omit<CreateGoalDTO, 'isNotificationEnabled' | 'notificationFrequency'> {
  isNotificationEnabled: boolean;
  notificationFrequency: GoalNotificationFrequency;
}

// Data Transfer Object for updating an existing goal in the mobile app
export interface MobileUpdateGoalDTO extends Omit<UpdateGoalDTO, 'isNotificationEnabled' | 'notificationFrequency'> {
  isNotificationEnabled?: boolean;
  notificationFrequency?: GoalNotificationFrequency;
}

// Interface representing the progress of a goal in the mobile app
export interface MobileGoalProgress extends GoalProgress {
  nextNotificationDate: string | null;
}

// Re-export shared types for convenience
export { GoalType, GoalStatus };

// Human tasks (commented)
/*
TODO:
1. Review the mobile-specific goal types and ensure they meet all requirements for the mobile application
2. Validate that the notification-related properties in MobileGoal and MobileCreateGoalDTO are sufficient for the mobile app's notification system
3. Consider adding more mobile-specific properties or types if needed based on the mobile app's unique features
*/