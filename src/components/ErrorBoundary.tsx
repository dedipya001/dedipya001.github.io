import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Brain, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-[480px] rounded-3xl bg-zinc-950/60 border border-white/5 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans select-none">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-grotesk font-bold text-base text-white">Neural Brain Visualizer (2D Mode)</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              3D WebGL context is currently unavailable on your browser. 
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-zinc-400">
            <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>Interactive section links remain active below</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
