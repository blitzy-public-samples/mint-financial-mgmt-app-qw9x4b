import React, { useState, useEffect } from 'react';
import { Card } from '../Common/Card';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { FinancialInsight } from '../../types';

// Function to fetch financial insights from the API
const fetchFinancialInsights = async (): Promise<FinancialInsight[]> => {
  try {
    const response = await api.get('/financial-insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial insights:', error);
    throw error;
  }
};

const FinancialInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const fetchedInsights = await fetchFinancialInsights();
        setInsights(fetchedInsights);
        setError(null);
      } catch (err) {
        setError('Failed to load financial insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadInsights();
    }
  }, [user]);

  if (!user) {
    return null; // Don't render anything if the user is not authenticated
  }

  return (
    <Card title="Financial Insights">
      {loading && <p>Loading financial insights...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ul className="financial-insights-list">
          {insights.map((insight, index) => (
            <li key={index} className="financial-insight-item">
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>
              {insight.actionItem && (
                <button className="action-button">{insight.actionItem}</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default FinancialInsights;

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add unit tests for the FinancialInsights component
// TODO: Implement pagination or infinite scrolling for large numbers of insights