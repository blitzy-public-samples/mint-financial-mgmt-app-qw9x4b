import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Account } from '../../types/account.types';
import { theme } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

// Define the props interface for the AccountListItem component
interface AccountListItemProps {
  account: Account;
  onPress: (account: Account) => void;
}

const AccountListItem: React.FC<AccountListItemProps> = ({ account, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(account)}>
      <View style={styles.leftContent}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountType}>{account.type}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.balance}>{formatCurrency(account.balance)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: theme.colors.secondaryText,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default AccountListItem;

// Pending human tasks:
// 1. Confirm the exact properties of the Account type from the account.types.ts file
// 2. Verify the color scheme and typography from the theme constants