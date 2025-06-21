'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'underline';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, variant = 'default', ...props }, ref) => {
    const baseStyles = "w-full transition-all duration-300 focus:outline-none";
    
    const variants = {
      default: "border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 bg-white",
      filled: "bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20",
      underline: "border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-pink-500 bg-transparent"
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              baseStyles,
              variants[variant],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;