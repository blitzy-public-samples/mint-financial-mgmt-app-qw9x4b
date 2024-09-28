import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import * as authService from '../../services/auth.service';
import { validateEmail } from '../../utils/validators';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      if (!validateEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }

      // Show loading indicator
      // TODO: Implement a loading indicator

      await authService.forgotPassword(email);
      Alert.alert(
        'Password Reset',
        'If an account exists for this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
      console.error('Password reset error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;

// TODO: Implement proper error handling and user feedback mechanisms
// TODO: Ensure the screen is accessible and follows mobile UI/UX best practices
// TODO: Add loading indicator while the password reset request is being processed
// TODO: Implement input validation with proper error messages