import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CreditScoreGauge from '../../components/CreditScore/CreditScoreGauge';
import useCreditScore from '../../hooks/useCreditScore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CreditScoreOverviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const { creditScore, loading, error } = useCreditScore();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const getCreditScoreRating = (score: number): string => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const keyFactors = [
    'Payment History',
    'Credit Utilization',
    'Length of Credit History',
    'Credit Mix',
    'Recent Credit Inquiries'
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.scoreCard}>
        <CreditScoreGauge score={creditScore} />
        <Text style={styles.scoreText}>Your Credit Score: {creditScore}</Text>
        <Text style={styles.ratingText}>
          Rating: {getCreditScoreRating(creditScore)}
        </Text>
      </Card>

      <Card style={styles.factorsCard}>
        <Text style={styles.factorsTitle}>Key Factors Affecting Your Score:</Text>
        {keyFactors.map((factor, index) => (
          <Text key={index} style={styles.factor}>• {factor}</Text>
        ))}
      </Card>

      <Button
        title="View Credit Score History"
        onPress={() => navigation.navigate('CreditScoreHistory' as never)}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  ratingText: {
    fontSize: 18,
    marginTop: 8,
  },
  factorsCard: {
    padding: 16,
    marginBottom: 16,
  },
  factorsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  factor: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
  },
});

export default CreditScoreOverviewScreen;