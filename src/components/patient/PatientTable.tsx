import { useState, useMemo } from 'react';
import { Eye, Pencil, Trash2,FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { PatientListDTO } from '@/types/patient';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface PatientTableProps {
  patients: PatientListDTO[];
  searchQuery: string;
  onView: (patient: PatientListDTO) => void;
  onEdit: (patient: PatientListDTO) => void;
  onDelete: (patient: PatientListDTO) => void;
  onReport: (patient: PatientListDTO) => void;
}

type SortField = 'patient_ID' | 'code' | 'first_name' | 'last_Name' | 'mobile_number' | 'gender';

export const PatientTable = ({ patients, searchQuery, onView, onEdit, onDelete, onReport }: PatientTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('patient_ID');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.first_name?.toLowerCase().includes(query) ||
        p.last_Name?.toLowerCase().includes(query) ||
        p.mobile_number?.includes(query) ||
        p.patient_ID?.toString().includes(query) ||
        p.code?.toLowerCase().includes(query)
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
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10">
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('patient_ID')}>
                <div className="flex items-center">ID <SortIcon field="patient_ID" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('code')}>
                <div className="flex items-center">Code <SortIcon field="code" /></div>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('first_name')}>
                <div className="flex items-center">First Name <SortIcon field="first_name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('last_Name')}>
                <div className="flex items-center">Last Name <SortIcon field="last_Name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('gender')}>
                <div className="flex items-center">Gender <SortIcon field="gender" /></div>
              </TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="cursor-pointer hover:bg-primary/20" onClick={() => handleSort('mobile_number')}>
                <div className="flex items-center">Mobile <SortIcon field="mobile_number" /></div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Referring Doctor</TableHead>
              <TableHead>Organization</TableHead>
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
                <TableRow key={patient.patient_ID} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{patient.patient_ID}</TableCell>
                  <TableCell>{patient.code || '-'}</TableCell>
                  <TableCell>{patient.title_Name || '-'}</TableCell>
                  <TableCell>{patient.first_name || '-'}</TableCell>
                  <TableCell>{patient.last_Name || '-'}</TableCell>
                  <TableCell>{patient.gender || '-'}</TableCell>
                  <TableCell>{patient.age || '-'}</TableCell>
                  <TableCell>{patient.mobile_number || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={patient.is_Active === 1 ? 'default' : 'secondary'}>
                      {patient.is_Active === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.createdBy || '-'}</TableCell>
                  <TableCell>{patient.referringdoctor || '-'}</TableCell>
                  <TableCell>{patient.organization_name || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onView(patient)} title="View" className="text-primary hover:text-primary/80">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} title="Edit" className="text-warning hover:text-warning/80">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(patient)} title="Delete" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onReport(patient)} title="Report" className="text-primary hover:text-primary/80">
                        <FileText className="h-4 w-4" />
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
            {Math.min(currentPage * pageSize, sortedPatients.length)} of {sortedPatients.length} patients
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
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum} className="cursor-pointer">
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
