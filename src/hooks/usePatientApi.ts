import { useState, useCallback } from 'react';
import { Patient, DropdownOption } from '@/types/patient';

const API_BASE_URL = 'http://localhost:5226/api';
const ADMIN_API_URL = 'http://localhost:5226/api/admin';

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
      console.warn('API not available, returning empty list');
      setError('Unable to fetch patients');
      return [];
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
      console.warn('API not available');
      setError('Unable to fetch patient');
      return null;
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
      console.error('Failed to create patient:', err);
      throw new Error('Failed to create patient');
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
      console.error('Failed to update patient:', err);
      throw new Error('Failed to update patient');
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
      console.error('Failed to delete patient:', err);
      throw new Error('Failed to delete patient');
    } finally {
      setLoading(false);
    }
  }, []);

  // Dropdown data fetchers - calls admin API endpoints
  const fetchDropdownData = useCallback(async (type: string): Promise<DropdownOption[]> => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/${type}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type}`);
      return await response.json();
    } catch (err) {
      console.warn(`API not available for ${type}`);
      return [];
    }
  }, []);

  const fetchTitles = useCallback(() => fetchDropdownData('title'), [fetchDropdownData]);
  const fetchBloodGroups = useCallback(() => fetchDropdownData('bloodgroup'), [fetchDropdownData]);
  const fetchAreas = useCallback(() => fetchDropdownData('area'), [fetchDropdownData]);
  const fetchCities = useCallback(() => fetchDropdownData('city'), [fetchDropdownData]);
  const fetchStates = useCallback(() => fetchDropdownData('state'), [fetchDropdownData]);
  const fetchRelations = useCallback(() => fetchDropdownData('relation'), [fetchDropdownData]);
  const fetchConsultants = useCallback(() => fetchDropdownData('consultant'), [fetchDropdownData]);
  const fetchReferredBy = useCallback(() => fetchDropdownData('referredby'), [fetchDropdownData]);
  const fetchPatientCategories = useCallback(() => fetchDropdownData('patientcategory'), [fetchDropdownData]);

  return {
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    fetchDropdownData,
    fetchTitles,
    fetchBloodGroups,
    fetchAreas,
    fetchCities,
    fetchStates,
    fetchRelations,
    fetchConsultants,
    fetchReferredBy,
    fetchPatientCategories,
  };
};
