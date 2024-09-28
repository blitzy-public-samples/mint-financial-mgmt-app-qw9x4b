import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Card from '../Common/Card';
import useAccounts from '../../hooks/useAccounts';
import { formatCurrency } from '../../utils/formatters';

interface Account {
  id: string;
  balance: number;
}

const NetWorth: React.FC = () => {
  const [netWorth, setNetWorth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Assuming useAccounts hook returns { accounts, isLoading, error }
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();

  useEffect(() => {
    if (accounts) {
      const calculatedNetWorth = calculateNetWorth(accounts);
      setNetWorth(calculatedNetWorth);
      setIsLoading(false);
    }
  }, [accounts]);

  useEffect(() => {
    if (accountsError) {
      setError('Failed to fetch account data. Please try again later.');
      setIsLoading(false);
    }
  }, [accountsError]);

  const calculateNetWorth = (accounts: Account[]): number => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  if (isLoading || accountsLoading) {
    return (
      <Card>
        <Typography variant="h6">Net Worth</Typography>
        <Typography>Loading...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Typography variant="h6">Net Worth</Typography>
        <Typography color="error">{error}</Typography>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h6">Net Worth</Typography>
      <Typography variant="h4">{formatCurrency(netWorth)}</Typography>
    </Card>
  );
};

export default NetWorth;
```

This implementation includes the following features:

1. It uses the `useAccounts` hook to fetch account data.
2. It calculates the net worth by summing the balances of all accounts.
3. It uses the `Card` component to display the net worth information.
4. It uses the `formatCurrency` utility function to format the net worth value.
5. It handles loading and error states.

Please note that this implementation makes some assumptions:

1. The `Card` component is assumed to be a simple wrapper that accepts children.
2. The `useAccounts` hook is assumed to return an object with `accounts`, `isLoading`, and `error` properties.
3. The `formatCurrency` function is assumed to take a number and return a formatted string.

You may need to adjust these assumptions based on the actual implementations of the dependencies when they become available.

Human Tasks:
```
1. Implement error handling for failed account data fetching (Completed in the code above)
2. Add loading state while fetching account data (Completed in the code above)
3. Implement unit tests for the NetWorth component (Required)