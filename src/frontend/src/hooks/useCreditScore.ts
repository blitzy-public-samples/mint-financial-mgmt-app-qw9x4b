import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreditScore, updateCreditScore } from '../store/slices/creditScoreSlice';
import { CreditScore } from '../types/creditScore.types';
import { RootState } from '../store';

const useCreditScore = () => {
  const dispatch = useDispatch();
  const creditScore = useSelector((state: RootState) => state.creditScore);

  const fetchUserCreditScore = () => {
    dispatch(fetchCreditScore());
  };

  const refreshCreditScore = () => {
    dispatch(updateCreditScore());
  };

  useEffect(() => {
    fetchUserCreditScore();
  }, []);

  return {
    creditScore,
    fetchUserCreditScore,
    refreshCreditScore,
  };
};

export default useCreditScore;

// TODO: Implement error handling for credit score fetching and updating
// TODO: Add loading state management for credit score operations
// TODO: Implement caching mechanism to prevent unnecessary API calls