import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { addAccount } from '../../store/slices/accountSlice';
import { addAccountAsync } from '../../services/account.service';

// Styled components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
`;

interface AccountDetails {
  institution: string;
  accountType: string;
  accountName: string;
  balance: string;
}

const AddAccount: React.FC = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    institution: '',
    accountType: '',
    accountName: '',
    balance: '',
  });
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic form validation
    if (!accountDetails.institution || !accountDetails.accountType || !accountDetails.accountName || !accountDetails.balance) {
      setError('All fields are required');
      return;
    }

    const balance = parseFloat(accountDetails.balance);
    if (isNaN(balance)) {
      setError('Balance must be a valid number');
      return;
    }

    try {
      // Assuming addAccountAsync returns the created account
      const newAccount = await addAccountAsync({
        ...accountDetails,
        balance: balance,
      });
      dispatch(addAccount(newAccount));
      // Reset form after successful submission
      setAccountDetails({
        institution: '',
        accountType: '',
        accountName: '',
        balance: '',
      });
      // TODO: Show success message or redirect user
    } catch (err) {
      setError('Failed to add account. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add New Account</h2>
      <Input
        name="institution"
        value={accountDetails.institution}
        onChange={handleInputChange}
        placeholder="Institution Name"
      />
      <Input
        name="accountType"
        value={accountDetails.accountType}
        onChange={handleInputChange}
        placeholder="Account Type"
      />
      <Input
        name="accountName"
        value={accountDetails.accountName}
        onChange={handleInputChange}
        placeholder="Account Name"
      />
      <Input
        name="balance"
        value={accountDetails.balance}
        onChange={handleInputChange}
        placeholder="Balance"
        type="number"
        step="0.01"
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit">Add Account</Button>
    </FormContainer>
  );
};

export default AddAccount;

// TODO: Implement proper error handling and user feedback mechanisms
// TODO: Add input validation for account details
// TODO: Implement integration with financial institution APIs for account verification
// TODO: Add accessibility features to the form