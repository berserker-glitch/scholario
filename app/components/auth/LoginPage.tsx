import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Card,
  CardBody,
  FormErrorMessage,
  useToast,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Login page component
 */
const LoginPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!window.api?.auth?.validateAccessCode) {
        throw new Error('Auth API not available');
      }

      const result = await window.api.auth.validateAccessCode(accessCode);
      
      if (result._tag === 'Left') {
        setError(result.left?.message || 'Invalid access code');
        return;
      }

      if (!result.right) {
        setError('Invalid access code');
        return;
      }

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Small delay to show success message before redirecting
      setTimeout(() => {
        navigate('/dashboard');
        // Force page refresh to ensure state is updated
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minH="100vh">
      <Card width="100%" maxW="400px">
        <CardBody>
          <VStack spacing={6} align="center" p={4}>
            <Heading size="xl">Scholario</Heading>
            <Text fontSize="md">Educational Center Management</Text>

            <Box as="form" width="100%" onSubmit={handleSubmit}>
              <VStack spacing={4} align="start">
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel>Access Code</FormLabel>
                  <Input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter your access code"
                  />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
};

export default LoginPage; 