import React from 'react';
import styled from 'styled-components';
import { CreditScoreData } from '../../types/creditScore.types';
import { useCreditScore } from '../../hooks/useCreditScore';
import { Chart } from '../Common/Chart';

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScoreDisplay = styled.div`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const FactorsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FactorItem = styled.li`
  margin-bottom: 10px;
`;

const AlertContainer = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 10px;
  margin-top: 20px;
`;

// Helper functions
const formatCreditScore = (score: number): string => {
  return Math.round(score).toString();
};

const getCreditScoreColor = (score: number): string => {
  if (score >= 800) return '#00c853';
  if (score >= 740) return '#64dd17';
  if (score >= 670) return '#ffd600';
  if (score >= 580) return '#ff9100';
  return '#ff3d00';
};

// Main component
const CreditScoreOverview: React.FC = () => {
  const { creditScore, loading, error } = useCreditScore();

  if (loading) {
    return <div>Loading credit score data...</div>;
  }

  if (error) {
    return <div>Error loading credit score data: {error.message}</div>;
  }

  if (!creditScore) {
    return <div>No credit score data available.</div>;
  }

  const { currentScore, history, factors, alerts } = creditScore;

  return (
    <Container>
      <h2>Credit Score Overview</h2>
      <ScoreDisplay style={{ color: getCreditScoreColor(currentScore) }}>
        {formatCreditScore(currentScore)}
      </ScoreDisplay>
      
      <Chart data={history} />
      
      <h3>Key Factors Affecting Your Score</h3>
      <FactorsList>
        {factors.map((factor, index) => (
          <FactorItem key={index}>{factor}</FactorItem>
        ))}
      </FactorsList>
      
      {alerts.length > 0 && (
        <AlertContainer>
          <h4>Alerts and Recommendations</h4>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </AlertContainer>
      )}
    </Container>
  );
};

export default CreditScoreOverview;

// TODO: Implement error handling for failed API requests in the useCreditScore hook
// TODO: Add accessibility attributes to the credit score display and chart
// TODO: Implement unit tests for the CreditScoreOverview component