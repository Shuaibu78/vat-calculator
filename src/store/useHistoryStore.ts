/**
 * Zustand store for managing calculation history
 * Includes localStorage persistence for audit trail
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalculationResult } from '../utils/math';

interface HistoryState {
  history: CalculationResult[];
  maxHistorySize: number;
  addCalculation: (calculation: CalculationResult) => void;
  clearHistory: () => void;
  getHistory: () => CalculationResult[];
}

/**
 * History store with automatic localStorage persistence
 * Maintains the last 10 calculations by default
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      maxHistorySize: 10,

      /**
       * Adds a new calculation to the history
       * Automatically maintains the maximum history size (FIFO)
       */
      addCalculation: (calculation: CalculationResult) => {
        set((state) => {
          const newHistory = [calculation, ...state.history];
          
          // Keep only the last N calculations
          if (newHistory.length > state.maxHistorySize) {
            newHistory.pop();
          }

          return { history: newHistory };
        });
      },

      /**
       * Clears all calculation history
       */
      clearHistory: () => {
        set({ history: [] });
      },

      /**
       * Returns the current history (most recent first)
       */
      getHistory: () => {
        return get().history;
      },
    }),
    {
      name: 'vat-calculator-history', // localStorage key
      version: 1, // For future migrations if needed
    }
  )
);

