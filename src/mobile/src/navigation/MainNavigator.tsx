import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screen components
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AccountsListScreen from '../screens/Accounts/AccountsListScreen';
import BudgetsOverviewScreen from '../screens/Budgets/BudgetsOverviewScreen';
import GoalsListScreen from '../screens/Goals/GoalsListScreen';
import MoreScreen from '../screens/More/MoreScreen';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

// Define icon names for each tab
const getIconName = (routeName: string) => {
  switch (routeName) {
    case 'Dashboard':
      return 'home-outline';
    case 'Accounts':
      return 'wallet-outline';
    case 'Budgets':
      return 'pie-chart-outline';
    case 'Goals':
      return 'flag-outline';
    case 'More':
      return 'menu-outline';
    default:
      return 'help-outline';
  }
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconName(route.name);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5', // Primary color from the theme
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide the header for all screens
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Accounts" component={AccountsListScreen} />
      <Tab.Screen name="Budgets" component={BudgetsOverviewScreen} />
      <Tab.Screen name="Goals" component={GoalsListScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

// Human tasks:
// 1. Implement screen components for Dashboard, Accounts, Budgets, Goals, and More (Required)
// 2. Design and implement custom tab bar icons if needed (Optional)
// 3. Configure deep linking for each tab if required (Optional)