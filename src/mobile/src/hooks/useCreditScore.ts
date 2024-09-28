import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCreditScore, updateCreditScore } from '../store/slices/creditScoreSlice';
import { CreditScore } from '../types/creditScore.types';
import { RootState } from '../store';

const useCreditScore = () => {
  const dispatch = useDispatch();
  const creditScore = useSelector((state: RootState) => state.creditScore);

  const fetchCreditScoreData = () => {
    dispatch(fetchCreditScore());
  };

  const refreshCreditScore = () => {
    dispatch(updateCreditScore());
  };

  useEffect(() => {
    fetchCreditScoreData();
  }, []);

  return {
    creditScore,
    fetchCreditScoreData,
    refreshCreditScore,
  };
};

export default useCreditScore;

// TODO: Implement error handling for API calls in the creditScoreSlice
// TODO: Add loading state management for credit score data fetching
// TODO: Implement caching mechanism to reduce unnecessary API calls (Optional)