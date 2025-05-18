import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  VStack,
  Text,
  Flex,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  RadioGroup,
  Radio,
  Stack,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

// Define subject and group types
interface Subject {
  id: string;
  title: string;
  description?: string;
}

interface Group {
  id: string;
  name: string;
  capacity?: number;
  enrollments?: any[];
  allowOverride?: boolean;
}

interface SubjectGroupPickerProps {
  studentId?: string;
  onSelectComplete: (selected: { subjectId: string; groupId?: string }[]) => void;
  setValidity?: (isValid: boolean) => void;
}

/**
 * Component for picking subjects and groups for a student
 */
const SubjectGroupPicker: React.FC<SubjectGroupPickerProps> = ({
  studentId,
  onSelectComplete,
  setValidity,
}) => {
  // State for selected subjects and groups
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>({});
  const toast = useToast();

  // Fetch available subjects
  const {
    data: subjects = [],
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const result = await window.api.subject.listSubjects();
      if (result._tag === 'Left') {
        throw new Error(result.left?.message || 'Failed to fetch subjects');
      }
      return result.right || [];
    }
  });

  // Fetch groups for selected subjects
  const {
    data: groupsData = {},
    isLoading: isLoadingGroups,
    error: groupsError,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ['groups', selectedSubjects],
    queryFn: async () => {
      if (!selectedSubjects.length) return {};

      const groupsMap: Record<string, any[]> = {};
      
      // Fetch groups for each selected subject
      for (const subjectId of selectedSubjects) {
        const result = await window.api.group.listGroups(subjectId);
        if (result._tag === 'Left') {
          throw new Error(result.left?.message || 'Failed to fetch groups');
        }
        groupsMap[subjectId] = result.right || [];
      }
      
      return groupsMap;
    },
    enabled: selectedSubjects.length > 0,
  });

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedSubjects(prev => [...prev, subjectId]);
    } else {
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      // Remove any group selections for this subject
      const newSelectedGroups = { ...selectedGroups };
      delete newSelectedGroups[subjectId];
      setSelectedGroups(newSelectedGroups);
    }
  };

  // Handle group selection for a subject
  const handleGroupSelect = (subjectId: string, groupId: string) => {
    setSelectedGroups(prev => ({
      ...prev,
      [subjectId]: groupId,
    }));
  };

  // Prepare form data when selections change
  useEffect(() => {
    const selections = selectedSubjects.map(subjectId => ({
      subjectId,
      groupId: selectedGroups[subjectId],
    }));
    
    // Notify parent of selections
    onSelectComplete(selections);
    
    // Update validity - form is valid if at least one subject is selected
    if (setValidity) {
      setValidity(selectedSubjects.length > 0);
    }
  }, [selectedSubjects, selectedGroups, onSelectComplete, setValidity]);

  // Format data for easy rendering
  const subjectsWithGroups = useMemo(() => {
    return subjects.map((subject: Subject) => ({
      ...subject,
      groups: groupsData[subject.id] || [],
      isSelected: selectedSubjects.includes(subject.id),
      selectedGroupId: selectedGroups[subject.id],
    }));
  }, [subjects, groupsData, selectedSubjects, selectedGroups]);

  if (isLoadingSubjects) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (subjectsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load subjects. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Text mb={4}>
        Select the subjects and groups for the student. Group selection is optional.
      </Text>

      {subjects.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No subjects available. Please create some subjects first.
        </Alert>
      ) : (
        <VStack spacing={6} align="stretch">
          {subjectsWithGroups.map((subject: any) => (
            <Card key={subject.id} variant="outline">
              <CardHeader pb={2}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="md">
                    {subject.title}
                  </Heading>
                  <Button
                    size="sm"
                    colorScheme={subject.isSelected ? "red" : "blue"}
                    onClick={() => handleSubjectSelect(subject.id, !subject.isSelected)}
                  >
                    {subject.isSelected ? "Remove" : "Add"}
                  </Button>
                </Flex>
                {subject.description && (
                  <Text color="gray.500" fontSize="sm" mt={1}>
                    {subject.description}
                  </Text>
                )}
              </CardHeader>
              
              {subject.isSelected && (
                <>
                  <Divider />
                  <CardBody pt={3}>
                    {isLoadingGroups ? (
                      <Flex justify="center" py={4}>
                        <Spinner size="md" />
                      </Flex>
                    ) : subject.groups.length === 0 ? (
                      <Text color="orange.500">
                        No groups available for this subject. Student will be enrolled in the subject without a group.
                      </Text>
                    ) : (
                      <FormControl>
                        <FormLabel>Select a group</FormLabel>
                        <RadioGroup 
                          value={subject.selectedGroupId || ''} 
                          onChange={(value) => handleGroupSelect(subject.id, value)}
                        >
                          <Stack>
                            <Radio value="">
                              <Text>Assign to group later</Text>
                            </Radio>
                            
                            {subject.groups.map((group: Group) => {
                              const isFull = group.capacity && group.enrollments 
                                ? group.enrollments.length >= group.capacity 
                                : false;
                                
                              return (
                                <Radio 
                                  key={group.id} 
                                  value={group.id}
                                  isDisabled={isFull && !group.allowOverride}
                                >
                                  <Flex alignItems="center">
                                    <Text>{group.name}</Text>
                                    {isFull ? (
                                      <Badge colorScheme="red" ml={2}>Full</Badge>
                                    ) : (
                                      group.capacity && (
                                        <Badge colorScheme="green" ml={2}>
                                          {group.enrollments?.length || 0}/{group.capacity}
                                        </Badge>
                                      )
                                    )}
                                  </Flex>
                                </Radio>
                              );
                            })}
                          </Stack>
                        </RadioGroup>
                        <FormHelperText>
                          Select a group or choose to assign later
                        </FormHelperText>
                      </FormControl>
                    )}
                  </CardBody>
                </>
              )}
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default SubjectGroupPicker; 