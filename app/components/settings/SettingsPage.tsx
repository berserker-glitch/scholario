import React from 'react';
import { Box, Heading, VStack, Text, Card, CardBody, SimpleGrid } from '@chakra-ui/react';

/**
 * Settings page component
 */
const SettingsPage: React.FC = () => {
  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>Settings</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md">Application Settings</Heading>
              <Text>Configure application preferences and behavior.</Text>
            </VStack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md">User Preferences</Heading>
              <Text>Customize your user experience.</Text>
            </VStack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md">Database</Heading>
              <Text>Manage database backups and restoration.</Text>
            </VStack>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md">About</Heading>
              <Text>Application version and information.</Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default SettingsPage; 