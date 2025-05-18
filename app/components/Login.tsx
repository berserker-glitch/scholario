import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import useAuth from '../../src/hooks/useAuth';

/**
 * Login component for authentication
 */
const Login: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);
  const { login, isLoading, isError, isAuthenticated } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttempted(true);
    
    if (accessCode.trim()) {
      const success = login(accessCode.trim());
      
      if (success) {
        // Force refresh of window to ensure proper state updates
        window.location.reload();
      }
    }
  };

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return null;
  }

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        p={8}
        width="100%"
        maxW="400px"
        bg={bgColor}
        boxShadow="lg"
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <Heading as="h1" size="xl">Scholario</Heading>
          <Text>Please enter your access code to continue</Text>
          <Text fontSize="sm" color="blue.500">Hint: Use "emp001" as the default code</Text>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} width="100%">
              <FormControl isInvalid={hasAttempted && (!accessCode || isError)}>
                <Input
                  type="password"
                  placeholder="Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  isDisabled={isLoading}
                  size="lg"
                  autoFocus
                />
                
                {hasAttempted && !accessCode && (
                  <FormErrorMessage>Access code is required</FormErrorMessage>
                )}
                
                {isError && (
                  <FormErrorMessage>
                    Invalid access code. Please try again.
                  </FormErrorMessage>
                )}
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isLoading={isLoading}
                loadingText="Logging In"
              >
                Login
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login; 