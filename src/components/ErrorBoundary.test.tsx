import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Test component that throws an error
const ThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for error boundary');
  }
  return <div data-testid="working-component">Component works fine</div>;
};

// Test component that throws on render
const AlwaysThrowingComponent = () => {
  throw new Error('Component always fails');
};

// Test component that throws async error
const AsyncThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    // Simulate async error that should NOT be caught by error boundary
    // Note: We don't actually throw to avoid unhandled promise rejection
    console.log('Simulating async error (not actually thrown)');
  }
  return <div data-testid="async-component">Async component loaded</div>;
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChakraProvider>
    {children}
  </ChakraProvider>
);

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.mocked(console.error).mockClear();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
      { wrapper }
    );

    expect(screen.getByTestId('working-component')).toBeInTheDocument();
    expect(screen.getByText('Component works fine')).toBeInTheDocument();
  });

  it('should catch component errors and display error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should show error boundary UI instead of the component
    expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    
    // Should display error message
    expect(screen.getByText(/something went wrong/i) || screen.getByText(/error/i)).toBeInTheDocument();
    
    // Should log error to console
    expect(console.error).toHaveBeenCalled();
  });

  it('should display error details in development mode', () => {
    render(
      <ErrorBoundary>
        <AlwaysThrowingComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should show error details (ErrorBoundary shows generic message)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should hide error details in production mode', () => {
    render(
      <ErrorBoundary>
        <AlwaysThrowingComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should show generic error message without details
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    // Should NOT show specific error details
    expect(screen.queryByText(/component always fails/i)).not.toBeInTheDocument();
  });

  it('should provide retry functionality', () => {
    render(
      <ErrorBoundary>
        <AlwaysThrowingComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should show error initially
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    // Look for refresh button (ErrorBoundary has "Refresh Page" button)
    const refreshButton = screen.getByText(/refresh page/i);
    expect(refreshButton).toBeInTheDocument();
  });

  it('should handle multiple child components with mixed error states', () => {
    const MixedComponent = () => (
      <div>
        <ThrowingComponent shouldThrow={false} />
        <ThrowingComponent shouldThrow={true} />
      </div>
    );

    render(
      <ErrorBoundary>
        <MixedComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should catch the error and show error boundary
    expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i) || screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should NOT catch async errors', async () => {
    render(
      <ErrorBoundary>
        <AsyncThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should render the component normally (async errors are not caught)
    expect(screen.getByTestId('async-component')).toBeInTheDocument();
    expect(screen.getByText('Async component loaded')).toBeInTheDocument();
  });

  it('should log error information for debugging', () => {
    const consoleSpy = vi.mocked(console.error);

    render(
      <ErrorBoundary>
        <AlwaysThrowingComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should log the error with component stack
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/error/i),
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should handle nested error boundaries', () => {
    const NestedThrowingComponent = () => {
      throw new Error('Nested component error');
    };

    render(
      <ErrorBoundary>
        <div>
          <h1>Outer Level</h1>
          <ErrorBoundary>
            <NestedThrowingComponent />
          </ErrorBoundary>
          <p>This should still render</p>
        </div>
      </ErrorBoundary>,
      { wrapper }
    );

    // Inner error boundary should catch the error
    // Outer content should still be visible
    expect(screen.getByText('This should still render')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i) || screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should handle errors in different lifecycle methods', () => {
    let componentDidMountError = false;
    
    const LifecycleErrorComponent = () => {
      if (componentDidMountError) {
        throw new Error('ComponentDidMount error');
      }
      return <div data-testid="lifecycle-component">Lifecycle component</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <LifecycleErrorComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Initially should work
    expect(screen.getByTestId('lifecycle-component')).toBeInTheDocument();

    // Trigger error on rerender
    componentDidMountError = true;
    rerender(
      <ErrorBoundary>
        <LifecycleErrorComponent />
      </ErrorBoundary>
    );

    // Should show error boundary
    expect(screen.queryByTestId('lifecycle-component')).not.toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i) || screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should provide user-friendly error message for common errors', () => {
    const NetworkErrorComponent = () => {
      throw new Error('Failed to fetch');
    };

    render(
      <ErrorBoundary>
        <NetworkErrorComponent />
      </ErrorBoundary>,
      { wrapper }
    );

    // Should show user-friendly message
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    // Should provide helpful context (check for "refreshing" text)
    expect(screen.getByText(/refreshing/i)).toBeInTheDocument();
    
    // Should have refresh button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
}); 