import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUserProfile } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async () => {
    // Validate form inputs
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Call API to update user profile
      await updateUserProfile({
        firstName,
        lastName,
        email,
        password: password ? password : undefined,
      });

      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Input
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />
      <Input
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="New Password (optional)"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        secureTextEntry
      />
      <Input
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        secureTextEntry
      />
      <Button title="Update Profile" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default EditProfileScreen;

// TODO: Implement actual API call to update user profile in the backend
// TODO: Add form validation logic for email, password, and other fields
// TODO: Implement proper error handling and user feedback mechanisms