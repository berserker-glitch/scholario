/**
 * Student type definitions
 */

// Base student type based on the database schema
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  parentPhone?: string | null;
  parentType?: string | null;
  school?: string | null;
  studyYear?: string | null;
  sex?: 'male' | 'female' | null;
  tag?: 'normal' | 'ss' | null;
  customFee?: number | null;
  cni?: string | null;
  isKicked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Student status types
export type StudentStatus = 'active' | 'inactive' | 'pending';

// Parent type options
export type ParentType = 'father' | 'mother' | 'guardian' | 'other';

// Extended student type with computed properties
export interface StudentWithMeta extends Student {
  fullName: string; // Computed property
}

// Form data for creating/updating students
export interface StudentFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  parentPhone?: string;
  parentType?: string;
  school?: string;
  studyYear?: string;
  sex?: 'male' | 'female';
  tag?: 'normal' | 'ss';
  customFee?: number;
  cni?: string;
}

// Filter options for student queries
export interface StudentFilter {
  search?: string;
  tag?: 'normal' | 'ss' | '';
  includeKicked?: boolean;
}

// Student bulk action types
export type StudentBulkAction = 'move' | 'kick' | 'export';

// Form validation schema (can be used with react-hook-form)
export const studentValidationRules = {
  firstName: {
    required: 'First name is required',
    minLength: { value: 2, message: 'First name must be at least 2 characters' },
  },
  lastName: {
    required: 'Last name is required',
    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
  },
  phone: {
    pattern: {
      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      message: 'Invalid phone number',
    },
  },
  parentPhone: {
    pattern: {
      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      message: 'Invalid parent phone number',
    },
  },
  cni: {
    pattern: {
      value: /^[A-Z0-9]+$/i,
      message: 'Invalid national ID format',
    },
  },
}; 