/**
 * Main VAT Calculator Form Component
 * Handles user input and displays calculation results
 */

import { Calculator, Plus, Minus, RotateCcw, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useVatCalculator } from '../../hooks/useVatCalculator';
import { formatCurrency } from '../../utils/format';
import type { CalculationMode } from '../../utils/math';

export function CalculatorForm() {
  const {
    amount,
    vatRate,
    mode,
    result,
    setAmount,
    setVatRate,
    setMode,
    resetCalculator,
    handleAmountBlur,
    handleAmountKeyDown,
  } = useVatCalculator();

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode);
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calculator className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">VAT Calculator</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Calculate VAT for Nigerian businesses
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Calculation Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleModeChange('add')}
              className={`
                group relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200
                ${
                  mode === 'add'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-md scale-[1.02]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                }
              `}
              aria-pressed={mode === 'add'}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                mode === 'add' ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-orange-100'
              }`}>
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="font-semibold text-sm">Add VAT</span>
                <p className="text-xs opacity-75 mt-0.5">Price → Total</p>
              </div>
              {mode === 'add' && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => handleModeChange('extract')}
              className={`
                group relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200
                ${
                  mode === 'extract'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-md scale-[1.02]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                }
              `}
              aria-pressed={mode === 'extract'}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                mode === 'extract' ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-orange-100'
              }`}>
                <Minus className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="font-semibold text-sm">Extract VAT</span>
                <p className="text-xs opacity-75 mt-0.5">Total → Price</p>
              </div>
              {mode === 'extract' && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          {/* Amount Input */}
          <Input
            label={mode === 'add' ? 'Price (Excluding VAT)' : 'Total Price (Including VAT)'}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={handleAmountBlur}
            onKeyDown={handleAmountKeyDown}
            helperText="Auto-saves after you stop typing"
            className="text-lg font-medium"
          />

          {/* VAT Rate Input */}
          <Input
            label="VAT Rate (%)"
            type="text"
            inputMode="decimal"
            placeholder="7.5"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            helperText="Default: 7.5% (Nigerian VAT)"
          />
        </div>

        {/* Results Display */}
        {result ? (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />
            <div className="relative p-5 rounded-xl border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  Calculation Results
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Price Excl. VAT</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatCurrency(result.priceExcludingVat)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">VAT Amount ({result.vatRate}%)</span>
                  <span className="text-base font-semibold text-orange-600">
                    {formatCurrency(result.vatAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 pb-1">
                  <span className="text-base font-bold text-gray-800">
                    Total Incl. VAT
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatCurrency(result.priceIncludingVat)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Enter values above to see calculation results
            </p>
          </div>
        )}

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full group"
          onClick={resetCalculator}
        >
          <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Reset Calculator
        </Button>
      </CardContent>
    </Card>
  );
}

