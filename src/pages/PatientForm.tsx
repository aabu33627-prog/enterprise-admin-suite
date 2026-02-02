import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Patient, DropdownOption, GENDER_MAP } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientFormFields } from '@/components/patient/PatientFormFields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const patientSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[a-zA-Z\s]+$/, 'First name cannot contain numbers'),
  middleName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, 'Middle name cannot contain numbers')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, 'Last name cannot contain numbers')
    .optional()
    .or(z.literal('')),
  gender: z.string().optional(),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => !val || new Date(val) < new Date(),
      'Date of birth must be less than today'
    ),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  consultant: z.string().optional(),
  referredBy: z.string().optional(),
  patientImage: z.string().optional(),
  healthId: z
    .string()
    .regex(/^(\d{14})?$/, 'Health ID must be exactly 14 digits')
    .optional()
    .or(z.literal('')),
  aadharNumber: z
    .string()
    .regex(/^(\d{12})?$/, 'Aadhar must be exactly 12 digits')
    .optional()
    .or(z.literal('')),
  attendantName: z
    .string()
    .regex(/^[a-zA-Z\s]*$/, 'Attendant name cannot contain numbers')
    .optional()
    .or(z.literal('')),
  attendantPhone: z
    .string()
    .regex(/^(\d{10})?$/, 'Phone must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  nextOfKinName: z.string().optional(),
  nextOfKinPhone: z
    .string()
    .regex(/^(\d{10})?$/, 'Phone must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { fetchPatientById, createPatient, updatePatient, fetchDropdownData, loading } =
    usePatientApi();

  const isEditMode = !!id;

  const [dropdowns, setDropdowns] = useState({
    titles: [] as DropdownOption[],
    bloodGroups: [] as DropdownOption[],
    consultants: [] as DropdownOption[],
    referredBy: [] as DropdownOption[],
    areas: [] as DropdownOption[],
    cities: [] as DropdownOption[],
    states: [] as DropdownOption[],
  });

  const form = useForm<Patient>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      mobileNumber: '',
      dateOfBirth: '',
      email: '',
      bloodGroup: '',
      maritalStatus: 'Single',
      consultant: '',
      referredBy: '',
      patientImage: '',
      healthId: '',
      aadharNumber: '',
      attendantName: '',
      attendantPhone: '',
      nextOfKinName: '',
      nextOfKinPhone: '',
      address: '',
      zipcode: '',
      area: '',
      city: '',
      state: '',
    },
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      const [titles, bloodGroups, consultants, referredBy, areas, cities, states] =
        await Promise.all([
          fetchDropdownData('title'),
          fetchDropdownData('bloodGroup'),
          fetchDropdownData('consultant'),
          fetchDropdownData('referredBy'),
          fetchDropdownData('area'),
          fetchDropdownData('city'),
          fetchDropdownData('state'),
        ]);
      setDropdowns({ titles, bloodGroups, consultants, referredBy, areas, cities, states });
    };

    loadDropdowns();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (isEditMode && id) {
      const loadPatient = async () => {
        const patient = await fetchPatientById(parseInt(id));
        if (patient) {
          form.reset(patient);
        }
      };
      loadPatient();
    }
  }, [id, isEditMode, fetchPatientById, form]);

  const handleTitleChange = (title: string) => {
    const gender = GENDER_MAP[title] || '';
    form.setValue('gender', gender);
  };

  const onSubmit = async (data: Patient) => {
    try {
      if (isEditMode && id) {
        await updatePatient(parseInt(id), data);
        toast({
          title: 'Success',
          description: 'Patient updated successfully',
        });
      } else {
        await createPatient(data);
        toast({
          title: 'Success',
          description: 'Patient registered successfully',
        });
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
        {/* Page Header */}
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

        {/* Form Card */}
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

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/patient')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditMode ? 'Update Patient' : 'Save Patient'}
                      </>
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
