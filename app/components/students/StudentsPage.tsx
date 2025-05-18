import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorModeValue,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, DeleteIcon, DownloadIcon, RepeatIcon } from '@chakra-ui/icons';
import { useStudents } from '../../../src/hooks/useStudents';
import { StudentFormData, StudentFilter, StudentWithMeta } from '../../../src/types/student';

// Import student components
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';
import StudentDetailDrawer from './StudentDetailDrawer';
import ModalStepper from '../common/ModalStepper';
import SubjectGroupPicker from './SubjectGroupPicker';

/**
 * Main Students Page component
 */
const StudentsPage: React.FC = () => {
  // State for filter and selected students
  const [filter, setFilter] = useState<StudentFilter>({
    includeKicked: false,
  });
  const [selectedStudents, setSelectedStudents] = useState<StudentWithMeta[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentWithMeta | null>(null);
  const [subjectGroupSelections, setSubjectGroupSelections] = useState<{ subjectId: string; groupId?: string }[]>([]);
  
  // Modal and drawer disclosure hooks
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  
  const {
    isOpen: isDetailDrawerOpen,
    onOpen: onDetailDrawerOpen,
    onClose: onDetailDrawerClose,
  } = useDisclosure();

  // Toast notifications
  const toast = useToast();
  
  // Use the students hook to fetch and manage student data
  const {
    students,
    isLoading,
    isError,
    error,
    refetch,
    createStudent,
    updateStudent,
    kickStudent,
    restoreStudent,
    bulkMoveStudents,
    exportStudents,
    isCreating,
    isUpdating,
    isKicking,
    isExporting,
  } = useStudents(filter);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Handle opening student detail drawer
  const handleViewStudent = useCallback((student: StudentWithMeta) => {
    setCurrentStudent(student);
    onDetailDrawerOpen();
  }, [onDetailDrawerOpen]);
  
  // Handle editing a student
  const handleEditStudent = useCallback((student: StudentWithMeta) => {
    setCurrentStudent(student);
    onEditModalOpen();
  }, [onEditModalOpen]);
  
  // Handle kicking a student
  const handleKickStudent = useCallback((student: StudentWithMeta) => {
    kickStudent(student.id);
  }, [kickStudent]);
  
  // Handle bulk actions on selected students
  const handleBulkAction = useCallback((action: 'move' | 'kick' | 'export') => {
    if (selectedStudents.length === 0) {
      toast({
        title: 'No students selected',
        description: 'Please select at least one student to perform this action.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    switch (action) {
      case 'kick':
        // Confirm before kicking multiple students
        if (window.confirm(`Are you sure you want to kick ${selectedStudents.length} student(s)?`)) {
          const studentIds = selectedStudents.map(student => student.id);
          
          // Kick each selected student
          studentIds.forEach(id => {
            kickStudent(id);
          });
        }
        break;
        
      case 'export':
        // Export selected students
        exportStudents({
          format: 'xlsx',
          anonymizePhones: false,
        });
        break;
        
      case 'move':
        // Handle moving students - would typically open a modal to select target group
        toast({
          title: 'Move students',
          description: `Moving ${selectedStudents.length} students - functionality to be implemented`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        break;
    }
  }, [selectedStudents, kickStudent, exportStudents, toast]);
  
  // Handle creating a new student - first wizard step
  const handleCreateStudent = (formData: StudentFormData) => {
    try {
      console.log('Creating student with data:', formData);
      
      // Check if API is available
      if (!window.api?.student) {
        console.error('Student API not available');
        toast({
          title: 'Error',
          description: 'Student API is not available. Unable to create student.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error('Student API is not available');
      }
      
      // Create the student
      createStudent(formData);
      console.log('Student creation initiated');
      
      // Close modal after submission
      onAddModalClose();
      
      // Show success message
      toast({
        title: 'Student created',
        description: 'New student has been added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create student. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle subject and group selection - second wizard step
  const handleSubjectGroupSelection = (selections: { subjectId: string; groupId?: string }[]) => {
    setSubjectGroupSelections(selections);
  };
  
  // Handle final submission of the new student
  const handleFinalSubmit = async () => {
    if (!currentStudent) return;
    
    try {
      // Create student first
      const studentData: StudentFormData = {
        firstName: currentStudent.firstName,
        lastName: currentStudent.lastName,
        phone: currentStudent.phone as string,
        parentPhone: currentStudent.parentPhone as string,
        parentType: currentStudent.parentType as string,
        school: currentStudent.school as string,
        studyYear: currentStudent.studyYear as string,
        sex: currentStudent.sex as 'male' | 'female',
        tag: currentStudent.tag as 'normal' | 'ss',
        customFee: currentStudent.customFee as number,
        cni: currentStudent.cni as string,
      };
      
      // Create the student
      createStudent(studentData);
      
      // Close modal after successful creation
      onAddModalClose();
      
      // Reset form data
      setCurrentStudent(null);
      setSubjectGroupSelections([]);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create student. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle updating an existing student
  const handleUpdateStudent = (formData: StudentFormData) => {
    if (!currentStudent) return;
    
    try {
      console.log('Updating student with ID:', currentStudent.id, 'Data:', formData);
      
      // Check if API is available
      if (!window.api?.student) {
        console.error('Student API not available');
        toast({
          title: 'Error',
          description: 'Student API is not available. Unable to update student.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw new Error('Student API is not available');
      }
      
      // Make the update call
      updateStudent({
        id: currentStudent.id,
        data: formData,
      });
      
      // Close modal immediately after initiating update
      onEditModalClose();
      
      // Show success toast
      toast({
        title: 'Update in progress',
        description: 'Student information is being updated...',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      
      // Force refresh data after a short delay to allow update to complete
      setTimeout(() => {
        console.log('Forcing refetch after student update');
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update student. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Steps for the add student wizard
  const addStudentSteps = [
    {
      title: 'Personal Info',
      description: 'Basic information',
      content: (
        <StudentForm
          onSubmit={handleCreateStudent}
          isSubmitting={isCreating}
        />
      ),
    },
    {
      title: 'Subjects & Groups',
      description: 'Enrollment',
      content: (
        <SubjectGroupPicker
          onSelectComplete={handleSubjectGroupSelection}
        />
      ),
      isOptional: true,
    },
  ];

  return (
    <Box p={6}>
      <Flex alignItems="center" mb={6}>
        <Heading size="lg">Students</Heading>
        <Spacer />
        
        <HStack spacing={2}>
          {selectedStudents.length > 0 && (
            <HStack spacing={2} mr={2}>
              <Text>{selectedStudents.length} selected</Text>
              <Menu>
                <MenuButton 
                  as={Button} 
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="blue"
                  variant="outline"
                >
                  Bulk Actions
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<RepeatIcon />} 
                    onClick={() => handleBulkAction('move')}
                  >
                    Move to Group
                  </MenuItem>
                  <MenuItem 
                    icon={<DeleteIcon />} 
                    onClick={() => handleBulkAction('kick')}
                  >
                    Kick Students
                  </MenuItem>
                  <MenuItem 
                    icon={<DownloadIcon />} 
                    onClick={() => handleBulkAction('export')}
                  >
                    Export Selected
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
          
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onAddModalOpen}
          >
            Add Student
          </Button>
          
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            onClick={() => refetch()}
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
        <StudentTable
          students={students}
          isLoading={isLoading}
          onRowClick={handleViewStudent}
          onEditClick={handleEditStudent}
          onKickClick={handleKickStudent}
          onFilterChange={setFilter}
          onSelectionChange={setSelectedStudents}
          initialFilter={filter}
        />
      </Box>
      
      {/* Add Student Modal */}
      <ModalStepper
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        steps={addStudentSteps}
        title="Add New Student"
        onComplete={handleFinalSubmit}
        isProcessing={isCreating}
        processingText="Creating student"
        finalButtonText="Create Student"
      />
      
      {/* Edit Student Modal */}
      {isEditModalOpen && currentStudent && (
        <ModalStepper
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          steps={[
            {
              title: 'Edit Student Information',
              content: (
                <StudentForm
                  initialValues={{
                    firstName: currentStudent.firstName,
                    lastName: currentStudent.lastName,
                    phone: currentStudent.phone as string,
                    parentPhone: currentStudent.parentPhone as string,
                    parentType: currentStudent.parentType as string,
                    school: currentStudent.school as string,
                    studyYear: currentStudent.studyYear as string,
                    sex: currentStudent.sex as 'male' | 'female',
                    tag: currentStudent.tag as 'normal' | 'ss',
                    customFee: currentStudent.customFee as number,
                    cni: currentStudent.cni as string,
                  }}
                  onSubmit={handleUpdateStudent}
                  isSubmitting={isUpdating}
                  hideButtons={true}
                />
              ),
              isOptional: false,
            },
          ]}
          title="Edit Student"
          onComplete={() => {
            // This gets called when the "Update Student" button is clicked
            // Form data is already handled by the StudentForm's onSubmit
            if (currentStudent && currentStudent.id) {
              // Force refresh data after update
              setTimeout(() => {
                refetch();
              }, 500);
            }
          }}
          isProcessing={isUpdating}
          processingText="Updating student"
          finalButtonText="Update Student"
        />
      )}
      
      {/* Student Detail Drawer */}
      <StudentDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={onDetailDrawerClose}
        student={currentStudent}
        onEdit={handleEditStudent}
        onKick={handleKickStudent}
      />
    </Box>
  );
};

export default StudentsPage;