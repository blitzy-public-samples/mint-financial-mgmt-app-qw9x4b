import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAccounts } from '../hooks/useAccounts';
import { Account } from '../types/account.types';
import Card from '../Common/Card';
import Button from '../Common/Button';

// Styled components
const AccountsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccountCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const AddAccountButton = styled(Button)`
  align-self: flex-end;
  margin-top: 1rem;
`;

const AccountsList: React.FC = () => {
  const { accounts, loading, error, fetchAccounts, addAccount } = useAccounts();
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAddAccount = () => {
    setIsAddingAccount(true);
    // Implement logic to open a modal or navigate to add account page
  };

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AccountsListContainer>
      <h2>Your Accounts</h2>
      {accounts.map((account: Account) => (
        <AccountCard key={account.id}>
          <div>
            <h3>{account.name}</h3>
            <p>{account.type}</p>
          </div>
          <div>
            <p>{account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
        </AccountCard>
      ))}
      <AddAccountButton onClick={handleAddAccount}>Add New Account</AddAccountButton>
    </AccountsListContainer>
  );
};

export default AccountsList;

// TODO: Implement proper error handling and user feedback mechanisms
// TODO: Add accessibility attributes to improve component usability
// TODO: Implement pagination or infinite scrolling for large account lists