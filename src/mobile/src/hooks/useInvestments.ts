import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setInvestments, setLoading, setError } from '../store/slices/investmentSlice';
import { RootState } from '../store';
import { Investment } from '../types/investment.types';

// Since we don't have the actual implementation of the investment service,
// we'll create a mock service for demonstration purposes
const mockInvestmentService = {
  fetchInvestments: (): Promise<Investment[]> => 
    Promise.resolve([
      { id: '1', name: 'Stock A', value: 1000, type: 'stock' },
      { id: '2', name: 'Bond B', value: 2000, type: 'bond' },
    ]),
  addInvestment: (investment: Omit<Investment, 'id'>): Promise<Investment> =>
    Promise.resolve({ ...investment, id: Math.random().toString() }),
  updateInvestment: (investment: Investment): Promise<Investment> =>
    Promise.resolve(investment),
  deleteInvestment: (id: string): Promise<void> =>
    Promise.resolve(),
};

export const useInvestments = () => {
  const dispatch = useDispatch();
  const { investments, loading, error } = useSelector((state: RootState) => state.investment);

  const fetchInvestments = async () => {
    try {
      dispatch(setLoading(true));
      const fetchedInvestments = await mockInvestmentService.fetchInvestments();
      dispatch(setInvestments(fetchedInvestments));
    } catch (err) {
      dispatch(setError('Failed to fetch investments'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    try {
      dispatch(setLoading(true));
      const newInvestment = await mockInvestmentService.addInvestment(investment);
      dispatch(setInvestments([...investments, newInvestment]));
    } catch (err) {
      dispatch(setError('Failed to add investment'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateInvestment = async (investment: Investment) => {
    try {
      dispatch(setLoading(true));
      const updatedInvestment = await mockInvestmentService.updateInvestment(investment);
      const updatedInvestments = investments.map(inv => 
        inv.id === updatedInvestment.id ? updatedInvestment : inv
      );
      dispatch(setInvestments(updatedInvestments));
    } catch (err) {
      dispatch(setError('Failed to update investment'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      dispatch(setLoading(true));
      await mockInvestmentService.deleteInvestment(id);
      const updatedInvestments = investments.filter(inv => inv.id !== id);
      dispatch(setInvestments(updatedInvestments));
    } catch (err) {
      dispatch(setError('Failed to delete investment'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for investment data fetching
// TODO: Add caching mechanism to reduce API calls for frequently accessed investment data