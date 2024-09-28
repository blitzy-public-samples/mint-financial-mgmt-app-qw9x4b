import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

// Define the props interface for the Button component
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

// Define the Button component
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  // Merge default styles with custom styles provided in props
  const buttonStyle = [styles.button, style, disabled && styles.disabledButton];
  const buttonTextStyle = [styles.buttonText, textStyle, disabled && styles.disabledText];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Define default styles for the button
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E88E5', // Primary color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD', // Disabled color
  },
  disabledText: {
    color: '#757575', // Disabled text color
  },
});

export default Button;