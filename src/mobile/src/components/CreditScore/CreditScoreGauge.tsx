import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// TODO: Import actual theme once it's available
// import { theme } from '../../constants/theme';

interface CreditScoreGaugeProps {
  score: number;
  size: number;
}

const calculateColor = (score: number): string => {
  if (score < 580) return '#FF0000'; // Red
  if (score < 670) return '#FFA500'; // Orange
  if (score < 740) return '#FFFF00'; // Yellow
  if (score < 800) return '#90EE90'; // Light Green
  return '#008000'; // Dark Green
};

const calculateArcLength = (score: number, radius: number): number => {
  const percentage = score / 850;
  return percentage * 2 * Math.PI * radius;
};

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, size }) => {
  const radius = size / 2;
  const strokeWidth = size / 10;
  const color = calculateColor(score);
  const arcLength = calculateArcLength(score, radius - strokeWidth / 2);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Colored arc */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${2 * Math.PI * (radius - strokeWidth / 2)}`}
          strokeLinecap="round"
        />
        {/* Score text */}
        <SvgText
          x={radius}
          y={radius}
          fontSize={size / 5}
          fontWeight="bold"
          fill="#333333"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {score}
        </SvgText>
      </Svg>
      {/* Labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>Poor</Text>
        <Text style={styles.label}>Fair</Text>
        <Text style={styles.label}>Good</Text>
        <Text style={styles.label}>Excellent</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
});

export default CreditScoreGauge;

// TODO: Confirm the exact color codes for different credit score ranges
// TODO: Verify the credit score ranges (poor, fair, good, excellent) with the product team