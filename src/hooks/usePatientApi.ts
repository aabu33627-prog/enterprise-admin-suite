import { useState, useCallback } from 'react';
import { Patient, DropdownOption } from '@/types/patient';

const API_BASE_URL = 'http://localhost:5226/api';

// Mock data for development (when API is not available)
const mockPatients: Patient[] = [
  {
    id: 1,
    title: 'Mr.',
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Doe',
    gender: 'Male',
    mobileNumber: '9876543210',
    dateOfBirth: '1990-05-15',
    email: 'john.doe@email.com',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  {
    id: 2,
    title: 'Mrs.',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'Female',
    mobileNumber: '9876543211',
    dateOfBirth: '1985-08-22',
    email: 'jane.smith@email.com',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    city: 'Delhi',
    state: 'Delhi',
  },
  {
    id: 3,
    title: 'Ms.',
    firstName: 'Emily',
    lastName: 'Johnson',
    gender: 'Female',
    mobileNumber: '9876543212',
    dateOfBirth: '1995-12-10',
    email: 'emily.j@email.com',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    city: 'Bangalore',
    state: 'Karnataka',
  },
];

const mockDropdowns: Record<string, DropdownOption[]> = {
  title: [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Ms.' },
    { id: 4, name: 'Miss' },
    { id: 5, name: 'Dr.' },
    { id: 6, name: 'Master' },
    { id: 7, name: 'Baby' },
  ],
  bloodGroup: [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'AB+' },
    { id: 6, name: 'AB-' },
    { id: 7, name: 'O+' },
    { id: 8, name: 'O-' },
  ],
  relation: [
    { id: 1, name: 'Father' },
    { id: 2, name: 'Mother' },
    { id: 3, name: 'Spouse' },
    { id: 4, name: 'Sibling' },
    { id: 5, name: 'Child' },
    { id: 6, name: 'Other' },
  ],
  area: [
    { id: 1, name: 'Downtown' },
    { id: 2, name: 'Suburb' },
    { id: 3, name: 'Industrial' },
    { id: 4, name: 'Residential' },
  ],
  city: [
    { id: 1, name: 'Mumbai' },
    { id: 2, name: 'Delhi' },
    { id: 3, name: 'Bangalore' },
    { id: 4, name: 'Chennai' },
    { id: 5, name: 'Hyderabad' },
    { id: 6, name: 'Pune' },
  ],
  state: [
    { id: 1, name: 'Maharashtra' },
    { id: 2, name: 'Delhi' },
    { id: 3, name: 'Karnataka' },
    { id: 4, name: 'Tamil Nadu' },
    { id: 5, name: 'Telangana' },
    { id: 6, name: 'Gujarat' },
  ],
  consultant: [
    { id: 1, name: 'Dr. Sharma' },
    { id: 2, name: 'Dr. Patel' },
    { id: 3, name: 'Dr. Singh' },
    { id: 4, name: 'Dr. Kumar' },
  ],
  referredBy: [
    { id: 1, name: 'Self' },
    { id: 2, name: 'Hospital Referral' },
    { id: 3, name: 'Doctor Referral' },
    { id: 4, name: 'Insurance' },
  ],
};

export const usePatientApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async (): Promise<Patient[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('API not available, using mock data');
      return mockPatients;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientById = useCallback(async (id: number): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      return await response.json();
    } catch (err) {
      console.warn('API not available, using mock data');
      return mockPatients.find(p => p.id === id) || null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (patient: Patient): Promise<Patient> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      if (!response.ok) throw new Error('Failed to create patient');
      return await response.json();
    } catch (err) {
      console.warn('API not available, simulating create');
      const newPatient = { ...patient, id: Date.now() };
      mockPatients.push(newPatient);
      return newPatient;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: number, patient: Patient): Promise<Patient> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      return await response.json();
    } catch (err) {
      console.warn('API not available, simulating update');
      const index = mockPatients.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPatients[index] = { ...patient, id };
        return mockPatients[index];
      }
      throw new Error('Patient not found');
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePatient = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete patient');
    } catch (err) {
      console.warn('API not available, simulating delete');
      const index = mockPatients.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPatients.splice(index, 1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async (type: string): Promise<DropdownOption[]> => {
    try {
      const endpoint = type.charAt(0).toUpperCase() + type.slice(1);
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type}`);
      return await response.json();
    } catch (err) {
      console.warn(`API not available for ${type}, using mock data`);
      return mockDropdowns[type] || [];
    }
  }, []);

  return {
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    fetchDropdownData,
  };
};
