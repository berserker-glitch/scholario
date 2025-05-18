import React, { useState, ReactNode, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useColorModeValue,
} from '@chakra-ui/react';

interface Step {
  title: string;
  description?: string;
  content: ReactNode;
  isOptional?: boolean;
}

interface ModalStepperProps {
  isOpen: boolean;
  onClose: () => void;
  steps: Step[];
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  onComplete: (currentStepIndex: number) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
  processingText?: string;
  finalButtonText?: string;
}

/**
 * Reusable modal stepper component for multi-step forms
 */
const ModalStepper: React.FC<ModalStepperProps> = ({
  isOpen,
  onClose,
  steps,
  title,
  size = 'xl',
  onComplete,
  onCancel,
  isProcessing = false,
  processingText = 'Processing',
  finalButtonText = 'Submit',
}) => {
  // Stepper hooks and state
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  // Track if each step is valid
  const [stepsValidity, setStepsValidity] = useState<boolean[]>(() => {
    // Initialize with true for optional steps and false for required steps
    return steps.map(step => step.isOptional === true);
  });

  useEffect(() => {
    // Reset validity when steps change
    setStepsValidity(steps.map(step => step.isOptional === true));
  }, [steps.length]);

  // Check if current step is the last one
  const isLastStep = activeStep === steps.length - 1;
  const currentStep = steps[activeStep];
  
  // Color mode values
  const stepperBgColor = useColorModeValue('gray.100', 'gray.700');
  
  // Handle navigation between steps
  const handleNext = () => {
    if (isLastStep) {
      // For the last step, find any form element and submit it first
      const formElement = document.querySelector('.modal-content form');
      if (formElement instanceof HTMLFormElement) {
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
      
      // Then call onComplete
      onComplete(activeStep);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Mark current step as valid or invalid
  const setCurrentStepValidity = (isValid: boolean) => {
    const newValidity = [...stepsValidity];
    newValidity[activeStep] = isValid;
    setStepsValidity(newValidity);
  };
  
  // Check if Next/Submit button should be enabled
  const isNextEnabled = stepsValidity[activeStep] || currentStep.isOptional;
  
  // Handle skip for optional steps
  const handleSkip = () => {
    if (currentStep.isOptional) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW={size === 'full' ? '90%' : undefined} className="modal-content">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <Stepper index={activeStep} mb={8} bg={stepperBgColor} p={4} borderRadius="md">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                
                <Box flexShrink={0}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          
          <Box>
            {React.isValidElement(currentStep.content)
              ? React.cloneElement(currentStep.content as React.ReactElement<any>, {
                  setValidity: setCurrentStepValidity,
                  isLastStep,
                })
              : currentStep.content}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Flex width="100%" justifyContent="space-between">
            <Box>
              {activeStep > 0 && (
                <Button 
                  onClick={handlePrevious} 
                  mr={3} 
                  variant="outline"
                  isDisabled={isProcessing}
                >
                  Previous
                </Button>
              )}
              
              {currentStep.isOptional && (
                <Button 
                  variant="ghost" 
                  colorScheme="gray"
                  onClick={handleSkip}
                  isDisabled={isProcessing}
                >
                  Skip
                </Button>
              )}
            </Box>
            
            <Box>
              {onCancel && (
                <Button 
                  onClick={onCancel} 
                  mr={3} 
                  variant="ghost"
                  isDisabled={isProcessing}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                colorScheme="blue"
                onClick={handleNext}
                isDisabled={!isNextEnabled || isProcessing}
                isLoading={isProcessing}
                loadingText={processingText}
              >
                {isLastStep ? finalButtonText : 'Next'}
              </Button>
            </Box>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalStepper; 