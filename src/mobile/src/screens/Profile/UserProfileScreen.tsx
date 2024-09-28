import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  // Assuming user object structure based on typical profile information
  const { name, email } = user || {};

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Assuming logout redirects to the login screen or handles navigation
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (show an alert, for example)
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.title}>User Profile</Text>
        <Input
          label="Name"
          value={name}
          editable={false}
        />
        <Input
          label="Email"
          value={email}
          editable={false}
        />
      </View>
      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          style={styles.button}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          style={[styles.button, styles.logoutButton]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
  },
});

export default UserProfileScreen;
```

This implementation follows the specifications provided in the JSON representation and incorporates the following features:

1. It uses the `useAuth` hook to get the current user's information and logout functionality.
2. The `useNavigation` hook is used to handle navigation to the edit profile screen.
3. The user's profile information (name and email) is displayed using the `Input` component, set to non-editable mode.
4. Two buttons are provided: one for editing the profile and another for logging out.
5. The component is wrapped in a `ScrollView` to ensure scrollability on smaller screens or if more content is added in the future.
6. Basic styling is applied to create a clean and user-friendly layout.

Note that this implementation makes some assumptions about the `Button`, `Input`, and `useAuth` interfaces since their actual implementations were not available. You may need to adjust the component props or hook usage based on the actual implementations of these dependencies.

Human Tasks:
```
1. Implement actual user data fetching logic in the useAuth hook
2. Design and implement the layout for the user profile screen
3. Implement navigation to the EditProfileScreen
4. Implement logout functionality