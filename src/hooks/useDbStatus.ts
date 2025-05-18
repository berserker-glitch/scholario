import { useQuery } from '@tanstack/react-query';

interface DbStatus {
  connected: boolean;
  tablesExist: boolean;
  studentsExist: boolean;
  error: string | null;
  tableInfo: { name: string }[];
}

/**
 * A hook to check the database status
 */
export function useDbStatus() {
  const {
    data: status,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dbStatus'],
    queryFn: async (): Promise<DbStatus> => {
      try {
        if (!window.api?.db?.checkStatus) {
          console.warn('DB Status API not available');
          return {
            connected: false,
            tablesExist: false,
            studentsExist: false,
            error: 'DB Status API not available',
            tableInfo: []
          };
        }

        const result = await window.api.db.checkStatus();
        if (result._tag === 'Left') {
          throw new Error(result.left?.message || 'Failed to check DB status');
        }
        
        console.log('DB Status check result:', result.right);
        return result.right || {
          connected: false,
          tablesExist: false,
          studentsExist: false,
          error: 'No status data returned',
          tableInfo: []
        };
      } catch (err) {
        console.error('Error checking DB status:', err);
        return {
          connected: false,
          tablesExist: false,
          studentsExist: false,
          error: err instanceof Error ? err.message : String(err),
          tableInfo: []
        };
      }
    },
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchOnWindowFocus: false
  });

  return {
    status: status || {
      connected: false,
      tablesExist: false,
      studentsExist: false,
      error: null,
      tableInfo: []
    },
    isLoading,
    isError,
    error,
    refetch
  };
} 