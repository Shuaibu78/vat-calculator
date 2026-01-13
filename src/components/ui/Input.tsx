/**
 * Input component with label and error states
 */

import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
          'transition-all duration-200',
          'text-base sm:text-sm',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
            : 'border-gray-200 bg-white hover:border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

