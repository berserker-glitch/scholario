import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Badge,
} from '@chakra-ui/react';

export interface GroupFormData {
  name: string;
  capacity: number;
  subjectId?: string;
}

interface GroupFormProps {
  initialValues?: Partial<GroupFormData>;
  onSubmit: (data: GroupFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  setValidity?: (isValid: boolean) => void;
  hideButtons?: boolean;
  subjectName?: string;
}

/**
 * Form for adding or editing group information
 */
const GroupForm: React.FC<GroupFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  setValidity,
  hideButtons = false,
  subjectName,
}) => {
  // Default form state
  const defaultFormState: GroupFormData = {
    name: '',
    capacity: 10,
    ...initialValues,
  };

  // State for form data and errors
  const [formData, setFormData] = useState<GroupFormData>(defaultFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof GroupFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof GroupFormData, boolean>>>({});

  // Communicate form validity to parent component if setValidity is provided
  useEffect(() => {
    const isValid = !errors.name && formData.name.trim() !== '';
    if (setValidity) {
      setValidity(isValid);
    }
  }, [formData, errors, setValidity]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof GroupFormData, value);
  };

  // Handle number input changes
  const handleCapacityChange = (valueAsString: string, valueAsNumber: number) => {
    const capacity = !isNaN(valueAsNumber) ? valueAsNumber : 10;
    setFormData(prev => ({ ...prev, capacity }));
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof GroupFormData, formData[name as keyof GroupFormData]);
  };

  // Validate a specific field
  const validateField = (name: keyof GroupFormData, value: any) => {
    let error = '';
    
    if (name === 'name' && (!value || value.trim() === '')) {
      error = 'Group name is required';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GroupFormData, string>> = {};
    const newTouched: Partial<Record<keyof GroupFormData, boolean>> = {};
    let isValid = true;

    // Mark all fields as touched
    Object.keys(formData).forEach(key => {
      newTouched[key as keyof GroupFormData] = true;
    });

    // Validate name
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Group name is required';
      isValid = false;
    }

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="flex-start" width="100%">
        <Flex align="center" width="100%">
          <Text fontSize="lg" fontWeight="bold">Group Information</Text>
          {subjectName && (
            <Badge ml={2} colorScheme="blue">
              {subjectName}
            </Badge>
          )}
        </Flex>
        
        <FormControl 
          isRequired 
          isInvalid={!!errors.name && touched.name}
        >
          <FormLabel htmlFor="name">Group Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Group name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        
        <FormControl>
          <FormLabel htmlFor="capacity">Group Capacity</FormLabel>
          <NumberInput
            id="capacity"
            value={formData.capacity}
            onChange={handleCapacityChange}
            min={1}
            max={50}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        {!hideButtons && (
          <HStack width="100%" justifyContent="flex-end" spacing={4} pt={4}>
            {onCancel && (
              <Button 
                onClick={onCancel} 
                disabled={isSubmitting}
                variant="outline"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              colorScheme="blue" 
              isLoading={isSubmitting}
              loadingText="Saving"
            >
              Save
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default GroupForm; 