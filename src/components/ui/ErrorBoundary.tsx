'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-pink-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-500 animate-wobble" />
              </div>
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong 🙈
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We&apos;re sorry, but something unexpected happened. Our team has been notified and we&apos;re working to fix it!
            </p>
            
            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-xs text-gray-500 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full interactive-scale hover:animate-wobble"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
                className="w-full interactive-scale"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
            
            {/* Decorative Elements */}
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;