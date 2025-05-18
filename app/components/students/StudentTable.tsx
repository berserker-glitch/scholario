import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useColorModeValue,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel, 
  useReactTable, 
  FilterFn,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Student, StudentWithMeta, StudentStatus, StudentFilter } from '../../../src/types/student';

// Define props for the StudentTable component
interface StudentTableProps {
  students: StudentWithMeta[];
  isLoading: boolean;
  onRowClick?: (student: StudentWithMeta) => void;
  onEditClick?: (student: StudentWithMeta) => void;
  onKickClick?: (student: StudentWithMeta) => void;
  onFilterChange?: (filter: StudentFilter) => void;
  onSelectionChange?: (selectedStudents: StudentWithMeta[]) => void;
  initialFilter?: StudentFilter;
}

/**
 * Virtualized table for displaying and managing students
 */
const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  onRowClick,
  onEditClick,
  onKickClick,
  onFilterChange,
  onSelectionChange,
  initialFilter = {}
}) => {
  // State for filtering and sorting
  const [filter, setFilter] = useState<StudentFilter>(initialFilter);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  
  // References for virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Column definitions
  const columnHelper = createColumnHelper<StudentWithMeta>();
  
  const columns = useMemo<ColumnDef<StudentWithMeta>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          colorScheme="blue"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={row.getIsSelected()}
          isIndeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          colorScheme="blue"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 40,
    },
    columnHelper.accessor('fullName', {
      header: 'Name',
      cell: info => info.getValue(),
      size: 200,
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue() || '-',
      size: 150,
    }),
    columnHelper.accessor('studyYear', {
      header: 'Study Year',
      cell: info => info.getValue() || '-',
      size: 150,
    }),
    columnHelper.accessor('school', {
      header: 'School',
      cell: info => info.getValue() || '-',
      size: 200,
    }),
    columnHelper.accessor('cni', {
      header: 'CNI',
      cell: info => info.getValue() || '-',
      size: 150,
    }),
  ], []);
  
  // Set up the table
  const table = useReactTable({
    data: students,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
  
  // Handle filter changes
  const handleFilterChange = (newFilter: Partial<StudentFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilterChange?.(updatedFilter);
  };
  
  // Update selected students when rowSelection changes
  useEffect(() => {
    const selectedStudentIds = Object.keys(rowSelection);
    const selectedStudents = students.filter(student => 
      selectedStudentIds.includes(student.id.toString())
    );
    onSelectionChange?.(selectedStudents);
  }, [rowSelection, students, onSelectionChange]);
  
  return (
    <Box>
      <Flex mb={4} gap={4} flexWrap="wrap" alignItems="center">
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search students..."
            value={filter.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
        </InputGroup>
        
        <Checkbox
          colorScheme="blue"
          isChecked={filter.includeKicked || false}
          onChange={(e) => handleFilterChange({ includeKicked: e.target.checked })}
        >
          Show Kicked
        </Checkbox>
        
        <Box flexGrow={1} />
        
        <Text>
          {rows.length} student{rows.length !== 1 ? 's' : ''}
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
                        {header.column.getCanSort() && (
                          <ChevronDownIcon
                            ml={1}
                            transform={
                              header.column.getIsSorted() === 'desc'
                                ? 'rotate(180deg)'
                                : header.column.getIsSorted() === 'asc'
                                ? 'rotate(0deg)'
                                : 'rotate(-90deg)'
                            }
                            opacity={
                              header.column.getIsSorted() ? 1 : 0.5
                            }
                            transition="transform 0.2s"
                          />
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
                    onClick={() => onRowClick?.(row.original)}
                    cursor={onRowClick ? 'pointer' : 'default'}
                    _hover={{ bg: hoverBgColor }}
                    bg={row.getIsSelected() ? 'blue.50' : undefined}
                    data-selected={row.getIsSelected() || undefined}
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
                      No students found
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

export default StudentTable; 