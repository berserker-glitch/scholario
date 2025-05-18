import React from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiBook, 
  //FiGrid, 
  FiDollarSign, 
  FiSettings,
  FiHome
} from 'react-icons/fi';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

/**
 * Sidebar navigation component
 */
const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeTextColor = useColorModeValue('blue.600', 'blue.200');
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'subjects', label: 'Subjects', icon: FiBook },
    //{ id: 'groups', label: 'Groups', icon: FiGrid },
    { id: 'payments', label: 'Payments', icon: FiDollarSign },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];
  
  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      width="220px"
      height="calc(100vh - 60px)" // Adjust based on header height
      bg={bgColor}
      borderRightWidth="1px"
      borderColor={borderColor}
      py={4}
    >
      <VStack spacing={1} align="stretch">
        {navItems.map((item) => (
          <Flex
            key={item.id}
            align="center"
            px={4}
            py={3}
            cursor="pointer"
            role="group"
            fontWeight={activeModule === item.id ? "semibold" : "normal"}
            bg={activeModule === item.id ? activeBgColor : 'transparent'}
            color={activeModule === item.id ? activeTextColor : 'inherit'}
            _hover={{
              bg: activeModule === item.id ? activeBgColor : hoverBgColor,
            }}
            borderLeftWidth={activeModule === item.id ? "4px" : "0px"}
            borderLeftColor="blue.500"
            onClick={() => onModuleChange(item.id)}
          >
            <Icon 
              as={item.icon} 
              mr={3} 
              boxSize={5} 
              color={activeModule === item.id ? activeTextColor : 'inherit'}
            />
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 