import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { PatientListDTO } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientTable } from '@/components/patient/PatientTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PatientList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchPatients, deletePatient, loading, fetchPatientReport } = usePatientApi();

  const [patients, setPatients] = useState<PatientListDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientListDTO | null>(null);

  const loadPatients = async () => {
    const data = await fetchPatients();
    setPatients(data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleView = (patient: PatientListDTO) => {
    navigate(`/patient/view/${patient.patient_ID}`);
  };

  const handleEdit = (patient: PatientListDTO) => {
    navigate(`/patient/edit/${patient.patient_ID}`);
  };

  const handleDeleteClick = (patient: PatientListDTO) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient({
        patient_ID: patientToDelete.patient_ID.toString(),
        hospital_id: 1,
        code: patientToDelete.code || '',
      });
      toast({ title: 'Success', description: 'Patient deleted successfully' });
      loadPatients();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete patient', variant: 'destructive' });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleReport = async (patient: PatientListDTO) => {
  try {
    await fetchPatientReport(patient.patient_ID);
  } catch {
    toast({
      title: "Error",
      description: "Failed to generate report",
      variant: "destructive",
    });
  }
};

  const handleRefresh = () => {
    loadPatients();
    toast({ title: 'Refreshed', description: 'Patient list has been refreshed' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient List</h1>
            <p className="text-muted-foreground">Manage and view all registered patients</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => navigate('/patient/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, mobile, ID, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <PatientTable
          patients={patients}
          searchQuery={searchQuery}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onReport={handleReport}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Patient</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete patient{' '}
                <strong>{patientToDelete?.first_name} {patientToDelete?.last_Name}</strong>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default PatientList;
