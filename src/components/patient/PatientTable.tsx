import { useState, useMemo } from 'react';
import { Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PatientTableProps {
  patients: Patient[];
  searchQuery: string;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

type SortField = 'id' | 'firstName' | 'lastName' | 'mobileNumber' | 'email' | 'city';

export const PatientTable = ({
  patients,
  searchQuery,
  onView,
  onEdit,
  onDelete,
}: PatientTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.firstName?.toLowerCase().includes(query) ||
        patient.lastName?.toLowerCase().includes(query) ||
        patient.mobileNumber?.includes(query) ||
        patient.id?.toString().includes(query) ||
        patient.email?.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredPatients, sortField, sortOrder]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedPatients.length / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10">
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID <SortIcon field="id" />
                </div>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  First Name <SortIcon field="firstName" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center">
                  Last Name <SortIcon field="lastName" />
                </div>
              </TableHead>
              <TableHead>Gender</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('mobileNumber')}
              >
                <div className="flex items-center">
                  Mobile <SortIcon field="mobileNumber" />
                </div>
              </TableHead>
              <TableHead>DOB</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email <SortIcon field="email" />
                </div>
              </TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Marital Status</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center">
                  City <SortIcon field="city" />
                </div>
              </TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.title}</TableCell>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName || '-'}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.mobileNumber}</TableCell>
                  <TableCell>
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{patient.email || '-'}</TableCell>
                  <TableCell>{patient.bloodGroup || '-'}</TableCell>
                  <TableCell>{patient.maritalStatus}</TableCell>
                  <TableCell>{patient.city || '-'}</TableCell>
                  <TableCell>{patient.state || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(patient)}
                        title="View"
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(patient)}
                        title="Edit"
                        className="text-warning hover:text-warning/80"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(patient)}
                        title="Delete"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedPatients.length)} of {sortedPatients.length}{' '}
            patients
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
