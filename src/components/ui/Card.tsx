/**
 * Card component for containing content sections
 */

import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden',
        'transition-shadow duration-200 hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-4 sm:px-6 py-4 sm:py-5', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h2 className={cn('text-lg sm:text-xl font-bold text-gray-900', className)}>
      {children}
    </h2>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-4 sm:px-6 py-4 sm:py-5 space-y-5', className)}>
      {children}
    </div>
  );
}

