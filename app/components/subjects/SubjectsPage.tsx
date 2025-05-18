import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SubjectTable, { SubjectWithMeta } from './SubjectTable';
import SubjectForm, { SubjectFormData } from './SubjectForm';
import SubjectDetailDrawer from './SubjectDetailDrawer';
import { ModalStepper } from '../common';

/**
 * Validates a subject object to ensure it has all required fields
 * @param subject - Subject to validate
 * @returns true if the subject is valid, false otherwise
 */
const isValidSubject = (subject: any): boolean => {
  // Log the subject for debugging
  console.log('Validating subject:', subject);
  
  // Basic null/undefined check
  if (!subject) {
    console.warn('Subject is null or undefined');
    return false;
  }
  
  // Check if it's an object
  if (typeof subject !== 'object') {
    console.warn('Subject is not an object, it is:', typeof subject);
    return false;
  }
  
  // More lenient validation - just need some identifiable properties
  // Combine multiple conditions to find the best way to validate
  const hasId = Boolean(subject.id);
  const hasTitle = Boolean(subject.title);
  const hasIdString = typeof subject.id === 'string';
  const hasTitleString = typeof subject.title === 'string';
  
  // Log validation details
  console.log('Subject validation details:', {
    hasId,
    hasTitle,
    hasIdString, 
    hasTitleString,
    properties: Object.keys(subject)
  });
  
  // More permissive check - either id or any unique identifier
  const isValid = (
    hasId && hasTitle && // Has basic required fields
    (hasIdString || typeof subject.id === 'number') // ID can be string or number
  );
  
  if (!isValid) {
    console.warn('Subject failed validation:', subject);
  }
  
  return isValid;
};

/**
 * Main component for managing subjects
 */
