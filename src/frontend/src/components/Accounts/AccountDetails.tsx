import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// TODO: Import these components and hooks when they're available
// import { useAccounts } from '../../hooks/useAccounts';
// import { useTransactions } from '../../hooks/useTransactions';
// import { Card } from '../Common/Card';
// import { Button } from '../Common/Button';
// import { TransactionList } from '../Transactions/TransactionList';
// import { Chart } from '../Common/Chart';
// import { formatCurrency } from '../../utils/formatters';

// Placeholder styled components
const Container = styled.div`
  padding: 20px;
`;

const AccountInfo = styled.div`
  margin-bottom: 20px;
`;

const BalanceCard = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 20px;
`;

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // TODO: Replace with actual hooks when available
  // const { getAccount } = useAccounts();
  // const { getTransactions } = useTransactions();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      // TODO: Replace with actual API call
      // const accountData = await getAccount(accountId);
      // setAccount(accountData);

      // Placeholder data
      setAccount({
        id: accountId,
        name: 'Sample Account',
        balance: 5000,
        type: 'Checking',
      });
    };

    const fetchTransactions = async () => {
      // TODO: Replace with actual API call
      // const transactionData = await getTransactions(accountId);
      // setTransactions(transactionData);

      // Placeholder data
      setTransactions([
        { id: '1', date: '2023-05-01', description: 'Sample Transaction 1', amount: -50 },
        { id: '2', date: '2023-05-02', description: 'Sample Transaction 2', amount: 100 },
      ]);
    };

    fetchAccountDetails();
    fetchTransactions();
  }, [accountId]);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <AccountInfo>
        <h1>{account.name}</h1>
        <p>Account Type: {account.type}</p>
      </AccountInfo>

      <BalanceCard>
        <h2>Current Balance</h2>
        <p>{/* {formatCurrency(account.balance)} */}${account.balance.toFixed(2)}</p>
      </BalanceCard>

      <ActionsContainer>
        {/* <Button onClick={() => console.log('Transfer funds')}>Transfer Funds</Button>
        <Button onClick={() => console.log('Close account')}>Close Account</Button> */}
        <button onClick={() => console.log('Transfer funds')}>Transfer Funds</button>
        <button onClick={() => console.log('Close account')}>Close Account</button>
      </ActionsContainer>

      <h2>Transaction History</h2>
      {/* <TransactionList transactions={transactions} /> */}
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.description}: ${transaction.amount.toFixed(2)}
          </li>
        ))}
      </ul>

      <h2>Account Balance Chart</h2>
      <ChartContainer>
        {/* <Chart data={transactions} /> */}
        <p>Chart placeholder</p>
      </ChartContainer>
    </Container>
  );
};

export default AccountDetails;

// TODO: Implement error handling for failed API calls
// TODO: Add loading states for data fetching
// TODO: Implement account-specific actions (e.g., transfer funds, close account)