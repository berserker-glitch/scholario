import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
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
  Textarea,
  Text,
} from '@chakra-ui/react';

export interface SubjectFormData {
  title: string;
  description?: string;
  fee: number;
}

interface SubjectFormProps {
  initialValues?: Partial<SubjectFormData>;
  onSubmit: (data: SubjectFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  setValidity?: (isValid: boolean) => void;
  hideButtons?: boolean;
}

/**
 * Form for adding or editing subject information
 */
const SubjectForm: React.FC<SubjectFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  setValidity,
  hideButtons = false,
}) => {
  // Default form state
  const defaultFormState: SubjectFormData = {
    title: '',
    description: '',
    fee: 0,
    ...initialValues,
  };

  // State for form data and errors
  const [formData, setFormData] = useState<SubjectFormData>(defaultFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof SubjectFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SubjectFormData, boolean>>>({});

  // Communicate form validity to parent component if setValidity is provided
  useEffect(() => {
    const isValid = !errors.title && formData.title.trim() !== '';
    if (setValidity) {
      setValidity(isValid);
    }
  }, [formData, errors, setValidity]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof SubjectFormData, value);
  };

  // Handle number input changes
  const handleFeeChange = (valueAsString: string, valueAsNumber: number) => {
    const fee = !isNaN(valueAsNumber) ? valueAsNumber : 0;
    setFormData(prev => ({ ...prev, fee }));
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof SubjectFormData, formData[name as keyof SubjectFormData]);
  };

  // Validate a specific field
  const validateField = (name: keyof SubjectFormData, value: any) => {
    let error = '';
    
    if (name === 'title' && (!value || value.trim() === '')) {
      error = 'Subject name is required';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SubjectFormData, string>> = {};
    const newTouched: Partial<Record<keyof SubjectFormData, boolean>> = {};
    let isValid = true;

    // Mark all fields as touched
    Object.keys(formData).forEach(key => {
      newTouched[key as keyof SubjectFormData] = true;
    });

    // Validate title
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Subject name is required';
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
        <Text fontSize="lg" fontWeight="bold">Subject Information</Text>
        
        <FormControl 
          isRequired 
          isInvalid={!!errors.title && touched.title}
        >
          <FormLabel htmlFor="title">Subject Name</FormLabel>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Subject name"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Subject description (optional)"
            resize="vertical"
            rows={3}
          />
        </FormControl>
        
        <FormControl>
          <FormLabel htmlFor="fee">Monthly Fee (DH)</FormLabel>
          <NumberInput
            id="fee"
            value={formData.fee}
            onChange={handleFeeChange}
            min={0}
            step={50}
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

export default SubjectForm; 