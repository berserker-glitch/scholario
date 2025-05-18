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
  
  // Very simple validation - just need id and title
  // This is much more permissive than before
  const hasMinimumFields = Boolean(subject.id) && Boolean(subject.title);
  
  // Log validation details
  console.log('Subject validation details:', {
    hasId: Boolean(subject.id),
    hasTitle: Boolean(subject.title),
    properties: Object.keys(subject)
  });
  
  if (!hasMinimumFields) {
    console.warn('Subject failed validation:', subject);
  }
  
  return hasMinimumFields; // Return true for almost any subject with id and title
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
      
      try {
        // First try the direct API which is more reliable
        if (window.api?.subject?.getDirectSubjects) {
          console.log('Trying direct subjects API first...');
          try {
            const directResult = await window.api.subject.getDirectSubjects();
            console.log('Direct API response:', directResult);
            
            if (directResult._tag === 'Right' && directResult.right) {
              const subjectData = Array.isArray(directResult.right) ? directResult.right : [directResult.right];
              console.log('Got subjects from direct API:', subjectData.length);
              
              // Process subjects
              const processedSubjects = subjectData.map(subject => ({
                id: subject.id || `temp-${Date.now()}-${Math.random()}`,
                title: subject.title || 'Unnamed Subject',
                description: subject.description || '',
                fee: subject.fee || 0,
                metadata: subject.metadata || null,
                createdAt: subject.createdAt || new Date().toISOString(),
                updatedAt: subject.updatedAt || new Date().toISOString(),
                groupCount: subject.groupCount || 0,
                studentCount: subject.studentCount || 0,
              }));
              
              console.log('Processed subjects from direct API:', processedSubjects.length);
              return processedSubjects;
            }
          } catch (directErr) {
            console.error('Direct API failed, falling back to standard API:', directErr);
          }
        }
        
        // Fall back to standard API if direct API failed or wasn't available
        console.log('Using standard subjects API...');
        const result = await window.api.subject.listSubjects();
        console.log('Standard API response:', result);
        
        // Handle error responses
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
        
        console.log('Raw subjects before validation:', subjectsArray);
        
        // Filter out any invalid subjects - but be extremely permissive
        const validSubjects = subjectsArray.filter(subject => 
          subject && typeof subject === 'object'
        );
        
        if (validSubjects.length !== subjectsArray.length) {
          console.warn(`Filtered out ${subjectsArray.length - validSubjects.length} invalid subjects`);
        }
        
        // Process subjects to add group and student counts with defaults
        const subjectsWithMeta = validSubjects.map((subject: any) => ({
          id: subject.id || `temp-${Date.now()}-${Math.random()}`,
          title: subject.title || 'Unnamed Subject',
          description: subject.description || '',
          fee: subject.fee || 0,
          metadata: subject.metadata || null,
          createdAt: subject.createdAt || new Date().toISOString(),
          updatedAt: subject.updatedAt || new Date().toISOString(),
          groupCount: subject.groupCount || 0,
          studentCount: subject.studentCount || 0,
        }));
        
        console.log('Processed subjects for display:', subjectsWithMeta);
        return subjectsWithMeta;
      } catch (error) {
        console.error('Error in subjects query function:', error);
        // Return existing subjects from cache if available
        const existingData = queryClient.getQueryData<any[]>(['subjects']);
        if (existingData && existingData.length > 0) {
          console.log('Returning existing subjects from cache:', existingData.length);
          return existingData;
        }
        // Re-throw error to be handled by React Query
        throw error;
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000, // Consider data stale after 1 second
    retry: 2, // Retry failed requests twice
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
      
      // Ensure we have a complete subject object with all necessary properties
      let newSubject: SubjectWithMeta;
      
      if (data && typeof data === 'object' && data.id && data.title) {
        // Use returned data if it looks valid
        newSubject = {
          ...data,
          fee: data.fee || 0,
          groupCount: data.groupCount || 0,
          studentCount: data.studentCount || 0,
        };
      } else {
        // Create a minimal valid subject from the form data
        newSubject = {
          id: `temp-${Date.now()}`,
          title: data?.title || 'New Subject',
          description: data?.description || '',
          fee: data?.fee || 0,
          groupCount: 0,
          studentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('Created fallback subject object:', newSubject);
      }
      
      // ALWAYS add the subject to the UI cache regardless of validation
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        const oldSubjects = Array.isArray(oldData) ? oldData : [];
        console.log('Adding new subject to UI:', newSubject);
        console.log('Current subject count:', oldSubjects.length);
        return [...oldSubjects, newSubject];
      });
      
      // Invalidate and refetch to ensure we have latest data from server
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      console.log('Invalidated subjects query, will refetch');
      
      // Immediate refetch to update UI
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
  
  // Debug logging for rendering
  useEffect(() => {
    // Debug rendering of subjects
    console.log('RENDERING CHECK - Subjects array type:', Array.isArray(subjects) ? 'Array' : typeof subjects);
    console.log('RENDERING CHECK - Subjects array length:', Array.isArray(subjects) ? subjects.length : 'N/A');
    console.log('RENDERING CHECK - First subject:', subjects?.[0] ? JSON.stringify(subjects[0]) : 'None');
    console.log('RENDERING CHECK - filteredSubjects:', filteredSubjects.length);
    
    // Debug UI rendering
    setTimeout(() => {
      try {
        console.log('DOM CHECK - Subject table rows:', document.querySelectorAll('table tbody tr').length);
      } catch (err) {
        console.error('Error checking DOM:', err);
      }
    }, 1000);
  }, [subjects, filteredSubjects]);

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