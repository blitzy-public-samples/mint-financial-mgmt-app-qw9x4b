import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { forgotPassword } from '../../services/auth.service';
import { validateEmail } from '../../utils/validators';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || 'Password reset email sent. Please check your inbox.');
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          aria-label="Email"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </Button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <Button onClick={() => navigate('/login')} variant="text">
        Back to Login
      </Button>
    </div>
  );
};

export default ForgotPassword;

// TODO: Implement proper error handling and user feedback mechanisms
// TODO: Ensure accessibility compliance (WCAG 2.1)
// TODO: Implement rate limiting to prevent abuse