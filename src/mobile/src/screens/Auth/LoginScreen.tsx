import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigate to the main app screen after successful login
      // navigation.navigate('MainApp');
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
      // Show error message to the user
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    // navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    // Navigate to the register screen
    // navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
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
  link: {
    color: 'blue',
    marginTop: 15,
  },
});

export default LoginScreen;

// TODO: Implement proper error handling and display error messages to the user
// TODO: Add input validation for email and password fields
// TODO: Implement loading state while authentication is in progress
// TODO: Add support for biometric authentication if available on the device