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
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubjectWithMeta } from './SubjectTable';
import GroupForm, { GroupFormData } from './GroupForm';

interface SubjectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectWithMeta | null;
  onEdit?: (subject: SubjectWithMeta) => void;
  onDelete?: (subject: SubjectWithMeta) => void;
}

/**
 * Drawer to display subject details with tabs for groups and students
 */
const SubjectDetailDrawer: React.FC<SubjectDetailDrawerProps> = ({
  isOpen,
  onClose,
  subject,
  onEdit,
  onDelete,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen: isAddGroupOpen, onOpen: onAddGroupOpen, onClose: onAddGroupClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Reset tab index and search when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTabIndex(0);
      setSearchTerm('');
    }
  }, [isOpen]);

  // Fetch subject details including groups and students
  const {
    data: subjectDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails
  } = useQuery({
    queryKey: ['subjectDetails', subject?.id],
    queryFn: async () => {
      if (!subject?.id) return null;
      
      if (!window.api?.subject?.getSubjectDetails) {
        console.error('Subject API not available');
        throw new Error('Subject API not available');
      }
      
      const result = await window.api.subject.getSubjectDetails(subject.id);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to fetch subject details');
      }
      
      return result.right || null;
    },
    enabled: !!subject?.id && isOpen,
  });

  // Mutation for creating a new group
  const { mutate: createGroup, isLoading: isCreatingGroup } = useMutation({
    mutationFn: async (data: GroupFormData) => {
      if (!subject?.id) throw new Error('Subject ID is required');
      
      if (!window.api?.group?.createGroup) {
        throw new Error('Group API not available');
      }
      
      const result = await window.api.group.createGroup(subject.id, data);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to create group');
      }
      
      return result.right;
    },
    onSuccess: () => {
      toast({
        title: 'Group created',
        description: 'The group has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onAddGroupClose();
      refetchDetails();
      queryClient.invalidateQueries(['subjects']);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create group',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Mutation for deleting a group
  const { mutate: deleteGroup, isLoading: isDeletingGroup } = useMutation({
    mutationFn: async (groupId: string) => {
      if (!window.api?.group?.deleteGroup) {
        throw new Error('Group API not available');
      }
      
      const result = await window.api.group.deleteGroup(groupId);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to delete group');
      }
      
      return result.right;
    },
    onSuccess: () => {
      toast({
        title: 'Group deleted',
        description: 'The group has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetchDetails();
      queryClient.invalidateQueries(['subjects']);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete group',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Handle group creation form submission
  const handleCreateGroup = (data: GroupFormData) => {
    createGroup({
      ...data,
      subjectId: subject?.id
    });
  };

  // Handle group deletion
  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroup(groupId);
    }
  };

  // Filter students based on search term
  const filteredStudents = subjectDetails?.enrolledStudents?.filter(student => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      (student.cni && student.cni.toLowerCase().includes(searchLower)) ||
      (student.phone && student.phone.toLowerCase().includes(searchLower)) ||
      (student.school && student.school.toLowerCase().includes(searchLower)) ||
      (student.studyYear && student.studyYear.toLowerCase().includes(searchLower))
    );
  });

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionBgColor = useColorModeValue('gray.50', 'gray.700');
  
  if (!subject) return null;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
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
            <Heading size="lg">{subject.title}</Heading>
            <Flex align="center" mt={2} gap={2} flexWrap="wrap">
              <Badge colorScheme="blue" fontSize="sm" px={2} py={1} borderRadius="full">
                {subject.fee ? `${subject.fee} DH/month` : 'No fee set'}
              </Badge>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            {isLoadingDetails ? (
              <Flex justify="center" align="center" height="100%">
                <Spinner size="xl" />
              </Flex>
            ) : detailsError ? (
              <Alert status="error">
                <AlertIcon />
                Failed to load subject details. Please try again.
              </Alert>
            ) : (
              <Tabs 
                isFitted 
                variant="enclosed" 
                colorScheme="blue" 
                index={tabIndex} 
                onChange={setTabIndex}
                mt={4}
              >
                <TabList mb="1em">
                  <Tab>Details</Tab>
                  <Tab>Groups</Tab>
                  <Tab>Students</Tab>
                </TabList>
                <TabPanels>
                  {/* Subject Details Tab */}
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
                                <Text fontWeight="bold" width="120px">Name:</Text>
                                <Text>{subject.title}</Text>
                              </Flex>
                            </GridItem>
                            
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                              <Flex>
                                <Text fontWeight="bold" width="120px">Monthly Fee:</Text>
                                <Text>{subject.fee ? `${subject.fee} DH` : 'No fee set'}</Text>
                              </Flex>
                            </GridItem>
                            
                            <GridItem colSpan={12}>
                              <Flex>
                                <Text fontWeight="bold" width="120px">Description:</Text>
                                <Text>{subject.description || 'No description'}</Text>
                              </Flex>
                            </GridItem>
                          </Grid>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Heading size="md" mb={3}>Statistics</Heading>
                        <Box 
                          p={4} 
                          bg={sectionBgColor} 
                          borderRadius="md" 
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                            <GridItem colSpan={{ base: 12, md: 4 }}>
                              <Stat>
                                <StatLabel>Groups</StatLabel>
                                <StatNumber>{subjectDetails?.groups?.length || 0}</StatNumber>
                              </Stat>
                            </GridItem>
                            
                            <GridItem colSpan={{ base: 12, md: 4 }}>
                              <Stat>
                                <StatLabel>Students</StatLabel>
                                <StatNumber>{subjectDetails?.enrolledStudentsCount || 0}</StatNumber>
                              </Stat>
                            </GridItem>
                            
                            <GridItem colSpan={{ base: 12, md: 4 }}>
                              <Stat>
                                <StatLabel>Avg. Students/Group</StatLabel>
                                <StatNumber>
                                  {subjectDetails?.groups?.length && subjectDetails.enrolledStudentsCount
                                    ? Math.round(subjectDetails.enrolledStudentsCount / subjectDetails.groups.length)
                                    : 0}
                                </StatNumber>
                              </Stat>
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
                                <Text>{formatDate(subject.createdAt)}</Text>
                              </Flex>
                            </GridItem>
                            
                            <GridItem colSpan={{ base: 12, md: 6 }}>
                              <Flex>
                                <Text fontWeight="bold" width="120px">Last Updated:</Text>
                                <Text>{formatDate(subject.updatedAt)}</Text>
                              </Flex>
                            </GridItem>
                            
                            <GridItem colSpan={12}>
                              <Flex>
                                <Text fontWeight="bold" width="120px">ID:</Text>
                                <Text fontFamily="monospace">{subject.id}</Text>
                              </Flex>
                            </GridItem>
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>
                  </TabPanel>
                  
                  {/* Groups Tab */}
                  <TabPanel>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">Groups</Heading>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        onClick={onAddGroupOpen}
                      >
                        Add Group
                      </Button>
                    </Flex>
                    
                    {subjectDetails?.groups?.length === 0 ? (
                      <Alert status="info">
                        <AlertIcon />
                        No groups available for this subject. Click 'Add Group' to create one.
                      </Alert>
                    ) : (
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Name</Th>
                              <Th isNumeric>Capacity</Th>
                              <Th isNumeric>Students</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {subjectDetails?.groups?.map((group: any) => {
                              const enrolledCount = subjectDetails?.enrolledStudents?.filter(
                                (s: any) => s.groupId === group.id
                              ).length || 0;
                              
                              return (
                                <Tr key={group.id}>
                                  <Td>{group.name}</Td>
                                  <Td isNumeric>{group.capacity}</Td>
                                  <Td isNumeric>
                                    {enrolledCount} / {group.capacity}
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton
                                        aria-label="Edit group"
                                        icon={<EditIcon />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => {
                                          // Handle edit group (can be implemented later)
                                        }}
                                      />
                                      <IconButton
                                        aria-label="Delete group"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDeleteGroup(group.id)}
                                        isLoading={isDeletingGroup}
                                      />
                                    </HStack>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </TabPanel>
                  
                  {/* Students Tab */}
                  <TabPanel>
                    <Flex direction="column" gap={4}>
                      <Heading size="md">Enrolled Students</Heading>
                      
                      <InputGroup mb={4}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                      
                      {filteredStudents?.length === 0 ? (
                        <Alert status="info">
                          <AlertIcon />
                          No students enrolled in this subject.
                        </Alert>
                      ) : (
                        <Box
                          borderWidth="1px"
                          borderRadius="lg"
                          overflow="hidden"
                        >
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Name</Th>
                                <Th>Phone</Th>
                                <Th>School</Th>
                                <Th>Group</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredStudents?.map((student: any) => (
                                <Tr key={`${student.id}-${student.groupId}`}>
                                  <Td>{student.firstName} {student.lastName}</Td>
                                  <Td>{student.phone || '-'}</Td>
                                  <Td>{student.school || '-'}</Td>
                                  <Td>{student.groupName}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      )}
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <HStack spacing={4}>
              {onDelete && (
                <Button 
                  colorScheme="red" 
                  variant="outline"
                  onClick={() => onDelete(subject)}
                >
                  Delete Subject
                </Button>
              )}
              
              {onEdit && (
                <Button 
                  colorScheme="blue" 
                  onClick={() => onEdit(subject)}
                >
                  Edit Subject
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Add Group Modal */}
      <Modal isOpen={isAddGroupOpen} onClose={onAddGroupClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <GroupForm
              onSubmit={handleCreateGroup}
              onCancel={onAddGroupClose}
              isSubmitting={isCreatingGroup}
              subjectName={subject.title}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubjectDetailDrawer; 