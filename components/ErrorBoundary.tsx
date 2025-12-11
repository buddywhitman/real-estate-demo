/*
  ===========================================================================================
  ERROR BOUNDARY
  ===========================================================================================
*/

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NotFound } from './NotFound';

interface Props {
  children: ReactNode;
  onReset: () => void;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
          <div className="p-8 w-full h-full flex items-center justify-center">
            <NotFound 
                onGoHome={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onReset();
                }} 
                isError={true}
                errorDetails={this.state.error?.message}
            />
          </div>
      );
    }

    return this.props.children;
  }
}