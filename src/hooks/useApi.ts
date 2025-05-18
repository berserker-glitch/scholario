import { useState, useCallback } from 'react';
import { 
  useMutation, 
  useQuery, 
  UseMutationOptions, 
  UseQueryOptions,
  QueryClient
} from '@tanstack/react-query';

/**
 * Helper to extract data from Either result
 * @param result - Either result from IPC call
 */
export function extractData<T>(result: EitherResult<T>): T {
  if (result._tag === 'Left') {
    throw result.left || new Error('Unknown error');
  }
  return result.right as T;
}

/**
 * Creates a query key with namespace
 * @param namespace - API namespace
 * @param method - Method name
 * @param params - Query parameters
 */
export function createQueryKey(
  namespace: string, 
  method: string, 
  params?: Record<string, any>
): unknown[] {
  return [namespace, method, params];
}

/**
 * Hook for handling API mutations with proper error handling
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<EitherResult<TData>>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      return extractData(result);
    }
  });
}

/**
 * Hook for handling API queries with proper error handling
 */
export function useApiQuery<TData>(
  queryKey: unknown[],
  queryFn: () => Promise<EitherResult<TData>>,
  options?: Omit<UseQueryOptions<TData, Error, TData, unknown[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      return extractData(result);
    },
    ...options
  });
}

/**
 * Custom hook for student API operations
 */
export function useStudentApi() {
  // List students
  const useListStudents = (filter?: any, options?: any) => useApiQuery(
    createQueryKey('student', 'list', filter),
    () => window.api.student.listStudents(filter),
    options
  );
  
  // Create student
  const useCreateStudent = (options?: any) => useApiMutation(
    (data: any) => window.api.student.createStudent(data),
    options
  );
  
  // Update student
  const useUpdateStudent = (options?: any) => useApiMutation(
    ({ id, data }: { id: string; data: any }) => 
      window.api.student.updateStudent(id, data),
    options
  );
  
  // Soft delete student
  const useSoftDeleteStudent = (options?: any) => useApiMutation(
    (id: string) => window.api.student.softDeleteStudent(id),
    options
  );
  
  // Restore kicked student
  const useRestoreKickedStudent = (options?: any) => useApiMutation(
    (id: string) => window.api.student.restoreKickedStudent(id),
    options
  );
  
  return {
    useListStudents,
    useCreateStudent,
    useUpdateStudent,
    useSoftDeleteStudent,
    useRestoreKickedStudent
  };
}

/**
 * Custom hook for group API operations
 */
export function useGroupApi() {
  // List groups
  const useListGroups = (subjectId: string, options?: any) => useApiQuery(
    createQueryKey('group', 'list', { subjectId }),
    () => window.api.group.listGroups(subjectId),
    options
  );
  
  // Get group details
  const useGroupDetails = (id: string, options?: any) => useApiQuery(
    createQueryKey('group', 'details', { id }),
    () => window.api.group.getGroup(id),
    options
  );
  
  // Create group
  const useCreateGroup = (options?: any) => useApiMutation(
    ({ subjectId, data }: { subjectId: string; data: any }) => 
      window.api.group.createGroup(subjectId, data),
    options
  );
  
  // Update group
  const useUpdateGroup = (options?: any) => useApiMutation(
    ({ id, data }: { id: string; data: any }) => 
      window.api.group.updateGroup(id, data),
    options
  );
  
  // Enroll student
  const useEnrollStudent = (options?: any) => useApiMutation(
    ({ studentId, groupId }: { studentId: string; groupId: string }) => 
      window.api.group.enrollStudentToGroup(studentId, groupId),
    options
  );
  
  return {
    useListGroups,
    useGroupDetails,
    useCreateGroup,
    useUpdateGroup,
    useEnrollStudent
  };
}

/**
 * Custom hook for subject API operations
 */
export function useSubjectApi() {
  // List subjects
  const useListSubjects = (options?: any) => useApiQuery(
    createQueryKey('subject', 'list', {}),
    () => window.api.subject.listSubjects(),
    options
  );
  
  // Get subject details
  const useSubjectDetails = (id: string, options?: any) => useApiQuery(
    createQueryKey('subject', 'details', { id }),
    () => window.api.subject.getSubjectDetails(id),
    options
  );
  
  // Create subject
  const useCreateSubject = (options?: any) => useApiMutation(
    (data: any) => window.api.subject.createSubject(data),
    options
  );
  
  // Update subject
  const useUpdateSubject = (options?: any) => useApiMutation(
    ({ id, data }: { id: string; data: any }) => 
      window.api.subject.updateSubject(id, data),
    options
  );
  
  // Delete subject
  const useDeleteSubject = (options?: any) => useApiMutation(
    (id: string) => window.api.subject.deleteSubject(id),
    options
  );
  
  return {
    useListSubjects,
    useSubjectDetails,
    useCreateSubject,
    useUpdateSubject,
    useDeleteSubject
  };
}

/**
 * Custom hook for payment API operations
 */
export function usePaymentApi() {
  // List student payments
  const useListStudentPayments = (studentId: string, options?: any) => useApiQuery(
    createQueryKey('payment', 'listByStudent', { studentId }),
    () => window.api.payment.listPaymentsByStudent(studentId),
    options
  );
  
  // Create payment
  const useCreatePayment = (options?: any) => useApiMutation(
    (data: any) => window.api.payment.createPayment(data),
    options
  );
  
  // Get monthly summary
  const useMonthlySummary = (month: number, year: number, options?: any) => useApiQuery(
    createQueryKey('payment', 'monthlySummary', { month, year }),
    () => window.api.payment.getMonthlySummary(month, year),
    options
  );
  
  return {
    useListStudentPayments,
    useCreatePayment,
    useMonthlySummary
  };
}

/**
 * Custom hook for subscription API operations
 */
export function useSubscriptionApi() {
  // List subscriptions
  const useListSubscriptions = (filter: any, options?: any) => useApiQuery(
    createQueryKey('subscription', 'list', filter),
    () => window.api.subscription.listSubscriptions(filter),
    options
  );
  
  // Create/update subscription
  const useCreateOrUpdateSubscription = (options?: any) => useApiMutation(
    ({ studentId, subjectId, month, data }: { 
      studentId: string;
      subjectId: string;
      month: string;
      data: any;
    }) => window.api.subscription.createOrUpdateSubscription(studentId, subjectId, month, data),
    options
  );
  
  // Mark as paid
  const useMarkAsPaid = (options?: any) => useApiMutation(
    (subscriptionId: string) => window.api.subscription.markAsPaid(subscriptionId),
    options
  );
  
  return {
    useListSubscriptions,
    useCreateOrUpdateSubscription,
    useMarkAsPaid
  };
}

/**
 * Custom hook for utility API operations
 */
export function useUtilityApi() {
  // Create backup
  const useBackupNow = (options?: any) => useApiMutation(
    () => window.api.utility.backupNow(),
    options
  );
  
  // List backups
  const useListBackups = (options?: any) => useApiQuery(
    createQueryKey('utility', 'listBackups', {}),
    () => window.api.utility.listBackups(),
    options
  );
  
  // Restore backup
  const useRestoreBackup = (options?: any) => useApiMutation(
    (filePath: string) => window.api.utility.restoreBackup(filePath),
    options
  );
  
  return {
    useBackupNow,
    useListBackups,
    useRestoreBackup
  };
} 