'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', variant = 'primary', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    primary: 'text-pink-500',
    secondary: 'text-purple-500',
    white: 'text-white'
  };

  return (
    <div className={cn('relative', className)}>
      {/* Main Spinner */}
      <div className={cn(
        'animate-spin rounded-full border-2 border-transparent',
        sizeClasses[size]
      )}>
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-t-current border-r-current animate-spin',
          variantClasses[variant]
        )} />
      </div>
      
      {/* Inner Pulse */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-pulse-pink opacity-20',
        sizeClasses[size],
        variantClasses[variant] === 'text-pink-500' ? 'bg-pink-500' : 
        variantClasses[variant] === 'text-purple-500' ? 'bg-purple-500' : 'bg-white'
      )} />
    </div>
  );
};

export default LoadingSpinner;