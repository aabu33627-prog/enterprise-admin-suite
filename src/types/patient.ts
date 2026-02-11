// ===== Backend DTO Interfaces (match C# models exactly) =====

/** Response from GET /api/patient?hospitalId=1 */
export interface PatientListDTO {
  patient_ID: number;
  code: string;
  title_Name: string;
  first_name: string;
  last_Name: string;
  gender: string;
  age: string;
  mobile_number: string;
  is_Active: number;
  createdBy: string;
  referringdoctor?: string | null;
  organization_name?: string | null;
}

/** Response from GET /api/patient/{id}?hospitalId=1 */
export interface PatientListByIdDTO {
  patient_ID: number;
  code: string;
  title_Id: number;
  first_Name: string;
  middle_name: string | null;
  last_Name: string;
  gender: string;
  dateOfBirth: string | null;
  age: string;
  consultant_id: number;
  referringDoctor_ID: number;
  organization_ID: number;
  patientCategory_ID: number;
  nextOfKin: string | null;
  address_line1: string;
  address_line2: string | null;
  area_Id: number;
  city_Id: number;
  state_Id: number;
  country_Id: number;
  zipCode: string;
  mobile_number: string;
  fax_number: string | null;
  email_id: string;
  website: string | null;
  staff_Number: string | null;
  reg_Date: string | null;
  validate_Date: string | null;
  relation_ID: number;
  religion_ID: number;
  education: string | null;
  occupation: string | null;
  monthly_Income: number | null;
  attendent: string | null;
  attend_Relationship: string | null;
  marital_status: string;
  hospital_id: number;
  created_by: number;
  created_date: string | null;
  updated_by: number;
  updated_date: string | null;
  blood_group: string | null;
  oldRegNo: string | null;
  is_Active: number;
  mother_UHID: string | null;
  passportNo: string | null;
  passportDetails: string | null;
  visaNo: string | null;
  visaExpiryDate: string | null;
  is_international: string | null;
  is_emergency: string | null;
  is_baby: string | null;
  passportExpiry: string | null;
  regFeeStatus: number;
  referralSource: number;
  spouse_Number: string | null;
  external_RefNo: string | null;
  adharNo: string | null;
  healthID: string | null;
  otherID1: string | null;
  otherID2: string | null;
  otherID3: string | null;
  remarks: string | null;
  identityCardType: string | null;
  tpaInsuranceID: number;
  previousvisiteddate: string | null;
  lastvisiteddate: string | null;
}

/** Payload for POST /api/patient */
export interface PatientCreateDTO {
  code: string;
  Title_Id: number | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender: string;
  dateofbirth: string;
  age: string;
  consultant_id?: number | null;
  referringDoctor_ID?: number | null;
  patientCategory_ID?: number | null;
  organization_ID?: number | null;
  nextofkin?: string | null;
  address_line1: string;
  address_line2?: string | null;
  area_id?: string | null;
  city_Id?: number | null;
  state_Id?: number | null;
  country_Id?: number | null;
  zipCode: string;
  mobile_number: string;
  fax_number?: string | null;
  email_id: string;
  staff_Number?: string | null;
  reg_Date?: string | null;
  validate_Date: string;
  relation_ID?: number | null;
  religion_ID?: number | null;
  education?: string | null;
  occupation?: string | null;
  monthly_Income?: number | null;
  attendent?: string | null;
  attend_Relationship?: string | null;
  marital_status: string;
  hospital_id?: number | null;
  created_by?: number | null;
  bloodgroup?: string | null;
  patientimage?: string | null;
  provision?: string | null;
  motheruhid?: string | null;
  passportno?: string | null;
  passportdetails?: string | null;
  visano?: string | null;
  visaexpiry?: string | null;
  international?: string | null;
  baby?: string | null;
  emergency?: string | null;
  passportexpiry?: string | null;
  referralsource: number;
  Spouse_Number?: string | null;
  patient_uhid: string;
  referredby_mobile_no?: string | null;
  referredby_name?: string | null;
  adharno: string;
  healthid?: string | null;
  otherid1?: string | null;
  otherid2?: string | null;
  otherid3?: string | null;
  remarks?: string | null;
  idCardType?: string | null;
  ExternalRefNo?: string | null;
  TPAInsuranceId?: number | null;
}

/** Payload for PUT /api/patient */
export interface PatientUpdateDTO {
  code: string;
  spousecode?: string | null;
  Title_Id: number | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender: string;
  dateofbirth: string;
  age: string;
  consultant_id?: number | null;
  referringDoctor_ID?: number | null;
  patientCategory_ID?: number | null;
  organization_ID?: number | null;
  TPAInsurance_ID?: number | null;
  nextofkin?: string | null;
  address_line1: string;
  address_line2?: string | null;
  area_id?: string | null;
  city_Id?: number | null;
  state_Id?: number | null;
  country_Id?: number | null;
  zipCode: string;
  mobile_number: string;
  fax_number?: string | null;
  email_id: string;
  staff_Number?: string | null;
  reg_Date?: string | null;
  validate_Date?: string | null;
  relation_ID?: number | null;
  religion_ID?: number | null;
  education?: string | null;
  occupation?: string | null;
  monthly_Income?: number | null;
  attendent?: string | null;
  marital_status: string;
  attend_Relationship?: string | null;
  hospital_id: number;
  updated_by?: number | null;
  bloodgroup?: string | null;
  provision?: string | null;
  Is_Active: number;
  motheruhid?: string | null;
  passportno?: string | null;
  passportdetails?: string | null;
  visano?: string | null;
  visaexpiry?: string | null;
  international?: string | null;
  baby?: string | null;
  emergency?: string | null;
  passportexpiry?: string | null;
  referralsource?: number | null;
  patient_uhid: string;
  referredby_mobile_no?: string | null;
  referredby_name?: string | null;
  adharno: string;
  healthid?: string | null;
  otherid1?: string | null;
  otherid2?: string | null;
  otherid3?: string | null;
  remarks?: string | null;
  idCardType?: string | null;
}

/** Payload for DELETE /api/patient */
export interface PatientDeleteDTO {
  patient_ID: string;
  hospital_id: number;
  code: string;
}

// ===== Dropdown & UI helpers =====

export interface DropdownOption {
  id: number;
  name: string;
  value?: string;
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

// Format age string for API (e.g. "25 Years", "3 Months", "10 Days")
export const formatAgeString = (age: number, unit: 'years' | 'months' | 'days'): string => {
  const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1);
  return `${age} ${unitLabel}`;
};

// Parse age string from API (e.g. "25 Years" -> { age: 25, unit: 'years' })
export const parseAgeString = (ageStr: string): { age: number; unit: 'years' | 'months' | 'days' } | null => {
  if (!ageStr) return null;
  const match = ageStr.match(/^(\d+)\s*(years?|months?|days?)$/i);
  if (!match) return null;
  const age = parseInt(match[1]);
  const rawUnit = match[2].toLowerCase();
  let unit: 'years' | 'months' | 'days' = 'years';
  if (rawUnit.startsWith('month')) unit = 'months';
  else if (rawUnit.startsWith('day')) unit = 'days';
  return { age, unit };
};
