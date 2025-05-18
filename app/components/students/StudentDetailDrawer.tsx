import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Box,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Student, StudentWithMeta } from '../../../src/types/student';

interface StudentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithMeta | null;
  onEdit?: (student: StudentWithMeta) => void;
  onKick?: (student: StudentWithMeta) => void;
}

/**
 * Drawer to display student details with tabs for personal info, subjects, and payments
 */
const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onKick,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // Reset tab index when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTabIndex(0);
    }
  }, [isOpen]);

  // Fetch student's subjects and groups
  const {
    data: enrollments = [],
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
  } = useQuery({
    queryKey: ['enrollments', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];
      
      if (!window.api?.enrollment?.getStudentEnrollments) {
        console.error('Enrollment API not available');
        throw new Error('Enrollment API not available');
      }
      
      const result = await window.api.enrollment.getStudentEnrollments(student.id);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to fetch enrollments');
      }
      
      return result.right || [];
    },
    enabled: !!student?.id && isOpen,
  });

  // Fetch student's payment history
  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    error: paymentsError,
  } = useQuery({
    queryKey: ['payments', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];
      
      if (!window.api?.payment?.getStudentPayments) {
        console.error('Payment API not available');
        throw new Error('Payment API not available');
      }
      
      const result = await window.api.payment.getStudentPayments(student.id);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to fetch payments');
      }
      
      return result.right || [];
    },
    enabled: !!student?.id && isOpen && tabIndex === 2, // Only fetch when payments tab is active
  });

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionBgColor = useColorModeValue('gray.50', 'gray.700');
  
  if (!student) return null;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Heading size="lg">{student.firstName} {student.lastName}</Heading>
          <Flex align="center" mt={2} gap={2} flexWrap="wrap">
            {student.isKicked && (
              <Badge colorScheme="red" fontSize="sm" px={2} py={1} borderRadius="full">
                Kicked
              </Badge>
            )}
            
            {student.tag && (
              <Badge 
                colorScheme={student.tag === 'normal' ? 'blue' : 'purple'} 
                fontSize="sm" 
                px={2} 
                py={1} 
                borderRadius="full"
              >
                {student.tag === 'normal' ? 'Regular' : 'Scholarship'}
              </Badge>
            )}
          </Flex>
        </DrawerHeader>

        <DrawerBody>
          <Tabs 
            isFitted 
            variant="enclosed" 
            colorScheme="blue" 
            index={tabIndex} 
            onChange={setTabIndex}
            mt={4}
          >
            <TabList mb="1em">
              <Tab>Personal Info</Tab>
              <Tab>Subjects</Tab>
              <Tab>Payments</Tab>
            </TabList>
            <TabPanels>
              {/* Personal Information Tab */}
              <TabPanel>
                <Stack spacing={6}>
                  <Box>
                    <Heading size="md" mb={3}>Basic Information</Heading>
                    <Box 
                      p={4} 
                      bg={sectionBgColor} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Full Name:</Text>
                            <Text>{student.firstName} {student.lastName}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Gender:</Text>
                            <Text>{student.sex || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">CNI:</Text>
                            <Text>{student.cni || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Student Type:</Text>
                            <Text>
                              {student.tag === 'ss' 
                                ? `Scholarship (${student.customFee} monthly fee)` 
                                : 'Regular'}
                            </Text>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={3}>Contact Information</Heading>
                    <Box 
                      p={4} 
                      bg={sectionBgColor} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Phone:</Text>
                            <Text>{student.phone || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Parent Phone:</Text>
                            <Text>{student.parentPhone || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Parent Type:</Text>
                            <Text>
                              {student.parentType 
                                ? student.parentType.charAt(0).toUpperCase() + student.parentType.slice(1)
                                : 'N/A'}
                            </Text>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={3}>Education</Heading>
                    <Box 
                      p={4} 
                      bg={sectionBgColor} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">School:</Text>
                            <Text>{student.school || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Study Year:</Text>
                            <Text>{student.studyYear || 'N/A'}</Text>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={3}>Account Details</Heading>
                    <Box 
                      p={4} 
                      bg={sectionBgColor} 
                      borderRadius="md" 
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Created:</Text>
                            <Text>{formatDate(student.createdAt)}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">Last Updated:</Text>
                            <Text>{formatDate(student.updatedAt)}</Text>
                          </Flex>
                        </GridItem>
                        
                        <GridItem colSpan={12}>
                          <Flex>
                            <Text fontWeight="bold" width="120px">ID:</Text>
                            <Text fontFamily="monospace">{student.id}</Text>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </Box>
                  </Box>
                </Stack>
              </TabPanel>
              
              {/* Subjects Tab */}
              <TabPanel>
                {isLoadingEnrollments ? (
                  <Flex justify="center" py={8}>
                    <Spinner size="xl" />
                  </Flex>
                ) : enrollmentsError ? (
                  <Alert status="error">
                    <AlertIcon />
                    Failed to load enrollments. Please try again.
                  </Alert>
                ) : enrollments.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    This student is not enrolled in any subjects or groups.
                  </Alert>
                ) : (
                  <Stack spacing={6}>
                    {enrollments.map((enrollment: any) => (
                      <Box 
                        key={enrollment.id}
                        p={4} 
                        bg={sectionBgColor} 
                        borderRadius="md" 
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Flex justify="space-between" align="flex-start">
                          <Box>
                            <Heading size="md">{enrollment.subject?.title || 'Unknown Subject'}</Heading>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                            </Text>
                          </Box>
                          <Badge colorScheme={enrollment.status === 'active' ? 'green' : 'gray'}>
                            {enrollment.status}
                          </Badge>
                        </Flex>
                        
                        <Divider my={3} />
                        
                        {enrollment.group ? (
                          <Box>
                            <Text fontWeight="bold" mb={1}>Group: {enrollment.group.name}</Text>
                            {enrollment.group.schedule && (
                              <Text fontSize="sm">Schedule: {enrollment.group.schedule}</Text>
                            )}
                          </Box>
                        ) : (
                          <Text fontStyle="italic" color="gray.500">Not assigned to a group</Text>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </TabPanel>
              
              {/* Payments Tab */}
              <TabPanel>
                {isLoadingPayments ? (
                  <Flex justify="center" py={8}>
                    <Spinner size="xl" />
                  </Flex>
                ) : paymentsError ? (
                  <Alert status="error">
                    <AlertIcon />
                    Failed to load payment history. Please try again.
                  </Alert>
                ) : payments.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    No payment records found for this student.
                  </Alert>
                ) : (
                  <>
                    <HStack spacing={8} mb={6}>
                      <Stat>
                        <StatLabel>Total Payments</StatLabel>
                        <StatNumber>
                          {payments.reduce((sum: number, payment: any) => sum + payment.amount, 0).toLocaleString()}
                        </StatNumber>
                        <StatHelpText>All time</StatHelpText>
                      </Stat>
                      
                      <Stat>
                        <StatLabel>Last Payment</StatLabel>
                        <StatNumber>
                          {payments[0]?.amount.toLocaleString() || 0}
                        </StatNumber>
                        <StatHelpText>
                          {payments[0]?.date 
                            ? new Date(payments[0].date).toLocaleDateString() 
                            : 'N/A'}
                        </StatHelpText>
                      </Stat>
                      
                      {student.tag === 'ss' && (
                        <Stat>
                          <StatLabel>Scholarship Rate</StatLabel>
                          <StatNumber>
                            {student.customFee || 0}
                          </StatNumber>
                          <StatHelpText>Monthly fee</StatHelpText>
                        </Stat>
                      )}
                    </HStack>
                    
                    <Box 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={borderColor}
                      overflow="hidden"
                    >
                      <Table variant="simple">
                        <Thead bg={bgColor}>
                          <Tr>
                            <Th>Date</Th>
                            <Th>Subject</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Status</Th>
                            <Th>Notes</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {payments.map((payment: any) => (
                            <Tr key={payment.id}>
                              <Td>
                                {new Date(payment.date).toLocaleDateString()}
                              </Td>
                              <Td>
                                {payment.subject?.title || 'Unknown Subject'}
                              </Td>
                              <Td isNumeric fontWeight="bold">
                                {payment.amount.toLocaleString()}
                                {payment.isScholarship && (
                                  <Badge ml={2} colorScheme="purple" size="sm">
                                    Scholarship
                                  </Badge>
                                )}
                              </Td>
                              <Td>
                                <Badge 
                                  colorScheme={payment.isPaid ? 'green' : 'red'}
                                >
                                  {payment.isPaid ? 'Paid' : 'Unpaid'}
                                </Badge>
                              </Td>
                              <Td>
                                {payment.notes || ''}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button 
            variant="outline" 
            mr={3} 
            onClick={onClose}
          >
            Close
          </Button>
          
          {onEdit && (
            <Button 
              variant="solid"
              colorScheme="blue"
              mr={3}
              onClick={() => onEdit(student)}
            >
              Edit
            </Button>
          )}
          
          {onKick && !student.isKicked && (
            <Button 
              variant="solid"
              colorScheme="red"
              onClick={() => onKick(student)}
            >
              Kick Student
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default StudentDetailDrawer;