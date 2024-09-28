import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { investmentService } from '../services/investment.service';
import { setInvestments, addInvestment, updateInvestment, deleteInvestment } from '../store/slices/investmentSlice';
import { Investment, InvestmentFormData } from '../types/investment.types';
import { RootState } from '../store';

// Interval for fetching investments (5 minutes)
const INVESTMENT_FETCH_INTERVAL = 300000;

export const useInvestments = () => {
  const dispatch = useDispatch();
  const investments = useSelector((state: RootState) => state.investments.investments);

  const fetchInvestments = useCallback(async () => {
    try {
      const fetchedInvestments = await investmentService.getInvestments();
      dispatch(setInvestments(fetchedInvestments));
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error fetching investments:', error);
    }
  }, [dispatch]);

  const createInvestment = useCallback(async (investmentData: InvestmentFormData) => {
    try {
      const newInvestment = await investmentService.createInvestment(investmentData);
      dispatch(addInvestment(newInvestment));
      return newInvestment;
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error creating investment:', error);
      throw error;
    }
  }, [dispatch]);

  const updateInvestmentById = useCallback(async (id: string, investmentData: Partial<InvestmentFormData>) => {
    try {
      const updatedInvestment = await investmentService.updateInvestment(id, investmentData);
      dispatch(updateInvestment(updatedInvestment));
      return updatedInvestment;
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error updating investment:', error);
      throw error;
    }
  }, [dispatch]);

  const deleteInvestmentById = useCallback(async (id: string) => {
    try {
      await investmentService.deleteInvestment(id);
      dispatch(deleteInvestment(id));
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error deleting investment:', error);
      throw error;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchInvestments();
    const intervalId = setInterval(fetchInvestments, INVESTMENT_FETCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchInvestments]);

  return {
    investments,
    fetchInvestments,
    createInvestment,
    updateInvestmentById,
    deleteInvestmentById,
  };
};

// TODO: Implement error handling and loading states
// TODO: Add unit tests for the useInvestments hook
// TODO: Implement caching mechanism to reduce API calls