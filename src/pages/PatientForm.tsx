import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { DropdownOption, GENDER_MAP, PatientCreateDTO, PatientUpdateDTO } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientFormFields, PatientFormValues } from '@/components/patient/PatientFormFields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const patientSchema = z.object({
  code: z.string().optional().default(''),
  Title_Id: z.string().min(1, 'Title is required'),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[a-zA-Z\s]+$/, 'First name cannot contain numbers'),
  middle_name: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, 'Middle name cannot contain numbers')
    .optional()
    .or(z.literal('')),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Last name cannot contain numbers'),
  gender: z.string().min(1, 'Gender is required'),
  dateofbirth: z
    .string()
    .optional()
    .refine((val) => !val || new Date(val) < new Date(), 'Date of birth must be less than today')
    .or(z.literal('')),
  age: z.string().optional().default(''),
  mobile_number: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email_id: z.string().email('Invalid email format').optional().or(z.literal('')),
  bloodgroup: z.string().optional().default(''),
  marital_status: z.string().optional().default('Single'),
  attendent: z.string().regex(/^[a-zA-Z\s]*$/, 'Attendant name cannot contain numbers').optional().or(z.literal('')),
  attend_Relationship: z.string().optional().default(''),
  Spouse_Number: z.string().regex(/^(\d{10})?$/, 'Phone must be exactly 10 digits').optional().or(z.literal('')),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional().default(''),
  zipCode: z.string().min(1, 'Zipcode is required'),
  area_id: z.string().optional().default(''),
  city_Id: z.string().optional().default(''),
  state_Id: z.string().optional().default(''),
  country_Id: z.string().optional().default(''),
  consultant_id: z.string().optional().default(''),
  referringDoctor_ID: z.string().optional().default(''),
  patientCategory_ID: z.string().optional().default(''),
  organization_ID: z.string().optional().default(''),
  nextofkin: z.string().regex(/^[a-zA-Z\s]*$/, 'Next of kin name cannot contain numbers').optional().or(z.literal('')),
  relation_ID: z.string().optional().default(''),
  religion_ID: z.string().optional().default(''),
  education: z.string().optional().default(''),
  occupation: z.string().optional().default(''),
  monthly_Income: z.string().optional().default(''),
  adharno: z.string().regex(/^(\d{12})?$/, 'Aadhar must be exactly 12 digits').optional().or(z.literal('')),
  healthid: z.string().regex(/^(\d{14})?$/, 'Health ID must be exactly 14 digits').optional().or(z.literal('')),
  otherid1: z.string().optional().default(''),
  otherid2: z.string().optional().default(''),
  otherid3: z.string().optional().default(''),
  idCardType: z.string().optional().default(''),
  staff_Number: z.string().max(20, 'Max 20 characters').optional().or(z.literal('')),
  remarks: z.string().optional().default(''),
  passportno: z.string().optional().default(''),
  passportdetails: z.string().optional().default(''),
  passportexpiry: z.string().optional().default(''),
  visano: z.string().optional().default(''),
  visaexpiry: z.string().optional().default(''),
  international: z.string().optional().default(''),
  emergency: z.string().optional().default(''),
  baby: z.string().optional().default(''),
  patientimage: z.string().optional().default(''),
  referralsource: z.string().optional().default('0'),
  patient_uhid: z.string().optional().default(''),
  referredby_mobile_no: z.string().optional().default(''),
  referredby_name: z.string().optional().default(''),
});

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    fetchPatientById, createPatient, updatePatient,
    fetchTitles, fetchBloodGroups, fetchAreas, fetchCities, fetchStates,
    fetchRelations, fetchConsultants, fetchReferredBy, fetchPatientCategories,
    loading,
  } = usePatientApi();

  const isEditMode = !!id;

  const [dropdowns, setDropdowns] = useState({
    titles: [] as DropdownOption[],
    bloodGroups: [] as DropdownOption[],
    consultants: [] as DropdownOption[],
    referredBy: [] as DropdownOption[],
    areas: [] as DropdownOption[],
    cities: [] as DropdownOption[],
    states: [] as DropdownOption[],
    relations: [] as DropdownOption[],
    patientCategories: [] as DropdownOption[],
  });

  const defaultValues: PatientFormValues = {
    code: '', Title_Id: '', first_name: '', middle_name: '', last_name: '',
    gender: '', dateofbirth: '', age: '', mobile_number: '', email_id: '',
    bloodgroup: '', marital_status: 'Single', attendent: '', attend_Relationship: '',
    Spouse_Number: '', address_line1: '', address_line2: '', zipCode: '',
    area_id: '', city_Id: '', state_Id: '', country_Id: '',
    consultant_id: '', referringDoctor_ID: '', patientCategory_ID: '', organization_ID: '',
    nextofkin: '', relation_ID: '', religion_ID: '', education: '', occupation: '',
    monthly_Income: '', adharno: '', healthid: '', otherid1: '', otherid2: '', otherid3: '',
    idCardType: '', staff_Number: '', remarks: '', passportno: '', passportdetails: '',
    passportexpiry: '', visano: '', visaexpiry: '', international: '', emergency: '',
    baby: '', patientimage: '', referralsource: '0', patient_uhid: '',
    referredby_mobile_no: '', referredby_name: '',
  };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });

  // Load dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      const [titles, bloodGroups, consultants, referredBy, areas, cities, states, relations, patientCategories] =
        await Promise.all([
          fetchTitles(), fetchBloodGroups(), fetchConsultants(), fetchReferredBy(),
          fetchAreas(), fetchCities(), fetchStates(), fetchRelations(), fetchPatientCategories(),
        ]);
      setDropdowns({ titles, bloodGroups, consultants, referredBy, areas, cities, states, relations, patientCategories });
    };
    loadDropdowns();
  }, [fetchTitles, fetchBloodGroups, fetchConsultants, fetchReferredBy, fetchAreas, fetchCities, fetchStates, fetchRelations, fetchPatientCategories]);

  // Load patient for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadPatient = async () => {
        const patient = await fetchPatientById(parseInt(id));
        if (patient) {
          // Map PatientListByIdDTO to form values
          form.reset({
            code: patient.Code || '',
            Title_Id: patient.Title_Id?.toString() || '',
            first_name: patient.First_Name || '',
            middle_name: patient.Middle_name || '',
            last_name: patient.Last_Name || '',
            gender: patient.Gender || '',
            dateofbirth: patient.DateOfBirth ? patient.DateOfBirth.split('T')[0] : '',
            age: patient.Age || '',
            mobile_number: patient.Mobile_number || '',
            email_id: patient.Email_id || '',
            bloodgroup: patient.Blood_group || '',
            marital_status: patient.Marital_status || 'Single',
            attendent: patient.Attendent || '',
            attend_Relationship: patient.Attend_Relationship || '',
            Spouse_Number: patient.Spouse_Number || '',
            address_line1: patient.Address_line1 || '',
            address_line2: patient.Address_line2 || '',
            zipCode: patient.ZipCode || '',
            area_id: patient.Area_Id?.toString() || '',
            city_Id: patient.City_Id?.toString() || '',
            state_Id: patient.State_Id?.toString() || '',
            country_Id: patient.Country_Id?.toString() || '',
            consultant_id: patient.Consultant_id?.toString() || '',
            referringDoctor_ID: patient.ReferringDoctor_ID?.toString() || '',
            patientCategory_ID: patient.PatientCategory_ID?.toString() || '',
            organization_ID: patient.Organization_ID?.toString() || '',
            nextofkin: patient.NextOfKin || '',
            relation_ID: patient.Relation_ID?.toString() || '',
            religion_ID: patient.Religion_ID?.toString() || '',
            education: patient.Education || '',
            occupation: patient.Occupation || '',
            monthly_Income: patient.Monthly_Income?.toString() || '',
            adharno: patient.AdharNo || '',
            healthid: patient.HealthID || '',
            otherid1: patient.OtherID1 || '',
            otherid2: patient.OtherID2 || '',
            otherid3: patient.OtherID3 || '',
            idCardType: patient.IdentityCardType || '',
            staff_Number: patient.Staff_Number || '',
            remarks: patient.Remarks || '',
            passportno: patient.PassportNo || '',
            passportdetails: patient.PassportDetails || '',
            passportexpiry: patient.PassportExpiry ? patient.PassportExpiry.split('T')[0] : '',
            visano: patient.VisaNo || '',
            visaexpiry: patient.VisaExpiryDate ? patient.VisaExpiryDate.split('T')[0] : '',
            international: patient.is_international || '',
            emergency: patient.is_emergency || '',
            baby: patient.is_baby || '',
            patientimage: '',
            referralsource: patient.ReferralSource?.toString() || '0',
            patient_uhid: '',
            referredby_mobile_no: '',
            referredby_name: '',
          });
        }
      };
      loadPatient();
    }
  }, [id, isEditMode, fetchPatientById, form]);

  const handleTitleChange = (titleId: string) => {
    // Find title name from dropdown
    const title = dropdowns.titles.find(t => t.id.toString() === titleId);
    if (title) {
      const gender = GENDER_MAP[title.name] || '';
      form.setValue('gender', gender);
    }
  };

  // Convert base64 string to byte array for API
  const base64ToByteArray = (base64: string): number[] | null => {
    if (!base64) return null;
    // Remove data URL prefix if present
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
  };

  const toIntOrNull = (val: string): number | null => {
    if (!val) return null;
    const num = parseInt(val);
    return isNaN(num) ? null : num;
  };

  const toFloatOrNull = (val: string): number | null => {
    if (!val) return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const onSubmit = async (data: PatientFormValues) => {
    try {
      if (isEditMode && id) {
        const updatePayload: PatientUpdateDTO = {
          code: data.code,
          Title_Id: toIntOrNull(data.Title_Id),
          first_name: data.first_name,
          middle_name: data.middle_name || null,
          last_name: data.last_name,
          gender: data.gender,
          dateofbirth: data.dateofbirth || '',
          age: data.age || '',
          consultant_id: toIntOrNull(data.consultant_id),
          referringDoctor_ID: toIntOrNull(data.referringDoctor_ID),
          patientCategory_ID: toIntOrNull(data.patientCategory_ID),
          organization_ID: toIntOrNull(data.organization_ID),
          nextofkin: data.nextofkin || null,
          address_line1: data.address_line1,
          address_line2: data.address_line2 || null,
          area_id: data.area_id || null,
          city_Id: toIntOrNull(data.city_Id),
          state_Id: toIntOrNull(data.state_Id),
          country_Id: toIntOrNull(data.country_Id),
          zipCode: data.zipCode,
          mobile_number: data.mobile_number,
          fax_number: null,
          email_id: data.email_id || '',
          staff_Number: data.staff_Number || null,
          relation_ID: toIntOrNull(data.relation_ID),
          religion_ID: toIntOrNull(data.religion_ID),
          education: data.education || null,
          occupation: data.occupation || null,
          monthly_Income: toFloatOrNull(data.monthly_Income),
          attendent: data.attendent || null,
          marital_status: data.marital_status || 'Single',
          attend_Relationship: data.attend_Relationship || null,
          hospital_id: 1,
          updated_by: 1,
          bloodgroup: data.bloodgroup || null,
          Is_Active: 1,
          passportno: data.passportno || null,
          passportdetails: data.passportdetails || null,
          visano: data.visano || null,
          visaexpiry: data.visaexpiry || null,
          international: data.international || null,
          baby: data.baby || null,
          emergency: data.emergency || null,
          passportexpiry: data.passportexpiry || null,
          referralsource: toIntOrNull(data.referralsource),
          patient_uhid: data.patient_uhid || '',
          referredby_mobile_no: data.referredby_mobile_no || null,
          referredby_name: data.referredby_name || null,
          adharno: data.adharno || '',
          healthid: data.healthid || null,
          otherid1: data.otherid1 || null,
          otherid2: data.otherid2 || null,
          otherid3: data.otherid3 || null,
          remarks: data.remarks || null,
          idCardType: data.idCardType || '',
        };
        await updatePatient(updatePayload);
        toast({ title: 'Success', description: 'Patient updated successfully' });
      } else {
        const createPayload: PatientCreateDTO = {
          code: data.code || '',
          Title_Id: toIntOrNull(data.Title_Id),
          first_name: data.first_name,
          middle_name: data.middle_name || null,
          last_name: data.last_name,
          gender: data.gender,
          dateofbirth: data.dateofbirth || '',
          age: data.age || '',
          consultant_id: toIntOrNull(data.consultant_id),
          referringDoctor_ID: toIntOrNull(data.referringDoctor_ID),
          patientCategory_ID: toIntOrNull(data.patientCategory_ID),
          organization_ID: toIntOrNull(data.organization_ID),
          nextofkin: data.nextofkin || null,
          address_line1: data.address_line1,
          address_line2: data.address_line2 || null,
          area_id: data.area_id || null,
          city_Id: toIntOrNull(data.city_Id),
          state_Id: toIntOrNull(data.state_Id),
          country_Id: toIntOrNull(data.country_Id),
          zipCode: data.zipCode,
          mobile_number: data.mobile_number,
          fax_number: null,
          email_id: data.email_id || '',
          staff_Number: data.staff_Number || null,
          validate_Date: new Date().toISOString(),
          relation_ID: toIntOrNull(data.relation_ID),
          religion_ID: toIntOrNull(data.religion_ID),
          education: data.education || null,
          occupation: data.occupation || null,
          monthly_Income: toFloatOrNull(data.monthly_Income),
          attendent: data.attendent || null,
          attend_Relationship: data.attend_Relationship || null,
          marital_status: data.marital_status || 'Single',
          hospital_id: 1,
          created_by: 1,
          bloodgroup: data.bloodgroup || null,
          patientimage: base64ToByteArray(data.patientimage),
          passportno: data.passportno || null,
          passportdetails: data.passportdetails || null,
          visano: data.visano || null,
          visaexpiry: data.visaexpiry || null,
          international: data.international || null,
          baby: data.baby || null,
          emergency: data.emergency || null,
          passportexpiry: data.passportexpiry || null,
          referralsource: toIntOrNull(data.referralsource) ?? 0,
          Spouse_Number: data.Spouse_Number || null,
          patient_uhid: data.patient_uhid || '',
          referredby_mobile_no: data.referredby_mobile_no || null,
          referredby_name: data.referredby_name || null,
          adharno: data.adharno || '',
          healthid: data.healthid || null,
          otherid1: data.otherid1 || null,
          otherid2: data.otherid2 || null,
          otherid3: data.otherid3 || null,
          remarks: data.remarks || null,
          idCardType: data.idCardType || '',
        };
        await createPatient(createPayload);
        toast({ title: 'Success', description: 'Patient registered successfully' });
      }
      navigate('/patient');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} patient`,
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patient')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditMode ? 'Edit Patient' : 'Patient Registration'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? 'Update patient information' : 'Register a new patient'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PatientFormFields
                  form={form}
                  dropdowns={dropdowns}
                  onTitleChange={handleTitleChange}
                />

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => navigate('/patient')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" />{isEditMode ? 'Update Patient' : 'Save Patient'}</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientForm;
