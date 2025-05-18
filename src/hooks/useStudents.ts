// @ts-nocheck
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Student, StudentFilter, StudentFormData } from '../types/student';
import { useToast, Box, Text } from '@chakra-ui/react';
import React from 'react';

/**
 * Hook for managing student data
 */
export function useStudents(filter: StudentFilter = {}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Check if API is available
  const isApiAvailable = !!window.api?.student;
  
  // Check database connection status
  const { 
    data: dbStatus, 
    error: dbError 
  } = useQuery({
    queryKey: ['dbStatus'],
    queryFn: async () => {
      if (!window.api?.db?.checkStatus) {
        console.warn('Database status check API not available');
        return { connected: false, error: 'Database status check API not available' };
      }
      
      try {
        const result = await window.api.db.checkStatus();
        if (result._tag === 'Left') {
          console.error('Database connection check failed:', result.left);
          return { connected: false, error: result.left?.message || 'Database connection check failed' };
        }
        
        return { connected: result.right?.connected || false };
      } catch (err) {
        console.error('Error checking database status:', err);
        return { connected: false, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    },
    // Check every minute and on window focus
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 3
  });
  
  // Show database error toast if needed
  React.useEffect(() => {
    if (dbError || (dbStatus && !dbStatus.connected && dbStatus.error)) {
      const errorMessage = dbError instanceof Error 
        ? dbError.message 
        : dbStatus?.error || 'Database connection issue';
        
      toast({
        title: 'Database Connection Issue',
        description: errorMessage,
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }, [dbError, dbStatus, toast]);

  // Fetch students query
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    data: students = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
  /* eslint-enable @typescript-eslint/no-unused-vars */
    queryKey: ['students', filter],
    queryFn: async () => {
      // If API is not available, throw error
      if (!isApiAvailable) {
        throw new Error('Student API is not available');
      }
      
      // Check database connection first
      if (dbStatus && !dbStatus.connected) {
        throw new Error(dbStatus.error || 'Database connection issue');
      }
      
      try {
        // Use the real API
        const result = await window.api.student.listStudents(filter);
        
        // Check if we got an error from the API
        if (result._tag === 'Left') {
          throw new Error(result.left?.message || 'Failed to fetch students');
        }
        
        // Ensure the result is an array
        if (Array.isArray(result.right)) {
          return result.right;
        } else {
          return [];
        }
      } catch (err) {
        console.error('Error fetching students from API:', err);
        throw err;
      }
    },
    // Don't attempt if database is not connected
    enabled: isApiAvailable && (!dbStatus || dbStatus.connected)
  });

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      if (!isApiAvailable) {
        throw new Error('Student API is not available');
      }
      
      // Check database connection first
      if (dbStatus && !dbStatus.connected) {
        throw new Error(dbStatus.error || 'Database connection issue');
      }
      
      console.log("Creating student with API:", data);
      
      try {
        // Optional - check DB status before attempting student creation
        if (window.api.db?.checkStatus) {
          const statusResult = await window.api.db.checkStatus();
          if (statusResult._tag === 'Left' || !statusResult.right?.connected) {
            console.error("Database connection issue:", statusResult);
            throw new Error('Database connection issue');
          }
        }
        
        const result = await window.api.student.createStudent(data);
        console.log("Student creation result:", result);
        
        if (result._tag === 'Left') {
          throw new Error(result.left?.message || 'Failed to create student');
        }
        
        if (!result.right) {
          throw new Error('Student created but no data returned');
        }
        
        return result.right;
      } catch (error) {
        console.error("Error during student creation:", error);
        throw error;
      }
    },
    onSuccess: (newStudent) => {
      console.log("Student created successfully:", newStudent);
      
      toast({
        title: 'Student created',
        description: 'New student has been added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Always invalidate queries to update the UI
      console.log("Invalidating queries after student creation");
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
    onError: (error: Error) => {
      console.error("Student creation error:", error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StudentFormData> }) => {
      console.log("Updating student with data:", data, "ID:", id);
      
      if (!window.api?.student?.updateStudent) {
        throw new Error('Student update API is not available');
      }

      // Make the API call
      const result = await window.api.student.updateStudent(id, data);
      console.log("Update API result:", result);
      
      if (result._tag === 'Left') {
        console.error("Update failed:", result.left);
        throw new Error(result.left?.message || 'Failed to update student');
      }
      
      if (!result.right) {
        console.error("Update returned empty result");
        throw new Error('Student update did not return updated data');  
      }
      
      console.log("Student updated successfully:", result.right);
      return result.right;
    },
    onSuccess: (updatedStudent) => {
      console.log("Student update success callback with data:", updatedStudent);
      
      toast({
        title: 'Student updated',
        description: 'Student information has been updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Force invalidation of all student-related queries to refresh the UI
      console.log("Invalidating queries after student update");
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
      
      // Force refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: ['students'] });
    },
    onError: (error: Error) => {
      console.error("Student update error:", error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Kick student mutation with undo
  const kickMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await window.api.student.softDeleteStudent(id);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to kick student');
      }
      return { id, success: result.right };
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['students'] });

      // Snapshot the previous value
      const previousStudents = queryClient.getQueryData(['students', filter]);

      // Optimistically update to the new value
      queryClient.setQueryData(['students', filter], (old: Student[] = []) => {
        return old.map(student => 
          student.id === id ? { ...student, isKicked: true } : student
        );
      });

      return { previousStudents };
    },
    onSuccess: ({ id }) => {
      const toastId = toast({
        title: 'Student kicked',
        description: 'Student has been kicked. Undo?',
        status: 'info',
        duration: 5000,
        isClosable: true
      });
      
      // Set up a separate undo button after the toast
      toast({
        title: 'Undo',
        status: 'info',
        duration: 4000,
        isClosable: true,
        onCloseComplete: () => {
          handleUndoKick(id);
        }
      });
    },
    onError: (error, _, context) => {
      // Rollback to the previous value
      if (context?.previousStudents) {
        queryClient.setQueryData(['students', filter], context.previousStudents);
      }
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to kick student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
    }
  });

  // Restore student mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await window.api.student.restoreKickedStudent(id);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to restore student');
      }
      return result.right;
    },
    onSuccess: () => {
      toast({
        title: 'Student restored',
        description: 'Student has been restored successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to restore student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Bulk move students mutation
  const bulkMoveMutation = useMutation({
    mutationFn: async ({ groupId, studentIds }: { groupId: string; studentIds: string[] }) => {
      const result = await window.api.student.bulkMoveStudents(groupId, studentIds);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to move students');
      }
      return result.right;
    },
    onSuccess: () => {
      toast({
        title: 'Students moved',
        description: 'Selected students have been moved to the new group',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to move students',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Export students mutation
  const exportMutation = useMutation({
    mutationFn: async ({ format, anonymizePhones = false }: { format: 'csv' | 'xlsx'; anonymizePhones?: boolean }) => {
      const result = await window.api.student.exportStudents(filter);
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to export students');
      }

      // Process data for export
      const studentsToExport = result.right || [];
      const processedData = studentsToExport.map(student => {
        // Apply anonymization if requested
        const phone = anonymizePhones 
          ? student.phone?.replace(/\d(?=\d{4})/g, '*') 
          : student.phone;

        return {
          'First Name': student.firstName,
          'Last Name': student.lastName,
          'Phone': phone || '',
          'Parent Phone': student.parentPhone || '',
          'School': student.school || '',
          'Study Year': student.studyYear || '',
          'CNI': student.cni || '',
        };
      });

      // Trigger file download
      const fileName = `students_export_${new Date().toISOString().split('T')[0]}`;
      return window.electronAPI.exportData(format, fileName, processedData);
    },
    onSuccess: (filePath) => {
      toast({
        title: 'Export complete',
        description: `Students exported successfully to ${filePath}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Export failed',
        description: error.message || 'Failed to export students',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Handle undoing a student kick
  const handleUndoKick = useCallback((id: string) => {
    // Call the restore mutation
    restoreMutation.mutate(id);
  }, [restoreMutation]);

  // Computed properties
  const studentsWithMeta = useMemo(() => {
    // Ensure students is an array before mapping
    const studentsArray = Array.isArray(students) ? students : [];
    return studentsArray.map(student => ({
      ...student,
      fullName: `${student.firstName} ${student.lastName}`,
    }));
  }, [students]);

  return {
    students: studentsWithMeta,
    isLoading,
    isError,
    error,
    refetch,
    createStudent: createMutation.mutate,
    updateStudent: updateMutation.mutate,
    kickStudent: kickMutation.mutate,
    restoreStudent: restoreMutation.mutate,
    bulkMoveStudents: bulkMoveMutation.mutate,
    exportStudents: exportMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isKicking: kickMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isMoving: bulkMoveMutation.isPending,
    isExporting: exportMutation.isPending,
  };
} 