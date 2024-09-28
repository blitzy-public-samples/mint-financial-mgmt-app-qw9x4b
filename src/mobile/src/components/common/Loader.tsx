import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';

// Define the props interface for the Loader component
interface LoaderProps {
  size?: number | 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

// Define the Loader component
const Loader: React.FC<LoaderProps> = ({ size = 'large', color = '#1E88E5', style }) => {
  // Merge default styles with custom styles provided in props
  const containerStyle = [styles.container, style];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

// Define default styles for the loader container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;