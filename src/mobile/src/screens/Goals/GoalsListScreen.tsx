import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoalProgressCard from '../components/Goals/GoalProgressCard';
import useGoals from '../hooks/useGoals';
import Button from '../components/common/Button';

const GoalsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { goals, isLoading, error } = useGoals();

  const renderGoalItem = ({ item }: { item: any }) => (
    <GoalProgressCard
      goal={item}
      onPress={() => navigation.navigate('GoalDetails', { goalId: item.id })}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading goals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={() => {/* Implement retry logic */}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No goals found. Start by creating a new goal!</Text>
        }
      />
      <Button
        title="Create New Goal"
        onPress={() => navigation.navigate('CreateGoal')}
        style={styles.createButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    marginTop: 16,
  },
});

export default GoalsListScreen;

// Human tasks:
// TODO: Implement error handling for failed goal data fetching
// TODO: Add pull-to-refresh functionality for the goals list
// TODO: Implement sorting and filtering options for the goals list