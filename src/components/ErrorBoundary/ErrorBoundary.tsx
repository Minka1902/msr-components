import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback. When a function, receives the error and a reset callback. */
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** Changing any value in this array resets the boundary. */
  resetKeys?: unknown[];
  className?: string;
}

interface State {
  error: Error | null;
}

/** Catches render errors in its subtree and shows a recoverable fallback. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    if (!this.state.error) return;
    const a = prev.resetKeys ?? [];
    const b = this.props.resetKeys ?? [];
    if (a.length !== b.length || a.some((v, i) => v !== b[i])) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback, className } = this.props;
    if (!error) return children;

    if (fallback !== undefined) {
      return typeof fallback === "function" ? fallback(error, this.reset) : fallback;
    }

    return (
      <div className={cx("msr-ErrorBoundary", className)} role="alert">
        <span className="msr-ErrorBoundary__icon" aria-hidden="true">
          <Icon name="warning" size={28} />
        </span>
        <div className="msr-ErrorBoundary__title">Something went wrong</div>
        <div className="msr-ErrorBoundary__message">{error.message}</div>
        <button type="button" className="msr-ErrorBoundary__retry" onClick={this.reset}>
          Try again
        </button>
      </div>
    );
  }
}
