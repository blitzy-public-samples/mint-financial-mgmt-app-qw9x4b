import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Paper, Button, CircularProgress } from '@material-ui/core';
import { useInvestments } from '../../hooks/useInvestments';
import Chart from '../Common/Chart';

interface Investment {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  initialInvestment: number;
  purchaseDate: string;
  historicalData: { date: string; value: number }[];
}

const InvestmentDetails: React.FC = () => {
  const { investmentId } = useParams<{ investmentId: string }>();
  const { getInvestment, loading, error } = useInvestments();
  const [investment, setInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      if (investmentId) {
        const data = await getInvestment(investmentId);
        setInvestment(data);
      }
    };
    fetchInvestment();
  }, [investmentId, getInvestment]);

  const calculateROI = (currentValue: number, initialInvestment: number): number => {
    return ((currentValue - initialInvestment) / initialInvestment) * 100;
  };

  const calculateAnnualizedReturn = (currentValue: number, initialInvestment: number, yearsHeld: number): number => {
    return (Math.pow(currentValue / initialInvestment, 1 / yearsHeld) - 1) * 100;
  };

  const prepareChartData = (historicalData: { date: string; value: number }[]) => {
    return {
      labels: historicalData.map(item => item.date),
      datasets: [
        {
          label: 'Investment Value',
          data: historicalData.map(item => item.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!investment) {
    return <Typography>Investment not found</Typography>;
  }

  const yearsHeld = (new Date().getTime() - new Date(investment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  const roi = calculateROI(investment.currentValue, investment.initialInvestment);
  const annualizedReturn = calculateAnnualizedReturn(investment.currentValue, investment.initialInvestment, yearsHeld);
  const chartData = prepareChartData(investment.historicalData);

  return (
    <Paper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">{investment.name}</Typography>
          <Typography variant="subtitle1">{investment.type}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Current Value</Typography>
          <Typography variant="h4">${investment.currentValue.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Initial Investment</Typography>
          <Typography variant="h4">${investment.initialInvestment.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">ROI</Typography>
          <Typography variant="h4">{roi.toFixed(2)}%</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Annualized Return</Typography>
          <Typography variant="h4">{annualizedReturn.toFixed(2)}%</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Historical Performance</Typography>
          <Chart data={chartData} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Buy
          </Button>
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Sell
          </Button>
          <Button variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
            Update
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InvestmentDetails;

// TODO: Implement error handling for failed data fetching
// TODO: Add form validation for buy/sell actions
// TODO: Implement responsive design for mobile devices
// TODO: Add unit tests for the component and helper functions
// TODO: Integrate with a real-time data feed for live investment updates