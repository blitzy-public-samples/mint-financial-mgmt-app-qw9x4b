import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '../Common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { theme } from '../../styles/theme';

const SidebarContainer = styled.nav`
  width: 250px;
  height: 100vh;
  background-color: ${theme.colors.background};
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${theme.colors.text};
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;
  display: block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.hover};
  }

  &.active {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }
`;

const Sidebar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.ACCOUNTS, label: 'Accounts' },
    { path: ROUTES.TRANSACTIONS, label: 'Transactions' },
    { path: ROUTES.BUDGETS, label: 'Budgets' },
    { path: ROUTES.GOALS, label: 'Goals' },
    { path: ROUTES.INVESTMENTS, label: 'Investments' },
    { path: ROUTES.CREDIT_SCORE, label: 'Credit Score' },
  ];

  const userActions = [
    { path: ROUTES.PROFILE, label: 'Profile' },
    { path: ROUTES.SETTINGS, label: 'Settings' },
  ];

  return (
    <SidebarContainer>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <StyledNavLink to={item.path} className={location.pathname === item.path ? 'active' : ''}>
              {item.label}
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
      {isAuthenticated && (
        <>
          <NavList>
            {userActions.map((item) => (
              <NavItem key={item.path}>
                <StyledNavLink to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  {item.label}
                </StyledNavLink>
              </NavItem>
            ))}
          </NavList>
          <Button onClick={logout}>Logout</Button>
        </>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;

// TODO: Implement responsive behavior for mobile devices
// TODO: Add icons for each navigation item