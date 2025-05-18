import React, { useState } from 'react';
import { ChakraProvider, Box, Spinner, Center, Text, Flex } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import theme from './theme';
import useAuth from '../src/hooks/useAuth';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes';
import ErrorBoundary from '../src/utils/ErrorBoundary';

// Create React Query client with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,                   // Retry failed queries twice
      staleTime: 5000,            // Consider data fresh for 5 seconds only
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true,   // Refetch on network reconnection
      refetchOnMount: true,       // Refetch when component mounts
    },
    mutations: {
      retry: 1,                  // Only retry failed mutations once
      networkMode: 'always'      // Always attempt mutations even if offline
    }
  }
});

/**
 * Main content component
 */
const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Set active module based on current path
  const pathSegment = location.pathname.split('/')[1] || 'dashboard';
  const [activeModule, setActiveModule] = useState<string>(pathSegment);
  
  // Handle module change from sidebar
  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    navigate(`/${module}`);
  };
  
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Flex flex="1" overflow="hidden">
        <Sidebar activeModule={activeModule} onModuleChange={handleModuleChange} />
        <Box 
          flex="1" 
          ml="220px" // Match sidebar width
          overflowY="auto"
          height="calc(100vh - 60px)" // Adjust based on header height
        >
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Box>
      </Flex>
    </Box>
  );
};

/**
 * Main application component
 */
const App: React.FC = () => {
  const { isLoading } = useAuth();

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Center minH="100vh" flexDirection="column">
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text mt={4}>Loading...</Text>
        </Center>
      </ChakraProvider>
    );
  }

  // Render main content
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App; 