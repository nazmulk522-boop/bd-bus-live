import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleHardReset = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((k) => caches.delete(k)));
      }
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
    window.location.href = window.location.origin + '?v=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-lg border border-slate-200 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              অ্যাপ লোড হতে সাময়িক সমস্যা হয়েছে
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              নতুন ভার্সন আসার কারণে ব্রাউজারের পুরনো ক্যাশ আটকে থাকতে পারে। নিচের বাটনে চাপ দিয়ে দ্রুত রিফ্রেশ করুন।
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleHardReset}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ক্যাশ ক্লিয়ার করে নতুন করে খুলুন</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                সাধারণ রিফ্রেশ
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left border-t border-slate-100 pt-4 text-xs text-slate-400">
                <summary className="cursor-pointer font-mono hover:text-slate-600">ত্রুটির বিবরণ (Debug)</summary>
                <p className="mt-2 text-rose-600 font-mono break-all">{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
