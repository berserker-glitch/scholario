import React from 'react';
import { 
  Flex, 
  Text, 
  IconButton, 
  useColorMode, 
  Button,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import useAuth from '../../src/hooks/useAuth';

/**
 * Toggle for switching between light and dark mode
 */
const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
    />
  );
};

/**
 * Main navigation header component
 */
const Header: React.FC = () => {
  const { logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Logout handler
  const handleLogout = () => {
    logout();
    
    // Force page reload to reset all application state
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };
  
  return (
    <Flex 
      as="header" 
      width="full" 
      align="center" 
      justifyContent="space-between" 
      py={3} 
      px={8}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      height="60px"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Text fontSize="xl" fontWeight="bold" color="blue.500">Scholario</Text>
      
      <HStack spacing={4}>
        <ColorModeToggle />
        
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
          >
            <HStack>
              <Avatar size="sm" name="Admin User" bg="blue.500" />
              <Text display={{ base: 'none', md: 'block' }}>Admin</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header; 