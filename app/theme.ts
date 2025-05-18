import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

/**
 * Theme configuration with color mode settings
 */
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

/**
 * Custom colors for the theme
 */
const colors = {
  brand: {
    50: '#E6F6FF',
    100: '#B3E0FF',
    200: '#80CAFF',
    300: '#4DB5FF',
    400: '#1A9FFF',
    500: '#0088E6',
    600: '#006BB4',
    700: '#004E82',
    800: '#003151',
    900: '#00131F',
  },
};

/**
 * Font configurations
 */
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
};

/**
 * Component style overrides
 */
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
    },
    variants: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
        _active: {
          bg: 'brand.700',
        },
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.800',
        _hover: {
          bg: 'gray.300',
        },
        _dark: {
          bg: 'gray.700',
          color: 'white',
          _hover: {
            bg: 'gray.600',
          },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'md',
      },
    },
  },
};

/**
 * Custom styles for dark and light mode
 */
const styles = {
  global: (props: { colorMode: 'light' | 'dark' }) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

/**
 * The extended theme with all customizations
 */
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

export default theme; 