import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import NetWorth from '../Dashboard/NetWorth';
import RecentTransactions from '../Dashboard/RecentTransactions';
import SpendingByCategory from '../Dashboard/SpendingByCategory';
import FinancialInsights from '../Dashboard/FinancialInsights';

// Define types for our dashboard data
interface DashboardData {
  netWorth: number;
  recentTransactions: any[]; // Replace 'any' with a proper transaction type when available
  spendingByCategory: any[]; // Replace 'any' with a proper spending category type when available
  financialInsights: string[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Implement API call to fetch dashboard data
        // For now, we'll use mock data
        const mockData: DashboardData = {
          netWorth: 50000,
          recentTransactions: [],
          spendingByCategory: [],
          financialInsights: ['You\'re on track with your savings goal', 'Consider reducing dining out expenses']
        };

        setDashboardData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Typography>Loading dashboard data...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!dashboardData) {
    return <Typography>No dashboard data available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <NetWorth netWorth={dashboardData.netWorth} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RecentTransactions transactions={dashboardData.recentTransactions} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SpendingByCategory categories={dashboardData.spendingByCategory} />
      </Grid>
      <Grid item xs={12} md={6}>
        <FinancialInsights insights={dashboardData.financialInsights} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;

// TODO: Implement API calls to fetch dashboard data
// TODO: Design and implement error handling and loading states
// TODO: Optimize performance for large datasets