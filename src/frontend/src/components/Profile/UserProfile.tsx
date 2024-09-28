import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { User } from '../../types/auth.types';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userData = await fetchUserProfile(user.id);
          setProfileData(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // TODO: Implement proper error handling
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!profileData) {
    return <div>Loading...</div>; // TODO: Implement a proper loading state
  }

  return (
    <Card>
      <h2>User Profile</h2>
      <div>
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        {/* Add more user information as needed */}
      </div>
      <Button onClick={() => {/* TODO: Implement navigation to EditProfile component */}}>
        Edit Profile
      </Button>
    </Card>
  );
};

const fetchUserProfile = async (userId: string): Promise<User> => {
  // TODO: Implement the API call to fetch user profile data
  // This is a placeholder implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        // Add more user properties as needed
      });
    }, 1000);
  });
};

export default UserProfile;

// TODO: Implement proper error handling for API calls
// TODO: Add loading state while fetching user data
// TODO: Implement unit tests for the UserProfile component