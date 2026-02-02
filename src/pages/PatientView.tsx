import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, User, Phone, MapPin, Heart, FileText } from 'lucide-react';
import { Patient } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PatientView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchPatientById, loading } = usePatientApi();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      const loadPatient = async () => {
        const data = await fetchPatientById(parseInt(id));
        setPatient(data);
      };
      loadPatient();
    }
  }, [id, fetchPatientById]);

  if (loading || !patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading patient details...</div>
        </div>
      </DashboardLayout>
    );
  }

  const InfoItem = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/patient')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
              <p className="text-muted-foreground">
                View complete patient information
              </p>
            </div>
          </div>
          <Button onClick={() => navigate(`/patient/edit/${id}`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        {/* Patient Summary Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {patient.title} {patient.firstName} {patient.middleName} {patient.lastName}
                </h2>
                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{patient.gender}</Badge>
                  {patient.bloodGroup && (
                    <Badge variant="outline">{patient.bloodGroup}</Badge>
                  )}
                  <Badge variant="default">{patient.maritalStatus}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Title" value={patient.title} />
              <InfoItem label="First Name" value={patient.firstName} />
              <InfoItem label="Middle Name" value={patient.middleName} />
              <InfoItem label="Last Name" value={patient.lastName} />
              <InfoItem label="Gender" value={patient.gender} />
              <InfoItem
                label="Date of Birth"
                value={
                  patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : undefined
                }
              />
              <InfoItem label="Blood Group" value={patient.bloodGroup} />
              <InfoItem label="Marital Status" value={patient.maritalStatus} />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Mobile Number" value={patient.mobileNumber} />
              <InfoItem label="Email" value={patient.email} />
              <InfoItem label="Attendant Name" value={patient.attendantName} />
              <InfoItem label="Attendant Phone" value={patient.attendantPhone} />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem label="Address" value={patient.address} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Area" value={patient.area} />
                <InfoItem label="City" value={patient.city} />
                <InfoItem label="State" value={patient.state} />
                <InfoItem label="Zipcode" value={patient.zipcode} />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Next of Kin Name" value={patient.nextOfKinName} />
              <InfoItem label="Next of Kin Phone" value={patient.nextOfKinPhone} />
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Health ID" value={patient.healthId} />
              <InfoItem label="Aadhar Number" value={patient.aadharNumber} />
            </CardContent>
          </Card>

          {/* Other Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Other Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Consultant" value={patient.consultant} />
              <InfoItem label="Referred By" value={patient.referredBy} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientView;
