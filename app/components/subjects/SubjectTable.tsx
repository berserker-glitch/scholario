import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel,
  getSortedRowModel, 
  useReactTable, 
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchIcon } from '@chakra-ui/icons';

// Define subject type
export interface Subject {
  id: string;
  title: string;
  description?: string;
  metadata?: string;
  createdAt?: string;
  updatedAt?: string;
  fee?: number;
}

// Define extended subject with computed properties
export interface SubjectWithMeta extends Subject {
  groupCount?: number;
  studentCount?: number;
}

// Define props for the SubjectTable component
interface SubjectTableProps {
  subjects: SubjectWithMeta[];
  isLoading: boolean;
  onRowClick?: (subject: SubjectWithMeta) => void;
  onSearchChange?: (search: string) => void;
}

/**
 * Virtualized table for displaying subjects
 */
const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  isLoading,
  onRowClick,
  onSearchChange,
}) => {
  // State for sorting and search
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState<string>('');
  
  // References for virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Column definitions
  const columnHelper = createColumnHelper<SubjectWithMeta>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Subject Name',
      cell: info => info.getValue(),
      size: 250,
    }),
    columnHelper.accessor('fee', {
      header: 'Monthly Fee',
      cell: info => info.getValue() ? `${info.getValue()} DH` : '-',
      size: 150,
    }),
    columnHelper.accessor('groupCount', {
      header: 'Groups',
      cell: info => info.getValue() || 0,
      size: 100,
    }),
    columnHelper.accessor('studentCount', {
      header: 'Students',
      cell: info => info.getValue() || 0,
      size: 100,
    }),
  ], []);
  
  // Set up the table
  const table = useReactTable({
    data: subjects,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  // Set up virtualizer for the rows
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60, // estimated row height
    overscan: 10,
  });
  
  // Total height of all rows
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom = virtualRows.length > 0
    ? totalSize - virtualRows[virtualRows.length - 1].end
    : 0;
  
  // Handle search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  
  return (
    <Box>
      <Flex mb={4} gap={4} flexWrap="wrap" alignItems="center">
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>
        
        <Box flexGrow={1} />
        
        <Text>
          {rows.length} subject{rows.length !== 1 ? 's' : ''}
        </Text>
      </Flex>
      
      <Box
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        bg={bgColor}
        position="relative"
      >
        {isLoading && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.300"
            zIndex={10}
            justify="center"
            align="center"
          >
            <Spinner size="xl" />
          </Flex>
        )}
        
        <Box
          ref={tableContainerRef}
          overflowY="auto"
          height="60vh"
          position="relative"
        >
          <Table>
            <Thead position="sticky" top={0} bg={bgColor} zIndex={2}>
              {table.getHeaderGroups().map(headerGroup => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                      whiteSpace="nowrap"
                      width={header.getSize()}
                    >
                      <Flex alignItems="center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            
            <Tbody>
              {paddingTop > 0 && (
                <Tr>
                  <Td colSpan={columns.length} height={`${paddingTop}px`} p={0} />
                </Tr>
              )}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <Tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    cursor={onRowClick ? 'pointer' : 'default'}
                    _hover={{ bg: hoverBgColor }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <Td key={cell.id} whiteSpace="nowrap" width={cell.column.getSize()}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
              {paddingBottom > 0 && (
                <Tr>
                  <Td colSpan={columns.length} height={`${paddingBottom}px`} p={0} />
                </Tr>
              )}
              {rows.length === 0 && !isLoading && (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center" py={10}>
                    <Text fontSize="lg" color="gray.500">
                      No subjects found
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default SubjectTable; 