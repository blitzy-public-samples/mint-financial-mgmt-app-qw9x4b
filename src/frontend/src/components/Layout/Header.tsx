import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import useAuth from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1E88E5;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <HeaderContainer>
      <Logo>Mint Replica</Logo>
      <NavLinks>
        {isAuthenticated ? (
          <>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</Button>
            <Button onClick={() => navigate(ROUTES.ACCOUNTS)}>Accounts</Button>
            <Button onClick={() => navigate(ROUTES.TRANSACTIONS)}>Transactions</Button>
            <Button onClick={() => navigate(ROUTES.BUDGETS)}>Budgets</Button>
            <Button onClick={() => navigate(ROUTES.GOALS)}>Goals</Button>
          </>
        ) : (
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
        )}
      </NavLinks>
      {isAuthenticated && (
        <UserInfo>
          <span>Welcome, {user?.name}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </UserInfo>
      )}
    </HeaderContainer>
  );
};

export default Header;

// Human tasks:
// 1. Design and provide the logo for the Mint Replica application (Optional)
// 2. Confirm the exact navigation structure and routes for the application (Required)