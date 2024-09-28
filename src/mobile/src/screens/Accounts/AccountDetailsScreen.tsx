import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Assuming these components and hooks will be implemented
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountService } from '../../services/account.service';
import { Account } from '../../types/account.types';

// Define the props for the AccountDetailsScreen
type AccountDetailsScreenProps = {
  route: RouteProp<{ params: { accountId: string } }, 'params'>;
  navigation: StackNavigationProp<any, any>;
};

const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({ route, navigation }) => {
  const { accountId } = route.params;
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getAccountDetails } = useAccounts();

  useEffect(() => {
    loadAccountDetails();
  }, [accountId]);

  const loadAccountDetails = async () => {
    try {
      setIsLoading(true);
      const accountDetails = await getAccountDetails(accountId);
      setAccount(accountDetails);
      setError(null);
    } catch (err) {
      setError('Failed to load account details. Please try again.');
      console.error('Error loading account details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAccount = () => {
    navigation.navigate('EditAccount', { accountId });
  };

  const handleRemoveAccount = async () => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await AccountService.removeAccount(accountId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove account. Please try again.');
              console.error('Error removing account:', err);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading account details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={loadAccountDetails} />
      </View>
    );
  }

  if (!account) {
    return (
      <View style={styles.container}>
        <Text>Account not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>{account.name}</Text>
        <Text style={styles.balance}>Balance: ${account.balance.toFixed(2)}</Text>
        <Text>Account Type: {account.type}</Text>
        <Text>Institution: {account.institution}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {/* Implement a list of recent transactions here */}
      </Card>

      <View style={styles.buttonContainer}>
        <Button title="Edit Account" onPress={handleEditAccount} />
        <Button title="Remove Account" onPress={handleRemoveAccount} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balance: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AccountDetailsScreen;

// Pending human tasks:
// - Implement actual API integration with the backend for fetching account details
// - Design and implement the UI for the account details screen according to the Mint Replica design guidelines
// - Implement proper error handling and loading states
// - Add accessibility features to ensure the screen is usable by all users
// - Implement unit and integration tests for the AccountDetailsScreen component