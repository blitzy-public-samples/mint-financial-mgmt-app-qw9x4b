import React from 'react';
import { Chart as ChartJS, ChartData, ChartOptions } from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Define ChartProps interface
interface ChartProps {
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  data: ChartData<'line' | 'bar' | 'pie' | 'doughnut'>;
  options?: ChartOptions<'line' | 'bar' | 'pie' | 'doughnut'>;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ chartType, data, options, height = 300 }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} height={height} />;
      case 'bar':
        return <Bar data={data} options={options} height={height} />;
      case 'pie':
        return <Pie data={data} options={options} height={height} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} height={height} />;
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  };

  return (
    <div className="chart-container" style={{ height: `${height}px` }}>
      {renderChart()}
    </div>
  );
};

export default Chart;

// TODO: Implement proper error handling for invalid chart types or data
// TODO: Add accessibility features to the chart component
// TODO: Implement responsive design for different screen sizes