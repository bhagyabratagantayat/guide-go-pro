import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-primary/5 border border-gray-50 animate-fade-in">
            <div className="size-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10">
              <AlertTriangle size={40} />
            </div>
            
            <h1 className="text-3xl font-black text-text-primary tracking-tight mb-4">Something went <span className="text-rose-500">wrong</span></h1>
            <p className="text-sm font-medium text-text-secondary opacity-60 mb-10 leading-relaxed">
              An unexpected error occurred. Our team has been notified. Please try refreshing the page or returning home.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="h-14 bg-text-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/10"
              >
                <RefreshCcw size={16} /> Reload Page
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="h-14 bg-surface text-text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-gray-100"
              >
                <Home size={16} /> Return Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-rose-600 break-all">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
