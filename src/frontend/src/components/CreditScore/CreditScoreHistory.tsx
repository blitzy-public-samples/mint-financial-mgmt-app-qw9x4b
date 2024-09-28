import React from 'react';
import styled from 'styled-components';
import { Chart } from '../Common/Chart';
import { useCreditScore } from '../../hooks/useCreditScore';
import { CreditScoreData } from '../../types/creditScore.types';

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const EventList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EventItem = styled.li`
  margin-bottom: 10px;
`;

const InsightSection = styled.div`
  margin-top: 20px;
`;

// Helper functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const calculateScoreChange = (previousScore: number, currentScore: number): { value: number; direction: 'positive' | 'negative' | 'neutral' } => {
  const change = currentScore - previousScore;
  return {
    value: Math.abs(change),
    direction: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
  };
};

const CreditScoreHistory: React.FC = () => {
  const { creditScoreHistory, isLoading, error } = useCreditScore();

  if (isLoading) {
    return <div>Loading credit score history...</div>;
  }

  if (error) {
    return <div>Error loading credit score history: {error.message}</div>;
  }

  if (!creditScoreHistory || creditScoreHistory.length === 0) {
    return <div>No credit score history available.</div>;
  }

  const chartData = creditScoreHistory.map((item: CreditScoreData) => ({
    date: formatDate(new Date(item.date)),
    score: item.score,
  }));

  return (
    <Container>
      <Title>Credit Score History</Title>
      <Chart data={chartData} xAxis="date" yAxis="score" />
      
      <EventList>
        {creditScoreHistory.map((item: CreditScoreData, index: number) => {
          const change = index > 0 ? calculateScoreChange(creditScoreHistory[index - 1].score, item.score) : null;
          return (
            <EventItem key={item.date}>
              {formatDate(new Date(item.date))}: {item.score}
              {change && (
                <span style={{ color: change.direction === 'positive' ? 'green' : change.direction === 'negative' ? 'red' : 'gray' }}>
                  {' '}
                  ({change.direction === 'positive' ? '+' : ''}{change.value})
                </span>
              )}
              {item.factors && item.factors.length > 0 && (
                <ul>
                  {item.factors.map((factor, factorIndex) => (
                    <li key={factorIndex}>{factor}</li>
                  ))}
                </ul>
              )}
            </EventItem>
          );
        })}
      </EventList>

      <InsightSection>
        <h3>Insights and Recommendations</h3>
        <ul>
          <li>Maintain low credit card balances to improve your credit utilization ratio.</li>
          <li>Always pay your bills on time to maintain a positive payment history.</li>
          <li>Avoid applying for new credit unless necessary to minimize hard inquiries.</li>
          <li>Keep old credit accounts open to increase the average age of your credit history.</li>
        </ul>
      </InsightSection>
    </Container>
  );
};

export default CreditScoreHistory;

// TODO: Implement error handling for failed API requests in the useCreditScore hook
// TODO: Add accessibility attributes to the credit score history chart and list items
// TODO: Implement unit tests for the CreditScoreHistory component
// TODO: Optimize the rendering of large datasets in the history chart