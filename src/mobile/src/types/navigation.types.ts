import { NavigationProp, RouteProp } from '@react-navigation/native';

// Define the parameter list for the root stack navigator
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  AccountsList: undefined;
  AccountDetails: { accountId: string };
  AddAccount: undefined;
  TransactionsList: undefined;
  TransactionDetails: { transactionId: string };
  AddTransaction: undefined;
  BudgetsOverview: undefined;
  BudgetDetails: { budgetId: string };
  CreateBudget: undefined;
  GoalsList: undefined;
  GoalDetails: { goalId: string };
  CreateGoal: undefined;
  InvestmentsOverview: undefined;
  InvestmentDetails: { investmentId: string };
  CreditScoreOverview: undefined;
  CreditScoreHistory: undefined;
  UserProfile: undefined;
  EditProfile: undefined;
  AppSettings: undefined;
};

// Define the navigation prop type for a specific screen
export type NavigationProps<T extends keyof RootStackParamList> = NavigationProp<RootStackParamList, T>;

// Define the route prop type for a specific screen
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Enum of all screen names for type-safe navigation
export enum ScreenNames {
  Login = 'Login',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',
  Dashboard = 'Dashboard',
  AccountsList = 'AccountsList',
  AccountDetails = 'AccountDetails',
  AddAccount = 'AddAccount',
  TransactionsList = 'TransactionsList',
  TransactionDetails = 'TransactionDetails',
  AddTransaction = 'AddTransaction',
  BudgetsOverview = 'BudgetsOverview',
  BudgetDetails = 'BudgetDetails',
  CreateBudget = 'CreateBudget',
  GoalsList = 'GoalsList',
  GoalDetails = 'GoalDetails',
  CreateGoal = 'CreateGoal',
  InvestmentsOverview = 'InvestmentsOverview',
  InvestmentDetails = 'InvestmentDetails',
  CreditScoreOverview = 'CreditScoreOverview',
  CreditScoreHistory = 'CreditScoreHistory',
  UserProfile = 'UserProfile',
  EditProfile = 'EditProfile',
  AppSettings = 'AppSettings'
}