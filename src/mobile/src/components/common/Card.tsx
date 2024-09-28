import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// Define the props interface for the Card component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Card component definition
const Card: React.FC<CardProps> = ({ children, style }) => {
  // Merge default styles with custom styles provided in props
  const cardStyle = [styles.card, style];

  // Return a View component with the specified props and styles
  return <View style={cardStyle}>{children}</View>;
};

// Define default styles for the card
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default Card;