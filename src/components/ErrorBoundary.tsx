import React from 'react';
import { reportError } from '@/utils/errorReporter';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home, Bug } from 'lucide-react';

interface State {
  error: Error | null;
  componentStack: string | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null, componentStack: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ componentStack: info.componentStack || null });
    reportError({ error, source: 'boundary', componentStack: info.componentStack || undefined });
  }

  private reset = () => this.setState({ error: null, componentStack: null });
  private reload = () => window.location.reload();
  private goHome = () => {
    window.location.href = '/';
  };
  private openPanel = () => {
    window.dispatchEvent(new CustomEvent('zenith-open-error-panel'));
  };

  render() {
    if (!this.state.error) return this.props.children;
    const err = this.state.error;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                Zenith hit an unexpected error. Your data is safe.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono bg-muted rounded-lg p-3 max-h-40 overflow-auto mb-4 break-all">
            {err.message}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={this.reset} variant="default" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Try again
            </Button>
            <Button onClick={this.reload} variant="outline" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Reload
            </Button>
            <Button onClick={this.goHome} variant="outline" className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
            <Button onClick={this.openPanel} variant="ghost" className="gap-2">
              <Bug className="h-4 w-4" /> View details
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;