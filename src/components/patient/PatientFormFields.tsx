import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Camera, Upload } from 'lucide-react';
import { DropdownOption, GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, calculateAgeFromDOB, calculateDOBFromAge, parseAgeString } from '@/types/patient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

export interface PatientFormValues {
  code: string;
  Title_Id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  dateofbirth: string;
  age: string;
  mobile_number: string;
  email_id: string;
  bloodgroup: string;
  marital_status: string;
  attendent: string;
  attend_Relationship: string;
  Spouse_Number: string;
  address_line1: string;
  address_line2: string;
  zipCode: string;
  area_id: string;
  city_Id: string;
  state_Id: string;
  country_Id: string;
  consultant_id: string;
  referringDoctor_ID: string;
  patientCategory_ID: string;
  organization_ID: string;
  nextofkin: string;
  relation_ID: string;
  religion_ID: string;
  education: string;
  occupation: string;
  monthly_Income: string;
  adharno: string;
  healthid: string;
  otherid1: string;
  otherid2: string;
  otherid3: string;
  idCardType: string;
  staff_Number: string;
  remarks: string;
  passportno: string;
  passportdetails: string;
  passportexpiry: string;
  visano: string;
  visaexpiry: string;
  international: string;
  emergency: string;
  baby: string;
  patientimage: string;
  referralsource: string;
  patient_uhid: string;
  referredby_mobile_no: string;
  referredby_name: string;
}

interface PatientFormFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  dropdowns: {
    titles: DropdownOption[];
    bloodGroups: DropdownOption[];
    consultants: DropdownOption[];
    referredBy: DropdownOption[];
    areas: DropdownOption[];
    cities: DropdownOption[];
    states: DropdownOption[];
    relations: DropdownOption[];
    patientCategories: DropdownOption[];
  };
  onTitleChange: (titleId: string) => void;
}

