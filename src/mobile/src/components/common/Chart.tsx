import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { VictoryChart, VictoryLine, VictoryBar, VictoryPie, VictoryTheme, VictoryAxis } from 'victory-native';

// Define the ChartData interface
interface ChartData {
  x: number | string;
  y: number;
}

// Define the ChartProps interface
interface ChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'pie';
  title?: string;
  style?: ViewStyle;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Define the Chart component
const Chart: React.FC<ChartProps> = ({ data, type, title, style, xAxisLabel, yAxisLabel }) => {
  // Define default styles for the chart container
  const defaultStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });

  // Merge default styles with custom styles provided in props
  const containerStyle = { ...defaultStyles.container, ...style };

  // Helper function to render the appropriate chart type
  const renderChart = (type: 'line' | 'bar' | 'pie', data: ChartData[]): JSX.Element => {
    switch (type) {
      case 'line':
        return <VictoryLine data={data} />;
      case 'bar':
        return <VictoryBar data={data} />;
      case 'pie':
        return <VictoryPie data={data} />;
      default:
        return <VictoryLine data={data} />;
    }
  };

  return (
    <View style={containerStyle}>
      {title && <View style={defaultStyles.title}>{title}</View>}
      <VictoryChart theme={VictoryTheme.material}>
        {renderChart(type, data)}
        {xAxisLabel && <VictoryAxis label={xAxisLabel} />}
        {yAxisLabel && <VictoryAxis dependentAxis label={yAxisLabel} />}
      </VictoryChart>
    </View>
  );
};

export default Chart;

// Commented list of human tasks
/*
Human tasks:
1. Implement color customization for charts (Optional)
2. Add support for additional chart types (e.g., area, scatter) (Optional)
*/