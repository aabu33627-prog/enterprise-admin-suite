import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Camera, Upload } from 'lucide-react';
import { Patient, DropdownOption, GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, calculateAgeFromDOB, calculateDOBFromAge } from '@/types/patient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

interface PatientFormFieldsProps {
  form: UseFormReturn<Patient>;
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
  onTitleChange: (value: string) => void;
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
    form.setValue('dateOfBirth', dob);
    if (dob) {
      const { age, unit } = calculateAgeFromDOB(dob);
      setAgeValue(age.toString());
      setAgeUnit(unit);
      form.setValue('age', age);
      form.setValue('ageUnit', unit);
    }
  };

  // Handle age change -> calculate DOB
  const handleAgeChange = (value: string, unit: 'years' | 'months' | 'days') => {
    setAgeValue(value);
    setAgeUnit(unit);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      const dob = calculateDOBFromAge(numValue, unit);
      form.setValue('dateOfBirth', dob);
      form.setValue('age', numValue);
      form.setValue('ageUnit', unit);
    }
  };

  // Initialize age from DOB if exists
  useEffect(() => {
    const dob = form.getValues('dateOfBirth');
    if (dob) {
      const { age, unit } = calculateAgeFromDOB(dob);
      setAgeValue(age.toString());
      setAgeUnit(unit);
    }
  }, [form]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        form.setValue('patientImage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle camera capture
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
        form.setValue('patientImage', base64);
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onTitleChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.titles.map((title) => (
                        <SelectItem key={title.id} value={title.name}>
                          {title.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter middle name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gender - Radio Buttons (Auto-selected from Title) */}
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
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.name} id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Field with Unit Selection */}
            <div className="space-y-2">
              <Label>Age</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={ageValue}
                  onChange={(e) => handleAgeChange(e.target.value, ageUnit)}
                  placeholder="Age"
                  className="w-20"
                  min={0}
                />
                <Select value={ageUnit} onValueChange={(v: 'years' | 'months' | 'days') => handleAgeChange(ageValue, v)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleDOBChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.bloodGroups.map((bg) => (
                        <SelectItem key={bg.id} value={bg.name}>
                          {bg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marital Status - Radio Buttons */}
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.name} id={`marital-${option.id}`} />
                          <Label htmlFor={`marital-${option.id}`} className="cursor-pointer text-sm">
                            {option.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="attendantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendant Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter attendant name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mobile Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 10-digit mobile number" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Id</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendantPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendant Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 10-digit phone" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>
                    Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter full address" rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Zipcode <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter zipcode" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Area <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.areas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    State <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.states.map((state) => (
                        <SelectItem key={state.id} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </TabsContent>

      {/* TAB 2 - Other Details */}
      <TabsContent value="other" className="space-y-6 mt-6">
        {/* Identification Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="patientCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.patientCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 14-digit Health ID" maxLength={14} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aadharNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 12-digit Aadhar" maxLength={12} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staffIpNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff/IP No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Max 20 characters" maxLength={20} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oldRegNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old RegNo / Staff No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Max 20 characters" maxLength={20} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Image */}
            <div className="space-y-2">
              <Label>Patient Image</Label>
              <div className="flex gap-2 flex-wrap">
                <Button type="button" variant="outline" onClick={openCamera} size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
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
            <FormField
              control={form.control}
              name="nextOfKinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter next of kin name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextOfKinPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter 10-digit phone" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextOfKinRelation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship with Kin</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.relations.map((rel) => (
                        <SelectItem key={rel.id} value={rel.name}>
                          {rel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Other Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Other Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="consultant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultant</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.consultants.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referred By</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select referral source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdowns.referredBy.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
