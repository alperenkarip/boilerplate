// ErrorBoundary (C53) — Global hata yakalama
// React class component — error boundary sadece class ile yazilabilir

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Hata durumunda gosterilecek fallback */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Hata callback — Sentry vb. entegrasyon icin */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// @MX:ANCHOR: [AUTO] Global error-catching boundary — wraps app sections to render fallback + report errors (Sentry)
// @MX:REASON: fan_in=4; onError/fallback contract is the single crash-recovery boundary for downstream trees
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      // Varsayilan fallback
      return (
        <div role="alert" style={{ padding: 24, textAlign: 'center' }}>
          <h2>Beklenmeyen bir hata olustu</h2>
          <button onClick={this.reset} type="button">
            Tekrar dene
          </button>
        </div>
      );
    }

    return children;
  }
}
