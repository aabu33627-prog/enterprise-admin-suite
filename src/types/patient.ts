export interface Patient {
  id?: number;
  title: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  gender: string;
  mobileNumber: string;
  dateOfBirth?: string;
  email?: string;
  bloodGroup?: string;
  maritalStatus: string;
  consultant?: string;
  referredBy?: string;
  patientImage?: string;
  healthId?: string;
  aadharNumber?: string;
  attendantName?: string;
  attendantPhone?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  address?: string;
  zipcode?: string;
  area?: string;
  city?: string;
  state?: string;
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
  'Mr.': 'Male',
  'Mrs.': 'Female',
  'Ms.': 'Female',
  'Miss': 'Female',
  'Dr.': 'Other',
  'Master': 'Male',
  'Baby': 'Other',
};

export const MARITAL_STATUS_OPTIONS = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'Married' },
  { id: 3, name: 'Divorced' },
  { id: 4, name: 'Widowed' },
];