export const PatientFormFields = ({ form, dropdowns, onTitleChange }: PatientFormFieldsProps) => {
  const [ageValue, setAgeValue] = useState<string>('');
  const [ageUnit, setAgeUnit] = useState<'years' | 'months' | 'days'>('years');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Handle DOB change -> calculate age
  const handleDOBChange = (dob: string) => {
    form.setValue('dateofbirth', dob);
    if (dob) {
      const { age, unit } = calculateAgeFromDOB(dob);
      setAgeValue(age.toString());
      setAgeUnit(unit);
      const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1);
      form.setValue('age', `${age} ${unitLabel}`);
    }
  };

  // Handle age change -> calculate DOB
  const handleAgeChange = (value: string, unit: 'years' | 'months' | 'days') => {
    setAgeValue(value);
    setAgeUnit(unit);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      const dob = calculateDOBFromAge(numValue, unit);
      form.setValue('dateofbirth', dob);
      const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1);
      form.setValue('age', `${numValue} ${unitLabel}`);
    }
  };

  // Initialize age from form value
  useEffect(() => {
    const ageStr = form.getValues('age');
    if (ageStr) {
      const parsed = parseAgeString(ageStr);
      if (parsed) {
        setAgeValue(parsed.age.toString());
        setAgeUnit(parsed.unit);
      }
    }
    const dob = form.getValues('dateofbirth');
    if (dob && !ageStr) {
      const { age, unit } = calculateAgeFromDOB(dob);
      setAgeValue(age.toString());
      setAgeUnit(unit);
    }
  }, [form]);

  // Handle image upload -> base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        form.setValue('patientimage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg');
        setImagePreview(base64);
        form.setValue('patientimage', base64);
      }
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="other">Other Details</TabsTrigger>
      </TabsList>

      {/* TAB 1 - Personal Details */}
      <TabsContent value="personal" className="space-y-6 mt-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="Title_Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onTitleChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.titles.map((title) => (
                        <SelectItem key={title.id} value={title.id.toString()}>{title.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input {...field} placeholder="Enter first name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter middle name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input {...field} placeholder="Enter last name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Gender <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(Auto-selected from Title)</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                    {GENDER_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.name} id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age */}
            <div className="space-y-2">
              <Label>Age</Label>
              <div className="flex gap-2">
                <Input type="number" value={ageValue} onChange={(e) => handleAgeChange(e.target.value, ageUnit)} placeholder="Age" className="w-20" min={0} />
                <Select value={ageUnit} onValueChange={(v: 'years' | 'months' | 'days') => handleAgeChange(ageValue, v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateofbirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" max={new Date().toISOString().split('T')[0]} onChange={(e) => handleDOBChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Blood Group */}
            <FormField
              control={form.control}
              name="bloodgroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.bloodGroups.map((bg) => (
                        <SelectItem key={bg.id} value={bg.name}>{bg.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marital Status */}
            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.name} id={`marital-${option.id}`} />
                          <Label htmlFor={`marital-${option.id}`} className="cursor-pointer text-sm">{option.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Attendant Name */}
            <FormField control={form.control} name="attendent" render={({ field }) => (
              <FormItem>
                <FormLabel>Attendant Name</FormLabel>
                <FormControl><Input {...field} placeholder="Enter attendant name" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Attendant Relationship */}
            <FormField control={form.control} name="attend_Relationship" render={({ field }) => (
              <FormItem>
                <FormLabel>Attendant Relationship</FormLabel>
                <FormControl><Input {...field} placeholder="Enter relationship" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Spouse Number */}
            <FormField control={form.control} name="Spouse_Number" render={({ field }) => (
              <FormItem>
                <FormLabel>Spouse Number</FormLabel>
                <FormControl><Input {...field} placeholder="Enter spouse number" maxLength={10} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="mobile_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input {...field} placeholder="Enter 10-digit mobile number" maxLength={10} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Id</FormLabel>
                <FormControl><Input {...field} type="email" placeholder="Enter email address" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="address_line1" render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1 <span className="text-destructive">*</span></FormLabel>
                <FormControl><Textarea {...field} placeholder="Enter address" rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="address_line2" render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl><Textarea {...field} placeholder="Enter address line 2" rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField control={form.control} name="zipCode" render={({ field }) => (
              <FormItem>
                <FormLabel>Zipcode <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input {...field} placeholder="Enter zipcode" maxLength={10} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="area_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>{area.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="city_Id" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="state_Id" render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>{state.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
      </TabsContent>

      {/* TAB 2 - Other Details */}
      <TabsContent value="other" className="space-y-6 mt-6">
        {/* Identification Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="patientCategory_ID" render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.patientCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="healthid" render={({ field }) => (
              <FormItem>
                <FormLabel>Health ID</FormLabel>
                <FormControl><Input {...field} placeholder="Enter 14-digit Health ID" maxLength={14} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="adharno" render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar Number</FormLabel>
                <FormControl><Input {...field} placeholder="Enter 12-digit Aadhar" maxLength={12} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="otherid1" render={({ field }) => (
              <FormItem>
                <FormLabel>Other ID 1</FormLabel>
                <FormControl><Input {...field} placeholder="Other ID 1" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="otherid2" render={({ field }) => (
              <FormItem>
                <FormLabel>Other ID 2</FormLabel>
                <FormControl><Input {...field} placeholder="Other ID 2" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="otherid3" render={({ field }) => (
              <FormItem>
                <FormLabel>Other ID 3</FormLabel>
                <FormControl><Input {...field} placeholder="Other ID 3" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="idCardType" render={({ field }) => (
              <FormItem>
                <FormLabel>ID Card Type</FormLabel>
                <FormControl><Input {...field} placeholder="Enter ID card type" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="staff_Number" render={({ field }) => (
              <FormItem>
                <FormLabel>Staff/IP No</FormLabel>
                <FormControl><Input {...field} placeholder="Max 20 characters" maxLength={20} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Patient Image */}
            <div className="space-y-2">
              <Label>Patient Image</Label>
              <div className="flex gap-2 flex-wrap">
                <Button type="button" variant="outline" onClick={openCamera} size="sm">
                  <Camera className="h-4 w-4 mr-2" />Camera
                </Button>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} size="sm">
                  <Upload className="h-4 w-4 mr-2" />Upload
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Patient" className="w-24 h-24 object-cover rounded-md border" />
                </div>
              )}
              {isCameraOpen && (
                <div className="mt-2 space-y-2">
                  <video ref={videoRef} autoPlay className="w-48 h-36 rounded-md border" />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={capturePhoto}>Capture</Button>
                    <Button type="button" variant="outline" size="sm" onClick={closeCamera}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="nextofkin" render={({ field }) => (
              <FormItem>
                <FormLabel>Next of Kin Name</FormLabel>
                <FormControl><Input {...field} placeholder="Enter next of kin name" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="relation_ID" render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship with Kin</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.relations.map((rel) => (
                      <SelectItem key={rel.id} value={rel.id.toString()}>{rel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="education" render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl><Input {...field} placeholder="Enter education" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="occupation" render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl><Input {...field} placeholder="Enter occupation" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="monthly_Income" render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income</FormLabel>
                <FormControl><Input {...field} type="number" placeholder="Enter monthly income" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="consultant_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Consultant</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select consultant" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.consultants.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="referringDoctor_ID" render={({ field }) => (
              <FormItem>
                <FormLabel>Referred By</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select referral source" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dropdowns.referredBy.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="organization_ID" render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl><Input {...field} placeholder="Organization ID" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* International Patient Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">International Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="passportno" render={({ field }) => (
              <FormItem>
                <FormLabel>Passport No</FormLabel>
                <FormControl><Input {...field} placeholder="Enter passport number" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="passportdetails" render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Details</FormLabel>
                <FormControl><Input {...field} placeholder="Enter passport details" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="passportexpiry" render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Expiry</FormLabel>
                <FormControl><Input {...field} type="date" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="visano" render={({ field }) => (
              <FormItem>
                <FormLabel>Visa No</FormLabel>
                <FormControl><Input {...field} placeholder="Enter visa number" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="visaexpiry" render={({ field }) => (
              <FormItem>
                <FormLabel>Visa Expiry</FormLabel>
                <FormControl><Input {...field} type="date" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="international" render={({ field }) => (
              <FormItem>
                <FormLabel>International Patient</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="emergency" render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="baby" render={({ field }) => (
              <FormItem>
                <FormLabel>Baby</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Remarks</h3>
          <FormField control={form.control} name="remarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl><Textarea {...field} placeholder="Enter any remarks" rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
