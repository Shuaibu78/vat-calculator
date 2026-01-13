/**
 * Custom hook for VAT calculator logic
 * Manages state and calculations with real-time updates
 * 
 * History saving strategy:
 * 1. Auto-saves after user stops typing (debounced 1.5s)
 * 2. Saves previous calculation when user clears input
 * 3. Also saves on blur/Enter as backup
 * 4. Prevents duplicate saves
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateVat, type CalculationMode, type CalculationResult } from '../utils/math';
import { useHistoryStore } from '../store/useHistoryStore';

interface UseVatCalculatorReturn {
  amount: string;
  vatRate: string;
  mode: CalculationMode;
  result: CalculationResult | null;
  setAmount: (value: string) => void;
  setVatRate: (value: string) => void;
  setMode: (mode: CalculationMode) => void;
  resetCalculator: () => void;
  saveToHistory: () => void;
  handleAmountBlur: () => void;
  handleAmountKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DEFAULT_VAT_RATE = '7.5'; // Nigerian VAT rate
const AUTO_SAVE_DELAY = 1500; // 1.5 seconds after user stops typing

/**
 * Hook for managing VAT calculator state and logic
 * Smart auto-save: waits for user to stop typing, saves on clear, blur, or Enter
 */
export function useVatCalculator(): UseVatCalculatorReturn {
  const [amount, setAmount] = useState<string>('');
  const [vatRate, setVatRate] = useState<string>(DEFAULT_VAT_RATE);
  const [mode, setMode] = useState<CalculationMode>('add');
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // Track last saved calculation key to avoid duplicates
  const lastSavedKeyRef = useRef<string>('');
  // Track the last valid result (to save when user clears)
  const lastValidResultRef = useRef<{ result: CalculationResult; key: string } | null>(null);
  // Debounce timer for auto-save
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Refs to store latest values for debounced save (to avoid stale closures)
  const latestAmountRef = useRef<string>('');
  const latestVatRateRef = useRef<string>(DEFAULT_VAT_RATE);
  const latestModeRef = useRef<CalculationMode>('add');
  const latestResultRef = useRef<CalculationResult | null>(null);

  const addCalculation = useHistoryStore((state) => state.addCalculation);

  /**
   * Creates a unique key for a calculation
   */
  const createCalculationKey = useCallback((calcResult: CalculationResult, calcMode: CalculationMode): string => {
    return `${calcResult.priceExcludingVat.toFixed(2)}-${calcResult.vatRate}-${calcMode}-${calcResult.priceIncludingVat.toFixed(2)}`;
  }, []);

  /**
   * Saves a calculation to history (with duplicate check)
   */
  const saveCalculation = useCallback((calcResult: CalculationResult, key: string) => {
    // Don't save if this is the same as the last saved calculation
    if (lastSavedKeyRef.current === key) return false;

    // Save to history
    addCalculation(calcResult);
    lastSavedKeyRef.current = key;
    return true;
  }, [addCalculation]);

  /**
   * Performs the VAT calculation based on current inputs
   * Updates display in real-time
   */
  const performCalculation = useCallback(() => {
    // Parse inputs
    const amountNum = parseFloat(amount);
    const vatRateNum = parseFloat(vatRate);

    // Validate inputs
    if (
      isNaN(amountNum) ||
      isNaN(vatRateNum) ||
      amountNum < 0 ||
      vatRateNum < 0 ||
      vatRateNum > 100 ||
      amount === '' ||
      vatRate === ''
    ) {
      setResult(null);
      return;
    }

    try {
      // Calculate VAT
      const calculationResult = calculateVat(amountNum, vatRateNum, mode);
      setResult(calculationResult);
      
      // Update refs with latest values for debounced save
      latestAmountRef.current = amount;
      latestVatRateRef.current = vatRate;
      latestModeRef.current = mode;
      latestResultRef.current = calculationResult;
      
      // Store as last valid result (for saving when cleared)
      if (amountNum > 0) {
        const key = createCalculationKey(calculationResult, mode);
        lastValidResultRef.current = { result: calculationResult, key };
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setResult(null);
      latestResultRef.current = null;
    }
  }, [amount, vatRate, mode, createCalculationKey]);

  /**
   * Recalculate whenever inputs change (real-time calculation for display)
   */
  useEffect(() => {
    performCalculation();
  }, [performCalculation]);

  /**
   * Saves the current calculation to history
   */
  const saveToHistory = useCallback(() => {
    if (!result) return;

    const amountNum = parseFloat(amount);
    
    // Don't save if amount is 0 or empty
    if (isNaN(amountNum) || amountNum <= 0) return;

    const key = createCalculationKey(result, mode);
    saveCalculation(result, key);
  }, [result, amount, mode, createCalculationKey, saveCalculation]);

  /**
   * Schedules an auto-save after user stops typing
   * Uses refs to ensure we save the latest values, not stale closures
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule new save using refs (always reads latest values)
    debounceTimerRef.current = setTimeout(() => {
      const currentResult = latestResultRef.current;
      const currentAmount = latestAmountRef.current;
      const currentMode = latestModeRef.current;
      
      if (!currentResult) {
        debounceTimerRef.current = null;
        return;
      }

      const amountNum = parseFloat(currentAmount);
      
      // Don't save if amount is 0 or empty
      if (isNaN(amountNum) || amountNum <= 0) {
        debounceTimerRef.current = null;
        return;
      }

      const key = createCalculationKey(currentResult, currentMode);
      
      // Don't save if this is the same as the last saved calculation
      if (lastSavedKeyRef.current === key) {
        debounceTimerRef.current = null;
        return;
      }

      // Save to history
      saveCalculation(currentResult, key);
      debounceTimerRef.current = null;
    }, AUTO_SAVE_DELAY);
  }, [createCalculationKey, saveCalculation]);

  /**
   * Handles blur event on amount input
   * Immediately saves any pending calculation
   */
  const handleAmountBlur = useCallback(() => {
    // Clear debounce timer (we're saving now)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    saveToHistory();
  }, [saveToHistory]);

  /**
   * Handles keydown event on amount input
   * Saves calculation when user presses Enter
   */
  const handleAmountKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      saveToHistory();
      e.currentTarget.blur();
    }
  }, [saveToHistory]);

  /**
   * Resets the calculator to default state
   * Saves current calculation before reset if valid
   */
  const resetCalculator = useCallback(() => {
    // Save current calculation before reset
    if (result) {
      saveToHistory();
    }
    
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    setAmount('');
    setVatRate(DEFAULT_VAT_RATE);
    setMode('add');
    setResult(null);
    
    // Reset refs
    latestAmountRef.current = '';
    latestVatRateRef.current = DEFAULT_VAT_RATE;
    latestModeRef.current = 'add';
    latestResultRef.current = null;
    lastValidResultRef.current = null;
  }, [result, saveToHistory]);

  /**
   * Custom setter for amount with validation
   * Handles auto-save logic:
   * - Saves previous calculation when clearing
   * - Schedules auto-save when typing
   */
  const handleSetAmount = useCallback((value: string) => {
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const previousAmount = amount;
      
      // Update ref immediately so debounced save has latest value
      latestAmountRef.current = value;
      
      // If user is clearing the input (had a value, now empty)
      if (previousAmount !== '' && value === '') {
        // Save the last valid calculation before clearing
        if (lastValidResultRef.current) {
          saveCalculation(lastValidResultRef.current.result, lastValidResultRef.current.key);
        }
        // Clear debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        // Clear last valid result
        lastValidResultRef.current = null;
        latestResultRef.current = null;
      }
      // If user is typing a new value
      else if (value !== '' && value !== previousAmount) {
        // Schedule auto-save after typing stops
        // Note: calculation will update latestResultRef in performCalculation
        scheduleAutoSave();
      }
      
      setAmount(value);
    }
  }, [amount, scheduleAutoSave, saveCalculation]);

  /**
   * Custom setter for VAT rate with validation
   */
  const handleSetVatRate = useCallback((value: string) => {
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Update ref immediately
      latestVatRateRef.current = value;
      setVatRate(value);
      // Schedule auto-save if there's a valid amount
      if (amount !== '' && value !== vatRate) {
        scheduleAutoSave();
      }
    }
  }, [amount, vatRate, scheduleAutoSave]);

  /**
   * Custom setter for mode
   * Saves current calculation when changing modes
   */
  const handleSetMode = useCallback((newMode: CalculationMode) => {
    if (newMode !== mode && amount !== '') {
      // Save current calculation before mode change
      saveToHistory();
    }
    // Update ref immediately
    latestModeRef.current = newMode;
    setMode(newMode);
  }, [mode, amount, saveToHistory]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    amount,
    vatRate,
    mode,
    result,
    setAmount: handleSetAmount,
    setVatRate: handleSetVatRate,
    setMode: handleSetMode,
    resetCalculator,
    saveToHistory,
    handleAmountBlur,
    handleAmountKeyDown,
  };
}

