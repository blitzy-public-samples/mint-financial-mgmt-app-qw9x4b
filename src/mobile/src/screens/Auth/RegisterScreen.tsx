import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigation = useNavigation();
  const { register } = useAuth();

  const handleRegister = async () => {
    // Reset error states
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === confirmPassword;

    if (!isEmailValid) {
      setEmailError('Please enter a valid email address');
    }

    if (!isPasswordValid) {
      setPasswordError('Password must be at least 8 characters long and contain at least one number and one special character');
    }

    if (!doPasswordsMatch) {
      setConfirmPasswordError('Passwords do not match');
    }

    if (isEmailValid && isPasswordValid && doPasswordsMatch) {
      try {
        await register(email, password);
        // Navigate to dashboard or show success message
        Alert.alert('Success', 'Registration successful!');
        // navigation.navigate('Dashboard'); // Uncomment when Dashboard is implemented
      } catch (error) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={passwordError}
      />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={confirmPasswordError}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Log in
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
  },
  loginLink: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

// TODO: Implement proper error handling and user feedback for registration failures
// TODO: Add terms and conditions checkbox
// TODO: Add additional form fields if required (e.g., name, phone number)
// TODO: Implement password strength indicator