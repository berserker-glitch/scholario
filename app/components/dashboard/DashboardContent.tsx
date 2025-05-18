import React, { useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Progress,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiDollarSign,
  FiBook,
  FiGrid
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';

/**
 * Dashboard content with quick analysis of the center
 */
const DashboardContent: React.FC = () => {
  // Color mode values
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Fetch student statistics using React Query
  const { data: studentStats = { total: 0, active: 0, kicked: 0 } } = useQuery({
    queryKey: ['studentStats'],
    queryFn: async () => {
      try {
        if (window.api?.student?.listStudents) {
          const result = await window.api.student.listStudents({ includeKicked: true });
          if (result._tag === 'Right' && Array.isArray(result.right)) {
            const students = result.right || [];
            const kicked = students.filter((s: { isKicked: boolean }) => s.isKicked).length;
            const active = students.length - kicked;
            const total = active; // Only count active students in total
            
            return { total, active, kicked };
          }
        }
        
        // Return zeros if API is not available
        console.error('Student API not available');
        return { total: 0, active: 0, kicked: 0 };
      } catch (error) {
        console.error('Failed to fetch student stats', error);
        return { total: 0, active: 0, kicked: 0 };
      }
    },
    // Refresh every minute and when window is focused
    refetchInterval: 60000,
    refetchOnWindowFocus: true
  });
  
  // Fetch subject statistics using React Query
  const { data: subjectStats = { total: 0 } } = useQuery({
    queryKey: ['subjectStats'],
    queryFn: async () => {
      try {
        let subjectsTotal = 0;
        
        // First try direct API for most reliable subjects data
        if (window.api?.subject?.getDirectSubjects) {
          const directResult = await window.api.subject.getDirectSubjects();
          if (directResult._tag === 'Right') {
            const subjects = directResult.right || [];
            subjectsTotal = subjects.length;
            console.log('Direct API subjects count:', subjectsTotal);
            return { total: subjectsTotal };
          }
        }
        
        // Fall back to standard API if direct access fails
        if (window.api?.subject?.listSubjects) {
          const subjectsResult = await window.api.subject.listSubjects();
          if (subjectsResult._tag === 'Right') {
            const subjects = subjectsResult.right || [];
            subjectsTotal = subjects.length;
            console.log('Standard API subjects count:', subjectsTotal);
            return { total: subjectsTotal };
          }
        }
        
        return { total: 0 };
      } catch (error) {
        console.error('Failed to fetch subject stats', error);
        return { total: 0 };
      }
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
  
  // Fetch payment statistics using React Query
  const { data: paymentStats = { monthlyRevenue: 0, pendingPayments: 0, collectionRate: 0 } } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: async () => {
      try {
        if (window.api?.payment?.getPaymentStats) {
          const result = await window.api.payment.getPaymentStats();
          if (result._tag === 'Right') {
            return result.right || { monthlyRevenue: 0, pendingPayments: 0, collectionRate: 0 };
          }
        }
        
        console.error('Payment API not available');
        return { monthlyRevenue: 0, pendingPayments: 0, collectionRate: 0 };
      } catch (error) {
        console.error('Failed to fetch payment stats', error);
        return { monthlyRevenue: 0, pendingPayments: 0, collectionRate: 0 };
      }
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true
  });
  
  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Educational Center Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        {/* Student Stats */}
        <Card bg={cardBgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justifyContent="space-between">
              <Box>
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="medium">Students</StatLabel>
                  <StatNumber fontSize="3xl">{studentStats.total}</StatNumber>
                </Stat>
              </Box>
              <Flex 
                width="60px" 
                height="60px" 
                bg="blue.50" 
                color="blue.500"
                borderRadius="full" 
                align="center" 
                justify="center"
              >
                <Icon as={FiUsers} boxSize={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
        
        {/* Subject Stats */}
        <Card bg={cardBgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justifyContent="space-between">
              <Box>
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="medium">Subjects</StatLabel>
                  <StatNumber fontSize="3xl">{subjectStats.total}</StatNumber>
                </Stat>
              </Box>
              <Flex 
                width="60px" 
                height="60px" 
                bg="purple.50" 
                color="purple.500"
                borderRadius="full" 
                align="center" 
                justify="center"
              >
                <Icon as={FiBook} boxSize={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
        
        {/* Payment Stats */}
        <Card bg={cardBgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justifyContent="space-between">
              <Box>
                <Stat>
                  <StatLabel fontSize="lg" fontWeight="medium">Revenue</StatLabel>
                  <StatNumber fontSize="3xl">${paymentStats.monthlyRevenue}</StatNumber>
                </Stat>
                <Box mt={2}>
                  <Text fontSize="sm" color="gray.500">Collection Rate</Text>
                  <Flex align="center">
                    <Progress 
                      value={paymentStats.collectionRate} 
                      size="sm" 
                      colorScheme="green" 
                      flex="1" 
                      mr={2} 
                      borderRadius="full"
                    />
                    <Text fontSize="sm">{paymentStats.collectionRate}%</Text>
                  </Flex>
                </Box>
              </Box>
              <Flex 
                width="60px" 
                height="60px" 
                bg="green.50" 
                color="green.500"
                borderRadius="full" 
                align="center" 
                justify="center"
              >
                <Icon as={FiDollarSign} boxSize={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Recent Activity */}
        <Card bg={cardBgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            <Text color="gray.500">No recent activity to display</Text>
          </CardBody>
        </Card>
        
        {/* Quick Actions */}
        <Card bg={cardBgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <Text color="gray.500">No actions available</Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default DashboardContent; 