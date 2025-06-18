import React, { Component, ReactNode } from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          height="100vh"
          p={8}
        >
          <VStack spacing={4} textAlign="center">
            <Text fontSize="6xl">💔</Text>
            <Text fontSize="2xl" fontWeight="bold">
              Oops! Something went wrong
            </Text>
            <Text color="gray.500" maxWidth="400px">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Text>
            <Button 
              colorScheme="blue" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 