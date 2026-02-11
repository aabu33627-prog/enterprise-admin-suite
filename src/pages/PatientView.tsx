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
                  {patient.first_Name} {patient.middle_name} {patient.last_Name}
                </h2>
                <p className="text-muted-foreground">Patient ID: {patient.patient_ID} | Code: {patient.code}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{patient.gender}</Badge>
                  {patient.blood_group && <Badge variant="outline">{patient.blood_group}</Badge>}
                  <Badge variant="default">{patient.marital_status || 'Single'}</Badge>
                  <Badge variant={patient.is_Active === 1 ? 'default' : 'secondary'}>
                    {patient.is_Active === 1 ? 'Active' : 'Inactive'}
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
              <InfoItem label="First Name" value={patient.first_Name} />
              <InfoItem label="Middle Name" value={patient.middle_name} />
              <InfoItem label="Last Name" value={patient.last_Name} />
              <InfoItem label="Gender" value={patient.gender} />
              <InfoItem label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
              <InfoItem label="Age" value={patient.age} />
              <InfoItem label="Blood Group" value={patient.blood_group} />
              <InfoItem label="Marital Status" value={patient.marital_status} />
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
              <InfoItem label="Mobile Number" value={patient.mobile_number} />
              <InfoItem label="Email" value={patient.email_id} />
              <InfoItem label="Fax Number" value={patient.fax_number} />
              <InfoItem label="Website" value={patient.website} />
              <InfoItem label="Attendant" value={patient.attendent} />
              <InfoItem label="Attendant Relationship" value={patient.attend_Relationship} />
              <InfoItem label="Spouse Number" value={patient.spouse_Number} />
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
              <InfoItem label="Address Line 1" value={patient.address_line1} />
              <InfoItem label="Address Line 2" value={patient.address_line2} />
              <InfoItem label="Area ID" value={patient.area_Id} />
              <InfoItem label="City ID" value={patient.city_Id} />
              <InfoItem label="State ID" value={patient.state_Id} />
              <InfoItem label="Country ID" value={patient.country_Id} />
              <InfoItem label="Zipcode" value={patient.zipCode} />
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
              <InfoItem label="Next of Kin" value={patient.nextOfKin} />
              <InfoItem label="Relation ID" value={patient.relation_ID} />
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
              <InfoItem label="Aadhar No" value={patient.adharNo} />
              <InfoItem label="Health ID" value={patient.healthID} />
              <InfoItem label="Other ID 1" value={patient.otherID1} />
              <InfoItem label="Other ID 2" value={patient.otherID2} />
              <InfoItem label="Other ID 3" value={patient.otherID3} />
              <InfoItem label="ID Card Type" value={patient.identityCardType} />
              <InfoItem label="Staff Number" value={patient.staff_Number} />
              <InfoItem label="Old Reg No" value={patient.oldRegNo} />
              <InfoItem label="External Ref No" value={patient.external_RefNo} />
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
              <InfoItem label="Consultant ID" value={patient.consultant_id} />
              <InfoItem label="Referring Doctor ID" value={patient.referringDoctor_ID} />
              <InfoItem label="Organization ID" value={patient.organization_ID} />
              <InfoItem label="Patient Category ID" value={patient.patientCategory_ID} />
              <InfoItem label="Referral Source" value={patient.referralSource} />
              <InfoItem label="Education" value={patient.education} />
              <InfoItem label="Occupation" value={patient.occupation} />
              <InfoItem label="Monthly Income" value={patient.monthly_Income} />
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
              <InfoItem label="Passport No" value={patient.passportNo} />
              <InfoItem label="Passport Details" value={patient.passportDetails} />
              <InfoItem label="Passport Expiry" value={formatDate(patient.passportExpiry)} />
              <InfoItem label="Visa No" value={patient.visaNo} />
              <InfoItem label="Visa Expiry" value={formatDate(patient.visaExpiryDate)} />
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
              <InfoItem label="Hospital ID" value={patient.hospital_id} />
              <InfoItem label="Registration Date" value={formatDate(patient.reg_Date)} />
              <InfoItem label="Validate Date" value={formatDate(patient.validate_Date)} />
              <InfoItem label="Created By" value={patient.created_by} />
              <InfoItem label="Created Date" value={formatDate(patient.created_date)} />
              <InfoItem label="Updated By" value={patient.updated_by} />
              <InfoItem label="Updated Date" value={formatDate(patient.updated_date)} />
              <InfoItem label="Remarks" value={patient.remarks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientView;
