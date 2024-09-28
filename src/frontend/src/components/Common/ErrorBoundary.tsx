import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    // Initialize the state with hasError as false and errorMessage as null
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // TODO: Implement error reporting service integration
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-boundary">
          <h1>Oops! Something went wrong.</h1>
          <p>Error: {this.state.errorMessage}</p>
          {/* You can add more user-friendly content or actions here */}
        </div>
      );
    }

    // If there's no error, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;

// Human tasks:
// TODO: Implement error reporting service integration in componentDidCatch method
// TODO: Design and implement a more user-friendly fallback UI for error states