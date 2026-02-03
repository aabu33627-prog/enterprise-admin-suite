export interface Patient {
  id?: number;
  title: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  gender: string;
  mobileNumber: string;
  dateOfBirth?: string;
  age?: number;
  ageUnit?: 'years' | 'months' | 'days';
  email?: string;
  bloodGroup?: string;
  maritalStatus: string;
  attendantName?: string;
  attendantPhone?: string;
  address?: string;
  zipcode?: string;
  area?: string;
  city?: string;
  state?: string;
  patientCategory?: string;
  healthId?: string;
  aadharNumber?: string;
  staffIpNo?: string;
  oldRegNo?: string;
  patientImage?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelation?: string;
  consultant?: string;
  referredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DropdownOption {
  id: number;
  name: string;
  value?: string;
}

export interface PatientFilters {
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const GENDER_MAP: Record<string, string> = {
  'Mr': 'Male',
  'Mr.': 'Male',
  'Mrs': 'Female',
  'Mrs.': 'Female',
  'Ms': 'Female',
  'Ms.': 'Female',
  'Miss': 'Female',
  'Master': 'Male',
  'Baby': 'Other',
  'Dr': 'Other',
  'Dr.': 'Other',
  'Others': 'Other',
};

export const MARITAL_STATUS_OPTIONS = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'Married' },
  { id: 3, name: 'Divorced' },
  { id: 4, name: 'Widowed' },
];

export const GENDER_OPTIONS = [
  { id: 'M', name: 'Male', label: 'M - Male' },
  { id: 'F', name: 'Female', label: 'F - Female' },
  { id: 'O', name: 'Other', label: 'O - Others' },
];

// Helper function to calculate age from DOB
export const calculateAgeFromDOB = (dob: string): { age: number; unit: 'years' | 'months' | 'days' } => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return { age: years, unit: 'years' };
  } else if (months > 0) {
    return { age: months, unit: 'months' };
  } else {
    return { age: Math.max(days, 1), unit: 'days' };
  }
};

// Helper function to calculate DOB from age
export const calculateDOBFromAge = (age: number, unit: 'years' | 'months' | 'days'): string => {
  const today = new Date();
  let dob: Date;

  switch (unit) {
    case 'years':
      dob = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
      break;
    case 'months':
      dob = new Date(today.getFullYear(), today.getMonth() - age, today.getDate());
      break;
    case 'days':
      dob = new Date(today.getTime() - age * 24 * 60 * 60 * 1000);
      break;
    default:
      dob = today;
  }

  return dob.toISOString().split('T')[0];
};