const SubjectsPage: React.FC = () => {
  // State for the current subject for viewing/editing
  const [currentSubject, setCurrentSubject] = useState<SubjectWithMeta | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Disclosure hooks for modals and drawers
  const { 
    isOpen: isAddModalOpen, 
    onOpen: onAddModalOpen, 
    onClose: onAddModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEditModalOpen, 
    onOpen: onEditModalOpen, 
    onClose: onEditModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDetailDrawerOpen, 
    onOpen: onDetailDrawerOpen, 
    onClose: onDetailDrawerClose 
  } = useDisclosure();
  
  // Toast for notifications
  const toast = useToast();
  
  // QueryClient for cache invalidation
  const queryClient = useQueryClient();

  // Log component mount for debugging
  useEffect(() => {
    console.log('SubjectsPage mounted - will fetch subjects');
  }, []);
  
  // Fetch subjects
  const {
    data: subjects = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      console.log('Fetching subjects...');
      if (!window.api?.subject?.listSubjects) {
        console.error('Subject API not available');
        throw new Error('Subject API not available');
      }
      
      const result = await window.api.subject.listSubjects();
      console.log('Subject API response:', result);
      
      if (result._tag === 'Left') {
        console.error('Failed to fetch subjects', result.left);
        throw new Error(result.left?.message || 'Failed to fetch subjects');
      }
      
      // Log the raw right property for debugging
      console.log('Raw response.right value:', result.right);
      
      // Handle both array and object responses
      let subjectsArray = [];
      
      if (result.right) {
        if (Array.isArray(result.right)) {
          console.log('Response is an array with length:', result.right.length);
          subjectsArray = result.right;
        } else if (typeof result.right === 'object') {
          console.log('Response is an object, converting to array');
          // If it's a single subject object, wrap it in an array
          subjectsArray = [result.right];
        } else {
          console.error('Unexpected response format:', typeof result.right);
          subjectsArray = [];
        }
      }
      
      // If we have an empty array, look for a subjects property that might contain the actual subjects
      if (subjectsArray.length === 0 && result.right && result.right.subjects) {
        console.log('Found subjects property in response, using that instead');
        subjectsArray = Array.isArray(result.right.subjects) ? result.right.subjects : [result.right.subjects];
      }
      
      // Filter out any invalid subjects
      const validSubjects = subjectsArray.filter(isValidSubject);
      
      if (validSubjects.length !== subjectsArray.length) {
        console.warn(`Filtered out ${subjectsArray.length - validSubjects.length} invalid subjects`);
      }
      
      // Process subjects to add group and student counts
      const subjectsWithMeta = validSubjects.map((subject: any) => ({
        ...subject,
        fee: subject.fee || 0, // Ensure fee has a default value
        groupCount: subject.groupCount || 0,
        studentCount: subject.studentCount || 0,
      }));
      
      console.log('Fetched subjects:', subjectsWithMeta);
      return subjectsWithMeta;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000, // Consider data stale after 1 second
  });

  // Log subjects whenever they change
  useEffect(() => {
    console.log('Subjects data changed:', subjects);
  }, [subjects]);

  // Log any errors that occur
  useEffect(() => {
    if (error) {
      console.error('Error fetching subjects:', error);
    }
  }, [error]);
  
  // Create subject mutation
  const { mutate: createSubject, isLoading: isCreating } = useMutation({
    mutationFn: async (data: SubjectFormData) => {
      console.log('Creating subject with data:', data);
      if (!window.api?.subject?.createSubject) {
        throw new Error('Subject API not available');
      }
      
      const result = await window.api.subject.createSubject(data);
      console.log('Create subject result:', result);
      
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to create subject');
      }
      
      // Log the raw response for debugging
      console.log('Raw create subject response.right:', result.right);
      
      return result.right;
    },
    onSuccess: (data) => {
      console.log('Subject created successfully:', data);
      
      // Log properties for debugging
      console.log('Created subject properties:', Object.keys(data || {}));
      
      toast({
        title: 'Subject created',
        description: 'The subject has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onAddModalClose();
      
      // Different approach to handling the created subject
      // If we have data, use it directly or create a simplified subject object
      const newSubject = data || {};
      
      // Force required properties to ensure it passes validation later
      if (newSubject && typeof newSubject === 'object') {
        // Ensure the subject has an ID even if response doesn't include one
        if (!newSubject.id && data && data.title) {
          // Generate a temporary ID if needed
          newSubject.id = `temp-${Date.now()}`;
          console.log('Generated temporary ID for created subject:', newSubject.id);
        }
        
        // Ensure title is set
        if (!newSubject.title && data && data.title) {
          newSubject.title = data.title;
        }
        
        // Add metadata fields
        newSubject.fee = newSubject.fee || data?.fee || 0;
        newSubject.groupCount = 0;
        newSubject.studentCount = 0;
        
        console.log('Final subject object to add to UI:', newSubject);
        
        // Add the subject to the UI if it has required fields
        if (newSubject.id && newSubject.title) {
          // Add the new subject directly to the subjects list in the UI
          queryClient.setQueryData(['subjects'], (oldData: any) => {
            const oldSubjects = Array.isArray(oldData) ? oldData : [];
            return [...oldSubjects, newSubject];
          });
        }
      }
      
      // Always refetch to make sure we have the latest data from the server
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setTimeout(() => {
        console.log('Refetching subjects after creation...');
        refetch();
      }, 500);
    },
    onError: (error) => {
      console.error('Error creating subject:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create subject',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Update subject mutation
  const { mutate: updateSubject, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubjectFormData> }) => {
      console.log('Updating subject:', id, data);
      if (!window.api?.subject?.updateSubject) {
        throw new Error('Subject API not available');
      }
      
      const result = await window.api.subject.updateSubject(id, data);
      console.log('Update subject result:', result);
      
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to update subject');
      }
      
      return result.right;
    },
    onSuccess: (data) => {
      console.log('Subject updated successfully:', data);
      toast({
        title: 'Subject updated',
        description: 'The subject has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditModalClose();
      
      // Manual handling of subject update
      if (data && isValidSubject(data)) {
        const updatedSubject = {
          ...data,
          fee: data.fee || 0
        };
        
        // Update the subject directly in the subjects list in the UI
        queryClient.setQueryData(['subjects'], (oldData: any) => {
          const oldSubjects = Array.isArray(oldData) ? oldData : [];
          return oldSubjects.map((s: any) => 
            s.id === updatedSubject.id ? { ...s, ...updatedSubject } : s
          );
        });
      }
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setTimeout(() => {
        console.log('Refetching subjects after update...');
        refetch();
      }, 500);
    },
    onError: (error) => {
      console.error('Error updating subject:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update subject',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Delete subject mutation
  const { mutate: deleteSubject, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting subject:', id);
      if (!window.api?.subject?.deleteSubject) {
        throw new Error('Subject API not available');
      }
      
      const result = await window.api.subject.deleteSubject(id);
      console.log('Delete subject result:', result);
      
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to delete subject');
      }
      
      return result.right;
    },
    onSuccess: (_, variables) => {
      console.log('Subject deleted successfully');
      toast({
        title: 'Subject deleted',
        description: 'The subject has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDetailDrawerClose();
      
      // Remove the subject directly from the subjects list in the UI
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        const oldSubjects = Array.isArray(oldData) ? oldData : [];
        return oldSubjects.filter((s: any) => s.id !== variables);
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setTimeout(() => {
        console.log('Refetching subjects after deletion...');
        refetch();
      }, 500);
    },
    onError: (error) => {
      console.error('Error deleting subject:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete subject',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Handle viewing a subject
  const handleViewSubject = (subject: SubjectWithMeta) => {
    console.log('Viewing subject:', subject);
    setCurrentSubject(subject);
    onDetailDrawerOpen();
  };
  
  // Handle editing a subject
  const handleEditSubject = (subject: SubjectWithMeta) => {
    console.log('Editing subject:', subject);
    setCurrentSubject(subject);
    onEditModalOpen();
  };
  
  // Handle deleting a subject
  const handleDeleteSubject = (subject: SubjectWithMeta) => {
    if (window.confirm(`Are you sure you want to delete the subject "${subject.title}"? This action cannot be undone.`)) {
      deleteSubject(subject.id);
    }
  };
  
  // Handle creating a subject
  const handleCreateSubject = (data: SubjectFormData) => {
    console.log('Handling create subject:', data);
    createSubject(data);
  };
  
  // Handle updating a subject
  const handleUpdateSubject = (data: SubjectFormData) => {
    if (!currentSubject) return;
    
    console.log('Handling update subject:', currentSubject.id, data);
    updateSubject({
      id: currentSubject.id,
      data,
    });
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    console.log('Manual refresh requested');
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
    refetch();
  };
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Filtered subjects based on search
  const filteredSubjects = subjects.filter(subject => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      subject.title.toLowerCase().includes(searchLower) ||
      (subject.description && subject.description.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="lg">Subjects</Heading>
        
        <HStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onAddModalOpen}
          >
            Add Subject
          </Button>
          
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            onClick={handleRefresh}
            isLoading={isLoading}
          />
        </HStack>
      </Flex>
      
      <Box
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <SubjectTable
          subjects={filteredSubjects}
          isLoading={isLoading}
          onRowClick={handleViewSubject}
          onSearchChange={setSearchTerm}
        />
      </Box>
      
      {/* Add Subject Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SubjectForm
              onSubmit={handleCreateSubject}
              onCancel={onAddModalClose}
              isSubmitting={isCreating}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* Edit Subject Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {currentSubject && (
              <SubjectForm
                initialValues={{
                  title: currentSubject.title,
                  description: currentSubject.description,
                  fee: currentSubject.fee || 0,
                }}
                onSubmit={handleUpdateSubject}
                onCancel={onEditModalClose}
                isSubmitting={isUpdating}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* Subject Detail Drawer */}
      <SubjectDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={onDetailDrawerClose}
        subject={currentSubject}
        onEdit={handleEditSubject}
        onDelete={handleDeleteSubject}
      />
    </Box>
  );
};

export default SubjectsPage; 