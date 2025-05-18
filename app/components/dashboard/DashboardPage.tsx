import React from 'react';
import { Box } from '@chakra-ui/react';
import DashboardContent from './DashboardContent';

/**
 * Dashboard page component that wraps the DashboardContent
 */
const DashboardPage: React.FC = () => {
  return (
    <Box p={5}>
      <DashboardContent />
    </Box>
  );
};

export default DashboardPage; 