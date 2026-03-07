import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
            maxWidth: '800px',
            margin: '40px auto',
            background: '#e8d8c3',
            border: '2px solid #d4c4b3',
            borderRadius: '12px',
          }}
        >
          <h2 style={{ color: '#222222', marginBottom: '16px' }}>Something went wrong</h2>
          <pre
            style={{
              background: '#e8d8c3',
              padding: '16px',
              overflow: 'auto',
              fontSize: '13px',
              border: '1px solid #d4c4b3',
              borderRadius: '8px',
            }}
          >
            {this.state.error.message}
          </pre>
          {this.state.errorInfo?.componentStack && (
            <details style={{ marginTop: '16px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Component stack</summary>
              <pre
                style={{
                  background: '#e8d8c3',
                  padding: '16px',
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '8px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
