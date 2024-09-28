import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import GoalProgressCard from '../components/Goals/GoalProgressCard';
import { useGoals } from '../../hooks/useGoals';
import Button from '../../components/common/Button';

// Assuming the RootStackParamList is defined in the navigation types
type RootStackParamList = {
  GoalDetails: { goalId: string };
  EditGoal: { goalId: string };
};

type GoalDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GoalDetails'>;

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
};

const GoalDetailsScreen: React.FC = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const navigation = useNavigation();
  const route = useRoute<GoalDetailsScreenRouteProp>();
  const { goalId } = route.params;
  const { getGoalById, deleteGoal } = useGoals();

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const goalDetails = await getGoalById(goalId);
        setGoal(goalDetails);
      } catch (error) {
        console.error('Error fetching goal details:', error);
        Alert.alert('Error', 'Failed to load goal details. Please try again.');
      }
    };

    fetchGoalDetails();
  }, [goalId, getGoalById]);

  const handleEditGoal = () => {
    navigation.navigate('EditGoal', { goalId: goal!.id });
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goal!.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{goal.title}</Text>
      <GoalProgressCard
        currentAmount={goal.currentAmount}
        targetAmount={goal.targetAmount}
        deadline={goal.deadline}
      />
      <View style={styles.buttonContainer}>
        <Button title="Edit Goal" onPress={handleEditGoal} />
        <Button title="Delete Goal" onPress={handleDeleteGoal} variant="danger" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default GoalDetailsScreen;
```

This implementation includes the following features and considerations:

1. The screen fetches goal details using the `useGoals` hook when the component mounts.
2. It displays the goal title, a `GoalProgressCard` component (assumed to show progress, target amount, and deadline), and buttons to edit or delete the goal.
3. The `handleEditGoal` function navigates to an EditGoal screen (which needs to be implemented separately).
4. The `handleDeleteGoal` function shows a confirmation alert before deleting the goal.
5. Error handling is implemented for both fetching goal details and deleting a goal.
6. A loading state is shown while fetching goal details.
7. The layout is styled using React Native's StyleSheet.

Human tasks that need to be addressed:

```
// Human tasks:
// TODO: Implement actual navigation logic once the navigation structure is set up
// TODO: Integrate with the actual goal service API once it's implemented
// TODO: Add error handling for API calls and display appropriate error messages
// TODO: Implement loading states while fetching goal details