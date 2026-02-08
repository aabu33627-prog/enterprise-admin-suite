import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, User, Phone, MapPin, Heart, FileText, Globe, Briefcase } from 'lucide-react';
import { PatientListByIdDTO } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PatientView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchPatientById, loading } = usePatientApi();
  const [patient, setPatient] = useState<PatientListByIdDTO | null>(null);

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

  const InfoItem = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  );

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

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
              <p className="text-muted-foreground">View complete patient information</p>
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
                  {patient.First_Name} {patient.Middle_name} {patient.Last_Name}
                </h2>
                <p className="text-muted-foreground">Patient ID: {patient.Patient_ID} | Code: {patient.Code}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{patient.Gender}</Badge>
                  {patient.Blood_group && <Badge variant="outline">{patient.Blood_group}</Badge>}
                  <Badge variant="default">{patient.Marital_status || 'Single'}</Badge>
                  <Badge variant={patient.Is_Active === 1 ? 'default' : 'secondary'}>
                    {patient.Is_Active === 1 ? 'Active' : 'Inactive'}
                  </Badge>
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
                <User className="h-5 w-5 text-primary" />Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="First Name" value={patient.First_Name} />
              <InfoItem label="Middle Name" value={patient.Middle_name} />
              <InfoItem label="Last Name" value={patient.Last_Name} />
              <InfoItem label="Gender" value={patient.Gender} />
              <InfoItem label="Date of Birth" value={formatDate(patient.DateOfBirth)} />
              <InfoItem label="Age" value={patient.Age} />
              <InfoItem label="Blood Group" value={patient.Blood_group} />
              <InfoItem label="Marital Status" value={patient.Marital_status} />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Mobile Number" value={patient.Mobile_number} />
              <InfoItem label="Email" value={patient.Email_id} />
              <InfoItem label="Fax Number" value={patient.Fax_number} />
              <InfoItem label="Website" value={patient.Website} />
              <InfoItem label="Attendant" value={patient.Attendent} />
              <InfoItem label="Attendant Relationship" value={patient.Attend_Relationship} />
              <InfoItem label="Spouse Number" value={patient.Spouse_Number} />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Address Line 1" value={patient.Address_line1} />
              <InfoItem label="Address Line 2" value={patient.Address_line2} />
              <InfoItem label="Area ID" value={patient.Area_Id} />
              <InfoItem label="City ID" value={patient.City_Id} />
              <InfoItem label="State ID" value={patient.State_Id} />
              <InfoItem label="Country ID" value={patient.Country_Id} />
              <InfoItem label="Zipcode" value={patient.ZipCode} />
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Next of Kin" value={patient.NextOfKin} />
              <InfoItem label="Relation ID" value={patient.Relation_ID} />
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Aadhar No" value={patient.AdharNo} />
              <InfoItem label="Health ID" value={patient.HealthID} />
              <InfoItem label="Other ID 1" value={patient.OtherID1} />
              <InfoItem label="Other ID 2" value={patient.OtherID2} />
              <InfoItem label="Other ID 3" value={patient.OtherID3} />
              <InfoItem label="ID Card Type" value={patient.IdentityCardType} />
              <InfoItem label="Staff Number" value={patient.Staff_Number} />
              <InfoItem label="Old Reg No" value={patient.OldRegNo} />
              <InfoItem label="External Ref No" value={patient.External_RefNo} />
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Consultant ID" value={patient.Consultant_id} />
              <InfoItem label="Referring Doctor ID" value={patient.ReferringDoctor_ID} />
              <InfoItem label="Organization ID" value={patient.Organization_ID} />
              <InfoItem label="Patient Category ID" value={patient.PatientCategory_ID} />
              <InfoItem label="Referral Source" value={patient.ReferralSource} />
              <InfoItem label="Education" value={patient.Education} />
              <InfoItem label="Occupation" value={patient.Occupation} />
              <InfoItem label="Monthly Income" value={patient.Monthly_Income} />
            </CardContent>
          </Card>

          {/* International Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />International Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Passport No" value={patient.PassportNo} />
              <InfoItem label="Passport Details" value={patient.PassportDetails} />
              <InfoItem label="Passport Expiry" value={formatDate(patient.PassportExpiry)} />
              <InfoItem label="Visa No" value={patient.VisaNo} />
              <InfoItem label="Visa Expiry" value={formatDate(patient.VisaExpiryDate)} />
              <InfoItem label="International" value={patient.is_international} />
              <InfoItem label="Emergency" value={patient.is_emergency} />
              <InfoItem label="Baby" value={patient.is_baby} />
            </CardContent>
          </Card>

          {/* System Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />System Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoItem label="Hospital ID" value={patient.Hospital_id} />
              <InfoItem label="Registration Date" value={formatDate(patient.Reg_Date)} />
              <InfoItem label="Validate Date" value={formatDate(patient.Validate_Date)} />
              <InfoItem label="Created By" value={patient.Created_by} />
              <InfoItem label="Created Date" value={formatDate(patient.Created_date)} />
              <InfoItem label="Updated By" value={patient.Updated_by} />
              <InfoItem label="Updated Date" value={formatDate(patient.Updated_date)} />
              <InfoItem label="Remarks" value={patient.Remarks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientView;
