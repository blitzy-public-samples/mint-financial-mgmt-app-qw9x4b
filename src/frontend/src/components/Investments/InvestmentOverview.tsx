import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { useInvestments } from '../../hooks/useInvestments';
import Chart from '../Common/Chart';

interface Investment {
  id: string;
  name: string;
  value: number;
  initialInvestment: number;
  assetType: string;
}

const InvestmentOverview: React.FC = () => {
  const { investments, isLoading, error } = useInvestments();

  const calculatePerformance = (investments: Investment[]): number => {
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.value, 0);
    const totalInitialValue = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0);
    return ((totalCurrentValue - totalInitialValue) / totalInitialValue) * 100;
  };

  const prepareChartData = (investments: Investment[]) => {
    const assetTypes = Array.from(new Set(investments.map(inv => inv.assetType)));
    const data = assetTypes.map(type => {
      return investments
        .filter(inv => inv.assetType === type)
        .reduce((sum, inv) => sum + inv.value, 0);
    });

    return {
      labels: assetTypes,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  };

  if (isLoading) {
    return <Typography>Loading investment data...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading investment data: {error.message}</Typography>;
  }

  if (!investments || investments.length === 0) {
    return <Typography>No investment data available.</Typography>;
  }

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const performance = calculatePerformance(investments);
  const chartData = prepareChartData(investments);

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Investment Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Total Portfolio Value</Typography>
          <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Overall Performance</Typography>
          <Typography variant="h4" color={performance >= 0 ? 'primary' : 'error'}>
            {performance.toFixed(2)}%
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Asset Allocation</Typography>
          <Chart type="pie" data={chartData} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Top Performing Investments</Typography>
          {investments
            .sort((a, b) => (b.value - b.initialInvestment) - (a.value - a.initialInvestment))
            .slice(0, 5)
            .map(inv => (
              <Typography key={inv.id}>
                {inv.name}: ${(inv.value - inv.initialInvestment).toFixed(2)}
              </Typography>
            ))
          }
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InvestmentOverview;

// TODO: Implement error handling for failed data fetching
// TODO: Add loading state while fetching investment data
// TODO: Implement responsive design for mobile devices
// TODO: Add unit tests for the component and helper functions