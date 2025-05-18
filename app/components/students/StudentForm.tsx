import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Select,
  useColorModeValue,
  HStack,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Divider
} from '@chakra-ui/react';
import { StudentFormData, studentValidationRules } from '../../../src/types/student';

interface StudentFormProps {
  initialValues?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  setValidity?: (isValid: boolean) => void;
  hideButtons?: boolean;
}

/**
 * Form for adding or editing student information
 */
const StudentForm: React.FC<StudentFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  setValidity,
  hideButtons = false,
}) => {
  // Default form state
  const defaultFormState: StudentFormData = {
    firstName: '',
    lastName: '',
    phone: '',
    parentPhone: '',
    parentType: 'father',
    school: '',
    studyYear: '',
    sex: 'male',
    tag: 'normal',
    customFee: 0,
    cni: '',
    ...initialValues,
  };

  // State for form data and errors
  const [formData, setFormData] = useState<StudentFormData>(defaultFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof StudentFormData, boolean>>>({});
  const [formIsValid, setFormIsValid] = useState(false);

  // Communicate form validity to parent component if setValidity is provided
  useEffect(() => {
    // Check if all required fields are valid
    const isFormValid = validateForm(false);
    
    if (setValidity && formIsValid !== isFormValid) {
      setFormIsValid(isFormValid);
      setValidity(isFormValid);
    }
  }, [formData, setValidity]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change
    validateField(name as keyof StudentFormData, value);
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing tag from ss to normal, reset customFee
    if (name === 'tag' && value === 'normal') {
      setFormData(prev => ({ ...prev, customFee: 0 }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof StudentFormData, formData[name as keyof StudentFormData]);
  };

  // Validate a specific field
  const validateField = (name: keyof StudentFormData, value: any) => {
    let error = '';
    const rules = studentValidationRules[name];

    if (!rules) return;

    // Required field validation
    if (rules.required && (!value || value.trim() === '')) {
      error = typeof rules.required === 'string' ? rules.required : 'This field is required';
    }
    
    // Min length validation
    else if (rules.minLength && value.length < rules.minLength.value) {
      error = rules.minLength.message;
    }
    
    // Pattern validation
    else if (rules.pattern && !rules.pattern.value.test(value)) {
      error = rules.pattern.message;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate all fields
  const validateForm = (updateState: boolean = true): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
    const newTouched: Partial<Record<keyof StudentFormData, boolean>> = {};

    // Mark all fields as touched
    Object.keys(formData).forEach(key => {
      if (updateState) {
        newTouched[key as keyof StudentFormData] = true;
      }
      
      const fieldName = key as keyof StudentFormData;
      const rules = studentValidationRules[fieldName];
      
      // Skip if no validation rules for this field
      if (!rules) return;
      
      let error = '';
      const value = formData[fieldName];

      // Required field validation
      if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        error = typeof rules.required === 'string' ? rules.required : 'This field is required';
        isValid = false;
      }
      
      // Min length validation
      else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength.value) {
        error = rules.minLength.message;
        isValid = false;
      }
      
      // Pattern validation
      else if (rules.pattern && typeof value === 'string' && !rules.pattern.value.test(value)) {
        error = rules.pattern.message;
        isValid = false;
      }

      if (updateState) {
        newErrors[fieldName] = error;
      }
    });

    if (updateState) {
      setErrors(newErrors);
      setTouched(newTouched);
    }
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="flex-start" width="100%">
        <Text fontSize="lg" fontWeight="bold">Personal Information</Text>
        
        {/* Personal Information Section */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl 
              isRequired 
              isInvalid={!!errors.firstName && touched.firstName}
            >
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="First name"
              />
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl 
              isRequired 
              isInvalid={!!errors.lastName && touched.lastName}
            >
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Last name"
              />
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel htmlFor="sex">Gender</FormLabel>
              <RadioGroup 
                id="sex"
                name="sex"
                value={formData.sex || 'male'}
                onChange={(value) => handleRadioChange('sex', value)}
              >
                <Stack direction="row">
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl 
              isInvalid={!!errors.cni && touched.cni}
            >
              <FormLabel htmlFor="cni">National ID (CNI)</FormLabel>
              <Input
                id="cni"
                name="cni"
                value={formData.cni || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="National ID number"
              />
              <FormErrorMessage>{errors.cni}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
        
        <Divider my={2} />
        <Text fontSize="lg" fontWeight="bold">Contact Information</Text>
        
        {/* Contact Information Section */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl 
              isInvalid={!!errors.phone && touched.phone}
            >
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone number"
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl 
              isInvalid={!!errors.parentPhone && touched.parentPhone}
            >
              <FormLabel htmlFor="parentPhone">Parent Phone Number</FormLabel>
              <Input
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Parent phone number"
              />
              <FormErrorMessage>{errors.parentPhone}</FormErrorMessage>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel htmlFor="parentType">Parent Type</FormLabel>
              <Select
                id="parentType"
                name="parentType"
                value={formData.parentType || 'father'}
                onChange={handleChange}
              >
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          </GridItem>
        </Grid>
        
        <Divider my={2} />
        <Text fontSize="lg" fontWeight="bold">Education Information</Text>
        
        {/* Education Information Section */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel htmlFor="school">School</FormLabel>
              <Input
                id="school"
                name="school"
                value={formData.school || ''}
                onChange={handleChange}
                placeholder="School name"
              />
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel htmlFor="studyYear">Study Year</FormLabel>
              <Input
                id="studyYear"
                name="studyYear"
                value={formData.studyYear || ''}
                onChange={handleChange}
                placeholder="Current study year"
              />
            </FormControl>
          </GridItem>
        </Grid>
        
        <Divider my={2} />
        <Text fontSize="lg" fontWeight="bold">Payment Information</Text>
        
        {/* Payment Information Section */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel htmlFor="tag">Student Tag</FormLabel>
              <RadioGroup 
                id="tag"
                name="tag"
                value={formData.tag || 'normal'}
                onChange={(value) => handleRadioChange('tag', value)}
              >
                <Stack direction="row">
                  <Radio value="normal">Normal</Radio>
                  <Radio value="ss">Scholarship (SS)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
          
          {formData.tag === 'ss' && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormControl>
                <FormLabel htmlFor="customFee">Custom Monthly Fee</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.customFee || 0}
                  onChange={(value) => handleNumberChange('customFee', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
          )}
        </Grid>

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

export default StudentForm;