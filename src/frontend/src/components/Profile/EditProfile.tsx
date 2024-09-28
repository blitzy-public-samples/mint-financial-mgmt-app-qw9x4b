import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/auth.service';
import { validateEmail, validatePassword } from '../../utils/validators';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUserData } from '../../store/slices/authSlice';
import { UserProfile } from '../../types/auth.types';

const EditProfile: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UserProfile>();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setValue('email', user.email);
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserProfile) => {
    setIsLoading(true);
    try {
      const updatedUser = await updateUserProfile(data);
      dispatch(updateUserData(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          {...register('email', {
            required: 'Email is required',
            validate: validateEmail
          })}
          error={errors.email?.message}
        />
        <Input
          label="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          error={errors.lastName?.message}
        />
        <Input
          label="New Password"
          type="password"
          {...register('password', {
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long'
            },
            validate: validatePassword
          })}
          error={errors.password?.message}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
```

This implementation of the EditProfile component includes the following features:

1. It uses react-hook-form for form handling and validation.
2. It fetches the current user data from the Redux store using the useAuth hook.
3. It handles form submission, including validation and error handling.
4. It uses the updateUserProfile service to update the user's profile.
5. It updates the Redux store with the new user data upon successful profile update.
6. It displays success or error messages using toast notifications.

Note that this implementation makes assumptions about the interfaces of the imported components and functions. You may need to adjust the implementation once the actual dependencies are available.

Human Tasks:
```
// TODO: Implement proper error handling and user feedback for failed API calls
// TODO: Add unit tests for the EditProfile component
// TODO: Implement form validation rules based on business requirements
// TODO: Ensure accessibility compliance (WCAG 2.1)